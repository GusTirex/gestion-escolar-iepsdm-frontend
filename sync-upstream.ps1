# ============================================================
# sync-upstream.ps1
# Trae los cambios del repo original del equipo (upstream) y los
# sube a tu repo (origin). Ejecuta esto cada vez que tus companeros
# avancen, para mantener tu repo al dia.
#   Uso:  .\sync-upstream.ps1
# ============================================================
$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

Write-Host "[sync] Trayendo cambios de upstream (equipo)..." -ForegroundColor Cyan
git fetch upstream
git checkout main
git merge upstream/main
Write-Host "[sync] Subiendo a tu repo (origin)..." -ForegroundColor Cyan
git push origin main
Write-Host "[sync] Listo. AWS (Amplify) se actualizara solo con este push." -ForegroundColor Green
