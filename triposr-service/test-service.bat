@echo off
echo Testing TripoSR Service...
cd /d "%~dp0"

if not exist venv (
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first
    pause
    exit /b 1
)

call venv\Scripts\activate.bat

if "%1"=="" (
    python test-service.py
) else (
    python test-service.py %1
)

pause
