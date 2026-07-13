import styles from "./Breadcrumb.module.css";

/* Static breadcrumb trail. */
const TRAIL = ["Home", "Football", "World", "World Cup", "Switzerland vs Colombia"];

/**
 * Breadcrumb row below the top nav. Static placeholder — no routing.
 */
export default function Breadcrumb() {
  return (
    <div className={styles.wrap}>
      <nav
        className={`${styles.trail} u-scroll-x`}
        aria-label="Breadcrumb"
      >
        {TRAIL.map((crumb, i) => {
          const isLast = i === TRAIL.length - 1;
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
