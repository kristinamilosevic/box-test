const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");

let win;
let backendProcess;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function startBackend() {
  let projectRoot;
  let pythonPath;
  let dbPath;

  if (isDev) {
    projectRoot = path.join(__dirname, '..');
    pythonPath = path.join(projectRoot, '.venv', 'bin', 'python');
    dbPath = path.join(projectRoot, 'app.db');
  } else {
    const resourcesPath = process.resourcesPath || path.join(process.execPath, '..', '..', 'resources');
    projectRoot = path.join(resourcesPath, 'app.asar.unpacked');
    pythonPath = process.platform === 'win32' ? 'python' : 'python3';
    dbPath = path.join(app.getPath('userData'), 'app.db');
  }

  const backendEnv = {
    ...process.env,
    PYTHONUNBUFFERED: '1',
    BACKEND_HOST: '127.0.0.1',
    BACKEND_PORT: '8080',
    DATABASE_URL: `sqlite:///${dbPath.replace(/\\/g, '/')}`
  };

  backendProcess = spawn(pythonPath, ['-m', 'backend.app.main'], {
    cwd: projectRoot,
    env: backendEnv
  });

  backendProcess.stdout.on('data', (data) => console.log(`Backend: ${data}`));
  backendProcess.stderr.on('data', (data) => console.error(`Backend Error: ${data}`));
  backendProcess.on('close', (code) => console.log(`Backend exited with code ${code}`));
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  setTimeout(() => {
    let htmlPath;
    if (isDev) {
      htmlPath = path.join(__dirname, '..', 'frontend', 'build', 'index.html');
      if (fs.existsSync(htmlPath)) {
        win.loadFile(htmlPath);
      }
      win.webContents.openDevTools();
    } else {
      const resourcesPath = process.resourcesPath || path.join(process.execPath, '..', '..', 'resources');
      htmlPath = path.join(resourcesPath, 'app.asar', 'frontend', 'build', 'index.html');
      win.loadFile(htmlPath);
    }
  }, 2000);

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', () => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (win === null) createWindow();
});

app.on('before-quit', () => {
  if (backendProcess) backendProcess.kill();
});
