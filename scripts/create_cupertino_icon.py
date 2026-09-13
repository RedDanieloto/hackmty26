import math
from PIL import Image, ImageDraw

def create_cupertino_icon():
    SCALE = 4
    SIZE = 1024 * SCALE
    img = Image.new('RGBA', (SIZE, SIZE))
    draw = ImageDraw.Draw(img)

    # 1. Subtle Apple Hunter Green Gradient Background
    for y in range(SIZE):
        f = y / SIZE
        r = int(66 - 12 * f)
        g = int(101 - 18 * f)
        b = int(72 - 16 * f)
        draw.line([(0, y), (SIZE, y)], fill=(r, g, b, 255))

    SAND_DUNE = (221, 214, 185, 255)       # #DDD6B9
    SAND_DUNE_LIGHT = (245, 241, 230, 255) # #F5F1E6
    HUNTER_INNER = (46, 72, 51, 255)       # subtle depth inside lock body

    cx = SIZE // 2
    cy = SIZE // 2

    # 2. Cupertino Minimalist Padlock + Voice Wave Glyph
    # Shackle
    shackle_r = 145 * SCALE
    shackle_stroke = 34 * SCALE
    shackle_top = cy - 255 * SCALE
    shackle_bottom = cy - 45 * SCALE

    # Shackle arc (smooth rounded top)
    draw.arc(
        [cx - shackle_r, shackle_top, cx + shackle_r, shackle_top + shackle_r * 2],
        start=180,
        end=0,
        fill=SAND_DUNE,
        width=shackle_stroke
    )
    # Shackle vertical legs
    left_x = cx - shackle_r + shackle_stroke // 2
    right_x = cx + shackle_r - shackle_stroke // 2
    draw.line([(left_x, shackle_top + shackle_r), (left_x, shackle_bottom)], fill=SAND_DUNE, width=shackle_stroke)
    draw.line([(right_x, shackle_top + shackle_r), (right_x, shackle_bottom)], fill=SAND_DUNE, width=shackle_stroke)

    # Lock Body
    body_w = 460 * SCALE
    body_h = 340 * SCALE
    body_r = 72 * SCALE
    bx0 = cx - body_w // 2
    by0 = cy - 50 * SCALE
    bx1 = cx + body_w // 2
    by1 = by0 + body_h

    # Draw Lock Body with solid deep hunter green and thick, smooth Sand Dune border
    draw.rounded_rectangle(
        [bx0, by0, bx1, by1],
        radius=body_r,
        fill=HUNTER_INNER,
        outline=SAND_DUNE,
        width=30 * SCALE
    )

    # 3. Voice Waveform Bars inside the Lock
    # 5 precision soundwave bars with rounded pill caps
    bar_w = 24 * SCALE
    bar_spacing = 46 * SCALE
    bar_heights = [70 * SCALE, 140 * SCALE, 210 * SCALE, 140 * SCALE, 70 * SCALE]
    center_y = (by0 + by1) // 2

    for i, bh in enumerate(bar_heights):
        bx = cx + (i - 2) * bar_spacing
        y0 = center_y - bh // 2
        y1 = center_y + bh // 2
        col = SAND_DUNE_LIGHT if i == 2 else SAND_DUNE
        draw.rounded_rectangle(
            [bx - bar_w // 2, y0, bx + bar_w // 2, y1],
            radius=bar_w // 2,
            fill=col
        )

    # 4. Downsample to 1024x1024 using Lanczos
    final_img = img.resize((1024, 1024), Image.Resampling.LANCZOS)
    final_img.save('assets/images/voice-auth-icon.png')
    
    # Also save small splash icon
    splash_icon = final_img.resize((200, 200), Image.Resampling.LANCZOS)
    splash_icon.save('assets/images/splash-icon.png')

    print('Successfully generated clean Cupertino minimalist icon.')

if __name__ == '__main__':
    create_cupertino_icon()
