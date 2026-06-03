@echo off
REM Awana Tracker GUI Launcher for Windows
REM Double-click this file to start the launcher

echo Starting Awana Tracker Launcher...
python launcher.py

if errorlevel 1 (
    echo.
    echo Error: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    echo.
    pause
)

@REM Made with Bob
