/*
  FILE: public/electron.js
  PHASE: Phase 2
  PURPOSE: Electron main process that spawns backend and manages the desktop window.
  FEATURES:
  - Spawns ASP.NET Core backend as child process
  - Parses TASKFLOW_DB_READY and TASKFLOW_BACKEND_READY markers
  - Creates BrowserWindow once backend is ready
  - Loads React frontend from webpack dev server or production build
  - IPC communication with preload script
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
let backendStdoutBuffer = "";

const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
}

// ── Logging Helper ────────────────────────────────────────────────────────
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  
  // Also write to file for production debugging
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
      ASPNETCORE_URLS: IS_DEV ? 'http://127.0.0.1:5000' : process.env.ASPNETCORE_URLS
    };

    log(`Backend command: ${backendPath} ${args.join(' ')}`);
    log(`Backend cwd: ${workingDirectory}`);

    // Timeout safeguard
    const startupTimeout = setTimeout(() => {
      log('ERROR: Backend startup timeout (45 seconds)');
      reject(new Error('Backend startup timeout'));
    }, 45000);

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
      // Exit app if backend crashes unexpectedly
      if (!app.isQuitting) {
        app.quit();
      }
    });
  });
}

// ── Create Main Window ────────────────────────────────────────────────────
function createWindow() {
  log('Creating BrowserWindow...');

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true,
      // Keep webSecurity enabled in all modes; backend CORS already supports dev renderer origin.
      webSecurity: true
    }
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  // Load the React frontend
  if (IS_DEV) {
    // Development: Load from webpack dev server
    log('Loading React app from webpack dev server...');
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // Production: Load from built assets
    const indexPath = path.join(app.getAppPath(), 'wwwroot', 'index.html');
    log(`Loading React app from ${indexPath}`);
    if (fs.existsSync(indexPath)) {
      mainWindow.loadFile(indexPath);
    } else {
      log(`ERROR: index.html not found at ${indexPath}`);
      mainWindow.loadURL(`file://${path.join(__dirname, '../wwwroot/index.html')}`);
    }
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
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

  // Spawn backend first
  try {
    await spawnBackend();
    log('Backend spawned successfully');
    
    // Only create window once backend is ready
    createWindow();
  } catch (error) {
    log(`ERROR: Backend failed to start: ${error.message}`);
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
  // On macOS, re-create window when dock icon is clicked
  if (mainWindow === null) {
    createWindow();
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
