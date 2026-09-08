"""Compare every compiled letter outline with its original stroked centerline.

This deliberately bypasses the builder's overlap removal and curve conversion
for the reference image. Checking glyph names or bounding boxes alone misses
filled counters, missing descenders, and other damaged outlines.

Run after exporting geometry and building fonts: uv run python src/verify-outlines.py
"""

import json
import math

import numpy as np
import skia
from fontTools.pens.basePen import BasePen
from fontTools.ttLib import TTFont

from font_build_core import GEO_DIR, OUT_DIR, PEN_WIDTH, measure_scale

PIXELS_PER_UNIT = 0.2
# Allow small differences from font coordinate rounding and cubic-to-quadratic
# conversion, while detecting both added ink and missing ink.
MAX_INK_ERROR = 0.04


class SkiaPen(BasePen):
    def __init__(self, glyph_set):
        super().__init__(glyph_set)
        self.path = skia.Path()

    def _moveTo(self, p):
        self.path.moveTo(*p)

    def _lineTo(self, p):
        self.path.lineTo(*p)

    def _curveToOne(self, p1, p2, p3):
        self.path.cubicTo(*p1, *p2, *p3)

    def _qCurveToOne(self, p1, p2):
        self.path.quadTo(*p1, *p2)

    def _closePath(self):
        self.path.close()

    def _endPath(self):
        pass


def centerline_path(contours, scale):
    path = skia.Path()
    for contour in contours:
        if not contour:
            continue
        previous_end = contour[0][:2]
        path.moveTo(*(v * scale for v in previous_end))
        for segment in contour:
            if not all(math.isfinite(v) for v in segment):
                raise ValueError("non-finite centerline coordinates")
            if segment[:2] != previous_end:
                raise ValueError("discontinuous centerline contour")
            path.cubicTo(*(v * scale for v in segment[2:]))
            previous_end = segment[6:]
    return path


def raster(path, paint, bounds):
    left, top, right, bottom = bounds
    surface = skia.Surface(
        math.ceil((right - left) * PIXELS_PER_UNIT),
        math.ceil((bottom - top) * PIXELS_PER_UNIT),
    )
    canvas = surface.getCanvas()
    canvas.clear(skia.ColorTRANSPARENT)
    canvas.scale(PIXELS_PER_UNIT, PIXELS_PER_UNIT)
    canvas.translate(-left, -top)
    canvas.drawPath(path, paint)
    return surface.makeImageSnapshot().toarray()[:, :, 3].astype(float)


def verify(font_path, geo):
    scale = measure_scale(geo)
    stroke = skia.Paint(
        Style=skia.Paint.kStroke_Style,
        StrokeWidth=PEN_WIDTH,
        StrokeCap=skia.Paint.kRound_Cap,
        StrokeJoin=skia.Paint.kRound_Join,
        AntiAlias=True,
    )
    fill = skia.Paint(AntiAlias=True)
    failures = []
    worst = (0, "")
    with TTFont(font_path) as font:
        top, bottom = font["head"].yMax, font["head"].yMin
        for label, ascent, descent in (
            ("Windows", font["OS/2"].usWinAscent, -font["OS/2"].usWinDescent),
            ("typographic", font["OS/2"].sTypoAscender, font["OS/2"].sTypoDescender),
            ("hhea", font["hhea"].ascent, font["hhea"].descent),
        ):
            if ascent < top or descent > bottom:
                failures.append(f"{label} vertical metrics exclude letter ink")
        glyph_set = font.getGlyphSet()
        for glyph in geo["glyphs"]:
            name = glyph["name"]
            source = centerline_path(glyph["contours"], scale)
            pen = SkiaPen(glyph_set)
            glyph_set[name].draw(pen)
            # Include both paths so spurious ink outside the source is counted.
            bounds = source.computeTightBounds()
            bounds.join(pen.path.computeTightBounds())
            bounds.outset(PEN_WIDTH, PEN_WIDTH)
            expected = raster(source, stroke, tuple(bounds))
            actual = raster(pen.path, fill, tuple(bounds))
            error = np.abs(expected - actual).sum() / max(expected.sum(), 1)
            worst = max(worst, (error, name))
            if error > MAX_INK_ERROR:
                failures.append(f"{name}: {error:.1%} ink differs")
    print(
        f"{font_path.name}: {len(geo['glyphs'])} letter outlines checked; "
        f"worst difference {worst[0]:.2%} ({worst[1]})"
    )
    if failures:
        raise AssertionError("Damaged font outlines:\n" + "\n".join(failures))


def main():
    geo = json.loads((GEO_DIR / "glyphs.json").read_text())
    for suffix in ("otf", "ttf", "woff2"):
        verify(OUT_DIR / f"Letterpaths.{suffix}", geo)


if __name__ == "__main__":
    main()
