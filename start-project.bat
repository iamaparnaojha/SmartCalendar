@echo off
REM Start script for Interactive Wall Calendar (Windows)
REM Usage: start-project.bat

echo.
echo 🏗️  Setting up Interactive Wall Calendar...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Setup complete!
echo.
echo 🚀 Starting development server...
echo.
echo 📺 Open your browser and go to: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
pause
