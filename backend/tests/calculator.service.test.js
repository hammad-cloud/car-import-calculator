import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateImportCost } from '../src/services/calculator.service.js';
import { validateCalculationInput } from '../src/validators/calculation.validator.js';

describe('calculateImportCost', () => {
  it('Raize 2021: 1,850 bid at rate 2 -> 33% of bid and full landed cost', () => {
    const r = calculateImportCost({ vehicleId: 'raize-2021', bidThousands: 1850, exchangeRate: 2 });

    assert.equal(r.inputs.bidYen, 1_850_000);
    assert.equal(r.shipmentPayment.yen, 610_500); // 33% of 1,850,000
    assert.equal(r.shipmentPayment.pkr, 1_221_000);
    assert.equal(r.breakdown.totalYen, 2_100_000); // + 250,000 freight/inspection
    // 2,100,000 * 2 + 1,000,000 duty + 320,000 gift + 180,000 other
    assert.equal(r.totalLandedCostPkr, 5_700_000);
  });

  it('Mira 2023 fixed costs', () => {
    const r = calculateImportCost({ vehicleId: 'mira-2023', bidThousands: 950, exchangeRate: 1 });
    assert.equal(r.breakdown.freightInspectionYen, 210_000);
    assert.equal(r.breakdown.customsDutyPkr, 1_000_000);
    assert.equal(r.breakdown.giftSchemePkr, 320_000);
    assert.equal(r.breakdown.otherExpensePkr, 180_000);
    assert.equal(r.totalLandedCostPkr, 950_000 + 210_000 + 1_000_000 + 320_000 + 180_000);
  });

  it('Mira 2024 and 2025 duty / gift scheme', () => {
    const m24 = calculateImportCost({ vehicleId: 'mira-2024', bidThousands: 950, exchangeRate: 1 });
    const m25 = calculateImportCost({ vehicleId: 'mira-2025', bidThousands: 950, exchangeRate: 1 });
    assert.equal(m24.breakdown.customsDutyPkr, 1_170_000);
    assert.equal(m24.breakdown.giftSchemePkr, 350_000);
    assert.equal(m25.breakdown.customsDutyPkr, 1_350_000);
    assert.equal(m25.breakdown.giftSchemePkr, 350_000);
    assert.equal(m25.breakdown.freightInspectionYen, 210_000);
    assert.equal(m25.breakdown.otherExpensePkr, 180_000);
  });

  it('rejects unknown vehicles', () => {
    assert.throws(
      () => calculateImportCost({ vehicleId: 'civic-2020', bidThousands: 1000, exchangeRate: 1 }),
      { statusCode: 404 },
    );
  });
});

describe('validateCalculationInput', () => {
  it('accepts comma-formatted strings', () => {
    const v = validateCalculationInput({ vehicleId: 'mira-2023', bidThousands: '1,850', exchangeRate: '1.82' });
    assert.deepEqual(v, { vehicleId: 'mira-2023', bidThousands: 1850, exchangeRate: 1.82 });
  });

  it('rejects missing / non-positive values', () => {
    assert.throws(() => validateCalculationInput({ vehicleId: '', bidThousands: 0, exchangeRate: -1 }), (err) => {
      assert.equal(err.statusCode, 422);
      assert.deepEqual(Object.keys(err.details).sort(), ['bidThousands', 'exchangeRate', 'vehicleId']);
      return true;
    });
  });
});
