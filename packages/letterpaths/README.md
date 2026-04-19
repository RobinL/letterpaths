# letterpaths

`letterpaths` is a headless TypeScript library for generating handwriting geometry.

It does not render anything itself. You give it text and options, and it gives you back pure data:

- `WritingPath` objects for rendering
- `AnimationPlayer` objects for pen-motion playback
- tracing data and session state for "follow the line" interactions
- renderer-agnostic formation annotations such as arrows and draw-order numbers
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

Example prepared tracing data:

```ts
{
  strokeCount: 2,
  firstStroke: {
    totalLength: 407.14,
    sampleCount: 35,
    isDot: false
  },
  firstBoundary: {
    overallDistance: 221.6,
    previousSegment: "descender",
    nextSegment: "ascender",
    incomingTangent: { x: 0.01, y: 1 },
    outgoingTangent: { x: -0.01, y: -1 },
    turnAngleDegrees: 179.8
  }
}
```

`boundaries` marks authored curve boundaries inside the flattened tracing path. This is useful when you want to place waypoints or detect true retrace points at semantic turning points rather than at arbitrary sample positions. The incoming and outgoing tangents make each boundary self-describing for consumers that need to know how to face immediately before and after the turn.

### Retrace group analysis

This is optional and intended for more advanced behaviors such as waypoint placement, segment-aware collectibles, or other game logic layered on top of tracing.

Use `analyzeTracingGroups()` when you want to split a tracing path into contiguous groups, for example to place collectibles only up to the next retrace point.

```ts
import {
  analyzeTracingGroups,
  buildHandwritingPath,
  compileTracingPath
} from "letterpaths";

const path = buildHandwritingPath("p", { style: "cursive" });
const prepared = compileTracingPath(path);
const analysis = analyzeTracingGroups(prepared, {
  retraceTurnAngleThreshold: 150,
  minOverlapLength: 60
});
```

`analysis.groups` gives you contiguous path ranges split at confirmed retrace points.

It returns:

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

Example:

```ts
{
  totalLength: 2255.87,
  groups: [
    {
      index: 0,
      startDistance: 0,
      endDistance: 706.24,
      startPoint: { x: 12.51, y: 320.37 },
      endPoint: { x: 0.93, y: 1026.38 },
      kind: "base"
    },
    {
      index: 1,
      startDistance: 706.24,
      endDistance: 2255.87,
      startPoint: { x: 0.93, y: 1026.38 },
      endPoint: { x: 5.79, y: 655.76 },
      kind: "retrace",
      matchedEarlierDistance: 609.96
    }
  ]
}
```

`analyzeTracingGroups()` looks for authored segment boundaries with a strong turn angle, then confirms that the following path substantially overlaps the earlier path. This avoids splitting at ordinary cusps like `v` or `w`, while still detecting true retracing such as a downstroke followed by an upstroke over the same corridor.

### Formation annotations

Use `compileFormationAnnotations()` when you want renderer-agnostic formation hints for handwriting. It returns pure geometry and metadata that a consumer can draw in SVG, Canvas, React Native, or any other renderer.

The annotation kinds are:

- `turning-point`: a retrace U-turn arrow for places where cursive formation doubles back through the same corridor
- `start-arrow`: a forward arrow at the start of each tracing section
- `draw-order-number`: a number at the start of each tracing section
- `midpoint-arrow`: one or more directional arrows inside a tracing section

In this API, a `TracingSection` is the next user-facing tracing range. Sections start at the beginning of the path, after drawable-stroke discontinuities, and at confirmed retrace restart points.

```ts
import {
  buildHandwritingPath,
  compileFormationAnnotations,
  compileTracingPath,
  annotationCommandsToSvgPathData
} from "letterpaths";

const path = buildHandwritingPath("sys", { style: "cursive" });
const prepared = compileTracingPath(path);
const annotations = compileFormationAnnotations(prepared, {
  turningPoints: {
    offset: 13,
    stemLength: 46
  },
  startArrows: {
    offset: 13
  },
  midpointArrows: {
    density: 320,
    offset: 13
  }
});

const firstArrow = annotations.find(
  (annotation) => annotation.kind === "start-arrow"
);
const svgPathData = annotationCommandsToSvgPathData(firstArrow?.commands ?? []);
```

The returned union is:

```ts
type FormationAnnotation =
  | TurningPointAnnotation
  | StartArrowAnnotation
  | DrawOrderNumberAnnotation
  | MidpointArrowAnnotation;

type TurningPointAnnotation = {
  kind: "turning-point";
  turnKind: "retrace-u-turn";
  commands: AnnotationPathCommand[];
  head?: AnnotationArrowHead;
  source: AnnotationSource & {
    previousSectionIndex: number;
    previousGroupIndex: number;
    groupIndex: number;
    turnDistance: number;
    matchedEarlierDistance?: number;
  };
  metrics: {
    offset: number;
    incomingStemLength: number;
    outgoingStemLength: number;
    headLength?: number;
    headWidth?: number;
    tipExtension?: number;
  };
};

type StartArrowAnnotation = {
  kind: "start-arrow";
  commands: AnnotationPathCommand[];
  head?: AnnotationArrowHead;
  anchor: Point;
  direction: Point;
  source: AnnotationSource & { distance: number };
};

type DrawOrderNumberAnnotation = {
  kind: "draw-order-number";
  value: number;
  text: string;
  point: Point;
  anchor: Point;
  direction: Point;
  source: AnnotationSource & { distance: number };
};

type MidpointArrowAnnotation = {
  kind: "midpoint-arrow";
  commands: AnnotationPathCommand[];
  head?: AnnotationArrowHead;
  anchor: Point;
  direction: Point;
  source: AnnotationSource & {
    distance: number;
    ordinalInSection: number;
    countInSection: number;
  };
};

type AnnotationSource = {
  sectionIndex: number;
  strokeIndex: number;
  startDistance: number;
  endDistance: number;
};

type AnnotationArrowHead = {
  tip: Point;
  direction: Point;
  polygon: Point[];
};

type AnnotationPathCommand =
  | { type: "move"; to: Point }
  | { type: "line"; to: Point }
  | { type: "cubic"; cp1: Point; cp2: Point; to: Point };
```

`turningPoints.offset` controls the perpendicular distance from the handwriting centreline, which determines the U-turn radius. Defaults are scaled from the guide height (`baseline - xHeight`) so annotations stay proportional when the writing path is scaled.

For `startArrows` and `midpointArrows`, `offset` moves arrows into a lane beside the handwriting centreline. Because the offset is relative to each arrow's tangent, arrows travelling in opposite directions move to opposite sides of the path. This is useful for overlapping/retraced strokes, where centreline arrows would draw on top of each other.

`turningPoints.stemLength` controls the straight section outside the U-turn cap. A single number applies to both sides, or you can pass `{ incoming, outgoing }`. Requested stem lengths are clamped to the available tracing group distance.

`midpointArrows.density` is a length threshold. If a tracing section is longer than `x`, it receives one midpoint arrow; longer than `2x`, two arrows; longer than `3x`, three arrows; and so on. The arrows are then placed at fractional midpoints: one at `1/2`, two at `1/3` and `2/3`, three at `1/4`, `2/4`, and `3/4`.

The arrow body commands end at the computed arrow path endpoint. `head.tipExtension` moves the head tip forward along the local end direction so a thick stroked body sits under the head instead of blunting it.

If you already have tracing sections, pass them in to avoid recalculating:

```ts
import { analyzeTracingSections, compileFormationAnnotations } from "letterpaths";

const sectionAnalysis = analyzeTracingSections(prepared);
const annotations = compileFormationAnnotations(prepared, {
  sections: sectionAnalysis.sections,
  drawOrderNumbers: false
});
```

`compileFormationArrows()` remains available as a compatibility helper for callers that only want the original retrace U-turn arrows:

```ts
import {
  compileFormationArrows,
  formationArrowCommandsToSvgPathData
} from "letterpaths";

const formationArrows = compileFormationArrows(prepared, {
  retraceTurns: {
    groups: analysis.groups,
    offset: 13,
    stemLength: { incoming: 42, outgoing: 46 },
    head: { length: 26, width: 22, tipExtension: 11 }
  }
});

const svgPathData = formationArrowCommandsToSvgPathData(
  formationArrows[0]?.commands ?? []
);
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

Retrace group analysis options:

- `proximityThreshold?: number`
- `minOverlapLength?: number`
- `minPathSeparation?: number`
- `requireOpposingDirection?: boolean`
- `oppositeDirectionDotThreshold?: number`
- `retraceTurnAngleThreshold?: number`
- `boundaryLookbackDistance?: number`

Formation annotation options:

- `sections?: TracingSection[]`
- `sectionAnalysis?: AnalyzeTracingSectionsOptions`
- `turningPoints?: false | TurningPointAnnotationOptions`
- `startArrows?: false | StartArrowAnnotationOptions`
- `drawOrderNumbers?: false | DrawOrderNumberAnnotationOptions`
- `midpointArrows?: false | MidpointArrowAnnotationOptions`
- `offset?: number` on arrow options, for lane placement beside the handwriting centreline
- `density?: number` on midpoint arrows, as the path-length threshold for each arrow
- `head?: false | { length?: number; width?: number; tipExtension?: number }`

Legacy formation arrow options:

- `retraceTurns?: false | RetraceTurnArrowOptions`
- `offset?: number`
- `stemLength?: number | { incoming?: number; outgoing?: number }`
- `head?: false | { length?: number; width?: number; tipExtension?: number }`
- `groupAnalysis?: AnalyzeTracingGroupsOptions`
- `groups?: TracingGroup[]`

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
- `analyzeTracingGroups`
- `analyzeTracingSections`
- `compileFormationAnnotations`
- `compileFormationArrows`
- `TracingSession`

For lower-level control, the package also exports:

- `buildPrintWord`
- `buildPreCursiveWord`
- `joinCursiveWord`
- `CubicBezier`
- `annotationCommandsToSvgPathData`
- `formationArrowCommandsToSvgPathData`
- built-in letter data and lookup helpers
- all core public types
