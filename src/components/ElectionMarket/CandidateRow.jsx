import { useState } from "react";
import Avatar from "./Avatar.jsx";
import ProbabilityGraph from "./ProbabilityGraph.jsx";
import OrderBook from "../MarketCard/OrderBook.jsx";
import Volume from "../MarketCard/Volume.jsx";
import styles from "./CandidateRow.module.css";

/* Map a flash direction to its pill modifier — same contract as MarketCard. */
const flashClass = (dir) =>
  dir === "up" ? styles.flashUp : dir === "down" ? styles.flashDown : "";

/* Percentage market: whole-point ladder, prices read as "17%". Anything that
   rounds below a point is a long shot quoted as "<1%". */
const pctStep = () => 1;
const fmtPct = (v) => (v < 1 ? "<1%" : `${Math.round(v)}%`);

/**
 * CandidateRow — one runner in the market list: avatar, name, matched volume
 * and the two price pills. Selecting the name area expands the row into that
 * runner's own graph / order book.
 */
export default function CandidateRow({
  candidate,
  price,
  expanded,
  onToggle,
  onOpenTicket,
}) {
  const [view, setView] = useState("graph");
  const [timeframe, setTimeframe] = useState("ALL");

  return (
    <li className={styles.row}>
      <div className={styles.rowMain}>
        <button
          type="button"
          className={styles.expand}
          onClick={onToggle}
          aria-expanded={expanded}
        >
          <Avatar name={candidate.name} photo={candidate.photo} />
          <span className={styles.name}>{candidate.name}</span>
          <span className={styles.volume}>
            <Volume value={candidate.volume} />
          </span>
        </button>

        <div className={styles.pills}>
          <button
            type="button"
            className={`${styles.pill} ${styles.pillBuy} ${flashClass(
              price.buyFlash
            )}`}
            onClick={() => onOpenTicket?.(candidate.key, "buy")}
            aria-label={`Buy ${candidate.name} at ${fmtPct(price.buy)}`}
          >
            {fmtPct(price.buy)}
          </button>
          <button
            type="button"
            className={`${styles.pill} ${styles.pillSell} ${flashClass(
              price.sellFlash
            )}`}
            onClick={() => onOpenTicket?.(candidate.key, "sell")}
            aria-label={`Sell ${candidate.name} at ${fmtPct(price.sell)}`}
          >
            {fmtPct(price.sell)}
          </button>
        </div>
      </div>

      {expanded && (
        <div className={styles.panel}>
          <div className={styles.subTabs} role="group" aria-label="Runner view">
            <button
              type="button"
              onClick={() => setView("graph")}
              aria-pressed={view === "graph"}
              className={`${styles.subTab} ${
                view === "graph" ? styles.subTabActive : ""
              }`}
            >
              Graph
            </button>
            <button
              type="button"
              onClick={() => setView("orderbook")}
              aria-pressed={view === "orderbook"}
              className={`${styles.subTab} ${
                view === "orderbook" ? styles.subTabActive : ""
              }`}
            >
              Order Book
            </button>
          </div>

          {view === "graph" ? (
            <ProbabilityGraph
              series={[
                {
                  key: candidate.key,
                  name: candidate.name,
                  base: candidate.mid,
                  drift: candidate.drift,
                  seed: candidate.seed,
                  mid: price.mid,
                },
              ]}
              timeframe={timeframe}
              onTimeframe={setTimeframe}
              height={210}
              autoScale
            />
          ) : (
            <OrderBook
              priceRows={[
                { name: candidate.name, buy: price.buy, sell: price.sell },
              ]}
              formatPrice={fmtPct}
              stepFor={pctStep}
              askFrom={(r) => r.buy}
              bidFrom={(r) => r.sell}
            />
          )}
        </div>
      )}
    </li>
  );
}
