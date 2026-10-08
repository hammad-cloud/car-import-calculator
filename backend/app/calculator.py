import math

from .config import BID_MULTIPLIER, SHIPMENT_PAYMENT_RATE
from .errors import AppError
from .vehicles import find_vehicle_by_id


def round_half_up(value):
    # Python's round() is banker's rounding; money here rounds .5 up.
    return math.floor(value + 0.5)


def calculate_import_cost(vehicle_id, bid_thousands, exchange_rate):
    """
    bid_thousands: winning bid in thousands of yen (1850 = 1,850,000 JPY)
    exchange_rate: PKR per 1 JPY
    """
    vehicle = find_vehicle_by_id(vehicle_id)
    if vehicle is None:
        raise AppError(404, f'Unknown vehicle "{vehicle_id}"')

    def to_pkr(yen):
        return round_half_up(yen * exchange_rate)

    bid_yen = round_half_up(bid_thousands * BID_MULTIPLIER)
    freight_inspection_yen = vehicle["freightInspectionYen"]
    total_yen = bid_yen + freight_inspection_yen

    # 33% of the bid only (freight excluded), paid to get the car shipped.
    shipment_payment_yen = round_half_up(bid_yen * SHIPMENT_PAYMENT_RATE)
    shipment_payment_pkr = to_pkr(shipment_payment_yen)

    bid_pkr = to_pkr(bid_yen)
    freight_inspection_pkr = to_pkr(freight_inspection_yen)
    japan_cost_pkr = bid_pkr + freight_inspection_pkr

    total_landed_cost_pkr = (
        japan_cost_pkr
        + vehicle["customsDutyPkr"]
        + vehicle["giftSchemePkr"]
        + vehicle["otherExpensePkr"]
    )

    return {
        "vehicle": vehicle,
        "inputs": {"bidThousands": bid_thousands, "bidYen": bid_yen, "exchangeRate": exchange_rate},
        "shipmentPayment": {
            "percentage": round_half_up(SHIPMENT_PAYMENT_RATE * 100),
            "yen": shipment_payment_yen,
            "pkr": shipment_payment_pkr,
        },
        "breakdown": {
            "bidYen": bid_yen,
            "bidPkr": bid_pkr,
            "freightInspectionYen": freight_inspection_yen,
            "freightInspectionPkr": freight_inspection_pkr,
            "totalYen": total_yen,
            "japanCostPkr": japan_cost_pkr,
            "customsDutyPkr": vehicle["customsDutyPkr"],
            "giftSchemePkr": vehicle["giftSchemePkr"],
            "otherExpensePkr": vehicle["otherExpensePkr"],
        },
        "totalLandedCostPkr": total_landed_cost_pkr,
        "remainingAfterShipmentPkr": total_landed_cost_pkr - shipment_payment_pkr,
    }
