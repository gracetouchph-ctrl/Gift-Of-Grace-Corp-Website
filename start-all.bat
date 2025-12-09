@echo off
echo ============================================
echo Gift of Grace - Full Stack Startup
echo ============================================
echo.
echo This will start both backend and frontend servers.
echo.
echo PREREQUISITES:
echo   1. Python 3.10 installed
echo   2. Node.js installed
echo   3. OpenAI API key in backend\.env
echo.
pause

REM Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

REM Install npm dependencies if needed
if not exist "node_modules" (
    echo [INFO] Installing npm dependencies...
    npm install
)

REM Start backend servers (this script handles venv creation)
echo.
echo Starting backend servers...
call "%~dp0start-backend.bat"

REM Wait for backend to initialize
echo.
echo Waiting for backend to initialize...
timeout /t 10 /nobreak > nul

REM Start frontend
echo.
echo Starting frontend server...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ============================================
echo All servers starting!
echo.
echo Backend:  http://localhost:5005
echo Frontend: http://localhost:5173 (will open in browser)
echo.
echo Wait about 30-60 seconds for everything to load.
echo ============================================
pause
