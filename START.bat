@echo off
title Gift of Grace - Starting...
color 0A

echo.
echo  ========================================
echo     GIFT OF GRACE - ONE CLICK LAUNCHER
echo  ========================================
echo.
echo  Starting all services... Please wait.
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo  [ERROR] Node.js is not installed!
    echo  Please install from: https://nodejs.org
    pause
    exit /b 1
)

:: Check if Python is installed
where python >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo  [ERROR] Python is not installed!
    echo  Please install from: https://python.org
    pause
    exit /b 1
)

:: Navigate to project directory
cd /d "%~dp0"

echo  [1/4] Installing frontend dependencies...
call npm install --silent >nul 2>&1

echo  [2/4] Installing backend dependencies...
cd backend
pip install fastapi uvicorn faiss-cpu sentence-transformers PyPDF2 python-multipart --quiet >nul 2>&1
cd ..

echo  [3/4] Starting Admin API (port 8001)...
start /min cmd /c "cd backend && python -m uvicorn admin_api:app --host 0.0.0.0 --port 8001"

:: Wait for Admin API to start
timeout /t 3 /nobreak >nul

echo  [4/4] Starting Frontend (port 5173)...
start /min cmd /c "npm run dev"

:: Wait for Frontend to start
timeout /t 5 /nobreak >nul

echo.
echo  ========================================
echo     ALL SERVICES STARTED SUCCESSFULLY!
echo  ========================================
echo.
echo  WEBSITE:     http://localhost:5173
echo  ADMIN LOGIN: http://localhost:5173/admin/login
echo  PASSWORD:    admin123
echo.
echo  ========================================
echo.

:: Open browser automatically
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo  Browser opened. Press any key to stop all services...
echo.
pause >nul

:: Kill all services
echo.
echo  Stopping services...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

echo  All services stopped. Goodbye!
timeout /t 2 /nobreak >nul
