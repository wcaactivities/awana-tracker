# Google Drive Integration Setup Guide

This guide explains how to set up Google Drive synchronization for the Awana Tracker app, enabling multiple users to collaborate by syncing data to a shared Google Drive folder.

## Overview

The Google Drive integration allows:
- **Cloud Backup**: Automatically backup your data to Google Drive
- **Multi-User Collaboration**: Multiple users can sync to the same folder
- **Data Sharing**: Share tracking data across devices and team members
- **Auto-Sync**: Optional automatic synchronization

## Important Notes

⚠️ **OAuth 2.0 Required**: Google Drive API requires OAuth 2.0 authentication for security. This setup requires some technical steps but only needs to be done once.

💡 **Alternative**: If you prefer a simpler solution, use the built-in **Export to Excel** and **Import from Excel** features for manual backup and sharing.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. Basic understanding of web applications

## Setup Steps

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter project name: `Awana Tracker`
4. Click **Create**

### Step 2: Enable Google Drive API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click on it and press **Enable**

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type (unless you have a Google Workspace)
3. Click **Create**
4. Fill in the required fields:
   - **App name**: Awana Tracker
   - **User support email**: Your email
   - **Developer contact**: Your email
5. Click **Save and Continue**
6. On Scopes page, click **Add or Remove Scopes**
7. Add these scopes:
   - `https://www.googleapis.com/auth/drive.file`
   - `https://www.googleapis.com/auth/drive.appdata`
8. Click **Save and Continue**
9. Add test users (emails of people who will use the app)
10. Click **Save and Continue**

### Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Enter name: `Awana Tracker Web Client`
5. Add **Authorized JavaScript origins**:
   - `http://localhost:8000` (for local testing)
   - `http://localhost:5500` (for VS Code Live Server)
   - Your production URL (if hosting online)
6. Add **Authorized redirect URIs**:
   - `http://localhost:8000/Bob-sandbox/awana-tracker/`
   - `http://localhost:5500/Bob-sandbox/awana-tracker/`
   - Your production URL + path
7. Click **Create**
8. **Copy the Client ID** - you'll need this!

### Step 5: Update the App with Your Client ID

1. Open `google-drive-sync.js`
2. Find the `authenticate()` method
3. Replace the placeholder with your actual Client ID:

```javascript
await gapi.client.init({
    apiKey: 'YOUR_API_KEY', // Optional
    clientId: 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    scope: 'https://www.googleapis.com/auth/drive.file'
});
```

### Step 6: Implement Full OAuth Flow

Update the `authenticate()` method in `google-drive-sync.js`:

```javascript
async authenticate() {
    try {
        if (!window.gapi) {
            throw new Error('Google API library not loaded');
        }

        await new Promise((resolve) => {
            gapi.load('client:auth2', resolve);
        });

        await gapi.client.init({
            clientId: 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            scope: 'https://www.googleapis.com/auth/drive.file'
        });

        const authInstance = gapi.auth2.getAuthInstance();
        
        if (!authInstance.isSignedIn.get()) {
            await authInstance.signIn();
        }

        const user = authInstance.currentUser.get();
        const authResponse = user.getAuthResponse(true);
        this.accessToken = authResponse.access_token;
        this.isAuthenticated = true;

        this.updateSyncStatus('Connected to Google Drive', null);
        return true;

    } catch (error) {
        console.error('Authentication error:', error);
        this.updateSyncStatus('Authentication failed', null);
        throw error;
    }
}
```

### Step 7: Update Connection Test Function

In `app.js`, update the `testGoogleDriveConnection()` function:

```javascript
async function testGoogleDriveConnection() {
    try {
        googleDriveSync.updateSyncStatus('Testing connection...', null);
        
        const success = await googleDriveSync.authenticate();
        
        if (success) {
            alert('Successfully connected to Google Drive!');
            googleDriveSync.updateSyncStatus('Connected', new Date().toISOString());
        }
        
    } catch (error) {
        alert('Connection test failed: ' + error.message);
        googleDriveSync.updateSyncStatus('Connection failed', null);
    }
}
```

### Step 8: Update Sync Functions

Update `syncToGoogleDrive()` and `loadFromGoogleDrive()` in `app.js`:

```javascript
async function syncToGoogleDrive() {
    try {
        if (!googleDriveSync.config.email || !googleDriveSync.config.folderName) {
            alert('Please configure Google Drive settings first');
            return;
        }

        if (!googleDriveSync.isAuthenticated) {
            await googleDriveSync.authenticate();
        }

        googleDriveSync.updateSyncStatus('Syncing to Google Drive...', null);
        
        await googleDriveSync.uploadData(appData);
        
        alert('Data synced to Google Drive successfully!');

    } catch (error) {
        alert('Sync failed: ' + error.message);
        googleDriveSync.updateSyncStatus('Sync failed', null);
    }
}

async function loadFromGoogleDrive() {
    try {
        if (!googleDriveSync.config.email || !googleDriveSync.config.folderName) {
            alert('Please configure Google Drive settings first');
            return;
        }

        if (!googleDriveSync.isAuthenticated) {
            await googleDriveSync.authenticate();
        }

        googleDriveSync.updateSyncStatus('Loading from Google Drive...', null);
        
        const data = await googleDriveSync.downloadData();
        
        if (confirm('This will replace all current data. Continue?')) {
            appData = data;
            saveData();
            renderAll();
            alert('Data loaded from Google Drive successfully!');
        }

    } catch (error) {
        alert('Load failed: ' + error.message);
        googleDriveSync.updateSyncStatus('Load failed', null);
    }
}
```

## Usage Instructions

### For App Administrators

1. Complete the setup steps above (one-time setup)
2. Share the app URL with your team
3. Provide them with the folder name to use

### For Team Members

1. Open the Awana Tracker app
2. Go to the **Admin** tab
3. Scroll to **Google Drive Sync** section
4. Enter:
   - Your Google email
   - The shared folder name (provided by admin)
5. Click **Save Configuration**
6. Click **Test Connection** (you'll be prompted to sign in to Google)
7. Once connected, use:
   - **Sync to Drive**: Upload your current data
   - **Load from Drive**: Download shared data
   - **Enable Auto-Sync**: Automatically sync changes

## Multi-User Collaboration

Multiple users can work with the same data by:

1. All users configure the **same folder name**
2. First user syncs their data to Drive
3. Other users load from Drive to get the latest data
4. Everyone can make updates and sync back
5. Users should load from Drive before making changes to avoid conflicts

### Best Practices

- **Communicate**: Let team members know when you're making updates
- **Load First**: Always load from Drive before making changes
- **Sync After**: Sync to Drive after completing your updates
- **Regular Backups**: Use Excel export for additional backups

## Troubleshooting

### "OAuth setup required" message

- Complete Steps 1-5 above
- Make sure you've added your Client ID to the code

### "Not authenticated" error

- Click **Test Connection** first
- Sign in with your Google account
- Grant the requested permissions

### "Folder not found" error

- Make sure all users use the exact same folder name
- Folder names are case-sensitive

### CORS errors

- Make sure your app URL is in Authorized JavaScript origins
- Use a proper web server (not file:// protocol)

## Security Notes

- **Never share your OAuth Client Secret** (if you created one)
- The app only requests access to files it creates
- Users must grant permission for the app to access their Drive
- Each user authenticates with their own Google account

## Alternative: Manual Sync with Excel

If OAuth setup is too complex, use the built-in Excel features:

1. **Export to Excel**: Creates a backup file
2. Share the Excel file via email, cloud storage, etc.
3. **Import from Excel**: Load data from the shared file

This method works without any setup but requires manual file sharing.

## Support

For issues or questions:
- Check Google Cloud Console for API quotas and errors
- Review browser console for detailed error messages
- Ensure all URLs are correctly configured in OAuth settings

## Additional Resources

- [Google Drive API Documentation](https://developers.google.com/drive/api/v3/about-sdk)
- [OAuth 2.0 for Web Apps](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)
- [Google API JavaScript Client](https://github.com/google/google-api-javascript-client)