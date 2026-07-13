import { useCountUp } from "./useCountUp.js";

/**
 * Volume — displays the market's total matched volume in £, counting up
 * smoothly whenever the total jumps. Isolated so the per-frame animation
 * only re-renders this label, not the whole card.
 */
export default function Volume({ value }) {
  const display = useCountUp(value);
  return <>£{display.toLocaleString()}</>;
}
