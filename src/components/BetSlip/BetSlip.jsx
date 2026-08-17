import { useState } from "react";
import BetTicket from "../MarketCard/BetTicket.jsx";
import { MARKET } from "../../data/election.js";
import styles from "./BetSlip.module.css";

const LIQUIDITY_NOTICE =
  "Your order might not be matched if it exceeds available liquidity.";

/**
 * BetSlip — the election page's right-hand column: a Singles / Multiples
 * segmented control over the stack of open bet tickets (newest on top).
 *
 * A percentage contract pays out the stake divided by the price, so £10 at
 * 18.87% returns £53.00 — hence the payout override on the shared ticket.
 */
export default function BetSlip({
  candidates,
  prices,
  tickets,
  onCloseTicket,
  onSetTicketSide,
}) {
  const [mode, setMode] = useState("singles");

  return (
    <aside className={styles.slip}>
      <div className={styles.tabs} role="tablist" aria-label="Bet slip type">
        {["singles", "multiples"].map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className={`${styles.tab} ${mode === id ? styles.tabActive : ""}`}
          >
            {id === "singles" ? "Singles" : "Multiples"}
          </button>
        ))}
      </div>

      {mode === "multiples" ? (
        <p className={styles.empty}>
          Add two or more selections to build a multiple.
        </p>
      ) : tickets.length === 0 ? (
        <p className={styles.empty}>
          Select a price to add a bet to your slip.
        </p>
      ) : (
        tickets.map((t) => {
          const candidate = candidates.find((c) => c.key === t.key);
          const price = prices[t.key];
          if (!candidate || !price) return null;

          const exact = t.side === "buy" ? price.buyExact : price.sellExact;
          return (
            <BetTicket
              key={t.id}
              row={{ name: candidate.name }}
              side={t.side}
              onSide={(s) => onSetTicketSide(t.id, s)}
              onClose={() => onCloseTicket(t.id)}
              marketIcon="news"
              marketName={MARKET.title}
              /* The reference repeats the market name on the second line —
                 it is the event name, which matches here. */
              marketSub={MARKET.title}
              price={`${exact.toFixed(2)}%`}
              payoutFor={(stake) => (stake * 100) / exact}
              notice={LIQUIDITY_NOTICE}
            />
          );
        })
      )}
    </aside>
  );
}
