import { LIMITS } from '../config/constants.js';
import { AppError } from '../utils/AppError.js';

function toNumber(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') return Number(value.replace(/,/g, ''));
  return NaN;
}

export function validateCalculationInput(body) {
  const input = body && typeof body === 'object' ? body : {};
  const errors = {};

  const vehicleId = typeof input.vehicleId === 'string' ? input.vehicleId.trim() : '';
  if (!vehicleId) errors.vehicleId = 'vehicleId is required';

  const bidThousands = toNumber(input.bidThousands);
  if (!Number.isFinite(bidThousands) || bidThousands <= 0) {
    errors.bidThousands = 'bidThousands must be a positive number (e.g. 1850 for 1,850,000 JPY)';
  } else if (bidThousands > LIMITS.maxBidThousands) {
    errors.bidThousands = `bidThousands cannot exceed ${LIMITS.maxBidThousands}`;
  }

  const exchangeRate = toNumber(input.exchangeRate);
  if (!Number.isFinite(exchangeRate) || exchangeRate <= 0) {
    errors.exchangeRate = 'exchangeRate must be a positive number (PKR per 1 JPY)';
  } else if (exchangeRate > LIMITS.maxExchangeRate) {
    errors.exchangeRate = `exchangeRate cannot exceed ${LIMITS.maxExchangeRate}`;
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError(422, 'Invalid calculation input', errors);
  }

  return { vehicleId, bidThousands, exchangeRate };
}
