import { useCallback, useMemo, useRef, useState } from "react";
import Icon from "../Icon/Icon.jsx";
import LiveBets from "./LiveBets.jsx";
import Volume from "./Volume.jsx";
import OrderBook from "./OrderBook.jsx";
import { useLiveGraph } from "./useLiveGraph.js";
import flagSwitzerland from "../../assets/flag-switzerland.svg";
import flagColombia from "../../assets/flag-colombia.svg";
import styles from "./MarketCard.module.css";

/* Map a flash direction to its pill modifier class. */
const flashClass = (dir) =>
  dir === "up" ? styles.flashUp : dir === "down" ? styles.flashDown : "";

/* Percentage y-axis. The visual scale runs a little beyond 0–60% so the
   lines have headroom to swing without hitting the frame edge. */
const AXIS = [60, 48, 36, 24, 12, 0];
const PLOT_TOP = 28;
const PLOT_BOTTOM = 208;
const SCALE_MAX = 66; // value mapped to the top of the plot
const SCALE_MIN = -3; // value mapped to the bottom of the plot
const yFor = (v) =>
  PLOT_TOP +
  ((SCALE_MAX - v) / (SCALE_MAX - SCALE_MIN)) * (PLOT_BOTTOM - PLOT_TOP);

/* Data area: lines occupy the left part of the viewBox, leaving room on the
   right for the current-value labels and the y-axis. */
const VB_W = 600;
const DATA_X0 = 4;
const DATA_W = 452;

/* Small deterministic PRNG (mulberry32) so a given seed always yields the
   same walk — the graph stays stable across the frequent price re-renders. */
function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* A stepped odds-history path (flat segments + jumps, like a real order-book
   mid over time). Walks a seeded, mean-reverting series from a historical
   start (endVal + drift) and lands exactly on endVal at the right edge.
   `steps` + `vol` control how busy the line is for the chosen timeframe. */
function stepPath(endVal, seed, steps, vol, meanRev, drift) {
  const rng = makeRng(seed);
  const clampV = (v) => Math.max(0.5, Math.min(64, v));
  const vals = [];
  let v = endVal + drift;
  for (let i = 0; i <= steps; i++) {
    const p = i / steps;
    const target = endVal + drift * (1 - p); // glide toward the current price
    // Occasional bigger "order" jumps on top of the steady jitter.
    const jump = rng() < 0.12 ? (rng() - 0.5) * vol * 2.2 : 0;
    v = clampV(v + (target - v) * meanRev + (rng() - 0.5) * vol + jump);
    vals.push(v);
  }
  vals[steps] = endVal;

  let d = `M${DATA_X0},${yFor(vals[0]).toFixed(1)}`;
  for (let i = 1; i <= steps; i++) {
    const x = (DATA_X0 + (i / steps) * DATA_W).toFixed(1);
    d += ` H${x} V${yFor(vals[i]).toFixed(1)}`; // step: horizontal, then vertical
  }
  return d;
}

/* Stepped path from a live rolling series of % values (drives the 60M view). */
function pathFromValues(vals) {
  const n = vals.length - 1;
  let d = `M${DATA_X0},${yFor(vals[0]).toFixed(1)}`;
  for (let i = 1; i <= n; i++) {
    const x = (DATA_X0 + (i / n) * DATA_W).toFixed(1);
    d += ` H${x} V${yFor(vals[i]).toFixed(1)}`;
  }
  return d;
}

/* Each timeframe changes the graph shape and its x-axis labels. Shorter
   windows are busy with micro-movement; ALL zooms out to a calmer line. */
const TIMEFRAMES = [
  {
    // Zoomed into the last 60 minutes: few, wide, high-amplitude micro-steps.
    id: "60M",
    ticks: [
      { label: "9:00PM", pos: 4 },
      { label: "9:20PM", pos: 28 },
      { label: "9:40PM", pos: 52 },
      { label: "10:00PM", pos: 75 },
    ],
    steps: 44,
    vol: 3.2,
    meanRev: 0.09,
    drift: { away: 2, home: -2, draw: 1 },
  },
  {
    id: "150M",
    ticks: [
      { label: "7:30PM", pos: 4 },
      { label: "8:20PM", pos: 28 },
      { label: "9:10PM", pos: 52 },
      { label: "10:00PM", pos: 75 },
    ],
    steps: 58,
    vol: 2.0,
    meanRev: 0.11,
    drift: { away: 4, home: -3, draw: -1 },
  },
  {
    id: "1D",
    ticks: [
      { label: "4AM", pos: 4 },
      { label: "10AM", pos: 28 },
      { label: "4PM", pos: 52 },
      { label: "10PM", pos: 75 },
    ],
    steps: 68,
    vol: 1.0,
    meanRev: 0.13,
    drift: { away: 7, home: -5, draw: -2 },
  },
  {
    id: "ALL",
    ticks: [
      { label: "Jul 3", pos: 8 },
      { label: "Jul 5", pos: 42 },
      { label: "Jul 7", pos: 74 },
    ],
    steps: 80,
    vol: 0.4,
    meanRev: 0.16,
    drift: { away: 10, home: -7, draw: -3 },
  },
];

/**
 * Market card — the single unified card from the reference:
 * team title + watermark, a volume/kickoff/venue meta row with the
 * Graph / Order Book toggle, then price rows (with sliders) beside the
 * price-movement graph. All static placeholder content — no behaviour.
 */
export default function MarketCard({ priceRows, onOpenTicket }) {
  const [view, setView] = useState("graph"); // "graph" | "orderbook"
  const [timeframe, setTimeframe] = useState("60M");
  const tf = TIMEFRAMES.find((t) => t.id === timeframe);

  // Running total volume. New bets accumulate silently; once they add up to
  // more than £5k, the displayed total jumps and counts up to compensate.
  const [volume, setVolume] = useState(404370);
  const pendingRef = useRef(0);
  const handleBet = useCallback((amount) => {
    pendingRef.current += amount;
    if (pendingRef.current >= 5000) {
      const bump = pendingRef.current;
      pendingRef.current = 0;
      setVolume((v) => v + bump);
    }
  }, []);

  const isLive = timeframe === "60M";
  // Live rolling series for 60M; longer windows use a stable seeded path.
  const live = useLiveGraph(isLive);
  const staticPaths = useMemo(
    () => ({
      away: stepPath(59, 101, tf.steps, tf.vol, tf.meanRev, tf.drift.away),
      home: stepPath(28, 202, tf.steps, tf.vol, tf.meanRev, tf.drift.home),
      draw: stepPath(13, 303, tf.steps, tf.vol, tf.meanRev, tf.drift.draw),
    }),
    [tf]
  );

  const paths = isLive
    ? {
        away: pathFromValues(live.away),
        home: pathFromValues(live.home),
        draw: pathFromValues(live.draw),
      }
    : staticPaths;

  const ends = isLive
    ? {
        away: live.away[live.away.length - 1],
        home: live.home[live.home.length - 1],
        draw: live.draw[live.draw.length - 1],
      }
    : { away: 59, home: 28, draw: 13 };

  return (
    <section className={styles.card}>
      {/* ---- Header: teams stacked + watermark ---- */}
      <div className={styles.header}>
        <ul className={styles.teams}>
          <li className={styles.team}>
            <img
              className={styles.flag}
              src={flagSwitzerland}
              alt=""
              aria-hidden="true"
            />
            <span className={styles.teamName}>Switzerland</span>
          </li>
          <li className={styles.team}>
            <img
              className={styles.flag}
              src={flagColombia}
              alt=""
              aria-hidden="true"
            />
            <span className={styles.teamName}>Colombia</span>
          </li>
        </ul>
        <span className={styles.watermark} aria-hidden="true">
          <span className={styles.watermarkMark}>S</span>markets
        </span>
      </div>

      {/* ---- Meta row + view toggle ---- */}
      <div className={styles.metaRow}>
        <div className={styles.meta}>
          <span className={`${styles.metaItem} ${styles.metaVolume}`}>
            <Volume value={volume} />
          </span>
          <span className={`${styles.metaItem} ${styles.metaMuted}`}>
            <Icon name="clock" size={18} className={styles.metaIcon} />
            Today at 22:00
          </span>
          <span className={`${styles.metaItem} ${styles.metaMuted}`}>
            <Icon name="pin" size={18} className={styles.metaIcon} />
            BC Place, Vancouver
          </span>
        </div>

        <div className={styles.toggle} role="group" aria-label="Market view">
          <button
            type="button"
            onClick={() => setView("graph")}
            className={`${styles.toggleBtn} ${
              view === "graph" ? styles.toggleActive : ""
            }`}
          >
            <Icon name="graph" size={16} /> Graph
          </button>
          <button
            type="button"
            onClick={() => setView("orderbook")}
            className={`${styles.toggleBtn} ${
              view === "orderbook" ? styles.toggleActive : ""
            }`}
          >
            <Icon name="orderbook" size={16} /> Order Book
          </button>
        </div>
      </div>

      {/* ---- Body: price rows (left) + graph or order book (right) ---- */}
      <div className={styles.body}>
        {/* Price rows */}
        <div className={styles.priceCol}>
          {/* Buy / Sell column titles, aligned over the pill columns */}
          <div className={styles.priceHead}>
            <span className={styles.priceHeadLabel}>Buy</span>
            <span className={styles.priceHeadLabel}>Sell</span>
          </div>

          {priceRows.map((row) => (
            <div key={row.key} className={styles.priceRow}>
              <div className={styles.priceTop}>
                <span className={styles.outcome}>{row.name}</span>
                <div className={styles.pills}>
                  <button
                    type="button"
                    onClick={() => onOpenTicket(row.key, "buy")}
                    className={`${styles.pill} ${styles.pillBuy} ${flashClass(
                      row.buyFlash
                    )}`}
                  >
                    {row.buyStr}
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenTicket(row.key, "sell")}
                    className={`${styles.pill} ${styles.pillSell} ${flashClass(
                      row.sellFlash
                    )}`}
                  >
                    {row.sellStr}
                  </button>
                </div>
              </div>
              {/* Slider tracks the outcome's implied probability as it moves */}
              <div className={styles.slider}>
                <div className={styles.sliderTrack} />
                <div
                  className={styles.sliderFill}
                  style={{ width: `${row.pos}%` }}
                />
                <div
                  className={styles.sliderHandle}
                  style={{ left: `${row.pos}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right side: price-movement graph, or the order book */}
        {view === "graph" ? (
          <div className={styles.graphCol}>
          <div className={styles.graphPlot}>
            {/* Lines + gridlines — the only stretchable layer */}
            <svg
              className={styles.graphSvg}
              viewBox="0 0 600 240"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {AXIS.map((v) => (
                <line
                  key={v}
                  x1="0"
                  x2={VB_W}
                  y1={yFor(v)}
                  y2={yFor(v)}
                  className={styles.grid}
                />
              ))}
              {/* Colombia (green), Switzerland (blue), Draw (purple) */}
              <path className={styles.lineAway} d={paths.away} />
              <path className={styles.lineHome} d={paths.home} />
              <path className={styles.lineDraw} d={paths.draw} />
            </svg>

            {/* Live bets being placed — float up the left column and fade */}
            <LiveBets onBet={handleBet} />

            {/* End-of-line percentage labels */}
            <span
              className={`${styles.pct} ${styles.pctAway}`}
              style={{ top: yFor(ends.away) }}
            >
              {ends.away.toFixed(1)}%
            </span>
            <span
              className={`${styles.pct} ${styles.pctHome}`}
              style={{ top: yFor(ends.home) }}
            >
              {ends.home.toFixed(1)}%
            </span>
            <span
              className={`${styles.pct} ${styles.pctDraw}`}
              style={{ top: yFor(ends.draw) }}
            >
              {ends.draw.toFixed(1)}%
            </span>

            {/* Right percentage y-axis */}
            <div className={styles.yAxis}>
              {AXIS.map((v) => (
                <span
                  key={v}
                  className={styles.yTick}
                  style={{ top: yFor(v) }}
                >
                  {v}%
                </span>
              ))}
            </div>

            {/* X-axis time labels — change with the selected timeframe */}
            {tf.ticks.map((t) => (
              <span
                key={t.label}
                className={styles.xTick}
                style={{ left: `${t.pos}%` }}
              >
                {t.label}
              </span>
            ))}
          </div>

          {/* Timeframe pills + legend */}
          <div className={styles.graphControls}>
            <div className={styles.timeframes}>
              {TIMEFRAMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTimeframe(t.id)}
                  className={`${styles.tf} ${
                    timeframe === t.id ? styles.tfActive : ""
                  }`}
                >
                  {t.id}
                </button>
              ))}
            </div>
            <div className={styles.legend}>
              <span className={styles.legendItem}>
                <span className={`${styles.dot} ${styles.dotAway}`} />
                Colombia
              </span>
              <span className={styles.legendItem}>
                <span className={`${styles.dot} ${styles.dotDraw}`} />
                Draw
              </span>
              <span className={styles.legendItem}>
                <span className={`${styles.dot} ${styles.dotHome}`} />
                Switzerland
              </span>
              <Icon name="swap" size={16} className={styles.legendIcon} />
            </div>
          </div>
        </div>
        ) : (
          <OrderBook priceRows={priceRows} />
        )}
      </div>
    </section>
  );
}
