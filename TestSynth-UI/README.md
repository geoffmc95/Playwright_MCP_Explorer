# TestSynth MCP Explorer - Simple UI

A standalone web interface for generating intelligent Playwright tests using Model Context Protocol (MCP).

## 🚀 Quick Start

### Prerequisites
- Python 3.6+ (usually pre-installed on Windows 10/11)
- TestSynth backend server running on port 3001

### Start the UI

**Option 1: Double-click the batch file**
```
start.bat
```

**Option 2: Command line**
```bash
python server.py
```

**Option 3: PowerShell**
```powershell
python server.py
```

The UI will automatically:
- Start on `http://localhost:3000`
- Open your browser
- Connect to the backend API on port 3001

## 🎯 Features

### Generate Explore
1. Enter a website URL (e.g., `https://example.com`)
2. Optionally enter a test name
3. Click "Generate Explore"
4. Watch MCP explore the site and create specific tests

### Generate From Scenario
1. Click "Generate From Scenario" tab
2. Fill in:
   - Test Name: "Login Flow Test"
   - URL: "https://myapp.com/login"
   - Verify Statements:
     - "Verify login form is visible"
     - "Verify email field accepts input"
     - "Verify password field is secure"
3. Click "Generate From Scenario"
4. Get working Playwright tests

## 🔧 Backend Setup

Make sure your TestSynth backend is running:

```bash
cd "C:\Users\geoff\Desktop\Programming\TestSynth\Playwright_MCP_Explorer\ui\server"
npm start
```

The backend should show: "TestSynth API Server running on port 3001"

## 📋 Using Generated Tests

1. **Copy** the generated test code
2. **Save** to `tests/generated/your-test.spec.ts`
3. **Run** with:
   ```bash
   npx playwright test tests/generated/your-test.spec.ts
   ```

## 🛠️ Troubleshooting

### UI Won't Start
- Make sure Python is installed: `python --version`
- Check if port 3000 is available
- Try running: `python server.py`

### Backend Connection Errors
- Ensure backend is running on port 3001
- Check browser console for CORS errors
- Verify the backend API is accessible at `http://localhost:3001/api/health`

### No Tests Generated
- Check that MCP server is working
- Verify the backend logs for errors
- Test the backend directly with curl

## 🎨 UI Features

- **Clean, modern interface** with Tailwind CSS
- **Real-time URL validation**
- **Dynamic verify statements** (add/remove)
- **Loading states** during generation
- **Syntax-highlighted results**
- **Copy to clipboard** functionality
- **Download as .ts file**
- **Responsive design**

## 📁 File Structure

```
TestSynth-UI/
├── index.html      # Main UI page
├── app.js          # JavaScript functionality
├── server.py       # Python HTTP server
├── start.bat       # Windows startup script
└── README.md       # This file
```

## 🌐 Accessing the UI

Once started, the UI is available at:
- **Local**: `http://localhost:3000`
- **Network**: `http://[your-ip]:3000` (if accessible from other devices)

The UI automatically connects to your TestSynth backend to generate intelligent Playwright tests! 🎉
