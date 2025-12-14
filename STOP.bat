@echo off
title Gift of Grace - Stop Services
color 0C
mode con: cols=50 lines=15

cls
echo.
echo  ╔════════════════════════════════════════════╗
echo  ║                                            ║
echo  ║      STOPPING ALL SERVICES...              ║
echo  ║                                            ║
echo  ╚════════════════════════════════════════════╝
echo.
echo  Stopping Node.js (Frontend)...
taskkill /f /im node.exe >nul 2>&1
echo  Stopping Python (Admin API, RASA)...
taskkill /f /im python.exe >nul 2>&1
echo.
echo  ╔════════════════════════════════════════════╗
echo  ║                                            ║
echo  ║      ALL SERVICES STOPPED!                 ║
echo  ║                                            ║
echo  ╚════════════════════════════════════════════╝
echo.
echo  This window will close in 3 seconds...
timeout /t 3 /nobreak >nul
