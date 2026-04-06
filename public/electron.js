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

    // Prepare environment - Production mode for SQLite + dynamic port
    const env = {
      ...process.env,
      ASPNETCORE_ENVIRONMENT: 'Production'
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
      const output = data.toString().trim();
      if (output) {
        log(`[BACKEND STDOUT] ${output}`);

        // Parse database ready marker
        if (output.includes('TASKFLOW_DB_READY')) {
          dbReady = true;
          log('Database is ready');
        }

        // Parse backend ready marker and extract URL
        const readyMatch = output.match(/TASKFLOW_BACKEND_READY:(.*)/);
        if (readyMatch) {
          backendUrl = readyMatch[1].trim();
          backendReady = true;
          log(`Backend is ready at ${backendUrl}`);
          clearTimeout(startupTimeout);
          resolve(backendUrl);
        }
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

app.on('window-all-closed', () => {
  log('All windows closed');
  app.isQuitting = true;
  
  // Kill backend process when app closes
  if (backendProcess && !backendProcess.killed) {
    log('Terminating backend process...');
    backendProcess.kill('SIGTERM');
  }
  
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
  log('SIGINT received, shutting down...');
  app.isQuitting = true;
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill('SIGTERM');
  }
  app.quit();
});

process.on('SIGTERM', () => {
  log('SIGTERM received, shutting down...');
  app.isQuitting = true;
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill('SIGTERM');
  }
  app.quit();
});

log('Electron main process loaded');
