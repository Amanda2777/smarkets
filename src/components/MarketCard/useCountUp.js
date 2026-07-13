import { useEffect, useRef, useState } from "react";

/**
 * useCountUp — animates a number from its current displayed value up to a new
 * target whenever `target` changes, using requestAnimationFrame with an
 * ease-out. Handles targets that change mid-animation by continuing from
 * wherever the display currently is.
 */
export function useCountUp(target, duration = 1300) {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);
  const rafRef = useRef();

  useEffect(() => {
    const from = displayRef.current;
    const to = target;
    if (from === to) return;

    let start;
    const tick = (t) => {
      if (start === undefined) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      const val = Math.round(from + (to - from) * eased);
      displayRef.current = val;
      setDisplay(val);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}
