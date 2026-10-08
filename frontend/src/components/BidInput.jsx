import { formatIntegerInput, formatYen, parseNumber } from '../utils/format.js';

export default function BidInput({ value, onChange }) {
  const fullBid = parseNumber(value) * 1000;

  return (
    <div className="field">
      <div className="row">
        <label htmlFor="bid">Bid price (thousands of yen)</label>
        <span className="hint">type 1,850 → ¥1,850,000</span>
      </div>
      <div className="suffix-wrap">
        <input
          id="bid"
          className="input input-lg"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="e.g. 950"
          value={value}
          onChange={(e) => onChange(formatIntegerInput(e.target.value))}
        />
        <span className="suffix">,000 ¥</span>
      </div>
      <p className="echo" aria-live="polite">
        Bid: <b>{formatYen(fullBid)}</b>
      </p>
    </div>
  );
}
