import { useState } from "react";
import Icon from "../Icon/Icon.jsx";
import styles from "./BetTicket.module.css";

const AVAILABLE = 10662.14; // placeholder wallet balance
const STEP = 5;

const money = (n) =>
  n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/**
 * BetTicket — the Buy/Sell betting slip that opens from a price pill. Green
 * for Buy, blue for Sell; the side chevron toggles between them. Stake steps
 * with +/- (or type it), the price reflects the outcome's live price, and the
 * total payout updates as you stake. The market is browsable logged out, so
 * the CTA is the sign-in prompt rather than a place order button.
 *
 * Defaults describe the football match view. A percentage market (the
 * election page) overrides the market line, the price string and the payout
 * maths, and swaps the balance line for a liquidity notice.
 */
export default function BetTicket({
  row,
  side,
  onSide,
  onClose,
  bare = false,
  marketIcon = "football",
  marketName = "Full-time result",
  marketSub = "Switzerland vs Colombia",
  price,
  payoutFor,
  notice,
}) {
  const [stake, setStake] = useState(0);
  if (!row) return null;

  const priceStr = price ?? (side === "buy" ? row.buyStr : row.sellStr);
  const priceNum = parseFloat(priceStr);
  const payout = payoutFor ? payoutFor(stake) : stake * priceNum;
  const isBuy = side === "buy";

  const onStakeInput = (e) => {
    const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
    setStake(Number.isNaN(n) ? 0 : n);
  };

  return (
    <div
      className={`${styles.ticket} ${isBuy ? styles.buy : styles.sell} ${
        bare ? styles.bare : ""
      }`}
      role="dialog"
      aria-label={`${isBuy ? "Buy" : "Sell"} ${row.name}`}
    >
      <div className={styles.header}>
        <button
          type="button"
          className={styles.sideToggle}
          onClick={() => onSide(isBuy ? "sell" : "buy")}
        >
          <span className={styles.sideLabel}>{isBuy ? "Buy" : "Sell"}</span>
          <Icon name="chevronDown" size={16} className={styles.sideChevron} />
        </button>
        <span className={styles.outcomeName}>{row.name}</span>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      <div className={styles.market}>
        <Icon name={marketIcon} size={20} className={styles.marketIcon} />
        <div className={styles.marketText}>
          <span className={styles.marketName}>{marketName}</span>
          <span className={styles.matchName}>{marketSub}</span>
        </div>
      </div>

      <div className={styles.stepper}>
        <button
          type="button"
          className={styles.stepBtn}
          onClick={() => setStake((s) => Math.max(0, s - STEP))}
          aria-label="Decrease stake"
        >
          −
        </button>
        <span
          className={`${styles.stakeWrap} ${stake > 0 ? styles.stakeActive : ""}`}
        >
          <span className={styles.currency}>£</span>
          <input
            className={styles.stakeInput}
            inputMode="numeric"
            value={stake === 0 ? "" : String(stake)}
            placeholder="0"
            size={Math.max(1, String(stake).length)}
            onChange={onStakeInput}
          />
        </span>
        <button
          type="button"
          className={styles.stepBtn}
          onClick={() => setStake((s) => s + STEP)}
          aria-label="Increase stake"
        >
          +
        </button>
      </div>

      {notice ? (
        <p className={styles.notice}>
          <Icon name="info" size={20} className={styles.noticeIcon} />
          {notice}
        </p>
      ) : (
        <div className={styles.available}>Available: £{money(AVAILABLE)}</div>
      )}

      <div className={styles.rows}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Price</span>
          <button type="button" className={styles.priceValue}>
            <Icon name="chevronRight" size={14} />
            {priceStr}
          </button>
        </div>
        <div className={`${styles.row} ${styles.payoutRow}`}>
          <span className={styles.rowLabel}>Total payout</span>
          <span className={styles.payout}>
            {stake > 0 ? `£${money(payout)}` : "—"}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.submit}>
          Log in or create account
        </button>
        <button
          type="button"
          className={styles.schedule}
          aria-label="Schedule bet"
        >
          <Icon name="clockPlus" size={22} />
        </button>
      </div>
    </div>
  );
}
