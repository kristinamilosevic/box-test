# Box Test

Desktop application for managing boxes, built with Electron, React, and FastAPI.

## Running Locally

### Step 1: Install Prerequisites
- Node.js (v16+)
- Python 3.12
- npm

### Step 2: Setup

1. **Install Python dependencies:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Install Electron dependencies:**
   ```bash
   npm install
   ```

### Step 3: Run the Application

**Option 1: Run everything together (recommended):**
```bash
npm run dev
```

This will automatically start:
- Backend (FastAPI) on http://127.0.0.1:8000
- Electron desktop app 

**Option 2: Run separately (for debugging):**
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Electron
npm run dev:electron
```

The Electron app will open automatically. The backend runs in the background.
```

## Project Structure

```
box-test/
├── backend/          # FastAPI backend
│   └── app/
├── frontend/         # React frontend
│   └── src/
├── electron/         # Electron main process
│   └── main.js
├── venv/             # Python virtual environment
└── package.json      # Root package.json
```

## API Endpoints

- `GET /boxes` - List all boxes
- `POST /boxes` - Create a new box

## Build for Production

### Build Process

1. **Install Python dependencies:**
   ```bash
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Build React frontend:**
   ```bash
   npm run build:react
   ```

3. **Build Electron installer:**
   ```bash
   npm run build:linux:deb
   ```

The installer will be in `dist/box-test_1.0.0_amd64.deb`

### Installation

```bash
sudo dpkg -i dist/box-test_1.0.0_amd64.deb
sudo apt-get install -f 
```

### Python Dependencies for End Users

**IMPORTANT:** End users must install Python dependencies system-wide:

```bash
sudo /usr/bin/python3 -m pip install --break-system-packages fastapi uvicorn sqlalchemy pydantic python-dotenv
```

### Running the Installed App

```bash
box-test
```

### Database

The database is automatically created in `~/.box-test/app.db` on first run.
