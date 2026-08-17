import Icon from "../Icon/Icon.jsx";
import logoSvg from "../../assets/logo-smarkets.svg?raw";
import styles from "./TopNav.module.css";

/* Static placeholder categories. `icon` names map to the Icon component;
   `star` marks favourites; `all` / `inplay` drive their leading glyphs.
   `page` is set on the two categories that resolve to a built page. */
const CATEGORIES = [
  { label: "All", all: true },
  { label: "In-play", inplay: true },
  { label: "Football", icon: "football", star: true, page: "match" },
  { label: "Horse Racing", icon: "horse", star: true },
  { label: "News and Politics", icon: "news", star: true, page: "politics" },
  { label: "Tennis", icon: "tennis", star: true },
  { label: "American Football", icon: "americanfootball" },
  { label: "Basketball", icon: "basketball" },
  { label: "Cricket", icon: "cricket" },
];

/**
 * Top navigation bar.
 * Logo, search with keyboard hint, settings icon and auth-state area on
 * the top row; a horizontally scrollable category row with a pinned Profit
 * Hub below. Categories carrying a `page` switch the view; the rest are
 * static placeholders.
 */
export default function TopNav({ onSelectPage }) {
  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        {/* Smarkets logo (inlined so --logo-primary / --logo-accent apply) */}
        <a
          className={styles.logo}
          href="#"
          aria-label="Smarkets home"
          dangerouslySetInnerHTML={{ __html: logoSvg }}
        />

        {/* Search placeholder with "/" keyboard hint */}
        <div className={styles.search}>
          <Icon name="search" size={18} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search markets"
            aria-label="Search markets"
          />
          <span className={styles.searchKey} aria-hidden="true">
            /
          </span>
        </div>

        {/* Auth-state area (static placeholders) */}
        <div className={styles.auth}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Settings"
          >
            <Icon name="settings" size={20} />
          </button>
          <button type="button" className={styles.login}>
            Log in
          </button>
          <button type="button" className={styles.signup}>
            Create account
          </button>
        </div>
      </div>

      {/* Category row: scrollable pills + pinned Profit Hub */}
      <div className={styles.categories}>
        <nav
          className={`${styles.catScroll} u-scroll-x`}
          aria-label="Categories"
        >
          {CATEGORIES.map((c) => (
            <button
              key={c.label}
              type="button"
              className={styles.category}
              onClick={() => c.page && onSelectPage?.(c.page)}
            >
              {c.all && <Icon name="hamburger" size={18} className={styles.catIcon} />}
              {c.inplay && (
                <Icon name="inplay" size={18} className={styles.inplayIcon} />
              )}
              {c.icon && (
                <Icon name={c.icon} size={18} className={styles.catIcon} />
              )}
              {c.label}
              {c.star && (
                <Icon name="star" size={13} className={styles.star} />
              )}
            </button>
          ))}
          <button
            type="button"
            className={styles.overflow}
            aria-label="More categories"
          >
            <Icon name="overflow" size={20} />
          </button>
        </nav>

        <button type="button" className={styles.profitHub}>
          <Icon name="profithub" size={18} className={styles.catIcon} />
          Profit Hub
        </button>
      </div>
    </header>
  );
}
