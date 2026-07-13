import styles from "./MarketHeader.module.css";

/* The two teams — stacked as the market title, with flag placeholders.
   (The three tradeable outcomes, incl. Draw, live in the State Zone rows.) */
const TEAMS = [
  { name: "Switzerland", flag: "🇨🇭" },
  { name: "Colombia", flag: "🇨🇴" },
];

/**
 * Market header block.
 * Team names stacked vertically with flag placeholders, a meta row
 * (volume / kickoff / venue placeholders) and a Graph / Order Book view
 * toggle (pill buttons, NON-FUNCTIONAL). Smarkets watermark top-right.
 */
export default function MarketHeader() {
  return (
    <section className={styles.header}>
      <div className={styles.top}>
        <ul className={styles.teams}>
          {TEAMS.map((t) => (
            <li key={t.name} className={styles.team}>
              <span className={styles.flag} aria-hidden="true">
                {t.flag}
              </span>
              <span className={styles.teamName}>{t.name}</span>
            </li>
          ))}
        </ul>

        {/* Smarkets watermark placeholder */}
        <span className={styles.watermark} aria-hidden="true">
          smarkets
        </span>
      </div>

      <div className={styles.metaRow}>
        <div className={styles.meta}>
          {/* Volume placeholder — no real figure yet */}
          <span className={styles.metaItem}>£—</span>
          <span className={styles.dot} aria-hidden="true">
            •
          </span>
          <span className={styles.metaItem}>Mon 7 Jul, 20:00</span>
          <span className={styles.dot} aria-hidden="true">
            •
          </span>
          <span className={styles.metaItem}>BC Place, Vancouver</span>
        </div>

        {/* View toggle — static pill buttons, no behaviour wired yet */}
        <div className={styles.toggle} role="group" aria-label="Market view">
          <button
            type="button"
            className={`${styles.toggleBtn} ${styles.toggleActive}`}
          >
            Graph
          </button>
          <button type="button" className={styles.toggleBtn}>
            Order Book
          </button>
        </div>
      </div>
    </section>
  );
}
