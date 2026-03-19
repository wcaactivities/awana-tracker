# 💻 Awana Sparks Tracker - Chromebook Installation Guide

## Overview
The Awana Sparks Tracker works perfectly on Chromebooks! Since Chromebooks run Chrome OS with the Chrome browser built-in, you have multiple easy installation options.

---

## Method 1: Progressive Web App (PWA) - RECOMMENDED ⭐

This is the best method - the app will work like a native Chrome OS app with offline support.

### Option A: Using GitHub Pages (Free & Easy)

#### Step 1: Upload to GitHub Pages
1. **Create a GitHub account** (if you don't have one):
   - Go to https://github.com
   - Sign up for free

2. **Create a new repository**:
   - Click the "+" icon → "New repository"
   - Name it: `awana-tracker`
   - Make it Public
   - Click "Create repository"

3. **Upload files**:
   - Click "uploading an existing file"
   - Drag and drop ALL files from the `awana-tracker` folder
   - Click "Commit changes"

4. **Enable GitHub Pages**:
   - Go to Settings (in your repository)
   - Scroll to "Pages" section
   - Source: Select "Deploy from a branch"
   - Branch: Select "main"
   - Click "Save"
   - Wait 1-2 minutes for deployment

5. **Get your URL**:
   - Your app will be at: `https://yourusername.github.io/awana-tracker/`
   - Copy this URL

#### Step 2: Install on Chromebook
1. **Open Chrome browser** on your Chromebook
2. **Navigate to your GitHub Pages URL**
3. **Wait for the app to load completely**
4. **Install as PWA**:
   - Click the install icon in the address bar (⊕ or computer icon)
   - OR click the three dots menu (⋮) → "Install Awana Sparks Tracker"
   - Click "Install"

5. **Launch the app**:
   - The app will appear in your Chrome OS app launcher
   - Click to open - it runs in its own window!
   - Works offline after first load
   - Appears in your shelf like any other app

### Option B: Using Google Drive + Web Server

1. **Upload to Google Drive**:
   - Upload the entire `awana-tracker` folder to Google Drive
   - Right-click the folder → Share → Get link
   - Set to "Anyone with the link can view"

2. **Use a Chrome Extension**:
   - Install "Web Server for Chrome" extension
   - Point it to your Google Drive folder
   - Start the server
   - Access via the provided URL
   - Install as PWA

---

## Method 2: Local Files (Simple but Limited)

### Using Chrome Browser Directly

1. **Copy files to Chromebook**:
   - Connect USB drive or download from cloud storage
   - Copy `awana-tracker` folder to:
     - `Downloads` folder, or
     - `My Files` folder

2. **Open in Chrome**:
   - Open Files app
   - Navigate to the `awana-tracker` folder
   - Double-click `index.html`
   - It will open in Chrome

3. **Create bookmark**:
   - Click the star icon to bookmark
   - Name it "Awana Tracker"
   - Save to bookmarks bar

**Note**: This method has limitations:
- Service worker won't work (no offline mode)
- Some features may be restricted
- Better to use Method 1 (PWA)

---

## Method 3: Using Chrome OS Linux (Advanced)

If you have Linux enabled on your Chromebook:

1. **Enable Linux** (if not already):
   - Settings → Advanced → Developers
   - Turn on Linux development environment

2. **Copy files to Linux**:
   - Move `awana-tracker` folder to Linux files

3. **Start a simple HTTP server**:
   ```bash
   cd awana-tracker
   python3 -m http.server 8000
   ```

4. **Access in Chrome**:
   - Open Chrome
   - Go to: `http://localhost:8000`
   - Install as PWA

---

## 🎯 Recommended Setup (Step-by-Step)

### For Best Experience:

1. **Use GitHub Pages** (one-time setup, 10 minutes):
   - Free, reliable, and permanent
   - Works on any device with internet
   - Automatic updates when you change files
   - Professional URL you can share

2. **Install as PWA**:
   - Appears in app launcher
   - Works offline
   - Full-screen experience
   - No browser UI clutter

3. **Pin to Shelf**:
   - Right-click app icon → "Pin to shelf"
   - Quick access from anywhere

---

## 📊 Features on Chromebook

✅ **Full Desktop Experience**:
- All features work perfectly
- Large screen for easy data entry
- Keyboard shortcuts work
- Mouse/trackpad support

✅ **Offline Functionality**:
- Works without internet (after initial load)
- All data stored locally
- No cloud sync required

✅ **Data Management**:
- Export to Excel (downloads to Downloads folder)
- Import from Excel
- Easy file management with Files app

✅ **Multi-Window Support**:
- Run alongside other apps
- Resize window as needed
- Use in tablet mode or laptop mode

---

## 🔄 Transferring Data

### From Another Computer to Chromebook:
1. Export data to Excel on original computer
2. Transfer Excel file via:
   - Email attachment
   - Google Drive
   - USB drive
   - Cloud storage
3. Open app on Chromebook
4. Import Excel file from Downloads

### From Chromebook to Another Device:
1. Export to Excel in app
2. File saves to Downloads folder
3. Upload to Google Drive or email
4. Import on other device

---

## 💡 Chromebook-Specific Tips

### Performance:
- Works great on all Chromebook models
- No special requirements
- Lightweight and fast

### Storage:
- App uses minimal storage (< 1 MB)
- Data stored in browser storage
- Export to Excel for backups

### Keyboard Shortcuts:
- Ctrl+F: Search in tables
- Ctrl+R: Refresh page
- Ctrl+W: Close tab
- Ctrl+T: New tab

### Tablet Mode:
- If your Chromebook has a touchscreen
- App works in tablet mode
- Touch-optimized interface
- Rotate for best view

### Printing:
- Use Chrome's print function (Ctrl+P)
- Print summary reports
- Save as PDF

---

## 🛠️ Troubleshooting

### App Won't Install as PWA:
- Make sure you're accessing via HTTPS (use GitHub Pages)
- Can't install from file:// URLs
- Clear Chrome cache and try again

### Data Not Saving:
- Check Chrome storage settings
- Don't use Incognito mode
- Ensure sufficient storage space

### Excel Import/Export Not Working:
- Requires internet for first use (library loads)
- After first use, works offline
- Check Downloads folder permissions

### Slow Performance:
- Close other Chrome tabs
- Clear browser cache
- Restart Chrome
- Check for Chrome OS updates

---

## 🔐 Privacy & Security

- ✅ All data stored locally on your Chromebook
- ✅ No data sent to external servers
- ✅ No account required (except for GitHub Pages hosting)
- ✅ Works completely offline
- ✅ You control all backups

---

## 📱 Bonus: Android Apps on Chromebook

If your Chromebook supports Android apps, you can also:
1. Follow the Android installation guide
2. Install Android HTTP server apps
3. Use Android file managers
4. Access the same way as on tablets

---

## 🎓 Best Practices

### For Teachers/Leaders:
1. **Set up once on GitHub Pages**
2. **Share the URL** with other leaders
3. **Everyone installs as PWA**
4. **Export data weekly** for backups
5. **Store backups in Google Drive**

### For Multiple Chromebooks:
1. **Use same GitHub Pages URL** on all devices
2. **Each device has independent data**
3. **Use Excel export/import** to sync
4. **Or use one "master" Chromebook** and share screen

### For Classroom Use:
1. **Project on screen** for group viewing
2. **Use keyboard for fast data entry**
3. **Print summary reports** as needed
4. **Backup before each session**

---

## 📞 Quick Reference

### Installation Checklist:
- [ ] Upload files to GitHub Pages
- [ ] Get your URL
- [ ] Open in Chrome on Chromebook
- [ ] Install as PWA
- [ ] Pin to shelf
- [ ] Import your data
- [ ] Test all features
- [ ] Create backup

### URLs to Remember:
- GitHub: https://github.com
- Your app: https://yourusername.github.io/awana-tracker/
- GitHub Pages docs: https://pages.github.com

---

## 🎉 You're All Set!

Once installed, the Awana Sparks Tracker will work beautifully on your Chromebook with:
- Fast performance
- Offline access
- Easy data management
- Professional appearance
- Reliable operation

**Enjoy tracking your Awana Sparks clubbers!** 🌟