@echo off
rem Runs the FastAPI backend (:8000) and the React frontend (:5173, proxies /api to :8000)
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
  echo Creating Python virtual environment...
  python -m venv .venv || goto :error
)
echo Installing Python packages...
call .venv\Scripts\python.exe -m pip install -q -r backend\requirements-dev.txt || goto :error

if not exist "frontend\node_modules" (
  echo Installing frontend packages...
  pushd frontend && call npm install --no-audit --no-fund && popd || goto :error
)

start "Car Import Calculator - API :8000" cmd /k "cd /d "%~dp0backend" && ..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"
start "Car Import Calculator - UI :5173" cmd /k "cd /d "%~dp0frontend" && npm run dev"
timeout /t 6 /nobreak >nul
start "" http://localhost:5173
exit /b 0

:error
echo Setup failed. See the messages above.
pause
exit /b 1
