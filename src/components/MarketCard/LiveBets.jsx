import { useEffect, useRef, useState } from "react";
import styles from "./LiveBets.module.css";

/**
 * LiveBets — a stream of simulated live bets placed on the market. Each bet
 * chip shows the stake (+£amount) in its outcome's colour, spawns at the
 * bottom of the left graph column, floats upward and fades out near the top.
 * Calls `onBet(amount)` for each placed bet so the running volume can react.
 *
 * Stand-in visual for now — a real feed can replace the spawn source later.
 */

const OUTCOMES = [
  { cls: styles.colombia, weight: 4 }, // green — favourite draws most flow
  { cls: styles.switzerland, weight: 3 }, // blue
  { cls: styles.draw, weight: 2 }, // purple
];

function pickOutcome() {
  const total = OUTCOMES.reduce((s, o) => s + o.weight, 0);
  let r = Math.random() * total;
  for (const o of OUTCOMES) {
    if ((r -= o.weight) <= 0) return o;
  }
  return OUTCOMES[0];
}

/* Realistic stake sizes: mostly small, occasionally a big ticket. */
function pickAmount() {
  const r = Math.random();
  if (r < 0.6) return [10, 20, 25, 50, 75, 100][Math.floor(Math.random() * 6)];
  if (r < 0.9) return [150, 200, 250, 500][Math.floor(Math.random() * 4)];
  return [1000, 2000, 2500, 5000][Math.floor(Math.random() * 4)];
}

const BET_LIFETIME = 4200; // must match the CSS animation duration

let counter = 0;

export default function LiveBets({ onBet }) {
  const [bets, setBets] = useState([]);
  const onBetRef = useRef(onBet);
  onBetRef.current = onBet;

  useEffect(() => {
    let mounted = true;
    let spawnTimer;
    const removeTimers = new Set();

    const spawn = () => {
      const id = ++counter;
      const outcome = pickOutcome();
      const amount = pickAmount();
      const side = Math.random() < 0.55 ? "buy" : "sell";
      const offset = Math.round(Math.random() * 16); // slight horizontal jitter

      setBets((b) => [...b, { id, amount, cls: outcome.cls, offset, side }]);
      onBetRef.current?.(amount);

      const rt = setTimeout(() => {
        if (mounted) setBets((b) => b.filter((x) => x.id !== id));
        removeTimers.delete(rt);
      }, BET_LIFETIME);
      removeTimers.add(rt);

      spawnTimer = setTimeout(spawn, 650 + Math.random() * 1500);
    };

    spawnTimer = setTimeout(spawn, 500);
    return () => {
      mounted = false;
      clearTimeout(spawnTimer);
      removeTimers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className={styles.stream} aria-hidden="true">
      {bets.map((b) => (
        <span
          key={b.id}
          className={`${styles.bet} ${b.cls}`}
          style={{ left: b.offset }}
        >
          {b.side === "buy" ? "+" : "−"}£{b.amount.toLocaleString()}
        </span>
      ))}
    </div>
  );
}
