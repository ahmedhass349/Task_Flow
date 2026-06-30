@echo off
setlocal enabledelayedexpansion
title Task Flow - Production Build
color 0A
cls

rem ============================================================================
rem  TASK FLOW - WINDOWS INSTALLER BUILD
rem
rem  Produces a self-contained Tauri NSIS installer for Windows.
rem
rem  Build machine prerequisites:
rem    - Rust plus x86_64-pc-windows-msvc target
rem    - Node.js 18 or newer plus npm
rem    - .NET 10 SDK, matching TaskFlow.csproj
rem    - Visual Studio Build Tools with C++ MSVC tooling
rem
rem  End-user machine prerequisites:
rem    - None for .NET, Node.js, or Rust
rem    - WebView2 is handled by Tauri's Windows installer configuration
rem ============================================================================

echo.
echo  ================================================================
echo    Task Flow - Production Build
echo    Started: %DATE% %TIME%
echo  ================================================================
echo.

rem --- Configuration -----------------------------------------------------------
set "SOLUTION_ROOT=%~dp0"
set "FRONTEND_DIR=%SOLUTION_ROOT%"
set "REACT_SOURCE_DIR=%SOLUTION_ROOT%ReactApp"
set "BACKEND_PROJECT=%SOLUTION_ROOT%TaskFlow.csproj"
set "BACKEND_PROJECT_NAME=taskflow"
set "TAURI_DIR=%SOLUTION_ROOT%src-tauri"
set "TAURI_CONF=%TAURI_DIR%\tauri.conf.json"
set "CARGO_TOML=%TAURI_DIR%\Cargo.toml"
set "BINARIES_DIR=%TAURI_DIR%\binaries"
set "TARGET_TRIPLE=x86_64-pc-windows-msvc"
set "SIDECAR_STEM=taskflow-backend"
set "SIDECAR_NAME=%SIDECAR_STEM%-%TARGET_TRIPLE%.exe"
set "BUILD_ROOT=%SOLUTION_ROOT%.build"
set "BACKEND_PUBLISH_DIR=%BUILD_ROOT%\backend-publish"
set "OUTPUT_DIR=%TAURI_DIR%\target\%TARGET_TRIPLE%\release\bundle\nsis"
set "MSI_DIR=%TAURI_DIR%\target\%TARGET_TRIPLE%\release\bundle\msi"
set "MIN_NODE_MAJOR=18"
set "REQUIRED_DOTNET_MAJOR=10"
set "VSWHERE=%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe"

echo  [CONFIG] Build paths
echo    Solution root : %SOLUTION_ROOT%
echo    Frontend root : %FRONTEND_DIR%
echo    React source  : %REACT_SOURCE_DIR%
echo    Backend csproj: %BACKEND_PROJECT%
echo    Tauri dir     : %TAURI_DIR%
echo    Binaries dir  : %BINARIES_DIR%
echo    Sidecar exe   : %SIDECAR_NAME%
echo    NSIS output   : %OUTPUT_DIR%
echo.

rem --- Project layout ----------------------------------------------------------
echo  [CHECK] Verifying project layout...

if not exist "%FRONTEND_DIR%package.json" (
    call :Fail "package.json not found at the solution root." "Expected: %FRONTEND_DIR%package.json"
    goto :Halt
)

if not exist "%FRONTEND_DIR%package-lock.json" (
    call :Fail "package-lock.json not found." "Production builds require deterministic npm ci installs."
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

if not exist "%FRONTEND_DIR%wwwroot\index.html" (
    call :Fail "wwwroot index.html not found." "Expected: %FRONTEND_DIR%wwwroot\index.html"
    goto :Halt
)

if not exist "%BACKEND_PROJECT%" (
    call :Fail "Backend project file not found." "Expected: %BACKEND_PROJECT%"
    goto :Halt
)

if not exist "%TAURI_DIR%\" (
    call :Fail "src-tauri directory not found." "Expected: %TAURI_DIR%"
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

if not exist "%TAURI_DIR%\assets\license.txt" (
    call :Fail "Tauri license asset not found." "Expected: %TAURI_DIR%\assets\license.txt"
    goto :Halt
)

if not exist "%TAURI_DIR%\icons\icon.ico" (
    call :Fail "Tauri icon.ico not found." "Expected: %TAURI_DIR%\icons\icon.ico"
    goto :Halt
)

if not exist "%TAURI_DIR%\icons\32x32.png" (
    call :Fail "Tauri 32x32 icon not found." "Expected: %TAURI_DIR%\icons\32x32.png"
    goto :Halt
)

if not exist "%TAURI_DIR%\icons\128x128.png" (
    call :Fail "Tauri 128x128 icon not found." "Expected: %TAURI_DIR%\icons\128x128.png"
    goto :Halt
)

if not exist "%TAURI_DIR%\icons\128x128@2x.png" (
    call :Fail "Tauri 128x128@2x icon not found." "Expected: %TAURI_DIR%\icons\128x128@2x.png"
    goto :Halt
)

findstr /c:"build:web" "%FRONTEND_DIR%package.json" >nul 2>&1
if errorlevel 1 (
    call :Fail "package.json is missing the build:web script." "BUILD_WINDOWS.bat runs npm run build:web before publishing."
    goto :Halt
)

findstr /c:"tauri build --target %TARGET_TRIPLE%" "%FRONTEND_DIR%package.json" >nul 2>&1
if errorlevel 1 (
    echo    [WARN] package.json does not expose the expected tauri:build:win script.
    echo           This script calls npx tauri build directly.
)

echo    [OK] Project layout verified
echo.

rem --- Tauri configuration sanity ---------------------------------------------
echo  [CHECK] Verifying Tauri packaging configuration...

findstr /c:"binaries/taskflow-backend" "%TAURI_CONF%" >nul 2>&1
if errorlevel 1 (
    call :Fail "tauri.conf.json externalBin does not reference binaries/taskflow-backend." "The sidecar name must match %SIDECAR_NAME% after Tauri adds the target triple."
    goto :Halt
)

findstr /c:"../wwwroot/dist" "%TAURI_CONF%" >nul 2>&1
if not errorlevel 1 (
    call :Fail "tauri.conf.json frontendDist points to ../wwwroot/dist." "Because the main window loads index.html, frontendDist must include wwwroot/index.html. Set it to ../wwwroot."
    goto :Halt
)

findstr /c:"../wwwroot" "%TAURI_CONF%" >nul 2>&1
if errorlevel 1 (
    call :Fail "tauri.conf.json frontendDist does not point to ../wwwroot." "Set build.frontendDist to ../wwwroot so index.html and dist assets are bundled."
    goto :Halt
)

findstr /c:"nsis" "%TAURI_CONF%" >nul 2>&1
if errorlevel 1 (
    call :Fail "tauri.conf.json does not enable the NSIS bundle target." "Add nsis to bundle.targets."
    goto :Halt
)

findstr /c:"currentUser" "%TAURI_CONF%" >nul 2>&1
if errorlevel 1 (
    call :Fail "tauri.conf.json does not configure currentUser install mode." "Set bundle.windows.nsis.installMode to currentUser to avoid admin elevation."
    goto :Halt
)

findstr /c:"webviewInstallMode" "%TAURI_CONF%" >nul 2>&1
if errorlevel 1 (
    call :Fail "tauri.conf.json does not explicitly configure WebView2 install mode." "Add bundle.windows.webviewInstallMode so clean-machine behavior is intentional."
    goto :Halt
)

findstr /c:"beforeBuildCommand" "%TAURI_CONF%" | findstr /c:"npm run build:web" >nul 2>&1
if not errorlevel 1 (
    echo    [WARN] Tauri beforeBuildCommand also runs npm run build:web.
    echo           The frontend may build twice. This is safe but slower.
)

echo    [OK] Tauri configuration verified
echo.

rem --- Prerequisites -----------------------------------------------------------
echo  [CHECK] Verifying build prerequisites...

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

rustup target list --installed 2>nul | findstr /c:"%TARGET_TRIPLE%" >nul 2>&1
if errorlevel 1 (
    echo    [INFO] Rust target %TARGET_TRIPLE% is missing. Adding it now...
    rustup target add %TARGET_TRIPLE%
    if errorlevel 1 (
        call :Fail "Failed to add Rust target %TARGET_TRIPLE%." "Run manually: rustup target add %TARGET_TRIPLE%"
        goto :Halt
    )
)
echo    [OK] Rust target %TARGET_TRIPLE%

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

set "MSVC_FOUND=0"
where cl >nul 2>&1
if not errorlevel 1 set "MSVC_FOUND=1"
where link >nul 2>&1
if not errorlevel 1 set "MSVC_FOUND=1"
if "!MSVC_FOUND!"=="0" (
    if exist "!VSWHERE!" (
        "!VSWHERE!" -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath >nul 2>&1
        if not errorlevel 1 set "MSVC_FOUND=1"
    )
)
if "!MSVC_FOUND!"=="0" (
    call :Fail "MSVC C++ build tools were not found." "Install Visual Studio Build Tools with the Desktop development with C++ workload."
    goto :Halt
)
echo    [OK] MSVC build tools detected
echo.

rem --- Database safety ---------------------------------------------------------
echo  [CHECK] Verifying no local database files will be packaged...

set "DB_FOUND=0"
for /r "%SOLUTION_ROOT%" %%f in (*.db *.db-wal *.db-shm *.sqlite *.sqlite3) do (
    echo    [FOUND] %%~ff
    set "DB_FOUND=1"
)

if "!DB_FOUND!"=="1" (
    call :Fail "Database files were found under the solution root." "Delete or move the files listed above before building the installer."
    goto :Halt
)
echo    [OK] No database files found
echo.

rem --- Clean previous artifacts ------------------------------------------------
echo  [1/7] Cleaning previous build artifacts...

if not exist "%BINARIES_DIR%\" (
    mkdir "%BINARIES_DIR%"
    if errorlevel 1 (
        call :Fail "Failed to create Tauri binaries directory." "Path: %BINARIES_DIR%"
        goto :Halt
    )
)

if exist "%BINARIES_DIR%\%SIDECAR_NAME%" (
    del /f /q "%BINARIES_DIR%\%SIDECAR_NAME%" >nul 2>&1
    if errorlevel 1 (
        call :Fail "Failed to delete previous sidecar binary." "Path: %BINARIES_DIR%\%SIDECAR_NAME%"
        goto :Halt
    )
)

if exist "%BINARIES_DIR%\%SIDECAR_NAME%" (
    call :Fail "Previous sidecar binary still exists after deletion." "Close any running Task Flow process and retry."
    goto :Halt
)

if exist "%BACKEND_PUBLISH_DIR%" (
    rd /s /q "%BACKEND_PUBLISH_DIR%" >nul 2>&1
    if errorlevel 1 (
        call :Fail "Failed to remove previous backend publish directory." "Path: %BACKEND_PUBLISH_DIR%"
        goto :Halt
    )
)

if exist "%OUTPUT_DIR%" (
    rd /s /q "%OUTPUT_DIR%" >nul 2>&1
    if errorlevel 1 (
        call :Fail "Failed to remove previous NSIS output directory." "Path: %OUTPUT_DIR%"
        goto :Halt
    )
)

if exist "%MSI_DIR%" (
    rd /s /q "%MSI_DIR%" >nul 2>&1
    if errorlevel 1 (
        call :Fail "Failed to remove previous MSI output directory." "Path: %MSI_DIR%"
        goto :Halt
    )
)

if not exist "%BUILD_ROOT%\" (
    mkdir "%BUILD_ROOT%"
    if errorlevel 1 (
        call :Fail "Failed to create build workspace." "Path: %BUILD_ROOT%"
        goto :Halt
    )
)

echo    [OK] Previous artifacts cleaned
echo.

rem --- npm dependencies --------------------------------------------------------
echo  [2/7] Installing deterministic npm dependencies...

pushd "%FRONTEND_DIR%"
if errorlevel 1 (
    call :Fail "Failed to change to frontend root." "Path: %FRONTEND_DIR%"
    goto :Halt
)

call npm ci --prefer-offline
if errorlevel 1 (
    popd
    call :Fail "npm ci failed." "Fix npm dependency errors above and retry."
    goto :Halt
)

if not exist "%FRONTEND_DIR%node_modules\@tauri-apps\cli\" (
    popd
    call :Fail "Tauri CLI package is missing after npm ci." "Expected node_modules\@tauri-apps\cli"
    goto :Halt
)

if not exist "%FRONTEND_DIR%node_modules\@tauri-apps\api\" (
    popd
    call :Fail "Tauri API package is missing after npm ci." "Expected node_modules\@tauri-apps\api"
    goto :Halt
)

call npx tauri --version >nul 2>&1
if errorlevel 1 (
    popd
    call :Fail "Tauri CLI is not available through npx after npm ci." "Verify @tauri-apps/cli is installed."
    goto :Halt
)
for /f "tokens=*" %%v in ('npx tauri --version 2^>^&1') do set "TAURI_VER=%%v"
echo    [OK] !TAURI_VER!

popd
if errorlevel 1 (
    call :Fail "Failed to return from frontend root after npm install." "The command stack is inconsistent."
    goto :Halt
)

echo    [OK] npm dependencies installed
echo.

rem --- TypeScript --------------------------------------------------------------
echo  [3/7] Running TypeScript type check...

pushd "%FRONTEND_DIR%"
if errorlevel 1 (
    call :Fail "Failed to change to frontend root for TypeScript." "Path: %FRONTEND_DIR%"
    goto :Halt
)

call npx tsc --noEmit
if errorlevel 1 (
    popd
    call :Fail "TypeScript type check failed." "Fix the reported TypeScript errors before packaging."
    goto :Halt
)

popd
if errorlevel 1 (
    call :Fail "Failed to return from frontend root after TypeScript check." "The command stack is inconsistent."
    goto :Halt
)

echo    [OK] TypeScript passed
echo.

rem --- Frontend build ----------------------------------------------------------
echo  [4/7] Building React frontend with Webpack...

pushd "%FRONTEND_DIR%"
if errorlevel 1 (
    call :Fail "Failed to change to frontend root for Webpack." "Path: %FRONTEND_DIR%"
    goto :Halt
)

call npm run build:web
if errorlevel 1 (
    popd
    call :Fail "Frontend build failed." "Fix the Webpack errors above before packaging."
    goto :Halt
)

popd
if errorlevel 1 (
    call :Fail "Failed to return from frontend root after Webpack build." "The command stack is inconsistent."
    goto :Halt
)

if not exist "%FRONTEND_DIR%wwwroot\index.html" (
    call :Fail "Frontend index.html is missing after build." "Expected: %FRONTEND_DIR%wwwroot\index.html"
    goto :Halt
)

if not exist "%FRONTEND_DIR%wwwroot\dist\main.js" (
    call :Fail "Frontend main.js is missing after build." "Expected: %FRONTEND_DIR%wwwroot\dist\main.js"
    goto :Halt
)

if not exist "%FRONTEND_DIR%wwwroot\dist\vendor.js" (
    call :Fail "Frontend vendor.js is missing after build." "Expected: %FRONTEND_DIR%wwwroot\dist\vendor.js"
    goto :Halt
)

if not exist "%FRONTEND_DIR%wwwroot\dist\main.css" (
    call :Fail "Frontend main.css is missing after build." "Expected: %FRONTEND_DIR%wwwroot\dist\main.css"
    goto :Halt
)

if not exist "%FRONTEND_DIR%wwwroot\dist\splashscreen.html" (
    call :Fail "Splashscreen file was not copied into dist." "Expected: %FRONTEND_DIR%wwwroot\dist\splashscreen.html"
    goto :Halt
)

set "JS_CHUNKS=0"
for %%f in ("%FRONTEND_DIR%wwwroot\dist\*.js") do (
    if exist "%%~ff" set /a JS_CHUNKS+=1
)

echo    [OK] Frontend built with !JS_CHUNKS! JavaScript file(s)
echo.

rem --- Backend publish ---------------------------------------------------------
echo  [5/7] Publishing ASP.NET Core backend as self-contained win-x64...

if not exist "%BACKEND_PUBLISH_DIR%\" (
    mkdir "%BACKEND_PUBLISH_DIR%"
    if errorlevel 1 (
        call :Fail "Failed to create backend publish directory." "Path: %BACKEND_PUBLISH_DIR%"
        goto :Halt
    )
)

dotnet publish "%BACKEND_PROJECT%" ^
    --configuration Release ^
    --runtime win-x64 ^
    --self-contained true ^
    -p:PublishSingleFile=true ^
    -p:IncludeNativeLibrariesForSelfExtract=true ^
    -p:IncludeAllContentForSelfExtract=true ^
    -p:EnableCompressionInSingleFile=true ^
    -p:PublishTrimmed=false ^
    -p:DebugType=None ^
    -p:DebugSymbols=false ^
    --output "%BACKEND_PUBLISH_DIR%" ^
    --nologo ^
    -v minimal

if errorlevel 1 (
    call :Fail "dotnet publish failed." "Fix the .NET build errors above before packaging."
    goto :Halt
)

if not exist "%BACKEND_PUBLISH_DIR%\%BACKEND_PROJECT_NAME%.exe" (
    dir "%BACKEND_PUBLISH_DIR%\" 2>nul
    call :Fail "Published backend executable was not found." "Expected: %BACKEND_PUBLISH_DIR%\%BACKEND_PROJECT_NAME%.exe"
    goto :Halt
)

set "EXTRA_PUBLISH_FILES=0"
for %%f in ("%BACKEND_PUBLISH_DIR%\*") do (
    if exist "%%~ff" (
        if /i not "%%~nxf"=="%BACKEND_PROJECT_NAME%.exe" (
            if /i not "%%~nxf"=="web.config" (
                if /i not "%%~nxf"=="%BACKEND_PROJECT_NAME%.staticwebassets.endpoints.json" (
                    if /i not "%%~nxf"=="appsettings.json" (
                        if /i not "%%~nxf"=="appsettings.Production.json" (
                            echo    [FOUND] Unexpected publish file: %%~nxf
                            set "EXTRA_PUBLISH_FILES=1"
                        )
                    )
                )
            )
        )
    )
)

if "!EXTRA_PUBLISH_FILES!"=="1" (
    call :Fail "Backend publish produced extra files that would not be bundled as the sidecar." "The publish must be a complete single executable."
    goto :Halt
)

for %%s in ("%BACKEND_PUBLISH_DIR%\%BACKEND_PROJECT_NAME%.exe") do (
    set "BACKEND_SIZE=%%~zs"
    set /a BACKEND_SIZE_MB=!BACKEND_SIZE! / 1048576
)

if !BACKEND_SIZE_MB! LSS 10 (
    call :Fail "Published backend exe is suspiciously small: !BACKEND_SIZE_MB! MB." "Self-contained ASP.NET Core publish should be much larger than 10 MB."
    goto :Halt
)

move /y "%BACKEND_PUBLISH_DIR%\%BACKEND_PROJECT_NAME%.exe" "%BINARIES_DIR%\%SIDECAR_NAME%" >nul
if errorlevel 1 (
    call :Fail "Failed to move backend exe into Tauri binaries." "Target: %BINARIES_DIR%\%SIDECAR_NAME%"
    goto :Halt
)

if not exist "%BINARIES_DIR%\%SIDECAR_NAME%" (
    call :Fail "Sidecar binary is missing after move." "Expected: %BINARIES_DIR%\%SIDECAR_NAME%"
    goto :Halt
)

copy /y "%BACKEND_PUBLISH_DIR%\appsettings.json" "%BINARIES_DIR%\" >nul 2>&1
copy /y "%BACKEND_PUBLISH_DIR%\appsettings.Production.json" "%BINARIES_DIR%\" >nul 2>&1
if errorlevel 1 (
    call :Fail "Failed to copy appsettings to Tauri binaries." "Target: %BINARIES_DIR%"
    goto :Halt
)

rd /s /q "%BACKEND_PUBLISH_DIR%" >nul 2>&1
if errorlevel 1 (
    call :Fail "Failed to remove backend publish temp directory." "Path: %BACKEND_PUBLISH_DIR%"
    goto :Halt
)

echo    [OK] Backend sidecar built: %SIDECAR_NAME% (!BACKEND_SIZE_MB! MB)
echo.

rem --- Tauri build -------------------------------------------------------------
echo  [6/7] Building Tauri application and NSIS installer...
echo    This can take several minutes on the first Rust release build.
echo.

pushd "%FRONTEND_DIR%"
if errorlevel 1 (
    call :Fail "Failed to change to frontend root for Tauri build." "Path: %FRONTEND_DIR%"
    goto :Halt
)

call npx tauri build --target %TARGET_TRIPLE%
if errorlevel 1 (
    popd
    call :Fail "Tauri build failed." "Review the Rust or NSIS errors above."
    goto :Halt
)

popd
if errorlevel 1 (
    call :Fail "Failed to return from frontend root after Tauri build." "The command stack is inconsistent."
    goto :Halt
)

echo    [OK] Tauri build completed
echo.

rem --- Output verification -----------------------------------------------------
echo  [7/7] Verifying installer output...

if not exist "%OUTPUT_DIR%\" (
    call :Fail "NSIS output directory was not created." "Expected: %OUTPUT_DIR%"
    goto :Halt
)

set "INSTALLER_COUNT=0"
set "LAST_INSTALLER="
for %%f in ("%OUTPUT_DIR%\*.exe") do (
    if exist "%%~ff" (
        set /a INSTALLER_COUNT+=1
        set "LAST_INSTALLER=%%~ff"
    )
)

if "!INSTALLER_COUNT!"=="0" (
    call :Fail "No NSIS installer exe was produced." "Expected an installer under: %OUTPUT_DIR%"
    goto :Halt
)

for %%s in ("!LAST_INSTALLER!") do (
    set "INSTALLER_SIZE=%%~zs"
    set /a INSTALLER_SIZE_MB=!INSTALLER_SIZE! / 1048576
)

if !INSTALLER_SIZE_MB! LSS 10 (
    call :Fail "Installer exe is suspiciously small: !INSTALLER_SIZE_MB! MB." "Verify the backend sidecar and frontend assets were bundled."
    goto :Halt
)

echo    [OK] Installer output verified
echo.

echo  ================================================================
echo    BUILD COMPLETE
echo  ================================================================
echo.
echo    Backend sidecar:
echo      %BINARIES_DIR%\%SIDECAR_NAME%
echo      Size: !BACKEND_SIZE_MB! MB
echo.
echo    NSIS installer output:
for %%f in ("%OUTPUT_DIR%\*.exe") do (
    if exist "%%~ff" (
        for %%s in ("%%~ff") do (
            set "FILE_SIZE=%%~zs"
            set /a FILE_SIZE_MB=!FILE_SIZE! / 1048576
        )
        echo      %%~ff
        echo      Size: !FILE_SIZE_MB! MB
        echo.
    )
)

if exist "%MSI_DIR%\" (
    echo    MSI output:
    for %%f in ("%MSI_DIR%\*.msi") do (
        if exist "%%~ff" (
            echo      %%~ff
        )
    )
    echo.
)

echo    Self-contained checklist:
echo      .NET runtime: embedded by self-contained publish
echo      Node.js: not needed at runtime
echo      Rust: not needed at runtime
echo      Frontend: compiled static assets bundled by Tauri
echo      WebView2: handled by tauri.conf.json webviewInstallMode
echo      Install mode: current user, no admin required
echo.
echo  Press any key to close.
pause >nul
endlocal
exit /b 0

:Fail
echo.
color 0C
echo  ================================================================
echo    BUILD FAILED
echo  ================================================================
echo.
:FailLoop
if "%~1"=="" goto :FailEnd
echo    - %~1
shift
goto :FailLoop
:FailEnd
echo.
goto :Halt

:Halt
echo.
echo  Press any key to close.
pause >nul
endlocal
exit /b 1
