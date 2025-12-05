@echo off
REM Smart Soil Website - Quick Start Script
REM This script sets everything up and starts the Bridge server

echo.
echo =========================================
echo   Smart Soil Analyzer - Quick Start
echo =========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Checking Node.js installation...
node --version
echo.

REM Check if npm modules are installed
if not exist "node_modules" (
    echo [2/4] Installing dependencies...
    call npm install
) else (
    echo [2/4] Dependencies already installed
)
echo.

REM Run setup script
echo [3/4] Running setup...
node setup-auto-readings.js
echo.

REM Start the Bridge server
echo [4/4] Starting Bridge Server...
echo.
echo =========================================
echo   Bridge is now running!
echo =========================================
echo.
echo To access the website:
echo   Open browser to: http://localhost:3000/advanced-v5-auto.html
echo.
echo To stop the Bridge, press Ctrl+C
echo.
echo =========================================
echo.

node bridge.js

pause
