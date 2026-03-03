@echo off
echo ============================================
echo   METEORA CLOUD - Deploy to GitHub
echo ============================================
echo.

:: Set git path
set PATH=C:\Program Files\Git\cmd;%PATH%

:: Configure credential helper
git config --global credential.helper manager

:: Stage all changes
echo [1/4] Staging files...
git add .

:: Commit
echo [2/4] Committing...
set /p MSG="Commit message (or press Enter for default): "
if "%MSG%"=="" set MSG=Update Meteora Cloud Website
git commit -m "%MSG%"

:: Push
echo [3/4] Pushing to GitHub...
git push -u origin main --force

echo.
echo [4/4] Done! Check https://github.com/Ayoub-Sekoum/meteora-cloud-website
echo.
echo If Cloudflare Pages is connected, the site will auto-deploy.
echo ============================================
pause
