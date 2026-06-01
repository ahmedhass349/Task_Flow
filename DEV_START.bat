@echo off
setlocal enabledelayedexpansion
title Task Flow - Development Mode
color 0B
cls

rem ============================================================================
rem  TASK FLOW - DEVELOPMENT MODE
rem
rem  Starts the complete local desktop development environment:
rem    - Webpack dev server on http://localhost:3000
rem    - ASP.NET Core backend through src-tauri/src/backend.rs
rem    - Tauri desktop window
rem
rem  Stop with Ctrl+C or by closing the Tauri window.
rem ============================================================================

echo.
echo  ================================================================
echo    Task Flow - Development Mode
echo    Started: %DATE% %TIME%
echo  ================================================================
echo.

rem --- Configuration -----------------------------------------------------------
set "SOLUTION_ROOT=%~dp0"
set "FRONTEND_DIR=%SOLUTION_ROOT%"
set "REACT_SOURCE_DIR=%SOLUTION_ROOT%ReactApp"
set "BACKEND_PROJECT=%SOLUTION_ROOT%TaskFlow.csproj"
set "TAURI_DIR=%SOLUTION_ROOT%src-tauri"
set "TAURI_CONF=%TAURI_DIR%\tauri.conf.json"
set "CARGO_TOML=%TAURI_DIR%\Cargo.toml"
set "MIN_NODE_MAJOR=18"
set "REQUIRED_DOTNET_MAJOR=10"

echo  [CONFIG] Development paths
echo    Solution root : %SOLUTION_ROOT%
echo    Frontend root : %FRONTEND_DIR%
echo    React source  : %REACT_SOURCE_DIR%
echo    Backend csproj: %BACKEND_PROJECT%
echo    Tauri dir     : %TAURI_DIR%
echo.

rem --- Project layout ----------------------------------------------------------
echo  [CHECK] Verifying project layout...

if not exist "%FRONTEND_DIR%package.json" (
    call :Fail "package.json not found at the solution root." "Expected: %FRONTEND_DIR%package.json"
    goto :Halt
)

if not exist "%FRONTEND_DIR%package-lock.json" (
    call :Fail "package-lock.json not found." "Expected: %FRONTEND_DIR%package-lock.json"
    goto :Halt
)

if not exist "%FRONTEND_DIR%webpack.config.js" (
    call :Fail "webpack.config.js not found." "Expected: %FRONTEND_DIR%webpack.config.js"
    goto :Halt
)

if not exist "%FRONTEND_DIR%tsconfig.json" (
    call :Fail "tsconfig.json not found." "Expected: %FRONTEND_DIR%tsconfig.json"
    goto :Halt
)

if not exist "%REACT_SOURCE_DIR%\" (
    call :Fail "ReactApp source directory not found." "Expected: %REACT_SOURCE_DIR%"
    goto :Halt
)

if not exist "%BACKEND_PROJECT%" (
    call :Fail "Backend project file not found." "Expected: %BACKEND_PROJECT%"
    goto :Halt
)

if not exist "%TAURI_CONF%" (
    call :Fail "Tauri config not found." "Expected: %TAURI_CONF%"
    goto :Halt
)

if not exist "%CARGO_TOML%" (
    call :Fail "Cargo.toml not found." "Expected: %CARGO_TOML%"
    goto :Halt
)

findstr /c:"tauri:dev" "%FRONTEND_DIR%package.json" >nul 2>&1
if errorlevel 1 (
    call :Fail "package.json is missing the tauri:dev script." "Expected script: tauri dev"
    goto :Halt
)

findstr /c:"beforeDevCommand" "%TAURI_CONF%" >nul 2>&1
if errorlevel 1 (
    call :Fail "tauri.conf.json is missing beforeDevCommand." "Tauri dev must start the Webpack dev server."
    goto :Halt
)

findstr /c:"http://localhost:3000" "%TAURI_CONF%" >nul 2>&1
if errorlevel 1 (
    call :Fail "tauri.conf.json devUrl does not point to http://localhost:3000." "This repo's webpack dev server is configured on port 3000."
    goto :Halt
)

echo    [OK] Project layout verified
echo.

rem --- Prerequisites -----------------------------------------------------------
echo  [CHECK] Verifying development prerequisites...

rustc --version >nul 2>&1
if errorlevel 1 (
    call :Fail "Rust is not installed or not on PATH." "Install Rust from https://rustup.rs"
    goto :Halt
)
for /f "tokens=*" %%v in ('rustc --version 2^>^&1') do set "RUSTC_VER=%%v"
echo    [OK] !RUSTC_VER!

cargo --version >nul 2>&1
if errorlevel 1 (
    call :Fail "Cargo is not installed or not on PATH." "Cargo is installed with Rust from https://rustup.rs"
    goto :Halt
)
for /f "tokens=*" %%v in ('cargo --version 2^>^&1') do set "CARGO_VER=%%v"
echo    [OK] !CARGO_VER!

node --version >nul 2>&1
if errorlevel 1 (
    call :Fail "Node.js is not installed or not on PATH." "Install Node.js LTS from https://nodejs.org"
    goto :Halt
)
for /f "tokens=*" %%v in ('node --version 2^>^&1') do set "NODE_VER=%%v"
for /f "tokens=*" %%v in ('node -p "parseInt(process.versions.node, 10)" 2^>^&1') do set "NODE_MAJOR=%%v"
if "!NODE_MAJOR!"=="" (
    call :Fail "Could not determine Node.js major version." "Install Node.js %MIN_NODE_MAJOR% or newer."
    goto :Halt
)
if !NODE_MAJOR! LSS %MIN_NODE_MAJOR% (
    call :Fail "Node.js version is too old: !NODE_VER!" "Install Node.js %MIN_NODE_MAJOR% or newer."
    goto :Halt
)
echo    [OK] Node.js !NODE_VER!

set "NO_UPDATE_NOTIFIER=1"
call npm --version <nul >nul 2>&1
if errorlevel 1 (
    call :Fail "npm is not available." "Reinstall Node.js LTS with npm enabled."
    goto :Halt
)
for /f "tokens=*" %%v in ('npm --version 2^>^&1') do set "NPM_VER=%%v"
echo    [OK] npm !NPM_VER!

dotnet --version >nul 2>&1
if errorlevel 1 (
    call :Fail ".NET SDK is not installed or not on PATH." "Install .NET %REQUIRED_DOTNET_MAJOR% SDK from https://dotnet.microsoft.com"
    goto :Halt
)
dotnet --list-sdks | findstr /r /c:"^%REQUIRED_DOTNET_MAJOR%\." >nul 2>&1
if errorlevel 1 (
    call :Fail ".NET %REQUIRED_DOTNET_MAJOR% SDK is not installed." "TaskFlow.csproj targets net%REQUIRED_DOTNET_MAJOR%.0, so earlier SDKs are not enough."
    goto :Halt
)
for /f "tokens=*" %%v in ('dotnet --version 2^>^&1') do set "DOTNET_VER=%%v"
echo    [OK] .NET SDK !DOTNET_VER!
echo.

rem --- npm dependencies --------------------------------------------------------
echo  [CHECK] Verifying npm dependencies...

pushd "%FRONTEND_DIR%"
if errorlevel 1 (
    call :Fail "Failed to change to frontend root." "Path: %FRONTEND_DIR%"
    goto :Halt
)

set "NEED_NPM_INSTALL=0"
if not exist "node_modules\" set "NEED_NPM_INSTALL=1"
if not exist "node_modules\@tauri-apps\cli\" set "NEED_NPM_INSTALL=1"
if not exist "node_modules\@tauri-apps\api\" set "NEED_NPM_INSTALL=1"
if not exist "node_modules\webpack\" set "NEED_NPM_INSTALL=1"

if "!NEED_NPM_INSTALL!"=="1" (
    echo    node_modules missing or incomplete.
    echo    Installing dependencies with npm ci...
    echo.
    call npm ci --prefer-offline
    if errorlevel 1 (
        popd
        call :Fail "npm ci failed." "Fix npm dependency errors above and retry."
        goto :Halt
    )
) else (
    echo    [OK] Dependencies present
)

if not exist "node_modules\@tauri-apps\cli\" (
    popd
    call :Fail "Tauri CLI package is missing." "Expected: node_modules\@tauri-apps\cli"
    goto :Halt
)

call npx tauri --version >nul 2>&1
if errorlevel 1 (
    popd
    call :Fail "Tauri CLI is not available through npx." "Verify @tauri-apps/cli is installed."
    goto :Halt
)
for /f "tokens=*" %%v in ('npx tauri --version 2^>^&1') do set "TAURI_VER=%%v"
echo    [OK] !TAURI_VER!

popd
if errorlevel 1 (
    call :Fail "Failed to return from frontend root after dependency check." "The command stack is inconsistent."
    goto :Halt
)
echo.

rem --- Backend compile check ---------------------------------------------------
echo  [CHECK] Building backend once for development preflight...

dotnet build "%BACKEND_PROJECT%" --configuration Debug --nologo -v minimal
if errorlevel 1 (
    call :Fail "Backend Debug build failed." "Fix the C# compilation errors above before starting Tauri dev."
    goto :Halt
)

echo    [OK] Backend Debug build passed
echo.

rem --- Start dev ---------------------------------------------------------------
echo  [START] Launching Task Flow in development mode...
echo.
echo    What starts now:
echo      Webpack dev server : http://localhost:3000
echo      Backend API        : http://127.0.0.1:5000
echo      Tauri window       : opens automatically
echo.
echo    Hot reload is active for frontend changes.
echo    Backend changes require restarting this script.
echo    Press Ctrl+C to stop.
echo.

pushd "%FRONTEND_DIR%"
if errorlevel 1 (
    call :Fail "Failed to change to frontend root for Tauri dev." "Path: %FRONTEND_DIR%"
    goto :Halt
)

set "TAURI_DEV=1"
set "RUST_LOG=warn"
set "ASPNETCORE_ENVIRONMENT=Development"

call npm run tauri:dev
set "TAURI_EXIT=!ERRORLEVEL!"

popd
if errorlevel 1 (
    call :Fail "Failed to return from frontend root after Tauri dev." "The command stack is inconsistent."
    goto :Halt
)

if not "!TAURI_EXIT!"=="0" (
    call :Fail "Tauri dev exited with code !TAURI_EXIT!." "Common causes: Rust compile error, port 3000 in use, backend compile error, or tauri.conf.json syntax error."
    goto :Halt
)

echo.
echo  Task Flow development session ended.
echo.
echo  Press any key to close.
pause >nul
endlocal
exit /b 0

:Fail
echo.
color 0C
echo  ================================================================
echo    DEVELOPMENT START FAILED
echo  ================================================================
echo.
:FailLoop
if "%~1"=="" goto :FailEnd
echo    - %~1
shift
goto :FailLoop
:FailEnd
echo.
exit /b 1

:Halt
echo.
echo  Press any key to close.
pause >nul
endlocal
exit /b 1
