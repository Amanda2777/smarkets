import styles from "./Breadcrumb.module.css";

/* Default trail — the football match view. */
const TRAIL = ["Home", "Football", "World", "World Cup", "Switzerland vs Colombia"];

/**
 * Breadcrumb row below the top nav. The trail is supplied by the page;
 * the crumbs themselves are static placeholders — no routing.
 */
export default function Breadcrumb({ trail = TRAIL }) {
  return (
    <div className={styles.wrap}>
      <nav
        className={`${styles.trail} u-scroll-x`}
        aria-label="Breadcrumb"
      >
        {trail.map((crumb, i) => {
          const isLast = i === trail.length - 1;
          return (
            <span key={crumb} className={styles.item}>
              <span className={isLast ? styles.current : styles.crumb}>
                {crumb}
              </span>
              {!isLast && (
                <span className={styles.sep} aria-hidden="true">
                  ›
                </span>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
