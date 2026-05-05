// Google Drive Sync Module for Awana Tracker
// This module handles all Google Drive API interactions

class GoogleDriveSync {
    constructor() {
        this.config = this.loadConfig();
        this.isAuthenticated = false;
        this.accessToken = null;
        this.folderId = null;
        this.fileId = null;
        this.autoSyncEnabled = false;
        this.autoSyncInterval = null;
        this.pollingInterval = null;
        this.isSyncing = false;
        this.lastKnownModifiedTime = null;
    }

    // Load configuration from localStorage
    loadConfig() {
        const saved = localStorage.getItem('googleDriveConfig');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            email: '',
            password: '',
            folderName: 'Awana-Tracker-Data',
            sharedFileId: '',
            club: 'sparks', // 'sparks' or 'tnt'
            lastSync: null,
            autoSync: false,
            autoSyncInterval: 30, // seconds
            lastModified: null
        };
    }

    // Save configuration to localStorage
    saveConfig(config) {
        this.config = { ...this.config, ...config };
        localStorage.setItem('googleDriveConfig', JSON.stringify(this.config));
    }

    // Get filename based on club selection
    getFileName() {
        const club = this.config.club || 'sparks';
        return club === 'tnt' ? 'awana-tnt-data.json' : 'awana-sparks-data.json';
    }

    // Get file ID based on club (for shared file approach)
    getSharedFileId() {
        const club = this.config.club || 'sparks';
        return club === 'tnt' ? this.config.sharedFileIdTnT : this.config.sharedFileIdSparks;
    }

    // Save club-specific shared file ID
    saveSharedFileId(fileId) {
        const club = this.config.club || 'sparks';
        if (club === 'tnt') {
            this.saveConfig({ sharedFileIdTnT: fileId });
        } else {
            this.saveConfig({ sharedFileIdSparks: fileId });
        }
    }

    // Update sync status in UI
    updateSyncStatus(status, lastSync = null) {
        const statusText = document.getElementById('syncStatusText');
        const lastSyncTime = document.getElementById('lastSyncTime');
        
        if (statusText) {
            statusText.textContent = status;
        }
        
        if (lastSyncTime && lastSync) {
            lastSyncTime.textContent = new Date(lastSync).toLocaleString();
        }
    }

    // Authenticate with Google Drive using OAuth 2.0 (Google Identity Services)
    async authenticate() {
        try {
            // Check if running on file:// protocol
            if (window.location.protocol === 'file:') {
                throw new Error('Google OAuth does not work with file:// protocol. Please use a web server (http:// or https://). You can use "python -m http.server" or VS Code Live Server.');
            }

            if (!window.google || !window.gapi) {
                throw new Error('Google libraries not loaded. Please check your internet connection and reload the page.');
            }

            this.updateSyncStatus('Loading Google API...', null);

            // Initialize the Google API client for Drive API calls
            await new Promise((resolve, reject) => {
                gapi.load('client', {
                    callback: resolve,
                    onerror: () => reject(new Error('Failed to load Google API client'))
                });
            });

            await gapi.client.init({
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
            });

            this.updateSyncStatus('Requesting authorization...', null);

            // Use Google Identity Services for OAuth
            const client = google.accounts.oauth2.initTokenClient({
                client_id: '965143781181-7dqor68ukfhe8gu6c2kgf7s894lougsu.apps.googleusercontent.com',
                scope: 'https://www.googleapis.com/auth/drive.file',
                callback: (response) => {
                    if (response.error) {
                        throw new Error(response.error);
                    }
                    this.accessToken = response.access_token;
                    this.isAuthenticated = true;
                    gapi.client.setToken({ access_token: this.accessToken });
                    this.updateSyncStatus('Connected to Google Drive', new Date().toISOString());
                }
            });

            // Request access token
            return new Promise((resolve, reject) => {
                try {
                    client.callback = (response) => {
                        if (response.error) {
                            reject(new Error(response.error));
                            return;
                        }
                        this.accessToken = response.access_token;
                        this.isAuthenticated = true;
                        gapi.client.setToken({ access_token: this.accessToken });
                        this.updateSyncStatus('Connected to Google Drive', new Date().toISOString());
                        resolve(true);
                    };
                    
                    // Trigger the OAuth flow
                    client.requestAccessToken({ prompt: 'consent' });
                } catch (error) {
                    reject(error);
                }
            });
            
        } catch (error) {
            console.error('Authentication error:', error);
            const errorMessage = error.message || 'Unknown error occurred';
            this.updateSyncStatus('Authentication failed', null);
            throw new Error(errorMessage);
        }
    }

    // Alternative: Use Google Drive REST API with fetch
    async authenticateWithRestAPI() {
        // This method uses the Google Drive REST API directly
        // Note: This requires CORS to be properly configured
        
        try {
            this.updateSyncStatus('Connecting to Google Drive...', null);
            
            // In a real implementation, you would:
            // 1. Redirect user to Google OAuth consent screen
            // 2. Get authorization code
            // 3. Exchange code for access token
            // 4. Use access token for API calls
            
            // For now, we'll simulate the connection
            alert('Google Drive integration requires OAuth 2.0 authentication.\n\n' +
                  'To enable this feature:\n' +
                  '1. Create a Google Cloud Project\n' +
                  '2. Enable Google Drive API\n' +
                  '3. Create OAuth 2.0 credentials\n' +
                  '4. Add the Client ID to this app\n\n' +
                  'See the documentation for detailed instructions.');
            
            this.updateSyncStatus('Not configured - OAuth required', null);
            return false;
            
        } catch (error) {
            console.error('REST API authentication error:', error);
            this.updateSyncStatus('Connection failed', null);
            throw error;
        }
    }

    // Find or create the sync folder
    async findOrCreateFolder() {
        if (!this.isAuthenticated) {
            throw new Error('Not authenticated with Google Drive');
        }

        try {
            // Search for existing folder
            const searchResponse = await this.makeApiCall(
                'GET',
                'https://www.googleapis.com/drive/v3/files',
                {
                    q: `name='${this.config.folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
                    fields: 'files(id, name)'
                }
            );

            if (searchResponse.files && searchResponse.files.length > 0) {
                this.folderId = searchResponse.files[0].id;
                return this.folderId;
            }

            // Create new folder if not found
            const createResponse = await this.makeApiCall(
                'POST',
                'https://www.googleapis.com/drive/v3/files',
                null,
                {
                    name: this.config.folderName,
                    mimeType: 'application/vnd.google-apps.folder'
                }
            );

            this.folderId = createResponse.id;
            return this.folderId;

        } catch (error) {
            console.error('Error finding/creating folder:', error);
            throw error;
        }
    }

    // Upload data to Google Drive
    async uploadData(data, silent = false) {
        if (!this.isAuthenticated) {
            throw new Error('Not authenticated with Google Drive');
        }

        if (this.isSyncing) {
            console.log('Sync already in progress, skipping...');
            return;
        }

        this.isSyncing = true;

        try {
            const fileName = this.getFileName();
            const fileContent = JSON.stringify(data, null, 2);

            if (!silent) {
                this.updateSyncStatus('Syncing...', null);
            }

            // If shared file ID is provided, use it directly
            const sharedFileId = this.getSharedFileId();
            if (sharedFileId) {
                this.fileId = sharedFileId;
                
                // Update the shared file
                const response = await this.makeApiCall(
                    'PATCH',
                    `https://www.googleapis.com/upload/drive/v3/files/${this.fileId}?uploadType=media&fields=id,modifiedTime`,
                    null,
                    fileContent,
                    'application/json'
                );

                // Store the modified time
                this.lastKnownModifiedTime = response.modifiedTime;
                
                const now = new Date().toISOString();
                this.saveConfig({ lastSync: now, lastModified: response.modifiedTime });
                
                if (!silent) {
                    this.updateSyncStatus('Synced to shared file', now);
                }
                
                this.isSyncing = false;
                return response;
            }

            // Otherwise, use folder-based approach (original behavior)
            await this.findOrCreateFolder();

            // Check if file already exists
            const searchResponse = await this.makeApiCall(
                'GET',
                'https://www.googleapis.com/drive/v3/files',
                {
                    q: `name='${fileName}' and '${this.folderId}' in parents and trashed=false`,
                    fields: 'files(id, name)'
                }
            );

            let response;
            if (searchResponse.files && searchResponse.files.length > 0) {
                // Update existing file
                this.fileId = searchResponse.files[0].id;
                response = await this.makeApiCall(
                    'PATCH',
                    `https://www.googleapis.com/upload/drive/v3/files/${this.fileId}?uploadType=media&fields=id,modifiedTime`,
                    null,
                    fileContent,
                    'application/json'
                );
                
                // Store the modified time
                this.lastKnownModifiedTime = response.modifiedTime;
            } else {
                // Create new file using multipart upload
                const boundary = '-------314159265358979323846';
                const delimiter = "\r\n--" + boundary + "\r\n";
                const close_delim = "\r\n--" + boundary + "--";

                const metadata = {
                    name: fileName,
                    parents: [this.folderId],
                    mimeType: 'application/json'
                };

                const multipartRequestBody =
                    delimiter +
                    'Content-Type: application/json\r\n\r\n' +
                    JSON.stringify(metadata) +
                    delimiter +
                    'Content-Type: application/json\r\n\r\n' +
                    fileContent +
                    close_delim;

                response = await this.makeApiCall(
                    'POST',
                    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
                    null,
                    multipartRequestBody,
                    'multipart/related; boundary=' + boundary
                );
                
                this.fileId = response.id;
                this.lastKnownModifiedTime = response.modifiedTime;
                
                // Save the file ID for this club
                this.saveSharedFileId(response.id);
            }

            const now = new Date().toISOString();
            this.saveConfig({ lastSync: now, lastModified: this.lastKnownModifiedTime });
            
            if (!silent) {
                this.updateSyncStatus('Synced successfully', now);
            }

            this.isSyncing = false;
            return response;

        } catch (error) {
            console.error('Error uploading data:', error);
            this.isSyncing = false;
            if (!silent) {
                this.updateSyncStatus('Sync failed', null);
            }
            throw error;
        }
    }

    // Download data from Google Drive
    async downloadData(silent = false) {
        if (!this.isAuthenticated) {
            throw new Error('Not authenticated with Google Drive');
        }

        try {
            if (!silent) {
                this.updateSyncStatus('Loading...', null);
            }

            // If shared file ID is provided, use it directly
            const sharedFileId = this.getSharedFileId();
            if (sharedFileId) {
                this.fileId = sharedFileId;
                
                // Get file metadata first to check modified time
                const metadataResponse = await fetch(
                    `https://www.googleapis.com/drive/v3/files/${this.fileId}?fields=id,modifiedTime`,
                    {
                        headers: {
                            'Authorization': `Bearer ${this.accessToken}`
                        }
                    }
                );

                if (!metadataResponse.ok) {
                    throw new Error('Failed to get file metadata');
                }

                const metadata = await metadataResponse.json();
                this.lastKnownModifiedTime = metadata.modifiedTime;

                // Download the shared file - use raw fetch for media download
                const response = await fetch(
                    `https://www.googleapis.com/drive/v3/files/${this.fileId}?alt=media`,
                    {
                        headers: {
                            'Authorization': `Bearer ${this.accessToken}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to download shared file. Make sure the file is shared with you.');
                }

                const text = await response.text();
                const content = JSON.parse(text);

                const now = new Date().toISOString();
                this.saveConfig({ lastSync: now, lastModified: metadata.modifiedTime });
                
                if (!silent) {
                    this.updateSyncStatus('Loaded from shared file', now);
                }
                
                return content;
            }

            // Otherwise, use folder-based approach (original behavior)
            await this.findOrCreateFolder();

            const fileName = this.getFileName();

            // Find the file
            const searchResponse = await this.makeApiCall(
                'GET',
                'https://www.googleapis.com/drive/v3/files',
                {
                    q: `name='${fileName}' and '${this.folderId}' in parents and trashed=false`,
                    fields: 'files(id, name)'
                }
            );

            if (!searchResponse.files || searchResponse.files.length === 0) {
                throw new Error('No data file found in Google Drive');
            }

            this.fileId = searchResponse.files[0].id;

            // Get file metadata first
            const metadataResponse = await fetch(
                `https://www.googleapis.com/drive/v3/files/${this.fileId}?fields=id,modifiedTime`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                }
            );

            if (!metadataResponse.ok) {
                throw new Error('Failed to get file metadata');
            }

            const metadata = await metadataResponse.json();
            this.lastKnownModifiedTime = metadata.modifiedTime;

            // Download file content - use raw fetch for media download
            const response = await fetch(
                `https://www.googleapis.com/drive/v3/files/${this.fileId}?alt=media`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            const text = await response.text();
            const content = JSON.parse(text);

            const now = new Date().toISOString();
            this.saveConfig({ lastSync: now, lastModified: metadata.modifiedTime });
            
            if (!silent) {
                this.updateSyncStatus('Loaded successfully', now);
            }

            return content;

        } catch (error) {
            console.error('Error downloading data:', error);
            if (!silent) {
                this.updateSyncStatus('Load failed', null);
            }
            throw error;
        }
    }

    // Make API call to Google Drive
    async makeApiCall(method, url, params = null, body = null, contentType = 'application/json') {
        const headers = {
            'Authorization': `Bearer ${this.accessToken}`
        };

        if (contentType) {
            headers['Content-Type'] = contentType;
        }

        let fullUrl = url;
        if (params) {
            const queryString = new URLSearchParams(params).toString();
            fullUrl += `?${queryString}`;
        }

        const options = {
            method: method,
            headers: headers
        };

        if (body) {
            options.body = typeof body === 'string' ? body : JSON.stringify(body);
        }

        const response = await fetch(fullUrl, options);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API call failed');
        }

        // Handle empty responses
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    }

    // Enable auto-sync
    enableAutoSync(intervalMinutes = 5) {
        if (this.autoSyncInterval) {
            clearInterval(this.autoSyncInterval);
        }

        this.autoSyncEnabled = true;
        this.saveConfig({ autoSync: true });

        // Sync every X minutes
        this.autoSyncInterval = setInterval(() => {
            if (this.isAuthenticated && typeof syncToGoogleDrive === 'function') {
                console.log('Auto-syncing to Google Drive...');
                syncToGoogleDrive();
            }
        }, intervalMinutes * 60 * 1000);

        alert(`Auto-sync enabled! Data will sync every ${intervalMinutes} minutes.`);
    }

    // Disable auto-sync
    disableAutoSync() {
        if (this.autoSyncInterval) {
            clearInterval(this.autoSyncInterval);
            this.autoSyncInterval = null;
        }

        this.autoSyncEnabled = false;
        this.saveConfig({ autoSync: false });

        alert('Auto-sync disabled.');
    }

    // Load configuration into UI
    loadConfigIntoUI() {
        const emailInput = document.getElementById('googleEmail');
        const passwordInput = document.getElementById('googlePassword');
        const folderInput = document.getElementById('folderName');
        const sharedFileIdInput = document.getElementById('sharedFileId');
        const clubSelect = document.getElementById('clubSelect');

        if (emailInput) emailInput.value = this.config.email || '';
        if (passwordInput) passwordInput.value = this.config.password || '';
        if (folderInput) folderInput.value = this.config.folderName || 'Awana-Tracker-Data';
        if (sharedFileIdInput) sharedFileIdInput.value = this.config.sharedFileId || '';
        if (clubSelect) clubSelect.value = this.config.club || 'sparks';

        // Update page title based on club
        const clubName = (this.config.club === 'tnt') ? 'T&T' : 'Sparks';
        const h1 = document.querySelector('h1');
        if (h1) h1.textContent = `${clubName} Club Tracker`;

        if (this.config.lastSync) {
            this.updateSyncStatus('Configured', this.config.lastSync);
        } else {
            this.updateSyncStatus('Not configured', null);
        }
    }

    // Get current file ID for sharing
    getCurrentFileId() {
        if (this.fileId) {
            return this.fileId;
        }
        const sharedFileId = this.getSharedFileId();
        if (sharedFileId) {
            return sharedFileId;
        }
        return null;
    }

    // Check if file has been modified by others
    async checkForUpdates() {
        if (!this.isAuthenticated || !this.fileId) {
            return false;
        }

        try {
            const response = await fetch(
                `https://www.googleapis.com/drive/v3/files/${this.fileId}?fields=modifiedTime`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                }
            );

            if (!response.ok) {
                return false;
            }

            const metadata = await response.json();
            const serverModifiedTime = metadata.modifiedTime;
            const localModifiedTime = this.config.lastModified || this.lastKnownModifiedTime;

            // If server version is newer, there are updates
            if (localModifiedTime && serverModifiedTime > localModifiedTime) {
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error checking for updates:', error);
            return false;
        }
    }

    // Start polling for updates
    startPolling() {
        if (this.pollingInterval) {
            return; // Already polling
        }

        const intervalSeconds = this.config.autoSyncInterval || 30;
        
        this.pollingInterval = setInterval(async () => {
            if (!this.isAuthenticated || this.isSyncing) {
                return;
            }

            try {
                const hasUpdates = await this.checkForUpdates();
                
                if (hasUpdates) {
                    console.log('Updates detected from other users');
                    this.updateSyncStatus('Updates available...', null);
                    
                    // Auto-load the updates
                    const data = await this.downloadData(true);
                    
                    // Update app data without confirmation
                    if (typeof appData !== 'undefined' && typeof renderAll === 'function') {
                        appData = data;
                        localStorage.setItem('awanaTrackerData', JSON.stringify(appData));
                        renderAll();
                        this.updateSyncStatus('Auto-updated', new Date().toISOString());
                        
                        // Show notification
                        this.showNotification('Data updated from Google Drive');
                    }
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, intervalSeconds * 1000);

        console.log(`Polling started (every ${intervalSeconds} seconds)`);
    }

    // Stop polling
    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
            console.log('Polling stopped');
        }
    }

    // Show notification to user
    showNotification(message) {
        // Create a simple notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Initialize auto-sync on startup
    async initializeAutoSync() {
        if (!this.isAuthenticated) {
            return;
        }

        try {
            // Load data from Drive on startup
            const data = await this.downloadData(true);
            
            if (typeof appData !== 'undefined' && typeof renderAll === 'function') {
                appData = data;
                localStorage.setItem('awanaTrackerData', JSON.stringify(appData));
                renderAll();
                this.updateSyncStatus('Loaded from Drive', new Date().toISOString());
            }

            // Start polling for updates
            this.startPolling();
            
        } catch (error) {
            console.error('Auto-sync initialization error:', error);
            // If file doesn't exist yet, that's okay
            if (error.message.includes('No data file found')) {
                console.log('No existing file found, will create on first sync');
                this.startPolling();
            }
        }
    }
}

// Create global instance
const googleDriveSync = new GoogleDriveSync();

// Made with Bob
