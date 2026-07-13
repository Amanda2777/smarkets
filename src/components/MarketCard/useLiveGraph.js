import { useEffect, useState } from "react";

/**
 * useLiveGraph — a rolling window of live probability samples for the 60M
 * view. Each beat appends a new mean-reverting sample and drops the oldest,
 * so the lines scroll left and jitter with micro-movement as the market
 * updates. Only runs while `active` (i.e. the 60M timeframe is selected).
 */

const BASES = { away: 59, home: 28, draw: 13 }; // Colombia, Switzerland, Draw
const N = 60; // samples across the window
const VOL = 1.7;
const REV = 0.08;
const clamp = (v) => Math.max(2, Math.min(64, v));

function seed(base) {
  const arr = [];
  let v = base;
  for (let i = 0; i < N; i++) {
    v = clamp(v + (base - v) * REV + (Math.random() - 0.5) * VOL * 1.8);
    arr.push(v);
  }
  return arr;
}

const advance = (arr, base) => {
  const last = arr[arr.length - 1];
  const next = clamp(last + (base - last) * REV + (Math.random() - 0.5) * VOL * 2);
  return [...arr.slice(1), next];
};

export function useLiveGraph(active = true) {
  const [series, setSeries] = useState(() => ({
    away: seed(BASES.away),
    home: seed(BASES.home),
    draw: seed(BASES.draw),
  }));

  useEffect(() => {
    if (!active) return;
    let timer;
    const tick = () => {
      setSeries((p) => ({
        away: advance(p.away, BASES.away),
        home: advance(p.home, BASES.home),
        draw: advance(p.draw, BASES.draw),
      }));
      // A new price roughly every ~10s, not a constant twitch.
      timer = setTimeout(tick, 9000 + Math.random() * 2500);
    };
    timer = setTimeout(tick, 9000 + Math.random() * 2500);
    return () => clearTimeout(timer);
  }, [active]);

  return series;
}
