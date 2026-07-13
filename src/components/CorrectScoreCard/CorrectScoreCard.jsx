import Icon from "../Icon/Icon.jsx";
import styles from "./CorrectScoreCard.module.css";

/* Static placeholder scores + prices, matching the reference screenshot. */
const LEFT = [
  { score: "0 - 0", buy: "17.0", sell: "18.0", pos: 20 },
  { score: "0 - 1", buy: "11.0", sell: "12.0", pos: 24 },
  { score: "0 - 2", buy: "12.0", sell: "13.0", pos: 22 },
  { score: "0 - 3", buy: "24", sell: "26", pos: 12 },
];
const RIGHT = [
  { score: "2 - 2", buy: "14.5", sell: "15.5", pos: 30 },
  { score: "2 - 3", buy: "24", sell: "26", pos: 60 },
  { score: "3 - 0", buy: "75", sell: "85", pos: 8 },
  { score: "3 - 1", buy: "36", sell: "42", pos: 68 },
];

function ScoreRow({ row }) {
  return (
    <div className={styles.row}>
      <span className={styles.score}>{row.score}</span>
      {/* Static slider — visual only */}
      <div className={styles.slider}>
        <div className={styles.sliderTrack} />
        <div className={styles.sliderFill} style={{ width: `${row.pos}%` }} />
        <div className={styles.sliderHandle} style={{ left: `${row.pos}%` }} />
      </div>
      <span className={`${styles.price} ${styles.buy}`}>{row.buy}</span>
      <span className={`${styles.price} ${styles.sell}`}>{row.sell}</span>
    </div>
  );
}

/**
 * Correct Score market table — matches the reference: header with an
 * Order Book button + collapse chevron, a volume figure, BUY/SELL column
 * labels, and two columns of score rows each with a static slider and
 * buy/sell prices. All static placeholder content — no behaviour.
 */
export default function CorrectScoreCard() {
  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <span className={styles.title}>Correct Score</span>
        <div className={styles.headActions}>
          <button type="button" className={styles.orderBookBtn}>
            <Icon name="orderbook" size={16} /> Order Book
          </button>
          <Icon name="chevronUp" size={18} className={styles.chevron} />
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.col}>
          <div className={styles.colHead}>
            <span className={styles.volume}>£570,503</span>
            <span className={styles.slot} />
            <span className={styles.colLabel}>Buy</span>
            <span className={styles.colLabel}>Sell</span>
          </div>
          {LEFT.map((row) => (
            <ScoreRow key={row.score} row={row} />
          ))}
        </div>

        <div className={styles.col}>
          <div className={styles.colHead}>
            <span />
            <span className={styles.slot} />
            <span className={styles.colLabel}>Buy</span>
            <span className={styles.colLabel}>Sell</span>
          </div>
          {RIGHT.map((row) => (
            <ScoreRow key={row.score} row={row} />
          ))}
        </div>
      </div>
    </section>
  );
}
