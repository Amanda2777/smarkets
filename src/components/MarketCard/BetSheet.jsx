import { useState } from "react";
import Icon from "../Icon/Icon.jsx";
import BetTicket from "./BetTicket.jsx";
import styles from "./BetSheet.module.css";

/**
 * MultiTicket — the combined slip shown when several bets are open on mobile.
 * One shared stake across the "Your selections" list; each selection can be
 * removed, or the whole slip cleared.
 */
function MultiTicket({ priceRows, tickets, onRemove, onCloseAll }) {
  const [stake, setStake] = useState(0);
  const isBuy = tickets[0].side === "buy";

  return (
    <div className={`${styles.multi} ${isBuy ? styles.buy : styles.sell}`}>
      <div className={styles.header}>
        <button type="button" className={styles.sideToggle}>
          <span className={styles.sideLabel}>{isBuy ? "Buy" : "Sell"}</span>
          <Icon name="chevronDown" size={16} className={styles.sideChevron} />
        </button>
        <span className={styles.multiName}>Multiple</span>
        <button
          type="button"
          className={styles.collapse}
          onClick={onCloseAll}
          aria-label="Close"
        >
          <Icon name="chevronDown" size={20} />
        </button>
      </div>

      <div className={styles.stepper}>
        <button
          type="button"
          className={styles.stepBtn}
          onClick={() => setStake((s) => Math.max(0, s - 5))}
        >
          −
        </button>
        <span className={`${styles.stakeWrap} ${stake > 0 ? styles.active : ""}`}>
          £{stake}
        </span>
        <button
          type="button"
          className={styles.stepBtn}
          onClick={() => setStake((s) => s + 5)}
        >
          +
        </button>
      </div>
      <div className={styles.available}>Available: —</div>

      <div className={styles.selectionsHead}>
        <span className={styles.selectionsTitle}>Your selections</span>
        <button type="button" className={styles.change}>
          Change
        </button>
      </div>

      <ul className={styles.selections}>
        {tickets.map((t) => {
          const row = priceRows.find((r) => r.key === t.key);
          if (!row) return null;
          return (
            <li key={t.id} className={styles.selection}>
              <Icon name="football" size={22} className={styles.selIcon} />
              <div className={styles.selText}>
                <span className={styles.selName}>{row.name}</span>
                <span className={styles.selMarket}>
                  Full-time result | Switzerland vs Colombia
                </span>
              </div>
              <button
                type="button"
                className={styles.remove}
                onClick={() => onRemove(t.id)}
                aria-label={`Remove ${row.name}`}
              >
                <Icon name="minusCircle" size={22} />
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.rows}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Price</span>
          <span className={styles.dash}>—</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Total payout</span>
          <span className={styles.dash}>—</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.submit}>
          Get access
        </button>
        <button
          type="button"
          className={styles.trash}
          onClick={onCloseAll}
          aria-label="Clear all"
        >
          <Icon name="trash" size={22} />
        </button>
      </div>
    </div>
  );
}

/**
 * BetSheet — mobile bottom sheet for open bets. A single bet shows the normal
 * ticket; two or more collapse into the combined "Multiple" slip. Tap the
 * backdrop to dismiss.
 */
export default function BetSheet({
  priceRows,
  tickets,
  onCloseTicket,
  onSetTicketSide,
  onCloseAll,
}) {
  if (!tickets.length) return null;
  const single = tickets.length === 1;

  return (
    <div className={styles.layer}>
      <div className={styles.backdrop} onClick={onCloseAll} />
      <div className={styles.sheet} role="dialog" aria-modal="true">
        <span className={styles.grabber} aria-hidden="true" />
        {single ? (
          <BetTicket
            bare
            row={priceRows.find((r) => r.key === tickets[0].key)}
            side={tickets[0].side}
            onSide={(s) => onSetTicketSide(tickets[0].id, s)}
            onClose={() => onCloseTicket(tickets[0].id)}
          />
        ) : (
          <MultiTicket
            priceRows={priceRows}
            tickets={tickets}
            onRemove={onCloseTicket}
            onCloseAll={onCloseAll}
          />
        )}
      </div>
    </div>
  );
}
