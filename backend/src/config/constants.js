// Bids are entered in thousands of yen: 1,850 -> 1,850,000 JPY.
export const BID_MULTIPLIER = 1000;

// Share of the winning bid paid up front so the car can be shipped.
export const SHIPMENT_PAYMENT_RATE = 0.33;

export const DEFAULT_EXCHANGE_RATE = 1.82; // PKR per 1 JPY

export const LIMITS = Object.freeze({
  maxBidThousands: 100_000, // 100,000,000 JPY
  maxExchangeRate: 100,
});
