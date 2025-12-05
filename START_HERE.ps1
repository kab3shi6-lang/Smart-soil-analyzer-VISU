# Smart Soil Website - PowerShell Quick Start
# Run this file with: powershell -ExecutionPolicy Bypass -File START_HERE.ps1

Write-Host "`n" -ForegroundColor Green
Write-Host "╔═══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Smart Soil Analyzer - Quick Start        ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n"

# Check Node.js
Write-Host "[1/4] Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($null -eq $nodeVersion) {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install from: https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "[2/4] Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✓ Dependencies already installed" -ForegroundColor Green
}
Write-Host ""

# Run setup
Write-Host "[3/4] Running setup..." -ForegroundColor Yellow
node setup-auto-readings.js
Write-Host ""

# Start Bridge
Write-Host "[4/4] Starting Bridge Server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "╔═══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  Bridge is now running!                  ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Open your browser to:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000/advanced-v5-auto.html" -ForegroundColor White
Write-Host ""
Write-Host "🛑 To stop: Press Ctrl+C" -ForegroundColor Yellow
Write-Host ""

node bridge.js
