$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendScript = Join-Path $projectRoot "backend\run-server.ps1"

Write-Host "Starting backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoProfile","-ExecutionPolicy Bypass","-File","$backendScript" -NoNewWindow

Write-Host "Starting frontend server..." -ForegroundColor Cyan
Set-Location $projectRoot
npm run dev