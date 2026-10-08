import { formatPkr, formatYen } from '../utils/format.js';

function LockedField({ label, value }) {
  return (
    <div className="locked">
      <span className="locked-label">
        {label} <span aria-label="fixed, not editable" title="Fixed, not editable">🔒</span>
      </span>
      <span className="locked-value">{value}</span>
    </div>
  );
}

export default function FixedCosts({ vehicle }) {
  if (!vehicle) return null;

  return (
    <section aria-label="Fixed costs">
      <div className="row">
        <span className="label">
          Fixed costs · {vehicle.model} {vehicle.year}
        </span>
      </div>
      <div className="locked-grid">
        <LockedField label="Customs duty" value={formatPkr(vehicle.customsDutyPkr)} />
        <LockedField label="Freight + inspection" value={formatYen(vehicle.freightInspectionYen)} />
        <LockedField label="Gift scheme" value={formatPkr(vehicle.giftSchemePkr)} />
        <LockedField label="Other expense" value={formatPkr(vehicle.otherExpensePkr)} />
      </div>
    </section>
  );
}
