const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const { spawn } = require("child_process");

let win;
let backendProcess;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function waitForBackend(maxAttempts = 30, delay = 500) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    let attempts = 0;

    const checkBackend = () => {
      attempts++;
      const req = http.get('http://127.0.0.1:8000/boxes', (res) => {
        if (res.statusCode === 200 || res.statusCode === 404) {
          console.log('Backend is ready!');
          resolve();
        } else {
          if (attempts < maxAttempts) {
            setTimeout(checkBackend, delay);
          } else {
            reject(new Error('Backend failed to start'));
          }
        }
      });

      req.on('error', () => {
        if (attempts < maxAttempts) {
          setTimeout(checkBackend, delay);
        } else {
          reject(new Error('Backend failed to start'));
        }
      });

      req.setTimeout(1000, () => {
        req.destroy();
        if (attempts < maxAttempts) {
          setTimeout(checkBackend, delay);
        } else {
          reject(new Error('Backend failed to start'));
        }
      });
    };

    setTimeout(checkBackend, 1000);
  });
}

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
  
  backendProcess = spawn(pythonPath, [
    '-m', 'backend.app.main'
  ], {
    cwd: projectRoot,
    env: { ...process.env, PYTHONUNBUFFERED: '1' }
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

  return waitForBackend();
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

  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    const resourcesPath = process.resourcesPath || path.join(process.execPath, '..', '..', 'resources');
    const htmlPath = path.join(resourcesPath, 'app.asar', 'frontend', 'build', 'index.html');
    win.loadFile(htmlPath);
  }
  
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', async () => {
  try {
    await startBackend();
    createWindow();
  } catch (error) {
    console.error('Failed to start backend:', error);
    createWindow();
  }
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

