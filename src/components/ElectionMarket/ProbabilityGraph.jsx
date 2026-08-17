import { useMemo, useRef } from "react";
import Icon from "../Icon/Icon.jsx";
import styles from "./ProbabilityGraph.module.css";

/**
 * ProbabilityGraph — the stepped price-history chart used twice on the
 * election page: once at market level (three runners) and once inside an
 * expanded runner row (one runner).
 *
 * Everything is laid out in a 0–100 × 0–100 space and stretched with
 * `preserveAspectRatio="none"`, so the same component works at any height
 * without re-deriving geometry. Text never lives in the SVG — labels are
 * absolutely positioned HTML so they stay upright and unstretched.
 *
 * The market view keeps a fixed 0–30% axis (all runners share one scale).
 * A single-runner view passes `autoScale`, which fits the axis to that
 * runner's own range instead — a 2% long-shot then shows its full swing
 * rather than flattening into a straight line along the bottom.
 */

/* Market-level axis: fixed percentage scale with headroom either end. */
const FIXED_TICKS = [30, 24, 18, 12, 6, 0];
const FIXED_DOMAIN = { lo: -1.5, hi: 33 };

/* Runner graphs are green. Only the market graph, which overlays three lines
   that have to be told apart, passes a per-series colour. */
const LINE_DEFAULT = "var(--line-green)";

/* Lines occupy the left 78%, leaving room for the end labels and the axis. */
const DATA_W = 78;
/* Inset for the x-axis ticks so the first/last labels aren't flush. */
const TICK_PAD = 0.07;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* Deterministic PRNG (mulberry32): a given seed always yields the same walk,
   so the history holds still through the frequent live-price re-renders. */
function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* A seeded, mean-reverting series that starts at `base + drift` and glides to
   `base` at the right edge. `steps`/`vol` set how busy the window looks; the
   step size scales with the runner's own price, so a 2% contract jitters in
   fractions of a point while a 17% one moves in whole points. */
function buildValues(base, drift, seed, steps, vol, meanRev) {
  const rng = makeRng(seed);
  const scaled = vol * clamp(base / 14, 0.25, 1.4);
  const clampV = (v) => Math.max(0.2, Math.min(31, v));
  const vals = [];
  let v = base + drift;
  for (let i = 0; i <= steps; i++) {
    const target = base + drift * (1 - i / steps);
    // Occasional bigger "news" jumps on top of the steady jitter.
    const jump = rng() < 0.1 ? (rng() - 0.5) * scaled * 2.4 : 0;
    v = clampV(v + (target - v) * meanRev + (rng() - 0.5) * scaled + jump);
    vals.push(v);
  }
  return vals;
}

/* Fit a readable axis to a value range: a 1/2/2.5/5×10ⁿ step, ticks on round
   numbers, and a little padding so the line never touches the frame. */
function fitAxis(min, max) {
  const span = Math.max(max - min, 0.2);
  const raw = span / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step =
    (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) *
    mag;

  const lo = Math.max(0, +(Math.floor(min / step) * step).toFixed(4));
  const hi = +(Math.ceil(max / step) * step).toFixed(4);

  const ticks = [];
  for (let v = hi; v >= lo - 1e-9; v -= step) ticks.push(+v.toFixed(4));

  const pad = step * 0.18;
  return { ticks, domain: { lo: lo - pad, hi: hi + pad }, step };
}

/* Tick labels carry exactly as many decimals as the step needs — ticks are
   multiples of it, so a 0.25 step prints 2.75%, a 0.2 step prints 2.4%. */
function fmtTick(v, step) {
  if (v === 0) return "0";
  const s = String(step);
  const dot = s.indexOf(".");
  const fixed = v.toFixed(dot === -1 ? 0 : Math.min(2, s.length - dot - 1));
  // Trim trailing zeros so a 0.25 step reads 2.75% / 2.5% / 2%, not 2.50%.
  return `${fixed.includes(".") ? fixed.replace(/\.?0+$/, "") : fixed}%`;
}

/* Nudge the end labels apart when two runners price close together, so the
   name/percentage blocks never sit on top of each other. Works in px against
   the known plot height: one pass down, one corrective pass back up. */
const LABEL_GAP = 46;
function spreadLabels(tops, max) {
  const order = tops.map((t, i) => ({ i, t })).sort((a, b) => a.t - b.t);

  for (let k = 1; k < order.length; k++) {
    order[k].t = Math.max(order[k].t, order[k - 1].t + LABEL_GAP);
  }
  const last = order.length - 1;
  order[last].t = Math.min(order[last].t, max);
  for (let k = last - 1; k >= 0; k--) {
    order[k].t = Math.min(order[k].t, order[k + 1].t - LABEL_GAP);
  }

  const out = [];
  order.forEach(({ i, t }) => (out[i] = t));
  return out;
}

/* Each window changes the shape of the line and the x-axis labels. */
export const TIMEFRAMES = [
  {
    id: "1D",
    ticks: ["00:00", "06:00", "12:00", "18:00"],
    steps: 34,
    vol: 0.85,
    meanRev: 0.045,
    driftFactor: 0.03,
  },
  {
    id: "1W",
    ticks: ["09/08", "11/08", "13/08", "15/08"],
    steps: 48,
    vol: 1,
    meanRev: 0.05,
    driftFactor: 0.09,
  },
  {
    id: "1M",
    ticks: ["18/07", "25/07", "01/08", "08/08", "15/08"],
    steps: 64,
    vol: 1.1,
    meanRev: 0.07,
    driftFactor: 0.22,
  },
  {
    id: "ALL",
    ticks: [
      "01/01/2025",
      "01/04/2025",
      "01/07/2025",
      "01/10/2025",
      "01/01/2026",
      "01/04/2026",
      "01/07/2026",
    ],
    steps: 90,
    vol: 1.25,
    meanRev: 0.11,
    driftFactor: 1,
  },
];

export default function ProbabilityGraph({
  series,
  timeframe,
  onTimeframe,
  height = 300,
  legend = false,
  autoScale = false,
  className = "",
}) {
  const tf = TIMEFRAMES.find((t) => t.id === timeframe) || TIMEFRAMES[3];

  // History is seeded per runner + window; only the final point is live, so
  // the line holds still while the current price ticks.
  const history = useMemo(
    () =>
      series.map((s) =>
        buildValues(
          s.base,
          (s.drift || 0) * tf.driftFactor,
          s.seed + tf.steps,
          tf.steps,
          tf.vol,
          tf.meanRev
        )
      ),
    [series.map((s) => s.key).join(), tf] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Fit the axis to what this window actually contains. The observed range
  // only ever widens while a view is open — a print that runs past the top
  // of the scale grows it, but ordinary movement inside the current ticks
  // leaves the axis alone rather than re-scaling under the user. Switching
  // runner or timeframe starts a fresh range.
  const rangeKey = `${series.map((s) => s.key).join()}|${tf.id}`;
  const rangeRef = useRef({ key: null, min: Infinity, max: -Infinity });
  if (rangeRef.current.key !== rangeKey) {
    rangeRef.current = { key: rangeKey, min: Infinity, max: -Infinity };
  }

  let axis = { ticks: FIXED_TICKS, domain: FIXED_DOMAIN, step: 6 };
  if (autoScale) {
    // A little room either side of the price for the live mid to move into.
    const band = (b) => Math.max(0.25, b * 0.05);
    const r = rangeRef.current;
    series.forEach((s, i) => {
      for (const v of history[i]) {
        if (v < r.min) r.min = v;
        if (v > r.max) r.max = v;
      }
      r.min = Math.min(r.min, s.base - band(s.base), s.mid - band(s.mid));
      r.max = Math.max(r.max, s.base + band(s.base), s.mid + band(s.mid));
    });
    axis = fitAxis(r.min, r.max);
  }

  const { lo, hi } = axis.domain;
  const yPct = (v) => clamp(((hi - v) / (hi - lo)) * 100, 0, 100);

  /* Stepped path (flat run, then a jump) — how an order-book mid moves. */
  const pathFromValues = (vals) => {
    const n = vals.length - 1;
    let d = `M0,${yPct(vals[0]).toFixed(2)}`;
    for (let i = 1; i <= n; i++) {
      const x = ((i / n) * DATA_W).toFixed(2);
      d += ` H${x} V${yPct(vals[i]).toFixed(2)}`;
    }
    return d;
  };

  const lines = series.map((s, i) => {
    const vals = [...history[i].slice(0, -1), s.mid];
    return { ...s, d: pathFromValues(vals), end: s.mid };
  });

  const labelTops = spreadLabels(
    lines.map((l) => (yPct(l.end) / 100) * height),
    height - 10
  );

  return (
    <div className={`${styles.graph} ${className}`}>
      <div className={styles.plot} style={{ height }}>
        {/* Gridlines — dashed HTML rules so the dashes never stretch */}
        {axis.ticks.map((v) => (
          <span
            key={v}
            className={styles.grid}
            style={{ top: `${yPct(v)}%` }}
            aria-hidden="true"
          />
        ))}

        <svg
          className={styles.svg}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {lines.map((l) => (
            <path
              key={l.key}
              className={styles.line}
              style={{ stroke: l.colour || LINE_DEFAULT }}
              d={l.d}
            />
          ))}
        </svg>

        {/* End-of-line labels: runner name above its current percentage */}
        {lines.map((l, i) => (
          <span
            key={l.key}
            className={styles.endLabel}
            style={{ top: labelTops[i], color: l.colour || LINE_DEFAULT }}
          >
            <span className={styles.endName}>{l.name}</span>
            <span className={styles.endValue}>{l.end.toFixed(1)}%</span>
          </span>
        ))}

        {/* Right-hand percentage axis */}
        <div className={styles.yAxis} aria-hidden="true">
          {axis.ticks.map((v) => (
            <span
              key={v}
              className={styles.yTick}
              style={{ top: `${yPct(v)}%` }}
            >
              {fmtTick(v, axis.step)}
            </span>
          ))}
        </div>
      </div>

      {/* X-axis dates */}
      <div className={styles.xAxis} aria-hidden="true">
        {tf.ticks.map((label, i) => (
          <span
            key={label}
            className={styles.xTick}
            style={{
              left: `${
                (TICK_PAD + (i / (tf.ticks.length - 1)) * (1 - TICK_PAD * 2)) *
                DATA_W
              }%`,
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Window pills + legend */}
      <div className={styles.controls}>
        <div className={styles.timeframes} role="group" aria-label="Time range">
          {TIMEFRAMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTimeframe(t.id)}
              aria-pressed={timeframe === t.id}
              className={`${styles.tf} ${
                timeframe === t.id ? styles.tfActive : ""
              }`}
            >
              {t.id}
            </button>
          ))}
        </div>

        {legend && (
          <div className={styles.legend}>
            {lines.map((l) => (
              <span key={l.key} className={styles.legendItem}>
                <span
                  className={styles.dot}
                  style={{ background: l.colour || LINE_DEFAULT }}
                  aria-hidden="true"
                />
                {l.name}
              </span>
            ))}
            <button
              type="button"
              className={styles.legendBtn}
              aria-label="Graph settings"
            >
              <Icon name="sliders" size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
