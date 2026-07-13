import { useState } from "react";
import Icon from "../Icon/Icon.jsx";
import styles from "./LiveMatch.module.css";

const TABS = [
  { id: "Summary", icon: "sparkle" },
  { id: "Pitch", icon: "pitch" },
  { id: "Stats", icon: "volume" },
  { id: "Timeline", icon: "clock" },
];

/* ---- Placeholder match data (Switzerland vs Colombia) ---- */
const STATS = [
  { label: "Attacks", home: 108, away: 124 },
  { label: "Dangerous Attacks", home: 57, away: 76 },
  { label: "Shots off Target", home: 5, away: 3 },
  { label: "Shots on Target", home: 4, away: 8 },
];

/* Timeline event markers along the bar (pos = % across the match). */
const MARKERS_TOP = [
  { pos: 26, icon: "football" },
  { pos: 52, icon: "swap" },
  { pos: 63, icon: "swap" },
  { pos: 82, icon: "swap" },
];
const MARKERS_BOTTOM = [
  { pos: 30, icon: "football" },
  { pos: 50, icon: "swap" },
  { pos: 62, icon: "swap" },
  { pos: 80, icon: "swap" },
];

const TIMELINE = [
  { kind: "card", name: "Granit Xhaka", card: "yellow", minute: "51'" },
  { kind: "card", name: "Davinson Sánchez", card: "yellow", minute: "95'" },
  {
    kind: "sub",
    on: "Cedric Itten",
    off: "Dan Ndoye",
    minute: "112'",
  },
  { kind: "card", name: "Miro Muheim", card: "yellow", minute: "105'" },
];

function StatsPanel() {
  return (
    <div className={styles.stats}>
      {STATS.map((s) => (
        <div key={s.label} className={styles.stat}>
          <div className={styles.statBar}>
            <span className={styles.statHome} style={{ flexGrow: s.home }} />
            <span className={styles.statAway} style={{ flexGrow: s.away }} />
          </div>
          <div className={styles.statMeta}>
            <span className={styles.statVal}>{s.home}</span>
            <span className={styles.statLabel}>{s.label}</span>
            <span className={styles.statVal}>{s.away}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamStat({ icon, value, card }) {
  return (
    <span className={styles.teamStat}>
      {card ? (
        <span className={`${styles.cardChip} ${styles[card]}`} />
      ) : (
        <Icon name={icon} size={16} className={styles.teamStatIcon} />
      )}
      <span className={styles.teamStatVal}>{value}</span>
    </span>
  );
}

function PitchPanel() {
  return (
    <div className={styles.pitchPanel}>
      <div className={styles.pitch}>
        <svg viewBox="0 0 320 200" className={styles.pitchSvg} aria-hidden="true">
          <rect x="4" y="4" width="312" height="192" rx="4" />
          <line x1="160" y1="4" x2="160" y2="196" />
          <circle cx="160" cy="100" r="26" />
          <circle cx="160" cy="100" r="2" className={styles.solid} />
          <rect x="4" y="58" width="44" height="84" />
          <rect x="272" y="58" width="44" height="84" />
          <rect x="4" y="82" width="16" height="36" />
          <rect x="300" y="82" width="16" height="36" />
        </svg>
        <div className={styles.winner}>
          <Icon name="trophy" size={34} className={styles.trophy} />
          <span className={styles.winnerName}>Switzerland</span>
          <span className={styles.winnerLabel}>Winner</span>
        </div>
      </div>

      <div className={styles.pitchStats}>
        <div className={styles.teamStats}>
          <span className={styles.teamAbbr}>SUI</span>
          <TeamStat icon="corner" value={5} />
          <TeamStat card="red" value={0} />
          <TeamStat card="yellow" value={2} />
        </div>
        <div className={`${styles.teamStats} ${styles.teamStatsRight}`}>
          <TeamStat card="yellow" value={2} />
          <TeamStat card="red" value={0} />
          <TeamStat icon="corner" value={1} />
          <span className={styles.teamAbbr}>COL</span>
        </div>
      </div>
    </div>
  );
}

function TimelinePanel() {
  return (
    <div className={styles.timelinePanel}>
      <div className={styles.timeline}>
        <div className={styles.tlRow}>
          {MARKERS_TOP.map((m, i) => (
            <Icon
              key={i}
              name={m.icon}
              size={16}
              className={styles.tlMarker}
              style={{ left: `${m.pos}%` }}
            />
          ))}
        </div>
        <div className={styles.tlBar}>
          <span className={styles.tlCap}>0'</span>
          <span className={styles.tlHalf} />
          <span className={styles.tlCap}>HT</span>
          <span className={styles.tlHalf} />
          <span className={styles.tlCap}>FT</span>
        </div>
        <div className={styles.tlRow}>
          {MARKERS_BOTTOM.map((m, i) => (
            <Icon
              key={i}
              name={m.icon}
              size={16}
              className={styles.tlMarker}
              style={{ left: `${m.pos}%` }}
            />
          ))}
        </div>
      </div>

      <h3 className={styles.summaryHeading}>Match Summary</h3>

      <ul className={styles.eventList}>
        {TIMELINE.map((e, i) =>
          e.kind === "card" ? (
            <li key={i} className={styles.event}>
              <span className={styles.eventName}>{e.name}</span>
              <span className={`${styles.cardChip} ${styles[e.card]}`} />
              <span className={styles.eventMinute}>{e.minute}</span>
            </li>
          ) : (
            <li key={i} className={`${styles.event} ${styles.eventSub}`}>
              <span className={styles.eventMinute}>{e.minute}</span>
              <Icon name="swap" size={16} className={styles.eventSwap} />
              <span className={styles.eventSubNames}>
                <span className={styles.subOn}>{e.on}</span>
                <span className={styles.subOff}>{e.off}</span>
              </span>
            </li>
          )
        )}
      </ul>

      <button type="button" className={styles.showMore}>
        Show more
        <Icon name="chevronDown" size={16} />
      </button>
    </div>
  );
}

function SummaryPanel() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={styles.summary}>
      <p>
        Switzerland edged past Colombia on penalties after a goalless ninety
        minutes stretched into extra time, with neither side able to find a
        breakthrough despite Colombia dominating the underlying numbers, more
        shots, more time on the ball inside the box, and a clearly higher
        expected goals tally.
      </p>
      {expanded && (
        <p>
          Rubén Vargas stepped up to score the decisive spot kick, sending
          Switzerland through to a quarter-final against Argentina and ending
          Colombia's run in heartbreaking fashion. The Nati held their nerve
          from twelve yards to reach a first quarter-final since 1954.
        </p>
      )}
      <button
        type="button"
        className={styles.seeMore}
        onClick={() => setExpanded((e) => !e)}
      >
        {expanded ? "See less" : "See more..."}
      </button>
    </div>
  );
}

/**
 * LiveMatch — the sidebar "Live match" card with four tab states:
 * Summary (report copy), Pitch (winner + team cards), Stats (comparison
 * bars) and Timeline (event bar + match summary). Static placeholder data.
 */
export default function LiveMatch() {
  const [tab, setTab] = useState("Summary");

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <span className={styles.title}>
          <Icon name="livematch" size={18} className={styles.titleIcon} />
          Live match
        </span>
      </div>

      <div className={`${styles.tabs} u-scroll-x`} role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
          >
            <Icon name={t.icon} size={15} />
            {t.id}
          </button>
        ))}
      </div>

      <div className={styles.panel}>
        {tab === "Summary" && <SummaryPanel />}
        {tab === "Pitch" && <PitchPanel />}
        {tab === "Stats" && <StatsPanel />}
        {tab === "Timeline" && <TimelinePanel />}
      </div>
    </section>
  );
}
