"""Draw the Mix Lab app icon: three faders and a meter, no text."""

from PIL import Image, ImageDraw

SIZE = 1024
BG = (18, 20, 28, 255)
PINK = (255, 77, 141, 255)
VIOLET = (124, 108, 255, 255)
MINT = (61, 220, 151, 255)
TRACK = (44, 51, 68, 255)
WHITE = (247, 248, 252, 255)


def rounded(draw, box, radius, fill):
    draw.rounded_rectangle(box, radius=radius, fill=fill)


def fader(draw, x, top, bottom, level, color, scale=1):
    width = int(28 * scale)
    track_top = top
    track_bottom = bottom
    rounded(draw, (x - width // 2, track_top, x + width // 2, track_bottom), width // 2, TRACK)
    span = track_bottom - track_top
    y = track_bottom - int(span * level)
    rounded(draw, (x - width // 2, y, x + width // 2, track_bottom), width // 2, color)
    thumb_w = int(78 * scale)
    thumb_h = int(36 * scale)
    rounded(
        draw,
        (x - thumb_w // 2, y - thumb_h // 2, x + thumb_w // 2, y + thumb_h // 2),
        int(12 * scale),
        WHITE,
    )
    inset = int(8 * scale)
    rounded(
        draw,
        (x - thumb_w // 2 + inset, y - thumb_h // 2 + inset, x + thumb_w // 2 - inset, y + thumb_h // 2 - inset),
        int(8 * scale),
        color,
    )


def meter(draw, x, y, w, h, lit, scale=1):
    gap = int(8 * scale)
    count = 8
    seg_h = (h - gap * (count - 1)) / count
    for i in range(count):
        top = y + (count - 1 - i) * (seg_h + gap)
        color = MINT if i < 5 else (255, 193, 77, 255) if i < 7 else (255, 92, 122, 255)
        if i >= lit:
            color = TRACK
        rounded(draw, (x, top, x + w, top + seg_h), int(6 * scale), color)


def draw_mark(canvas, scale, ox, oy):
    draw = ImageDraw.Draw(canvas)
    fader(draw, ox + int(150 * scale), oy + int(80 * scale), oy + int(560 * scale), 0.42, PINK, scale)
    fader(draw, ox + int(310 * scale), oy + int(80 * scale), oy + int(560 * scale), 0.72, VIOLET, scale)
    fader(draw, ox + int(470 * scale), oy + int(80 * scale), oy + int(560 * scale), 0.3, MINT, scale)
    meter(draw, ox + int(560 * scale), oy + int(80 * scale), int(36 * scale), int(480 * scale), 7, scale)


def full_icon():
    image = Image.new("RGBA", (SIZE, SIZE), BG)
    # Center a 720-wide mark in 1024.
    draw_mark(image, 1.15, 150, 180)
    return image


def foreground():
    image = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw_mark(image, 0.92, 210, 230)
    return image


def background():
    return Image.new("RGBA", (SIZE, SIZE), BG)


def monochrome():
    image = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    # Reuse positions but paint white by drawing the mark then recoloring opaque pixels.
    mark = foreground()
    pixels = mark.load()
    out = image.load()
    for y in range(SIZE):
        for x in range(SIZE):
            if pixels[x, y][3] > 20:
                out[x, y] = (255, 255, 255, 255)
    return image


def main():
    root = "/agent/repos/tmp-87d8f2d3f1e18b41/assets/images"
    icon = full_icon()
    icon.save(f"{root}/icon.png")
    foreground().save(f"{root}/android-icon-foreground.png")
    foreground().save(f"{root}/splash-icon.png")
    background().save(f"{root}/android-icon-background.png")
    monochrome().save(f"{root}/android-icon-monochrome.png")
    icon.resize((196, 196), Image.Resampling.LANCZOS).save(f"{root}/favicon.png")
    print("icons written")


if __name__ == "__main__":
    main()
