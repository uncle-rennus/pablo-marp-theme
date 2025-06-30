#!/usr/bin/env pwsh

Write-Host "🔄 Building presentation with Marp..." -ForegroundColor Yellow
npx marp zappts-AI-as-a-service.md --theme ./themes/card-theme.css -o zappts-AI-as-a-service.html

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Marp build completed successfully" -ForegroundColor Green
    
    Write-Host "🔄 Post-processing HTML for markdown-in-divs..." -ForegroundColor Yellow
    node postprocess-marp-html.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Post-processing completed successfully" -ForegroundColor Green
        Write-Host "🎉 Presentation ready at: http://localhost:8000/zappts-AI-as-a-service.html" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Post-processing failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Marp build failed" -ForegroundColor Red
    exit 1
} 