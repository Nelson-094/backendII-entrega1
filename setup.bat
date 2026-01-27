@echo off
echo Setting up Ecommerce Authentication System...
echo.

REM Check if .env exists
if exist .env (
    echo .env file already exists
) else (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo .env file created successfully!
    echo.
    echo IMPORTANT: Please edit .env file and configure your MongoDB URI if needed
)

echo.
echo Setup complete!
echo.
echo To start the server:
echo   npm run dev
echo.
pause
