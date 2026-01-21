@echo off
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && call venv\Scripts\activate && python -m app.main"

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo ===================================================
echo AI Legal Helper is starting!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo ===================================================
