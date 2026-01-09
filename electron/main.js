const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const { spawn } = require("child_process");
const os = require("os");
const fs = require("fs");

let win;
let backendProcess;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function startBackend() {
  let projectRoot;
  let pythonPath;
  
  if (isDev) {
    projectRoot = path.join(__dirname, '..');
    pythonPath = path.join(projectRoot, '.venv', 'bin', 'python');
  } else {
    const resourcesPath = process.resourcesPath || path.join(process.execPath, '..', '..', 'resources');
    projectRoot = path.join(resourcesPath, 'app.asar.unpacked');
    pythonPath = process.platform === 'win32' ? 'python' : 'python3';
  }
  
  console.log('Project root:', projectRoot);
  console.log('Python path:', pythonPath);
  
  let envVars = { ...process.env, PYTHONUNBUFFERED: '1' };
  if (!isDev) {
    const userHome = process.env.HOME || process.env.USERPROFILE || os.homedir();
    const dbPath = path.join(userHome, '.box-test', 'app.db');
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    envVars.DATABASE_URL = `sqlite:///${dbPath}`;
    console.log('Database path:', dbPath);
    console.log('DATABASE_URL:', envVars.DATABASE_URL);
  }
  
  backendProcess = spawn(pythonPath, [
    '-m', 'backend.app.main'
  ], {
    cwd: projectRoot,
    env: envVars
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
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
      win.loadFile(htmlPath);
    } else {
      const resourcesPath = process.resourcesPath || path.join(process.execPath, '..', '..', 'resources');
      htmlPath = path.join(resourcesPath, 'app.asar', 'frontend', 'build', 'index.html');
      win.loadURL(`file://${htmlPath}`);
    }
  }, 2000);

  if (isDev) {
    win.webContents.openDevTools();
  }
  
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', () => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

