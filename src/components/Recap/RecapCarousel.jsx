import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "../Icon/Icon.jsx";
import { RECAP_SLIDES, SLIDE_HEIGHT } from "../../data/recap.js";
import styles from "./RecapCarousel.module.css";

/**
 * RecapSlide — one slide, rendered in a same-origin iframe so its styles,
 * ids and scripts can't collide with the page or with the other slides.
 *
 * The slide file keeps its animations behind `#card.go`; this component adds
 * that class when the slide becomes active and strips it when it leaves, so
 * scrolling back replays the animation from the top.
 */
function RecapSlide({ slide, active }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = ref.current;
    const card = frame?.contentDocument?.getElementById("card");
    if (!card) return;

    if (!active) {
      card.classList.remove("go");
      return;
    }
    // Re-trigger from the start: drop the class, force a reflow, re-add.
    card.classList.remove("go");
    void card.offsetWidth;
    card.classList.add("go");
  }, [active, ready]);

  return (
    <div className={styles.slide}>
      <iframe
        ref={ref}
        className={styles.frame}
        src={slide.src}
        title={slide.title}
        loading="lazy"
        scrolling="no"
        onLoad={() => setReady((r) => !r)}
      />
    </div>
  );
}

/**
 * RecapCarousel — the slide-by-slide market recap under the bet slip.
 * A scroll-snap track, so it swipes on touch and steps with the arrows on
 * desktop; the dots below show position.
 */
export default function RecapCarousel({ slides = RECAP_SLIDES }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  // Derive the active slide from scroll position rather than tracking it
  // separately, so swipe and button navigation stay in agreement.
  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    setIndex((cur) => (cur === next ? cur : next));
  }, []);

  const goTo = useCallback((i) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }, []);

  if (!slides.length) return null;
  const many = slides.length > 1;

  return (
    <section className={styles.recap} aria-roledescription="carousel">
      <div className={styles.head}>
        <h2 className={styles.title}>Market recap</h2>
        {many && (
          <div className={styles.nav}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => goTo(Math.max(0, index - 1))}
              disabled={index === 0}
              aria-label="Previous slide"
            >
              <Icon name="chevronLeft" size={20} />
            </button>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => goTo(Math.min(slides.length - 1, index + 1))}
              disabled={index === slides.length - 1}
              aria-label="Next slide"
            >
              <Icon name="chevronRight" size={20} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={trackRef}
        className={styles.track}
        onScroll={onScroll}
        style={{ height: SLIDE_HEIGHT }}
      >
        {slides.map((slide, i) => (
          <RecapSlide key={slide.id} slide={slide} active={i === index} />
        ))}
      </div>

      {many && (
        <div className={styles.dots}>
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      )}
    </section>
  );
}
