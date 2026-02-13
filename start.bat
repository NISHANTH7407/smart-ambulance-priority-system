@echo off
echo ========================================
echo Smart Ambulance Priority System
echo ========================================
echo.

echo Starting Backend...
start cmd /k "cd backend && mvn spring-boot:run"

timeout /t 10

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo System is starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to exit...
pause
