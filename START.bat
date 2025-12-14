@echo off
title Gift of Grace - Launcher
color 0A
mode con: cols=60 lines=35

:menu
cls
echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║                                                      ║
echo  ║        GIFT OF GRACE - ONE CLICK LAUNCHER            ║
echo  ║                                                      ║
echo  ╠══════════════════════════════════════════════════════╣
echo  ║                                                      ║
echo  ║   Choose how to run the application:                 ║
echo  ║                                                      ║
echo  ║   [1] DEMO MODE                                       ║
echo  ║       Website + Admin Panel                          ║
echo  ║       (No AI chatbot - fastest startup)              ║
echo  ║                                                      ║
echo  ║   [2] RASA MODE                                      ║
echo  ║       Website + Admin + Local AI Chatbot             ║
echo  ║       (Slower startup, works offline)                ║
echo  ║                                                      ║
echo  ║   [3] CLOUD MODE (Recommended)                       ║
echo  ║       Website + Admin + AI Chatbot                   ║
echo  ║       (Uses Gemini/OpenAI/OpenRouter)                ║
echo  ║                                                      ║
echo  ║   [4] STOP ALL SERVICES                              ║
echo  ║                                                      ║
echo  ║   [5] EXIT                                           ║
echo  ║                                                      ║
echo  ╚══════════════════════════════════════════════════════╝
echo.
set /p choice="  Enter choice [1-5]: "

if "%choice%"=="1" goto demo
if "%choice%"=="2" goto rasa
if "%choice%"=="3" goto cloud
if "%choice%"=="4" goto stop
if "%choice%"=="5" exit /b 0
goto menu

:demo
cls
echo.
echo  ══════════════════════════════════════════════════════
echo     STARTING DEMO MODE
echo  ══════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo  [1/3] Installing dependencies...
call npm install --silent >nul 2>&1
cd backend
pip install fastapi uvicorn faiss-cpu sentence-transformers PyPDF2 python-multipart --quiet >nul 2>&1
cd ..

echo  [2/3] Starting Admin API (port 8001)...
start /min "Admin API" cmd /c "cd backend && python -m uvicorn admin_api:app --host 0.0.0.0 --port 8001"
timeout /t 3 /nobreak >nul

echo  [3/3] Starting Frontend (port 5173)...
start /min "Frontend" cmd /c "npm run dev"
timeout /t 5 /nobreak >nul

goto success

:rasa
cls
echo.
echo  ══════════════════════════════════════════════════════
echo     STARTING FULL MODE WITH RASA
echo  ══════════════════════════════════════════════════════
echo.
echo  Note: This may take a few minutes...
echo.

cd /d "%~dp0"

echo  [1/5] Installing dependencies...
call npm install --silent >nul 2>&1
cd backend
pip install fastapi uvicorn faiss-cpu sentence-transformers PyPDF2 python-multipart --quiet >nul 2>&1

echo  [2/5] Starting RASA Actions (port 5055)...
start /min "RASA Actions" cmd /c "cd "%~dp0backend" && rasa run actions --port 5055"
timeout /t 5 /nobreak >nul

echo  [3/5] Starting RASA Server (port 5005)...
start /min "RASA Server" cmd /c "cd "%~dp0backend" && rasa run --cors "*" --enable-api --port 5005"
timeout /t 10 /nobreak >nul

echo  [4/5] Starting Admin API (port 8001)...
start /min "Admin API" cmd /c "cd "%~dp0backend" && python -m uvicorn admin_api:app --host 0.0.0.0 --port 8001"
timeout /t 3 /nobreak >nul

cd ..
echo  [5/5] Starting Frontend (port 5173)...
start /min "Frontend" cmd /c "cd "%~dp0" && npm run dev"
timeout /t 5 /nobreak >nul

goto success

:cloud
cls
echo.
echo  ══════════════════════════════════════════════════════
echo     STARTING CLOUD MODE (HUGGING FACE)
echo  ══════════════════════════════════════════════════════
echo.
echo  Chatbot will use: Gemini / OpenAI / OpenRouter
echo.

cd /d "%~dp0"

echo  [1/3] Installing dependencies...
call npm install --silent >nul 2>&1
cd backend
pip install fastapi uvicorn faiss-cpu sentence-transformers PyPDF2 python-multipart --quiet >nul 2>&1
cd ..

echo  [2/3] Starting Admin API (port 8001)...
start /min "Admin API" cmd /c "cd backend && python -m uvicorn admin_api:app --host 0.0.0.0 --port 8001"
timeout /t 3 /nobreak >nul

echo  [3/3] Starting Frontend (port 5173)...
start /min "Frontend" cmd /c "npm run dev"
timeout /t 5 /nobreak >nul

goto success

:success
cls
echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║                                                      ║
echo  ║            ALL SERVICES STARTED!                     ║
echo  ║                                                      ║
echo  ╠══════════════════════════════════════════════════════╣
echo  ║                                                      ║
echo  ║   WEBSITE:       http://localhost:5173               ║
echo  ║                                                      ║
echo  ║   ADMIN LOGIN:   http://localhost:5173/admin/login   ║
echo  ║   PASSWORD:      admin123                            ║
echo  ║                                                      ║
echo  ║   ADMIN API:     http://localhost:8001               ║
echo  ║   API DOCS:      http://localhost:8001/docs          ║
echo  ║                                                      ║
if "%choice%"=="2" (
echo  ║   RASA API:      http://localhost:5005               ║
echo  ║   RASA Actions:  http://localhost:5055               ║
echo  ║                                                      ║
)
echo  ╠══════════════════════════════════════════════════════╣
echo  ║                                                      ║
echo  ║   [1] Open Website in Browser                        ║
echo  ║   [2] Open Admin Panel in Browser                    ║
echo  ║   [3] Stop All Services                              ║
echo  ║   [4] Back to Main Menu                              ║
echo  ║                                                      ║
echo  ╚══════════════════════════════════════════════════════╝
echo.
set /p action="  Enter choice [1-4]: "

if "%action%"=="1" (
    start http://localhost:5173
    goto success
)
if "%action%"=="2" (
    start http://localhost:5173/admin/login
    goto success
)
if "%action%"=="3" goto stop
if "%action%"=="4" goto menu
goto success

:stop
cls
echo.
echo  ══════════════════════════════════════════════════════
echo     STOPPING ALL SERVICES
echo  ══════════════════════════════════════════════════════
echo.
echo  Stopping Node.js (Frontend)...
taskkill /f /im node.exe >nul 2>&1
echo  Stopping Python (Admin API, RASA)...
taskkill /f /im python.exe >nul 2>&1
echo.
echo  ══════════════════════════════════════════════════════
echo     ALL SERVICES STOPPED
echo  ══════════════════════════════════════════════════════
echo.
timeout /t 2 /nobreak >nul
goto menu
