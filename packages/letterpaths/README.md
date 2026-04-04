# letterpaths

`letterpaths` is a headless TypeScript library for generating handwriting geometry.

It does not render anything itself. You give it text and options, and it gives you back pure data:

- `WritingPath` objects for rendering
- `AnimationPlayer` objects for pen-motion playback
- tracing data and session state for "follow the line" interactions
- raw built-in glyph definitions for advanced customization

## Main idea

The main entrypoint is `buildHandwritingPath()`:

```ts
import { buildHandwritingPath } from "letterpaths";

const path = buildHandwritingPath("cat", {
  style: "cursive",
  targetGuides: {
    xHeight: 360,
    baseline: 720
  }
});
```

You get back a `WritingPath`:

```ts
type WritingPath = {
  strokes: Array<{
    type: "lead-in" | "body" | "join" | "exit" | "lift";
    curves: CubicBezier[];
    curveSegments?: Array<WritingPathSegment | undefined>;
    deferred: boolean;
  }>;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  guides: LetterGuides;
  joinMetrics?: JoinMetric[];
};
```

`strokes` is the important part. Each stroke contains one or more `CubicBezier` curves that you can render in SVG, Canvas, React Native, or anywhere else.

The built-in dataset currently covers lowercase `a-z`. If you need uppercase or alternative forms, pass your own `letters` map.

## Core API

### `buildHandwritingPath(text, options)`

The main high-level function. It switches between print, pre-cursive, and cursive layout.

```ts
import { buildHandwritingPath } from "letterpaths";

const path = buildHandwritingPath("cat", {
  style: "cursive",
  targetGuides: {
    xHeight: 360,
    baseline: 720
  },
  joinSpacing: {
    kerningScale: 1,
    minSidebearingGap: 50
  },
  wordSpacing: 540
});
```

Options:

- `style?: "print" | "pre-cursive" | "cursive"` defaults to `"cursive"`
- `targetGuides?: LetterGuides` scales the glyphs onto your guide system
- `joinSpacing?: JoinSpacingOptions` tunes cursive spacing decisions
- `wordSpacing?: number` controls the gap for spaces
- `letters?: Record<string, BezierLetter>` lets you swap in your own glyph map

Example of what comes back for a cursive word:

```ts
const path = buildHandwritingPath("cat", { style: "cursive" });

console.log({
  strokeCount: path.strokes.length,
  strokeTypes: path.strokes.map((stroke) => stroke.type),
  bounds: path.bounds,
  guides: path.guides,
  joinMetrics: path.joinMetrics?.map((metric) => ({
    pair: metric.pair,
    rawGap: Number(metric.rawGap.toFixed(2)),
    appliedGap: Number(metric.appliedGap.toFixed(2)),
    angleChangeDegrees: Number(metric.angleChangeDegrees.toFixed(2))
  }))
});
```

```ts
{
  strokeCount: 3,
  strokeTypes: ["join", "join", "body"],
  bounds: {
    minX: -91.25,
    maxX: 912.7,
    minY: 103.84,
    maxY: 774.98
  },
  guides: {
    xHeight: 360,
    baseline: 720
  },
  joinMetrics: [
    { pair: "ca", rawGap: 75.5, appliedGap: 111.49, angleChangeDegrees: 48.47 },
    { pair: "at", rawGap: 103.16, appliedGap: 104.19, angleChangeDegrees: 46.38 }
  ]
}
```

Notes:

- `joinMetrics` is only populated for cursive layout
- spaces advance the cursor using `wordSpacing`
- unknown characters are skipped rather than throwing
- some strokes may be marked `deferred: true` for marks such as dots

### Style-specific builders

These are also exported if you want to skip the style switch:

```ts
import {
  buildPrintWord,
  buildPreCursiveWord,
  joinCursiveWord
} from "letterpaths";

const printPath = buildPrintWord("cat");
const preCursivePath = buildPreCursiveWord("cat");
const cursivePath = joinCursiveWord("cat");
```

## Working with the returned curves

Each stroke contains `CubicBezier` instances, not raw SVG strings:

```ts
const path = buildHandwritingPath("a");
const firstCurve = path.strokes[0]?.curves[0];

if (firstCurve) {
  const halfway = firstCurve.getPointAt(0.5);
  const tangent = firstCurve.getTangentAt(0.5);
  const length = firstCurve.length();

  console.log({ halfway, tangent, length });
}
```

`CubicBezier` methods:

- `getPointAt(t)`
- `getTangentAt(t)`
- `length()`
- `getPointAtLength(distance)`
- `getTAtLength(distance)`

## Animation API

Use `compileAnimation()` when you want a time-based pen animation over a `WritingPath`.

```ts
import { buildHandwritingPath, compileAnimation } from "letterpaths";

const path = buildHandwritingPath("hi", { style: "pre-cursive" });
const player = compileAnimation(path, {
  speed: 2,
  penUpSpeed: 2.2,
  strokeDelayMs: 0,
  deferredDelayMs: 120
});

console.log(player.totalDuration);
console.log(player.getFrame(120));
```

`compileAnimation()` returns an `AnimationPlayer`.

```ts
type AnimationFrame = {
  point: Point;
  velocity: Point;
  isPenDown: boolean;
  completedStrokes: number[];
  activeStrokeIndex: number;
  activeStrokeProgress: number;
};
```

Example frame data:

```ts
{
  totalDuration: 2020.77,
  frame120: {
    point: { x: -12.85, y: 569.23 },
    velocity: { x: 0.72, y: -1.86 },
    isPenDown: true,
    completedStrokes: [],
    activeStrokeIndex: 0,
    activeStrokeProgress: 0.103
  }
}
```

Useful API:

- `compileAnimation(path, options)`
- `player.totalDuration`
- `player.getFrame(timeOffset)`

Animation options:

- `speed?: number`
- `penUpSpeed?: number`
- `minLiftDistance?: number`
- `strokeDelayMs?: number`
- `deferredDelayMs?: number`

## Tracing API

Tracing is a two-step flow:

1. Turn a `WritingPath` into sampled points with `compileTracingPath()`
2. Feed pointer events into a `TracingSession`

```ts
import {
  buildHandwritingPath,
  compileTracingPath,
  TracingSession
} from "letterpaths";

const path = buildHandwritingPath("i", { style: "cursive" });
const prepared = compileTracingPath(path, { sampleRate: 12 });
const session = new TracingSession(prepared, { startTolerance: 30 });

const initial = session.getState();
const began = session.beginAt(initial.cursorPoint);
session.update(initial.cursorPoint);
const afterUpdate = session.getState();
```

What `compileTracingPath()` returns:

```ts
type PreparedTracingPath = {
  strokes: Array<{
    samples: Array<{
      x: number;
      y: number;
      tangent: Point;
      distanceAlongStroke: number;
    }>;
    totalLength: number;
    isDot: boolean;
  }>;
  guides: LetterGuides;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
};
```

Example prepared tracing data:

```ts
{
  strokeCount: 2,
  firstStroke: {
    totalLength: 407.14,
    sampleCount: 35,
    isDot: false
  }
}
```

`TracingSession` is a small state machine:

```ts
type TracingState = {
  status: "idle" | "tracing" | "await_pen_up" | "complete";
  cursorPoint: Point;
  cursorTangent: Point;
  completedStrokes: number[];
  activeStrokeIndex: number;
  activeStrokeProgress: number;
  isPenDown: boolean;
};
```

Example session flow:

```ts
console.log(initial);
console.log(began);
console.log(afterUpdate);
```

```ts
{
  initial: {
    status: "idle",
    cursorPoint: { x: 17.75, y: 364.18 },
    cursorTangent: { x: -0.16, y: 0.99 },
    completedStrokes: [],
    activeStrokeIndex: 0,
    activeStrokeProgress: 0,
    isPenDown: false
  },
  began: true,
  afterUpdate: {
    status: "tracing",
    cursorPoint: { x: 17.75, y: 364.18 },
    cursorTangent: { x: -0.16, y: 0.99 },
    completedStrokes: [],
    activeStrokeIndex: 0,
    activeStrokeProgress: 0,
    isPenDown: true
  }
}
```

Useful session methods:

- `session.getState()`
- `session.getPath()`
- `session.beginAt(point)`
- `session.update(point)`
- `session.end()`
- `session.reset()`

Tracing options:

- `sampleRate?: number`

Session options:

- `startTolerance?: number`
- `hitTolerance?: number`
- `maxAdvanceSamples?: number`
- `advanceBias?: number`

## Built-in letter data

The package also exports the built-in glyph dataset for advanced use cases.

```ts
import {
  createLetterId,
  getCursiveLetterVariant,
  letters,
  lettersById,
  lettersByVariantId,
  listAvailableLetters
} from "letterpaths";

const letterId = createLetterId("a", "entry-high");
const letter = getCursiveLetterVariant("a", "entry-high");
```

Example result:

```ts
letterId;
// "a-lower-cursive-entry-high"

letter?.glyph;
// {
//   char: "a",
//   case: "lower",
//   style: "cursive",
//   name: "traced lower a"
// }
```

Useful exports:

- `letters`: the default built-in letter list
- `lettersById`: built-in letters keyed by legacy ids such as `"a-lower-cursive"`
- `lettersByVariantId`: built-in letters keyed by variant ids such as `"a-lower-cursive-entry-high"`
- `listAvailableLetters()`: built-in letters as an array
- `getCursiveLetterVariant(char, entryVariant)`
- `createLetterId(char, entryVariant)`
- `createLegacyLetterId(char)`
- `defaultCursiveEntryVariant`
- `cursiveEntryVariantByExitVariant`
- `cursiveExitVariantByLetter`

If you want to use your own glyphs, pass a `Record<string, BezierLetter>` as the `letters` option to `buildHandwritingPath()` or the style-specific builders.

For best results, key that map by the same ids the built-in dataset uses, for example:

- `"a-lower-cursive-entry-low"`
- `"a-lower-cursive-entry-high"`
- `"a-lower-cursive"` for legacy lookup

## Important types

```ts
type LetterGuides = {
  xHeight: number;
  baseline: number;
  ascender?: number;
  descender?: number;
  leftSidebearing?: number;
  rightSidebearing?: number;
};

type JoinSpacingOptions = {
  verticalDistanceWeight?: number;
  angleChangeWeight?: number;
  kerningScale?: number;
  minSidebearingGap?: number;
  angleDifferenceWeight?: number;
  bendReversalWeight?: number;
};

type BezierLetter = {
  schemaVersion: string;
  glyph: {
    char: string;
    case: "upper" | "lower";
    style: "print" | "cursive";
    name?: string;
  };
  guides?: LetterGuides;
  strokes: LetterStroke[];
};
```

## Export summary

Most users only need these:

- `buildHandwritingPath`
- `compileAnimation`
- `compileTracingPath`
- `TracingSession`

For lower-level control, the package also exports:

- `buildPrintWord`
- `buildPreCursiveWord`
- `joinCursiveWord`
- `CubicBezier`
- built-in letter data and lookup helpers
- all core public types
