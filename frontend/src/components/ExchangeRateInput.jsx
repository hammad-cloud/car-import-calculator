import { sanitizeDecimalInput } from '../utils/format.js';

export default function ExchangeRateInput({ value, onChange }) {
  return (
    <div className="field">
      <div className="row">
        <label htmlFor="rate">Exchange rate</label>
        <span className="hint">PKR for 1 yen</span>
      </div>
      <div className="suffix-wrap">
        <input
          id="rate"
          className="input"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="e.g. 1.82"
          value={value}
          onChange={(e) => onChange(sanitizeDecimalInput(e.target.value))}
        />
        <span className="suffix">PKR / ¥</span>
      </div>
    </div>
  );
}
