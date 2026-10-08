import pytest

from app.calculator import calculate_import_cost
from app.errors import AppError
from app.validators import validate_calculation_input


def test_raize_2021_bid_at_rate_2():
    r = calculate_import_cost("raize-2021", 1850, 2)

    assert r["inputs"]["bidYen"] == 1_850_000
    assert r["shipmentPayment"]["yen"] == 610_500  # 33% of 1,850,000
    assert r["shipmentPayment"]["pkr"] == 1_221_000
    assert r["breakdown"]["totalYen"] == 2_100_000  # + 250,000 freight/inspection
    # 2,100,000 * 2 + 1,000,000 duty + 320,000 gift + 180,000 other
    assert r["totalLandedCostPkr"] == 5_700_000


def test_mira_2023_fixed_costs():
    r = calculate_import_cost("mira-2023", 950, 1)
    assert r["breakdown"]["freightInspectionYen"] == 210_000
    assert r["breakdown"]["customsDutyPkr"] == 1_000_000
    assert r["breakdown"]["giftSchemePkr"] == 320_000
    assert r["breakdown"]["otherExpensePkr"] == 180_000
    assert r["totalLandedCostPkr"] == 950_000 + 210_000 + 1_000_000 + 320_000 + 180_000


def test_mira_2024_and_2025_duty_and_gift_scheme():
    m24 = calculate_import_cost("mira-2024", 950, 1)
    m25 = calculate_import_cost("mira-2025", 950, 1)
    assert m24["breakdown"]["customsDutyPkr"] == 1_170_000
    assert m24["breakdown"]["giftSchemePkr"] == 350_000
    assert m25["breakdown"]["customsDutyPkr"] == 1_350_000
    assert m25["breakdown"]["giftSchemePkr"] == 350_000
    assert m25["breakdown"]["freightInspectionYen"] == 210_000
    assert m25["breakdown"]["otherExpensePkr"] == 180_000


def test_rounds_half_up_like_the_js_version():
    # 2.5 yen -> 3 (Math.round behaviour); Python's round() would give 2.
    r =calculate_import_cost("mira-2023", 0.0025, 1)
    assert r["inputs"]["bidYen"] == 3


def test_rejects_unknown_vehicles():
    with pytest.raises(AppError) as exc:
        calculate_import_cost("civic-2020", 1000, 1)
    assert exc.value.status_code == 404


def test_validator_accepts_comma_formatted_strings():
    v = validate_calculation_input({"vehicleId": "mira-2023", "bidThousands": "1,850", "exchangeRate": "1.82"})
    assert v == {"vehicle_id": "mira-2023", "bid_thousands": 1850, "exchange_rate": 1.82}


def test_validator_rejects_missing_and_non_positive_values():
    with pytest.raises(AppError) as exc:
        validate_calculation_input({"vehicleId": "", "bidThousands": 0, "exchangeRate": -1})
    assert exc.value.status_code == 422
    assert sorted(exc.value.details) == ["bidThousands", "exchangeRate", "vehicleId"]
