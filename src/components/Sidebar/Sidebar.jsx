import Icon from "../Icon/Icon.jsx";
import BetTicket from "../MarketCard/BetTicket.jsx";
import LiveMatch from "../LiveMatch/LiveMatch.jsx";
import styles from "./Sidebar.module.css";

/**
 * Right sidebar:
 *  - "Your portfolio" (collapsed, icon + chevron)
 *  - the stack of open Buy/Sell bet tickets (newest on top)
 *  - "Live match" (icon, tab row, and static summary copy)
 * The tickets sit in line with the portfolio card and push Live match down.
 */
export default function Sidebar({
  priceRows = [],
  tickets = [],
  onCloseTicket,
  onSetTicketSide,
}) {
  return (
    <aside className={styles.sidebar}>
      {/* ---- Your portfolio (collapsed) ---- */}
      <section className={styles.card}>
        <button type="button" className={styles.collapseHead}>
          <span className={styles.cardTitle}>
            <Icon name="portfolio" size={18} className={styles.cardIcon} />
            Your portfolio
          </span>
          <Icon name="chevronDown" size={18} className={styles.chevron} />
        </button>
      </section>

      {/* ---- Open bet tickets (newest first) ---- */}
      {tickets.map((t) => (
        <BetTicket
          key={t.id}
          row={priceRows.find((r) => r.key === t.key)}
          side={t.side}
          onSide={(s) => onSetTicketSide(t.id, s)}
          onClose={() => onCloseTicket(t.id)}
        />
      ))}

      {/* ---- Live match (4 tab states) ---- */}
      <LiveMatch />
    </aside>
  );
}
