# Deploy brahmando.com static site WITHOUT GitHub Actions (billing bypass).
# Builds Next.js export and pushes to gh-pages branch.
#
# One-time GitHub setting (if Pages still uses Actions):
#   Repo Settings -> Pages -> Build and deployment -> Source: Deploy from branch -> gh-pages / (root)
#
# Usage:
#   .\scripts\deploy-pages-manual.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
Set-Location $Root

Write-Host "=== npm ci ==="
npm ci

Write-Host "=== npm run build ==="
$env:NEXT_PUBLIC_SITE_URL = "https://brahmando.com"
$env:NEXT_PUBLIC_EDUCATION_API_URL = "https://api.brahmando.com/education"
npm run build
if ($LASTEXITCODE -ne 0) { throw "npm run build failed" }

if (-not (Test-Path "out")) {
    throw "Build failed: out/ directory missing"
}

if (Test-Path "public/CNAME") {
    Copy-Item "public/CNAME" "out/CNAME" -Force
}
if (Test-Path ".nojekyll") {
    Copy-Item ".nojekyll" "out/.nojekyll" -Force
} else {
    New-Item -ItemType File -Path "out/.nojekyll" -Force | Out-Null
}

$deployDir = Join-Path $env:TEMP "brahmando-pages-deploy"
if (Test-Path $deployDir) {
    Remove-Item $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir | Out-Null
Copy-Item "out\*" $deployDir -Recurse -Force

Set-Location $deployDir
git init | Out-Null
git checkout -b gh-pages 2>$null
if ($LASTEXITCODE -ne 0) { git checkout gh-pages }
git add -A
git commit -m "Deploy brahmando.com static export $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

Write-Host "=== Pushing gh-pages branch ==="
git push -f git@github.com:Brahmando-ai/brahmando-web.git gh-pages

Write-Host ""
Write-Host "Done. If brahmando.com still shows old UI:"
Write-Host "  GitHub -> brahmando-web -> Settings -> Pages -> Source: Deploy from branch -> gh-pages"
Write-Host "  Then hard-refresh: Ctrl+Shift+R on /admin/education/"
