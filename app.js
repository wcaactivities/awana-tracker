// Data structure
let appData = {
    clubbers: [],
    books: [],
    sections: [],
    dates: [],
    progressData: {}, // { date: [{ clubberId, present, uniform, handbook, bible, couponsEarned, couponsSpent, book, section }] }
    couponDates: ['', '', '', ''], // 4 editable date headers
    couponSpending: {} // { clubberId: [spent1, spent2, spent3, spent4] }
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeTabs();
    renderAll();
});

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    // Render specific tab content
    if (tabName === 'summary') {
        renderSummary();
    } else if (tabName === 'progress') {
        renderProgress();
    } else if (tabName === 'coupons') {
        renderCoupons();
    } else if (tabName === 'admin') {
        renderAdmin();
    } else if (tabName === 'config') {
        renderConfig();
    }
}

// Local Storage functions
function saveData() {
    localStorage.setItem('awanaTrackerData', JSON.stringify(appData));
}

function loadData() {
    const saved = localStorage.getItem('awanaTrackerData');
    if (saved) {
        appData = JSON.parse(saved);
        
        // Initialize missing data structures for backward compatibility
        if (!appData.couponDates) {
            appData.couponDates = ['', '', '', ''];
        }
        if (!appData.couponSpending) {
            appData.couponSpending = {};
        }
        
        // Initialize coupon spending for existing clubbers who don't have it
        appData.clubbers.forEach(clubber => {
            if (!appData.couponSpending[clubber.id]) {
                appData.couponSpending[clubber.id] = [0, 0, 0, 0];
            }
        });
        
        // Save the updated data structure
        saveData();
    }
}

// Admin Tab - Clubbers
function addClubber() {
    const input = document.getElementById('newClubberName');
    const name = input.value.trim();
    
    if (name) {
        const id = Date.now().toString();
        appData.clubbers.push({ id, name });
        appData.couponSpending[id] = [0, 0, 0, 0]; // Initialize coupon spending
        input.value = '';
        saveData();
        renderAdmin();
        renderProgress();
        renderSummary();
        renderCoupons();
    }
}

function updateClubber(id, newName) {
    const clubber = appData.clubbers.find(c => c.id === id);
    if (clubber) {
        clubber.name = newName;
        saveData();
        renderProgress();
        renderSummary();
    }
}

function deleteClubber(id) {
    if (confirm('Are you sure you want to delete this clubber? All their progress data will be lost.')) {
        appData.clubbers = appData.clubbers.filter(c => c.id !== id);
        // Remove from all progress data
        Object.keys(appData.progressData).forEach(date => {
            appData.progressData[date] = appData.progressData[date].filter(p => p.clubberId !== id);
        });
        // Remove coupon spending data
        delete appData.couponSpending[id];
        saveData();
        renderAdmin();
        renderProgress();
        renderSummary();
        renderCoupons();
    }
}

function renderAdmin() {
    const list = document.getElementById('clubbersList');
    
    if (appData.clubbers.length === 0) {
        list.innerHTML = '<div class="empty-state">No clubbers added yet. Add your first clubber above.</div>';
        return;
    }
    
    list.innerHTML = appData.clubbers.map(clubber => `
        <div class="item">
            <input type="text" value="${clubber.name}" 
                   onchange="updateClubber('${clubber.id}', this.value)">
            <button class="delete-btn" onclick="deleteClubber('${clubber.id}')">Delete</button>
        </div>
    `).join('');
}

// Config Tab - Books
function addBook() {
    const input = document.getElementById('newBook');
    const name = input.value.trim();
    
    if (name) {
        const id = Date.now().toString();
        appData.books.push({ id, name });
        input.value = '';
        saveData();
        renderConfig();
        renderProgress();
    }
}

function updateBook(id, newName) {
    const book = appData.books.find(b => b.id === id);
    if (book) {
        book.name = newName;
        saveData();
        renderProgress();
    }
}

function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        appData.books = appData.books.filter(b => b.id !== id);
        saveData();
        renderConfig();
        renderProgress();
    }
}

// Config Tab - Sections
function addSection() {
    const input = document.getElementById('newSection');
    const name = input.value.trim();
    
    if (name) {
        const id = Date.now().toString();
        appData.sections.push({ id, name });
        input.value = '';
        saveData();
        renderConfig();
        renderProgress();
    }
}

function updateSection(id, newName) {
    const section = appData.sections.find(s => s.id === id);
    if (section) {
        section.name = newName;
        saveData();
        renderProgress();
    }
}

function deleteSection(id) {
    if (confirm('Are you sure you want to delete this section?')) {
        appData.sections = appData.sections.filter(s => s.id !== id);
        saveData();
        renderConfig();
        renderProgress();
    }
}

// Config Tab - Dates
function addDate() {
    const input = document.getElementById('newDate');
    const date = input.value;
    
    if (date && !appData.dates.includes(date)) {
        appData.dates.push(date);
        appData.dates.sort();
        input.value = '';
        saveData();
        renderConfig();
        renderProgress();
    }
}

function deleteDate(date) {
    if (confirm('Are you sure you want to delete this date? All progress data for this date will be lost.')) {
        appData.dates = appData.dates.filter(d => d !== date);
        delete appData.progressData[date];
        saveData();
        renderConfig();
        renderProgress();
        renderSummary();
    }
}

function renderConfig() {
    // Render books
    const booksList = document.getElementById('booksList');
    if (appData.books.length === 0) {
        booksList.innerHTML = '<div class="empty-state">No books added yet.</div>';
    } else {
        booksList.innerHTML = appData.books.map(book => `
            <div class="item">
                <input type="text" value="${book.name}" 
                       onchange="updateBook('${book.id}', this.value)">
                <button class="delete-btn" onclick="deleteBook('${book.id}')">Delete</button>
            </div>
        `).join('');
    }

    // Render sections
    const sectionsList = document.getElementById('sectionsList');
    if (appData.sections.length === 0) {
        sectionsList.innerHTML = '<div class="empty-state">No sections added yet.</div>';
    } else {
        sectionsList.innerHTML = appData.sections.map(section => `
            <div class="item">
                <input type="text" value="${section.name}" 
                       onchange="updateSection('${section.id}', this.value)">
                <button class="delete-btn" onclick="deleteSection('${section.id}')">Delete</button>
            </div>
        `).join('');
    }

    // Render dates
    const datesList = document.getElementById('datesList');
    if (appData.dates.length === 0) {
        datesList.innerHTML = '<div class="empty-state">No dates added yet.</div>';
    } else {
        datesList.innerHTML = appData.dates.map(date => `
            <div class="item">
                <input type="date" value="${date}" disabled>
                <button class="delete-btn" onclick="deleteDate('${date}')">Delete</button>
            </div>
        `).join('');
    }
}

// Progress Tab
function renderProgress() {
    const dateSelect = document.getElementById('dateSelect');
    const currentDate = dateSelect.value;
    
    // Update date selector
    dateSelect.innerHTML = '<option value="">-- Select a Date --</option>' +
        appData.dates.map(date => `<option value="${date}" ${date === currentDate ? 'selected' : ''}>${formatDate(date)}</option>`).join('');
    
    // Add change listener
    dateSelect.onchange = function() {
        renderProgress();
    };

    const tbody = document.getElementById('progressTableBody');
    
    if (!currentDate) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-state">Please select a date to view/edit progress</td></tr>';
        return;
    }

    if (appData.clubbers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No clubbers added yet. Add clubbers in the Admin tab.</td></tr>';
        return;
    }

    // Initialize progress data for this date if it doesn't exist
    if (!appData.progressData[currentDate]) {
        appData.progressData[currentDate] = appData.clubbers.map(clubber => ({
            clubberId: clubber.id,
            present: false,
            uniform: false,
            handbook: false,
            bible: false,
            couponsEarned: 0,
            couponsSpent: 0,
            book: '',
            section: ''
        }));
        saveData();
    }

    // Sort clubbers alphabetically by name
    const sortedClubbers = [...appData.clubbers].sort((a, b) => a.name.localeCompare(b.name));
    
    tbody.innerHTML = sortedClubbers.map(clubber => {
        const progress = appData.progressData[currentDate].find(p => p.clubberId === clubber.id) || {
            clubberId: clubber.id,
            present: false,
            uniform: false,
            handbook: false,
            bible: false,
            couponsEarned: 0,
            couponsSpent: 0,
            book: '',
            section: ''
        };

        return `
            <tr>
                <td><strong>${clubber.name}</strong></td>
                <td><input type="checkbox" ${progress.present ? 'checked' : ''} 
                          onchange="updateProgress('${currentDate}', '${clubber.id}', 'present', this.checked)"></td>
                <td><input type="checkbox" ${progress.uniform ? 'checked' : ''} 
                          onchange="updateProgress('${currentDate}', '${clubber.id}', 'uniform', this.checked)"></td>
                <td><input type="checkbox" ${progress.handbook ? 'checked' : ''} 
                          onchange="updateProgress('${currentDate}', '${clubber.id}', 'handbook', this.checked)"></td>
                <td><input type="checkbox" ${progress.bible ? 'checked' : ''} 
                          onchange="updateProgress('${currentDate}', '${clubber.id}', 'bible', this.checked)"></td>
                <td><input type="number" min="0" value="${progress.couponsEarned}" 
                          onchange="updateProgress('${currentDate}', '${clubber.id}', 'couponsEarned', parseInt(this.value) || 0)"></td>
                <td><input type="number" min="0" value="${progress.couponsSpent}" 
                          onchange="updateProgress('${currentDate}', '${clubber.id}', 'couponsSpent', parseInt(this.value) || 0)"></td>
                <td>
                    <select onchange="updateProgress('${currentDate}', '${clubber.id}', 'book', this.value)">
                        <option value="">-- Select Book --</option>
                        ${appData.books.map(book => `<option value="${book.name}" ${progress.book === book.name ? 'selected' : ''}>${book.name}</option>`).join('')}
                    </select>
                </td>
                <td>
                    <select onchange="updateProgress('${currentDate}', '${clubber.id}', 'section', this.value)">
                        <option value="">-- Select Section --</option>
                        ${appData.sections.map(section => `<option value="${section.name}" ${progress.section === section.name ? 'selected' : ''}>${section.name}</option>`).join('')}
                    </select>
                </td>
            </tr>
        `;
    }).join('');
}

function updateProgress(date, clubberId, field, value) {
    if (!appData.progressData[date]) {
        appData.progressData[date] = [];
    }

    let progress = appData.progressData[date].find(p => p.clubberId === clubberId);
    
    if (!progress) {
        progress = {
            clubberId,
            present: false,
            uniform: false,
            handbook: false,
            bible: false,
            couponsEarned: 0,
            couponsSpent: 0,
            book: '',
            section: ''
        };
        appData.progressData[date].push(progress);
    }

    progress[field] = value;
    saveData();
    renderSummary();
}

// Summary Tab
function renderSummary() {
    const tbody = document.getElementById('summaryTableBody');
    
    if (appData.clubbers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No clubbers added yet. Add clubbers in the Admin tab.</td></tr>';
        return;
    }

    // Sort clubbers alphabetically by name
    const sortedClubbers = [...appData.clubbers].sort((a, b) => a.name.localeCompare(b.name));
    
    tbody.innerHTML = sortedClubbers.map(clubber => {
        const summary = calculateClubberSummary(clubber.id);
        return `
            <tr>
                <td><strong>${clubber.name}</strong></td>
                <td>${summary.attendance}</td>
                <td>${summary.totalCoupons}</td>
                <td>${summary.currentBook || '-'}</td>
                <td>${summary.currentSection || '-'}</td>
            </tr>
        `;
    }).join('');
}

function calculateClubberSummary(clubberId) {
    let attendance = 0;
    let totalCoupons = 0;
    let currentBook = '';
    let currentSection = '';

    // Sort dates chronologically
    const sortedDates = [...appData.dates].sort();
    
    sortedDates.forEach(date => {
        const progressForDate = appData.progressData[date];
        if (progressForDate) {
            const clubberProgress = progressForDate.find(p => p.clubberId === clubberId);
            if (clubberProgress) {
                if (clubberProgress.present) {
                    attendance++;
                }
                
                // Calculate coupons: 2 for each checkbox + earned coupons - spent coupons
                let couponsForDate = 0;
                if (clubberProgress.present) couponsForDate += 2;
                if (clubberProgress.uniform) couponsForDate += 2;
                if (clubberProgress.handbook) couponsForDate += 2;
                if (clubberProgress.bible) couponsForDate += 2;
                couponsForDate += clubberProgress.couponsEarned || 0;
                couponsForDate -= clubberProgress.couponsSpent || 0;
                
                totalCoupons += couponsForDate;
                
                // Keep track of last valid (non-blank) book
                if (clubberProgress.book && clubberProgress.book.trim() !== '') {
                    currentBook = clubberProgress.book;
                }
                
                // Keep track of last valid (non-blank) section
                if (clubberProgress.section && clubberProgress.section.trim() !== '') {
                    currentSection = clubberProgress.section;
                }
            }
        }
    });

    return {
        attendance,
        totalCoupons,
        currentBook,
        currentSection
    };
}

// Coupons Tab
function renderCoupons() {
    // Update date headers
    for (let i = 0; i < 4; i++) {
        const dateInput = document.getElementById(`couponDate${i + 1}`);
        if (dateInput) {
            dateInput.value = appData.couponDates[i] || '';
        }
    }

    const tbody = document.getElementById('couponsTableBody');
    
    if (appData.clubbers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No clubbers added yet. Add clubbers in the Admin tab.</td></tr>';
        return;
    }

    // Sort clubbers alphabetically by name
    const sortedClubbers = [...appData.clubbers].sort((a, b) => a.name.localeCompare(b.name));
    
    tbody.innerHTML = sortedClubbers.map(clubber => {
        // Initialize coupon spending data if it doesn't exist
        if (!appData.couponSpending[clubber.id]) {
            appData.couponSpending[clubber.id] = [0, 0, 0, 0];
        }
        
        const spending = appData.couponSpending[clubber.id];
        const balance = calculateCouponBalance(clubber.id);
        
        return `
            <tr>
                <td><strong>${clubber.name}</strong></td>
                <td><strong>${balance}</strong></td>
                <td><input type="number" min="0" value="${spending[0] || 0}"
                          onchange="updateCouponSpending('${clubber.id}', 0, parseInt(this.value) || 0)"></td>
                <td><input type="number" min="0" value="${spending[1] || 0}"
                          onchange="updateCouponSpending('${clubber.id}', 1, parseInt(this.value) || 0)"></td>
                <td><input type="number" min="0" value="${spending[2] || 0}"
                          onchange="updateCouponSpending('${clubber.id}', 2, parseInt(this.value) || 0)"></td>
                <td><input type="number" min="0" value="${spending[3] || 0}"
                          onchange="updateCouponSpending('${clubber.id}', 3, parseInt(this.value) || 0)"></td>
            </tr>
        `;
    }).join('');
}

function updateCouponDateHeader(index, date) {
    appData.couponDates[index] = date;
    saveData();
}

function updateCouponSpending(clubberId, index, value) {
    if (!appData.couponSpending[clubberId]) {
        appData.couponSpending[clubberId] = [0, 0, 0, 0];
    }
    appData.couponSpending[clubberId][index] = value;
    saveData();
    renderCoupons(); // Re-render to update balance
}

function calculateCouponBalance(clubberId) {
    // Calculate total earned coupons from all progress tables
    let totalEarned = 0;
    
    appData.dates.forEach(date => {
        const progressForDate = appData.progressData[date];
        if (progressForDate) {
            const clubberProgress = progressForDate.find(p => p.clubberId === clubberId);
            if (clubberProgress) {
                // Add 2 coupons for each checkbox
                if (clubberProgress.present) totalEarned += 2;
                if (clubberProgress.uniform) totalEarned += 2;
                if (clubberProgress.handbook) totalEarned += 2;
                if (clubberProgress.bible) totalEarned += 2;
                // Add earned coupons
                totalEarned += clubberProgress.couponsEarned || 0;
                // Subtract spent coupons from progress table
                totalEarned -= clubberProgress.couponsSpent || 0;
            }
        }
    });
    
    // Subtract spending from the 4 coupon columns
    const spending = appData.couponSpending[clubberId] || [0, 0, 0, 0];
    const totalSpent = spending.reduce((sum, val) => sum + (val || 0), 0);
    
    return totalEarned - totalSpent;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function refreshSummary() {
    renderSummary();
    alert('Summary refreshed successfully!');
}

function renderAll() {
    renderAdmin();
    renderConfig();
    renderProgress();
    renderSummary();
    renderCoupons();
}

// Made with Bob

// Excel Export/Import Functions
function exportToExcel() {
    const wb = XLSX.utils.book_new();
    
    // Export Summary Sheet
    const summaryData = [
        ['Clubber Name', 'Attendance', 'Total Coupons', 'Current Book', 'Current Section']
    ];
    
    const sortedClubbers = [...appData.clubbers].sort((a, b) => a.name.localeCompare(b.name));
    sortedClubbers.forEach(clubber => {
        const summary = calculateClubberSummary(clubber.id);
        summaryData.push([
            clubber.name,
            summary.attendance,
            summary.totalCoupons,
            summary.currentBook || '',
            summary.currentSection || ''
        ]);
    });
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
    
    // Export Progress Sheets (one sheet per date)
    appData.dates.sort().forEach(date => {
        const progressData = [
            ['Clubber Name', 'Present', 'Uniform', 'Handbook', 'Bible', 'Coupons Earned', 'Coupons Spent', 'Book', 'Section']
        ];
        
        const sortedClubbers = [...appData.clubbers].sort((a, b) => a.name.localeCompare(b.name));
        sortedClubbers.forEach(clubber => {
            const progress = appData.progressData[date]?.find(p => p.clubberId === clubber.id) || {
                present: false,
                uniform: false,
                handbook: false,
                bible: false,
                couponsEarned: 0,
                couponsSpent: 0,
                book: '',
                section: ''
            };
            
            progressData.push([
                clubber.name,
                progress.present ? 'Yes' : 'No',
                progress.uniform ? 'Yes' : 'No',
                progress.handbook ? 'Yes' : 'No',
                progress.bible ? 'Yes' : 'No',
                progress.couponsEarned || 0,
                progress.couponsSpent || 0,
                progress.book || '',
                progress.section || ''
            ]);
        });
        
        const progressSheet = XLSX.utils.aoa_to_sheet(progressData);
        const sheetName = formatDate(date).replace(/,/g, '');
        XLSX.utils.book_append_sheet(wb, progressSheet, sheetName);
    });
    
    // Export Config Sheet
    const configData = [
        ['Books', 'Sections', 'Dates'],
    ];
    
    const maxLength = Math.max(appData.books.length, appData.sections.length, appData.dates.length);
    for (let i = 0; i < maxLength; i++) {
        configData.push([
            appData.books[i]?.name || '',
            appData.sections[i]?.name || '',
            appData.dates[i] || ''
        ]);
    }
    
    const configSheet = XLSX.utils.aoa_to_sheet(configData);
    XLSX.utils.book_append_sheet(wb, configSheet, 'Config');
    
    // Export Clubbers Sheet
    const clubbersData = [['Clubber Names']];
    appData.clubbers.forEach(clubber => {
        clubbersData.push([clubber.name]);
    });
    
    const clubbersSheet = XLSX.utils.aoa_to_sheet(clubbersData);
    XLSX.utils.book_append_sheet(wb, clubbersSheet, 'Clubbers');
    
    // Generate filename with current date
    const filename = `Awana_Sparks_Tracker_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
}

function importFromExcel(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Confirm before importing
            if (!confirm('This will replace all current data. Are you sure you want to import?')) {
                event.target.value = '';
                return;
            }
            
            // Reset data
            appData = {
                clubbers: [],
                books: [],
                sections: [],
                dates: [],
                progressData: {}
            };
            
            // Import Clubbers
            if (workbook.SheetNames.includes('Clubbers')) {
                const clubbersSheet = workbook.Sheets['Clubbers'];
                const clubbersData = XLSX.utils.sheet_to_json(clubbersSheet, { header: 1 });
                
                for (let i = 1; i < clubbersData.length; i++) {
                    const name = clubbersData[i][0];
                    if (name && name.trim()) {
                        appData.clubbers.push({
                            id: Date.now().toString() + i,
                            name: name.trim()
                        });
                    }
                }
            }
            
            // Import Config
            if (workbook.SheetNames.includes('Config')) {
                const configSheet = workbook.Sheets['Config'];
                const configData = XLSX.utils.sheet_to_json(configSheet, { header: 1 });
                
                for (let i = 1; i < configData.length; i++) {
                    const book = configData[i][0];
                    const section = configData[i][1];
                    const date = configData[i][2];
                    
                    if (book && book.trim()) {
                        appData.books.push({
                            id: Date.now().toString() + 'b' + i,
                            name: book.trim()
                        });
                    }
                    
                    if (section && section.trim()) {
                        appData.sections.push({
                            id: Date.now().toString() + 's' + i,
                            name: section.trim()
                        });
                    }
                    
                    if (date) {
                        const dateStr = typeof date === 'number' ? 
                            XLSX.SSF.parse_date_code(date) : date;
                        const formattedDate = formatImportDate(dateStr);
                        if (formattedDate && !appData.dates.includes(formattedDate)) {
                            appData.dates.push(formattedDate);
                        }
                    }
                }
                
                appData.dates.sort();
            }
            
            // Import Progress Data
            workbook.SheetNames.forEach(sheetName => {
                if (sheetName !== 'Summary' && sheetName !== 'Config' && sheetName !== 'Clubbers') {
                    const sheet = workbook.Sheets[sheetName];
                    const progressData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                    
                    // Try to match sheet name to a date
                    const matchedDate = findMatchingDate(sheetName);
                    
                    if (matchedDate && progressData.length > 1) {
                        appData.progressData[matchedDate] = [];
                        
                        for (let i = 1; i < progressData.length; i++) {
                            const row = progressData[i];
                            const clubberName = row[0];
                            const clubber = appData.clubbers.find(c => c.name === clubberName);
                            
                            if (clubber) {
                                appData.progressData[matchedDate].push({
                                    clubberId: clubber.id,
                                    present: row[1] === 'Yes' || row[1] === true,
                                    uniform: row[2] === 'Yes' || row[2] === true,
                                    handbook: row[3] === 'Yes' || row[3] === true,
                                    bible: row[4] === 'Yes' || row[4] === true,
                                    couponsEarned: parseInt(row[5]) || 0,
                                    couponsSpent: parseInt(row[6]) || 0,
                                    book: row[7] || '',
                                    section: row[8] || ''
                                });
                            }
                        }
                    }
                }
            });
            
            saveData();
            renderAll();
            alert('Data imported successfully!');
            event.target.value = '';
            
        } catch (error) {
            alert('Error importing file: ' + error.message);
            event.target.value = '';
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function formatImportDate(dateInput) {
    if (!dateInput) return null;
    
    let date;
    if (typeof dateInput === 'object' && dateInput.y !== undefined) {
        // SheetJS date object - use UTC to avoid timezone shifts
        date = new Date(Date.UTC(dateInput.y, dateInput.m - 1, dateInput.d));
    } else if (typeof dateInput === 'string') {
        // Parse string date - if it's already in YYYY-MM-DD format, return as-is
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
            return dateInput;
        }
        date = new Date(dateInput + 'T00:00:00Z');
    } else {
        return null;
    }
    
    if (isNaN(date.getTime())) return null;
    
    // Use UTC methods to avoid timezone shifts
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function findMatchingDate(sheetName) {
    // Try to find a date that matches the sheet name
    for (const date of appData.dates) {
        const formattedDate = formatDate(date).replace(/,/g, '');
        if (formattedDate === sheetName || date === sheetName) {
            return date;
        }
    }
    return null;
}
