import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import calculate from '../functions/calculate.js';
import vehicles from '../functions/vehicles.js';

const post = (body) =>
  new Request('http://localhost/api/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

describe('GET /api/vehicles', () => {
  it('lists the four vehicles', async () => {
    const res = await vehicles(new Request('http://localhost/api/vehicles'));
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(
      body.data.map((v) => v.id),
      ['mira-2023', 'mira-2024', 'mira-2025', 'raize-2021'],
    );
    assert.equal(body.meta.shipmentPaymentPercentage, 33);
  });
});

describe('POST /api/calculate', () => {
  it('calculates with comma strings', async () => {
    const res = await calculate(post({ vehicleId: 'raize-2021', bidThousands: '1,850', exchangeRate: '1.82' }));
    assert.equal(res.status, 200);
    const { data } = await res.json();
    assert.equal(data.shipmentPayment.yen, 610_500);
    assert.equal(data.totalLandedCostPkr, 5_322_000);
  });

  it('returns 422 with field details for bad input', async () => {
    const res = await calculate(post({ vehicleId: '', bidThousands: 0, exchangeRate: -1 }));
    assert.equal(res.status, 422);
    const { error } = await res.json();
    assert.equal(error.message, 'Invalid calculation input');
  });

  it('returns 400 for malformed JSON and 405 for GET', async () => {
    assert.equal((await calculate(post('{bad'))).status, 400);
    assert.equal((await calculate(new Request('http://localhost/api/calculate'))).status, 405);
  });

  it('returns 404 for unknown vehicle', async () => {
    const res = await calculate(post({ vehicleId: 'nope', bidThousands: 1000, exchangeRate: 1 }));
    assert.equal(res.status, 404);
  });
});
