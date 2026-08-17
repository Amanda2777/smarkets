/**
 * ELECTION MARKET DATA — "2028 Presidential Election Winner"
 *
 * Static placeholder content for the News and Politics page. `mid` is the
 * market's implied probability (%) at rest — the live ticker walks around it
 * and derives the buy/sell prices either side. `drift` is how far the runner
 * sat above (+) or below (−) today's price at the start of the ALL window,
 * i.e. the shape of its history line. `photo` is the runner's headshot, or
 * null to fall back to an initials tile.
 *
 * Runner graphs are all green; only the market-level graph needs its three
 * lines told apart, so those colours live in GRAPH_COLOURS below.
 *
 * `party` drives the R / D tabs. Runners who don't sit in either party carry
 * "I", so they appear under All but not under either party list.
 */

export const MARKET = {
  title: "2028 Presidential Election Winner",
  volume: 253334,
  trail: ["Home", "News and Politics", "USA", "2028 Presidential Election Winner"],
};

/* Ordered by price — the list the page shows top to bottom. */
export const CANDIDATES = [
  { key: "vance", name: "JD Vance", party: "R", mid: 18, volume: 50395, seed: 101, drift: 8.5, photo: "/candidates/vance.jpg" },
  { key: "aoc", name: "Alexandria Ocasio-Cortez", party: "D", mid: 11.5, volume: 41208, seed: 102, drift: -8.5, photo: "/candidates/aoc.jpg" },
  { key: "newsom", name: "Gavin Newsom", party: "D", mid: 11, volume: 38870, seed: 103, drift: -6.5, photo: "/candidates/newsom.jpg" },
  { key: "rubio", name: "Marco Rubio", party: "R", mid: 10.5, volume: 33140, seed: 104, drift: 3.5, photo: "/candidates/rubio.jpg" },
  { key: "ossoff", name: "Jon Ossoff", party: "D", mid: 8, volume: 26655, seed: 105, drift: -4, photo: "/candidates/ossoff.jpg" },
  { key: "buttigieg", name: "Pete Buttigieg", party: "D", mid: 2.5, volume: 15420, seed: 106, drift: -1.5, photo: "/candidates/buttigieg.jpg" },
  { key: "harris", name: "Kamala Harris", party: "D", mid: 2.5, volume: 14980, seed: 107, drift: 1.5, photo: "/candidates/harris.jpg" },
  { key: "carlson", name: "Tucker Carlson", party: "R", mid: 2.5, volume: 13310, seed: 108, drift: -1, photo: "/candidates/carlson.jpg" },
  { key: "desantis", name: "Ron DeSantis", party: "R", mid: 2.5, volume: 12740, seed: 109, drift: 2, photo: "/candidates/desantis.jpg" },
  { key: "shapiro", name: "Josh Shapiro", party: "D", mid: 2.5, volume: 12520, seed: 110, drift: -1.5, photo: "/candidates/shapiro.jpg" },
  { key: "massie", name: "Thomas Massie", party: "R", mid: 1.5, volume: 9180, seed: 111, drift: 0.5, photo: "/candidates/massie.jpg" },
  { key: "ivanka", name: "Ivanka Trump", party: "R", mid: 1.5, volume: 8930, seed: 112, drift: -0.5, photo: "/candidates/ivanka.jpg" },
  { key: "trumpjr", name: "Donald Trump Jr.", party: "R", mid: 1.5, volume: 8610, seed: 113, drift: 0.8, photo: "/candidates/trumpjr.jpg" },
  { key: "mobama", name: "Michelle Obama", party: "D", mid: 1.5, volume: 8240, seed: 114, drift: -0.8, photo: "/candidates/mobama.jpg" },
  { key: "pritzker", name: "J.B Pritzker", party: "D", mid: 0.9, volume: 5930, seed: 115, drift: 0.3, photo: "/candidates/pritzker.jpg" },
  { key: "whitmer", name: "Gretchen Whitmer", party: "D", mid: 0.9, volume: 5710, seed: 116, drift: -0.4, photo: "/candidates/whitmer.jpg" },
  { key: "gabbard", name: "Tulsi Gabbard", party: "R", mid: 0.9, volume: 5480, seed: 117, drift: 0.4, photo: "/candidates/gabbard.jpg" },
  { key: "fetterman", name: "John Fetterman", party: "D", mid: 0.9, volume: 5260, seed: 118, drift: -0.2, photo: "/candidates/fetterman.jpg" },
  { key: "haley", name: "Nikki Haley", party: "R", mid: 0.9, volume: 5040, seed: 119, drift: 0.6, photo: "/candidates/haley.jpg" },
  { key: "youngkin", name: "Glenn Youngkin", party: "R", mid: 0.9, volume: 4870, seed: 120, drift: 0.3, photo: "/candidates/youngkin.jpg" },
  { key: "cotton", name: "Tom Cotton", party: "R", mid: 0.85, volume: 4610, seed: 121, drift: 0.2, photo: "/candidates/cotton.jpg" },
  { key: "cuban", name: "Mark Cuban", party: "I", mid: 0.85, volume: 4480, seed: 122, drift: -0.3, photo: "/candidates/cuban.jpg" },
  { key: "warnock", name: "Raphael Warnock", party: "D", mid: 0.85, volume: 4320, seed: 123, drift: 0.2, photo: "/candidates/warnock.jpg" },
  { key: "cruz", name: "Ted Cruz", party: "R", mid: 0.8, volume: 4180, seed: 124, drift: -0.2, photo: "/candidates/cruz.jpg" },
  { key: "hawley", name: "Josh Hawley", party: "R", mid: 0.8, volume: 4020, seed: 125, drift: 0.3, photo: "/candidates/hawley.jpg" },
  { key: "rfk", name: "Robert F. Kennedy Jr.", party: "I", mid: 0.8, volume: 3890, seed: 126, drift: -0.4, photo: "/candidates/rfk.jpg" },
  { key: "ramaswamy", name: "Vivek Ramaswamy", party: "R", mid: 0.8, volume: 3760, seed: 127, drift: 0.3, photo: "/candidates/ramaswamy.jpg" },
  { key: "sanders", name: "Bernie Sanders", party: "D", mid: 0.75, volume: 3610, seed: 128, drift: -0.3, photo: "/candidates/sanders.jpg" },
  { key: "klobuchar", name: "Amy Klobuchar", party: "D", mid: 0.75, volume: 3480, seed: 129, drift: 0.2, photo: "/candidates/klobuchar.jpg" },
  { key: "noem", name: "Kristi Noem", party: "R", mid: 0.75, volume: 3340, seed: 130, drift: 0.2, photo: "/candidates/noem.jpg" },
  { key: "pence", name: "Mike Pence", party: "R", mid: 0.7, volume: 3190, seed: 131, drift: -0.3, photo: "/candidates/pence.jpg" },
  { key: "hclinton", name: "Hillary Clinton", party: "D", mid: 0.7, volume: 3060, seed: 132, drift: -0.2, photo: "/candidates/hclinton.jpg" },
  { key: "cuomo", name: "Andrew Cuomo", party: "D", mid: 0.7, volume: 2920, seed: 133, drift: 0.2, photo: "/candidates/cuomo.jpg" },
  { key: "danawhite", name: "Dana White", party: "I", mid: 0.7, volume: 2780, seed: 134, drift: 0.3, photo: "/candidates/danawhite.jpg" },
  { key: "hbiden", name: "Hunter Biden", party: "D", mid: 0.65, volume: 2640, seed: 135, drift: -0.2, photo: "/candidates/hbiden.jpg" },
  { key: "rogan", name: "Joe Rogan", party: "I", mid: 0.65, volume: 2510, seed: 136, drift: 0.3, photo: "/candidates/rogan.jpg" },
  { key: "cheney", name: "Liz Cheney", party: "R", mid: 0.65, volume: 2380, seed: 137, drift: -0.2, photo: "/candidates/cheney.jpg" },
  { key: "bloomberg", name: "Michael Bloomberg", party: "I", mid: 0.6, volume: 2240, seed: 138, drift: -0.2, photo: "/candidates/bloomberg.jpg" },
  { key: "oprah", name: "Oprah Winfrey", party: "I", mid: 0.6, volume: 2110, seed: 139, drift: 0.2, photo: "/candidates/oprah.jpg" },
  { key: "walz", name: "Tim Walz", party: "D", mid: 0.6, volume: 1980, seed: 140, drift: -0.2, photo: "/candidates/walz.jpg" },
];

/* Runner-list tabs. `filter` picks the rows. */
export const TABS = [
  { id: "top5", label: "Top 5", filter: (list) => list.slice(0, 5) },
  { id: "all", label: "All", filter: (list) => list },
  {
    id: "republicans",
    label: "All Republicans",
    filter: (list) => list.filter((c) => c.party === "R"),
  },
  {
    id: "democrats",
    label: "All Democrats",
    filter: (list) => list.filter((c) => c.party === "D"),
  },
];

/* Runners drawn on the market-level graph, and the only place line colour
   varies — three overlaid lines have to be distinguishable from each other. */
export const GRAPHED = ["vance", "newsom", "aoc"];
export const GRAPH_COLOURS = {
  vance: "var(--line-green)",
  newsom: "var(--line-purple)",
  aoc: "var(--line-white)",
};

/* How many rows show at first, and how many more arrive per scroll. */
export const PAGE_INITIAL = 5;
export const PAGE_STEP = 10;
