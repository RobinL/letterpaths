import {
  annotationCommandsToSvgPathData,
  compileFormationAnnotations,
  type AnnotationArrowHead,
  type AnnotationPathCommand,
  type FormationAnnotation,
  type Point,
  type PreparedTracingPath,
  type WritingPath
} from "letterpaths";

export type FormationAnnotationVisibility = Record<FormationAnnotation["kind"], boolean>;

export type FormationAnnotationMarkupOptions = {
  directionalDashSpacing: number;
  midpointDensity: number;
  turnRadius: number;
  uTurnLength: number;
  arrowLength: number;
  arrowHeadSize: number;
  arrowStrokeWidth: number;
  numberSize: number;
  numberPathOffset: number;
  numberColor: string;
  offsetArrowLanes: boolean;
  alwaysOffsetArrowLanes: boolean;
  visibility: FormationAnnotationVisibility;
};

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

const SECTION_ARROWHEAD_LENGTH = 26;
const SECTION_ARROWHEAD_WIDTH = 22;
const SECTION_ARROWHEAD_TIP_OVERHANG = 11;
const START_ARROW_LENGTH_RATIO = 0.42;
const STRAIGHT_ARROW_LENGTH_RATIO = 0.36 / START_ARROW_LENGTH_RATIO;
const START_ARROW_MIN_LENGTH_RATIO = 0.18 / START_ARROW_LENGTH_RATIO;
const ARROWHEAD_WIDTH_RATIO = SECTION_ARROWHEAD_WIDTH / SECTION_ARROWHEAD_LENGTH;
const ARROWHEAD_TIP_OVERHANG_RATIO = SECTION_ARROWHEAD_TIP_OVERHANG / SECTION_ARROWHEAD_LENGTH;
const ANNOTATION_COLLISION_SAMPLE_STEP = 4;
const ANNOTATION_STROKE_WIDTH = 6.5;
const ANNOTATION_STROKE_HALF_WIDTH = ANNOTATION_STROKE_WIDTH / 2;

export const DEFAULT_FORMATION_ANNOTATION_VISIBILITY: FormationAnnotationVisibility = {
  "directional-dash": false,
  "turning-point": true,
  "start-arrow": true,
  "draw-order-number": true,
  "midpoint-arrow": true
};

export const EMPTY_FORMATION_ANNOTATION_VISIBILITY: FormationAnnotationVisibility = {
  "directional-dash": false,
  "turning-point": false,
  "start-arrow": false,
  "draw-order-number": false,
  "midpoint-arrow": false
};

export const buildFormationAnnotationMarkup = (
  _path: WritingPath,
  preparedPath: PreparedTracingPath,
  options: FormationAnnotationMarkupOptions
): string => {
  const hasVisibleAnnotations = Object.values(options.visibility).some(Boolean);
  if (!hasVisibleAnnotations) {
    return "";
  }

  const uTurnLength = Math.max(0, options.uTurnLength);
  const arrowLength = Math.max(0, options.arrowLength);
  const arrowHeadSize = Math.max(0, options.arrowHeadSize);
  const arrowLaneOffset = options.offsetArrowLanes ? options.turnRadius : 0;
  const arrowLaneOffsetMode = options.alwaysOffsetArrowLanes ? "always" : "bidirectional-only";
  const annotations = compileFormationAnnotations(preparedPath, {
    directionalDashes: options.visibility["directional-dash"]
      ? {
          spacing: options.directionalDashSpacing,
          head: {
            length: arrowHeadSize,
            width: arrowHeadSize * ARROWHEAD_WIDTH_RATIO,
            tipExtension: arrowHeadSize * ARROWHEAD_TIP_OVERHANG_RATIO
          }
        }
      : false,
    turningPoints: options.visibility["turning-point"]
      ? {
          offset: options.turnRadius,
          stemLength: uTurnLength * STRAIGHT_ARROW_LENGTH_RATIO,
          head: {
            length: arrowHeadSize,
            width: arrowHeadSize * ARROWHEAD_WIDTH_RATIO,
            tipExtension: arrowHeadSize * ARROWHEAD_TIP_OVERHANG_RATIO
          }
        }
      : false,
    startArrows: options.visibility["start-arrow"]
      ? {
          length: arrowLength,
          minLength: arrowLength * START_ARROW_MIN_LENGTH_RATIO,
          offset: arrowLaneOffset,
          offsetMode: arrowLaneOffsetMode,
          head: {
            length: arrowHeadSize,
            width: arrowHeadSize * ARROWHEAD_WIDTH_RATIO,
            tipExtension: arrowHeadSize * ARROWHEAD_TIP_OVERHANG_RATIO
          }
        }
      : false,
    drawOrderNumbers: options.visibility["draw-order-number"]
      ? {
          offset: 0
        }
      : false,
    midpointArrows: options.visibility["midpoint-arrow"]
      ? {
          density: options.midpointDensity,
          length: arrowLength * STRAIGHT_ARROW_LENGTH_RATIO,
          offset: arrowLaneOffset,
          offsetMode: arrowLaneOffsetMode,
          head: {
            length: arrowHeadSize,
            width: arrowHeadSize * ARROWHEAD_WIDTH_RATIO,
            tipExtension: arrowHeadSize * ARROWHEAD_TIP_OVERHANG_RATIO
          }
        }
      : false
  });
  const visibleAnnotations = resolveVisibleFormationAnnotations(
    annotations,
    preparedPath,
    options.visibility
  );

  return [
    ...visibleAnnotations.filter((annotation) => annotation.kind !== "draw-order-number"),
    ...visibleAnnotations.filter((annotation) => annotation.kind === "draw-order-number")
  ]
    .map((annotation) => renderAnnotationMarkup(annotation, options))
    .join("");
};

const buildSvgPoints = (points: Point[]): string =>
  points.map((point) => `${point.x} ${point.y}`).join(" ");

const escapeSvgText = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const getAnnotationClassName = (annotation: FormationAnnotation): string =>
  `writing-app__section-arrow writing-app__section-arrow--formation writing-app__section-arrow--${annotation.kind}`;

const getAnnotationHeads = (annotation: FormationAnnotation): AnnotationArrowHead[] =>
  [
    "head" in annotation ? annotation.head : undefined,
    "tailHead" in annotation ? annotation.tailHead : undefined
  ].filter((head): head is AnnotationArrowHead => head !== undefined);

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

  const firstA = a[0];
  const firstB = b[0];
  return (
    edgesIntersect ||
    (!!firstA && isPointInPolygon(firstA, b)) ||
    (!!firstB && isPointInPolygon(firstB, a))
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
              tip: transformPoint(annotation.head.tip, sourceAnchor, targetAnchor, angleRadians),
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
  path: PreparedTracingPath,
  visibility: FormationAnnotationVisibility
): FormationAnnotation[] => {
  const visibleAnnotations = relocateOverlappingTurningPointAnnotations(
    annotations.filter((annotation) => visibility[annotation.kind]),
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

const getNumberRenderAnchor = (
  annotation: DrawOrderNumberAnnotation,
  options: FormationAnnotationMarkupOptions
): Point => {
  const direction = normalizeVector(annotation.direction);
  return {
    x: annotation.anchor.x + direction.x * options.numberPathOffset,
    y: annotation.anchor.y + direction.y * options.numberPathOffset
  };
};

const renderAnnotationMarkup = (
  annotation: FormationAnnotation,
  options: FormationAnnotationMarkupOptions
): string => {
  if (!options.visibility[annotation.kind]) {
    return "";
  }

  if (annotation.kind === "draw-order-number") {
    const numberAnchor = getNumberRenderAnchor(annotation, options);
    return `
      <g class="writing-app__annotation-number-badge">
        <text
          class="writing-app__annotation-number"
          x="${numberAnchor.x}"
          y="${numberAnchor.y}"
          fill="${options.numberColor}"
          font-size="${options.numberSize}"
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
      stroke-width="${options.arrowStrokeWidth}"
    ></path>
    ${getAnnotationHeads(annotation)
      .map(
        (head) =>
          `<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--formation writing-app__section-arrowhead--${annotation.kind}" points="${buildSvgPoints(head.polygon)}"></polygon>`
      )
      .join("")}
  `;
};
