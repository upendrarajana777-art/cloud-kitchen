# Project Reorganization Script
# Run this from the CK directory: .\reorganize.ps1

Write-Host "🔄 Reorganizing Cloud Kitchen Project Structure..." -ForegroundColor Cyan

# Move remaining frontend files to client/
$filesToMove = @(
    "index.html",
    "package.json",
    "package-lock.json",
    "vite.config.js",
    "tailwind.config.js",
    "postcss.config.js",
    "eslint.config.js",
    ".env"
)

foreach ($file in $filesToMove) {
    if (Test-Path $file) {
        Write-Host "  Moving $file to client/" -ForegroundColor Yellow
        Move-Item -Path $file -Destination "client/$file" -Force
    }
}

# Move node_modules to client if it exists
if (Test-Path "node_modules") {
    Write-Host "  Moving node_modules to client/" -ForegroundColor Yellow
    Move-Item -Path "node_modules" -Destination "client/node_modules" -Force
}

Write-Host "`n✅ Reorganization Complete!" -ForegroundColor Green
Write-Host "`nNew Structure:" -ForegroundColor Cyan
Write-Host "  📁 client/   (React frontend)" -ForegroundColor White
Write-Host "  📁 server/   (Express backend)" -ForegroundColor White
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "  1. cd client" -ForegroundColor White
Write-Host "  2. npm install" -ForegroundColor White
Write-Host "  3. Update server scripts in root package.json" -ForegroundColor White
