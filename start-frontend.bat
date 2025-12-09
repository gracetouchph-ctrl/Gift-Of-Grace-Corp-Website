@echo off
echo ============================================
echo Gift of Grace - Frontend Server Startup
echo ============================================
echo.

cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing npm dependencies...
    npm install
)

echo Starting Vite development server...
npm run dev
