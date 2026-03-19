# Awana Sparks Tracker - Installation Guide

## Overview
The Awana Sparks Tracker is a web-based application that runs entirely in your browser. No server or installation is required - just open the HTML file in any modern web browser.

## System Requirements
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No internet connection required after initial setup (the app uses a CDN for Excel functionality, but can work offline if the library is cached)

## Installation Steps

### Option 1: Simple Installation (Recommended)
1. Copy the entire `awana-tracker` folder to your desired location on the new computer
2. Double-click `index.html` to open the application in your default browser
3. That's it! The application is ready to use.

### Option 2: Desktop Shortcut
1. Copy the `awana-tracker` folder to your computer (e.g., Documents, Desktop, or any preferred location)
2. Right-click on `index.html` and select "Create Shortcut" (Windows) or "Make Alias" (Mac)
3. Move the shortcut to your desktop for easy access
4. Rename the shortcut to "Awana Tracker"
5. Double-click the shortcut to launch the application

## Files Included
- `index.html` - Main application file (open this to run the app)
- `app.js` - Application logic
- `styles.css` - Application styling
- `README.md` - Application documentation
- `INSTALLATION.md` - This file

## Data Storage
- All data is stored locally in your browser's localStorage
- Data persists between sessions automatically
- To backup your data, use the "Export to Excel" button in the Summary tab
- To restore data, use the "Import from Excel" button

## Transferring Data to Another Computer

### Method 1: Using Excel Export/Import (Recommended)
1. On the original computer:
   - Open the Awana Tracker
   - Go to the Summary tab
   - Click "📥 Export to Excel"
   - Save the Excel file

2. On the new computer:
   - Copy the `awana-tracker` folder
   - Open `index.html`
   - Go to the Summary tab
   - Click "📤 Import from Excel"
   - Select the Excel file you exported

### Method 2: Manual Browser Data Transfer (Advanced)
1. On the original computer:
   - Open the browser's Developer Console (F12)
   - Go to the Console tab
   - Type: `localStorage.getItem('awanaTrackerData')`
   - Copy the entire output

2. On the new computer:
   - Open `index.html`
   - Open Developer Console (F12)
   - Type: `localStorage.setItem('awanaTrackerData', 'PASTE_DATA_HERE')`
   - Refresh the page

## Troubleshooting

### Application doesn't open
- Make sure you're opening `index.html` (not app.js or styles.css)
- Try right-clicking `index.html` → "Open with" → Select your browser

### Data not showing after import
- Click the "🔄 Refresh Summary" button in the Summary tab
- Make sure the Excel file format matches the export format

### Excel import/export not working
- Ensure you have an internet connection (required for the SheetJS library on first load)
- The library will be cached for offline use after the first load

## Browser Recommendations
- **Chrome/Edge**: Best performance and compatibility
- **Firefox**: Fully supported
- **Safari**: Fully supported
- **Internet Explorer**: Not supported (use Edge instead)

## Security Note
All data is stored locally on your computer. No data is sent to any server or external service.

## Support
For issues or questions, refer to the README.md file in the application folder.