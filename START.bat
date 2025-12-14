@echo off
title Gift of Grace - Launcher
color 0A

:menu
cls
echo.
echo  ================================================
echo       GIFT OF GRACE - ONE CLICK LAUNCHER
echo  ================================================
echo.
echo   Choose how to run the application:
echo.
echo   [1] DEMO MODE (Recommended for presentations)
echo       - Website + Admin Panel
echo       - Chatbot uses mock responses
echo       - Fastest startup
echo.
echo   [2] FULL MODE with RASA (Local AI)
echo       - Website + Admin Panel + RASA Chatbot
echo       - Requires trained RASA model
echo       - Slower startup, uses more resources
echo.
echo   [3] CLOUD MODE with Hugging Face
echo       - Website + Admin Panel
echo       - Chatbot connects to Hugging Face API
echo       - Requires internet connection
echo.
echo   [4] EXIT
echo.
echo  ================================================
echo.
set /p choice="  Enter choice [1-4]: "

if "%choice%"=="1" goto demo
if "%choice%"=="2" goto rasa
if "%choice%"=="3" goto cloud
if "%choice%"=="4" exit /b 0
goto menu

:demo
cls
echo.
echo  ========================================
echo     STARTING DEMO MODE
echo  ========================================
echo.

cd /d "%~dp0"

echo  [1/3] Installing dependencies...
call npm install --silent >nul 2>&1
cd backend
pip install fastapi uvicorn faiss-cpu sentence-transformers PyPDF2 python-multipart --quiet >nul 2>&1
cd ..

echo  [2/3] Starting Admin API (port 8001)...
start /min cmd /c "cd backend && python -m uvicorn admin_api:app --host 0.0.0.0 --port 8001"
timeout /t 3 /nobreak >nul

echo  [3/3] Starting Frontend (port 5173)...
start /min cmd /c "npm run dev"
timeout /t 5 /nobreak >nul

goto success

:rasa
cls
echo.
echo  ========================================
echo     STARTING FULL MODE WITH RASA
echo  ========================================
echo.

cd /d "%~dp0"

echo  [1/5] Installing dependencies...
call npm install --silent >nul 2>&1
cd backend
pip install fastapi uvicorn faiss-cpu sentence-transformers PyPDF2 python-multipart --quiet >nul 2>&1
pip install rasa --quiet >nul 2>&1

echo  [2/5] Starting RASA Actions Server (port 5055)...
start /min cmd /c "cd "%~dp0backend" && rasa run actions --port 5055"
timeout /t 5 /nobreak >nul

echo  [3/5] Starting RASA Server (port 5005)...
start /min cmd /c "cd "%~dp0backend" && rasa run --cors "*" --enable-api --port 5005"
timeout /t 10 /nobreak >nul

echo  [4/5] Starting Admin API (port 8001)...
start /min cmd /c "cd "%~dp0backend" && python -m uvicorn admin_api:app --host 0.0.0.0 --port 8001"
timeout /t 3 /nobreak >nul

cd ..
echo  [5/5] Starting Frontend (port 5173)...
start /min cmd /c "cd "%~dp0" && npm run dev"
timeout /t 5 /nobreak >nul

goto success

:cloud
cls
echo.
echo  ========================================
echo     STARTING CLOUD MODE (HUGGING FACE)
echo  ========================================
echo.
echo  NOTE: Make sure your Hugging Face Space is running!
echo  Space URL should be set in your .env file as:
echo  VITE_HF_API_URL=https://YOUR_USERNAME-giftofgrace-rag-api.hf.space
echo.

cd /d "%~dp0"

echo  [1/3] Installing dependencies...
call npm install --silent >nul 2>&1
cd backend
pip install fastapi uvicorn faiss-cpu sentence-transformers PyPDF2 python-multipart --quiet >nul 2>&1
cd ..

echo  [2/3] Starting Admin API (port 8001)...
start /min cmd /c "cd backend && python -m uvicorn admin_api:app --host 0.0.0.0 --port 8001"
timeout /t 3 /nobreak >nul

echo  [3/3] Starting Frontend (port 5173)...
start /min cmd /c "npm run dev"
timeout /t 5 /nobreak >nul

goto success

:success
echo.
echo  ========================================
echo     ALL SERVICES STARTED!
echo  ========================================
echo.
echo   WEBSITE:      http://localhost:5173
echo   ADMIN LOGIN:  http://localhost:5173/admin/login
echo   PASSWORD:     admin123
echo.
if "%choice%"=="2" (
echo   RASA API:     http://localhost:5005
echo   RASA Actions: http://localhost:5055
echo.
)
echo   ADMIN API:    http://localhost:8001
echo   API DOCS:     http://localhost:8001/docs
echo.
echo  ========================================
echo.

timeout /t 2 /nobreak >nul
start http://localhost:5173

echo  Browser opened!
echo.
echo  Press any key to STOP all services...
pause >nul

echo.
echo  Stopping all services...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1
echo  Done. Goodbye!
timeout /t 2 /nobreak >nul
