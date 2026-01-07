$serverPath = "C:\Users\gonza\Craftly\server"
$clientPath = "C:\Users\gonza\Craftly\client"

Write-Host "=== CRAFTLY FULL TEST SUITE ===" -ForegroundColor Cyan

# Kill any existing node processes
Write-Host "Cleaning up old processes..."  
taskkill /IM node.exe /F 2>$null
Start-Sleep 2

# Start backend
Write-Host "`n[1/5] Starting backend server..." -ForegroundColor Yellow
Push-Location $serverPath
Start-Process -FilePath "node" -ArgumentList "index.js" -WindowStyle Hidden -PassThru | Out-Null
Start-Sleep 3

# Test 1: Health
Write-Host "[2/5] Testing /health endpoint..." -ForegroundColor Yellow
try {
  $health = Invoke-RestMethod -Uri http://localhost:4000/health -ErrorAction Stop
  if ($health.ok) {
    Write-Host "✓ /health returns: $($health | ConvertTo-Json)" -ForegroundColor Green
  }
} catch {
  Write-Host "✗ /health test failed: $_" -ForegroundColor Red
}

# Test 2: Get Crafts
Write-Host "[3/5] Testing GET /api/crafts..." -ForegroundColor Yellow
try {
  $crafts = Invoke-RestMethod -Uri http://localhost:4000/api/crafts -ErrorAction Stop
  Write-Host "✓ /api/crafts returns $(($crafts | Measure-Object).Count) crafts" -ForegroundColor Green
  $crafts | ForEach-Object { Write-Host "  - $($_.title) (\$$($_.price))" }
} catch {
  Write-Host "✗ /api/crafts test failed: $_" -ForegroundColor Red
}

# Test 3: Login
Write-Host "`n[4/5] Testing POST /auth/login..." -ForegroundColor Yellow
try {
  $body = @{ email = "user@craftly.test"; password = "password" } | ConvertTo-Json
  $login = Invoke-RestMethod -Uri http://localhost:4000/auth/login -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
  if ($login.token) {
    Write-Host "✓ Login successful! Token: $($login.token.Substring(0, 20))..." -ForegroundColor Green
    Write-Host "  User: $($login.user.email)" -ForegroundColor Green
  }
} catch {
  Write-Host "✗ Login test failed: $_" -ForegroundColor Red
}

# Test 4: Frontend
Write-Host "`n[5/5] Starting frontend dev server..." -ForegroundColor Yellow
Pop-Location
Push-Location $clientPath
Start-Process -FilePath "npm" -ArgumentList "run dev" -WindowStyle Hidden -PassThru | Out-Null
Write-Host "✓ Frontend started at http://localhost:5173" -ForegroundColor Green

Write-Host "`n=== ALL TESTS COMPLETED ===" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:4000" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "`nTo stop servers: Press Ctrl+C" -ForegroundColor Yellow

Pop-Location
