/**
 * SWITZERLAND vs COLOMBIA — World Cup 2026, Round of 16
 * BC Place, Vancouver, 7 July 2026
 * Real match events used to drive a mock live-price replay engine.
 *
 * HOW THIS WORKS
 * Each event has a real minute, a description, and an "impact" object,
 * a small nudge (in probability points) applied to each outcome when
 * the event fires. Impacts are directional and modest, since these
 * are chances and cards, not goals, this match stayed 0-0 through
 * 120 minutes. The shootout events at the end carry much bigger
 * swings, since those are the moments that actually decided it.
 *
 * Starting prices reflect real pre-match market sentiment:
 * Switzerland +250 (underdog), Draw +700, Colombia -600 (favourite).
 * Converted to rough implied probability: Switzerland ~28%, Draw ~13%,
 * Colombia ~59%. Opta's own model had it closer: Colombia 41.9%,
 * Switzerland 28.2%, extra time 29.9% — so there's real pre-match
 * disagreement between markets and models baked in, which is a nice
 * authentic wrinkle if you want to show it.
 */

export const startingProbabilities = {
  switzerland: 28,
  draw: 13,
  colombia: 59,
};

export const matchEvents = [
  {
    minute: 0,
    type: "context",
    label: "Kickoff — Round of 16",
    detail:
      "Switzerland go in without breakout star Johan Manzambi, ruled out with a knee injury on the eve of the match.",
    impact: { switzerland: -2, draw: 0, colombia: 2 },
  },
  {
    minute: 20,
    type: "chance",
    team: "colombia",
    label: "Puerta forces a save",
    detail: "Gustavo Puerta curls an effort from outside the box, Kobel makes an acrobatic save.",
    impact: { switzerland: -1, draw: 0, colombia: 1 },
  },
  {
    minute: 48,
    type: "chance",
    team: "switzerland",
    label: "Good look for Switzerland",
    detail: "Switzerland's best moment of a slow first half, a promising chance goes begging.",
    impact: { switzerland: 2, draw: -1, colombia: -1 },
  },
  {
    minute: 49,
    type: "var",
    team: "switzerland",
    label: "Penalty shout waved away",
    detail: "Dan Ndoye goes down in the box under light contact from Muñoz, referee says no, no VAR check.",
    impact: { switzerland: 1, draw: 0, colombia: -1 },
  },
  {
    minute: 51,
    type: "card",
    team: "switzerland",
    label: "Yellow card — Xhaka",
    detail: "Granit Xhaka booked for stepping on Daniel Muñoz's ankle. First card of the match.",
    impact: { switzerland: -1, draw: 0, colombia: 1 },
  },
  {
    minute: 53,
    type: "chance",
    team: "switzerland",
    label: "Rieder free kick",
    detail: "Fabian Rieder curls a free kick from the edge of the box, doesn't quite dip in time.",
    impact: { switzerland: 1, draw: 0, colombia: -1 },
  },
  {
    minute: 58,
    type: "save",
    team: "switzerland",
    label: "Kobel keeping Nati level",
    detail: "Gregor Kobel comes off his line twice in quick succession, deals with both.",
    impact: { switzerland: 1, draw: 0, colombia: -1 },
  },
  {
    minute: 66,
    type: "chance",
    team: "colombia",
    label: "Suárez sends it wide",
    detail: "Luis Suárez takes aim midway through the half, slices it wastefully wide.",
    impact: { switzerland: 1, draw: 0, colombia: -1 },
  },
  {
    minute: 90,
    type: "fulltime",
    label: "Full time — 0-0",
    detail: "Combined 0.7 expected goals, only 4 of 13 shots on target. Extra time for the first time this round.",
    impact: { switzerland: -1, draw: 6, colombia: -5 },
  },
  {
    minute: 94,
    type: "var",
    team: "colombia",
    label: "Penalty shout waved away",
    detail: "Campaz goes down in the box appealing, VAR opts not to review.",
    impact: { switzerland: -1, draw: 0, colombia: 1 },
  },
  {
    minute: 95,
    type: "card",
    team: "colombia",
    label: "Yellow card — Sánchez",
    detail: "Davinson Sánchez booked for a foul on Cedric Itten.",
    impact: { switzerland: 1, draw: 0, colombia: -1 },
  },
  {
    minute: 99,
    type: "chance",
    team: "colombia",
    label: "Lucumí crashes the bar",
    detail: "Best chance of the match by expected goals — Jhon Lucumí's header comes back off the crossbar.",
    impact: { switzerland: -2, draw: 0, colombia: 2 },
  },
  {
    minute: 105,
    type: "card",
    team: "switzerland",
    label: "Yellow card — Muheim",
    detail: "Miro Muheim booked for a foul on Campaz. Market now leans heavily toward penalties.",
    impact: { switzerland: -1, draw: 3, colombia: -2 },
  },
  {
    minute: 112,
    type: "chance",
    team: "colombia",
    label: "Díaz drags it over",
    detail: "Luis Díaz's shot from outside the box sails over after a quick Colombia switch.",
    impact: { switzerland: -1, draw: 0, colombia: 1 },
  },
  {
    minute: 114,
    type: "chance",
    team: "switzerland",
    label: "Xhaka over the bar",
    detail: "Possibly the last real chance of the match — Xhaka fires over from the edge of the box.",
    impact: { switzerland: 1, draw: 0, colombia: -1 },
  },
  {
    minute: 120,
    type: "shootout_start",
    label: "Full time (AET) — 0-0. Penalties.",
    detail: "Colombia finish with the better underlying numbers, 15 shots to 7, xG 1.03 to 0.35. Comes down to the spot.",
    impact: { switzerland: -2, draw: 15, colombia: -13 },
  },
  {
    minute: 121,
    type: "penalty",
    team: "switzerland",
    label: "Xhaka scores",
    detail: "1-0.",
    impact: { switzerland: 4, draw: -4, colombia: 0 },
  },
  {
    minute: 122,
    type: "penalty",
    team: "colombia",
    label: "Quintero scores",
    detail: "1-1.",
    impact: { switzerland: -3, draw: 3, colombia: 0 },
  },
  {
    minute: 123,
    type: "penalty",
    team: "switzerland",
    label: "Amdouni scores",
    detail: "2-1.",
    impact: { switzerland: 4, draw: -4, colombia: 0 },
  },
  {
    minute: 124,
    type: "penalty_miss",
    team: "colombia",
    label: "Sánchez misses",
    detail: "Off target. Switzerland now firmly ahead in the shootout.",
    impact: { switzerland: 8, draw: -8, colombia: 0 },
  },
  {
    minute: 125,
    type: "penalty_miss",
    team: "switzerland",
    label: "Akanji misses",
    detail: "Over the bar. Colombia stay in it.",
    impact: { switzerland: -8, draw: 8, colombia: 0 },
  },
  {
    minute: 126,
    type: "penalty",
    team: "colombia",
    label: "Campaz scores",
    detail: "2-2.",
    impact: { switzerland: -4, draw: 4, colombia: 0 },
  },
  {
    minute: 127,
    type: "penalty",
    team: "switzerland",
    label: "Itten scores",
    detail: "3-2, Switzerland on the brink.",
    impact: { switzerland: 6, draw: -6, colombia: 0 },
  },
  {
    minute: 128,
    type: "penalty_miss",
    team: "colombia",
    label: "Hernández saved by Kobel",
    detail: "Kobel guesses right and parries it away. Switzerland one kick from the quarter-final.",
    impact: { switzerland: 20, draw: -20, colombia: 0 },
  },
  {
    minute: 129,
    type: "penalty",
    team: "switzerland",
    label: "Vargas scores — Switzerland win",
    detail: "4-3 on penalties. Switzerland through to their first quarter-final since 1954. Colombia are out.",
    impact: { switzerland: 100, draw: -100, colombia: 0 },
  },
];

export function applyEvent(current, event) {
  const next = {
    switzerland: Math.max(0.5, current.switzerland + event.impact.switzerland),
    draw: Math.max(0.5, current.draw + event.impact.draw),
    colombia: Math.max(0.5, current.colombia + event.impact.colombia),
  };
  const total = next.switzerland + next.draw + next.colombia;
  const overround = 102;
  return {
    switzerland: (next.switzerland / total) * overround,
    draw: (next.draw / total) * overround,
    colombia: (next.colombia / total) * overround,
  };
}

export function jitter(current) {
  const wobble = () => (Math.random() - 0.5) * 0.4;
  const next = {
    switzerland: Math.max(0.5, current.switzerland + wobble()),
    draw: Math.max(0.5, current.draw + wobble()),
    colombia: Math.max(0.5, current.colombia + wobble()),
  };
  const total = next.switzerland + next.draw + next.colombia;
  const overround = 102;
  return {
    switzerland: (next.switzerland / total) * overround,
    draw: (next.draw / total) * overround,
    colombia: (next.colombia / total) * overround,
  };
}
