# 📦 Awana Sparks Tracker - Installation Package

## Quick Start

### Windows Users 🪟
1. Copy the entire `awana-tracker` folder to your computer
2. Double-click `Launch_Awana_Tracker.bat` to start the application
   - OR double-click `index.html` directly

### Mac/Linux Users 🍎
1. Copy the entire `awana-tracker` folder to your computer
2. Double-click `Launch_Awana_Tracker.sh` to start the application
   - OR double-click `index.html` directly
   - If the .sh file doesn't work, right-click → Open With → Terminal

### Chromebook Users 💻
1. See **CHROMEBOOK_INSTALLATION.md** for detailed instructions
2. Recommended: Use GitHub Pages + Install as PWA
3. Works perfectly on Chrome OS
4. Full desktop experience with offline support

### Android Tablet Users 📱
1. See **ANDROID_INSTALLATION.md** for detailed instructions
2. Recommended: Install as Progressive Web App (PWA)
3. Works offline after initial setup
4. Touch-optimized interface for tablets

## 📁 Package Contents

```
awana-tracker/
├── index.html                      # Main application file
├── app.js                          # Application logic
├── styles.css                      # Application styling
├── manifest.json                   # PWA manifest for mobile/Chromebook
├── service-worker.js               # Offline functionality
├── README.md                       # Application documentation
├── INSTALLATION.md                 # Desktop installation guide
├── CHROMEBOOK_INSTALLATION.md      # Chromebook guide
├── ANDROID_INSTALLATION.md         # Android tablet guide
├── ANDROID_TROUBLESHOOTING.md      # Android troubleshooting
├── CREATE_ICONS.md                 # Icon creation guide
├── PACKAGE_README.md              # This file
├── START_HERE.txt                  # Quick start guide
├── Launch_Awana_Tracker.bat       # Windows launcher
└── Launch_Awana_Tracker.sh        # Mac/Linux launcher
```

## 🚀 Features

- **Track Clubber Progress**: Record attendance, uniform, handbook, Bible, and section completion
- **Automatic Coupon Calculation**:
  - 2 coupons for Present
  - 2 coupons for Uniform
  - 2 coupons for Handbook
  - 2 coupons for Bible
  - Plus any additional earned coupons
  - Minus spent coupons
- **Coupons Tab**: Track coupon spending with 4 customizable date columns
- **Excel Export/Import**: Backup and restore data easily
- **Summary View**: See overall progress for all clubbers
- **Date Management**: Track progress across multiple dates
- **Book & Section Tracking**: Monitor which book and section each clubber is working on
- **Progressive Web App**: Install on Android tablets like a native app
- **Offline Support**: Works without internet connection after initial load
- **Touch-Optimized**: Designed for tablet and touch screen use

## 💾 Data Management

### Exporting Your Data (Backup)
1. Open the application
2. Go to the **Summary** tab
3. Click **📥 Export to Excel**
4. Save the Excel file to a safe location

### Importing Data (Restore/Transfer)
1. Open the application
2. Go to the **Summary** tab
3. Click **📤 Import from Excel**
4. Select your previously exported Excel file
5. Click **🔄 Refresh Summary** to update the display

### Transferring to Another Computer
1. Export data from the original computer (see above)
2. Copy the entire `awana-tracker` folder to the new computer
3. Open the application on the new computer
4. Import the Excel file (see above)

## 🔧 System Requirements

- **Operating System**:
  - Windows 7+
  - macOS 10.10+
  - Linux
  - Chrome OS (Chromebook)
  - Android 5.0+
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Internet**: Required only for first-time Excel library loading (then works offline)
- **Storage**: Minimal (< 1 MB)

## 📖 How to Use

### 1. Admin Tab - Add Clubbers
- Enter clubber names
- Edit or delete clubbers as needed

### 2. Config Tab - Setup
- Add books (e.g., "Flight 3:16", "HangGlider")
- Add sections (e.g., "Red", "Blue", "Green")
- Add dates for tracking sessions

### 3. Progress Tab - Track Weekly Progress
- Select a date
- Check boxes for Present, Uniform, Handbook, Bible
- Enter additional earned/spent coupons
- Select current book and section

### 4. Summary Tab - View Overall Progress
- See total attendance for each clubber
- View total coupons (automatically calculated)
- See current book and section
- Export/Import data
- Refresh summary if needed

## 🐛 Troubleshooting

### Application Won't Open
- **Solution**: Make sure you're opening `index.html` (not app.js or styles.css)
- Try right-clicking `index.html` → "Open with" → Select your browser

### Data Not Showing After Import
- **Solution**: Click the **🔄 Refresh Summary** button in the Summary tab
- Verify the Excel file format matches the export format

### Launcher Script Not Working (Mac/Linux)
- **Solution**: Open Terminal, navigate to the folder, and run:
  ```bash
  chmod +x Launch_Awana_Tracker.sh
  ./Launch_Awana_Tracker.sh
  ```

### Excel Import/Export Not Working
- **Solution**: Ensure internet connection on first use (library needs to load)
- After first load, it will work offline

## 🔒 Privacy & Security

- ✅ All data stored locally on your computer
- ✅ No data sent to external servers
- ✅ No account or login required
- ✅ Works completely offline (after initial library load)
- ✅ Your data stays private and secure

## 📝 Tips

1. **Regular Backups**: Export to Excel weekly to backup your data
2. **Multiple Computers**: Use Excel export/import to sync between computers
3. **Browser Choice**: Chrome or Edge recommended for best performance
4. **Bookmark It**: Add the application to your browser bookmarks for quick access

## 🆘 Need Help?

Refer to the detailed `INSTALLATION.md` file for more information, or check `README.md` for application usage details.

## 📄 License

This application is provided as-is for use by Awana clubs and leaders.

---

**Made with ❤️ for Awana Sparks Clubs**