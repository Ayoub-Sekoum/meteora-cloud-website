@echo off
echo ============================================
echo   METEORA CLOUD - Deploy to GitHub
echo ============================================
echo.

:: Set git path
set PATH=C:\Program Files\Git\cmd;%PATH%

:: Stage all changes
echo [1/3] Staging files...
git add .

:: Commit
echo [2/3] Committing...
set /p MSG="Commit message (or press Enter for default): "
if "%MSG%"=="" set MSG=Update Meteora Cloud Website
git commit -m "%MSG%"

:: Push
echo [3/3] Pushing to GitHub...
git remote set-url origin https://Ayoub-Sekoum@github.com/Ayoub-Sekoum/meteora-cloud-website.git
git push -u origin main --force

echo.
echo [4/4] Done! Check https://github.com/Ayoub-Sekoum/meteora-cloud-website
echo.
echo If Cloudflare Pages is connected, the site will auto-deploy.
echo ============================================
pause
