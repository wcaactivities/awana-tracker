# Logo and Theme Instructions

## Current Logos and Themes

### Sparks Club
- **Logo File:** `sparks-logo.png`
- **Format:** PNG (412 x 122 pixels)
- **Theme Color:** Red (#dc2626 to #991b1b gradient)
- **Title:** "Sparks Club Tracker"
- **Usage:** Displayed when "Sparks" club is selected in Config tab

### T&T Club (Truth & Training)
- **Logo File:** `tnt-logo.svg`
- **Format:** SVG (scalable vector graphics)
- **Theme Color:** Green (#16a34a to #15803d gradient)
- **Title:** "T&T Club Tracker"
- **Usage:** Displayed when "T&T (Truth & Training)" club is selected in Config tab

## Theme System

The application uses CSS variables to dynamically change the color theme:

- **Sparks Theme (Red):**
  - Primary: #dc2626
  - Dark: #991b1b
  - Light: #ef4444

- **T&T Theme (Green):**
  - Primary: #16a34a
  - Dark: #15803d
  - Light: #22c55e

When you select a club in the Config tab, the entire application theme changes including:
- Background gradient
- Header background
- Table headers
- Active tab indicators
- Button colors
- Link colors

## Creating a PNG Version of T&T Logo

If you need a PNG version of the T&T logo instead of SVG:

### Option 1: Using the HTML Generator
1. Open `create-tnt-logo.html` in a web browser
2. The logo will be displayed on a canvas with green gradient
3. Click "Download T&T Logo" button
4. Save the file as `tnt-logo.png` in the awana-tracker directory
5. Update `app.js` line 946 to use `tnt-logo.png` instead of `tnt-logo.svg`

### Option 2: Convert SVG to PNG
Use an online converter or command-line tool:
```bash
# Using ImageMagick (if installed)
convert tnt-logo.svg tnt-logo.png

# Using Inkscape (if installed)
inkscape tnt-logo.svg --export-filename=tnt-logo.png
```

## Customizing Logos

### To Replace the Sparks Logo:
1. Create or obtain a new logo image (recommended size: 412 x 122 pixels)
2. Save it as `sparks-logo.png` in the awana-tracker directory
3. The app will automatically use the new logo

### To Replace the T&T Logo:
1. Create or obtain a new logo image (recommended size: 412 x 122 pixels)
2. Save it as `tnt-logo.svg` (SVG) or `tnt-logo.png` (PNG)
3. If using PNG, update `app.js` line 943 to reference the PNG file

### To Add More Club Options:
1. Add the new club option to the dropdown in `index.html` (Config tab)
2. Create a logo file for the new club
3. Update the `updateClubDisplay()` function in `app.js` to handle the new club
4. Add the logo file reference in the appropriate case

## Logo Display Logic

The logo is dynamically changed based on the club selection in the Config tab:
- When user selects a club from the dropdown
- The `saveClubSelection()` function is called
- This triggers `updateClubDisplay()` which changes both the logo and title
- The selection is saved and persists across sessions