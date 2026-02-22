@echo off
setlocal enabledelayedexpansion

echo AI Career Platform Deployment Script
echo ====================================

:menu
echo.
echo Choose deployment option:
echo 1) Deploy Backend to Heroku
echo 2) Deploy Frontend to Netlify
echo 3) Deploy Frontend to Vercel
echo 4) Deploy Full Stack (Backend + Frontend)
echo 5) Exit
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    call :deploy_backend
    pause
    goto menu
) else if "%choice%"=="2" (
    call :deploy_frontend_netlify
    pause
    goto menu
) else if "%choice%"=="3" (
    call :deploy_frontend_vercel
    pause
    goto menu
) else if "%choice%"=="4" (
    call :deploy_backend
    echo Backend deployment completed. Please note your backend URL.
    set /p dummy="Press Enter after noting the backend URL to continue with frontend deployment..."
    call :deploy_frontend_vercel
    pause
    goto menu
) else if "%choice%"=="5" (
    exit /b
) else (
    echo Invalid choice
    pause
    cls
    goto menu
)

:deploy_backend
echo Deploying Backend to Heroku...
cd /d "%~dp0backend"

REM Check if Heroku CLI is installed
where heroku >nul 2>nul
if errorlevel 1 (
    echo Heroku CLI is not installed. Please install it from https://devcenter.heroku.com/articles/heroku-cli
    exit /b 1
)

REM Login to Heroku (this will prompt for credentials)
call heroku login || exit /b 1

set /p app_name="Enter your Heroku app name (or press Enter to create a new one): "
if "%app_name%"=="" (
    call heroku create || exit /b 1
) else (
    call heroku create %app_name% || exit /b 1
)

REM Set environment variables
echo Setting environment variables...
call heroku config:set MONGODB_URI="mongodb+srv://aiuser:Manicharan%4012@cluster0.7pa4of5.mongodb.net/ai-career-platform?retryWrites=true&w=majority" || exit /b 1
call heroku config:set JWT_SECRET=%RANDOM%%RANDOM%%RANDOM% || exit /b 1
call heroku config:set GEMINI_API_KEY="AIzaSyBcZLRzxeeYffXS5gonBHz3J-SodNyrMpQ" || exit /b 1

REM Deploy the app
git add .
git commit -m "Prepare for Heroku deployment" || echo "Continuing with deployment..."
git push heroku main || exit /b 1

echo Backend deployed successfully!
goto :eof

:deploy_frontend_netlify
echo Deploying Frontend to Netlify...
cd /d "%~dp0frontend"

REM Check if Netlify CLI is installed
where netlify >nul 2>nul
if errorlevel 1 (
    echo Installing Netlify CLI...
    npm install -g netlify-cli
)

REM Login to Netlify
call netlify login || exit /b 1

REM Build the frontend
call npm run build || exit /b 1

set /p backend_url="Enter your deployed backend URL (e.g., https://your-app-name.herokuapp.com/api): "

REM Create temporary env file for production build
echo REACT_APP_API_BASE_URL=!backend_url! > .env.production
copy .env.production .env /y

REM Rebuild with the production API URL
call npm run build || exit /b 1

REM Deploy to Netlify
call netlify deploy --dir=build --prod || exit /b 1

echo Frontend deployed successfully to Netlify!
goto :eof

:deploy_frontend_vercel
echo Deploying Frontend to Vercel...
cd /d "%~dp0frontend"

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if errorlevel 1 (
    echo Installing Vercel CLI...
    npm install -g vercel
)

REM Login to Vercel
call vercel login || exit /b 1

set /p backend_url="Enter your deployed backend URL (e.g., https://your-app-name.herokuapp.com/api): "

REM Deploy with environment variables
call vercel --prod --env REACT_APP_API_BASE_URL=!backend_url! || exit /b 1

echo Frontend deployed successfully to Vercel!
goto :eof