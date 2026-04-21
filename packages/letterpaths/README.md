# letterpaths

`letterpaths` is a headless TypeScript library for generating handwriting geometry.

It does not render anything itself. You give it text and options, and it returns pure data for:

- handwriting paths built from cubic Beziers
- pen-motion animation
- tracing preparation and session state
- retrace-group and tracing-section analysis
- formation annotations such as start arrows, directional dashes, and draw-order numbers
- built-in glyph data and variant lookup helpers

## Main entrypoint

`buildHandwritingPath()` is the main high-level API:

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

It returns a `WritingPath`:

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

`strokes` is the main payload. Each stroke contains one or more `CubicBezier` objects that you can render however you want.

## Layout API

### `buildHandwritingPath(text, options)`

This switches between print, pre-cursive, and cursive output.

```ts
import { buildHandwritingPath } from "letterpaths";

const path = buildHandwritingPath("cat dog", {
  style: "cursive",
  targetGuides: {
    xHeight: 360,
    baseline: 720
  },
  joinSpacing: {
    minSidebearingGap: 50,
    targetBendRate: 30
  },
  wordSpacing: 540
});
```

`BuildHandwritingOptions`:

- `style?: "print" | "pre-cursive" | "cursive"` defaults to `"cursive"`
- `letters?: Record<string, BezierLetter>` overrides the built-in glyph map
- `targetGuides?: LetterGuides` rescales the output onto your guide system
- `wordSpacing?: number` overrides the spacing used for spaces
- `joinSpacing?: JoinSpacingOptions` tunes cursive joins
- `keepInitialLeadIn?: boolean` keeps the first letter's lead-in in cursive output
- `keepFinalLeadOut?: boolean` keeps the last letter's lead-out in cursive output

Notes:

- `joinSpacing`, `keepInitialLeadIn`, and `keepFinalLeadOut` only affect cursive joining
- `joinMetrics` is only populated for cursive output
- unknown characters are skipped rather than throwing
- deferred strokes are preserved in `WritingPath.strokes` and are useful for dots and similar marks

### Style-specific builders

The style-specific builders are exported too:

```ts
import {
  buildPrintWord,
  buildPreCursiveWord,
  joinCursiveWord
} from "letterpaths";

const printPath = buildPrintWord("cat");
const preCursivePath = buildPreCursiveWord("cat");
const cursivePath = joinCursiveWord("cat", {
  keepInitialLeadIn: true,
  keepFinalLeadOut: true
});
```

The package also exports spacing defaults and helpers used by the layout layer:

- `printLetterSpacing`
- `preCursiveLetterSpacing`
- `cursiveLetterSpacing`
- `defaultJoinSpacingOptions`
- `listAvailableLetters()`

## Working with curves

`WritingPath` strokes contain `CubicBezier` instances, not SVG strings:

```ts
import { buildHandwritingPath } from "letterpaths";

const path = buildHandwritingPath("a");
const curve = path.strokes[0]?.curves[0];

if (curve) {
  console.log({
    point: curve.getPointAt(0.5),
    tangent: curve.getTangentAt(0.5),
    length: curve.length()
  });
}
```

`CubicBezier` methods:

- `getPointAt(t)`
- `getTangentAt(t)`
- `length(steps?)`
- `getPointAtLength(distance)`
- `getTAtLength(distance, steps?)`

## Animation API

Use `compileAnimation()` to turn a `WritingPath` into a time-based player:

```ts
import { buildHandwritingPath, compileAnimation } from "letterpaths";

const path = buildHandwritingPath("hi", { style: "pre-cursive" });
const player = compileAnimation(path, {
  speed: 1.8,
  penUpSpeed: 2.2,
  strokeDelayMs: 0,
  deferredDelayMs: 120
});

console.log(player.totalDuration);
console.log(player.getFrame(120));
```

`AnimationOptions`:

- `speed?: number`
- `penUpSpeed?: number`
- `minLiftDistance?: number`
- `strokeDelayMs?: number`
- `deferredDelayMs?: number`

`AnimationFrame`:

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

When the player is in a pen-up lift or pause, `activeStrokeIndex` is `-1`.

## Tracing API

Tracing has two layers:

1. `compileTracingPath()` converts a `WritingPath` into evenly sampled strokes
2. `TracingSession` manages pointer-driven progress through that prepared path

```ts
import {
  buildHandwritingPath,
  compileTracingPath,
  TracingSession
} from "letterpaths";

const path = buildHandwritingPath("i", { style: "cursive" });
const prepared = compileTracingPath(path, { sampleRate: 12 });
const session = new TracingSession(prepared, {
  startTolerance: 30
});

const started = session.beginAt(session.getState().cursorPoint);
if (started) {
  session.update(session.getState().cursorPoint);
  session.end();
}
```

`CompileOptions`:

- `sampleRate?: number` distance between samples in pixels, default `2`

`PreparedTracingPath`:

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
  boundaries: Array<{
    overallDistance: number;
    point: Point;
    previousSegment?: WritingPathSegment;
    nextSegment?: WritingPathSegment;
    incomingTangent: Point;
    outgoingTangent: Point;
    turnAngleDegrees: number;
  }>;
  guides: LetterGuides;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
};
```

`compileTracingPath()` ignores `WritingPath` strokes whose type is `"lift"`.

### `TracingSession`

`TracingSession` methods:

- `getState()`
- `getPath()`
- `beginAt(point)`
- `update(point)`
- `end()`
- `reset()`

`TracingSessionOptions`:

- `startTolerance?: number`
- `hitTolerance?: number`
- `maxAdvanceSamples?: number`
- `advanceBias?: number`

`TracingState.status` is one of:

- `"idle"`
- `"tracing"`
- `"await_pen_up"`
- `"complete"`

Dots are auto-completed when `beginAt()` starts on a dot stroke.

## Retrace groups and tracing sections

For higher-level tracing logic, the package exports two analysis layers:

- `analyzeTracingGroups(prepared, options)` splits the traced path into contiguous `"base"` and `"retrace"` groups
- `analyzeTracingSections(prepared, options)` splits the path into user-facing tracing sections starting at the path start, stroke starts, and retrace turns

```ts
import {
  analyzeTracingGroups,
  analyzeTracingSections,
  buildHandwritingPath,
  compileTracingPath
} from "letterpaths";

const prepared = compileTracingPath(buildHandwritingPath("p"));

const groups = analyzeTracingGroups(prepared);
const sections = analyzeTracingSections(prepared);
```

`TracingGroup`:

```ts
type TracingGroup = {
  index: number;
  startDistance: number;
  endDistance: number;
  startPoint: Point;
  endPoint: Point;
  kind: "base" | "retrace";
  matchedEarlierDistance?: number;
};
```

`TracingSection`:

```ts
type TracingSection = {
  index: number;
  strokeIndex: number;
  groupIndex?: number;
  startDistance: number;
  endDistance: number;
  startPoint: Point;
  endPoint: Point;
  startTangent: Point;
  endTangent: Point;
  startReason: "path-start" | "stroke-start" | "retrace-turn";
  kind: "base" | "retrace";
  matchedEarlierDistance?: number;
};
```

## Formation annotations

`compileFormationAnnotations()` returns renderer-agnostic formation hints for a prepared tracing path.

```ts
import {
  annotationCommandsToSvgPathData,
  buildHandwritingPath,
  compileFormationAnnotations,
  compileTracingPath
} from "letterpaths";

const prepared = compileTracingPath(buildHandwritingPath("sys"));
const annotations = compileFormationAnnotations(prepared, {
  directionalDashes: {
    spacing: 80,
    length: 60
  },
  startArrows: {
    offset: 13
  },
  midpointArrows: {
    density: 320,
    offset: 13
  }
});

const firstArrow = annotations.find((item) => item.kind === "start-arrow");
const svgPathData = annotationCommandsToSvgPathData(firstArrow?.commands ?? []);
```

Available annotation kinds:

- `turning-point`
- `start-arrow`
- `draw-order-number`
- `midpoint-arrow`
- `directional-dash`

Important defaults:

- `turningPoints`, `drawOrderNumbers`, `startArrows`, and `midpointArrows` are enabled unless set to `false`
- `directionalDashes` is opt-in and only generated when you pass options for it

`CompileFormationAnnotationsOptions`:

- `sections?: TracingSection[]`
- `sectionAnalysis?: AnalyzeTracingSectionsOptions`
- `directionalDashes?: false | DirectionalDashAnnotationOptions`
- `turningPoints?: false | TurningPointAnnotationOptions`
- `startArrows?: false | StartArrowAnnotationOptions`
- `drawOrderNumbers?: false | DrawOrderNumberAnnotationOptions`
- `midpointArrows?: false | MidpointArrowAnnotationOptions`

If you only want the older retrace U-turn arrows, `compileFormationArrows()` is still exported:

```ts
import {
  buildHandwritingPath,
  compileFormationArrows,
  compileTracingPath,
  formationArrowCommandsToSvgPathData
} from "letterpaths";

const prepared = compileTracingPath(buildHandwritingPath("p"));
const arrows = compileFormationArrows(prepared);
const pathData = formationArrowCommandsToSvgPathData(arrows[0]?.commands ?? []);
```

## Built-in glyph data

The package exports the built-in lowercase cursive dataset and its variant helpers from `src/data`.

Useful exports:

- `letters`
- `lettersById`
- `lettersByVariantId`
- `getCursiveLetterVariant(char, entryVariant?)`
- `createLetterId(char, entryVariant?)`
- `createLegacyLetterId(char)`
- `defaultCursiveEntryVariant`
- `cursiveEntryVariantByExitVariant`
- `cursiveExitVariantByLetter`

The built-in data currently covers lowercase `a-z` in two cursive entry variants:

- `"entry-low"`
- `"entry-high"`

`print` and `pre-cursive` output are produced from this same underlying cursive data by filtering which entry and exit segments are kept.

## Export surface

The package root exports:

- all public types from `src/types.ts`
- `CubicBezier`
- the layout builders and layout option types
- animation APIs
- tracing APIs
- annotation APIs
- built-in data helpers

If you want the most stable way to discover the package surface in code, check [`src/index.ts`](./src/index.ts).
