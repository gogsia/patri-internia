@echo off
echo Starting TripoSR Service...
cd /d "%~dp0"

if not exist venv (
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first
    pause
    exit /b 1
)

call venv\Scripts\activate.bat
python server.py

pause
