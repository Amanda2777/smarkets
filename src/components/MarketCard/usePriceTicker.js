import { useEffect, useRef, useState } from "react";

/**
 * usePriceTicker — a self-contained mock of live exchange price movement.
 *
 * Each outcome holds a best BUY and best SELL price that move *independently*
 * as simulated order flow hits one side at a time — so the buy and sell cells
 * flash separately, never together. Prices mean-revert to a base and snap to
 * a realistic decimal-odds tick ladder. On any change, that one cell is tagged
 * with a flash direction ("up" | "down") for a beat so the UI can flash it
 * green or red, then settle.
 *
 * This is a stand-in for the real match-engine replay, wired in later.
 */

const CONFIG = [
  { key: "switzerland", name: "Switzerland", base: 3.5, min: 2.9, max: 4.4 },
  { key: "draw", name: "Draw", base: 8.0, min: 6.8, max: 9.6 },
  { key: "colombia", name: "Colombia", base: 1.17, min: 1.08, max: 1.34 },
];

/* Smarkets-style decimal-odds tick ladder. */
const tick = (p) =>
  p < 2 ? 0.01 : p < 3 ? 0.02 : p < 4 ? 0.05 : p < 6 ? 0.1 : p < 10 ? 0.2 : 0.5;
const decimals = (t) => (t < 0.1 ? 2 : t < 1 ? 1 : 0);
const round2 = (v) => +v.toFixed(2);
const snap = (m) => round2(Math.round(m / tick(m)) * tick(m));
const fmt = (v) => v.toFixed(decimals(tick(v)));
const impliedPct = (odds) => Math.max(3, Math.min(94, 100 / odds));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function initState(cfg) {
  const buy = snap(cfg.base);
  return { buy, sell: round2(buy + tick(buy)) };
}

function view(cfg, s, buyFlash, sellFlash) {
  return {
    key: cfg.key,
    name: cfg.name,
    buy: s.buy,
    sell: s.sell,
    buyStr: fmt(s.buy),
    sellStr: fmt(s.sell),
    buyFlash,
    sellFlash,
    pos: impliedPct(s.buy),
  };
}

export function usePriceTicker() {
  const stateRef = useRef(
    Object.fromEntries(CONFIG.map((c) => [c.key, initState(c)]))
  );
  const [rows, setRows] = useState(() =>
    CONFIG.map((c) => view(c, stateRef.current[c.key], null, null))
  );

  useEffect(() => {
    let mounted = true;
    let stepTimer;

    const settle = (r) =>
      r.buyFlash || r.sellFlash ? { ...r, buyFlash: null, sellFlash: null } : r;

    const step = () => {
      setRows((prev) =>
        prev.map((r, i) => {
          const cfg = CONFIG[i];
          const s = stateRef.current[cfg.key];

          // Not every outcome sees order flow on every beat.
          if (Math.random() > 0.5) return settle(r);

          // Order flow hits ONE side — buy or sell — this beat.
          const side = Math.random() < 0.5 ? "buy" : "sell";
          const t = tick(s[side]);
          const target = side === "buy" ? cfg.base : cfg.base + tick(cfg.base);
          const before = s[side];

          let next = snap(
            before + (target - before) * 0.1 + (Math.random() - 0.5) * t * 2.4
          );

          // Keep a sane 1–3 tick spread with sell above buy.
          if (side === "buy") {
            next = Math.min(next, round2(s.sell - t));
            next = Math.max(next, round2(s.sell - 3 * t));
          } else {
            next = Math.max(next, round2(s.buy + t));
            next = Math.min(next, round2(s.buy + 3 * t));
          }
          next = round2(clamp(next, cfg.min, cfg.max));

          if (next === before) return settle(r);

          s[side] = next;
          const dir = next > before ? "up" : "down";
          return view(
            cfg,
            s,
            side === "buy" ? dir : null,
            side === "sell" ? dir : null
          );
        })
      );

      // Flash lasts a beat, then settles.
      setTimeout(() => {
        if (mounted) setRows((prev) => prev.map(settle));
      }, 220);
      stepTimer = setTimeout(step, 700 + Math.random() * 800);
    };

    stepTimer = setTimeout(step, 600);
    return () => {
      mounted = false;
      clearTimeout(stepTimer);
    };
  }, []);

  return rows;
}
