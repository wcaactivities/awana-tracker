# Android Packaging Guide for Awana Tracker

This guide explains how to package the Awana Tracker application for Android installation.

## Option 1: Progressive Web App (PWA) - Easiest ⭐

The app is already configured as a PWA. Users can install it directly from a web browser:

### Steps:
1. **Host the app online** (see hosting options below)
2. **On Android device:**
   - Open Chrome browser
   - Navigate to your app URL
   - Tap menu (⋮) → "Install app" or "Add to Home screen"
   - App installs like a native app
   - Works offline after first load

### Hosting Options:
- **GitHub Pages** (Free): Upload to GitHub, enable Pages
- **Netlify** (Free): Drag & drop deployment
- **Vercel** (Free): Connect to GitHub repo
- **Firebase Hosting** (Free tier available)

**Pros:** No packaging needed, instant updates, works on all platforms
**Cons:** Requires initial internet connection, not in Play Store

---

## Option 2: Capacitor - Native Android App

Convert the web app to a native Android APK using Capacitor.

### Prerequisites:
- Node.js and npm installed
- Android Studio installed
- Java JDK 11 or higher

### Step 1: Install Capacitor

```bash
cd Bob-sandbox/awana-tracker

# Initialize npm project (if not already done)
npm init -y

# Install Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init "Awana Tracker" "com.awana.tracker" --web-dir .
```

### Step 2: Add Android Platform

```bash
# Install Android platform
npm install @capacitor/android

# Add Android project
npx cap add android
```

### Step 3: Configure Android

Edit `capacitor.config.json`:
```json
{
  "appId": "com.awana.tracker",
  "appName": "Awana Tracker",
  "webDir": ".",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  }
}
```

### Step 4: Copy Web Assets

```bash
npx cap copy android
```

### Step 5: Open in Android Studio

```bash
npx cap open android
```

### Step 6: Build APK in Android Studio

1. In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Wait for build to complete
3. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 7: Install on Android Device

**Option A: Direct Install**
```bash
# Connect Android device via USB with USB debugging enabled
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Option B: Transfer APK**
1. Copy `app-debug.apk` to device
2. Open file on device
3. Allow installation from unknown sources
4. Install

---

## Option 3: Cordova - Alternative Native Packaging

Similar to Capacitor but older technology.

### Prerequisites:
- Node.js and npm
- Android Studio
- Cordova CLI

### Steps:

```bash
cd Bob-sandbox/awana-tracker

# Install Cordova
npm install -g cordova

# Create Cordova project
cordova create awana-tracker-android com.awana.tracker "Awana Tracker"
cd awana-tracker-android

# Copy web files
cp -r ../Bob-sandbox/awana-tracker/* www/

# Add Android platform
cordova platform add android

# Build APK
cordova build android

# APK location: platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Option 4: Android Studio WebView App

Create a simple Android app that wraps your web app in a WebView.

### Steps:

1. **Create New Android Studio Project**
   - Choose "Empty Activity"
   - Package name: `com.awana.tracker`
   - Language: Kotlin or Java

2. **Add Internet Permission** (`AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

3. **Create WebView Activity** (`MainActivity.kt`):
```kotlin
import android.webkit.WebView
import android.webkit.WebViewClient

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val webView = WebView(this)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.webViewClient = WebViewClient()
        
        // Load from assets or online URL
        webView.loadUrl("file:///android_asset/index.html")
        // OR: webView.loadUrl("https://your-hosted-app.com")
        
        setContentView(webView)
    }
}
```

4. **Copy Web Files to Assets**
   - Create `app/src/main/assets/` folder
   - Copy all web files there

5. **Build APK**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)

---

## Recommended Approach

**For Quick Distribution:**
- Use **Option 1 (PWA)** - Host on GitHub Pages, users install from browser

**For Play Store Distribution:**
- Use **Option 2 (Capacitor)** - Modern, well-maintained, good documentation

**For Maximum Control:**
- Use **Option 4 (Native WebView)** - Full control over app behavior

---

## Publishing to Google Play Store

After creating APK with Option 2, 3, or 4:

1. **Create Google Play Developer Account** ($25 one-time fee)
2. **Create App Listing** in Play Console
3. **Generate Signed APK/AAB**:
   ```bash
   # For Capacitor
   cd android
   ./gradlew bundleRelease
   ```
4. **Upload to Play Console**
5. **Complete Store Listing** (screenshots, description, etc.)
6. **Submit for Review**

---

## Testing Before Distribution

### Test on Physical Device:
```bash
# Enable USB debugging on Android device
# Connect via USB
adb devices
adb install path/to/your-app.apk
```

### Test on Emulator:
1. Open Android Studio
2. AVD Manager → Create Virtual Device
3. Install APK on emulator

---

## File Size Optimization

Before packaging:
- Compress images (use TinyPNG or similar)
- Minify JavaScript and CSS
- Remove unused files
- Enable gzip compression

---

## Troubleshooting

**"App not installed" error:**
- Uninstall previous version first
- Check package name conflicts
- Enable "Install from unknown sources"

**WebView not loading:**
- Check internet permissions
- Verify file paths in assets
- Enable JavaScript in WebView settings

**Build errors:**
- Update Android SDK tools
- Check Java/Kotlin version compatibility
- Clean and rebuild project

---

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Cordova Documentation](https://cordova.apache.org/docs/en/latest/)
- [Android Developer Guide](https://developer.android.com/guide)
- [PWA Documentation](https://web.dev/progressive-web-apps/)