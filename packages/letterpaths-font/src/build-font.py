"""
Build the Letterpaths font from exported letterpaths geometry.

Glyph model: the successor owns the whole real prev->next join, so every letter
L has a distinct incoming form per predecessor P: L.medi<P> / L.fina<P>
(54 forms/letter, 1404 glyphs). The bare L.medi / L.fina carry the after-`n`
join and act as generic placeholders.

OpenType logic:
  Stage A  positional init / medi / fina (two passes), producing the generic
           (after-n) placeholders.
  Stage B  for every predecessor P != n, upgrade the generic medi/fina of the
           NEXT letter to its pair-specific L.medi<P> / L.fina<P> form. Each
           successor is matched exactly once (by its real predecessor), so the
           shaped string ends up carrying the true pair-specific join geometry.

Run: uv run python src/build-font.py
"""

from __future__ import annotations

import json
from pathlib import Path

from font_build_core import (
    GEO_DIR,
    UFO_DIR,
    measure_scale,
    new_font,
    build_glyphs,
    add_punctuation,
    set_glyph_order,
    finalize,
    CTX_OVERLAP,
)


def _all_forms_of(letter, letters, generic_pred):
    """Every glyph form of `letter`: base, init, generic medi/fina, and the
    pair-specific medi<P>/fina<P> for every predecessor P != generic_pred."""
    forms = [letter, f"{letter}.init", f"{letter}.medi", f"{letter}.fina"]
    for p in letters:
        if p == generic_pred:
            continue
        u = p.upper()
        forms.append(f"{letter}.medi{u}")
        forms.append(f"{letter}.fina{u}")
    return forms


def font_features(letters, generic_pred):
    """Pair-specific contextual joining.

    A) POSITIONS - init / medi / fina from neighbour presence (two passes).
                   The bare medi/fina are the after-`generic_pred` placeholders.
    B) PAIRS     - for every predecessor P != generic_pred, a medial/final
                   letter immediately after ANY form of P takes that letter's
                   pair-specific incoming form L.medi<P> / L.fina<P>. The class
                   substitution @medi -> @mediAfter<P> is alphabetically aligned
                   (both 26 glyphs, a..z) so each successor maps to its own
                   pair-specific form.
    """
    lc = " ".join(letters)
    init = " ".join(f"{l}.init" for l in letters)
    medi = " ".join(f"{l}.medi" for l in letters)
    fina = " ".join(f"{l}.fina" for l in letters)
    all_forms = " ".join(
        f for l in letters for f in _all_forms_of(l, letters, generic_pred)
    )

    lines = [
        "languagesystem DFLT dflt;",
        "languagesystem latn dflt;",
        "",
        f"@lc = [{lc}];",
        f"@init = [{init}];",
        f"@medi = [{medi}];",
        f"@fina = [{fina}];",
        f"@all = [{all_forms}];",
    ]
    # One @prev<P> (all forms of P) + aligned @mediAfter<P> / @finaAfter<P>.
    preds = [p for p in letters if p != generic_pred]
    for p in preds:
        u = p.upper()
        prev_forms = " ".join(_all_forms_of(p, letters, generic_pred))
        medi_after = " ".join(f"{l}.medi{u}" for l in letters)
        fina_after = " ".join(f"{l}.fina{u}" for l in letters)
        lines += [
            f"@prev{u} = [{prev_forms}];",
            f"@mediAfter{u} = [{medi_after}];",
            f"@finaAfter{u} = [{fina_after}];",
        ]
    lines += [
        "",
        "feature calt {",
        "    # --- Stage A: positional forms (generic = after-%s) ---" % generic_pred,
        "    lookup o4Exit {",
        "        sub @lc' @lc by @init;",
        "    } o4Exit;",
        "    lookup o4Medi {",
        "        sub @all @init' by @medi;",
        "    } o4Medi;",
        "    lookup o4Fina {",
        "        sub @all @lc' by @fina;",
        "    } o4Fina;",
        "    # --- Stage B: pair-specific incoming form per predecessor ---",
    ]
    for p in preds:
        u = p.upper()
        lines += [
            f"    lookup o4Pair{u} {{",
            f"        sub @prev{u} @medi' by @mediAfter{u};",
            f"        sub @prev{u} @fina' by @finaAfter{u};",
            f"    }} o4Pair{u};",
        ]
    lines += [
        "} calt;",
    ]
    return "\n".join(lines)


def build_font():
    print("Building Letterpaths font (pair-specific incoming joins)...")
    geo = json.loads((GEO_DIR / "glyphs.json").read_text())
    meta = geo["meta"]
    print(
        f"  model={meta['model']} | forms/letter={meta['formsPerLetter']} | "
        f"glyphs={len(geo['glyphs'])} | generic predecessor="
        f"{meta['genericPredecessor']}"
    )
    scale = measure_scale(geo)
    font = new_font("Letterpaths", "Regular")
    typical = build_glyphs(font, geo, scale, overlap=CTX_OVERLAP)
    add_punctuation(font, typical)
    feats = font_features(meta["letters"], meta["genericPredecessor"])
    font.features.text = feats
    print(f"  calt feature: {len(feats.splitlines())} lines, {len(feats)} chars")
    set_glyph_order(font)
    UFO_DIR.mkdir(parents=True, exist_ok=True)
    font.save(str(UFO_DIR / "Letterpaths.ufo"), overwrite=True)
    finalize(font, "Letterpaths")
    print("Done. Output in", font_build_output())


def font_build_output():
    from font_build_core import OUT_DIR

    return OUT_DIR


if __name__ == "__main__":
    build_font()
