#!/bin/bash

# Deploy to GitHub Pages
# Usage: bash deploy.sh

echo "🚀 Deploying to GitHub Pages..."

# Build step (if needed)
echo "📦 Preparing files..."

# Create docs folder for GitHub Pages
mkdir -p docs

# Copy main files
cp advanced-v5.html docs/index.html
cp plants-multilingual.js docs/
cp plants-advanced.js docs/
cp ai-advanced.js docs/
cp bluetooth-integration.js docs/
cp app-advanced.js docs/
cp style*.css docs/
cp *.md docs/ 2>/dev/null || true

# Create CNAME for custom domain (optional)
# echo "your-domain.com" > docs/CNAME

echo "✅ Files copied to docs/"

# Git commands
echo "📤 Pushing to GitHub..."
git add docs/
git commit -m "Deploy: Add docs folder for GitHub Pages"
git push origin main

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at:"
echo "   https://kab3shi6-lang.github.io/Smart-soil-analyzer-VISU/"
