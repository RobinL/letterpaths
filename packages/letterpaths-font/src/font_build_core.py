from __future__ import annotations

from pathlib import Path

import skia
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from pathops import FillType, Path as SkiaOpsPath
from ufo2ft import compileOTF, compileTTF
from ufoLib2.objects import Font as UFOFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
GEO_DIR = ROOT / "build" / "geometry"
OUT_DIR = ROOT / "fonts"
UFO_DIR = ROOT / "build" / "ufo"

UPM = 1000
TARGET_XHEIGHT = 500
PEN_WIDTH = 46
CTX_OVERLAP = 0
SPACE_ADVANCE_FACTOR = 0.55


def conic_to_cubics(p0, p1, p2, weight):
    pts = skia.Path.ConvertConicToQuads(
        skia.Point(*p0), skia.Point(*p1), skia.Point(*p2), weight, 1
    )
    cubics = []
    cur = (pts[0].x(), pts[0].y())
    i = 1
    while i + 1 < len(pts):
        c = (pts[i].x(), pts[i].y())
        e = (pts[i + 1].x(), pts[i + 1].y())
        cubics.append(quad_to_cubic(cur, c, e))
        cur = e
        i += 2
    return cubics


def quad_to_cubic(p0, c, p2):
    c1 = (p0[0] + 2.0 / 3.0 * (c[0] - p0[0]), p0[1] + 2.0 / 3.0 * (c[1] - p0[1]))
    c2 = (p2[0] + 2.0 / 3.0 * (c[0] - p2[0]), p2[1] + 2.0 / 3.0 * (c[1] - p2[1]))
    return (c1, c2, p2)


def stroke_to_ops_path(contours, scale, pen_width):
    src = skia.Path()
    for contour in contours:
        if not contour:
            continue
        first = contour[0]
        src.moveTo(first[0] * scale, first[1] * scale)
        for seg in contour:
            _x0, _y0, x1, y1, x2, y2, x3, y3 = seg
            src.cubicTo(
                x1 * scale, y1 * scale, x2 * scale, y2 * scale, x3 * scale, y3 * scale
            )

    paint = skia.Paint(
        Style=skia.Paint.kStroke_Style,
        StrokeWidth=pen_width,
        StrokeCap=skia.Paint.kRound_Cap,
        StrokeJoin=skia.Paint.kRound_Join,
        AntiAlias=True,
    )
    dst = skia.Path()
    paint.getFillPath(src, dst)

    # Resolve stroke overlaps while Skia still has its native conic curves.
    # Approximating those curves first can change nearly coincident crossings
    # at retraced strokes: PathOps then fills the bowl of joined g forms and
    # drops their descender. Preserve Simplify's fill rule when transferring
    # the result, or enclosed counters in letters such as b and O fill in.
    dst = skia.Simplify(dst)
    ops = SkiaOpsPath()
    ops.fillType = FillType(int(dst.getFillType()))
    pen = ops.getPen()
    it = skia.Path.Iter(dst, False)
    open_contour = False
    while True:
        verb, pts = it.next()
        if verb == skia.Path.kDone_Verb:
            break
        if verb == skia.Path.kMove_Verb:
            if open_contour:
                pen.closePath()
            pen.moveTo((pts[0].x(), pts[0].y()))
            open_contour = True
        elif verb == skia.Path.kLine_Verb:
            pen.lineTo((pts[1].x(), pts[1].y()))
        elif verb == skia.Path.kQuad_Verb:
            c1, c2, e = quad_to_cubic(
                (pts[0].x(), pts[0].y()),
                (pts[1].x(), pts[1].y()),
                (pts[2].x(), pts[2].y()),
            )
            pen.curveTo(c1, c2, e)
        elif verb == skia.Path.kConic_Verb:
            for c1, c2, e in conic_to_cubics(
                (pts[0].x(), pts[0].y()),
                (pts[1].x(), pts[1].y()),
                (pts[2].x(), pts[2].y()),
                it.conicWeight(),
            ):
                pen.curveTo(c1, c2, e)
        elif verb == skia.Path.kCubic_Verb:
            pen.curveTo(
                (pts[1].x(), pts[1].y()),
                (pts[2].x(), pts[2].y()),
                (pts[3].x(), pts[3].y()),
            )
        elif verb == skia.Path.kClose_Verb:
            pen.closePath()
            open_contour = False
    if open_contour:
        pen.closePath()

    ops.simplify()
    return ops


def measure_scale(geo):
    tops = []
    for g in geo["glyphs"]:
        if len(g["name"]) == 1 and g["name"].islower():
            top = -1e9
            for c in g["contours"]:
                for s in c:
                    for j in (1, 3, 5, 7):
                        top = max(top, s[j])
            if top > -1e9:
                tops.append(top)
    tops.sort()
    median = tops[len(tops) // 3] if tops else TARGET_XHEIGHT
    return TARGET_XHEIGHT / median


def add_punctuation(font, letter_advance):
    def circle(cx, cy, r):
        k = 0.5523 * r
        return [
            ("move", (cx + r, cy)),
            ("curve", ((cx + r, cy + k), (cx + k, cy + r), (cx, cy + r))),
            ("curve", ((cx - k, cy + r), (cx - r, cy + k), (cx - r, cy))),
            ("curve", ((cx - r, cy - k), (cx - k, cy - r), (cx, cy - r))),
            ("curve", ((cx + k, cy - r), (cx + r, cy - k), (cx + r, cy))),
        ]

    def emit(glyph, shapes):
        pen = glyph.getPen()
        for shape in shapes:
            for kind, data in shape:
                if kind == "move":
                    pen.moveTo(data)
                elif kind == "line":
                    pen.lineTo(data)
                elif kind == "curve":
                    pen.curveTo(*data)
            pen.closePath()

    r = PEN_WIDTH * 0.62
    dot_adv = int(letter_advance * 0.5)

    g = font.newGlyph("space")
    g.unicode = 0x20
    g.width = int(letter_advance * SPACE_ADVANCE_FACTOR)

    g = font.newGlyph("period")
    g.unicode = 0x2E
    g.width = dot_adv
    emit(g, [circle(dot_adv / 2, r, r)])

    g = font.newGlyph("comma")
    g.unicode = 0x2C
    g.width = dot_adv
    cx = dot_adv / 2
    emit(
        g,
        [
            [
                ("move", (cx - r, r)),
                ("curve", ((cx - r, r * 2), (cx + r, r * 2), (cx + r, r))),
                ("curve", ((cx + r, -r * 1.5), (cx, -r * 2.2), (cx - r * 0.4, -r * 2.6))),
                ("curve", ((cx - r * 0.2, -r * 1.6), (cx - r * 0.3, -r * 0.4), (cx - r, r))),
            ]
        ],
    )

    g = font.newGlyph("quotesingle")
    g.unicode = 0x27
    g.width = dot_adv
    yt = TARGET_XHEIGHT
    emit(
        g,
        [
            [
                ("move", (cx - r, yt)),
                ("curve", ((cx - r, yt + r), (cx + r, yt + r), (cx + r, yt))),
                ("curve", ((cx + r, yt - r * 2.5), (cx, yt - r * 3.2), (cx - r * 0.4, yt - r * 3.6))),
                ("curve", ((cx - r * 0.2, yt - r * 2.6), (cx - r * 0.3, yt - r * 1.4), (cx - r, yt))),
            ]
        ],
    )

    g = font.newGlyph("hyphen")
    g.unicode = 0x2D
    g.width = int(letter_advance * 0.6)
    y = TARGET_XHEIGHT * 0.42
    hw = PEN_WIDTH * 0.5
    x0, x1 = int(g.width * 0.2), int(g.width * 0.8)
    emit(g, [[("move", (x0, y - hw)), ("line", (x1, y - hw)), ("line", (x1, y + hw)), ("line", (x0, y + hw))]])

    g = font.newGlyph("exclam")
    g.unicode = 0x21
    g.width = dot_adv
    topy = TARGET_XHEIGHT * 1.35
    emit(
        g,
        [
            [
                ("move", (cx - r * 0.8, r * 2.2)),
                ("line", (cx + r * 0.8, r * 2.2)),
                ("line", (cx + r * 0.55, topy)),
                ("line", (cx - r * 0.55, topy)),
            ],
            circle(cx, r, r),
        ],
    )

    g = font.newGlyph("question")
    g.unicode = 0x3F
    g.width = int(letter_advance * 0.62)
    cx = g.width / 2
    hook = [
        ("move", (cx - r * 1.6, topy * 0.78)),
        ("curve", ((cx - r * 1.6, topy + r), (cx + r * 2.0, topy + r), (cx + r * 1.9, topy * 0.74))),
        ("curve", ((cx + r * 1.6, topy * 0.5), (cx - r * 0.2, topy * 0.42), (cx - r * 0.2, topy * 0.2))),
        ("line", (cx - r * 0.2, topy * 0.2)),
        ("line", (cx - r * 1.4, topy * 0.2)),
        ("curve", ((cx - r * 1.4, topy * 0.5), (cx + r * 0.9, topy * 0.52), (cx + r * 0.7, topy * 0.72))),
        ("curve", ((cx + r * 0.7, topy * 0.86), (cx - r * 0.2, topy * 0.86), (cx - r * 0.2, topy * 0.78))),
    ]
    emit(g, [hook, circle(cx - r * 0.8, r, r)])

    def copy_shapes(name, codepoint, width, sources):
        glyph = font.newGlyph(name)
        glyph.unicode = codepoint
        glyph.width = round(width)
        for source, transform in sources:
            font[source].draw(TransformPen(glyph.getPen(), transform))
        return glyph

    identity = (1, 0, 0, 1, 0, 0)
    copy_shapes("nbspace", 0xA0, font["space"].width, [])
    copy_shapes("quoteright", 0x2019, dot_adv, [("quotesingle", identity)])
    copy_shapes(
        "quoteleft", 0x2018, dot_adv,
        [("quotesingle", (-1, 0, 0, -1, dot_adv, 2 * yt - 2.6 * r))],
    )
    quote_gap = round(dot_adv * 0.7)
    for name, codepoint, source in (
        ("quotedbl", 0x22, "quotesingle"),
        ("quotedblleft", 0x201C, "quoteleft"),
        ("quotedblright", 0x201D, "quoteright"),
    ):
        copy_shapes(name, codepoint, dot_adv + quote_gap, [
            (source, identity), (source, (1, 0, 0, 1, quote_gap, 0)),
        ])

    g = copy_shapes("colon", 0x3A, dot_adv, [("period", identity)])
    emit(g, [circle(dot_adv / 2, TARGET_XHEIGHT * 0.65, r)])
    g = copy_shapes("semicolon", 0x3B, dot_adv, [("comma", identity)])
    emit(g, [circle(dot_adv / 2, TARGET_XHEIGHT * 0.65, r)])
    copy_shapes("ellipsis", 0x2026, 3 * dot_adv, [
        ("period", (1, 0, 0, 1, i * dot_adv, 0)) for i in range(3)
    ])


def add_symbols(font, letter_advance):
    """Add supported symbols; leave unsupported characters out of the cmap.

    A fake box mapped to a digit or symbol prevents applications from selecting
    a readable fallback font. The exported alphabet already supplies real Latin
    coverage; there is no need to claim characters we have not drawn.
    """

    def new_or_existing(name, unicode_value, width=None):
        if name in font:
            glyph = font[name]
            created = False
        else:
            glyph = font.newGlyph(name)
            created = True
        glyph.unicode = unicode_value
        if created:
            glyph.width = int(width if width is not None else letter_advance * 0.72)
        return glyph, created

    def rectangle(glyph, x0, y0, x1, y1):
        pen = glyph.getPen()
        pen.moveTo((x0, y0))
        pen.lineTo((x1, y0))
        pen.lineTo((x1, y1))
        pen.lineTo((x0, y1))
        pen.closePath()

    def vertical(glyph, x, y0, y1, width):
        rectangle(glyph, x - width / 2, y0, x + width / 2, y1)

    def horizontal(glyph, x0, x1, y, width):
        rectangle(glyph, x0, y - width / 2, x1, y + width / 2)

    def polyline(glyph, points):
        segments = [(*a, *a, *b, *b) for a, b in zip(points, points[1:])]
        stroke_to_ops_path([segments], 1, PEN_WIDTH).draw(glyph.getPen())

    common = {
        "endash": (0x2013, "dash"),
        "emdash": (0x2014, "dashwide"),
        "parenleft": (0x28, "parenleft"),
        "parenright": (0x29, "parenright"),
        "bracketleft": (0x5B, "bracketleft"),
        "bracketright": (0x5D, "bracketright"),
        "slash": (0x2F, "slash"),
        "backslash": (0x5C, "backslash"),
        "numbersign": (0x23, "hash"),
        "asterisk": (0x2A, "asterisk"),
        "plus": (0x2B, "plus"),
        "equal": (0x3D, "equal"),
        "less": (0x3C, "less"),
        "greater": (0x3E, "greater"),
    }

    for name, (codepoint, kind) in common.items():
        width = letter_advance if kind in ("dashwide",) else letter_advance * 0.6
        g, created = new_or_existing(name, codepoint, width)
        if not created:
            continue
        w = g.width
        stroke = max(18, PEN_WIDTH * 0.4)
        if kind == "dash":
            horizontal(g, w * 0.14, w * 0.86, TARGET_XHEIGHT * 0.42, stroke)
        elif kind == "dashwide":
            horizontal(g, w * 0.08, w * 0.92, TARGET_XHEIGHT * 0.42, stroke)
        elif kind == "slash":
            pen = g.getPen()
            pen.moveTo((w * 0.25, -TARGET_XHEIGHT * 0.08))
            pen.lineTo((w * 0.42, -TARGET_XHEIGHT * 0.08))
            pen.lineTo((w * 0.78, TARGET_XHEIGHT * 1.25))
            pen.lineTo((w * 0.61, TARGET_XHEIGHT * 1.25))
            pen.closePath()
        elif kind == "backslash":
            pen = g.getPen()
            pen.moveTo((w * 0.22, TARGET_XHEIGHT * 1.25))
            pen.lineTo((w * 0.39, TARGET_XHEIGHT * 1.25))
            pen.lineTo((w * 0.75, -TARGET_XHEIGHT * 0.08))
            pen.lineTo((w * 0.58, -TARGET_XHEIGHT * 0.08))
            pen.closePath()
        elif kind == "hash":
            vertical(g, w * 0.4, 0, TARGET_XHEIGHT, stroke)
            vertical(g, w * 0.62, 0, TARGET_XHEIGHT, stroke)
            horizontal(g, w * 0.18, w * 0.84, TARGET_XHEIGHT * 0.35, stroke)
            horizontal(g, w * 0.16, w * 0.82, TARGET_XHEIGHT * 0.68, stroke)
        elif kind == "asterisk":
            for dx, dy in ((w * 0.3, 0), (w * 0.15, 130), (w * 0.15, -130)):
                polyline(g, [(w / 2 - dx, 350 - dy), (w / 2 + dx, 350 + dy)])
        elif kind == "plus":
            vertical(g, w * 0.5, TARGET_XHEIGHT * 0.18, TARGET_XHEIGHT * 0.82, stroke)
            horizontal(g, w * 0.18, w * 0.82, TARGET_XHEIGHT * 0.5, stroke)
        elif kind == "equal":
            horizontal(g, w * 0.18, w * 0.82, TARGET_XHEIGHT * 0.38, stroke)
            horizontal(g, w * 0.18, w * 0.82, TARGET_XHEIGHT * 0.62, stroke)
        elif kind in ("less", "greater"):
            x0, x1 = (0.75, 0.25) if kind == "less" else (0.25, 0.75)
            polyline(g, [(w * x0, 400), (w * x1, 250), (w * x0, 100)])
        elif kind in ("bracketleft", "bracketright"):
            x0, x1 = (0.7, 0.3) if kind == "bracketleft" else (0.3, 0.7)
            polyline(g, [(w * x0, 650), (w * x1, 650), (w * x1, -100), (w * x0, -100)])
        elif kind in ("parenleft", "parenright"):
            edge, middle = (w * 0.7, 0) if kind == "parenleft" else (w * 0.3, w)
            contour = [(edge, 650, middle, 500, middle, 50, edge, -100)]
            stroke_to_ops_path([contour], 1, PEN_WIDTH).draw(g.getPen())


def new_font(family, style):
    font = UFOFont()
    info = font.info
    info.familyName = family
    info.styleName = style
    info.styleMapFamilyName = family
    info.styleMapStyleName = "regular"
    info.openTypeNamePreferredFamilyName = family
    info.openTypeNamePreferredSubfamilyName = style
    info.postscriptFontName = f"{family.replace(' ', '')}-{style}"
    info.unitsPerEm = UPM
    info.ascender = int(TARGET_XHEIGHT * 1.55)
    info.descender = -int(TARGET_XHEIGHT * 0.6)
    info.xHeight = TARGET_XHEIGHT
    info.capHeight = int(TARGET_XHEIGHT * 1.4)
    info.versionMajor = 0
    info.versionMinor = 2
    info.openTypeOS2UnicodeRanges = [0]
    info.openTypeOS2CodePageRanges = [0]
    return font


def build_glyphs(font, geo, scale, overlap=0):
    advances = []
    for g in geo["glyphs"]:
        glyph = font.newGlyph(g["name"])
        adv = g["advance"] * scale
        if overlap and g["contours"]:
            adv = max(adv * 0.4, adv - overlap)
        glyph.width = round(adv)
        advances.append(glyph.width)
        for uni in g["unicodes"]:
            glyph.unicode = uni
        if g["contours"]:
            ops = stroke_to_ops_path(g["contours"], scale, PEN_WIDTH)
            ops.draw(glyph.getPen())
    return sorted(advances)[len(advances) // 2] if advances else 300


def set_glyph_order(font):
    names = [g.name for g in font]
    if ".notdef" not in names:
        nd = font.newGlyph(".notdef")
        nd.width = 300
        names = [g.name for g in font]
    order = [".notdef"]
    order += sorted(n for n in names if n != ".notdef")
    font.glyphOrder = order


def finalize(font, out_stub):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    otf = compileOTF(font, inplace=False)
    normalize_font_tables(otf, "Letterpaths", "Regular")
    otf_path = OUT_DIR / f"{out_stub}.otf"
    otf.save(str(otf_path))

    otf.flavor = "woff2"
    otf.save(str(OUT_DIR / f"{out_stub}.woff2"))

    ttf = compileTTF(font, inplace=False)
    normalize_font_tables(ttf, "Letterpaths", "Regular")
    ttf.save(str(OUT_DIR / f"{out_stub}.ttf"))

    TTFont(str(otf_path))
    print(f"  built {out_stub}: .otf .ttf .woff2")
    return otf_path


def normalize_font_tables(ttfont, family, style):
    full_name = f"{family} {style}"
    ps_name = f"{family.replace(' ', '')}-{style}"
    version = "Version 0.002"
    unique = f"0.002;Letterpaths;{ps_name}"

    name_table = ttfont["name"]
    for name_id in (1, 2, 3, 4, 5, 6, 16, 17):
        name_table.removeNames(nameID=name_id)

    records = {
        1: family,
        2: style,
        3: unique,
        4: full_name,
        5: version,
        6: ps_name,
        16: family,
        17: style,
    }
    for name_id, value in records.items():
        name_table.setName(value, name_id, 3, 1, 0x409)
        name_table.setName(value, name_id, 1, 0, 0)

    if "OS/2" in ttfont:
        os2 = ttfont["OS/2"]
        os2.usWeightClass = 400
        os2.usWidthClass = 5
        os2.fsSelection |= 1 << 6
        os2.ulUnicodeRange1 |= 1
        os2.ulCodePageRange1 |= 1
        # g/j/y extend below the nominal -300 descender. Windows uses these
        # bounds for clipping, so every compiled outline must fit inside them.
        top = ttfont["head"].yMax
        bottom = ttfont["head"].yMin
        os2.usWinAscent = max(os2.usWinAscent, top)
        os2.usWinDescent = max(os2.usWinDescent, -bottom)
        os2.sTypoAscender = max(os2.sTypoAscender, top)
        os2.sTypoDescender = min(os2.sTypoDescender, bottom)
        ttfont["hhea"].ascent = max(ttfont["hhea"].ascent, top)
        ttfont["hhea"].descent = min(ttfont["hhea"].descent, bottom)
