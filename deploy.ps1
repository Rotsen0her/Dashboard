# Script de deploy para Windows/PowerShell
# Uso: .\deploy.ps1

Write-Host "🚀 Iniciando deploy..." -ForegroundColor Cyan

# Verificar Docker
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker no está instalado" -ForegroundColor Red
    exit 1
}

Write-Host "📥 Pulling latest changes..." -ForegroundColor Yellow
git pull origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error pulling from Git" -ForegroundColor Red
    exit 1
}

Write-Host "🛑 Stopping containers..." -ForegroundColor Yellow
docker compose down

Write-Host "🔨 Building containers..." -ForegroundColor Yellow
docker compose build --no-cache

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error building containers" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Starting containers..." -ForegroundColor Yellow
docker compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error starting containers" -ForegroundColor Red
    exit 1
}

Write-Host "⏳ Waiting for services..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "📊 Container status:" -ForegroundColor Yellow
docker compose ps

Write-Host ""
Write-Host "✅ Deploy completed!" -ForegroundColor Green
Write-Host "🔍 Check logs: docker compose logs -f" -ForegroundColor Cyan
Write-Host "🌐 Access: http://localhost" -ForegroundColor Cyan
