const intFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export const formatNumber = (n) => intFormatter.format(Math.round(n || 0));
export const formatPkr = (n) => `PKR ${formatNumber(n)}`;
export const formatYen = (n) => `¥ ${formatNumber(n)}`;

/** Keep digits only and add thousands separators while typing: "1850" -> "1,850". */
export function formatIntegerInput(value) {
  const digits = String(value).replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  return digits ? intFormatter.format(Number(digits)) : '';
}

/** Allow a single decimal point: "1.8.2a" -> "1.82". */
export function sanitizeDecimalInput(value) {
  return String(value)
    .replace(/[^\d.]/g, '')
    .replace(/(\..*)\./g, '$1');
}

export function parseNumber(value) {
  const n = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
}
