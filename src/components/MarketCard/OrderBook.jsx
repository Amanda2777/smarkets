import { useEffect, useRef, useState } from "react";
import Icon from "../Icon/Icon.jsx";
import AnimatedNumber from "./AnimatedNumber.jsx";
import { useOrderBook } from "./useOrderBook.js";
import styles from "./OrderBook.module.css";

/* Decimal-odds tick ladder + formatting (matches the price ticker). */
const tick = (p) =>
  p < 2 ? 0.01 : p < 3 ? 0.02 : p < 4 ? 0.05 : p < 6 ? 0.1 : p < 10 ? 0.2 : 0.5;
const decimals = (t) => (t < 0.1 ? 2 : t < 1 ? 1 : 0);
const fmtPrice = (v) => v.toFixed(decimals(tick(v)));

/* Build `count` price levels from `start`, stepping by the given ladder. */
function priceLevels(start, dir, count, stepFor) {
  const out = [];
  let p = start;
  for (let i = 0; i < count; i++) {
    out.push(+p.toFixed(2));
    p = +(p + dir * stepFor(p)).toFixed(2);
  }
  return out;
}

const DEPTHS = [2, 3, 4, 5, 6];

/* Small custom dropdown with a stacked label/value and a menu. */
function Dropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className={styles.dropdown} ref={ref}>
      <button
        type="button"
        className={styles.ddButton}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.ddText}>
          <span className={styles.ddLabel}>{label}</span>
          <span className={styles.ddValue}>{value}</span>
        </span>
        <Icon name="chevronDown" size={18} className={styles.ddChevron} />
      </button>
      {open && (
        <ul className={styles.ddMenu}>
          {options.map((o) => (
            <li key={o}>
              <button
                type="button"
                className={`${styles.ddItem} ${
                  o === value ? styles.ddItemActive : ""
                }`}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
              >
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * OrderBook — live depth ladder for a selected contract. Asks (sell orders,
 * blue) climb above the price; bids (buy orders, green) fall below it. Sizes
 * count up/down and the depth bars slide as the simulated book adapts.
 *
 * Defaults quote decimal odds. A percentage market (e.g. the election page)
 * passes its own `formatPrice` / `stepFor` ladder and, since its buy sits
 * *above* its sell, its own `askFrom` / `bidFrom` starting levels.
 */
export default function OrderBook({
  priceRows,
  formatPrice = fmtPrice,
  stepFor = tick,
  askFrom = (r) => r.sell,
  bidFrom = (r) => r.buy,
}) {
  const [contract, setContract] = useState(priceRows[0].name);
  const [depth, setDepth] = useState(3);
  const sizes = useOrderBook();

  const row = priceRows.find((r) => r.name === contract) || priceRows[0];

  // Asks climb away from the price; bids fall away from it.
  const askPrices = priceLevels(askFrom(row), +1, depth, stepFor);
  const bidPrices = priceLevels(bidFrom(row), -1, depth, stepFor);
  const askSizes = sizes.ask.slice(0, depth);
  const bidSizes = sizes.bid.slice(0, depth);

  const maxSize = Math.max(...askSizes, ...bidSizes, 1);
  const barWidth = (s) => `${(s / maxSize) * 100}%`;

  return (
    <div className={styles.orderBook}>
      <div className={styles.obHead}>
        <span className={styles.obTitle}>Order Book</span>
        <span className={styles.obHelp} aria-hidden="true">
          ?
        </span>
        <span className={styles.obLegend}>
          <span className={`${styles.legendItem} ${styles.legendSell}`}>
            <span className={styles.legendDot} />
            Sell Orders (asks)
          </span>
          <span className={`${styles.legendItem} ${styles.legendBuy}`}>
            <span className={styles.legendDot} />
            Buy Orders (bids)
          </span>
        </span>
      </div>

      <div className={styles.obTable}>
        <div className={styles.obColHead}>
          <span>Order Size</span>
          <span>Price</span>
          <span>Price</span>
          <span>Order Size</span>
        </div>

        {Array.from({ length: depth }, (_, i) => (
          <div key={i} className={styles.obRow}>
            {/* Sell (ask) size — bar grows leftward from the centre */}
            <div className={`${styles.size} ${styles.sellSize}`}>
              <span
                className={`${styles.bar} ${styles.sellBar}`}
                style={{ width: barWidth(askSizes[i]) }}
              />
              <span className={styles.sizeText}>
                <AnimatedNumber value={askSizes[i]} />
              </span>
            </div>
            <div className={`${styles.price} ${styles.sellPrice}`}>
              {formatPrice(askPrices[i])}
            </div>

            {/* Buy (bid) side */}
            <div className={`${styles.price} ${styles.buyPrice}`}>
              {formatPrice(bidPrices[i])}
            </div>
            <div className={`${styles.size} ${styles.buySize}`}>
              <span
                className={`${styles.bar} ${styles.buyBar}`}
                style={{ width: barWidth(bidSizes[i]) }}
              />
              <span className={styles.sizeText}>
                <AnimatedNumber value={bidSizes[i]} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.obControls}>
        <Dropdown
          label="Selected contract"
          value={contract}
          options={priceRows.map((r) => r.name)}
          onChange={setContract}
        />
        <Dropdown
          label="Depth"
          value={depth}
          options={DEPTHS}
          onChange={setDepth}
        />
      </div>
    </div>
  );
}
