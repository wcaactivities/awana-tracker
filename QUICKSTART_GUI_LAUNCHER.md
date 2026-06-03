# Quick Start Guide - GUI Launcher

## What is the GUI Launcher?

The GUI Launcher is a simple desktop application that makes it easy to start the Awana Tracker web server without using the terminal/command line. It provides a user-friendly interface with buttons to:

- 🚀 Start the web server automatically
- 🌐 Open the app in your browser
- ⏹️ Stop the server when done
- 📊 Monitor server status

## Why Use the GUI Launcher?

**Google Drive Sync Requirement:** Google OAuth authentication (required for Google Drive sync) only works when the app is served over HTTP/HTTPS, not when opened directly as a file. The GUI launcher automatically starts a local web server so all features work properly.

**Benefits:**
- ✅ No terminal/command line needed
- ✅ One-click operation
- ✅ Enables Google Drive sync features
- ✅ Automatic browser opening
- ✅ Clean, simple interface

## How to Use

### Windows Users

1. **Navigate to the awana-tracker folder**
2. **Double-click:** `Launch_Awana_Tracker_GUI.bat`
3. **Click the button:** "🚀 Start Server & Open App"
4. **The app opens automatically** in your default browser
5. **Keep the launcher window open** while using the app
6. **When finished:** Click "⏹️ Stop Server" or close the launcher window

### macOS Users

1. **Navigate to the awana-tracker folder**
2. **Double-click:** `Awana Tracker Launcher.app`
   - The app bundle will launch automatically
   - If macOS shows a security warning, go to System Preferences → Security & Privacy → Click "Open Anyway"
3. **Click the button:** "🚀 Start Server & Open App"
4. **The app opens automatically** in your default browser
5. **Keep the launcher window open** while using the app
6. **When finished:** Click "⏹️ Stop Server" or close the launcher window

### Linux Users

1. **Navigate to the awana-tracker folder**
2. **Open Terminal in this folder**
3. **Run the script:**
   ```bash
   ./Launch_Awana_Tracker_GUI.sh
   ```
   - If permission denied, first run: `chmod +x Launch_Awana_Tracker_GUI.sh`
4. **Click the button:** "🚀 Start Server & Open App"
5. **The app opens automatically** in your default browser
6. **Keep the launcher window open** while using the app
7. **When finished:** Click "⏹️ Stop Server" or close the launcher window

## GUI Launcher Features

### Main Window

```
┌─────────────────────────────────────┐
│   🎯 Awana Tracker Launcher         │
├─────────────────────────────────────┤
│                                     │
│  Server Status: Running ✓           │
│  Port: 8000                         │
│  http://localhost:8000              │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🚀 Start Server & Open App    │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ ⏹️ Stop Server                 │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🌐 Open in Browser            │ │
│  └───────────────────────────────┘ │
│                                     │
│  This launcher starts a local      │
│  web server so Google Drive sync   │
│  features work properly.           │
│                                     │
│  Keep this window open while       │
│  using the app                     │
└─────────────────────────────────────┘
```

### Button Functions

1. **🚀 Start Server & Open App**
   - Starts the local web server on port 8000
   - Automatically opens the app in your default browser
   - Disabled while server is running

2. **⏹️ Stop Server**
   - Stops the web server
   - Enabled only when server is running
   - Closes the server cleanly

3. **🌐 Open in Browser**
   - Opens the app in a new browser tab/window
   - Useful if you accidentally closed the browser
   - Enabled only when server is running

### Status Indicators

- **Server Status: Stopped** (Red) - Server is not running
- **Server Status: Running ✓** (Green) - Server is active
- **Server Status: Error** (Red) - Something went wrong

## Troubleshooting

### "Port 8000 is already in use"

**Cause:** Another application or instance is using port 8000.

**Solutions:**
1. Click "Yes" when prompted to open the app anyway (if server is already running)
2. Close other applications that might be using port 8000
3. Restart your computer

### "Python is not installed or not in PATH"

**Cause:** Python is not installed or not accessible.

**Solution:**
1. Download Python from https://www.python.org/
2. Install Python (make sure to check "Add Python to PATH" during installation)
3. Restart your computer
4. Try launching again

### Launcher window closes immediately

**Windows:**
- Right-click the `.bat` file → "Edit" to see any error messages
- Make sure Python is installed

**macOS/Linux:**
- Open Terminal and run the script manually to see errors:
  ```bash
  cd path/to/awana-tracker
  ./Launch_Awana_Tracker_GUI.sh
  ```

### Browser doesn't open automatically

**Solution:**
1. Click the "🌐 Open in Browser" button
2. Or manually open your browser and go to: `http://localhost:8000`

## Requirements

- **Python 3.x** (usually pre-installed on macOS/Linux)
- **tkinter** (included with Python on most systems)
- No additional packages needed!

## Alternative Methods

If the GUI launcher doesn't work for you:

### Method 1: Direct File Access (Basic Features)
- Double-click `index.html`
- **Note:** Google Drive sync won't work

### Method 2: Manual Terminal/Command Line
```bash
cd awana-tracker
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser

## Tips

- **Keep the launcher open:** Don't close the launcher window while using the app
- **Bookmark the URL:** Add `http://localhost:8000` to your browser bookmarks
- **Multiple tabs:** You can open multiple browser tabs to the same app
- **Network access:** The server is only accessible from your computer (localhost)

## Support

For more information, see:
- [README.md](README.md) - Full application documentation
- [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md) - Google Drive sync setup
- [INSTALLATION.md](INSTALLATION.md) - Detailed installation instructions