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
