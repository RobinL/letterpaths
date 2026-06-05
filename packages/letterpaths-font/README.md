# letterpaths-font

Builds the `Letterpaths Option4` font from the `letterpaths` library.

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

- `LetterpathsOption4.otf`
- `LetterpathsOption4.ttf`
- `LetterpathsOption4.woff2`

Intermediate geometry and UFO sources are written to `build/` and ignored.
