@echo off
setlocal EnableDelayedExpansion

echo.
echo =========================================
echo   TaskFlow  ^|  Windows Build Script
echo =========================================
echo.
echo Steps:
echo   1. Build React frontend  (webpack)
echo   2. Publish .NET backend  (self-contained win-x64)
echo   3. Package Electron app  (NSIS installer + portable)
echo.

:: ── 1. Frontend ─────────────────────────────────────────────────────────
echo [1/3] Building React frontend...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  ERROR: React build failed. Check webpack output above.
    exit /b 1
)
echo        Frontend built successfully.
echo.

:: ── 2. Backend ──────────────────────────────────────────────────────────
echo [2/3] Publishing .NET backend ^(win-x64 self-contained^)...
call npm run publish:backend
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  ERROR: dotnet publish failed. Check output above.
    exit /b 1
)
echo        Backend published to publish\backend\
echo.

:: ── 3. Electron ─────────────────────────────────────────────────────────
echo [3/3] Packaging Electron application...
call npx electron-builder --config electron-builder.json
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  ERROR: electron-builder failed. Check output above.
    exit /b 1
)

echo.
echo =========================================
echo   BUILD COMPLETE
echo   Installer  ^>  dist\TaskFlow Setup*.exe
echo   Portable   ^>  dist\TaskFlow*.exe
echo =========================================
echo.
pause
