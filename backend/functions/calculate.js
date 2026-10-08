import { calculateImportCost } from '../src/services/calculator.service.js';
import { createHandler, json, readJson } from '../src/utils/http.js';
import { validateCalculationInput } from '../src/validators/calculation.validator.js';

// POST /api/calculate  { vehicleId, bidThousands, exchangeRate }
export default createHandler(['POST'], async (req) => {
  const input = validateCalculationInput(await readJson(req));
  return json(200, { data: calculateImportCost(input) });
});

export const config = { path: '/api/calculate' };
