import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "../Icon/Icon.jsx";
import Volume from "../MarketCard/Volume.jsx";
import OrderBook from "../MarketCard/OrderBook.jsx";
import ProbabilityGraph from "./ProbabilityGraph.jsx";
import CandidateRow from "./CandidateRow.jsx";
import {
  CANDIDATES,
  GRAPHED,
  GRAPH_COLOURS,
  MARKET,
  PAGE_INITIAL,
  PAGE_STEP,
  TABS,
} from "../../data/election.js";
import styles from "./ElectionMarket.module.css";

/* Percentage market: whole-point ladder, prices read as "17%". */
const pctStep = () => 1;
const fmtPct = (v) => (v < 1 ? "<1%" : `${Math.round(v)}%`);

/**
 * ElectionMarket — the single card that makes up the News and Politics
 * market page: title + matched volume, a Graph / Order Book view toggle,
 * the market-level price history, then the runner list under its Top 5 /
 * party tabs. Each runner expands into its own graph or order book.
 *
 * The live feed is owned by the page, since the bet slip prices against it
 * too — the card just renders what it is handed.
 */
export default function ElectionMarket({ prices, onOpenTicket }) {
  const [view, setView] = useState("graph"); // "graph" | "orderbook"
  const [open, setOpen] = useState(true); // header collapse chevron
  const [timeframe, setTimeframe] = useState("ALL");
  const [tab, setTab] = useState(TABS[0].id);
  const [expanded, setExpanded] = useState(null); // runner key

  // A search looks across the whole market, not just the active tab —
  // hunting for "Cruz" from the Top 5 tab should still find him. It sits
  // collapsed as an icon until asked for, so it costs no room at rest.
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const q = query.trim().toLowerCase();

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const closeSearch = useCallback(() => {
    setQuery("");
    setSearchOpen(false);
  }, []);
  const rows = q
    ? CANDIDATES.filter((c) => c.name.toLowerCase().includes(q))
    : (TABS.find((t) => t.id === tab) || TABS[0]).filter(CANDIDATES);

  // The list starts short and grows as the reader reaches the bottom of it,
  // so a 40-runner market doesn't arrive as a wall of rows. Changing tab or
  // search starts the count over.
  const [count, setCount] = useState(PAGE_INITIAL);
  const sentinelRef = useRef(null);
  useEffect(() => setCount(PAGE_INITIAL), [tab, q]);

  const visible = rows.slice(0, count);
  const more = rows.length - visible.length;

  useEffect(() => {
    if (!more) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCount((c) => Math.min(c + PAGE_STEP, rows.length));
        }
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
    // Re-observing after each batch lets the next one trigger in turn.
  }, [more, count, rows.length]);

  // The market-level graph plots the market's leading runners.
  const series = GRAPHED.map((key) => {
    const c = CANDIDATES.find((x) => x.key === key);
    return {
      key: c.key,
      name: c.name,
      colour: GRAPH_COLOURS[c.key],
      base: c.mid,
      drift: c.drift,
      seed: c.seed,
      mid: prices[c.key].mid,
    };
  });

  return (
    <section className={styles.card}>
      {/* ---- Header ---- */}
      <div className={styles.header}>
        <h1 className={styles.title}>{MARKET.title}</h1>

        <div className={styles.headerActions}>
          <div className={styles.toggle} role="group" aria-label="Market view">
            <button
              type="button"
              onClick={() => setView("graph")}
              aria-pressed={view === "graph"}
              className={`${styles.toggleBtn} ${
                view === "graph" ? styles.toggleActive : ""
              }`}
            >
              <Icon name="graph" size={18} /> Graph
            </button>
            <button
              type="button"
              onClick={() => setView("orderbook")}
              aria-pressed={view === "orderbook"}
              className={`${styles.toggleBtn} ${
                view === "orderbook" ? styles.toggleActive : ""
              }`}
            >
              <Icon name="orderbook" size={18} /> Order Book
            </button>
          </div>

          <button
            type="button"
            className={styles.collapse}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Collapse market" : "Expand market"}
          >
            <Icon name={open ? "chevronUp" : "chevronDown"} size={22} />
          </button>
        </div>
      </div>

      <div className={styles.volume}>
        <Volume value={MARKET.volume} />
      </div>

      {open && (
        <>
          {/* ---- Market-level graph / order book ---- */}
          <div className={styles.viewArea}>
            {view === "graph" ? (
              <ProbabilityGraph
                series={series}
                timeframe={timeframe}
                onTimeframe={setTimeframe}
                height={300}
                legend
              />
            ) : (
              <OrderBook
                priceRows={CANDIDATES.map((c) => ({
                  name: c.name,
                  buy: prices[c.key].buy,
                  sell: prices[c.key].sell,
                }))}
                formatPrice={fmtPct}
                stepFor={pctStep}
                askFrom={(r) => r.buy}
                bidFrom={(r) => r.sell}
              />
            )}
          </div>

          {/* ---- Runner tabs + column headings ---- */}
          <div className={styles.tabsRow}>
            <div className={styles.tabs} role="tablist" aria-label="Runners">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`${styles.tab} ${
                    tab === t.id ? styles.tabActive : ""
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div
              ref={searchRef}
              className={`${styles.search} ${
                searchOpen ? styles.searchOpen : ""
              }`}
            >
              <button
                type="button"
                className={styles.searchToggle}
                onClick={() =>
                  searchOpen ? closeSearch() : setSearchOpen(true)
                }
                aria-expanded={searchOpen}
                aria-label={searchOpen ? "Close search" : "Search runners"}
              >
                <Icon name="search" size={16} />
              </button>
              <input
                ref={inputRef}
                className={styles.searchInput}
                type="text"
                value={query}
                tabIndex={searchOpen ? 0 : -1}
                aria-hidden={!searchOpen}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && closeSearch()}
                // Collapse on the way out, but only when there's nothing to
                // keep open for, and not when focus moves to the clear button.
                onBlur={(e) => {
                  if (searchRef.current?.contains(e.relatedTarget)) return;
                  if (!query) setSearchOpen(false);
                }}
                placeholder="Search runners"
                aria-label="Search runners"
              />
              {searchOpen && query && (
                <button
                  type="button"
                  className={styles.searchClear}
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                >
                  <Icon name="close" size={14} />
                </button>
              )}
            </div>

            <div className={styles.colHeads} aria-hidden="true">
              <span className={styles.colHead}>Buy</span>
              <span className={styles.colHead}>Sell</span>
            </div>
          </div>

          {/* ---- Runner list ---- */}
          <ul className={styles.rows}>
            {visible.map((c) => (
              <CandidateRow
                key={c.key}
                candidate={c}
                price={prices[c.key]}
                expanded={expanded === c.key}
                onToggle={() =>
                  setExpanded((cur) => (cur === c.key ? null : c.key))
                }
                onOpenTicket={onOpenTicket}
              />
            ))}
          </ul>

          {rows.length === 0 && (
            <p className={styles.noResults}>
              No runners match &ldquo;{query.trim()}&rdquo;.
            </p>
          )}

          {more > 0 && (
            <div ref={sentinelRef} className={styles.more}>
              {more} more {more === 1 ? "runner" : "runners"}
            </div>
          )}
        </>
      )}
    </section>
  );
}
