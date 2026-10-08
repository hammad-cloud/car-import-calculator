import math

from .config import MAX_BID_THOUSANDS, MAX_EXCHANGE_RATE
from .errors import AppError


def _to_number(value):
    """Numbers pass through; strings like "1,850" are parsed. Anything else is NaN."""
    if isinstance(value, bool):
        return math.nan
    if isinstance(value, (int, float)):
        number = float(value)
    elif isinstance(value, str) and value.strip():
        try:
            number = float(value.replace(",", "").strip())
        except ValueError:
            return math.nan
    else:
        return math.nan
    # Keep whole numbers as ints so they serialize as 1850, not 1850.0.
    return int(number) if math.isfinite(number) and number.is_integer() else number


def _is_positive(number):
    return math.isfinite(number) and number > 0


def validate_calculation_input(body):
    data = body if isinstance(body, dict) else {}
    errors = {}

    vehicle_id = data.get("vehicleId")
    vehicle_id = vehicle_id.strip() if isinstance(vehicle_id, str) else ""
    if not vehicle_id:
        errors["vehicleId"] = "vehicleId is required"

    bid_thousands = _to_number(data.get("bidThousands"))
    if not _is_positive(bid_thousands):
        errors["bidThousands"] = "bidThousands must be a positive number (e.g. 1850 for 1,850,000 JPY)"
    elif bid_thousands > MAX_BID_THOUSANDS:
        errors["bidThousands"] = f"bidThousands cannot exceed {MAX_BID_THOUSANDS}"

    exchange_rate = _to_number(data.get("exchangeRate"))
    if not _is_positive(exchange_rate):
        errors["exchangeRate"] = "exchangeRate must be a positive number (PKR per 1 JPY)"
    elif exchange_rate > MAX_EXCHANGE_RATE:
        errors["exchangeRate"] = f"exchangeRate cannot exceed {MAX_EXCHANGE_RATE}"

    if errors:
        raise AppError(422, "Invalid calculation input", errors)

    return {"vehicle_id": vehicle_id, "bid_thousands": bid_thousands, "exchange_rate": exchange_rate}
