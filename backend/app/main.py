import json
import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from .calculator import calculate_import_cost
from .config import DEFAULT_EXCHANGE_RATE, SHIPMENT_PAYMENT_RATE
from .errors import AppError
from .validators import validate_calculation_input
from .vehicles import VEHICLES

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Japan Car Import Calculator API",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    redoc_url=None,
)


def error_response(status_code, message, details=None):
    error = {"message": message}
    if details:
        error["details"] = details
    return JSONResponse({"error": error}, status_code=status_code)


@app.middleware("http")
async def no_store(request: Request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store"
    return response


@app.exception_handler(AppError)
async def handle_app_error(request: Request, exc: AppError):
    return error_response(exc.status_code, exc.message, exc.details)


@app.exception_handler(StarletteHTTPException)
async def handle_http_error(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 405:
        return error_response(405, f"Method {request.method} not allowed")
    return error_response(exc.status_code, str(exc.detail))


@app.exception_handler(Exception)
async def handle_unexpected_error(request: Request, exc: Exception):
    logger.exception("Unhandled error")
    return error_response(500, "Internal server error")


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/vehicles")
def list_vehicles():
    """All vehicles with their fixed (non-editable) costs."""
    return {
        "data": VEHICLES,
        "meta": {
            "defaultExchangeRate": DEFAULT_EXCHANGE_RATE,
            "shipmentPaymentPercentage": round(SHIPMENT_PAYMENT_RATE * 100),
        },
    }


@app.post("/api/calculate")
async def calculate(request: Request):
    """Body: { vehicleId, bidThousands, exchangeRate }"""
    try:
        body = json.loads(await request.body())
    except ValueError:
        raise AppError(400, "Request body must be valid JSON")
    return {"data": calculate_import_cost(**validate_calculation_input(body))}
