import { DEFAULT_EXCHANGE_RATE, SHIPMENT_PAYMENT_RATE } from '../src/config/constants.js';
import { vehicles } from '../src/data/vehicles.js';
import { createHandler, json } from '../src/utils/http.js';

// GET /api/vehicles: all vehicles with their fixed (non-editable) costs.
export default createHandler(['GET'], () =>
  json(200, {
    data: vehicles,
    meta: {
      defaultExchangeRate: DEFAULT_EXCHANGE_RATE,
      shipmentPaymentPercentage: Math.round(SHIPMENT_PAYMENT_RATE * 100),
    },
  }),
);

export const config = { path: '/api/vehicles' };
