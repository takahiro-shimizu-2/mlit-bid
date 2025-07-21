from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background
    margin = size // 10
    draw.rounded_rectangle([margin, margin, size-margin, size-margin], 
                          radius=size//10, fill=(25, 118, 210, 255))
    
    # Document lines
    line_margin = size // 5
    line_height = max(2, size // 20)
    line_spacing = size // 8
    
    y = line_margin
    line_widths = [0.8, 0.6, 0.7, 0.5, 0.8]
    
    for i, width in enumerate(line_widths):
        if y + line_height < size - line_margin:
            line_width = int((size - 2 * line_margin) * width)
            draw.rectangle([line_margin, y, line_margin + line_width, y + line_height], 
                          fill=(255, 255, 255, 255) if i == 0 else (187, 222, 251, 255))
            y += line_spacing
    
    # Clock icon in corner
    if size >= 48:
        clock_size = size // 4
        clock_center = (size - line_margin - clock_size // 2, size - line_margin - clock_size // 2)
        draw.ellipse([clock_center[0] - clock_size//2, clock_center[1] - clock_size//2,
                     clock_center[0] + clock_size//2, clock_center[1] + clock_size//2],
                    fill=(255, 193, 7, 255))
        
        # Clock hands
        draw.line([clock_center[0], clock_center[1], 
                  clock_center[0], clock_center[1] - clock_size//3], 
                 fill=(33, 33, 33, 255), width=max(1, size//40))
        draw.line([clock_center[0], clock_center[1], 
                  clock_center[0] + clock_size//4, clock_center[1]], 
                 fill=(33, 33, 33, 255), width=max(1, size//40))
    
    return img

# Create icons in different sizes
sizes = [16, 48, 128]
for size in sizes:
    icon = create_icon(size)
    icon.save(f'src/icons/icon{size}.png')
    print(f'Created icon{size}.png')

print('All icons created successfully!')