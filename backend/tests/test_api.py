from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}
    assert res.headers["cache-control"] == "no-store"


def test_lists_the_four_vehicles():
    res = client.get("/api/vehicles")
    assert res.status_code == 200
    body = res.json()
    assert [v["id"] for v in body["data"]] == ["mira-2023", "mira-2024", "mira-2025", "raize-2021"]
    assert body["meta"]["shipmentPaymentPercentage"] == 33


def test_calculates_with_comma_strings():
    res = client.post("/api/calculate", json={"vehicleId": "raize-2021", "bidThousands": "1,850", "exchangeRate": "1.82"})
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["shipmentPayment"]["yen"] == 610_500
    assert data["totalLandedCostPkr"] == 5_322_000


def test_returns_422_with_field_details_for_bad_input():
    res = client.post("/api/calculate", json={"vehicleId": "", "bidThousands": 0, "exchangeRate": -1})
    assert res.status_code == 422
    error = res.json()["error"]
    assert error["message"] == "Invalid calculation input"
    assert set(error["details"]) == {"vehicleId", "bidThousands", "exchangeRate"}


def test_returns_400_for_malformed_json_and_405_for_get():
    res = client.post("/api/calculate", content="{bad", headers={"Content-Type": "application/json"})
    assert res.status_code == 400
    assert res.json()["error"]["message"] == "Request body must be valid JSON"

    res = client.get("/api/calculate")
    assert res.status_code == 405
    assert "error" in res.json()


def test_returns_404_for_unknown_vehicle():
    res = client.post("/api/calculate", json={"vehicleId": "nope", "bidThousands": 1000, "exchangeRate": 1})
    assert res.status_code == 404
