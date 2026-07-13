import { useEffect, useState } from "react";

/**
 * useOrderBook — simulates live depth for the selected contract. Keeps a
 * pool of ask (sell) and bid (buy) order sizes that random-walk over time,
 * so the sizes tick up/down and the depth bars slide as the book adapts.
 * Prices are derived separately from the contract's live price.
 */

const MAX_LEVELS = 6;

/* Realistic starting depth (sizes in £), best level first. */
const seedSizes = (base) =>
  base.concat(
    Array.from({ length: MAX_LEVELS - base.length }, () =>
      Math.round(400 + Math.random() * 6000)
    )
  );

export function useOrderBook() {
  const [book, setBook] = useState(() => ({
    ask: seedSizes([3000, 11195, 148]),
    bid: seedSizes([1355, 9916, 374]),
  }));

  useEffect(() => {
    const jitter = (arr) =>
      arr.map((s) => {
        if (Math.random() > 0.25) return s; // only ~1 level moves per beat
        // Modest change, gently biased upward with the odd pull-back.
        const delta = Math.round((Math.random() - 0.45) * s * 0.16);
        return Math.max(50, s + delta);
      });

    const id = setInterval(() => {
      setBook((prev) => ({ ask: jitter(prev.ask), bid: jitter(prev.bid) }));
    }, 3200);

    return () => clearInterval(id);
  }, []);

  return book;
}
