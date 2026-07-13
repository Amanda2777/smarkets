import { useCountUp } from "./useCountUp.js";

/**
 * AnimatedNumber — counts up or down to `value` when it changes.
 * Used for order-book sizes so stakes visibly tick as the book adapts.
 */
export default function AnimatedNumber({ value, prefix = "£", duration = 600 }) {
  const display = useCountUp(value, duration);
  return (
    <>
      {prefix}
      {display.toLocaleString()}
    </>
  );
}
