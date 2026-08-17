import { useCallback, useState } from "react";
import ElectionMarket from "../components/ElectionMarket/ElectionMarket.jsx";
import BetSlip from "../components/BetSlip/BetSlip.jsx";
import RecapCarousel from "../components/Recap/RecapCarousel.jsx";
import { useElectionPrices } from "../components/ElectionMarket/useElectionPrices.js";
import { CANDIDATES } from "../data/election.js";
import styles from "./PoliticsPage.module.css";

let ticketId = 0;

/**
 * News and Politics market page: the market card beside the bet slip.
 *
 * Prices are owned here rather than inside the card, because both columns
 * read the same feed — the runner rows quote it and the open tickets price
 * against it.
 */
export default function PoliticsPage() {
  const prices = useElectionPrices(CANDIDATES);
  // The slip opens with a buy on the market favourite rather than empty, so
  // the betting flow is visible on arrival.
  const [tickets, setTickets] = useState(() => [
    { id: ++ticketId, key: CANDIDATES[0].key, side: "buy" },
  ]);

  // Newest ticket on top; re-opening the same runner/side brings its ticket
  // back to the top rather than duplicating it.
  const openTicket = useCallback((key, side) => {
    setTickets((prev) => {
      const existing = prev.find((t) => t.key === key && t.side === side);
      if (existing) {
        return [existing, ...prev.filter((t) => t !== existing)];
      }
      return [{ id: ++ticketId, key, side }, ...prev];
    });
  }, []);

  const closeTicket = useCallback((id) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setTicketSide = useCallback((id, side) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, side } : t)));
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.mainColumn}>
          <ElectionMarket prices={prices} onOpenTicket={openTicket} />
        </div>

        <div className={styles.rail}>
          <BetSlip
            candidates={CANDIDATES}
            prices={prices}
            tickets={tickets}
            onCloseTicket={closeTicket}
            onSetTicketSide={setTicketSide}
          />
          <RecapCarousel />
        </div>
      </div>
    </main>
  );
}
