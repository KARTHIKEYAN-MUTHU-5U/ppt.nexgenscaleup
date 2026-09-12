"""
Generate 22 High-Quality Transparent Vector-Style Animated GIF Emotes
All emotes are 200x200 px, loop infinitely, have pure transparent backgrounds,
and follow an executive warm color palette (Coral #E8734A, Amber #D97706, Slate #2D3B4E, Sage #1A7A6D, Plum #8B5CF6).
ABSOLUTELY ZERO BLUE!
"""

import os
import math
from PIL import Image, ImageDraw

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "static", "emotes")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Executive Warm Palette
CORAL = (232, 115, 74, 255)
AMBER = (217, 119, 6, 255)
SLATE = (45, 59, 78, 255)
DARK_SLATE = (28, 36, 48, 255)
SAGE = (26, 122, 109, 255)
PLUM = (139, 92, 246, 255)
WHITE = (255, 255, 255, 255)
WARM_GRAY = (220, 215, 205, 255)
RED = (220, 38, 38, 255)
GOLD = (245, 158, 11, 255)

def save_clean_gif(frames, filename, duration=80):
    p_frames = []
    for im in frames:
        alpha = im.split()[3]
        mask = Image.eval(alpha, lambda a: 255 if a < 64 else 0)
        im_rgb = im.convert('RGB')
        p_im = im_rgb.quantize(colors=254, method=Image.MEDIANCUT)
        p_im.paste(254, mask)
        p_frames.append(p_im)
    out_path = os.path.join(OUTPUT_DIR, filename)
    p_frames[0].save(
        out_path,
        save_all=True,
        append_images=p_frames[1:],
        duration=duration,
        loop=0,
        transparency=254,
        disposal=2
    )
    print(f"Generated {filename}")

def make_calc():
    # 1. calc.gif - Calculator with pulsing display and active button
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        # Body
        d.rounded_rectangle([45, 30, 155, 170], radius=16, fill=SLATE, outline=WARM_GRAY, width=3)
        # Screen
        screen_val = 150 + int(40 * math.sin(i * math.pi / 6))
        d.rounded_rectangle([58, 44, 142, 75], radius=6, fill=(screen_val, 230, 210, 255), outline=WARM_GRAY, width=2)
        d.rectangle([115, 54, 135, 65], fill=DARK_SLATE)
        # Keypad buttons
        for row in range(3):
            for col in range(3):
                bx = 60 + col * 28
                by = 88 + row * 24
                active = (row == 1 and col == 2 and (i % 4 < 2))
                color = CORAL if active else (GOLD if row == 2 and col == 2 else WARM_GRAY)
                d.rounded_rectangle([bx, by, bx + 22, by + 18], radius=4, fill=color)
        frames.append(im)
    save_clean_gif(frames, "calc.gif")

def make_ledger():
    # 2. ledger.gif - Accounting ledger book flipping page with checkmark
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        # Book cover
        d.rounded_rectangle([40, 40, 160, 165], radius=12, fill=SLATE, outline=GOLD, width=3)
        # Spine
        d.rounded_rectangle([40, 40, 60, 165], radius=6, fill=AMBER)
        # Pages
        d.rounded_rectangle([65, 48, 152, 157], radius=6, fill=WHITE, outline=WARM_GRAY, width=2)
        # Lines on page
        for line in range(4):
            ly = 65 + line * 18
            d.line([75, ly, 142, ly], fill=WARM_GRAY, width=2)
        # Floating badge / stamp
        pulse = 4 * math.sin(i * math.pi / 6)
        d.ellipse([110, 105 - pulse, 145, 140 - pulse], fill=SAGE, outline=WHITE, width=2)
        # Checkmark in badge
        d.line([118, 122 - pulse, 126, 130 - pulse], fill=WHITE, width=3)
        d.line([126, 130 - pulse, 138, 116 - pulse], fill=WHITE, width=3)
        frames.append(im)
    save_clean_gif(frames, "ledger.gif")

def make_stamp():
    # 3. stamp.gif - Executive Stamp pressing down
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        # Stamp handle moves down and up
        y_offset = int(14 * math.sin(i * math.pi / 6))
        # Handle
        d.ellipse([90, 25 + y_offset, 110, 45 + y_offset], fill=GOLD)
        d.rounded_rectangle([94, 40 + y_offset, 106, 85 + y_offset], radius=4, fill=AMBER)
        # Stamp base
        d.rounded_rectangle([55, 85 + y_offset, 145, 110 + y_offset], radius=8, fill=SLATE, outline=GOLD, width=2)
        # Stamp imprint on paper
        if i >= 4:
            d.rounded_rectangle([45, 135, 155, 168], radius=6, fill=(220, 38, 38, 40), outline=RED, width=3)
            d.rectangle([55, 145, 145, 158], fill=RED)
        frames.append(im)
    save_clean_gif(frames, "stamp.gif")

def make_chart_up():
    # 4. chart_up.gif - Bar chart with rising line graph and pulse dot
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        # Base axes
        d.line([35, 165, 165, 165], fill=WARM_GRAY, width=3)
        d.line([35, 35, 35, 165], fill=WARM_GRAY, width=3)
        # 3 Bars
        h1 = 40 + int(6 * math.sin(i * math.pi / 6))
        h2 = 70 + int(8 * math.sin((i + 2) * math.pi / 6))
        h3 = 105 + int(10 * math.sin((i + 4) * math.pi / 6))
        d.rounded_rectangle([50, 165 - h1, 75, 165], radius=4, fill=SLATE)
        d.rounded_rectangle([85, 165 - h2, 110, 165], radius=4, fill=AMBER)
        d.rounded_rectangle([120, 165 - h3, 145, 165], radius=4, fill=CORAL)
        # Trend line
        d.line([62, 165 - h1, 97, 165 - h2], fill=GOLD, width=3)
        d.line([97, 165 - h2, 132, 165 - h3], fill=GOLD, width=3)
        # Pulsing target dot
        pr = 6 + int(3 * math.sin(i * math.pi / 3))
        d.ellipse([132 - pr, 165 - h3 - pr, 132 + pr, 165 - h3 + pr], fill=RED, outline=WHITE, width=2)
        frames.append(im)
    save_clean_gif(frames, "chart_up.gif")

def make_currency():
    # 5. currency.gif - Currency exchange spinning coin
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        # Width modulates as coin spins
        scale = abs(math.cos(i * math.pi / 6))
        w = max(10, int(60 * scale))
        cx = 100
        # Coin outer
        d.ellipse([cx - w, 40, cx + w, 160], fill=GOLD, outline=AMBER, width=4)
        if w > 20:
            d.ellipse([cx - w + 6, 46, cx + w - 6, 154], fill=AMBER, outline=GOLD, width=2)
            # Euro/Dollar crossbars
            d.line([cx - w // 2, 90, cx + w // 2, 90], fill=WHITE, width=3)
            d.line([cx - w // 2, 110, cx + w // 2, 110], fill=WHITE, width=3)
        frames.append(im)
    save_clean_gif(frames, "currency.gif")

def make_handshake():
    # 6. handshake.gif - Business partnership handshake
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        pulse = 4 * math.sin(i * math.pi / 6)
        # Outer circular halo
        d.ellipse([30, 30, 170, 170], outline=CORAL, width=2)
        # Hand Left
        d.rounded_rectangle([35, 90 + pulse, 90, 120 + pulse], radius=8, fill=SLATE)
        d.polygon([(90, 90 + pulse), (115, 105 + pulse), (105, 125 + pulse), (85, 120 + pulse)], fill=WARM_GRAY)
        # Hand Right
        d.rounded_rectangle([110, 90 - pulse, 165, 120 - pulse], radius=8, fill=AMBER)
        d.polygon([(110, 90 - pulse), (85, 105 - pulse), (95, 125 - pulse), (115, 120 - pulse)], fill=WARM_GRAY)
        # Clasp clasp
        d.ellipse([92, 98, 108, 114], fill=GOLD)
        frames.append(im)
    save_clean_gif(frames, "handshake.gif")

def make_po_doc():
    # 7. po_doc.gif - Purchase order document with sliding stamp
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        # Document sheet
        d.rounded_rectangle([45, 30, 155, 170], radius=8, fill=WHITE, outline=SLATE, width=3)
        # Folded corner
        d.polygon([(135, 30), (155, 50), (135, 50)], fill=WARM_GRAY)
        # Header bar
        d.rectangle([55, 45, 125, 55], fill=CORAL)
        # Text lines
        for j in range(4):
            y = 70 + j * 16
            d.line([55, y, 140, y], fill=WARM_GRAY, width=2)
        # PO badge
        bx = 60 + int(8 * math.sin(i * math.pi / 6))
        d.rounded_rectangle([bx, 135, bx + 70, 155], radius=4, fill=SAGE)
        d.rectangle([bx + 8, 142, bx + 62, 148], fill=WHITE)
        frames.append(im)
    save_clean_gif(frames, "po_doc.gif")

def make_truck():
    # 8. truck.gif - Delivery logistics truck moving across road
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        # Road
        d.line([25, 160, 175, 160], fill=SLATE, width=4)
        x_shift = int(8 * math.sin(i * math.pi / 6))
        # Cargo container
        d.rounded_rectangle([40 + x_shift, 70, 125 + x_shift, 140], radius=6, fill=SLATE, outline=GOLD, width=2)
        d.rectangle([50 + x_shift, 85, 115 + x_shift, 125], fill=AMBER)
        # Cabin
        d.polygon([(125 + x_shift, 90), (155 + x_shift, 105), (155 + x_shift, 140), (125 + x_shift, 140)], fill=CORAL)
        # Window
        d.polygon([(130 + x_shift, 95), (145 + x_shift, 105), (130 + x_shift, 105)], fill=WHITE)
        # Wheels rotating
        rot = (i * 30) % 360
        for wx in [65 + x_shift, 135 + x_shift]:
            d.ellipse([wx - 14, 136, wx + 14, 164], fill=DARK_SLATE, outline=WARM_GRAY, width=2)
            d.ellipse([wx - 5, 145, wx + 5, 155], fill=WHITE)
        frames.append(im)
    save_clean_gif(frames, "truck.gif")

def make_scan_doc():
    # 9. scan_doc.gif - Invoice document with vertical scanning laser beam
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        # Sheet
        d.rounded_rectangle([45, 35, 155, 165], radius=8, fill=WHITE, outline=SLATE, width=3)
        for j in range(5):
            y = 55 + j * 18
            d.line([58, y, 142, y], fill=WARM_GRAY, width=2)
        # Scanning laser line
        scan_y = 50 + int(100 * (i / 12.0))
        d.line([35, scan_y, 165, scan_y], fill=RED, width=3)
        d.ellipse([92, scan_y - 8, 108, scan_y + 8], fill=CORAL)
        frames.append(im)
    save_clean_gif(frames, "scan_doc.gif")

def make_payment():
    # 10. payment.gif - Credit card contactless payment emitting waves
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        # Card
        d.rounded_rectangle([40, 65, 160, 145], radius=10, fill=SLATE, outline=GOLD, width=2)
        # Magnetic strip
        d.rectangle([40, 85, 160, 100], fill=DARK_SLATE)
        # Chip
        d.rounded_rectangle([55, 110, 80, 130], radius=3, fill=GOLD)
        # Radiating signal arcs
        wave_r = 15 + (i % 4) * 8
        d.arc([130 - wave_r, 90 - wave_r, 130 + wave_r, 90 + wave_r], start=-60, end=60, fill=CORAL, width=3)
        frames.append(im)
    save_clean_gif(frames, "payment.gif")

def make_server():
    # 11. server.gif - IT datacenter rack with blinking LEDs
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        # Server chassis
        d.rounded_rectangle([45, 35, 155, 165], radius=8, fill=DARK_SLATE, outline=SLATE, width=3)
        for slot in range(3):
            sy = 45 + slot * 38
            d.rounded_rectangle([52, sy, 148, sy + 30], radius=4, fill=SLATE, outline=WARM_GRAY, width=1)
            # Drive vents
            for v in range(4):
                d.line([60 + v * 12, sy + 10, 60 + v * 12, sy + 20], fill=WARM_GRAY, width=2)
            # LEDs
            led1 = SAGE if (i + slot) % 3 == 0 else RED
            led2 = GOLD if (i + slot * 2) % 4 == 0 else SAGE
            d.ellipse([125, sy + 11, 133, sy + 19], fill=led1)
            d.ellipse([136, sy + 11, 144, sy + 19], fill=led2)
        frames.append(im)
    save_clean_gif(frames, "server.gif")

def make_ticket():
    # 12. ticket.gif - ITIL support ticket with priority star and check
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        pulse = 4 * math.sin(i * math.pi / 6)
        # Ticket body
        d.rounded_rectangle([40, 50 + pulse, 160, 150 + pulse], radius=8, fill=WHITE, outline=SLATE, width=3)
        # Notches on sides
        d.ellipse([30, 90 + pulse, 50, 110 + pulse], fill=(0, 0, 0, 0))
        d.ellipse([150, 90 + pulse, 170, 110 + pulse], fill=(0, 0, 0, 0))
        # Dashed perforated divider
        for dy in range(int(58 + pulse), int(145 + pulse), 10):
            d.line([100, dy, 100, dy + 5], fill=WARM_GRAY, width=2)
        # Left side: Ticket ID & barcode
        d.rectangle([55, 65 + pulse, 88, 75 + pulse], fill=CORAL)
        for b in range(5):
            d.line([55 + b * 7, 85 + pulse, 55 + b * 7, 125 + pulse], fill=SLATE, width=2)
        # Right side: Priority badge
        d.rounded_rectangle([112, 70 + pulse, 148, 95 + pulse], radius=4, fill=AMBER)
        d.ellipse([120, 105 + pulse, 140, 125 + pulse], fill=SAGE)
        frames.append(im)
    save_clean_gif(frames, "ticket.gif")

def make_monitor():
    # 13. monitor.gif - System health monitor with heartbeat ECG wave
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        # Screen frame
        d.rounded_rectangle([35, 40, 165, 135], radius=10, fill=DARK_SLATE, outline=SLATE, width=3)
        # Stand
        d.polygon([(90, 135), (110, 135), (115, 155), (85, 155)], fill=SLATE)
        d.rounded_rectangle([70, 155, 130, 165], radius=3, fill=SLATE)
        # ECG waveform shifting
        phase = (i / 12.0) * 40
        pts = [
            (45, 88), (65, 88), (80, 88),
            (90, 60), (98, 115), (106, 75),
            (114, 88), (135, 88), (155, 88)
        ]
        # Shift points slightly
        shifted = [(max(45, min(155, p[0] - phase + (40 if p[0] - phase < 45 else 0))), p[1]) for p in pts]
        for p_idx in range(len(pts) - 1):
            d.line([pts[p_idx][0], pts[p_idx][1], pts[p_idx+1][0], pts[p_idx+1][1]], fill=SAGE, width=3)
        # Glowing dot on pulse peak
        d.ellipse([95, 68, 105, 78], fill=CORAL)
        frames.append(im)
    save_clean_gif(frames, "monitor.gif")

def make_shield():
    # 14. shield.gif - Security shield with rotating lock
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        # Outer shield boundary
        d.polygon([(100, 30), (160, 50), (150, 120), (100, 165), (50, 120), (40, 50)], fill=SLATE, outline=GOLD, width=3)
        # Inner shield
        d.polygon([(100, 42), (148, 58), (140, 114), (100, 150), (60, 114), (52, 58)], fill=AMBER)
        # Padlock in center
        d.arc([88, 70, 112, 98], start=180, end=0, fill=WHITE, width=4)
        d.rounded_rectangle([82, 90, 118, 120], radius=4, fill=WHITE)
        d.ellipse([96, 98, 104, 106], fill=DARK_SLATE)
        d.line([100, 105, 100, 113], fill=DARK_SLATE, width=2)
        frames.append(im)
    save_clean_gif(frames, "shield.gif")

def make_warning():
    # 15. warning.gif - Hazard warning triangle pulsing exclamation
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        # Triangle
        d.polygon([(100, 35), (170, 155), (30, 155)], fill=GOLD, outline=AMBER, width=4)
        # Inner border
        d.polygon([(100, 50), (155, 145), (45, 145)], fill=DARK_SLATE)
        # Exclamation mark pulsing
        ex_color = RED if (i % 4 < 2) else CORAL
        d.rounded_rectangle([94, 75, 106, 115], radius=4, fill=ex_color)
        d.ellipse([94, 124, 106, 136], fill=ex_color)
        frames.append(im)
    save_clean_gif(frames, "warning.gif")

def make_checkmark():
    # 16. checkmark.gif - Audit compliance circular checkmark
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        # Ring
        d.ellipse([35, 35, 165, 165], outline=SAGE, width=6)
        # Inner circle
        pulse = 4 * math.sin(i * math.pi / 6)
        d.ellipse([45 - pulse, 45 - pulse, 155 + pulse, 155 + pulse], fill=SAGE)
        # Bold check
        d.line([75, 100, 95, 122], fill=WHITE, width=8)
        d.line([95, 122, 135, 78], fill=WHITE, width=8)
        frames.append(im)
    save_clean_gif(frames, "checkmark.gif")

def make_radar():
    # 17. radar.gif - Risk radar sweeping beam revealing targets
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        cx, cy = 100, 100
        # Radar circles
        d.ellipse([35, 35, 165, 165], fill=DARK_SLATE, outline=CORAL, width=2)
        d.ellipse([60, 60, 140, 140], outline=SLATE, width=1)
        d.ellipse([80, 80, 120, 120], outline=SLATE, width=1)
        # Crosshairs
        d.line([35, cy, 165, cy], fill=SLATE, width=1)
        d.line([cx, 35, cx, 165], fill=SLATE, width=1)
        # Sweeping hand
        ang = (i / 12.0) * 2 * math.pi
        x2 = cx + 60 * math.cos(ang)
        y2 = cy + 60 * math.sin(ang)
        d.line([cx, cy, x2, y2], fill=CORAL, width=3)
        # Target blip
        d.ellipse([125, 75, 135, 85], fill=RED if i in [2, 3, 4] else GOLD)
        frames.append(im)
    save_clean_gif(frames, "radar.gif")

def make_user():
    # 18. user.gif - Customer avatar profile with pulsing presence
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        # Outer ring
        d.ellipse([35, 35, 165, 165], fill=SLATE, outline=WARM_GRAY, width=2)
        # Head
        d.ellipse([75, 55, 125, 105], fill=WHITE)
        # Body
        d.ellipse([50, 115, 150, 185], fill=CORAL)
        # Online badge pulsing
        br = 7 + int(2 * math.sin(i * math.pi / 3))
        d.ellipse([135 - br, 65 - br, 135 + br, 65 + br], fill=SAGE, outline=WHITE, width=2)
        frames.append(im)
    save_clean_gif(frames, "user.gif")

def make_cart():
    # 19. cart.gif - Procurement shopping cart rolling with bouncing item
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        pulse = 4 * math.sin(i * math.pi / 6)
        # Handle & basket
        d.line([40, 60, 60, 60], fill=SLATE, width=4)
        d.line([60, 60, 75, 130], fill=SLATE, width=4)
        d.line([75, 130, 150, 130], fill=SLATE, width=4)
        d.line([150, 130, 165, 75], fill=SLATE, width=4)
        d.line([70, 75, 165, 75], fill=SLATE, width=4)
        # Grid lines in cart
        d.line([95, 75, 95, 130], fill=WARM_GRAY, width=2)
        d.line([120, 75, 120, 130], fill=WARM_GRAY, width=2)
        d.line([72, 102, 158, 102], fill=WARM_GRAY, width=2)
        # Bouncing package in cart
        d.rounded_rectangle([85, 50 - pulse, 135, 80 - pulse], radius=4, fill=CORAL, outline=GOLD, width=2)
        # Wheels
        d.ellipse([70, 140, 90, 160], fill=DARK_SLATE, outline=SLATE, width=2)
        d.ellipse([130, 140, 150, 160], fill=DARK_SLATE, outline=SLATE, width=2)
        frames.append(im)
    save_clean_gif(frames, "cart.gif")

def make_chat():
    # 20. chat.gif - Customer support speech bubble with typing indicator
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        # Bubble
        d.rounded_rectangle([35, 45, 165, 135], radius=16, fill=SLATE, outline=GOLD, width=3)
        # Tail
        d.polygon([(60, 135), (50, 165), (85, 135)], fill=SLATE)
        # 3 typing dots
        for dot in range(3):
            dy = int(6 * math.sin((i * 2 + dot * 2) * math.pi / 6))
            cx = 75 + dot * 25
            d.ellipse([cx - 7, 90 - dy, cx + 7, 104 - dy], fill=CORAL)
        frames.append(im)
    save_clean_gif(frames, "chat.gif")

def make_heart():
    # 21. heart.gif - Customer satisfaction heartbeat with sparkle
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        pulse = 5 * math.sin(i * math.pi / 6)
        # Heart shape
        d.ellipse([65 - pulse, 65 - pulse, 105 + pulse, 105 + pulse], fill=CORAL)
        d.ellipse([95 - pulse, 65 - pulse, 135 + pulse, 105 + pulse], fill=CORAL)
        d.polygon([(62 - pulse, 92), (138 + pulse, 92), (100, 145 + pulse)], fill=CORAL)
        # Sparkle
        sp = 4 + int(3 * math.sin(i * math.pi / 3))
        d.line([145 - sp, 55, 145 + sp, 55], fill=GOLD, width=2)
        d.line([145, 55 - sp, 145, 55 + sp], fill=GOLD, width=2)
        frames.append(im)
    save_clean_gif(frames, "heart.gif")

def make_gear():
    # 22. gear.gif - Dual rotating automation gears
    frames = []
    for i in range(12):
        im = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        ang = (i / 12.0) * 2 * math.pi
        # Main gear
        cx, cy, r = 85, 85, 42
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=SLATE, outline=GOLD, width=3)
        for t in range(8):
            ta = ang + t * (math.pi / 4)
            tx = cx + (r + 8) * math.cos(ta)
            ty = cy + (r + 8) * math.sin(ta)
            d.ellipse([tx - 5, ty - 5, tx + 5, ty + 5], fill=GOLD)
        d.ellipse([cx - 15, cy - 15, cx + 15, cy + 15], fill=DARK_SLATE)

        # Secondary small gear intermeshed
        cx2, cy2, r2 = 135, 135, 26
        ang2 = -ang * 1.5
        d.ellipse([cx2 - r2, cy2 - r2, cx2 + r2, cy2 + r2], fill=AMBER, outline=CORAL, width=2)
        for t2 in range(6):
            ta2 = ang2 + t2 * (math.pi / 3)
            tx2 = cx2 + (r2 + 6) * math.cos(ta2)
            ty2 = cy2 + (r2 + 6) * math.sin(ta2)
            d.ellipse([tx2 - 4, ty2 - 4, tx2 + 4, ty2 + 4], fill=CORAL)
        d.ellipse([cx2 - 9, cy2 - 9, cx2 + 9, cy2 + 9], fill=DARK_SLATE)

        frames.append(im)
    save_clean_gif(frames, "gear.gif")

if __name__ == "__main__":
    print("Generating 22 custom transparent animated emotes...")
    make_calc()
    make_ledger()
    make_stamp()
    make_chart_up()
    make_currency()
    make_handshake()
    make_po_doc()
    make_truck()
    make_scan_doc()
    make_payment()
    make_server()
    make_ticket()
    make_monitor()
    make_shield()
    make_warning()
    make_checkmark()
    make_radar()
    make_user()
    make_cart()
    make_chat()
    make_heart()
    make_gear()
    print("All 22 emotes generated successfully in", OUTPUT_DIR)
