// Fixed (non-editable) costs per vehicle. Update these when duty/scheme rates change.
// Currency is in the field name: *Yen is paid in Japan, *Pkr is paid in Pakistan.

const MIRA_FREIGHT_INSPECTION_YEN = 210_000;
const MIRA_OTHER_EXPENSE_PKR = 180_000;

export const vehicles = Object.freeze(
  [
    {
      id: 'mira-2023',
      make: 'Daihatsu',
      model: 'Mira',
      year: 2023,
      customsDutyPkr: 1_000_000,
      freightInspectionYen: MIRA_FREIGHT_INSPECTION_YEN,
      giftSchemePkr: 320_000,
      otherExpensePkr: MIRA_OTHER_EXPENSE_PKR,
    },
    {
      id: 'mira-2024',
      make: 'Daihatsu',
      model: 'Mira',
      year: 2024,
      customsDutyPkr: 1_170_000,
      freightInspectionYen: MIRA_FREIGHT_INSPECTION_YEN,
      giftSchemePkr: 350_000,
      otherExpensePkr: MIRA_OTHER_EXPENSE_PKR,
    },
    {
      id: 'mira-2025',
      make: 'Daihatsu',
      model: 'Mira',
      year: 2025,
      customsDutyPkr: 1_350_000,
      freightInspectionYen: MIRA_FREIGHT_INSPECTION_YEN,
      giftSchemePkr: 350_000,
      otherExpensePkr: MIRA_OTHER_EXPENSE_PKR,
    },
    {
      id: 'raize-2021',
      make: 'Toyota',
      model: 'Raize',
      year: 2021,
      customsDutyPkr: 1_000_000,
      freightInspectionYen: 250_000,
      giftSchemePkr: 320_000,
      otherExpensePkr: 180_000,
    },
  ].map(Object.freeze),
);

export function findVehicleById(id) {
  return vehicles.find((v) => v.id === id) ?? null;
}
