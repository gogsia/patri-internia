@echo off
echo ============================================
echo TripoSR Service - First Time Setup
echo ============================================
echo.

cd /d "%~dp0"

echo [1/4] Creating Python virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    echo Make sure Python 3.9+ is installed
    pause
    exit /b 1
)

echo [2/4] Activating virtual environment...
call venv\Scripts\activate.bat

echo [3/4] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo [4/4] Installing TripoSR...
pip install git+https://github.com/VAST-AI-Research/TripoSR.git
if errorlevel 1 (
    echo ERROR: Failed to install TripoSR
    pause
    exit /b 1
)

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Run: start-server.bat
echo 2. In another terminal, cd to project root and run: npm run dev
echo 3. Open http://localhost:3000
echo.
pause
