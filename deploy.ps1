# Deploy to GitHub Pages
# Usage: .\deploy.ps1

Write-Host "🚀 Deploying to GitHub Pages..." -ForegroundColor Green
Write-Host ""

# Create docs folder
Write-Host "📦 Creating docs folder..." -ForegroundColor Yellow
if (-not (Test-Path "docs")) {
    New-Item -ItemType Directory -Name "docs" | Out-Null
}

# Copy files to docs folder
Write-Host "📋 Copying files..." -ForegroundColor Yellow
$files = @(
    "advanced-v5.html",
    "plants-multilingual.js",
    "plants-advanced.js",
    "ai-advanced.js",
    "bluetooth-integration.js",
    "app-advanced.js",
    "style.css",
    "style_comprehensive.css",
    "style_new.css"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Copy-Item $file "docs/" -Force
        Write-Host "   ✅ Copied: $file"
    }
}

# Rename advanced-v5.html to index.html
Copy-Item "advanced-v5.html" "docs/index.html" -Force
Write-Host "   ✅ Created: docs/index.html"

# Copy markdown files for documentation
Copy-Item "README.md" "docs/" -Force -ErrorAction SilentlyContinue
Copy-Item "QUICK_BLUETOOTH_SETUP.md" "docs/" -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✅ Files ready in docs/" -ForegroundColor Green
Write-Host ""

# Git operations
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
Write-Host ""

git add docs/
git commit -m "Deploy: Website to GitHub Pages (docs folder)"
git push origin main

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your site is available at:" -ForegroundColor Cyan
Write-Host "   https://kab3shi6-lang.github.io/Smart-soil-analyzer-VISU/" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Note: It may take 1-2 minutes for changes to appear" -ForegroundColor Yellow
