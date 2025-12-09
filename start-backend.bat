@echo off
echo ============================================
echo Gift of Grace - Backend Server Startup
echo ============================================
echo.

REM IMPORTANT: RASA requires Python 3.10 (not 3.11 or 3.12)
set PYTHON310=py -3.10

cd /d "%~dp0backend"

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo [INFO] Virtual environment not found. Creating one with Python 3.10...
    echo [INFO] This may take a while on first run...
    %PYTHON310% -m venv venv
    if errorlevel 1 (
        echo [ERROR] Failed to create venv. Make sure Python 3.10 is installed.
        echo [ERROR] Install from: https://www.python.org/downloads/release/python-3107/
        pause
        exit /b 1
    )
    call venv\Scripts\activate.bat
    echo [INFO] Upgrading pip...
    python -m pip install --upgrade pip
    echo [INFO] Installing dependencies (this will take several minutes)...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
) else (
    call venv\Scripts\activate.bat
)

REM Check if .env has API key configured
findstr /C:"your_openai_api_key_here" .env >nul 2>&1
if not errorlevel 1 (
    echo.
    echo [WARNING] OpenAI API key not configured!
    echo [WARNING] Edit backend\.env and add your OPENAI_API_KEY
    echo [WARNING] Get a key from: https://platform.openai.com/api-keys
    echo.
    pause
)

echo.
echo [1/2] Starting RASA Action Server on port 5055...
start "RASA Actions Server" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate.bat && rasa run actions --port 5055"

echo.
echo Waiting for Action Server to initialize...
timeout /t 8 /nobreak > nul

echo [2/2] Starting RASA Server on port 5005...
start "RASA Server" cmd /k "cd /d %~dp0backend && call venv\Scripts\activate.bat && rasa run --cors * --enable-api --port 5005"

echo.
echo ============================================
echo Backend servers are starting...
echo.
echo RASA Server:    http://localhost:5005
echo Actions Server: http://localhost:5055
echo REST Webhook:   http://localhost:5005/webhooks/rest/webhook
echo.
echo NOTE: First startup takes 30-60 seconds to load models.
echo ============================================
echo.
pause
