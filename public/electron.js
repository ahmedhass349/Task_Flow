/*
  FILE: public/electron.js
  PHASE: Phase 1
  MISSION: 3-Startup
  CHANGES:
    - P1.1: BrowserWindow pre-created in parallel with backend startup (show:false)
            so the Chromium renderer warms up while .NET is initialising,
            removing ~200–400ms from the user-visible startup path.
    - P1.2: Splash screen shown immediately from local HTML on app.ready —
            no backend connection needed, user gets instant visual feedback.
    - P1.5: Added .NET JIT startup env vars (DOTNET_TieredCompilation,
            DOTNET_TC_QuickJit, DOTNET_TC_QuickJitForLoops, DOTNET_NOLOGO,
            COMPlus_EnableDiagnostics) to reduce cold-start JIT time.
    - P1.7: Startup timeout reduced from 45s to 20s — error shown promptly.
    - Added fast-fail: if backend exits before signaling ready, the Promise
      rejects immediately instead of hanging until the timeout fires.
*/

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const IS_DEV = process.env.ELECTRON_IS_DEV === 'true';
const isProd = !IS_DEV;

let mainWindow;
let backendProcess;
let backendUrl;
let backendReady = false;
let dbReady = false;
let splashWindow = null;
let backendStdoutBuffer = "";

const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
}

// ── Logging Helper ────────────────────────────────────────────────────────
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  // Phase 6: console output is dev-only; production logging goes to file only.
  if (IS_DEV) {
    console.log(logMessage);
  }
  if (isProd) {
    const logDir = path.join(app.getPath('userData'), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    fs.appendFileSync(
      path.join(logDir, 'electron.log'),
      logMessage + '\n',
      { encoding: 'utf8' }
    );
  }
}

// ── Persistent JWT Key ────────────────────────────────────────────────────
// Generated once and stored in the user-data folder so the same key is used
// on every subsequent launch.  This makes JWT tokens long-lived across app
// restarts, which is required for the "Remember Me" feature to work.
function getOrCreateJwtKey() {
  const keyPath = path.join(app.getPath('userData'), 'jwt.key');
  try {
    if (fs.existsSync(keyPath)) {
      const existing = fs.readFileSync(keyPath, 'utf8').trim();
      // A valid key is 64 hex chars (32 random bytes)
      if (existing && existing.length >= 64) {
        log('Using persisted JWT key');
        return existing;
      }
    }
  } catch (err) {
    log(`WARNING: Could not read persisted JWT key: ${err.message}`);
  }

  const { randomBytes } = require('crypto');
  const key = randomBytes(32).toString('hex'); // 64 hex chars = 32 bytes
  try {
    fs.writeFileSync(keyPath, key, { encoding: 'utf8' });
    log(`Generated and persisted new JWT key at ${keyPath}`);
  } catch (err) {
    log(`WARNING: Could not persist JWT key (will work this session only): ${err.message}`);
  }
  return key;
}

// ── Backend Process Spawner ───────────────────────────────────────────────
function spawnBackend() {
  return new Promise((resolve, reject) => {
    log('Spawning ASP.NET Core backend...');

    let backendPath;
    let args;
    let workingDirectory;

    if (IS_DEV) {
      // Development: run from source project
      const projectRoot = process.cwd();
      const csprojPath = path.join(projectRoot, 'TaskFlow.csproj');
      log(`Project root: ${projectRoot}`);
      log(`Looking for: ${csprojPath}`);

      if (!fs.existsSync(csprojPath)) {
        log(`ERROR: Project file not found at ${csprojPath}`);
        reject(new Error(`TaskFlow.csproj not found at ${csprojPath}`));
        return;
      }

      backendPath = 'dotnet';
      args = ['run', '--project', csprojPath, '--no-launch-profile'];
      workingDirectory = projectRoot;
    } else {
      // Production: run from published backend artifacts packaged in resources/backend
      const backendDir = path.join(process.resourcesPath, 'backend');
      const winExePath = path.join(backendDir, 'taskflow.exe');
      const dllPath = path.join(backendDir, 'taskflow.dll');

      log(`Backend resources path: ${backendDir}`);

      if (process.platform === 'win32' && fs.existsSync(winExePath)) {
        backendPath = winExePath;
        args = [];
      } else if (fs.existsSync(dllPath)) {
        backendPath = 'dotnet';
        args = [dllPath];
      } else {
        const message = `Published backend artifact not found. Checked: ${winExePath} and ${dllPath}`;
        log(`ERROR: ${message}`);
        reject(new Error(message));
        return;
      }

      workingDirectory = backendDir;
    }

    // Use a deterministic backend URL in dev so webpack proxy (/api -> :5000) stays valid.
    const env = {
      ...process.env,
      ASPNETCORE_ENVIRONMENT: IS_DEV ? 'Development' : 'Production',
      // S-04: always specify the URL explicitly; never inherit undefined from the OS env.
      ASPNETCORE_URLS: IS_DEV ? 'http://127.0.0.1:5000' : 'http://127.0.0.1:0',
      // P-04: route the SQLite DB to the user's AppData/Roaming folder, not the read-only install dir.
      TASKFLOW_DB_PATH: IS_DEV ? '' : app.getPath('userData'),
      // Stable JWT signing key so tokens survive app restarts (required for Remember Me).
      TASKFLOW_JWT_KEY: getOrCreateJwtKey(),
      // P1.5: Tiered JIT compilation — hot code paths are identified at QuickJit speed
      // and then recompiled optimally. Reduces cold-start compilation overhead.
      DOTNET_TieredCompilation: '1',
      DOTNET_TC_QuickJit: '1',
      DOTNET_TC_QuickJitForLoops: '1',
      // P1.5: Suppress the .NET welcome banner and disable the diagnostics pipe.
      // The diagnostics pipe creation adds ~50ms of I/O on first launch.
      DOTNET_NOLOGO: '1',
      COMPlus_EnableDiagnostics: '0',
    };

    log(`Backend command: ${backendPath} ${args.join(' ')}`);
    log(`Backend cwd: ${workingDirectory}`);

    // Timeout safeguard — P1.7: reduced from 45s to 20s
    const startupTimeout = setTimeout(() => {
      log('ERROR: Backend startup timeout (20 seconds)');
      reject(new Error('Backend startup timeout'));
    }, 20000);

    // Spawn the backend process
    backendProcess = spawn(backendPath, args, {
      cwd: workingDirectory,
      env: env,
      stdio: 'pipe',
      windowsHide: true
    });

    backendProcess.stdout.on('data', (data) => {
      backendStdoutBuffer += data.toString();

      // Process complete lines only to avoid missing markers that arrive in split chunks.
      let newlineIndex = backendStdoutBuffer.indexOf('\n');
      while (newlineIndex !== -1) {
        const rawLine = backendStdoutBuffer.slice(0, newlineIndex);
        backendStdoutBuffer = backendStdoutBuffer.slice(newlineIndex + 1);
        const output = rawLine.trim();

        if (output) {
          log(`[BACKEND STDOUT] ${output}`);

          if (output.includes('TASKFLOW_DB_READY')) {
            dbReady = true;
            log('Database is ready');
          }

          const readyMatch = output.match(/TASKFLOW_BACKEND_READY:(.*)/);
          if (readyMatch && !backendReady) {
            backendUrl = readyMatch[1].trim();
            backendReady = true;
            log(`Backend is ready at ${backendUrl}`);
            clearTimeout(startupTimeout);
            resolve(backendUrl);
          }
        }

        newlineIndex = backendStdoutBuffer.indexOf('\n');
      }
    });

    backendProcess.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        log(`[BACKEND STDERR] ${output}`);

        // Check for DB error
        if (output.includes('TASKFLOW_DB_ERROR')) {
          clearTimeout(startupTimeout);
          reject(new Error(`Database error: ${output}`));
        }
      }
    });

    backendProcess.on('error', (error) => {
      clearTimeout(startupTimeout);
      log(`ERROR: Failed to spawn backend: ${error.message}`);
      reject(error);
    });

    backendProcess.on('exit', (code, signal) => {
      clearTimeout(startupTimeout);
      log(`Backend process exited with code ${code}, signal ${signal}`);
      // P1.1: Fast-fail if the backend exits before it has signaled ready.
      // Without this the startup would hang silently until the 20s timeout fires.
      if (!backendReady) {
        reject(new Error(
          `Backend exited prematurely (code: ${code}). Check electron.log for details.`
        ));
      } else if (!app.isQuitting) {
        // Backend crashed after it was already serving requests — quit the app.
        app.quit();
      }
    });
  });
}

// ── Splash Window ─────────────────────────────────────────────────────────
// P1.2: Shown immediately on app.ready — no backend connection required.
// Gives the user instant visual feedback during the backend startup phase.
function createSplashWindow() {
  log('Creating splash window...');
  splashWindow = new BrowserWindow({
    width: 420,
    height: 280,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    center: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      devTools: false,
    }
  });

  const splashPath = path.join(__dirname, 'splash.html');
  if (fs.existsSync(splashPath)) {
    splashWindow.loadFile(splashPath);
  } else {
    // Fallback inline page when splash.html is absent (e.g. dev without assets)
    splashWindow.loadURL(
      'data:text/html,<html style="background:%230f172a;display:flex;' +
      'align-items:center;justify-content:center;height:100vh;margin:0">' +
      '<p style="color:%23e2e8f0;font-family:sans-serif;font-size:18px">' +
      'Loading TaskFlow\u2026</p></html>'
    );
  }

  splashWindow.on('closed', () => { splashWindow = null; });
}

// ── Main Window — pre-creation ────────────────────────────────────────────
// P1.1: Called immediately on app.ready BEFORE the backend is ready.
// Creates a hidden BrowserWindow and loads about:blank so the Chromium renderer
// process starts warming up while .NET is initialising.
// loadMainWindow() then replaces about:blank with the real app URL.
function preCreateMainWindow() {
  log('Pre-creating main BrowserWindow (renderer warm-up)...');
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,            // Hidden until ready-to-show fires
    backgroundColor: '#0f172a', // Match app dark background — prevents white flash on show
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true,
      webSecurity: true,
      // DevTools only in dev — never exposed in production builds.
      devTools: IS_DEV,
    }
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.on('closed', () => { mainWindow = null; });

  // Load a blank page now to start the renderer process.
  // loadMainWindow() will replace this with the real app once the backend is ready.
  mainWindow.loadURL('about:blank');
}

// ── Main Window — load app ────────────────────────────────────────────────
// Called once spawnBackend() resolves. Loads the React app into the
// pre-created window and shows it as soon as the content is ready.
function loadMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    log('WARNING: mainWindow was lost before loadMainWindow — recreating');
    preCreateMainWindow();
  }

  if (IS_DEV) {
    log('Loading React app from webpack dev server...');
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(app.getAppPath(), 'wwwroot', 'index.html');
    log(`Loading React app from ${indexPath}`);
    if (fs.existsSync(indexPath)) {
      mainWindow.loadFile(indexPath);
    } else {
      log(`ERROR: index.html not found at ${indexPath}`);
      mainWindow.loadURL(`file://${path.join(__dirname, '../wwwroot/index.html')}`);
    }
  }

  mainWindow.once('ready-to-show', () => {
    log('Main window ready-to-show — dismissing splash');
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.destroy();
      splashWindow = null;
    }
    mainWindow.show();
    mainWindow.focus();
    log('Main window visible');
  });
}

function shutdownBackend() {
  return new Promise((resolve) => {
    if (!backendProcess || backendProcess.killed) {
      resolve();
      return;
    }

    log('Terminating backend process...');

    const timeout = setTimeout(() => {
      if (backendProcess && !backendProcess.killed) {
        log('Backend did not exit after SIGTERM, forcing kill');
        backendProcess.kill('SIGKILL');
      }
      resolve();
    }, 5000);

    backendProcess.once('exit', () => {
      clearTimeout(timeout);
      resolve();
    });

    backendProcess.kill('SIGTERM');
  });
}

// ── IPC Handlers ──────────────────────────────────────────────────────────
ipcMain.handle('get-backend-url', () => {
  log('IPC: get-backend-url requested');
  return backendUrl;
});

ipcMain.handle('get-startup-status', () => {
  log('IPC: get-startup-status requested');
  return {
    backendReady,
    dbReady,
    backendUrl
  };
});

ipcMain.handle('read-reset-code', () => {
  const tmpPath = path.join(require('os').tmpdir(), 'taskflow_reset_pending.tmp');
  try {
    const code = fs.readFileSync(tmpPath, 'utf8').trim();
    fs.unlinkSync(tmpPath);
    return code;
  } catch {
    return null;
  }
});

// ── Application Event Handlers ────────────────────────────────────────────
app.on('ready', async () => {
  log('Electron app ready');

  // P1.2: Show splash immediately — no backend needed.
  // User gets visual feedback in the first few milliseconds.
  createSplashWindow();

  // P1.1: Pre-create the main BrowserWindow NOW, in parallel with backend startup.
  // The Chromium renderer process warms up while .NET is initialising,
  // saving ~200–400ms from the user-visible startup path.
  preCreateMainWindow();

  try {
    await spawnBackend();
    log('Backend ready — loading app into pre-created window');
    loadMainWindow();
  } catch (error) {
    log(`ERROR: Backend failed to start: ${error.message}`);
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.destroy();
    }
    app.quit();
  }
});

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  }
});

app.on('window-all-closed', async () => {
  log('All windows closed');
  app.isQuitting = true;

  await shutdownBackend();
  app.quit();
});

app.on('activate', () => {
  // On macOS, re-create the window when the dock icon is clicked.
  // The backend is already running so pre-create and load immediately.
  if (mainWindow === null) {
    preCreateMainWindow();
    loadMainWindow();
  }
});

// Graceful shutdown handling
process.on('SIGINT', () => {
  (async () => {
    log('SIGINT received, shutting down...');
    app.isQuitting = true;
    await shutdownBackend();
    app.quit();
  })();
});

process.on('SIGTERM', () => {
  (async () => {
    log('SIGTERM received, shutting down...');
    app.isQuitting = true;
    await shutdownBackend();
    app.quit();
  })();
});

log('Electron main process loaded');
