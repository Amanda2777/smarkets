import styles from "./Avatar.module.css";

/* "Alexandria Ocasio-Cortez" → "AO" */
const initials = (name) =>
  name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/**
 * Avatar — square runner headshot with a slight corner radius. Runners with
 * no photo fall back to an initials tile at the same size and radius, so the
 * row rhythm holds either way.
 */
export default function Avatar({ name, photo, size = 44 }) {
  if (photo) {
    return (
      <img
        className={styles.avatar}
        src={photo}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={size}
        height={size}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={`${styles.avatar} ${styles.initials}`}
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
    >
      {initials(name)}
    </span>
  );
}
