/**
 * Icon — a small set of monochrome, single-line inline SVG icons.
 * All stroke-based and drawn with `currentColor`, so colour is controlled
 * by the parent's CSS `color`. Self-contained (no external icon library).
 *
 * Usage: <Icon name="clock" size={16} className={styles.metaIcon} />
 */

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const ICONS = {
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <line x1="16" y1="16" x2="21" y2="21" />
    </>
  ),
  settings: (
    <>
      <line x1="8" y1="4" x2="8" y2="20" />
      <line x1="16" y1="4" x2="16" y2="20" />
      <circle cx="8" cy="9" r="2.2" />
      <circle cx="16" cy="15" r="2.2" />
    </>
  ),
  hamburger: (
    <>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </>
  ),
  inplay: (
    <>
      <circle cx="8" cy="12" r="2" fill="currentColor" stroke="none" />
      <path d="M13 8.5a5 5 0 0 1 0 7" />
      <path d="M16 5.5a9 9 0 0 1 0 13" />
    </>
  ),
  football: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <polygon points="12,8 15.2,10.3 14,14 10,14 8.8,10.3" />
      <line x1="12" y1="3.8" x2="12" y2="8" />
      <line x1="20.2" y1="10.3" x2="15.2" y2="10.3" />
      <line x1="17" y1="19" x2="14" y2="14" />
      <line x1="7" y1="19" x2="10" y2="14" />
      <line x1="3.8" y1="10.3" x2="8.8" y2="10.3" />
    </>
  ),
  horse: (
    <>
      <path d="M8 20v-8a4 4 0 0 1 8 0v8" />
      <circle cx="8" cy="20" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16" cy="20" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  news: (
    <>
      <polyline points="3.5,10 12,4.5 20.5,10" />
      <line x1="4.5" y1="10.5" x2="4.5" y2="19" />
      <line x1="9" y1="10.5" x2="9" y2="19" />
      <line x1="15" y1="10.5" x2="15" y2="19" />
      <line x1="19.5" y1="10.5" x2="19.5" y2="19" />
      <line x1="3" y1="20" x2="21" y2="20" />
    </>
  ),
  tennis: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M6.4 6.4c3.4 2.6 3.4 8.6 0 11.2" />
      <path d="M17.6 6.4c-3.4 2.6-3.4 8.6 0 11.2" />
    </>
  ),
  americanfootball: (
    <>
      <ellipse cx="12" cy="12" rx="5" ry="8.2" transform="rotate(45 12 12)" />
      <line x1="9.5" y1="14.5" x2="14.5" y2="9.5" />
      <line x1="10.5" y1="12.5" x2="12" y2="14" />
      <line x1="12" y1="10" x2="13.5" y2="11.5" />
    </>
  ),
  basketball: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <line x1="12" y1="3.8" x2="12" y2="20.2" />
      <line x1="3.8" y1="12" x2="20.2" y2="12" />
      <path d="M6.2 6.2c3 3 3 8.6 0 11.6" />
      <path d="M17.8 6.2c-3 3-3 8.6 0 11.6" />
    </>
  ),
  cricket: (
    <>
      <line x1="7.5" y1="16.5" x2="15" y2="9" />
      <line x1="15" y1="9" x2="17" y2="7" />
      <circle cx="8" cy="8" r="2" />
    </>
  ),
  star: {
    fill: "currentColor",
    stroke: "none",
    body: (
      <polygon points="12,3 14.6,8.6 20.8,9.3 16.2,13.6 17.5,19.7 12,16.5 6.5,19.7 7.8,13.6 3.2,9.3 9.4,8.6" />
    ),
  },
  overflow: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="9,8.5 12.5,12 9,15.5" />
      <polyline points="13,8.5 16.5,12 13,15.5" />
    </>
  ),
  profithub: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <line x1="8.5" y1="15.5" x2="8.5" y2="12.5" />
      <line x1="12" y1="15.5" x2="12" y2="9" />
      <line x1="15.5" y1="15.5" x2="15.5" y2="11" />
    </>
  ),
  volume: (
    <>
      <line x1="6.5" y1="19" x2="6.5" y2="14" />
      <line x1="12" y1="19" x2="12" y2="9" />
      <line x1="17.5" y1="19" x2="17.5" y2="12" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <polyline points="12,7.5 12,12 15,13.5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21c4-4.5 6-7.6 6-10.5a6 6 0 0 0-12 0C6 13.4 8 16.5 12 21z" />
      <circle cx="12" cy="10.5" r="2.2" />
    </>
  ),
  graph: (
    <>
      <polyline points="4,15 9,10 13,13 20,6" />
      <polyline points="16,6 20,6 20,10" />
    </>
  ),
  orderbook: (
    <>
      <path d="M12 6.5C10 5.3 6.5 5.3 4.5 6V18c2-.7 5.5-.7 7.5.5" />
      <path d="M12 6.5C14 5.3 17.5 5.3 19.5 6V18c-2-.7-5.5-.7-7.5.5" />
    </>
  ),
  portfolio: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <line x1="8.5" y1="15.5" x2="8.5" y2="12.5" />
      <line x1="12" y1="15.5" x2="12" y2="9" />
      <line x1="15.5" y1="15.5" x2="15.5" y2="11" />
    </>
  ),
  livematch: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <polyline points="7.5,14 10.5,10.5 13,12.5 16.5,8.5" />
    </>
  ),
  swap: (
    <>
      <polyline points="7,8 4,11 7,14" />
      <line x1="4" y1="11" x2="20" y2="11" />
      <polyline points="17,10 20,13 17,16" />
      <line x1="20" y1="13" x2="4" y2="13" />
    </>
  ),
  pitch: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <line x1="12" y1="5" x2="12" y2="19" />
      <circle cx="12" cy="12" r="2.4" />
      <rect x="3" y="9" width="2.6" height="6" />
      <rect x="18.4" y="9" width="2.6" height="6" />
    </>
  ),
  sparkle: (
    <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" />
  ),
  corner: (
    <>
      <path d="M6 4v16" />
      <path d="M6 4h9l-3 3 3 3H6" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 4h10v4a5 5 0 0 1-10 0z" />
      <path d="M7 5.5H4.5V7a2.5 2.5 0 0 0 2.5 2.5" />
      <path d="M17 5.5h2.5V7A2.5 2.5 0 0 1 17 9.5" />
      <line x1="12" y1="13" x2="12" y2="16.5" />
      <path d="M9 20h6l-.6-3.5h-4.8z" />
    </>
  ),
  chevronDown: <polyline points="6,9.5 12,15.5 18,9.5" />,
  chevronUp: <polyline points="6,14.5 12,8.5 18,14.5" />,
  chevronRight: <polyline points="9.5,6 15.5,12 9.5,18" />,
  close: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </>
  ),
  minusCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </>
  ),
  trash: (
    <>
      <polyline points="4,7 20,7" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6.5 7l1 12.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1l1-12.5" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </>
  ),
  clockPlus: (
    <>
      <circle cx="11" cy="11" r="7.5" />
      <polyline points="11,7 11,11 14,12.5" />
      <line x1="18.5" y1="15.5" x2="18.5" y2="21.5" />
      <line x1="15.5" y1="18.5" x2="21.5" y2="18.5" />
    </>
  ),
};

export default function Icon({ name, size = 20, className, style }) {
  const entry = ICONS[name];
  if (!entry) return null;

  const custom = entry.body !== undefined;
  const body = custom ? entry.body : entry;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
      {...STROKE}
      {...(custom ? { fill: entry.fill, stroke: entry.stroke } : {})}
    >
      {body}
    </svg>
  );
}
