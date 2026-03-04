@echo off
REM ===============================================
REM  Meteora Cloud - Deployment Script
REM  Git Push + Build + Cloudflare Pages Deploy
REM ===============================================
setlocal enabledelayedexpansion

echo.
echo ================================================
echo   METEORA CLOUD - DEPLOYMENT (SAFE MODE + GIT)
echo ================================================
echo.

REM ─── Step 0: Environment & Version Checks ──────
echo [1/6] Checking environment compatibility...
node -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [X] FATAL ERROR: Node.js is not installed or not in PATH.
    echo     Please install Node.js v18.17.0 or higher.
    pause
    exit /b 1
)

for /f "tokens=1,2,3 delims=." %%a in ('node -v') do (
    set NODE_MAJOR=%%a
    set NODE_MAJOR=!NODE_MAJOR:v=!
)
if !NODE_MAJOR! LSS 18 (
    echo [X] FATAL ERROR: Node.js version is too old ^(!NODE_MAJOR!^).
    echo     Meteora requires Node.js v18 or higher for Next.js 14/15.
    pause
    exit /b 1
)
echo [OK] Node.js version !NODE_MAJOR! is compatible.
echo.

REM ─── Step 1: Git Add + Commit ───────────
echo [2/6] Staging changes for Git...
git add -A
if %ERRORLEVEL% neq 0 (
    echo [X] ERROR: Failed to stage files. Check git status.
    pause
    exit /b 1
)

set /p COMMIT_MSG="Enter commit message (or press Enter for auto-date): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=deploy: automatic update %date% %time%

echo [3/6] Committing changes...
git commit -m "!COMMIT_MSG!"
REM We don't exit on commit failure because there might be nothing new to commit.

echo [4/6] Pushing to GitHub (origin main)...
git push origin main
if %ERRORLEVEL% neq 0 (
    echo [X] ERROR: Git push failed! 
    echo     Please check your internet connection or git remote settings.
    echo     You might need to 'git pull' first if there are conflicts.
    pause
    exit /b 1
)
echo [OK] Git push successful!
echo.

REM ─── Step 2: Build for production ──────────────
echo [5/6] Building Next.js for static production...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [X] FATAL ERROR: Next.js Build failed! 
    echo     Deployment aborted. Please check the terminal errors above (Typescript/Linting).
    pause
    exit /b 1
)

if not exist "out" (
    echo [X] FATAL ERROR: The 'out' directory was not generated!
    echo     Ensure next.config.mjs has 'output: "export"' configured.
    pause
    exit /b 1
)
echo [OK] Build successful and verified!
echo.

REM ─── Step 3: Cloudflare Deploy ──────────────
echo [6/6] Deploying 'out' folder to Cloudflare Pages...
call npm run deploy
if %ERRORLEVEL% neq 0 (
    echo [X] FATAL ERROR: Cloudflare deployment failed!
    echo     Check your wrangler authentication ^(run 'npx wrangler login'^) or internet connection.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   [SUCCESS] DEPLOYMENT COMPLETATO PERFETTAMENTE
echo ================================================
echo.
echo   - Codice salvato su: GitHub (origin/main)
echo   - Sito pubblicato su: Cloudflare Pages
echo.
echo   Dashboard: https://dash.cloudflare.com
echo ================================================
echo.
pause
