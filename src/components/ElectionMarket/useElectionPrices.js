import { useEffect, useRef, useState } from "react";

/**
 * useElectionPrices — mock live pricing for a percentage market.
 *
 * Unlike the football card (decimal odds, repricing every second or so), a
 * long-dated political market is slow: a runner prints once every minute or
 * three. That changes what a good simulation looks like — a print is a rare
 * event, so it has to be worth watching:
 *
 *  • Beats land 1–3 minutes apart, not every second.
 *  • A repriced runner always moves its quote by at least a full point, so a
 *    beat is never a no-op the user can't see.
 *  • Order flow still hits one side at a time, so buy and sell flash
 *    independently — same flash contract as usePriceTicker ("up" | "down"
 *    for a beat, then settle).
 *
 * Returns a map keyed by candidate: { mid, buy, sell, buyFlash, sellFlash }.
 */

/* ---- Cadence. The whole feel of the page lives in these four numbers. ---- */
const BEAT_MIN_MS = 60_000; // fastest gap between prints
const BEAT_MAX_MS = 180_000; // slowest gap between prints
const FIRST_BEAT_MS = 9_000; // first print comes early so the page shows life
const FLASH_MS = 1_600; // how long a repriced cell holds its flash

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const beat = () => BEAT_MIN_MS + Math.random() * (BEAT_MAX_MS - BEAT_MIN_MS);

/* Spread widens with the price — a 17% contract quotes wider than a 2% one.
   Buy sits half a spread above the mid, sell half below. */
const spread = (mid) => Math.max(1, Math.round(mid * 0.13));
const exactFor = (mid, side) => {
  const half = spread(mid) / 2;
  return +(side === "buy" ? mid + half : mid - half).toFixed(2);
};
/* Rows quote whole points; the bet slip shows the exact price behind them.
   Long shots are allowed to round to 0 — the row renders those as "<1%". */
const shown = (exact) => Math.max(0, Math.round(exact));

function initState(candidates) {
  return Object.fromEntries(
    candidates.map((c) => {
      const buyExact = exactFor(c.mid, "buy");
      const sellExact = exactFor(c.mid, "sell");
      return [
        c.key,
        {
          base: c.mid,
          mid: c.mid,
          buyExact,
          sellExact,
          buy: shown(buyExact),
          sell: shown(sellExact),
          buyFlash: null,
          sellFlash: null,
        },
      ];
    })
  );
}

/**
 * Walk one runner's mid. At this cadence a move that leaves the *quoted whole
 * number* unchanged would show the user nothing, so if the walk lands short,
 * the mid is carried just past the boundary that reprints the side taking
 * flow, in whichever direction it was already heading.
 */
function nextMid(s, side) {
  const vol = Math.max(0.3, s.base * 0.06);
  const lo = Math.max(0.6, s.base * 0.7);
  const hi = s.base * 1.4;

  let mid = clamp(
    s.mid + (s.base - s.mid) * 0.12 + (Math.random() - 0.5) * vol * 2,
    lo,
    hi
  );

  if (shown(exactFor(mid, side)) === s[side]) {
    const dir = mid >= s.mid ? 1 : -1;
    const half = spread(s.mid) / 2;
    // Just past the half-point that rounds the quote to the next number.
    mid = clamp(
      side === "buy"
        ? s.buy + dir * 0.52 - half
        : s.sell + dir * 0.52 + half,
      lo,
      hi
    );
  }
  return +mid.toFixed(2);
}

export function useElectionPrices(candidates) {
  const listRef = useRef(candidates);
  const [prices, setPrices] = useState(() => initState(candidates));

  useEffect(() => {
    let mounted = true;
    let timer;

    const settle = (p) =>
      Object.fromEntries(
        Object.entries(p).map(([k, v]) =>
          v.buyFlash || v.sellFlash
            ? [k, { ...v, buyFlash: null, sellFlash: null }]
            : [k, v]
        )
      );

    const step = () => {
      setPrices((prev) => {
        const list = listRef.current;
        // Roughly half the book reprices on a beat — but never nobody, or
        // the page can sit dead for three minutes.
        const moving = list.filter(() => Math.random() < 0.45);
        if (!moving.length) moving.push(list[Math.floor(Math.random() * list.length)]);

        const next = settle(prev);
        for (const c of moving) {
          const s = next[c.key];
          // Flow hits one side; the other holds its price until its turn.
          const side = Math.random() < 0.5 ? "buy" : "sell";
          const mid = nextMid(s, side);
          const exact = exactFor(mid, side);

          // The side that isn't taking flow holds its price, so the quote
          // has to stay a sane book: at least a point wide, never inverted,
          // and never drifting further than a spread past the other side.
          const maxGap = spread(mid) + 1;
          const value =
            side === "buy"
              ? clamp(shown(exact), s.sell + 1, s.sell + maxGap)
              : clamp(shown(exact), Math.max(0, s.buy - maxGap), s.buy - 1);

          if (value === s[side]) {
            next[c.key] = { ...s, mid };
            continue;
          }

          next[c.key] = {
            ...s,
            mid,
            [side]: value,
            // If the book constrained the quote, the slip shows that price
            // rather than an exact one the row would contradict.
            [side === "buy" ? "buyExact" : "sellExact"]:
              value === shown(exact) ? exact : value,
            buyFlash: side === "buy" ? (value > s.buy ? "up" : "down") : null,
            sellFlash: side === "sell" ? (value > s.sell ? "up" : "down") : null,
          };
        }
        return next;
      });

      // Hold the flash long enough to be caught, then settle.
      setTimeout(() => {
        if (mounted) setPrices(settle);
      }, FLASH_MS);
      timer = setTimeout(step, beat());
    };

    timer = setTimeout(step, FIRST_BEAT_MS);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  return prices;
}
