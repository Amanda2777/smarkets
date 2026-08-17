/**
 * RECAP SLIDES
 *
 * One entry per slide. Each `src` is a standalone HTML file in `public/recap/`
 * — dropped in exactly as generated, no conversion. The carousel renders it in
 * a same-origin iframe and adds the `go` class to `#card` when the slide
 * becomes active, which is what triggers the animations.
 *
 * To add a slide: save the file into public/recap/ and add a line here.
 *
 * Contract each slide file must honour:
 *   • the animated element has id="card"
 *   • its animations are gated behind `#card.go`
 *   • body margin/padding 0 (the carousel owns the spacing)
 */
export const RECAP_SLIDES = [
  {
    id: "cover",
    src: "/recap/01-cover.html",
    // Used as the iframe's accessible name.
    title: "52 candidates. Decision in 2028",
  },
  {
    id: "vance",
    src: "/recap/02-vance.html",
    title: "The line that never got overtaken",
  },
  {
    id: "rubio",
    src: "/recap/03-rubio.html",
    title: "The fastest climb in the field",
  },
  {
    id: "ossoff",
    src: "/recap/04-ossoff.html",
    title: "A line that only went up",
  },
  {
    id: "standings",
    src: "/recap/05-standings.html",
    title: "Five lines, ten points apart",
  },
];

/* Every slide is authored at this size. */
export const SLIDE_WIDTH = 360;
export const SLIDE_HEIGHT = 470;
