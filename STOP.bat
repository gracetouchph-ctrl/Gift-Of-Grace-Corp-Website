@echo off
title Gift of Grace - Stopping Services
color 0E

echo.
echo  Stopping all Gift of Grace services...
echo.

taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

echo  All services stopped.
echo.
timeout /t 2 /nobreak >nul
