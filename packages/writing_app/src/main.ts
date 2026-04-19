import "./style.css";
import {
  AnimationPlayer,
  TracingSession,
  annotationCommandsToSvgPathData,
  compileFormationAnnotations,
  compileTracingPath,
  type AnnotationPathCommand,
  type FormationAnnotation,
  type Point,
  type PreparedTracingPath,
  type TracingState,
  type WritingPath
} from "letterpaths";
import {
  DEMO_PAUSE_MS,
  DEFAULT_TRACE_TOLERANCE,
  MAX_TRACE_TOLERANCE,
  MIN_TRACE_TOLERANCE,
  TRACE_TOLERANCE_STEP,
  WORDS,
  buildPathD,
  buildShiftedWordLayout,
  chooseNextWordIndex,
  getPointerInSvg
} from "./shared";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app element for writing app.");
}

app.innerHTML = `
  <div class="writing-app">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar">
          <div class="writing-app__title">
            <p class="writing-app__eyebrow">Trace this word</p>
            <h1 class="writing-app__word" id="word-label"></h1>
            <label class="writing-app__word-input-label" for="word-input">
              <span>Word</span>
              <input
                class="writing-app__word-input"
                id="word-input"
                type="text"
                value="zephyr"
                autocomplete="off"
                spellcheck="false"
              />
            </label>
          </div>
          <div class="writing-app__controls">
            <label class="writing-app__tolerance" for="tolerance-slider">
              <span class="writing-app__tolerance-label">
                Tolerance
                <span class="writing-app__tolerance-value" id="tolerance-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="tolerance-slider"
                type="range"
                min="${MIN_TRACE_TOLERANCE}"
                max="${MAX_TRACE_TOLERANCE}"
                step="${TRACE_TOLERANCE_STEP}"
                value="${DEFAULT_TRACE_TOLERANCE}"
              />
            </label>
            <label class="writing-app__tolerance" for="midpoint-density-slider">
              <span class="writing-app__tolerance-label">
                Midpoint density
                <span class="writing-app__tolerance-value" id="midpoint-density-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="midpoint-density-slider"
                type="range"
                min="120"
                max="600"
                step="20"
                value="320"
              />
            </label>
            <label class="writing-app__tolerance" for="turn-radius-slider">
              <span class="writing-app__tolerance-label">
                Turn radius
                <span class="writing-app__tolerance-value" id="turn-radius-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="turn-radius-slider"
                type="range"
                min="0"
                max="48"
                step="1"
                value="13"
              />
            </label>
            <label class="writing-app__tolerance" for="number-offset-slider">
              <span class="writing-app__tolerance-label">
                Number offset
                <span class="writing-app__tolerance-value" id="number-offset-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="number-offset-slider"
                type="range"
                min="-80"
                max="80"
                step="1"
                value="0"
              />
            </label>
            <fieldset class="writing-app__annotation-controls" aria-label="Formation annotations">
              <label class="writing-app__annotation-toggle">
                <input type="checkbox" data-annotation-kind="turning-point" checked />
                <span>Turns</span>
              </label>
              <label class="writing-app__annotation-toggle">
                <input type="checkbox" data-annotation-kind="start-arrow" checked />
                <span>Starts</span>
              </label>
              <label class="writing-app__annotation-toggle">
                <input type="checkbox" data-annotation-kind="draw-order-number" checked />
                <span>Numbers</span>
              </label>
              <label class="writing-app__annotation-toggle">
                <input type="checkbox" data-annotation-kind="midpoint-arrow" checked />
                <span>Midpoints</span>
              </label>
              <label class="writing-app__annotation-toggle">
                <input id="offset-arrow-lanes" type="checkbox" checked />
                <span>Offset lanes</span>
              </label>
              <label class="writing-app__annotation-color" for="arrow-color-picker">
                <span>Arrow colour</span>
                <input id="arrow-color-picker" type="color" value="#ffffff" />
              </label>
            </fieldset>
          </div>
          <button class="writing-app__button" id="show-me-button" type="button">
            Show me
          </button>
        </header>

        <svg
          class="writing-app__svg"
          id="trace-svg"
          viewBox="0 0 1600 900"
          aria-label="Handwriting tracing area"
        ></svg>

        <div class="writing-app__overlay" id="success-overlay" hidden>
          <div class="writing-app__success-card">
            <p class="writing-app__success-eyebrow">Well done!</p>
            <button class="writing-app__button writing-app__button--next" id="next-word-button" type="button">
              Next word
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
`;

const wordLabel = document.querySelector<HTMLHeadingElement>("#word-label");
const wordInput = document.querySelector<HTMLInputElement>("#word-input");
const traceSvg = document.querySelector<SVGSVGElement>("#trace-svg");
const showMeButton = document.querySelector<HTMLButtonElement>("#show-me-button");
const successOverlay = document.querySelector<HTMLDivElement>("#success-overlay");
const nextWordButton = document.querySelector<HTMLButtonElement>("#next-word-button");
const toleranceSlider = document.querySelector<HTMLInputElement>("#tolerance-slider");
const toleranceValue = document.querySelector<HTMLSpanElement>("#tolerance-value");
const midpointDensitySlider = document.querySelector<HTMLInputElement>("#midpoint-density-slider");
const midpointDensityValue = document.querySelector<HTMLSpanElement>("#midpoint-density-value");
const turnRadiusSlider = document.querySelector<HTMLInputElement>("#turn-radius-slider");
const turnRadiusValue = document.querySelector<HTMLSpanElement>("#turn-radius-value");
const numberOffsetSlider = document.querySelector<HTMLInputElement>("#number-offset-slider");
const numberOffsetValue = document.querySelector<HTMLSpanElement>("#number-offset-value");
const offsetArrowLanesToggle = document.querySelector<HTMLInputElement>("#offset-arrow-lanes");
const arrowColorPicker = document.querySelector<HTMLInputElement>("#arrow-color-picker");
const annotationToggleEls = Array.from(
  document.querySelectorAll<HTMLInputElement>("[data-annotation-kind]")
);

if (
  !wordLabel ||
  !wordInput ||
  !traceSvg ||
  !showMeButton ||
  !successOverlay ||
  !nextWordButton ||
  !toleranceSlider ||
  !toleranceValue ||
  !midpointDensitySlider ||
  !midpointDensityValue ||
  !turnRadiusSlider ||
  !turnRadiusValue ||
  !numberOffsetSlider ||
  !numberOffsetValue ||
  !offsetArrowLanesToggle ||
  !arrowColorPicker ||
  annotationToggleEls.length === 0
) {
  throw new Error("Missing elements for writing app.");
}

let currentWordIndex = -1;
let currentWord = "zephyr";
let currentPath: WritingPath | null = null;
let tracingSession: TracingSession | null = null;
let preparedTracingPath: PreparedTracingPath | null = null;
let activePointerId: number | null = null;
let traceRenderQueued = false;
let traceStrokeEls: SVGPathElement[] = [];
let traceStrokeLengths: number[] = [];
let traceCursorEl: SVGGElement | null = null;
let demoStrokeEls: SVGPathElement[] = [];
let demoStrokeLengths: number[] = [];
let demoNibEl: SVGCircleElement | null = null;
let demoAnimationFrameId: number | null = null;
let isDemoPlaying = false;
let currentTraceTolerance = DEFAULT_TRACE_TOLERANCE;
let currentMidpointDensity = 320;
let currentTurnRadius = 13;
let currentNumberPathOffset = 0;
let shouldOffsetArrowLanes = true;
let currentArrowColor = "#ffffff";
let annotationVisibility: Record<FormationAnnotation["kind"], boolean> = {
  "turning-point": true,
  "start-arrow": true,
  "draw-order-number": true,
  "midpoint-arrow": true
};

const TRACE_CURSOR_TURN_COMMIT_DISTANCE = 12;
const TRACE_CURSOR_TURN_LOOKAHEAD_DISTANCE = 2;
const SECTION_ARROWHEAD_LENGTH = 26;
const SECTION_ARROWHEAD_WIDTH = 22;
const SECTION_ARROWHEAD_TIP_OVERHANG = 11;
const ANNOTATION_COLLISION_SAMPLE_STEP = 4;
const ANNOTATION_STROKE_WIDTH = 6.5;
const ANNOTATION_STROKE_HALF_WIDTH = ANNOTATION_STROKE_WIDTH / 2;

type ArrowAnnotation = Extract<FormationAnnotation, { commands: AnnotationPathCommand[] }>;
type StraightArrowAnnotation = Extract<
  FormationAnnotation,
  { kind: "start-arrow" | "midpoint-arrow" }
>;
type TurningPointAnnotation = Extract<FormationAnnotation, { kind: "turning-point" }>;
type DrawOrderNumberAnnotation = Extract<FormationAnnotation, { kind: "draw-order-number" }>;
type PreparedPoseBias = "forward" | "backward" | "center";

type TurningPointRelocation = {
  annotation: TurningPointAnnotation;
  distanceShift: number;
  targetDistance: number;
  targetPose: {
    point: Point;
    tangent: Point;
  };
};

type AnnotationCollisionShape = {
  pathPoints: Point[];
  headPolygon?: Point[];
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
};

const buildSvgPoints = (points: Point[]): string =>
  points.map((point) => `${point.x} ${point.y}`).join(" ");

const escapeSvgText = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const syncToleranceLabel = () => {
  toleranceValue.textContent = `${currentTraceTolerance}px`;
};

const syncMidpointDensityLabel = () => {
  midpointDensityValue.textContent = `1 per ${currentMidpointDensity}px`;
};

const syncTurnRadiusLabel = () => {
  turnRadiusValue.textContent = `${currentTurnRadius}px`;
};

const syncNumberOffsetLabel = () => {
  numberOffsetValue.textContent = `${currentNumberPathOffset}px`;
};

const normalizeArrowColor = (value: string): string | null =>
  /^#[0-9a-fA-F]{6}$/.test(value) ? value.toLowerCase() : null;

const getAnnotationClassName = (annotation: FormationAnnotation): string =>
  `writing-app__section-arrow writing-app__section-arrow--formation writing-app__section-arrow--${annotation.kind}`;

const isStraightArrowAnnotation = (
  annotation: FormationAnnotation
): annotation is StraightArrowAnnotation =>
  annotation.kind === "start-arrow" || annotation.kind === "midpoint-arrow";

const isTurningPointAnnotation = (
  annotation: FormationAnnotation
): annotation is TurningPointAnnotation => annotation.kind === "turning-point";

const isDrawOrderNumberAnnotation = (
  annotation: FormationAnnotation
): annotation is DrawOrderNumberAnnotation => annotation.kind === "draw-order-number";

const getAnnotationPathDistance = (annotation: FormationAnnotation): number => {
  if ("distance" in annotation.source) {
    return annotation.source.distance;
  }

  return annotation.source.turnDistance;
};

const getTotalPreparedPathLength = (path: PreparedTracingPath): number =>
  path.strokes.reduce((sum, stroke) => sum + stroke.totalLength, 0);

const interpolatePreparedSamplePoint = (
  samples: PreparedTracingPath["strokes"][number]["samples"],
  distanceAlongStroke: number
): Point => {
  if (samples.length === 0) {
    return { x: 0, y: 0 };
  }

  for (let index = 1; index < samples.length; index += 1) {
    const previous = samples[index - 1];
    const current = samples[index];
    if (!previous || !current) {
      continue;
    }

    if (current.distanceAlongStroke >= distanceAlongStroke) {
      const span = current.distanceAlongStroke - previous.distanceAlongStroke;
      const ratio = span > 0 ? (distanceAlongStroke - previous.distanceAlongStroke) / span : 0;
      return {
        x: previous.x + (current.x - previous.x) * ratio,
        y: previous.y + (current.y - previous.y) * ratio
      };
    }
  }

  const last = samples[samples.length - 1];
  return last ? { x: last.x, y: last.y } : { x: 0, y: 0 };
};

const getPreparedPointAtOverallDistance = (
  path: PreparedTracingPath,
  targetDistance: number
): Point => {
  let remaining = targetDistance;

  for (let index = 0; index < path.strokes.length; index += 1) {
    const stroke = path.strokes[index];
    if (!stroke) {
      continue;
    }

    if (remaining <= stroke.totalLength || index === path.strokes.length - 1) {
      return interpolatePreparedSamplePoint(
        stroke.samples,
        Math.max(0, Math.min(remaining, stroke.totalLength))
      );
    }

    remaining -= stroke.totalLength;
  }

  return { x: 0, y: 0 };
};

const normalizeVector = (vector: Point): Point => {
  const length = Math.hypot(vector.x, vector.y);
  return length > 0 ? { x: vector.x / length, y: vector.y / length } : { x: 1, y: 0 };
};

const getPreparedPoseAtOverallDistance = (
  path: PreparedTracingPath,
  targetDistance: number,
  bias: PreparedPoseBias = "center"
): { point: Point; tangent: Point } => {
  const totalLength = getTotalPreparedPathLength(path);
  const clampedDistance = Math.max(0, Math.min(targetDistance, totalLength));
  const point = getPreparedPointAtOverallDistance(path, clampedDistance);
  const delta = Math.min(8, Math.max(2, totalLength / 200));

  let fromDistance = Math.max(0, clampedDistance - delta);
  let toDistance = Math.min(totalLength, clampedDistance + delta);

  if (bias === "forward") {
    fromDistance = clampedDistance;
  } else if (bias === "backward") {
    toDistance = clampedDistance;
  }

  if (Math.abs(toDistance - fromDistance) < 0.001) {
    if (clampedDistance <= delta) {
      toDistance = Math.min(totalLength, clampedDistance + delta);
    } else {
      fromDistance = Math.max(0, clampedDistance - delta);
    }
  }

  const fromPoint = getPreparedPointAtOverallDistance(path, fromDistance);
  const toPoint = getPreparedPointAtOverallDistance(path, toDistance);

  return {
    point,
    tangent: normalizeVector({
      x: toPoint.x - fromPoint.x,
      y: toPoint.y - fromPoint.y
    })
  };
};

const getPointDistance = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y);

const getSquaredPointDistance = (a: Point, b: Point): number =>
  (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);

const interpolatePoint = (start: Point, end: Point, progress: number): Point => ({
  x: start.x + (end.x - start.x) * progress,
  y: start.y + (end.y - start.y) * progress
});

const offsetPosePoint = (pose: { point: Point; tangent: Point }, lateralOffset: number): Point => {
  const normal = { x: -pose.tangent.y, y: pose.tangent.x };
  return {
    x: pose.point.x + normal.x * lateralOffset,
    y: pose.point.y + normal.y * lateralOffset
  };
};

const rotateVector = (vector: Point, angleRadians: number): Point => {
  const cos = Math.cos(angleRadians);
  const sin = Math.sin(angleRadians);
  return {
    x: vector.x * cos - vector.y * sin,
    y: vector.x * sin + vector.y * cos
  };
};

const transformPoint = (
  point: Point,
  sourceAnchor: Point,
  targetAnchor: Point,
  angleRadians: number
): Point => {
  const rotated = rotateVector(
    {
      x: point.x - sourceAnchor.x,
      y: point.y - sourceAnchor.y
    },
    angleRadians
  );

  return {
    x: targetAnchor.x + rotated.x,
    y: targetAnchor.y + rotated.y
  };
};

const getCubicPoint = (
  start: Point,
  cp1: Point,
  cp2: Point,
  end: Point,
  progress: number
): Point => {
  const inverse = 1 - progress;
  const inverseSquared = inverse * inverse;
  const progressSquared = progress * progress;

  return {
    x:
      inverseSquared * inverse * start.x +
      3 * inverseSquared * progress * cp1.x +
      3 * inverse * progressSquared * cp2.x +
      progressSquared * progress * end.x,
    y:
      inverseSquared * inverse * start.y +
      3 * inverseSquared * progress * cp1.y +
      3 * inverse * progressSquared * cp2.y +
      progressSquared * progress * end.y
  };
};

const pushCollisionPoint = (points: Point[], point: Point) => {
  const previous = points[points.length - 1];
  if (!previous || getPointDistance(previous, point) > 0.25) {
    points.push(point);
  }
};

const sampleLineSegment = (start: Point, end: Point): Point[] => {
  const length = getPointDistance(start, end);
  const segmentCount = Math.max(1, Math.ceil(length / ANNOTATION_COLLISION_SAMPLE_STEP));
  const points: Point[] = [];

  for (let index = 1; index <= segmentCount; index += 1) {
    points.push(interpolatePoint(start, end, index / segmentCount));
  }

  return points;
};

const sampleAnnotationCommands = (commands: AnnotationPathCommand[]): Point[] => {
  const points: Point[] = [];
  let currentPoint: Point | null = null;

  commands.forEach((command) => {
    if (command.type === "move") {
      currentPoint = command.to;
      pushCollisionPoint(points, command.to);
      return;
    }

    if (!currentPoint) {
      currentPoint = command.to;
      pushCollisionPoint(points, command.to);
      return;
    }

    if (command.type === "line") {
      sampleLineSegment(currentPoint, command.to).forEach((point) =>
        pushCollisionPoint(points, point)
      );
      currentPoint = command.to;
      return;
    }

    const controlPolygonLength =
      getPointDistance(currentPoint, command.cp1) +
      getPointDistance(command.cp1, command.cp2) +
      getPointDistance(command.cp2, command.to);
    const segmentCount = Math.max(
      3,
      Math.ceil(controlPolygonLength / ANNOTATION_COLLISION_SAMPLE_STEP)
    );

    for (let index = 1; index <= segmentCount; index += 1) {
      pushCollisionPoint(
        points,
        getCubicPoint(currentPoint, command.cp1, command.cp2, command.to, index / segmentCount)
      );
    }
    currentPoint = command.to;
  });

  return points;
};

const getAnnotationCollisionShape = (annotation: ArrowAnnotation): AnnotationCollisionShape => {
  const pathPoints = sampleAnnotationCommands(annotation.commands);
  const headPolygon = annotation.head?.polygon;
  const points = [...pathPoints, ...(headPolygon ?? [])];

  const bounds = points.reduce(
    (currentBounds, point) => ({
      minX: Math.min(currentBounds.minX, point.x),
      minY: Math.min(currentBounds.minY, point.y),
      maxX: Math.max(currentBounds.maxX, point.x),
      maxY: Math.max(currentBounds.maxY, point.y)
    }),
    {
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY
    }
  );

  return {
    pathPoints,
    ...(headPolygon ? { headPolygon } : {}),
    bounds
  };
};

const doBoundsOverlap = (
  a: AnnotationCollisionShape["bounds"],
  b: AnnotationCollisionShape["bounds"],
  padding: number
): boolean =>
  a.minX <= b.maxX + padding &&
  a.maxX + padding >= b.minX &&
  a.minY <= b.maxY + padding &&
  a.maxY + padding >= b.minY;

const getPointToSegmentDistance = (point: Point, start: Point, end: Point): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return getPointDistance(point, start);
  }

  const progress = Math.max(
    0,
    Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared)
  );
  return getPointDistance(point, {
    x: start.x + dx * progress,
    y: start.y + dy * progress
  });
};

const getPointToPolygonEdgeDistance = (point: Point, polygon: Point[]): number =>
  polygon.reduce((minDistance, start, index) => {
    const end = polygon[(index + 1) % polygon.length];
    if (!end) {
      return minDistance;
    }

    return Math.min(minDistance, getPointToSegmentDistance(point, start, end));
  }, Number.POSITIVE_INFINITY);

const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
  let inside = false;

  for (
    let index = 0, previousIndex = polygon.length - 1;
    index < polygon.length;
    previousIndex = index, index += 1
  ) {
    const current = polygon[index];
    const previous = polygon[previousIndex];
    if (!current || !previous) {
      continue;
    }

    const intersects =
      current.y > point.y !== previous.y > point.y &&
      point.x <
      ((previous.x - current.x) * (point.y - current.y)) / (previous.y - current.y) +
      current.x;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
};

const getOrientation = (a: Point, b: Point, c: Point): number =>
  (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);

const isPointOnSegment = (point: Point, start: Point, end: Point): boolean =>
  point.x <= Math.max(start.x, end.x) &&
  point.x >= Math.min(start.x, end.x) &&
  point.y <= Math.max(start.y, end.y) &&
  point.y >= Math.min(start.y, end.y);

const doSegmentsIntersect = (aStart: Point, aEnd: Point, bStart: Point, bEnd: Point): boolean => {
  const o1 = getOrientation(aStart, aEnd, bStart);
  const o2 = getOrientation(aStart, aEnd, bEnd);
  const o3 = getOrientation(bStart, bEnd, aStart);
  const o4 = getOrientation(bStart, bEnd, aEnd);

  if (o1 * o2 < 0 && o3 * o4 < 0) {
    return true;
  }

  return (
    (Math.abs(o1) < 0.001 && isPointOnSegment(bStart, aStart, aEnd)) ||
    (Math.abs(o2) < 0.001 && isPointOnSegment(bEnd, aStart, aEnd)) ||
    (Math.abs(o3) < 0.001 && isPointOnSegment(aStart, bStart, bEnd)) ||
    (Math.abs(o4) < 0.001 && isPointOnSegment(aEnd, bStart, bEnd))
  );
};

const doPolygonsOverlap = (a: Point[], b: Point[]): boolean => {
  if (a.length < 3 || b.length < 3) {
    return false;
  }

  const edgesIntersect = a.some((aStart, aIndex) => {
    const aEnd = a[(aIndex + 1) % a.length];
    return (
      !!aEnd &&
      b.some((bStart, bIndex) => {
        const bEnd = b[(bIndex + 1) % b.length];
        return !!bEnd && doSegmentsIntersect(aStart, aEnd, bStart, bEnd);
      })
    );
  });

  return (
    edgesIntersect ||
    isPointInPolygon(a[0] as Point, b) ||
    isPointInPolygon(b[0] as Point, a)
  );
};

const doPathStrokesOverlap = (aPoints: Point[], bPoints: Point[]): boolean => {
  const overlapDistanceSquared = ANNOTATION_STROKE_WIDTH * ANNOTATION_STROKE_WIDTH;

  return aPoints.some((aPoint) =>
    bPoints.some((bPoint) => getSquaredPointDistance(aPoint, bPoint) <= overlapDistanceSquared)
  );
};

const doesPathStrokeOverlapPolygon = (pathPoints: Point[], polygon: Point[]): boolean =>
  polygon.length >= 3 &&
  pathPoints.some(
    (point) =>
      isPointInPolygon(point, polygon) ||
      getPointToPolygonEdgeDistance(point, polygon) <= ANNOTATION_STROKE_HALF_WIDTH
  );

const doAnnotationShapesOverlap = (
  a: ArrowAnnotation,
  b: ArrowAnnotation,
  collisionShapeCache: Map<ArrowAnnotation, AnnotationCollisionShape>
): boolean => {
  const aShape = collisionShapeCache.get(a) ?? getAnnotationCollisionShape(a);
  const bShape = collisionShapeCache.get(b) ?? getAnnotationCollisionShape(b);
  collisionShapeCache.set(a, aShape);
  collisionShapeCache.set(b, bShape);

  if (
    (aShape.pathPoints.length === 0 && !aShape.headPolygon) ||
    (bShape.pathPoints.length === 0 && !bShape.headPolygon) ||
    !doBoundsOverlap(aShape.bounds, bShape.bounds, ANNOTATION_STROKE_WIDTH)
  ) {
    return false;
  }

  return (
    doPathStrokesOverlap(aShape.pathPoints, bShape.pathPoints) ||
    (aShape.headPolygon
      ? doesPathStrokeOverlapPolygon(bShape.pathPoints, aShape.headPolygon)
      : false) ||
    (bShape.headPolygon
      ? doesPathStrokeOverlapPolygon(aShape.pathPoints, bShape.headPolygon)
      : false) ||
    (aShape.headPolygon && bShape.headPolygon
      ? doPolygonsOverlap(aShape.headPolygon, bShape.headPolygon)
      : false)
  );
};

const getHowFarAwayFromBottomOrTop = (
  annotation: TurningPointAnnotation,
  path: PreparedTracingPath
): number => {
  const turnPoint = getPreparedPointAtOverallDistance(path, annotation.source.turnDistance);
  return Math.min(
    Math.abs(turnPoint.y - path.bounds.minY),
    Math.abs(path.bounds.maxY - turnPoint.y)
  );
};

const compareTurningPointPriority = (
  a: TurningPointAnnotation,
  b: TurningPointAnnotation,
  path: PreparedTracingPath
): number => {
  const priorityDifference =
    getHowFarAwayFromBottomOrTop(a, path) - getHowFarAwayFromBottomOrTop(b, path);
  if (Math.abs(priorityDifference) > 0.001) {
    return priorityDifference;
  }

  return a.source.turnDistance - b.source.turnDistance;
};

const transformAnnotationCommand = (
  command: AnnotationPathCommand,
  sourceAnchor: Point,
  targetAnchor: Point,
  angleRadians: number
): AnnotationPathCommand => {
  if (command.type === "move") {
    return {
      type: "move",
      to: transformPoint(command.to, sourceAnchor, targetAnchor, angleRadians)
    };
  }

  if (command.type === "line") {
    return {
      type: "line",
      to: transformPoint(command.to, sourceAnchor, targetAnchor, angleRadians)
    };
  }

  return {
    type: "cubic",
    cp1: transformPoint(command.cp1, sourceAnchor, targetAnchor, angleRadians),
    cp2: transformPoint(command.cp2, sourceAnchor, targetAnchor, angleRadians),
    to: transformPoint(command.to, sourceAnchor, targetAnchor, angleRadians)
  };
};

const relocateTurningPointAnnotation = (
  annotation: TurningPointAnnotation,
  path: PreparedTracingPath
): TurningPointRelocation => {
  const totalLength = getTotalPreparedPathLength(path);
  const sourcePose = getPreparedPoseAtOverallDistance(
    path,
    annotation.source.turnDistance,
    "forward"
  );
  const targetDistance = Math.max(
    annotation.source.turnDistance,
    Math.min(totalLength, annotation.source.endDistance)
  );
  const targetPose = getPreparedPoseAtOverallDistance(path, targetDistance, "backward");
  const sourceAnchor = sourcePose.point;
  const targetAnchor = targetPose.point;
  const angleRadians =
    Math.atan2(targetPose.tangent.y, targetPose.tangent.x) -
    Math.atan2(sourcePose.tangent.y, sourcePose.tangent.x);
  const distanceShift = targetDistance - annotation.source.turnDistance;

  return {
    annotation: {
      ...annotation,
      commands: annotation.commands.map((command) =>
        transformAnnotationCommand(command, sourceAnchor, targetAnchor, angleRadians)
      ),
      ...(annotation.head
        ? {
          head: {
            tip: transformPoint(
              annotation.head.tip,
              sourceAnchor,
              targetAnchor,
              angleRadians
            ),
            direction: normalizeVector(rotateVector(annotation.head.direction, angleRadians)),
            polygon: annotation.head.polygon.map((point) =>
              transformPoint(point, sourceAnchor, targetAnchor, angleRadians)
            )
          }
        }
        : {}),
      source: {
        ...annotation.source,
        startDistance: Math.min(totalLength, annotation.source.startDistance + distanceShift),
        turnDistance: targetDistance,
        endDistance: Math.min(totalLength, annotation.source.endDistance + distanceShift)
      }
    },
    distanceShift,
    targetDistance,
    targetPose
  };
};

const relocateDrawOrderNumberAnnotation = (
  annotation: DrawOrderNumberAnnotation,
  relocation: TurningPointRelocation,
  totalLength: number
): DrawOrderNumberAnnotation => ({
  ...annotation,
  point: relocation.targetPose.point,
  anchor: offsetPosePoint(relocation.targetPose, annotation.metrics.offset),
  direction: relocation.targetPose.tangent,
  source: {
    ...annotation.source,
    startDistance: Math.min(totalLength, annotation.source.startDistance + relocation.distanceShift),
    endDistance: Math.min(totalLength, annotation.source.endDistance + relocation.distanceShift),
    distance: relocation.targetDistance
  }
});

const relocateOverlappingTurningPointAnnotations = (
  annotations: FormationAnnotation[],
  path: PreparedTracingPath
): FormationAnnotation[] => {
  const turningPointAnnotations = annotations.filter(isTurningPointAnnotation);
  if (turningPointAnnotations.length < 2) {
    return annotations;
  }

  const collisionShapeCache = new Map<ArrowAnnotation, AnnotationCollisionShape>();
  const relocatedAnnotations = new Map<TurningPointAnnotation, TurningPointRelocation>();
  const prioritySortedTurningPoints = [...turningPointAnnotations].sort((a, b) =>
    compareTurningPointPriority(a, b, path)
  );
  const priorityAnnotations: TurningPointAnnotation[] = [];

  prioritySortedTurningPoints.forEach((annotation) => {
    const overlapsHigherPriorityAnnotation = priorityAnnotations.some((priorityAnnotation) =>
      doAnnotationShapesOverlap(annotation, priorityAnnotation, collisionShapeCache)
    );

    if (overlapsHigherPriorityAnnotation) {
      relocatedAnnotations.set(annotation, relocateTurningPointAnnotation(annotation, path));
      return;
    }

    priorityAnnotations.push(annotation);
  });

  if (relocatedAnnotations.size === 0) {
    return annotations;
  }

  const totalLength = getTotalPreparedPathLength(path);
  const relocatedAnnotationsBySectionIndex = new Map<number, TurningPointRelocation>();
  relocatedAnnotations.forEach((relocation, annotation) => {
    relocatedAnnotationsBySectionIndex.set(annotation.source.sectionIndex, relocation);
  });

  return annotations.map((annotation) => {
    if (isTurningPointAnnotation(annotation)) {
      return relocatedAnnotations.get(annotation)?.annotation ?? annotation;
    }

    if (isDrawOrderNumberAnnotation(annotation)) {
      const relocation = relocatedAnnotationsBySectionIndex.get(annotation.source.sectionIndex);
      return relocation
        ? relocateDrawOrderNumberAnnotation(annotation, relocation, totalLength)
        : annotation;
    }

    return annotation;
  });
};

const resolveVisibleFormationAnnotations = (
  annotations: FormationAnnotation[],
  path: PreparedTracingPath
): FormationAnnotation[] => {
  const visibleAnnotations = relocateOverlappingTurningPointAnnotations(
    annotations.filter((annotation) => annotationVisibility[annotation.kind]),
    path
  );
  const turningPointAnnotations = visibleAnnotations.filter(isTurningPointAnnotation);
  const straightArrowAnnotations = visibleAnnotations
    .filter(isStraightArrowAnnotation)
    .sort((a, b) => getAnnotationPathDistance(a) - getAnnotationPathDistance(b));
  const collisionShapeCache = new Map<ArrowAnnotation, AnnotationCollisionShape>();
  const keptStraightArrowAnnotations: StraightArrowAnnotation[] = [];
  const hiddenAnnotations = new Set<FormationAnnotation>();

  straightArrowAnnotations.forEach((annotation) => {
    const overlapsTurningPoint = turningPointAnnotations.some((turnAnnotation) =>
      doAnnotationShapesOverlap(annotation, turnAnnotation, collisionShapeCache)
    );

    if (overlapsTurningPoint) {
      hiddenAnnotations.add(annotation);
      return;
    }

    const overlapsEarlierStraightArrow = keptStraightArrowAnnotations.some((keptAnnotation) =>
      doAnnotationShapesOverlap(annotation, keptAnnotation, collisionShapeCache)
    );

    if (overlapsEarlierStraightArrow) {
      hiddenAnnotations.add(annotation);
      return;
    }

    keptStraightArrowAnnotations.push(annotation);
  });

  return visibleAnnotations.filter((annotation) => !hiddenAnnotations.has(annotation));
};

const getNumberRenderAnchor = (annotation: DrawOrderNumberAnnotation): Point => {
  const direction = normalizeVector(annotation.direction);
  return {
    x: annotation.anchor.x + direction.x * currentNumberPathOffset,
    y: annotation.anchor.y + direction.y * currentNumberPathOffset
  };
};

const renderAnnotationMarkup = (annotation: FormationAnnotation): string => {
  if (!annotationVisibility[annotation.kind]) {
    return "";
  }

  if (annotation.kind === "draw-order-number") {
    const numberAnchor = getNumberRenderAnchor(annotation);
    return `
      <g class="writing-app__annotation-number-badge">
        <text
          class="writing-app__annotation-number"
          x="${numberAnchor.x}"
          y="${numberAnchor.y}"
          font-size="${currentTurnRadius * 2}"
          text-anchor="middle"
          dominant-baseline="central"
        >${escapeSvgText(annotation.text)}</text>
      </g>
    `;
  }

  return `
    <path
      class="${getAnnotationClassName(annotation)}"
      d="${annotationCommandsToSvgPathData(annotation.commands)}"
    ></path>
    ${annotation.head
      ? `<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--formation writing-app__section-arrowhead--${annotation.kind}" points="${buildSvgPoints(annotation.head.polygon)}"></polygon>`
      : ""
    }
  `;
};

const updateSuccessVisibility = (isVisible: boolean) => {
  successOverlay.hidden = !isVisible;
};

const stopDemoAnimation = () => {
  if (demoAnimationFrameId !== null) {
    cancelAnimationFrame(demoAnimationFrameId);
    demoAnimationFrameId = null;
  }

  isDemoPlaying = false;
  showMeButton.disabled = false;
  showMeButton.textContent = "Show me";

  demoStrokeEls.forEach((el, index) => {
    const length = demoStrokeLengths[index] ?? 0.001;
    el.style.strokeDasharray = `${length} ${length}`;
    el.style.strokeDashoffset = `${length}`;
  });

  if (demoNibEl) {
    demoNibEl.style.opacity = "0";
  }

  requestTraceRender();
};

const resetTraceProgress = () => {
  tracingSession?.reset();
  activePointerId = null;
  updateSuccessVisibility(false);

  traceStrokeEls.forEach((el, index) => {
    const length = traceStrokeLengths[index] ?? 0.001;
    el.style.strokeDasharray = `${length} ${length}`;
    el.style.strokeDashoffset = `${length}`;
  });

  requestTraceRender();
};

const requestTraceRender = () => {
  if (traceRenderQueued) {
    return;
  }

  traceRenderQueued = true;
  requestAnimationFrame(() => {
    traceRenderQueued = false;
    renderTraceFrame();
  });
};

const getOverallDistanceForState = (
  state: Pick<TracingState, "status" | "activeStrokeIndex" | "activeStrokeProgress">
): number => {
  if (!preparedTracingPath) {
    return 0;
  }

  if (state.status === "complete") {
    return preparedTracingPath.strokes.reduce((sum, stroke) => sum + stroke.totalLength, 0);
  }

  let total = 0;
  for (let index = 0; index < state.activeStrokeIndex; index += 1) {
    total += preparedTracingPath.strokes[index]?.totalLength ?? 0;
  }

  const activeStroke = preparedTracingPath.strokes[state.activeStrokeIndex];
  return total + (activeStroke?.totalLength ?? 0) * state.activeStrokeProgress;
};

const getCommittedCursorTangent = (state: TracingState) => {
  if (!preparedTracingPath) {
    return state.cursorTangent;
  }

  const overallDistance = getOverallDistanceForState(state);
  const activeTurnBoundary = [...preparedTracingPath.boundaries]
    .reverse()
    .find(
      (boundary) =>
        boundary.previousSegment !== boundary.nextSegment &&
        boundary.turnAngleDegrees >= 150 &&
        overallDistance >= boundary.overallDistance - TRACE_CURSOR_TURN_LOOKAHEAD_DISTANCE &&
        overallDistance - boundary.overallDistance < TRACE_CURSOR_TURN_COMMIT_DISTANCE
    );

  return activeTurnBoundary?.outgoingTangent ?? state.cursorTangent;
};

const renderTraceFrame = () => {
  if (!tracingSession || !traceCursorEl) {
    return;
  }

  const state = tracingSession.getState();
  const cursorTangent = getCommittedCursorTangent(state);
  const angle = Math.atan2(cursorTangent.y, cursorTangent.x) * (180 / Math.PI);

  traceCursorEl.setAttribute(
    "transform",
    `translate(${state.cursorPoint.x}, ${state.cursorPoint.y}) rotate(${angle})`
  );
  traceCursorEl.style.opacity = isDemoPlaying ? "0" : "1";

  const completed = new Set(state.completedStrokes);
  traceStrokeEls.forEach((el, index) => {
    const length = traceStrokeLengths[index] ?? 0;
    if (completed.has(index)) {
      el.style.strokeDashoffset = "0";
      return;
    }
    if (index === state.activeStrokeIndex) {
      const remaining = length * (1 - state.activeStrokeProgress);
      el.style.strokeDashoffset = `${Math.max(0, remaining)}`;
      return;
    }
    el.style.strokeDashoffset = `${length}`;
  });

  updateSuccessVisibility(state.status === "complete");
};

const playDemo = () => {
  if (!currentPath || isDemoPlaying) {
    return;
  }

  resetTraceProgress();
  stopDemoAnimation();

  const player = new AnimationPlayer(currentPath, {
    speed: 1.7,
    penUpSpeed: 2.1,
    deferredDelayMs: 150
  });

  isDemoPlaying = true;
  showMeButton.disabled = true;
  showMeButton.textContent = "Showing...";

  const startedAt = performance.now();

  const tick = (now: number) => {
    const elapsed = now - startedAt;
    const clampedElapsed = Math.min(elapsed, player.totalDuration);
    const frame = player.getFrame(clampedElapsed);
    const completed = new Set(frame.completedStrokes);

    demoStrokeEls.forEach((el, index) => {
      const length = demoStrokeLengths[index] ?? 0.001;
      if (completed.has(index)) {
        el.style.strokeDashoffset = "0";
        return;
      }
      if (index === frame.activeStrokeIndex) {
        const remaining = length * (1 - frame.activeStrokeProgress);
        el.style.strokeDashoffset = `${Math.max(0, remaining)}`;
        return;
      }
      el.style.strokeDashoffset = `${length}`;
    });

    if (demoNibEl) {
      demoNibEl.setAttribute("cx", frame.point.x.toFixed(2));
      demoNibEl.setAttribute("cy", frame.point.y.toFixed(2));
      demoNibEl.style.opacity = elapsed <= player.totalDuration + DEMO_PAUSE_MS ? "1" : "0";
    }

    if (elapsed < player.totalDuration + DEMO_PAUSE_MS) {
      demoAnimationFrameId = requestAnimationFrame(tick);
      return;
    }

    stopDemoAnimation();
    resetTraceProgress();
  };

  demoAnimationFrameId = requestAnimationFrame(tick);
  requestTraceRender();
};

const setupScene = (path: WritingPath, width: number, height: number, offsetY: number) => {
  const preparedPath = compileTracingPath(path);
  preparedTracingPath = preparedPath;
  tracingSession = new TracingSession(preparedPath, {
    startTolerance: currentTraceTolerance,
    hitTolerance: currentTraceTolerance
  });
  activePointerId = null;

  const drawableStrokes = path.strokes.filter((stroke) => stroke.type !== "lift");
  const backgroundPaths = drawableStrokes
    .map((stroke) => `<path class="writing-app__stroke-bg" d="${buildPathD(stroke.curves)}"></path>`)
    .join("");
  const tracePaths = drawableStrokes
    .map((stroke) => `<path class="writing-app__stroke-trace" d="${buildPathD(stroke.curves)}"></path>`)
    .join("");
  const demoPaths = drawableStrokes
    .map((stroke) => `<path class="writing-app__stroke-demo" d="${buildPathD(stroke.curves)}"></path>`)
    .join("");
  const sectionArrowLength = Math.abs(path.guides.baseline - path.guides.xHeight) / 3;
  const arrowLaneOffset = shouldOffsetArrowLanes ? currentTurnRadius : 0;
  const annotations = compileFormationAnnotations(preparedPath, {
    turningPoints: {
      offset: currentTurnRadius,
      stemLength: sectionArrowLength * 0.36,
      head: {
        length: SECTION_ARROWHEAD_LENGTH,
        width: SECTION_ARROWHEAD_WIDTH,
        tipExtension: SECTION_ARROWHEAD_TIP_OVERHANG
      }
    },
    startArrows: {
      length: sectionArrowLength * 0.42,
      minLength: sectionArrowLength * 0.18,
      offset: arrowLaneOffset,
      head: {
        length: SECTION_ARROWHEAD_LENGTH,
        width: SECTION_ARROWHEAD_WIDTH,
        tipExtension: SECTION_ARROWHEAD_TIP_OVERHANG
      }
    },
    drawOrderNumbers: {
      offset: 0
    },
    midpointArrows: {
      density: currentMidpointDensity,
      length: sectionArrowLength * 0.36,
      offset: arrowLaneOffset,
      head: {
        length: SECTION_ARROWHEAD_LENGTH,
        width: SECTION_ARROWHEAD_WIDTH,
        tipExtension: SECTION_ARROWHEAD_TIP_OVERHANG
      }
    }
  });
  const visibleAnnotations = resolveVisibleFormationAnnotations(annotations, preparedPath);
  const annotationMarkup = [
    ...visibleAnnotations.filter((annotation) => annotation.kind !== "draw-order-number"),
    ...visibleAnnotations.filter((annotation) => annotation.kind === "draw-order-number")
  ]
    .map(renderAnnotationMarkup)
    .join("");

  traceSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  traceSvg.style.setProperty("--formation-arrow-color", currentArrowColor);
  traceSvg.innerHTML = `
    <rect class="writing-app__bg" x="0" y="0" width="${width}" height="${height}"></rect>
    <line
      class="writing-app__guide writing-app__guide--midline"
      x1="0"
      y1="${path.guides.xHeight + offsetY}"
      x2="${width}"
      y2="${path.guides.xHeight + offsetY}"
    ></line>
    <line
      class="writing-app__guide writing-app__guide--baseline"
      x1="0"
      y1="${path.guides.baseline + offsetY}"
      x2="${width}"
      y2="${path.guides.baseline + offsetY}"
    ></line>
    ${backgroundPaths}
    ${tracePaths}
    ${annotationMarkup}
    ${demoPaths}
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
    <g class="writing-app__cursor" id="trace-cursor">
      <circle class="writing-app__cursor-bg" cx="0" cy="0" r="34"></circle>
      <polygon class="writing-app__cursor-arrow" points="18,0 -12,-14 -6,0 -12,14"></polygon>
    </g>
  `;

  traceStrokeEls = Array.from(
    traceSvg.querySelectorAll<SVGPathElement>(".writing-app__stroke-trace")
  );
  demoStrokeEls = Array.from(
    traceSvg.querySelectorAll<SVGPathElement>(".writing-app__stroke-demo")
  );
  traceCursorEl = traceSvg.querySelector<SVGGElement>("#trace-cursor");
  demoNibEl = traceSvg.querySelector<SVGCircleElement>("#demo-nib");

  traceStrokeLengths = traceStrokeEls.map((el) => {
    const length = el.getTotalLength();
    return Number.isFinite(length) && length > 0 ? length : 0.001;
  });
  demoStrokeLengths = demoStrokeEls.map((el) => {
    const length = el.getTotalLength();
    return Number.isFinite(length) && length > 0 ? length : 0.001;
  });

  traceStrokeEls.forEach((el, index) => {
    const length = traceStrokeLengths[index] ?? 0.001;
    el.style.strokeDasharray = `${length} ${length}`;
    el.style.strokeDashoffset = `${length}`;
  });
  demoStrokeEls.forEach((el, index) => {
    const length = demoStrokeLengths[index] ?? 0.001;
    el.style.strokeDasharray = `${length} ${length}`;
    el.style.strokeDashoffset = `${length}`;
  });

  if (demoNibEl) {
    demoNibEl.style.opacity = "0";
  }

  updateSuccessVisibility(false);
  requestTraceRender();
};

const clearScene = () => {
  stopDemoAnimation();
  currentPath = null;
  preparedTracingPath = null;
  tracingSession = null;
  activePointerId = null;
  traceStrokeEls = [];
  traceStrokeLengths = [];
  traceCursorEl = null;
  demoStrokeEls = [];
  demoStrokeLengths = [];
  demoNibEl = null;
  traceSvg.innerHTML = "";
  updateSuccessVisibility(false);
};

const normalizeWord = (word: string): string => word.trim().toLowerCase();

const renderWord = (word: string) => {
  stopDemoAnimation();
  currentWord = normalizeWord(word);
  wordLabel.textContent = currentWord;

  if (currentWord.length === 0) {
    clearScene();
    return;
  }

  let layout: ReturnType<typeof buildShiftedWordLayout>;
  try {
    layout = buildShiftedWordLayout(currentWord);
  } catch {
    clearScene();
    return;
  }

  currentPath = layout.path;
  setupScene(layout.path, layout.width, layout.height, layout.offsetY);
};

const goToNextWord = () => {
  currentWordIndex = chooseNextWordIndex(currentWordIndex);
  const nextWord = WORDS[currentWordIndex] ?? WORDS[0];
  wordInput.value = nextWord;
  renderWord(nextWord);
};

const onPointerDown = (event: PointerEvent) => {
  if (isDemoPlaying || !tracingSession || activePointerId !== null) {
    return;
  }

  const started = tracingSession.beginAt(getPointerInSvg(traceSvg, event));
  if (!started) {
    return;
  }

  event.preventDefault();
  activePointerId = event.pointerId;
  traceSvg.setPointerCapture(event.pointerId);
  requestTraceRender();
};

const onPointerMove = (event: PointerEvent) => {
  if (isDemoPlaying || !tracingSession || event.pointerId !== activePointerId) {
    return;
  }

  event.preventDefault();
  tracingSession.update(getPointerInSvg(traceSvg, event));
  requestTraceRender();
};

const onPointerUp = (event: PointerEvent) => {
  if (!tracingSession || event.pointerId !== activePointerId) {
    return;
  }

  tracingSession.end();
  if (traceSvg.hasPointerCapture(event.pointerId)) {
    traceSvg.releasePointerCapture(event.pointerId);
  }
  activePointerId = null;
  requestTraceRender();
};

const onPointerCancel = (event: PointerEvent) => {
  if (event.pointerId !== activePointerId) {
    return;
  }

  tracingSession?.end();
  if (traceSvg.hasPointerCapture(event.pointerId)) {
    traceSvg.releasePointerCapture(event.pointerId);
  }
  activePointerId = null;
  requestTraceRender();
};

traceSvg.addEventListener("pointerdown", onPointerDown);
traceSvg.addEventListener("pointermove", onPointerMove);
traceSvg.addEventListener("pointerup", onPointerUp);
traceSvg.addEventListener("pointercancel", onPointerCancel);
showMeButton.addEventListener("click", playDemo);
nextWordButton.addEventListener("click", goToNextWord);
wordInput.addEventListener("input", () => {
  currentWordIndex = -1;
  renderWord(wordInput.value);
});
toleranceSlider.addEventListener("input", () => {
  currentTraceTolerance = Number(toleranceSlider.value);
  syncToleranceLabel();
  renderWord(currentWord);
});
midpointDensitySlider.addEventListener("input", () => {
  currentMidpointDensity = Number(midpointDensitySlider.value);
  syncMidpointDensityLabel();
  renderWord(currentWord);
});
turnRadiusSlider.addEventListener("input", () => {
  currentTurnRadius = Number(turnRadiusSlider.value);
  syncTurnRadiusLabel();
  renderWord(currentWord);
});
numberOffsetSlider.addEventListener("input", () => {
  currentNumberPathOffset = Number(numberOffsetSlider.value);
  syncNumberOffsetLabel();
  renderWord(currentWord);
});
offsetArrowLanesToggle.addEventListener("change", () => {
  shouldOffsetArrowLanes = offsetArrowLanesToggle.checked;
  renderWord(currentWord);
});
arrowColorPicker.addEventListener("input", () => {
  const nextArrowColor = normalizeArrowColor(arrowColorPicker.value);
  if (!nextArrowColor) {
    return;
  }

  currentArrowColor = nextArrowColor;
  traceSvg.style.setProperty("--formation-arrow-color", currentArrowColor);
});
annotationToggleEls.forEach((toggleEl) => {
  toggleEl.addEventListener("change", () => {
    const annotationKind = toggleEl.dataset.annotationKind as FormationAnnotation["kind"] | undefined;
    if (!annotationKind) {
      return;
    }

    annotationVisibility = {
      ...annotationVisibility,
      [annotationKind]: toggleEl.checked
    };
    renderWord(currentWord);
  });
});

syncToleranceLabel();
syncMidpointDensityLabel();
syncTurnRadiusLabel();
syncNumberOffsetLabel();
wordInput.value = currentWord;
renderWord(currentWord);
