import { useCallback, useState } from "react";
import TopNav from "./components/TopNav/TopNav.jsx";
import Breadcrumb from "./components/Breadcrumb/Breadcrumb.jsx";
import MarketCard from "./components/MarketCard/MarketCard.jsx";
import MarketTypePills from "./components/MarketTypePills/MarketTypePills.jsx";
import CorrectScoreCard from "./components/CorrectScoreCard/CorrectScoreCard.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import BetSheet from "./components/MarketCard/BetSheet.jsx";
import PoliticsPage from "./pages/PoliticsPage.jsx";
import { usePriceTicker } from "./components/MarketCard/usePriceTicker.js";
import { useMediaQuery } from "./hooks/useMediaQuery.js";
import { MARKET } from "./data/election.js";
import styles from "./App.module.css";

let ticketId = 0;

/**
 * App shell. Owns the live price feed and the stack of open bet tickets so
 * the tickets can render in the sidebar (in line with the portfolio card),
 * each new bet pushing the previously opened ones — and Live match — down.
 *
 * Two views share the shell: the football match view and the News and
 * Politics market page, switched from the top-nav category row.
 */
export default function App() {
  const [page, setPage] = useState("politics"); // "politics" | "match"
  const priceRows = usePriceTicker();
  const [tickets, setTickets] = useState([]);
  // On mobile, open bets become a bottom sheet instead of sidebar cards.
  const isMobile = useMediaQuery("(max-width: 960px)");

  // Newest ticket goes on top; opening an already-open contract/side just
  // brings it back to the top rather than duplicating it.
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

  if (page === "politics") {
    return (
      <div className={styles.app}>
        <TopNav onSelectPage={setPage} />
        <Breadcrumb trail={MARKET.trail} />
        <PoliticsPage />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <TopNav onSelectPage={setPage} />
      <Breadcrumb />

      <main className={styles.page}>
        <div className={styles.layout}>
          {/* LEFT / MAIN COLUMN */}
          <div className={styles.mainColumn}>
            <MarketCard priceRows={priceRows} onOpenTicket={openTicket} />
            <MarketTypePills />
            <CorrectScoreCard />
          </div>

          {/* RIGHT SIDEBAR — tickets stack here on desktop only */}
          <Sidebar
            priceRows={priceRows}
            tickets={isMobile ? [] : tickets}
            onCloseTicket={closeTicket}
            onSetTicketSide={setTicketSide}
          />
        </div>
      </main>

      {/* Mobile: open bets appear as an adaptive bottom sheet */}
      {isMobile && (
        <BetSheet
          priceRows={priceRows}
          tickets={tickets}
          onCloseTicket={closeTicket}
          onSetTicketSide={setTicketSide}
          onCloseAll={() => setTickets([])}
        />
      )}
    </div>
  );
}
