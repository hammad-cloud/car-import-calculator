import { BID_MULTIPLIER, SHIPMENT_PAYMENT_RATE } from '../config/constants.js';
import { findVehicleById } from '../data/vehicles.js';
import { AppError } from '../utils/AppError.js';

/**
 * @param {{ vehicleId: string, bidThousands: number, exchangeRate: number }} input
 *   bidThousands: winning bid in thousands of yen (1850 = 1,850,000 JPY)
 *   exchangeRate: PKR per 1 JPY
 */
export function calculateImportCost({ vehicleId, bidThousands, exchangeRate }) {
  const vehicle = findVehicleById(vehicleId);
  if (!vehicle) {
    throw new AppError(404, `Unknown vehicle "${vehicleId}"`);
  }

  const toPkr = (yen) => Math.round(yen * exchangeRate);

  const bidYen = Math.round(bidThousands * BID_MULTIPLIER);
  const freightInspectionYen = vehicle.freightInspectionYen;
  const totalYen = bidYen + freightInspectionYen;

  // 33% of the bid only (freight excluded), paid to get the car shipped.
  const shipmentPaymentYen = Math.round(bidYen * SHIPMENT_PAYMENT_RATE);
  const shipmentPaymentPkr = toPkr(shipmentPaymentYen);

  const bidPkr = toPkr(bidYen);
  const freightInspectionPkr = toPkr(freightInspectionYen);
  const japanCostPkr = bidPkr + freightInspectionPkr;

  const totalLandedCostPkr =
    japanCostPkr + vehicle.customsDutyPkr + vehicle.giftSchemePkr + vehicle.otherExpensePkr;

  return {
    vehicle,
    inputs: { bidThousands, bidYen, exchangeRate },
    shipmentPayment: {
      percentage: Math.round(SHIPMENT_PAYMENT_RATE * 100),
      yen: shipmentPaymentYen,
      pkr: shipmentPaymentPkr,
    },
    breakdown: {
      bidYen,
      bidPkr,
      freightInspectionYen,
      freightInspectionPkr,
      totalYen,
      japanCostPkr,
      customsDutyPkr: vehicle.customsDutyPkr,
      giftSchemePkr: vehicle.giftSchemePkr,
      otherExpensePkr: vehicle.otherExpensePkr,
    },
    totalLandedCostPkr,
    remainingAfterShipmentPkr: totalLandedCostPkr - shipmentPaymentPkr,
  };
}
