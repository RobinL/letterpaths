# Worksheet performance review

Reviewed 8 September 2026, against `6cd0509`. Implementation branch: `codex/worksheet-render-performance`.

The clearest small improvement was the lookup of path points when drawing turning arrows. Replacing a linear scan with a binary search reduced worksheet generation time by 27-50% in the tested configurations that use these arrows. All compared geometry, screenshots, and printed page pixels remained identical. Default worksheets were already considerably faster and do not meaningfully benefit from this particular change.

## Implemented change

In `packages/letterpaths/src/tracing/formation-arrows.ts`, `interpolateSamplePoint` previously started at the beginning of a stroke for every requested point. Each turning-arrow stem requests many points, including neighbouring points used to compute tangents. A long stroke therefore caused millions of repeated distance comparisons.

Samples are already ordered by distance. Binary search now finds the same first enclosing sample pair; the interpolation arithmetic, endpoint behaviour, sample density, arrow commands, and print path are unchanged. This adds seven net lines of production code and introduces no cache, dependency, or rendering mode.

On `zephyr`, the number of sample-distance reads in arrow generation fell from 4,448,199 to 120,749. Isolated arrow generation, with the same prepared path and precomputed groups, fell from a median 14.90 ms to 0.68 ms; for the sentence below it fell from 33.72 ms to 2.04 ms. These are component timings, not whole-page speedups.

## Browser measurements

Apple M4, Chrome 152.0.7977.77, Vite development server, 1440 x 1000 viewport. Each scenario alternated stroke width between 54 and 56, with three warm-up changes followed by 15 measured changes. Values below are medians of synchronous input-handler execution, including worksheet generation and DOM replacement. Browser layout was measured separately. These are warm interaction measurements, not network load times or physical printer timings.

The sentence is `the quick brown fox jumps over the lazy dog`. The turning-arrow cases start from the default state, disable directional dashes, and enable turning/start/midpoint arrows. They are not an exact selection of the UI's "Outside letters" preset: its other settings, such as colour and lane offset, also differ. The reproducible script records the precise parameters.

| Worksheet | Before | After | Interpretation |
| --- | ---: | ---: | --- |
| Cursive `zephyr`, defaults | 9.2 ms | 8.5 ms | Broadly unchanged |
| Cursive `zephyr`, turning arrows enabled | 22.8 ms | 11.4 ms | 50% less generation time |
| Cursive sentence, defaults | 42.3 ms | 44.9 ms | Broadly unchanged; other work dominates |
| Cursive sentence, turning arrows enabled | 93.3 ms | 59.2 ms | 37% less generation time |
| Cursive sentence, every annotation, 12 rows x 6 repeats | 278.9 ms | 203.1 ms | 27% less generation time |
| Single pre-cursive `j`, defaults | 4.0 ms | 3.4 ms | Already small; no reliable material gain |
| Single print `m`, defaults | 3.3 ms | 3.4 ms | Unchanged |
| Single pre-cursive `m`, every annotation, 12 rows x 14 repeats | 8.6 ms | 9.0 ms | Unchanged; layout matters more |

The extreme cursive sheet still has 22,620 DOM elements, approximately 18 MB of markup, and an estimated 123,712 painted vector primitives after expanding its `<use>` copies. After the change, forced style/layout still takes about 193 ms, on top of the 203 ms input handler. Waiting for two animation frames gives roughly 483 ms overall. Optimising arithmetic alone cannot make this case feel immediate.

The dense single-letter sheet has 1,050 DOM elements and an estimated 9,044 painted primitives. Its approximately 15 ms layout cost exceeds its 9 ms generator cost. Default single-letter sheets take only about 3-4 ms to generate, so a large architectural change has limited justification for that common case.

## Visual and print verification

- Compared complete worksheet markup for eight representative configurations and all 26 lowercase letters in both print and pre-cursive styles with every annotation enabled: all 60 comparisons matched exactly.
- Compared all eight worksheet screenshots: the PNG files were byte-for-byte identical.
- Exported the eight configurations as PDFs before and after, rendered them at 150 dpi in grayscale, and compared every pixel: all matched. Every PDF contained one A4 page.
- Compared complete arrow geometry against a separately built baseline for 31 inputs in three handwriting styles and three option sets: all 279 comparisons matched exactly.
- Exercised the actual cursive print-button path for the extreme sheet, intercepting the browser print call to inspect the prepared output. Before and after both produced the identical 1588 x 2246 PNG (761,868 bytes), and a 406,502-byte raster PDF. Raster image cleanup, temporary print styling cleanup, and button re-enabling all succeeded. The raster PDFs also rendered identically in grayscale.
- Added geometry regression checks covering a long stroke, multiple turns, dots, fractional stem lengths, zero offset, and omitted heads. A deterministic work-count test detects reintroduction of repeated full-stroke scans without relying on machine speed.
- Library build, library TypeScript check, application TypeScript/build, and all 35 existing/new library tests passed. The library build still reports its pre-existing package export-condition ordering warning.

The implementation does not alter the A4 page size, 12 mm content inset, line widths, colours, opacity, SVG definitions, vector complexity threshold, or raster resolution. Physical laser-printer hardware and non-Chromium print engines were not available for testing; the evidence is identical generated print content and rasterised PDF pages, rather than a hardware certification.

There is an existing print-path distinction worth preserving in further work: the cursive **Print worksheet** button switches jobs above 10,000 estimated primitives to a raster image, while the browser's own print command bypasses that preparation. The extreme sheet's direct vector PDF was 18,713,792 bytes, versus 406,502 bytes through the button. The single-letter generator currently calls `window.print()` directly. These behaviours were not introduced or changed by this patch.

## Further opportunities, in priority order

| Option | Evidence and expected benefit | Complexity and checks needed |
| --- | --- | --- |
| Cache the current layout, sampled path, section analysis, and annotation geometry | Both `renderWorksheet` functions rebuild these on every setting change. This would help sentence-sized worksheets when changing row size, repeats, guides, or colours, and save single-letter step slicing. | Moderate. Use a bounded cache for the current text/letter, with explicit invalidation for style, lead strokes, joining and annotation options. Single-letter stroke width also changes start-dot radius and the view box, so caching complete rendered content by text alone would be incorrect. Does not eliminate dense-sheet layout cost. |
| Update existing SVG nodes for presentation-only changes | Both generators replace the entire worksheet through `innerHTML`, including thousands of unchanged paths. The dense cursive case spends about 193 ms in layout after generation. Avoiding replacement is likely the most valuable next experiment for that case. | Moderate to substantial. Start with a narrow operation such as a guide colour; preserve SVG IDs, per-step colours, dot geometry, accessibility labels, and export styles. Compare both screen and PDF output. |
| Coalesce rapid input events into one render per frame | Text, range and colour inputs call the full renderer synchronously on each event. Dragging can cause work for intermediate states that are never seen. | Small to moderate. This reduces redundant renders, not the cost of a single render. Flush any pending update before printing; retain immediate final values and URL updates. Measure real drags and typing, not only isolated synthetic events. |
| Decode identical practice-row images once during raster print preparation | `createWorksheetPngBlob` serialises and decodes every practice row separately, even though the rows share content. The dense sheet's complete button preparation took about 0.8 seconds in the spot check. | Moderate. Reuse a decoded row image and draw it at each measured row rectangle, keeping guide scaling, headers, separators, and the existing raster resolution. Benchmark first; the current spot timing is not a component breakdown. |
| Reuse tracing groups across section and turning-arrow compilation | The cursive renderer supplies precomputed sections, but turning-arrow generation can independently recompute groups. `shouldShareDefaultTracingGroups` only shares them when sections are absent. | Small to moderate, but a smaller likely win than caching the whole prepared result. Pass compatible groups explicitly, respecting callers with custom analysis options. |
| Avoid repeated curve scans while sampling long handwriting paths | `compileTracingPath` calls `getPointAndTangentAtDistance`, which walks curves from the beginning for each sample. | Moderate. A monotonic curve cursor is promising. Preserve the existing floating-point subtraction and boundary rules; replacing them with cumulative-length subtraction can change coordinates. Measure sentence cases and require exact geometry comparisons. |
| Revisit the redraw after cursive preview zoom | Cursive zoom schedules a complete worksheet render after two frames; single-letter zoom only applies the scale. | Investigate before changing. It may address browser SVG repaint behaviour; test pinch, wheel, resize, repeated `<use>` elements, and printing at different zooms in Chrome/Safari/Firefox. |

I would try the bounded geometry cache first for ordinary editing, and incremental SVG updates first if extreme dense worksheets are a priority. Both need broader state-handling changes than the implemented point lookup, so they are proposals rather than unmeasured additions to this branch.

## Initial load and existing optimisations

The production build loads eight JS/CSS assets per worksheet entry: approximately 346 KB uncompressed / 80 KB gzipped for cursive, and 342 KB / 79 KB for single-letter. These totals come from the emitted script/preload/stylesheet dependencies, excluding HTML and transport overhead; they are not measured download latency. The shared letter-data chunk accounts for approximately 150 KB uncompressed / 34 KB gzipped. Splitting that by writing style might help a slow first visit, but requires changing shared imports and does nothing for repeated renders once loaded. Prioritise the measured interaction costs first.

Useful optimisations already exist: hidden annotation families are skipped, cursive top/practice rendering shares a prepared path and sections, practice content is calculated once per render and repeated using SVG `<use>`, retrace/directional matching uses spatial buckets, and complex cursive print jobs have the raster fallback. Expanding repeated content inline, lowering sample quality, or replacing printable vectors wholesale would be poor first choices for preserving output.

The existing `profile:worksheet` script is useful for component investigation, but its `current` scenario computes all annotation families twice and does not describe today's default application. Likewise, `window.__worksheetProfiler` labels a wait for a single `requestAnimationFrame` as "paint": that callback runs before paint, so it should not be interpreted as measured paint duration. The new browser audit separates synchronous rendering and forced layout, and calls its two-frame interval `twoFrameMs`.

## Reproducing the browser audit

The standalone `packages/writing_app/scripts/profile-worksheets.browser.js` runs through Playwright CLI, without adding a runtime dependency or a Playwright test framework. From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm --filter writing_app dev --host 127.0.0.1 --port 5181 --strictPort
```

In another terminal:

```sh
mkdir -p output/playwright
npx --package @playwright/cli playwright-cli --session worksheet-perf open http://127.0.0.1:5181/cursive_worksheet_generator/ --headed
npx --package @playwright/cli playwright-cli --session worksheet-perf run-code --filename packages/writing_app/scripts/profile-worksheets.browser.js > output/playwright/audit-results.log
```

Change the script's `phase` value before a second run to preserve separate screenshots/PDFs. The CLI result contains individual durations, exact scenario parameters, markup hashes, node/primitive counts, and PDF sizes, plus the 52 alphabet hashes. Keep the browser version, viewport, machine and settings constant. The script's PDFs use the direct vector print path; verify the print-button raster path separately when changing print/export code.
