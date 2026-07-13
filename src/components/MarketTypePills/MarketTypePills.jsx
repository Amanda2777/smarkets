import styles from "./MarketTypePills.module.css";

/* Static placeholder labels — horizontally scrollable, non-functional. */
const TYPES = [
  "Popular",
  "Bet Builder",
  "Winner",
  "Teams",
  "Totals",
  "Players",
  "Goals",
  "Handicap",
  "Other",
  "Half",
  "Corners",
  "Cards",
];

/**
 * Market-type pill row below the main market block. Static, horizontally
 * scrollable. First pill shown active for visual reference only — no logic.
 */
export default function MarketTypePills() {
  return (
    <nav
      className={`${styles.row} u-scroll-x`}
      aria-label="Market types"
    >
      {TYPES.map((label, i) => (
        <button
          key={label}
          type="button"
          className={`${styles.pill} ${i === 0 ? styles.active : ""}`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
