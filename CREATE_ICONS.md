# Creating App Icons for Android

To complete the Progressive Web App setup, you need to create two icon files:

## Required Icons:
1. `icon-192.png` - 192x192 pixels
2. `icon-512.png` - 512x512 pixels

## Option 1: Use an Online Icon Generator (Easiest)

### Method A: PWA Asset Generator
1. Visit: https://www.pwabuilder.com/imageGenerator
2. Upload a square image (logo or design)
3. Download the generated icons
4. Rename them to `icon-192.png` and `icon-512.png`
5. Place them in the `awana-tracker` folder

### Method B: Favicon.io
1. Visit: https://favicon.io/favicon-generator/
2. Create a simple icon with text "AS" (Awana Sparks)
3. Choose colors (purple/blue to match app theme)
4. Download and extract
5. Rename the 192x192 and 512x512 files
6. Place in `awana-tracker` folder

## Option 2: Create Manually

### Using Any Image Editor (Photoshop, GIMP, Canva, etc.):

1. **Create a 512x512 pixel image:**
   - Background: Purple gradient (#667eea to #764ba2)
   - Add white text: "AS" or "Awana"
   - Or use the Awana Sparks logo (if you have permission)
   - Save as `icon-512.png`

2. **Create a 192x192 pixel version:**
   - Resize the 512x512 image to 192x192
   - Save as `icon-192.png`

3. **Place both files in the `awana-tracker` folder**

## Option 3: Simple Text-Based Icon

If you don't have design tools, you can create a simple colored square:

1. Use an online tool like: https://dummyimage.com/
2. Create icons:
   - 192x192: `https://dummyimage.com/192x192/667eea/ffffff&text=AS`
   - 512x512: `https://dummyimage.com/512x512/667eea/ffffff&text=AS`
3. Right-click and save each image
4. Rename to `icon-192.png` and `icon-512.png`
5. Place in `awana-tracker` folder

## Icon Design Tips:

- **Keep it simple:** Clear, recognizable design
- **Use brand colors:** Purple/blue gradient (#667eea, #764ba2)
- **High contrast:** White text/symbols on colored background
- **Square format:** Icons should be square (1:1 aspect ratio)
- **No transparency:** Use solid background color
- **Readable:** Should be clear even at small sizes

## Suggested Icon Designs:

1. **Text-based:**
   - "AS" (Awana Sparks)
   - "AT" (Awana Tracker)
   - "⭐" (Star symbol)

2. **Symbol-based:**
   - Spark/flame icon
   - Star icon
   - Book icon

3. **Combined:**
   - Star with "AS" text
   - Flame with "Awana" text

## Testing Your Icons:

After creating and placing the icons:
1. Upload all files to your web server
2. Open the app in Chrome on Android
3. Install as PWA
4. Check if the icon appears correctly on home screen

## Note:

The app will work without custom icons, but having proper icons makes it look more professional and easier to identify on the Android home screen.