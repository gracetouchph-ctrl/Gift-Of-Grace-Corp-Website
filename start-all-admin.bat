@echo off
REM Change to script directory
cd /d "%~dp0"

echo ============================================
echo Gift of Grace - Complete Startup (with Admin)
echo ============================================
echo.
echo This will start:
echo   1. RASA Backend Server (port 5005)
echo   2. RASA Actions Server (port 5055)
echo   3. Admin API Server (port 8001)
echo   4. Frontend Dev Server (port 5173)
echo.
echo PREREQUISITES:
echo   1. Python 3.10 installed
echo   2. Node.js installed
echo   3. All dependencies installed
echo.
echo Current directory: %CD%
echo.
pause

REM Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

REM Check Python
where python >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Please install Python first.
    pause
    exit /b 1
)

REM Install npm dependencies if needed
if not exist node_modules (
    echo [INFO] Installing npm dependencies...
    cd /d "%~dp0"
    npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install npm dependencies.
        pause
        exit /b 1
    )
)

REM Start RASA backend servers
echo.
echo [1/4] Starting RASA Backend Servers...

REM Go to backend directory
cd backend

REM Check if venv exists and create if needed
if exist venv\Scripts\activate.bat goto venv_exists

echo [INFO] Virtual environment not found. Creating one...
python -m venv venv
if errorlevel 1 (
    echo [ERROR] Failed to create venv.
    pause
    exit /b 1
)

call venv\Scripts\activate.bat
python -m pip install --upgrade pip
echo [INFO] Installing dependencies (this may take several minutes)...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b 1
)
goto venv_ready

:venv_exists
echo [INFO] Virtual environment found. Activating...
call venv\Scripts\activate.bat

:venv_ready

echo [INFO] Starting RASA Action Server on port 5055...
start "RASA Actions Server" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate.bat && rasa run actions --port 5055"
if errorlevel 1 (
    echo [WARNING] Failed to start RASA Actions Server window
)

echo [INFO] Waiting for Action Server to initialize...
timeout /t 8 /nobreak > nul

echo [INFO] Starting RASA Server on port 5005...
start "RASA Server" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate.bat && rasa run --cors * --enable-api --port 5005"
if errorlevel 1 (
    echo [WARNING] Failed to start RASA Server window
)

cd /d "%~dp0"

REM Wait for RASA to initialize
echo.
echo Waiting for RASA servers to initialize...
timeout /t 10 /nobreak > nul

REM Start Admin API
echo.
echo [2/4] Starting Admin API Server...
cd /d "%~dp0backend"
if not exist venv\Scripts\activate.bat (
    echo [ERROR] Virtual environment not found!
    echo [ERROR] This should not happen - venv should have been created in step 1.
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

call venv\Scripts\activate.bat
if errorlevel 1 (
    echo [ERROR] Failed to activate virtual environment.
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

REM Check if admin requirements are installed
python -c "import fastapi" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing admin API dependencies...
    pip install -r admin_requirements.txt
    if errorlevel 1 (
        echo [ERROR] Failed to install admin API dependencies.
        echo.
        echo Press any key to exit...
        pause >nul
        exit /b 1
    )
    echo [INFO] Admin API dependencies installed successfully!
)

echo [INFO] Starting Admin API Server on port 8001...
start "Admin API Server" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate.bat && python -m uvicorn admin_api:app --host 0.0.0.0 --port 8001 --reload"
if errorlevel 1 (
    echo [WARNING] Failed to start Admin API Server window
)

cd /d "%~dp0"

REM Wait for Admin API to initialize
echo.
echo Waiting for Admin API to initialize...
timeout /t 5 /nobreak > nul

REM Start frontend
echo.
echo [3/4] Starting Frontend Server...
cd /d "%~dp0"
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"
if errorlevel 1 (
    echo [WARNING] Failed to start Frontend Server window
)

echo.
echo ============================================
echo [4/4] All servers starting!
echo.
echo RASA Server:    http://localhost:5005
echo Actions Server: http://localhost:5055
echo Admin API:      http://localhost:8001
echo Frontend:       http://localhost:5173
echo Admin Panel:    http://localhost:5173/admin/login
echo.
echo Default Admin Password: admin123
echo.
echo Wait about 30-60 seconds for everything to load.
echo.
echo NOTE: This window can be closed. Servers are running in separate windows.
echo ============================================
echo.
echo Press any key to close this window (servers will keep running)...
pause >nul

