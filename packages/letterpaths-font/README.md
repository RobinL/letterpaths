# letterpaths-font

Builds the `Letterpaths` font from the `letterpaths` library.

This package is downstream of `packages/letterpaths`: the TypeScript exporter
asks `letterpaths` for the real cursive geometry, then the Python builder turns
the exported centerlines into OTF, TTF, and WOFF2 font files.

The font uses pair-specific incoming joins. Each successor glyph owns the whole
real `previous -> current` join, and OpenType `calt` selects the correct
predecessor-specific form.

## Build

From the repo root:

```bash
pnpm font:build
```

Or from this package:

```bash
pnpm run export
pnpm run build
pnpm run verify
```

Outputs are committed in `fonts/`:

- `Letterpaths.otf`
- `Letterpaths.ttf`
- `Letterpaths.woff2`

The original research writeup is kept in `docs/writeup.md`.

Intermediate geometry and UFO sources are written to `build/` and ignored.

## Verification

`pnpm font:build` also verifies all three output formats. `pnpm --filter
letterpaths-font verify` reruns the checks against the current geometry and fonts:

- Raster comparison of all 1,508 letter forms against the original stroked
  centerlines, detecting filled counters and missing strokes.
- Vertical metrics that contain every glyph, including descenders.
- HarfBuzz checks of all lowercase pairs and triples, capital-to-lowercase joins,
  punctuation boundaries, and disabled contextual alternates. Failures exit nonzero.

Open `web/index.html` through a local HTTP server for a visual specimen.
The [outline repair notes](docs/outline-repair.md) explain the joined `g` defect.

## Character coverage

The font includes uppercase and lowercase Latin letters, common punctuation
(including straight and curly quotes, colons, semicolons, ellipses, parentheses,
and square brackets), and basic operators. Digits and unsupported symbols such
as `&`, `@`, `%`, currency signs, and braces are left unmapped so applications
can use a readable fallback font. They no longer render as fabricated boxes.
