@echo off
echo 🚀 Starting TestSynth MCP Explorer UI...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.6+ and try again
    pause
    exit /b 1
)

echo ✅ Python found
echo 🎨 Starting UI server...
echo.

python server.py

pause
