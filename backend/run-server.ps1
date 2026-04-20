# Ensure we're in the backend directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "Starting Sentinel AI Backend Server..." -ForegroundColor Green
Write-Host "Note: Administrator privileges enable real packet capture, but demo mode will work without them." -ForegroundColor Yellow
Write-Host ""

# Check if the executable exists
if (!(Test-Path "sentinel-backend.exe")) {
    Write-Host "sentinel-backend.exe not found. Building backend executable..." -ForegroundColor Cyan
    if (!(Get-Command go -ErrorAction SilentlyContinue)) {
        Write-Host "Error: Go command not found. Install Go or build from backend/main.go manually." -ForegroundColor Red
        exit 1
    }

    go build -o sentinel-backend.exe main.go
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: failed to build sentinel-backend.exe." -ForegroundColor Red
        exit 1
    }
}

# Start the server
Write-Host "Starting server on http://localhost:8080" -ForegroundColor Cyan
Write-Host "WebSocket endpoint: ws://localhost:8080/ws" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

try {
    .\sentinel-backend.exe
} catch {
    Write-Host "Error starting server: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    Write-Host "Server stopped." -ForegroundColor Yellow
}