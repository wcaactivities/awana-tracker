# Awana Sparks Club Tracker

A web application for tracking the progress of Awana clubbers in Sparks club with Excel import/export capabilities.

## Features

### 4 Main Tabs:

1. **Summary Tab** - Overview of all clubbers with:
   - Clubber names
   - Total attendance count
   - Total coupons earned
   - Current book
   - Current section

2. **Progress Tab** - Detailed tracking per date:
   - Date selector (from configured dates)
   - Table with columns: Present, Uniform, Handbook, Bible, Coupons Earned, Coupons Spent, Book, Section
   - Each date has its own set of data

3. **Admin Tab** - Manage clubbers:
   - Add new clubbers
   - Edit clubber names
   - Delete clubbers

4. **Config Tab** - Configure lists:
   - Books list (add/edit/delete)
   - Sections list (add/edit/delete)
   - Dates list (add/delete)

## How to Use

1. **Setup Configuration:**
   - Go to the Config tab
   - Add books (e.g., "HangGlider", "WingRunner", "SkyStormer")
   - Add sections (e.g., "Section 1", "Section 2", etc.)
   - Add dates for your club meetings

2. **Add Clubbers:**
   - Go to the Admin tab
   - Add clubber names
   - Edit or delete as needed

3. **Track Progress:**
   - Go to the Progress tab
   - Select a date from the dropdown
   - Fill in attendance, uniform, handbook, bible checkboxes
   - Enter coupons earned and spent
   - Select current book and section for each clubber

4. **View Summary:**
   - Go to the Summary tab
   - See aggregated data for all clubbers
   - Attendance shows total present count across all dates
   - Coupons shows total earned across all dates
   - Book and Section show values from the most recent date

## Installation

Simply open `index.html` in a web browser. No server or installation required.

## Excel Import/Export

### Export to Excel
- Click the "📥 Export to Excel" button in the Summary tab
- Downloads an Excel file with multiple sheets:
  - **Summary Sheet:** Overview of all clubbers
  - **Progress Sheets:** One sheet per date with detailed progress
  - **Config Sheet:** Books, sections, and dates
  - **Clubbers Sheet:** List of all clubber names
- Filename includes current date for easy organization

### Import from Excel
- Click the "📤 Import from Excel" button in the Summary tab
- Select an Excel file previously exported from this app
- **Warning:** Import will replace ALL current data
- The app will automatically:
  - Import clubber names
  - Import books, sections, and dates
  - Import all progress data for each date
  - Match progress data to clubbers by name

### Import/Export Tips
- Export regularly to backup your data
- Use exported files to transfer data between devices
- Edit exported Excel files carefully - maintain the structure
- Clubber names must match exactly for progress data to import correctly

## Data Storage

All data is stored locally in your browser using localStorage. Data persists between sessions but is specific to the browser and device you're using. Use Excel export for backups and data portability.

## Browser Compatibility

Works in all modern browsers (Chrome, Firefox, Safari, Edge).

## Tips

- Data is automatically saved as you make changes
- Use the date selector in the Progress tab to switch between different meeting dates
- The Summary tab automatically calculates totals from all progress entries
- You can edit clubber names in the Admin tab without losing their progress data
- **Export your data regularly** to prevent data loss
- Clubbers are displayed alphabetically in Progress and Summary tabs
- Current Book/Section in Summary shows the last non-blank value across all dates