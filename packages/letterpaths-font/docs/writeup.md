# Approach A (Pair Ligatures) — Join Engineering Writeup

This document explains how the **LetterpathsPair** font (Approach A: GSUB `liga`
pair ligatures) builds its glyphs, the join problems that were encountered, how
they were fixed, why the current construction was chosen, and a frank evaluation
of alternative designs — including breaking the joiner at its midpoint.

---

## 1. Background: what we are building

We turn the [`letterpaths`](../letterpaths) cursive-handwriting geometry into a
real installable font. `letterpaths` is the source of truth: given a string it
produces a `WritingPath` of cubic-bezier strokes with *organic, context-aware*
joins between letters.

Two font strategies were prototyped:

| Font | Glyph model | OpenType feature |
|---|---|---|
| **LetterpathsPair** (Approach A) | one glyph per lowercase **pair** `a_b`, joins baked in | `liga` ligature substitution |
| **LetterpathsContextual** (Approach B) | one glyph per **letter × position** (`init`/`medi`/`fina`/iso) | two-pass `calt` |

This writeup is about **Approach A**, which the user asked us to focus on and
make as good as possible.

### How a pair font actually renders text

GSUB `liga` rules (`sub a b by a_b;`) tile a word **greedily and
non-overlapping**:

```
min      -> [m_i][n]
bro      -> [b_r][o]
minimum  -> [m_i][n_i][m_u][m]
banana   -> [b_a][n_a][n_a]
```

Two consequences drive everything below:

1. A **single** glyph only ever appears as the **last** glyph of an **odd**-length
   word.
2. The seam **between** two tiles is a join from the *second* letter of one pair
   to the *first* letter of the next tile (e.g. `…r│o…` in `bro`). The pair glyph
   that owns the *left* side of that seam **cannot know** what letter follows.

Point 2 is the crux of the whole problem.

---

## 2. The starting point and the four reported problems

An earlier pass had fixed gross multi-letter crowding using "true advances" plus
sidebearing clipping. The user tested it and reported four concrete issues:

1. **Spacing a bit tight.** Bigrams (`ab`, `ac`) join perfectly but sit too close.
2. **3+ letters break the seam.** In `min`, the `in` seam doesn't join — even
   though the bigram `in` on its own is perfect.
3. **Lone letters grow a near-vertical joiner.** Typing a single `m` produced a
   lead-out that shoots almost straight up, instead of only appearing when a
   following letter exists.
4. **Some pairs unjoin inside longer words.** `ro` joins, but in `bro` the `r→o`
   is not joined.

### Root causes

- **#2 / #4** were the *same* bug. The old exporter clipped the trailing letter's
  connecting stroke at the **probe's left sidebearing** (a point *mid-join*, left
  of the real entry) and anchored every glyph at its **left ink extent**. So the
  trailing join stopped short of — and was horizontally misaligned with — the
  next tile's entry. Inside a pair (`m_i`) the join is baked in and perfect;
  *across* tiles it fell apart.
- **#3** was because singles were rendered as **medial** fragments carrying a
  forward join stub that was then clipped mid-curve, leaving an abrupt
  near-vertical end. A single is always word-final and should not have a forward
  stub at all.
- **#1** was simply the `letterpaths` default `minSidebearingGap` (50) being a
  touch tight for this hand.

---

## 3. The key insight: cut at the **entry point**, not the sidebearing

`letterpaths` joins are **explicit, separate curves**. Reading
`src/layout/cursive.ts` confirmed the model:

- Each connection is a `buildJoinCurve(prevExit.p3 → nextEntry.p0)` pushed as its
  own stroke step, tagged `segment = "join"`.
- A `WritingPath` stroke is
  `{ type, curves[], curveSegments[], deferred }`, where `curveSegments` labels
  every curve as `lead-in | entry | body | exit | lead-out | join | dot`.
- `joinMetrics[k].nextEntryX` is the **absolute x of the next letter's entry
  point** — the actual target the join lands on.

The old code had used `actualNextLeftSidebearingX` (the next letter's *left
guide*, which sits **left of** the entry). That is the wrong anchor: it is not
where the next letter's ink begins, and it is not where the join terminates.

**The fix: cut fragments at the real entry points.** For every glyph we render
the fragment wrapped in a neutral probe letter (`n` — no dots, ascenders,
descenders, or unusual entry/exit) and slice **whole join/letter curves** at the
entry points reported by `joinMetrics`:

- **Leading edge** (`"entry"`): drop the leading probe and its join; keep from the
  fragment's first real entry point onward; anchor that entry point to `x = 0`.
  An incoming join from the previous glyph now lands exactly on it.
- **Trailing edge, forward** (`"join"`): keep the outgoing join curve all the way
  to the **next** entry point, and set the **advance = entry-to-entry distance**.
  The following tile's entry therefore lands precisely where this glyph's ink
  ends — at *any* word length.
- **Trailing edge, final** (`"leadout"`): keep the word-final lead-out flourish
  and advance by ink width.

Two details that matter:

- We **slice whole curves**, never clip at a vertical x-line. Round bodies (`o`,
  `a`, `c`, `d`) bulge *left* of their entry point; an x-clip would shear them.
  Slicing on the curve boundary that `letterpaths` already provides keeps every
  letter shape intact.
- **Singles are final forms** (`entry` + `leadout`): a left entry join plus the
  natural ending flourish, with **no forward stub**. This directly removes the
  near-vertical joiner of problem #3, and matches greedy tiling (a single is
  always word-final).

Spacing (#1) is tuned with a single knob: `JOIN_SPACING.minSidebearingGap = 78`
(up from 50).

All of this lives in `src/export_letterpaths.ts` (`extract` / `flatten` /
`toSeg` / `makeGlyph`); the Python builder, GSUB, and compilation are unchanged.

---

## 4. Results

Measured **vision-free** with `src/analyze_joins.py`, which rasterizes each word
with the real font + real HarfBuzz shaping and counts 8-connected ink components
and per-seam ink continuity (`cross`):

| word | seams continuous (`cross`), PAIR | note |
|---|---|---|
| `min` | 1/1 | the `in` seam now joins |
| `minimum` | 3/3 | fully connected |
| `banana` | 2/2 | fully connected |
| `aluminium` | 4/4 | fully connected |
| `handwriting` | 5/5 | fully connected (extra components are legit i-dots / t-bars) |

`checks.py`: GSUB `liga` fires (`minimum → m_i n_i m_u m`) and WOFF2 round-trips.
`render_browser.py`: both WOFF2 webfonts load in real Chromium.

### The one honest residual

In `bro`, the final `o` still detaches slightly (`r→o`). Component analysis shows
two pieces: `b_r` and a separate `o`, overlapping in their bounding boxes but not
8-connected.

The reason is structural and is the heart of the next section: the `b_r` tile's
outgoing join was built aiming at a **generic** successor (probe `n`, which
enters low), but the real successor `o` **enters high**. The join ends at
`n`-entry height while `o` starts at `o`-entry height, so there is a small
vertical (and, because entry x also shifts with the predecessor, slightly
diagonal) gap. This is **inherent to pair ligatures**: a glyph cannot see its
real neighbour. It is precisely the problem the contextual (`calt`) font — which
shapes from the whole surrounding word — exists to solve, and there `bro` is
fully continuous (`1/1`).

---

## 5. Why a small seam mismatch is unavoidable in a pair font

State the seam algebraically. A real cursive join spans
`prev.exit → join → next.entry`. To split that join between two independently
designed glyphs, **both glyphs must agree on a shared seam point** without
knowing each other — they only know their own letters and a canonical probe.

Whichever side owns the join, that side knows **one** real letter and must
*assume* the other:

- **Trailing-join (current):** `glyph1` knows its last letter's real **exit**,
  assumes the successor is `n`. The join therefore terminates at `n`-entry
  height. Mismatch at the seam ≈ `|successor.entry − n.entry|`. → breaks when the
  **successor enters unusually** (the `o`/`v`/`w` class), e.g. `bro`.
- **Leading-join (mirror):** `glyph2` knows its first letter's real **entry**,
  assumes the predecessor is `n`. Mismatch ≈ `|predecessor.exit − n.exit|`. →
  breaks when the **predecessor exits unusually** (again `o`/`v`/`w`, plus `r`).

So the bad-case *count* is roughly the same either way; the failures just move
from "weird next letter" to "weird previous letter." There is no orientation that
eliminates them, because the join's two endpoints genuinely depend on **both**
neighbours, and a pair glyph only ever has one of them.

This is not a bug we failed to fix; it is the defining limitation of pair-based
cursive fonts.

---

## 6. Alternatives considered

### A. Trailing-join cut at the entry point — **chosen**
Already described. **Pros:** exact entry-to-entry advances (uniform spacing at any
length); whole-curve slicing preserves letter shapes; singles become correct
final forms; one spacing knob; every multi-letter test word fully joins except
the high-entry-successor class. **Cons:** the `o`/`v`/`w`-successor seam (`bro`)
keeps a small gap.

### B. Leading-join cut (mirror of A)
Move the join onto the *following* glyph; cut at the predecessor's exit. **Verdict:
sideways, not better.** It would fix `bro` (because `r` exits fairly normally) but
break the symmetric set — any word with `o`/`v`/`w` *before* the seam (`ox`,
`avenue`-style transitions) — which currently work. It also makes the *single*
glyphs carry a leading join built for a generic predecessor, reintroducing a
left-side stub on a lone letter. Net join quality is about the same, and we'd
trade a small, well-understood failure set for a different, equally large one.

### C. Break the joiner at its **midpoint**
Give `glyph1` the first half of the join (`exit → joinMid`) and `glyph2` the
second half (`joinMid → entry`), so neither glyph owns a full crossing.
**Verdict: better *looking* near-misses, but it does not actually close the seam,
and it complicates advances.**

- For the two halves to meet, `joinMid` computed by `glyph1` (using probe `n` as
  successor) must equal `joinMid` computed by `glyph2` (using probe `n` as
  predecessor). Those are the midpoints of two *different* joins — `r→n` versus
  `n→o` — so they still disagree. The mismatch is `≈ ½` of the full-entry
  mismatch and occurs at a flatter part of the stroke, so visually it's gentler,
  but `bro` would still show two components: the gap shrinks, it doesn't vanish.
- The advance story gets worse. With the current design the advance is a single
  clean number: the entry-to-entry distance. With a mid-join split, each glyph's
  contribution to the advance is "half a join," and the two halves' x-positions
  are computed in different probe contexts, so they don't sum to the real
  entry-to-entry distance without a correction term. We'd reintroduce exactly the
  spacing fragility we just removed.
- It also doubles the number of seam joints per word (two half-joins instead of
  one full join), giving the renderer twice as many places to reveal a kink.

Midpoint-break is the classic instinct, and it *does* make gaps less obvious, but
it converts one honest, well-placed seam into two softer-but-still-imperfect
seams **plus** an advance-accounting headache. For a pair font it is a lateral
move at best.

### D. Fixed canonical connection height (snap entries & exits to one y)
Force every glyph's entry and exit to a single seam height (e.g. mid-x-height)
with a short synthetic connector, the way many script fonts with a flat baseline
join do. **Verdict: guarantees perfect tiling, at a real cost to fidelity.** This
*would* make every seam connect exactly (x and y identical for all pairs), fixing
`bro`. But the connector is **synthetic**, not `letterpaths` geometry — it
flattens the organic, varying join heights that make this hand look handwritten,
and it fights the high-entry letters (`o`/`v`/`w`) whose charm is precisely that
they *don't* meet at the baseline. It also can't be derived from `letterpaths`;
we'd be hand-authoring join stubs. Good for a geometric script face, wrong for
this one.

### E. Per-predecessor single glyphs (`o-after-b`, `o-after-r`, …)
Since a single's real predecessor *is* known at tiling time (it's the previous
tile's last letter), build 26×26 context-specific finals. **Verdict: defeats the
point of a pair font.** It explodes the glyph count, and `liga` can't naturally
select "single conditioned on the previous glyph" without contextual logic — at
which point you have rebuilt Approach B (`calt`) badly. If you want
neighbour-aware joins, use `calt`.

### F. Tiny negative advance / overlap fudge
Pull each following glyph slightly left so round pen caps bridge near-misses.
**Verdict: rejected.** It would mask `bro` by brute force, but it re-tightens
*every* seam (undoing the #1 spacing fix) and only bridges in x — the `bro` gap is
largely vertical, so it helps little where it's needed and hurts everywhere it
isn't.

---

## 7. Recommendation

- **Keep Approach A as built (option A).** It is exact where a pair font *can* be
  exact: uniform entry-to-entry spacing, faithful letter shapes, correct
  word-final singles, and full continuity on every multi-letter word except the
  high-entry-successor class. The construction is simple (one cut rule, one
  advance rule, one spacing knob) and derives entirely from real `letterpaths`
  geometry.
- **Do not adopt the midpoint break (C) or the mirror (B)** for the pair font:
  both are lateral moves that trade one small failure set for another while making
  spacing harder to reason about.
- **For the residual `o`/`v`/`w` seams, the right tool is Approach B (`calt`)**,
  which already renders `bro` fully joined because it shapes from the whole word.
  The honest framing is: a pair font is a fast, compatible approximation; a
  contextual font is the higher-fidelity option when neighbour-aware joins matter.

In short, the current solution is the best *pair-font* solution; the better path
beyond it is not a cleverer cut but a different feature model — the contextual
font.

---

## 8. Why connected joining is genuinely difficult

It is worth stating plainly *why* "just join the letters up" resists a clean
solution, because the difficulty is structural, not a matter of effort. The full
high-fidelity treatment lives in [option3.md](option3.md); this section is the
honest problem statement that motivates it.

### 8.1 A join's shape depends on **both** of its endpoints

A real cursive connection is a single curve
`prev.exit → join → next.entry`. Its shape is fixed by **two** points that belong
to **two different letters**: where the previous letter leaves, and where the
next letter arrives. Neither letter, drawn on its own, knows both. Any font built
from independently-tiled glyphs is therefore trying to reconstruct a
two-letter object from one-letter pieces, and the seam is exactly the place where
that reconstruction can go wrong.

### 8.2 Letterpaths does not join at one canonical height

If every letter entered and exited at the *same* y (as many geometric script
faces enforce), tiling would be trivial: every seam meets at that one height and
nothing can misalign vertically. Letterpaths deliberately does **not** do this —
that variation is what makes the hand look written rather than drawn. Concretely,
reading `cursiveExitVariantByLetter` and measuring the geometry shows **several
distinct seam heights**:

| exit behaviour | letters | where the stroke leaves |
|---|---|---|
| low (baseline) | the majority (`n`, `u`, `a`, `e`, …) | on/just above the baseline |
| high | `o`, `r`, `v`, `w` | up near the x-height |
| `f`-loop | `f` | just above the baseline, off a descender loop |
| `q`-loop | `q` | down inside the descender |

Symmetrically, a letter's *entry* shape changes with the height it is being
approached **from** (letterpaths' `entry-high` vs `entry-low` variants, and the
subtler within-class seating of `v`, `w`, `e`). So the join height at a seam is a
function of the specific pair, and there are at least four predecessor families
to satisfy, not one.

### 8.3 A tiled glyph cannot see its neighbour

This is the decisive constraint. In a pair font, `liga` can only condition on the
two letters *inside* a tile; the seam that matters falls *between* tiles, where
the owning glyph has no way to know the letter on the other side (§1, point 2).
So whichever side owns the join must **assume** a generic neighbour (we use the
probe `n`). The assumption is right for the common low-exit case and wrong for
every family that deviates — `o/r/v/w` on the high side, `f`/`q` on the loop side.
The result is the small but real seam gap documented in §4 (`bro`) and the
descender-letter breaks (`fan`, `quiz`) that a pair font cannot fix in principle.

### 8.4 The mismatch is vertical, so the usual tricks don't help

The gap at a failing seam is mostly in **y** (the two sides meet at the right x
but different heights). That is why the instinctive fixes fail: tightening
spacing or overlapping glyphs (§6F) only moves things in **x**; breaking the join
at its midpoint (§6C) halves the gap but does not close it and wrecks the advance
arithmetic; snapping everything to one canonical height (§6D) closes every gap
but throws away the very height variation that makes the hand handwritten. There
is no cheap geometric nudge that recovers a height the glyph was never told about.

> **The core difficulty:** the join is a two-letter object with several possible
> seam heights, but a tiled glyph only ever knows one of its two neighbours. You
> cannot draw the right seam without the missing letter, and you cannot fake the
> missing height in x.

---

## 9. Why Option 3 made progress

Option 3 (the Playwrite-style `calt` font, [option3.md](option3.md)) does not
out-*draw* the pair font — it uses the **same letterpaths geometry**. It makes
progress by attacking the two structural problems of §8 directly: it restores
neighbour context, and it renders each seam against the *real* letter on both
sides. Three ideas do the work.

### 9.1 Keep the neighbour: shaping is a **selection** problem

The pair font throws neighbour information away at tiling time. A contextual
`calt` font keeps the whole surrounding word visible, so it can **select** a
pre-shaped form per position rather than reconstruct geometry from one letter.
This is exactly Playwrite's strategy — pick the glyph already drawn for these
neighbours — and it dissolves §8.3: the font *can* see the letter on the other
side of the seam, so it can choose a form built for it.

### 9.2 Own the **incoming** join, cut the predecessor at its own exit

The subtle decision (and the one that took two attempts) is *which* glyph owns
the seam. Option 3 gives every form its **own incoming join, rendered against the
real successor letter**, and cuts the predecessor cleanly at *its own* exit
point. Now both sides of a seam are anchored to the same place — the predecessor's
exit height — and that height is standardised *per exit class*. This is the move
that fixed `avenue`, which even the first Option 3 build (predecessor-owned, §8.2
heights) split into three pieces. It is also precisely the mirror that
`writeup.md` §6B **rejected for the pair font** — because a lone pair glyph would
sprout a leading stub. The contextual model has no lone-pair problem (the
isolated form is a separate glyph), so the mirror that was wrong for A is exactly
right for Option 3.

### 9.3 One exit **class** per seam height, not one connector per pair

Playwrite ships a hand-drawn connector for (nearly) every predecessor×successor
pair. Letterpaths needs far fewer because it standardises exits into a handful of
**classes**: a successor only needs one entry variant per *distinct exit height*
it can follow. So Option 3 builds:

- `.medi`/`.fina` — after a low-exit letter (the default);
- `.mediHi`/`.finaHi` — after high-exit `{o,r,v,w}`;
- `.mediF`/`.finaF` and `.mediQ`/`.finaQ` — after the loop letters `f` and `q`.

and a short `calt` cascade selects them (Stage A picks init/medi/fina by
position; Stages B and C upgrade the entry variant by the predecessor's exit
class). The cost scales with the number of distinct **seam heights** (four), not
with the 676 letter pairs — which is why a few extra forms per letter close
seams the pair font cannot.

### 9.4 The honest result

Measured vision-free with `analyze_joins.py`, a full 26×26 pairwise raster scan
of Option 3 now reports **zero broken bigrams**: every lowercase pair connects
(component count equals the expected `i`/`j` dot and `t`-crossbar count), the
high-exit words (`bro`, `ro`, `ovo`, `wow`, `avenue`) are fully continuous, and
the descender-loop letters join everything (`fan`, `fun`, `off`, `quiz`, `aqua`,
`quartz`). Option 3 also opens the spacing relative to the pair font
(`minSidebearingGap` 140 vs 78) for a less cramped hand. The pair font remains
the maximally-compatible approximation; Option 3 is the high-fidelity answer, and
it got there not by drawing better curves but by **keeping the context the pair
font discards and standardising the seam height on both sides**.

---

## 10. Would a font-building API in `letterpaths` help?

A fair question is whether the font would be easier to build if we could add
features to `letterpaths` itself — **without changing the shape of the output**
(same letters, same joins), only adding an API surface aimed at font generation.
The short answer: **yes, substantially — it would remove almost all of the
reverse-engineering and guesswork — but it would not change the fundamental
OpenType constraint, so the font's structure would stay the same.**

It helps to separate the work into two buckets: the part that is *hard because we
are guessing at `letterpaths`' internals*, and the part that is *hard because of
how fonts work*. An API fixes the first bucket completely and the second not at
all.

### 10.1 What we do today (and why it is fragile)

`letterpaths` is designed to render *whole strings*. To extract a single tileable
glyph we abuse that: we render the target letter wrapped in a neutral **probe**
(`n`, or `o`/`f`/`q` for the high and loop classes), then **slice whole
curves at the join boundaries** that `joinMetrics` happens to report, and anchor
the fragment at a point we infer. Several things in this pipeline are inferred
rather than declared:

- **Which letters share an exit height.** `cursiveExitVariantByLetter` gives a
  *binary* `high`/`low`, but the real geometry has more classes than that —
  `f` and `q` each exit at their own height (§8.2, §4.3 of `option3.md`). We only
  discovered the third and fourth classes by **rastering all 676 bigrams and
  watching them break**. The exit label in the data was actively misleading
  (`f` and `q` are both tagged `low`).
- **Where the seam anchor is.** We reconstruct it from `previousExitX` /
  `nextEntryX` and the `segment` tags on curves, then cut on a curve boundary and
  hope the boundary is stable.
- **The advance.** We recompute entry-to-entry / exit-to-exit distance from
  `joinMetrics` rather than being told the canonical advance of a form.

None of this is wrong, but it is **derived**, so it silently drifts if the
underlying shapes are ever re-cut, and it cost two failed attempts plus a full
pairwise scan to get `f`/`q` right.

### 10.2 The API that would help (introspection + form extraction)

The useful additions are **metadata and a form-extraction convenience** — both
purely *descriptive of the existing geometry*, so neither changes a single curve:

1. **Enumerate the real exit/entry classes.** Instead of a binary
   `cursiveExitVariantByLetter`, expose the *actual* set of distinct seam heights
   and which letter belongs to which: e.g. `exitClasses = [low, high, f-loop,
   q-loop]` with each letter's class and the canonical `(x, y, tangent)` of its
   exit. This single table is the thing whose absence cost the most: it turns
   "discover the classes empirically" into "read them." It also future-proofs the
   build — if a glyph is ever redrawn into a new exit class, the table changes and
   the font regenerates correctly with no detective work.
2. **A canonical seam descriptor per (letter, variant).** For every letter in
   each entry variant, expose the entry anchor and exit anchor as explicit points
   with tangents, plus the form's canonical advance. This replaces the
   probe-render-and-slice heuristic with a direct query and guarantees both sides
   of a seam are defined against the *same* declared point.
3. **A first-class "extract a joinable form" call.** Essentially what our
   `extract()` does — "give me letter `X` with leading = {lead-in | join-from
   exit-class C} and trailing = {exit | lead-out}, cut cleanly, anchored at the
   seam" — but maintained *inside* `letterpaths`, so it tracks shape changes and
   uses stable internal segment indices rather than our external slicing. This is
   the largest reduction in build code and the biggest robustness win.
4. **A "font plan" helper.** Given the class table, emit the exact set of forms
   to generate (positions × predecessor exit-classes) and the predecessor→variant
   mapping that the `calt` cascade needs. We currently hand-write those classes
   (`@prevHighExit`, `@prevMidF`, `@prevMidQ`); deriving them from the source
   would keep the feature file and the geometry permanently in sync.

Crucially, all four are **read-only views and a cutting convenience**. They honour
the constraint in the question: no letter shape changes, no join shape changes —
just a supported way to *ask* `letterpaths` what it already knows.

### 10.3 What this would and would not change

With that API, the build collapses from "probe, slice, measure, and verify by
rastering" to "query the class table, ask for each declared form, lay out the
`calt` mapping the source hands us." The `f`/`q` episode — two wrong attempts and
a 676-pair scan — becomes a non-event: the class table would have listed two
extra exit classes from the start, and we would have generated their forms
without ever shipping a broken seam.

But the **shape of the font does not change**, because the hard constraints are
in OpenType, not in `letterpaths`:

- **A font still pre-bakes a finite glyph set and selects with `calt`.** There is
  no runtime curve-stitching in a font; you cannot compute a join when the text
  is typed. So you still need one form per (position × predecessor exit-class),
  and the glyph count still scales with the number of **distinct exit classes**
  (four today). The API makes enumerating and generating those forms exact and
  cheap; it cannot reduce them to one.
- **The context window is still whatever `calt` can see.** Our model conditions on
  the immediate predecessor's exit class. If `letterpaths` ever introduced
  longer-range effects — successor-conditioned *exits* (Playwrite's `before_X`
  connectors), true ligatures, or a letter like a looping `s` whose join depends
  on more than one neighbour — the API could *describe* them, but reproducing them
  in a font would mean more glyphs and a more elaborate `calt`/`liga`, exactly as
  Playwrite needs. The cost moves from "guessing" to "more forms," not to "free."
- **Validation by rendering does not go away.** Even with exact anchors, the build
  still strokes centerlines to filled outlines, removes overlaps, synthesises
  punctuation, and must confirm that real HarfBuzz shaping plus real
  rasterisation actually connects (dots, crossbars, hinting, round-cap bridging
  are all font-side concerns the API knows nothing about). The API removes the
  *geometric* guesswork, not the *font-engineering* verification.
- **The pair-font blindness (Approach A) is intrinsic.** No API can let a `liga`
  pair glyph see the neighbour on the far side of its seam (§8.3); that is a
  property of `liga` tiling, not of `letterpaths`. The answer there remains "use
  the contextual model," which we already do.

### 10.4 Verdict

A font-building API on `letterpaths` would be a clear win, but a **targeted** one:
it would eliminate the brittle, empirically-tuned bridge between `letterpaths`'
internals and our exporter — the probe-and-slice cutting, the
discover-the-classes-by-breakage loop, the hand-maintained `calt` classes — and
make the build a direct, self-synchronising transform of declared geometry. What
it would **not** do is make the font itself simpler or higher-fidelity than
Option 3 already is: the finite-form, `calt`-selected structure is dictated by
OpenType and by the number of distinct seam heights in the hand, and those are
unchanged by any amount of API. In short, an API moves the difficulty from *"we
have to reverse-engineer the geometry and hope"* to *"we generate exactly the
forms the source tells us to"* — a large reduction in **risk and code**, with the
**same resulting font**.

> Update: §11 revises the "same resulting font / Option 3 is the ceiling"
> framing. Once judged by eye rather than by the connectivity metric, Option 3's
> exit-class approximation visibly kinks, and the per-pair Option 4 build is the
> first that looks correct. An API would not just de-risk Option 3 — it would
> make the *better*, per-pair model (§11) cheap to generate directly.

## 11. Option 4 — pair-specific incoming joins (the first visually correct version)

Full report: [option4.md](option4.md). Reproduce: `pnpm run option4`.

**This is the version that actually looks right.** Approaches A and B and
Option 3 all *pass the automated connectivity test* (0–94 broken bigrams), but
on close visual inspection their joins are subtly wrong — kinked, doubled, or
arriving at the wrong angle — because they reuse one representative join per
**exit class** rather than the real join for the specific pair. Option 4 is the
first build whose joins are visually clean across the board. That single fact
reframes the whole comparison below.

**What we did that worked.** For every ordered lowercase pair `prev → next` we
render the bigram in `letterpaths`, take the **genuine** join curve it produces,
and give that *whole* curve to the **successor** glyph (**Model A**): for each
letter `L` and predecessor `P`, the forms `L.medi<P>` / `L.fina<P>` carry the
real `P → L` join, anchored at `P`'s actual exit point. A two-stage `calt`
selects them — positional `init/medi/fina` first, then one lookup per predecessor
`P ≠ n` upgrading the next letter to its pair-specific form. Real HarfBuzz
confirms the selection works: `bro → b.init r.mediB o.finaR` (the true `r → o`
join, not a generic probe), **53/53** pair-specific selections across the probe
words. The path is fully separate; it never edits `letterpaths` and never touches
Approach A/B or Option 3.

**Why it worked — and why the earlier versions only *looked* like they worked.**
The thing that breaks handwriting joins is not gaps, it is *approximation*.
Every earlier model conditioned the join on the predecessor's **exit class** — a
coarse 3–4 bucket abstraction (`HIGH {o r v w}`, `MID {f q}`, `LOW` everyone
else) — and reused a single representative join for the whole bucket. Two facts
made that look fine and be wrong:

- **The connectivity metric is necessary but not sufficient.** It rasterises the
  bigram and checks the ink forms *one connected blob*. A join that arrives at
  the wrong angle still touches, so it counts as "connected." The metric sees
  **gaps**, not **kinks**. That is exactly why Option 3 scores 0/676 broken yet
  reads wrong to the eye.
- **One join per exit class is genuinely too coarse.** Clustering the real
  incoming joins shows **~17 distinct shapes per letter**, not 3 — and those
  clusters are 100 % pure within an exit class, i.e. the exit class is only the
  *coarsest* axis of a much finer real variation. Collapsing 17 shapes onto 3–4
  representatives is precisely the visible error.

Option 4 removes the approximation entirely: each pair meets at the predecessor's
**real** exit `x`, `y`, tangent *and* curvature, because the join it draws is the
one `letterpaths` actually produces for that pair. There is nothing left to be
"close enough" — it is exact by construction.

**Connectivity (real-font HarfBuzz + raster, all 676 bigrams).** Now read as a
*floor*, not a ranking — passing this is the minimum, looking right is the goal:

| font | broken bigrams | visually clean? |
|---|---|---|
| pair (A) | 0/676 | no — blind across the seam (§8.3) |
| contextual (B) | 94/676 | no |
| option3 | 0/676 | no — exit-class approximation kinks |
| **option4 (pair-specific)** | **1/676** (`tj` dotted-glyph artifact) | **yes** |

WOFF2 loads in headless Chromium (PASS), and the joins survive visual inspection
— the test the earlier options quietly failed.

**One sub-hypothesis still failed (and that is fine).** Option 4 was originally
motivated by *splitting* each join at a shared seam height so 26 outgoing + 26
incoming halves could be **reused**. That part does not work: 110/676 pairs never
reach a common seam, and the half-tangents spread 22 % / 37 %, so the halves are
not interchangeable. The win came from the *other* half of the idea — keeping the
whole real per-pair curve — so we simply don't split. The splitting machinery
exists in the code but earns nothing; see "next steps."

### 11.1 Verdict

**Option 4 is the recommended model.** It is the only build that is both
connected *and* visually correct, because it stops approximating the join by
exit class and uses the genuine per-pair geometry. Option 3 remains a reasonable
*low-budget* fallback (3–4 exit classes, a few dozen glyphs) when the kinks are
acceptable, but it should no longer be described as "as good as" Option 4 — the
automated metric simply could not see the difference. The cost of Option 4 is
**1404 glyphs** and a **37 KB / 25-lookup `calt`**; the next section argues most
of that cost is removable.

### 11.2 What this success suggests — simplifications and next steps

Now that we know the *whole real per-pair join* is what matters, several parts of
the pipeline are revealed as unnecessary, and the glyph budget looks reducible:

1. **Delete the splitting / seam machinery.** Seams, crossing-finding, exit
   classes for cutting, and the `reconstructionCheck` exist only to support
   splitting, which earns nothing. The model collapses to one sentence: *render
   `prev → next`, give the whole join to the successor, select with `calt`.* This
   removes the most fragile, hand-tuned code in the exporter.

2. **Merge predecessors by data-driven clustering, not hand-picked exit classes.**
   The 26 per-predecessor forms cluster into **~17 distinct shapes per letter**.
   If two predecessors produce the same incoming join (within tolerance), they can
   share one glyph and one `calt` class. That replaces the guessed 3–4 exit
   classes with measured, per-letter merging — keeping the visual correctness
   while cutting glyph count from 1404 toward **~17 × 26 ≈ a few hundred**, and
   shrinking `calt` to one lookup per *cluster* rather than per predecessor. The
   clustering already runs (`clustering_report`); promoting it from a *report*
   into the *glyph-naming key* is the concrete next step.

3. **Pick the default form by dominance, not by `n`.** Today the generic
   `medi/fina` is "after `n`," overridden for every `P ≠ n`. If instead the
   default is each letter's **largest cluster**, the most common predecessors need
   *no* override lookup at all — fewer glyphs flagged, smaller `calt`.

4. **Let the form count vary per letter.** Letters whose incoming joins barely
   change across predecessors (straight-entry letters) may need only 1–2 forms;
   letters fed by `o r v w f q` may need more. A per-letter budget driven by the
   cluster count is both smaller and more faithful than a uniform 54-forms-each.

5. **Re-examine whether positional `init/fina` even need pair variants.** Word
   starts have no predecessor, and many word-final joins are visually forgiving;
   the pair-specific treatment may only be needed on `medi`, cutting the form set
   roughly in half.

In short: Option 4 proves the *quality* ceiling is reached by using real per-pair
joins, and its own measurements (the ~17 clusters) show the *cost* is far below
the naïve 1404 glyphs. The recommended next build is **"Option 4, cluster-merged"**
— same visual fidelity, a few hundred glyphs, a `calt` keyed on measured join
clusters instead of guessed exit classes, and none of the splitting code.

