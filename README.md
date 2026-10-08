# Japan Car Import Calculator

Works out the 33% shipping payment and the total landed cost (Pakistan) for Japanese auction cars.
Hosted on Vercel: the React frontend is a static site, the API is a FastAPI app running as a Python function.

```
api/index.py             Vercel entry point; every /api/* request is rewritten here
backend/                 API (FastAPI)
  app/
    main.py              routes: GET /api/vehicles, POST /api/calculate, GET /api/health
    config.py            constants (33% rate, bid multiplier, default exchange rate)
    vehicles.py          <- fixed duty / freight / gift scheme / other expense
    calculator.py        <- the calculation
    validators.py        request validation
    errors.py            AppError -> { error: { message, details? } }
  tests/                 pytest
  requirements-dev.txt   uvicorn, pytest, httpx
frontend/                React + Vite UI (mobile-first)
requirements.txt         Python deps installed by Vercel
vercel.json              build, function and /api rewrite settings
```

## Run locally

Double-click `start-dev.bat` (opens http://localhost:5173), or:

```powershell
python -m venv .venv
.\.venv\Scripts\pip install -r backend\requirements-dev.txt
npm install --prefix frontend

# terminal 1: API on http://localhost:8000 (docs at /api/docs)
cd backend; ..\.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
# terminal 2: UI on http://localhost:5173, proxies /api to :8000
npm run dev --prefix frontend
```

Tests: `cd backend; ..\.venv\Scripts\python -m pytest`

## Deploy to Vercel

```powershell
npm install -g vercel   # once
vercel login            # once, opens the browser
vercel --prod           # first time it asks to create/link a project
```

## How the calculation works

- Bid is typed in thousands: `1,850` → ¥1,850,000.
- **Pay to ship** = 33% × bid (yen), also shown in PKR at the entered rate.
- **Total landed cost (PKR)** = (bid + freight/inspection) × exchange rate + customs duty + gift scheme + other expense.

| Vehicle    | Customs duty | Freight + inspection | Gift scheme | Other expense |
|------------|-------------:|---------------------:|------------:|--------------:|
| Mira 2023  | PKR 1,000,000 | ¥210,000 | PKR 320,000 | PKR 180,000 |
| Mira 2024  | PKR 1,170,000 | ¥210,000 | PKR 350,000 | PKR 180,000 |
| Mira 2025  | PKR 1,350,000 | ¥210,000 | PKR 350,000 | PKR 180,000 |
| Raize 2021 | PKR 1,000,000 | ¥250,000 | PKR 320,000 | PKR 180,000 |

To change a rate, edit `backend/app/vehicles.py` and redeploy. The UI shows these values but can't edit them.

## API

- `GET  /api/vehicles` — vehicles with their fixed costs
- `POST /api/calculate` — body `{ "vehicleId": "raize-2021", "bidThousands": 1850, "exchangeRate": 1.82 }`
- Errors: `{ "error": { "message": "...", "details": { "field": "..." } } }`
- Interactive docs: `/api/docs`
