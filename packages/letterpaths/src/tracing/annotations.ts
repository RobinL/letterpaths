import type { Point } from "../types";
import type { PreparedTracingPath, TracingSample } from "./compiler";
import {
  compileFormationArrows,
  type FormationArrowHead,
  type FormationArrowHeadOptions,
  type FormationArrowPathCommand
} from "./formation-arrows";
import {
  analyzeTracingGroups,
  type AnalyzeTracingGroupsOptions,
  type TracingGroup
} from "./groups";

export type AnnotationPathCommand = FormationArrowPathCommand;
export type AnnotationArrowHead = FormationArrowHead;

export type TracingSectionStartReason = "path-start" | "stroke-start" | "retrace-turn";

export type TracingSection = {
  index: number;
  strokeIndex: number;
  groupIndex: number;
  startDistance: number;
  endDistance: number;
  startPoint: Point;
  endPoint: Point;
  startTangent: Point;
  endTangent: Point;
  startReason: TracingSectionStartReason;
  kind: TracingGroup["kind"];
  matchedEarlierDistance?: number;
};

export type TracingSectionAnalysis = {
  sections: TracingSection[];
  groups: TracingGroup[];
  totalLength: number;
};

export type AnalyzeTracingSectionsOptions = {
  groupAnalysis?: AnalyzeTracingGroupsOptions;
  groups?: TracingGroup[];
};

export type AnnotationSource = {
  sectionIndex: number;
  strokeIndex: number;
  startDistance: number;
  endDistance: number;
};

export type TurningPointAnnotationOptions = {
  offset?: number;
  stemLength?:
    | number
    | {
        incoming?: number;
        outgoing?: number;
      };
  head?: false | FormationArrowHeadOptions;
  groupAnalysis?: AnalyzeTracingGroupsOptions;
  groups?: TracingGroup[];
};

export type StartArrowAnnotationOptions = {
  length?: number;
  minLength?: number;
  offset?: number;
  head?: false | FormationArrowHeadOptions;
};

export type DrawOrderNumberAnnotationOptions = {
  offset?: number;
};

export type MidpointArrowAnnotationOptions = {
  density?: number;
  length?: number;
  minLength?: number;
  offset?: number;
  head?: false | FormationArrowHeadOptions;
};

export type CompileFormationAnnotationsOptions = AnalyzeTracingSectionsOptions & {
  sections?: TracingSection[];
  turningPoints?: false | TurningPointAnnotationOptions;
  startArrows?: false | StartArrowAnnotationOptions;
  drawOrderNumbers?: false | DrawOrderNumberAnnotationOptions;
  midpointArrows?: false | MidpointArrowAnnotationOptions;
};

export type TurningPointAnnotation = {
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

export type StartArrowAnnotation = {
  kind: "start-arrow";
  commands: AnnotationPathCommand[];
  head?: AnnotationArrowHead;
  anchor: Point;
  direction: Point;
  source: AnnotationSource & {
    distance: number;
  };
  metrics: {
    length: number;
    offset: number;
    headLength?: number;
    headWidth?: number;
    tipExtension?: number;
  };
};

export type DrawOrderNumberAnnotation = {
  kind: "draw-order-number";
  value: number;
  text: string;
  point: Point;
  anchor: Point;
  direction: Point;
  source: AnnotationSource & {
    distance: number;
  };
  metrics: {
    offset: number;
  };
};

export type MidpointArrowAnnotation = {
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
  metrics: {
    density: number;
    length: number;
    offset: number;
    headLength?: number;
    headWidth?: number;
    tipExtension?: number;
  };
};

export type FormationAnnotation =
  | TurningPointAnnotation
  | StartArrowAnnotation
  | DrawOrderNumberAnnotation
  | MidpointArrowAnnotation;

type PoseAtDistanceBias = "forward" | "backward" | "center";

type StrokeRange = {
  strokeIndex: number;
  startDistance: number;
  endDistance: number;
};

type PathRange = {
  commands: AnnotationPathCommand[];
  points: Point[];
  direction: Point;
};

type ResolvedArrowOptions = {
  length: number;
  minLength: number;
  offset: number;
  head:
    | false
    | {
        length: number;
        width: number;
        tipExtension: number;
      };
};

const DISTANCE_EPSILON = 0.5;
const REFERENCE_GUIDE_HEIGHT = 380;
const DEFAULT_OFFSET_RATIO = 13 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_START_ARROW_LENGTH_RATIO = 0.14;
const DEFAULT_MIDPOINT_ARROW_LENGTH_RATIO = 0.12;
const DEFAULT_ARROW_MIN_LENGTH_RATIO = 0.06;
const DEFAULT_ARROW_HEAD_LENGTH_RATIO = 26 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_ARROW_HEAD_WIDTH_RATIO = 22 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_ARROW_HEAD_TIP_EXTENSION_RATIO = 11 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_MIDPOINT_DENSITY = 320;

export function analyzeTracingSections(
  path: PreparedTracingPath,
  options: AnalyzeTracingSectionsOptions = {}
): TracingSectionAnalysis {
  const totalLength = getTotalLength(path);
  const groups = options.groups ?? analyzeTracingGroups(path, options.groupAnalysis ?? {}).groups;

  if (totalLength <= 0 || path.strokes.length === 0) {
    return { sections: [], groups, totalLength };
  }

  const starts = new Map<number, TracingSectionStartReason>();
  setSectionStart(starts, 0, "path-start");

  getStrokeRanges(path).forEach((range) => {
    if (range.startDistance > DISTANCE_EPSILON && range.endDistance >= range.startDistance) {
      setSectionStart(starts, range.startDistance, "stroke-start");
    }
  });

  groups.forEach((group) => {
    if (group.kind === "retrace" && group.startDistance > DISTANCE_EPSILON) {
      setSectionStart(starts, group.startDistance, "retrace-turn");
    }
  });

  const orderedStarts = [...starts.keys()]
    .filter((distance) => distance >= 0 && distance < totalLength - DISTANCE_EPSILON)
    .sort((a, b) => a - b);

  const sections = orderedStarts
    .map((startDistance, index): TracingSection | null => {
      const nextStart = orderedStarts[index + 1];
      const endDistance = nextStart === undefined ? totalLength : nextStart;

      if (endDistance < startDistance) {
        return null;
      }

      const startPose = getPoseAtOverallDistance(path, startDistance, "forward");
      const endPose = getPoseAtOverallDistance(path, endDistance, "backward");
      const group = findGroupAtSectionStart(groups, startDistance);
      const startReason = starts.get(startDistance) ?? (index === 0 ? "path-start" : "stroke-start");

      return {
        index,
        strokeIndex: findStrokeIndexForOverallDistance(path, startDistance),
        groupIndex: group?.index ?? 0,
        startDistance,
        endDistance,
        startPoint: startPose.point,
        endPoint: endPose.point,
        startTangent: startPose.tangent,
        endTangent: endPose.tangent,
        startReason,
        kind: group?.kind ?? "base",
        ...(group?.matchedEarlierDistance === undefined
          ? {}
          : { matchedEarlierDistance: group.matchedEarlierDistance })
      };
    })
    .filter((section): section is TracingSection => section !== null);

  return { sections, groups, totalLength };
}

export function compileFormationAnnotations(
  path: PreparedTracingPath,
  options: CompileFormationAnnotationsOptions = {}
): FormationAnnotation[] {
  const sectionAnalysis =
    options.sections === undefined
      ? analyzeTracingSections(path, options)
      : {
          sections: options.sections,
          groups:
            options.groups ??
            (options.turningPoints === false || options.turningPoints === undefined
              ? undefined
              : options.turningPoints.groups) ??
            analyzeTracingGroups(path, options.groupAnalysis ?? {}).groups,
          totalLength: getTotalLength(path)
        };
  const { sections, groups } = sectionAnalysis;
  const annotations: FormationAnnotation[] = [];

  if (options.turningPoints !== false) {
    annotations.push(...compileTurningPointAnnotations(path, sections, groups, options));
  }

  sections.forEach((section) => {
    if (options.startArrows !== false) {
      const annotation = compileStartArrowAnnotation(path, section, options.startArrows);
      if (annotation) {
        annotations.push(annotation);
      }
    }

    if (options.drawOrderNumbers !== false) {
      annotations.push(compileDrawOrderNumberAnnotation(path, section, options.drawOrderNumbers));
    }

    if (options.midpointArrows !== false) {
      annotations.push(...compileMidpointArrowAnnotations(path, section, options.midpointArrows));
    }
  });

  return annotations;
}

export function annotationCommandsToSvgPathData(commands: AnnotationPathCommand[]): string {
  return commands
    .map((command) => {
      if (command.type === "move") {
        return `M ${command.to.x} ${command.to.y}`;
      }

      if (command.type === "line") {
        return `L ${command.to.x} ${command.to.y}`;
      }

      return `C ${command.cp1.x} ${command.cp1.y} ${command.cp2.x} ${command.cp2.y} ${command.to.x} ${command.to.y}`;
    })
    .join(" ");
}

function compileTurningPointAnnotations(
  path: PreparedTracingPath,
  sections: TracingSection[],
  groups: TracingGroup[],
  options: CompileFormationAnnotationsOptions
): TurningPointAnnotation[] {
  const turningPointOptions = options.turningPoints === false ? undefined : options.turningPoints;
  const arrows = compileFormationArrows(path, {
    retraceTurns: {
      ...turningPointOptions,
      groupAnalysis: turningPointOptions?.groupAnalysis ?? options.groupAnalysis,
      groups: turningPointOptions?.groups ?? groups
    }
  });

  return arrows.map((arrow) => {
    const section =
      findSectionStartingAt(sections, arrow.source.turnDistance) ??
      findSectionContainingDistance(sections, arrow.source.turnDistance);
    const sectionIndex = section?.index ?? 0;
    const group = groups.find((candidate) => candidate.index === arrow.source.groupIndex);

    return {
      kind: "turning-point",
      turnKind: "retrace-u-turn",
      commands: arrow.commands,
      ...(arrow.head ? { head: arrow.head } : {}),
      source: {
        sectionIndex,
        strokeIndex: section?.strokeIndex ?? findStrokeIndexForOverallDistance(path, arrow.source.turnDistance),
        startDistance: arrow.source.startDistance,
        turnDistance: arrow.source.turnDistance,
        endDistance: arrow.source.endDistance,
        previousSectionIndex: Math.max(0, sectionIndex - 1),
        previousGroupIndex: arrow.source.previousGroupIndex,
        groupIndex: arrow.source.groupIndex,
        ...(group?.matchedEarlierDistance === undefined
          ? {}
          : { matchedEarlierDistance: group.matchedEarlierDistance })
      },
      metrics: arrow.metrics
    };
  });
}

function compileStartArrowAnnotation(
  path: PreparedTracingPath,
  section: TracingSection,
  options: StartArrowAnnotationOptions | undefined
): StartArrowAnnotation | null {
  const resolved = resolveArrowOptions(path, options || {}, "start");
  const sectionLength = section.endDistance - section.startDistance;
  const length = Math.min(resolved.length, sectionLength);

  if (length < resolved.minLength || sectionLength <= DISTANCE_EPSILON) {
    return null;
  }

  const range = buildOffsetPathRange(
    path,
    section.startDistance,
    section.startDistance + length,
    resolved.offset
  );
  if (!range) {
    return null;
  }

  return {
    kind: "start-arrow",
    commands: range.commands,
    ...(resolved.head === false
      ? {}
      : { head: buildArrowhead(range.points[range.points.length - 1] ?? section.startPoint, range.direction, resolved.head) }),
    anchor: range.points[0] ?? section.startPoint,
    direction: range.direction,
    source: {
      ...getSectionSource(section),
      distance: section.startDistance
    },
    metrics: {
      length,
      offset: resolved.offset,
      ...(resolved.head === false
        ? {}
        : {
            headLength: resolved.head.length,
            headWidth: resolved.head.width,
            tipExtension: resolved.head.tipExtension
          })
    }
  };
}

function compileDrawOrderNumberAnnotation(
  path: PreparedTracingPath,
  section: TracingSection,
  options: DrawOrderNumberAnnotationOptions | undefined
): DrawOrderNumberAnnotation {
  const offset = options?.offset ?? 0;
  const startPose = getPoseAtOverallDistance(path, section.startDistance, "forward");
  const value = section.index + 1;

  return {
    kind: "draw-order-number",
    value,
    text: String(value),
    point: startPose.point,
    anchor: offsetPosePoint(startPose, offset),
    direction: startPose.tangent,
    source: {
      ...getSectionSource(section),
      distance: section.startDistance
    },
    metrics: {
      offset
    }
  };
}

function compileMidpointArrowAnnotations(
  path: PreparedTracingPath,
  section: TracingSection,
  options: MidpointArrowAnnotationOptions | undefined
): MidpointArrowAnnotation[] {
  const resolved = resolveArrowOptions(path, options || {}, "midpoint");
  const density = options?.density ?? DEFAULT_MIDPOINT_DENSITY;
  const sectionLength = section.endDistance - section.startDistance;
  const count = Math.floor(sectionLength / density);

  if (count <= 0 || sectionLength <= DISTANCE_EPSILON) {
    return [];
  }

  const annotations: MidpointArrowAnnotation[] = [];
  for (let ordinal = 0; ordinal < count; ordinal += 1) {
    const distance = section.startDistance + ((ordinal + 1) * sectionLength) / (count + 1);
    const halfLength = Math.min(resolved.length, sectionLength) / 2;
    const startDistance = Math.max(section.startDistance, distance - halfLength);
    const endDistance = Math.min(section.endDistance, distance + halfLength);
    const length = endDistance - startDistance;

    if (length < resolved.minLength) {
      continue;
    }

    const range = buildOffsetPathRange(path, startDistance, endDistance, resolved.offset);
    if (!range) {
      continue;
    }

    annotations.push({
      kind: "midpoint-arrow",
      commands: range.commands,
      ...(resolved.head === false
        ? {}
        : { head: buildArrowhead(range.points[range.points.length - 1] ?? section.startPoint, range.direction, resolved.head) }),
      anchor: getPoseAtOverallDistance(path, distance, "center").point,
      direction: range.direction,
      source: {
        ...getSectionSource(section),
        distance,
        ordinalInSection: ordinal,
        countInSection: count
      },
      metrics: {
        density,
        length,
        offset: resolved.offset,
        ...(resolved.head === false
          ? {}
          : {
              headLength: resolved.head.length,
              headWidth: resolved.head.width,
              tipExtension: resolved.head.tipExtension
            })
      }
    });
  }

  return annotations;
}

function resolveArrowOptions(
  path: PreparedTracingPath,
  options: StartArrowAnnotationOptions | MidpointArrowAnnotationOptions,
  kind: "start" | "midpoint"
): ResolvedArrowOptions {
  const guideHeight = getGuideHeight(path);
  const defaultLength =
    guideHeight *
    (kind === "start" ? DEFAULT_START_ARROW_LENGTH_RATIO : DEFAULT_MIDPOINT_ARROW_LENGTH_RATIO);

  return {
    length: options.length ?? defaultLength,
    minLength: options.minLength ?? guideHeight * DEFAULT_ARROW_MIN_LENGTH_RATIO,
    offset: options.offset ?? guideHeight * DEFAULT_OFFSET_RATIO,
    head:
      options.head === false
        ? false
        : {
            length: options.head?.length ?? guideHeight * DEFAULT_ARROW_HEAD_LENGTH_RATIO,
            width: options.head?.width ?? guideHeight * DEFAULT_ARROW_HEAD_WIDTH_RATIO,
            tipExtension:
              options.head?.tipExtension ?? guideHeight * DEFAULT_ARROW_HEAD_TIP_EXTENSION_RATIO
          }
  };
}

function buildOffsetPathRange(
  path: PreparedTracingPath,
  startDistance: number,
  endDistance: number,
  lateralOffset: number
): PathRange | null {
  if (endDistance <= startDistance) {
    return null;
  }

  const distances = [startDistance];
  let strokeOffset = 0;

  path.strokes.forEach((stroke) => {
    const strokeStart = strokeOffset;
    const strokeEnd = strokeOffset + stroke.totalLength;
    strokeOffset = strokeEnd;

    if (endDistance < strokeStart || startDistance > strokeEnd) {
      return;
    }

    stroke.samples.forEach((sample) => {
      const overallDistance = strokeStart + sample.distanceAlongStroke;
      if (overallDistance > startDistance && overallDistance < endDistance) {
        distances.push(overallDistance);
      }
    });
  });

  distances.push(endDistance);

  const points = distances
    .sort((a, b) => a - b)
    .map((distance, index, sortedDistances) => {
      const bias =
        index === 0 ? "forward" : index === sortedDistances.length - 1 ? "backward" : "center";
      return offsetPosePoint(getPoseAtOverallDistance(path, distance, bias), lateralOffset);
    })
    .filter((point, index, allPoints) => {
      const previous = allPoints[index - 1];
      return !previous || pointDistance(point, previous) > 0.01;
    });

  const [firstPoint, ...remainingPoints] = points;
  if (!firstPoint || points.length < 2) {
    return null;
  }

  const commands: AnnotationPathCommand[] = [{ type: "move", to: firstPoint }];
  remainingPoints.forEach((point) => {
    commands.push({ type: "line", to: point });
  });

  return {
    commands,
    points,
    direction: getPolylineEndDirection(points, getPoseAtOverallDistance(path, endDistance, "backward").tangent)
  };
}

function getStrokeRanges(path: PreparedTracingPath): StrokeRange[] {
  let startDistance = 0;
  return path.strokes.map((stroke, strokeIndex) => {
    const range = {
      strokeIndex,
      startDistance,
      endDistance: startDistance + stroke.totalLength
    };
    startDistance = range.endDistance;
    return range;
  });
}

function setSectionStart(
  starts: Map<number, TracingSectionStartReason>,
  distance: number,
  reason: TracingSectionStartReason
): void {
  const existingDistance = [...starts.keys()].find(
    (candidate) => Math.abs(candidate - distance) <= DISTANCE_EPSILON
  );
  const key = existingDistance ?? distance;
  const existingReason = starts.get(key);

  if (!existingReason || getStartReasonPriority(reason) > getStartReasonPriority(existingReason)) {
    starts.set(key, reason);
  }
}

function getStartReasonPriority(reason: TracingSectionStartReason): number {
  if (reason === "path-start") {
    return 3;
  }
  if (reason === "retrace-turn") {
    return 2;
  }
  return 1;
}

function findGroupAtSectionStart(
  groups: TracingGroup[],
  startDistance: number
): TracingGroup | undefined {
  return (
    groups.find((group) => Math.abs(group.startDistance - startDistance) <= DISTANCE_EPSILON) ??
    groups.find(
      (group) =>
        startDistance >= group.startDistance - DISTANCE_EPSILON &&
        startDistance <= group.endDistance + DISTANCE_EPSILON
    )
  );
}

function findSectionStartingAt(
  sections: TracingSection[],
  distance: number
): TracingSection | undefined {
  return sections.find((section) => Math.abs(section.startDistance - distance) <= DISTANCE_EPSILON);
}

function findSectionContainingDistance(
  sections: TracingSection[],
  distance: number
): TracingSection | undefined {
  return sections.find(
    (section) =>
      distance >= section.startDistance - DISTANCE_EPSILON &&
      distance <= section.endDistance + DISTANCE_EPSILON
  );
}

function getSectionSource(section: TracingSection): AnnotationSource {
  return {
    sectionIndex: section.index,
    strokeIndex: section.strokeIndex,
    startDistance: section.startDistance,
    endDistance: section.endDistance
  };
}

function findStrokeIndexForOverallDistance(
  path: PreparedTracingPath,
  targetDistance: number
): number {
  let strokeOffset = 0;

  for (let index = 0; index < path.strokes.length; index += 1) {
    const stroke = path.strokes[index];
    if (!stroke) {
      continue;
    }

    const strokeEnd = strokeOffset + stroke.totalLength;
    if (targetDistance <= strokeEnd + DISTANCE_EPSILON || index === path.strokes.length - 1) {
      return index;
    }

    strokeOffset = strokeEnd;
  }

  return 0;
}

function interpolateSamplePoint(
  samples: TracingSample[],
  distanceAlongStroke: number
): Point {
  if (samples.length === 0) {
    return { x: 0, y: 0 };
  }

  if (samples.length === 1 || distanceAlongStroke <= 0) {
    const sample = samples[0];
    return sample ? { x: sample.x, y: sample.y } : { x: 0, y: 0 };
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
}

function getPointAtOverallDistance(path: PreparedTracingPath, targetDistance: number): Point {
  let remaining = targetDistance;

  for (let index = 0; index < path.strokes.length; index += 1) {
    const stroke = path.strokes[index];
    if (!stroke) {
      continue;
    }

    if (remaining <= stroke.totalLength || index === path.strokes.length - 1) {
      return interpolateSamplePoint(
        stroke.samples,
        Math.max(0, Math.min(remaining, stroke.totalLength))
      );
    }

    remaining -= stroke.totalLength;
  }

  return { x: 0, y: 0 };
}

function getPoseAtOverallDistance(
  path: PreparedTracingPath,
  targetDistance: number,
  bias: PoseAtDistanceBias = "center"
): { point: Point; tangent: Point } {
  const totalLength = getTotalLength(path);
  const clampedDistance = Math.max(0, Math.min(targetDistance, totalLength));
  const point = getPointAtOverallDistance(path, clampedDistance);
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

  const fromPoint = getPointAtOverallDistance(path, fromDistance);
  const toPoint = getPointAtOverallDistance(path, toDistance);

  return {
    point,
    tangent: normalizeVector({
      x: toPoint.x - fromPoint.x,
      y: toPoint.y - fromPoint.y
    })
  };
}

function getTotalLength(path: PreparedTracingPath): number {
  return path.strokes.reduce((sum, stroke) => sum + stroke.totalLength, 0);
}

function getGuideHeight(path: PreparedTracingPath): number {
  const guideHeight = Math.abs(path.guides.baseline - path.guides.xHeight);
  if (Number.isFinite(guideHeight) && guideHeight > 0) {
    return guideHeight;
  }

  const boundsHeight = Math.abs(path.bounds.maxY - path.bounds.minY);
  return Number.isFinite(boundsHeight) && boundsHeight > 0 ? boundsHeight : REFERENCE_GUIDE_HEIGHT;
}

function offsetPosePoint(pose: { point: Point; tangent: Point }, lateralOffset: number): Point {
  const normal = { x: -pose.tangent.y, y: pose.tangent.x };
  return {
    x: pose.point.x + normal.x * lateralOffset,
    y: pose.point.y + normal.y * lateralOffset
  };
}

function buildArrowhead(
  pathEnd: Point,
  direction: Point,
  options: { length: number; width: number; tipExtension: number }
): AnnotationArrowHead {
  const unitDirection = normalizeVector(direction);
  const tip = {
    x: pathEnd.x + unitDirection.x * options.tipExtension,
    y: pathEnd.y + unitDirection.y * options.tipExtension
  };
  const normal = {
    x: -unitDirection.y,
    y: unitDirection.x
  };
  const baseCenter = {
    x: tip.x - unitDirection.x * options.length,
    y: tip.y - unitDirection.y * options.length
  };
  const halfWidth = options.width / 2;

  return {
    tip,
    direction: unitDirection,
    polygon: [
      tip,
      {
        x: baseCenter.x + normal.x * halfWidth,
        y: baseCenter.y + normal.y * halfWidth
      },
      {
        x: baseCenter.x - normal.x * halfWidth,
        y: baseCenter.y - normal.y * halfWidth
      }
    ]
  };
}

function getPolylineEndDirection(points: Point[], fallback: Point): Point {
  const tip = points[points.length - 1];
  if (!tip) {
    return normalizeVector(fallback);
  }

  for (let index = points.length - 2; index >= 0; index -= 1) {
    const point = points[index];
    if (!point) {
      continue;
    }

    const distance = pointDistance(tip, point);
    if (distance >= 1) {
      return normalizeVector({
        x: tip.x - point.x,
        y: tip.y - point.y
      });
    }
  }

  return normalizeVector(fallback);
}

function normalizeVector(vector: Point): Point {
  const length = Math.hypot(vector.x, vector.y);
  return length > 0.0001
    ? {
        x: vector.x / length,
        y: vector.y / length
      }
    : { x: 1, y: 0 };
}

function pointDistance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
