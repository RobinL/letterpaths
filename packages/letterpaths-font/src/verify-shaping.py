"""shaping_option4.py

Verify pair-specific joining with HarfBuzz by printing the actual glyph
substitutions HarfBuzz performs for a set of probe words, with the `calt`
feature on.

Option 4's whole claim is that the SUCCESSOR carries the real prev->next join.
That is only true if HarfBuzz actually selects the pair-specific form L.medi<P>
/ L.fina<P> (e.g. in "bro" the `o` must become `o.finaR`, carrying the genuine
r->o join, NOT a generic form). This test asserts exactly that: for every
inter-letter position it computes the required pair-specific glyph name from the
real predecessor and checks HarfBuzz produced it. Words after `n` legitimately
keep the bare (generic == after-n) form.

Run: uv run python src/verify-shaping.py
"""

from pathlib import Path

import uharfbuzz as hb

OUT = Path(__file__).resolve().parent.parent / "fonts"
FONT = OUT / "LetterpathsOption4.otf"

GENERIC_PRED = "n"  # bare .medi/.fina carry the after-n join

WORDS = [
    "min",
    "minimum",
    "banana",
    "aluminium",
    "handwriting",
    "bro",
    "ro",
    "avenue",
    "ovo",
    "wow",
    "fan",
    "fun",
    "off",
    "quiz",
    "aqua",
    "quartz",
]


def shape(font_path, text, calt=True):
    blob = hb.Blob.from_file_path(str(font_path))
    face = hb.Face(blob)
    hbfont = hb.Font(face)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    features = {"calt": calt, "liga": False, "kern": True}
    hb.shape(hbfont, buf, features)
    return [hbfont.glyph_to_string(i.codepoint) for i in buf.glyph_infos]


def expected_forms(text):
    """Map glyph index -> required glyph name for an all-letter word.

    isolated -> base; first -> .init; otherwise .medi/.fina with a pair suffix
    taken from the REAL predecessor (empty suffix after the generic predecessor
    `n`)."""
    n = len(text)
    out = {}
    for i, ch in enumerate(text):
        if not ch.isalpha():
            continue
        if n == 1:
            out[i] = ch
        elif i == 0:
            out[i] = f"{ch}.init"
        else:
            pos = "fina" if i == n - 1 else "medi"
            p = text[i - 1]
            suf = "" if p == GENERIC_PRED else p.upper()
            out[i] = f"{ch}.{pos}{suf}"
    return out


def main():
    if not FONT.exists():
        raise SystemExit(f"missing {FONT}; run build_option4.py first")
    print(f"Font: {FONT.name}  (feature calt ON)\n")
    ok = True
    pair_specific_hits = 0
    pair_specific_total = 0
    for w in WORDS:
        glyphs = shape(FONT, w, calt=True)
        exp = expected_forms(w)
        mismatches = []
        for i, want in exp.items():
            # count positions that REQUIRE a pair-specific form (suffix present)
            is_pair = (
                want != w[i]
                and not want.endswith(".init")
                and "." in want
                and want.split(".")[1] not in ("medi", "fina")
            )
            if is_pair:
                pair_specific_total += 1
            if i < len(glyphs) and glyphs[i] == want:
                if is_pair:
                    pair_specific_hits += 1
            else:
                got = glyphs[i] if i < len(glyphs) else "<none>"
                mismatches.append(f"@{i} want {want} got {got}")
        flag = "" if not mismatches else "  <-- " + "; ".join(mismatches)
        if mismatches:
            ok = False
        print(f"  {w:12} -> {' '.join(glyphs)}{flag}")
    print(
        f"\nPair-specific selections verified: "
        f"{pair_specific_hits}/{pair_specific_total}"
    )
    # Spotlight: bro must use the real r->o join (o.finaR), not a generic form.
    bro = shape(FONT, "bro", calt=True)
    print(
        f"  spotlight bro -> {' '.join(bro)} "
        f"(expect b.init r.mediB o.finaR -> proves r->o pair join)"
    )
    print(
        "\nALL forms correct (pair-specific joins selected)."
        if ok
        else "SOME forms WRONG."
    )


if __name__ == "__main__":
    main()
