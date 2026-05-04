#!/usr/bin/env python3
"""
Generate app icons for Awana Tracker
Creates icon-192.png and icon-512.png
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
    
    def create_icon(size, filename):
        """Create an icon with gradient background and text"""
        # Create image with gradient
        img = Image.new('RGB', (size, size))
        draw = ImageDraw.Draw(img)
        
        # Create purple gradient
        for y in range(size):
            # Interpolate between two colors
            ratio = y / size
            r = int(102 + (118 - 102) * ratio)  # 667eea to 764ba2
            g = int(126 + (75 - 126) * ratio)
            b = int(234 + (162 - 234) * ratio)
            draw.line([(0, y), (size, y)], fill=(r, g, b))
        
        # Add text
        try:
            # Try to use a nice font
            font_size = int(size * 0.4)
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
            small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", int(size * 0.12))
        except:
            try:
                # Fallback for other systems
                font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", int(size * 0.4))
                small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", int(size * 0.12))
            except:
                # Use default font if no TrueType available
                font = ImageFont.load_default()
                small_font = ImageFont.load_default()
        
        # Draw "AS" text
        text = "AS"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = (size - text_width) // 2
        y = (size - text_height) // 2 - int(size * 0.05)
        draw.text((x, y), text, fill='white', font=font)
        
        # Draw "Awana" subtitle
        subtitle = "Awana"
        bbox = draw.textbbox((0, 0), subtitle, font=small_font)
        text_width = bbox[2] - bbox[0]
        x = (size - text_width) // 2
        y = int(size * 0.75)
        draw.text((x, y), subtitle, fill='white', font=small_font)
        
        # Save image
        img.save(filename, 'PNG')
        print(f"✅ Created {filename}")
    
    # Get script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Create icons
    print("🎨 Generating app icons...")
    create_icon(192, os.path.join(script_dir, 'icon-192.png'))
    create_icon(512, os.path.join(script_dir, 'icon-512.png'))
    print("✨ Done! Icons created successfully.")
    
except ImportError:
    print("❌ Error: PIL (Pillow) library not found.")
    print("\nTo install Pillow, run:")
    print("  pip3 install Pillow")
    print("\nOr use the alternative method:")
    print("  Open create-icons.html in your browser and download the icons")
    exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    print("\nAlternative method:")
    print("  Open create-icons.html in your browser and download the icons")
    exit(1)

# Made with Bob
