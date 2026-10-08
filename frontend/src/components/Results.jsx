import { formatPkr, formatYen } from '../utils/format.js';

export default function Results({ result, loading }) {
  if (!result) {
    return <p className="placeholder">Enter a bid and exchange rate to see the costs.</p>;
  }

  const { shipmentPayment, breakdown, totalLandedCostPkr, remainingAfterShipmentPkr } = result;

  return (
    <div className={loading ? 'results is-stale' : 'results'}>
      <div className="deposit">
        <div className="k">⚡ Pay now to ship ({shipmentPayment.percentage}% of bid)</div>
        <div className="v">{formatYen(shipmentPayment.yen)}</div>
        <div className="s">≈ {formatPkr(shipmentPayment.pkr)}</div>
      </div>

      <div className="grand">
        <div className="k">Total cost after landing at port</div>
        <div className="v">{formatPkr(totalLandedCostPkr)}</div>
        <div className="s">Balance after shipping payment: {formatPkr(remainingAfterShipmentPkr)}</div>
      </div>

      <div className="breakdown">
        <div className="line">
          <span>Bid</span>
          <b>{formatYen(breakdown.bidYen)}</b>
        </div>
        <div className="line">
          <span>Freight + inspection</span>
          <b>{formatYen(breakdown.freightInspectionYen)}</b>
        </div>
        <div className="line subtotal">
          <span>Total in yen</span>
          <b>{formatYen(breakdown.totalYen)}</b>
        </div>
        <div className="line">
          <span>Japan cost in PKR</span>
          <b>{formatPkr(breakdown.japanCostPkr)}</b>
        </div>
        <div className="line">
          <span>Customs duty</span>
          <b className="duty">{formatPkr(breakdown.customsDutyPkr)}</b>
        </div>
        <div className="line">
          <span>Gift scheme</span>
          <b>{formatPkr(breakdown.giftSchemePkr)}</b>
        </div>
        <div className="line">
          <span>Other expense</span>
          <b>{formatPkr(breakdown.otherExpensePkr)}</b>
        </div>
        <div className="line total">
          <span>Total landed cost</span>
          <b>{formatPkr(totalLandedCostPkr)}</b>
        </div>
      </div>
    </div>
  );
}
