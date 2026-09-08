"""Verify contextual joining and character coverage in every distributed format.

Exhaust all lowercase pairs/triples, capital-to-lowercase pairs, word boundaries,
and disabled contextual alternates. A mismatch must fail the build.

Run: uv run python src/verify-shaping.py
"""

from io import BytesIO
from itertools import product
from string import ascii_lowercase, ascii_uppercase

from fontTools.ttLib import TTFont
import uharfbuzz as hb

from font_build_core import OUT_DIR

GENERIC_PRED = "n"  # bare .medi/.fina carry the after-n join
LOWERCASE = frozenset(ascii_lowercase)
UPPERCASE = frozenset(ascii_uppercase)
WORDS = [
    "min", "minimum", "banana", "aluminium", "handwriting", "bro", "ro",
    "avenue", "ovo", "wow", "fan", "fun", "off", "quiz", "aqua", "quartz",
    "things", "singing", "beginning", "bringing", "going", "growing", "bug",
    "Things", "Going", "Robin", "McGregor", "UK", "aBcd",
    '“Good things,” she said: “Keep going…”',
]
REQUIRED_CHARACTERS = (
    ascii_lowercase + ascii_uppercase + " .,!?'-\";:()[]/\\#*+=<>–—‘’“”…\u00a0"
)
# Do not claim characters with fake box outlines: allow application fallback.
UNSUPPORTED_CHARACTERS = "0123456789&@%£${}"


def shape(font, glyph_order, text, calt=True):
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, {"calt": calt, "liga": False, "kern": True})
    return [glyph_order[i.codepoint] for i in buf.glyph_infos]


def expected_forms(text, cmap, calt=True):
    """Describe joins by adjacent characters, independent of lookup ordering."""
    out = []
    for i, ch in enumerate(text):
        previous = text[i - 1] if i else ""
        following = text[i + 1] if i + 1 < len(text) else ""
        prev_lower = previous in LOWERCASE
        prev_upper = previous in UPPERCASE
        next_lower = following in LOWERCASE
        name = cmap.get(ord(ch), ".notdef")
        if calt and ch in ascii_lowercase:
            position = "medi" if next_lower else "fina"
            if prev_lower:
                suffix = "" if previous == GENERIC_PRED else previous.upper()
                name = f"{ch}.{position}{suffix}"
            elif prev_upper:
                name = f"{ch}.uc{position}"
            elif next_lower:
                name = f"{ch}.init"
        elif calt and ch in ascii_uppercase and next_lower:
            name = f"{ch}.ucnext"
        out.append(name)
    return out


def probes():
    yield from WORDS
    yield from ascii_lowercase + ascii_uppercase
    for length in (2, 3):
        for letters in product(ascii_lowercase, repeat=length):
            yield "".join(letters)
    for capital, lower in product(ascii_uppercase, ascii_lowercase):
        yield capital + lower
        yield capital + lower + "g"
    for separator in " .,!?'-\";:()[]/\\–—‘’“”…0123&@%\n":
        yield f"ag{separator}ga"


def verify(font_path):
    with TTFont(font_path) as ttfont:
        cmap = ttfont.getBestCmap()
        missing = [ch for ch in REQUIRED_CHARACTERS if ord(ch) not in cmap]
        placeholders = [ch for ch in UNSUPPORTED_CHARACTERS if ord(ch) in cmap]
        assert not missing, f"{font_path.name}: missing supported characters {missing}"
        assert not placeholders, f"{font_path.name}: fake character coverage {placeholders}"
        glyph_order = ttfont.getGlyphOrder()
        # HarfBuzz accepts sfnt, not compressed WOFF2: decode with FontTools.
        ttfont.flavor = None
        data = BytesIO()
        ttfont.save(data)
    font = hb.Font(hb.Face(data.getvalue()))
    count = 0
    for calt, texts in ((True, probes()), (False, WORDS)):
        for text in texts:
            actual = shape(font, glyph_order, text, calt)
            expected = expected_forms(text, cmap, calt)
            assert actual == expected, (
                f"{font_path.name}: {text!r} (calt={calt})\n"
                f"  expected: {' '.join(expected)}\n  actual:   {' '.join(actual)}"
            )
            count += 1
    print(f"{font_path.name}: {count} shaping probes and character coverage passed")


def main():
    for suffix in ("otf", "ttf", "woff2"):
        verify(OUT_DIR / f"Letterpaths.{suffix}")


if __name__ == "__main__":
    main()
