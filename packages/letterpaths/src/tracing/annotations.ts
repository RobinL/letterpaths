import type { Point } from "../types";
import type { PreparedTracingPath, TracingSample } from "./compiler";
import {
  compileFormationArrows,
  formationArrowCommandsToSvgPathData,
  type FormationArrow,
  type FormationArrowHead,
  type FormationArrowHeadOptions,
  type FormationArrowPathCommand,
  type RetraceTurnArrowOptions
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
  groupIndex?: number;
  startDistance: number;
  endDistance: number;
  startPoint: Point;
  endPoint: Point;
  startTangent: Point;
  endTangent: Point;
  startReason: TracingSectionStartReason;
  kind: "base" | "retrace";
  matchedEarlierDistance?: number;
};

export type TracingSectionAnalysis = {
  sections: TracingSection[];
  totalLength: number;
};

export type AnalyzeTracingSectionsOptions = {
  /** Include starts of drawable strokes after lifts. Defaults to true. */
  includeStrokeStarts?: boolean;
  /** Include confirmed retrace restart points. Defaults to true. */
  includeRetraceTurns?: boolean;
  /** Passed to retrace group analysis if groups are not supplied. */
  groupAnalysis?: AnalyzeTracingGroupsOptions;
  /** Optional precomputed groups for callers that already ran analyzeTracingGroups(). */
  groups?: TracingGroup[];
};

export type AnnotationSource = {
  sectionIndex: number;
  strokeIndex: number;
  startDistance: number;
  endDistance: number;
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
  metrics: FormationArrow["metrics"];
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
    length: number;
    density: number;
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

export type TurningPointAnnotationOptions = RetraceTurnArrowOptions;

export type StartArrowAnnotationOptions = {
  length?: number;
  offset?: number;
  side?: "left" | "right";
  minLength?: number;
  head?: false | FormationArrowHeadOptions;
};

export type DrawOrderNumberAnnotationOptions = {
  offset?: number;
  side?: "left" | "right";
};

export type MidpointArrowAnnotationOptions = {
  /** Path length threshold for each midpoint arrow: one arrow above x, two above 2x, etc. */
  density?: number;
  length?: number;
  offset?: number;
  side?: "left" | "right";
  minSectionLength?: number;
  head?: false | FormationArrowHeadOptions;
};

export type CompileFormationAnnotationsOptions = {
  sections?: TracingSection[];
  sectionAnalysis?: AnalyzeTracingSectionsOptions;
  turningPoints?: false | TurningPointAnnotationOptions;
  startArrows?: false | StartArrowAnnotationOptions;
  drawOrderNumbers?: false | DrawOrderNumberAnnotationOptions;
  midpointArrows?: false | MidpointArrowAnnotationOptions;
};

type PoseAtDistanceBias = "forward" | "backward" | "center";

type ResolvedArrowHeadOptions = {
  length: number;
  width: number;
  tipExtension: number;
};

type PathRangeResult = {
  commands: AnnotationPathCommand[];
  anchor: Point;
  direction: Point;
};

type SectionCut = {
  distance: number;
  reason: TracingSectionStartReason;
  groupIndex?: number;
  kind: "base" | "retrace";
  matchedEarlierDistance?: number;
};

const REFERENCE_GUIDE_HEIGHT = 380;
const DEFAULT_HEAD_LENGTH_RATIO = 26 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_HEAD_WIDTH_RATIO = 22 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_HEAD_TIP_EXTENSION_RATIO = 11 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_START_ARROW_LENGTH_RATIO = 54 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_START_ARROW_MIN_LENGTH_RATIO = 22 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_NUMBER_OFFSET_RATIO = 0;
const DEFAULT_MIDPOINT_ARROW_DENSITY_RATIO = 1;
const DEFAULT_MIDPOINT_ARROW_LENGTH_RATIO = 42 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_MIDPOINT_MIN_SECTION_LENGTH_RATIO = 0.5;
const DISTANCE_EPSILON = 0.001;

export function analyzeTracingSections(
  path: PreparedTracingPath,
  options: AnalyzeTracingSectionsOptions = {}
): TracingSectionAnalysis {
  const includeStrokeStarts = options.includeStrokeStarts ?? true;
  const includeRetraceTurns = options.includeRetraceTurns ?? true;
  const totalLength = getTotalLength(path);
  const strokeStarts = getStrokeStarts(path);
  const groups =
    options.groups ??
    (includeRetraceTurns
      ? analyzeTracingGroups(path, options.groupAnalysis ?? {}).groups
      : []);
  const cuts: SectionCut[] = [
    {
      distance: 0,
      reason: "path-start",
      groupIndex: findGroupIndexForDistance(groups, 0),
      kind: findGroupForDistance(groups, 0)?.kind ?? "base",
      matchedEarlierDistance: findGroupForDistance(groups, 0)?.matchedEarlierDistance
    }
  ];

  if (includeStrokeStarts) {
    strokeStarts.slice(1).forEach((strokeStart) => {
      const group = findGroupForDistance(groups, strokeStart);
      cuts.push({
        distance: strokeStart,
        reason: "stroke-start",
        groupIndex: group?.index,
        kind: group?.kind ?? "base",
        matchedEarlierDistance: group?.matchedEarlierDistance
      });
    });
  }

  if (includeRetraceTurns) {
    groups.forEach((group) => {
      if (group.index === 0) {
        return;
      }

      cuts.push({
        distance: group.startDistance,
        reason: "retrace-turn",
        groupIndex: group.index,
        kind: group.kind,
        matchedEarlierDistance: group.matchedEarlierDistance
      });
    });
  }

  const sortedCuts = mergeSectionCuts(
    cuts.filter((cut) => cut.distance >= 0 && cut.distance <= totalLength + DISTANCE_EPSILON)
  );
  const sections: TracingSection[] = [];

  sortedCuts.forEach((cut, cutIndex) => {
    const nextCut = sortedCuts[cutIndex + 1];
    const endDistance = nextCut ? nextCut.distance : totalLength;
    if (endDistance < cut.distance - DISTANCE_EPSILON) {
      return;
    }

    const strokeIndex = findStrokeIndexForDistance(strokeStarts, cut.distance);
    const startPose = getPoseAtOverallDistance(path, cut.distance, "forward");
    const endPose = getPoseAtOverallDistance(path, endDistance, "backward");
    sections.push({
      index: sections.length,
      strokeIndex,
      ...(cut.groupIndex === undefined ? {} : { groupIndex: cut.groupIndex }),
      startDistance: cut.distance,
      endDistance,
      startPoint: startPose.point,
      endPoint: endPose.point,
      startTangent: startPose.tangent,
      endTangent: endPose.tangent,
      startReason: cut.reason,
      kind: cut.kind,
      ...(cut.matchedEarlierDistance === undefined
        ? {}
        : { matchedEarlierDistance: cut.matchedEarlierDistance })
    });
  });

  return {
    sections,
    totalLength
  };
}

export function compileFormationAnnotations(
  path: PreparedTracingPath,
  options: CompileFormationAnnotationsOptions = {}
): FormationAnnotation[] {
  const sections =
    options.sections ??
    analyzeTracingSections(path, options.sectionAnalysis ?? {}).sections;
  const annotations: FormationAnnotation[] = [];

  if (options.turningPoints !== false) {
    annotations.push(...compileTurningPointAnnotations(path, sections, options.turningPoints));
  }

  if (options.drawOrderNumbers !== false) {
    annotations.push(...compileDrawOrderNumberAnnotations(path, sections, options.drawOrderNumbers));
  }

  if (options.startArrows !== false) {
    annotations.push(...compileStartArrowAnnotations(path, sections, options.startArrows));
  }

  if (options.midpointArrows !== false) {
    annotations.push(...compileMidpointArrowAnnotations(path, sections, options.midpointArrows));
  }

  return annotations.sort(compareAnnotations);
}

export function annotationCommandsToSvgPathData(
  commands: AnnotationPathCommand[]
): string {
  return formationArrowCommandsToSvgPathData(commands);
}

function compileTurningPointAnnotations(
  path: PreparedTracingPath,
  sections: TracingSection[],
  options: TurningPointAnnotationOptions = {}
): TurningPointAnnotation[] {
  const arrows = compileFormationArrows(path, { retraceTurns: options });

  return arrows
    .map((arrow) => {
      const section =
        findSectionAtStartDistance(sections, arrow.source.turnDistance) ??
        findSectionForDistance(sections, arrow.source.turnDistance);
      if (!section) {
        return null;
      }

      const previousSection =
        sections[section.index - 1] ??
        findSectionForDistance(sections, Math.max(0, arrow.source.turnDistance - DISTANCE_EPSILON));

      const annotation: TurningPointAnnotation = {
        kind: "turning-point",
        turnKind: "retrace-u-turn",
        commands: arrow.commands,
        ...(arrow.head ? { head: arrow.head } : {}),
        source: {
          sectionIndex: section.index,
          previousSectionIndex: previousSection?.index ?? Math.max(0, section.index - 1),
          strokeIndex: section.strokeIndex,
          previousGroupIndex: arrow.source.previousGroupIndex,
          groupIndex: arrow.source.groupIndex,
          startDistance: arrow.source.startDistance,
          turnDistance: arrow.source.turnDistance,
          endDistance: arrow.source.endDistance,
          ...(section.matchedEarlierDistance === undefined
            ? {}
            : { matchedEarlierDistance: section.matchedEarlierDistance })
        },
        metrics: arrow.metrics
      };

      return annotation;
    })
    .filter((annotation): annotation is TurningPointAnnotation => annotation !== null);
}

function compileStartArrowAnnotations(
  path: PreparedTracingPath,
  sections: TracingSection[],
  options: StartArrowAnnotationOptions = {}
): StartArrowAnnotation[] {
  const guideHeight = getGuideHeight(path);
  const length = options.length ?? guideHeight * DEFAULT_START_ARROW_LENGTH_RATIO;
  const minLength = options.minLength ?? guideHeight * DEFAULT_START_ARROW_MIN_LENGTH_RATIO;
  const offset = resolveSignedOffset(options.offset ?? 0, options.side ?? "left");
  const head = resolveHeadOptions(path, options.head);

  return sections
    .map((section) => {
      const sectionLength = section.endDistance - section.startDistance;
      if (sectionLength < minLength || sectionLength <= DISTANCE_EPSILON) {
        return null;
      }

      const endDistance = Math.min(section.endDistance, section.startDistance + length);
      if (endDistance - section.startDistance < minLength) {
        return null;
      }

      const range = buildPathRange(path, section.startDistance, endDistance, offset);
      if (!range) {
        return null;
      }

      return {
        kind: "start-arrow",
        commands: range.commands,
        ...(head ? { head: buildArrowhead(range.anchor, range.direction, head) } : {}),
        anchor: range.anchor,
        direction: range.direction,
        source: {
          sectionIndex: section.index,
          strokeIndex: section.strokeIndex,
          startDistance: section.startDistance,
          endDistance: section.endDistance,
          distance: section.startDistance
        },
        metrics: {
          length: endDistance - section.startDistance,
          offset,
          ...(head
            ? {
                headLength: head.length,
                headWidth: head.width,
                tipExtension: head.tipExtension
              }
            : {})
        }
      } satisfies StartArrowAnnotation;
    })
    .filter((annotation): annotation is StartArrowAnnotation => annotation !== null);
}

function compileDrawOrderNumberAnnotations(
  path: PreparedTracingPath,
  sections: TracingSection[],
  options: DrawOrderNumberAnnotationOptions = {}
): DrawOrderNumberAnnotation[] {
  const guideHeight = getGuideHeight(path);
  const offset = resolveSignedOffset(
    options.offset ?? guideHeight * DEFAULT_NUMBER_OFFSET_RATIO,
    options.side ?? "left"
  );

  return sections.map((section) => {
    const anchor = offsetPosePoint(
      { point: section.startPoint, tangent: section.startTangent },
      offset
    );

    return {
      kind: "draw-order-number",
      value: section.index + 1,
      text: String(section.index + 1),
      point: section.startPoint,
      anchor,
      direction: section.startTangent,
      source: {
        sectionIndex: section.index,
        strokeIndex: section.strokeIndex,
        startDistance: section.startDistance,
        endDistance: section.endDistance,
        distance: section.startDistance
      },
      metrics: {
        offset
      }
    };
  });
}

function compileMidpointArrowAnnotations(
  path: PreparedTracingPath,
  sections: TracingSection[],
  options: MidpointArrowAnnotationOptions = {}
): MidpointArrowAnnotation[] {
  const guideHeight = getGuideHeight(path);
  const defaultDensity = guideHeight * DEFAULT_MIDPOINT_ARROW_DENSITY_RATIO;
  const density = options.density ?? defaultDensity;
  const safeDensity = Number.isFinite(density) && density > 0 ? density : defaultDensity;
  const length = options.length ?? guideHeight * DEFAULT_MIDPOINT_ARROW_LENGTH_RATIO;
  const minSectionLength =
    options.minSectionLength ?? guideHeight * DEFAULT_MIDPOINT_MIN_SECTION_LENGTH_RATIO;
  const offset = resolveSignedOffset(options.offset ?? 0, options.side ?? "left");
  const head = resolveHeadOptions(path, options.head);
  const annotations: MidpointArrowAnnotation[] = [];

  sections.forEach((section) => {
    const sectionLength = section.endDistance - section.startDistance;
    if (sectionLength < minSectionLength || sectionLength <= DISTANCE_EPSILON) {
      return;
    }

    const count = Math.max(0, Math.floor(sectionLength / safeDensity));
    if (count === 0) {
      return;
    }

    for (let index = 0; index < count; index += 1) {
      const distance = section.startDistance + ((index + 1) * sectionLength) / (count + 1);
      const startDistance = Math.max(section.startDistance, distance - length / 2);
      const endDistance = Math.min(section.endDistance, distance + length / 2);
      const range = buildPathRange(path, startDistance, endDistance, offset);
      if (!range) {
        continue;
      }

      annotations.push({
        kind: "midpoint-arrow",
        commands: range.commands,
        ...(head ? { head: buildArrowhead(range.anchor, range.direction, head) } : {}),
        anchor: range.anchor,
        direction: range.direction,
        source: {
          sectionIndex: section.index,
          strokeIndex: section.strokeIndex,
          startDistance: section.startDistance,
          endDistance: section.endDistance,
          distance,
          ordinalInSection: index,
          countInSection: count
        },
        metrics: {
          length: endDistance - startDistance,
          density: safeDensity,
          offset,
          ...(head
            ? {
                headLength: head.length,
                headWidth: head.width,
                tipExtension: head.tipExtension
              }
            : {})
        }
      });
    }
  });

  return annotations;
}

function mergeSectionCuts(cuts: SectionCut[]): SectionCut[] {
  const priority: Record<TracingSectionStartReason, number> = {
    "path-start": 0,
    "stroke-start": 1,
    "retrace-turn": 2
  };
  const sortedCuts = [...cuts].sort((a, b) => a.distance - b.distance);
  const merged: SectionCut[] = [];

  sortedCuts.forEach((cut) => {
    const previous = merged[merged.length - 1];
    if (!previous || Math.abs(previous.distance - cut.distance) > DISTANCE_EPSILON) {
      merged.push(cut);
      return;
    }

    if (priority[cut.reason] > priority[previous.reason]) {
      merged[merged.length - 1] = cut;
    }
  });

  return merged;
}

function compareAnnotations(a: FormationAnnotation, b: FormationAnnotation): number {
  const distanceDifference = getAnnotationDistance(a) - getAnnotationDistance(b);
  if (Math.abs(distanceDifference) > DISTANCE_EPSILON) {
    return distanceDifference;
  }

  const kindRank: Record<FormationAnnotation["kind"], number> = {
    "turning-point": 0,
    "draw-order-number": 1,
    "start-arrow": 2,
    "midpoint-arrow": 3
  };
  const kindDifference = kindRank[a.kind] - kindRank[b.kind];
  if (kindDifference !== 0) {
    return kindDifference;
  }

  if (a.kind === "midpoint-arrow" && b.kind === "midpoint-arrow") {
    return a.source.ordinalInSection - b.source.ordinalInSection;
  }

  return a.source.sectionIndex - b.source.sectionIndex;
}

function getAnnotationDistance(annotation: FormationAnnotation): number {
  if ("distance" in annotation.source) {
    return annotation.source.distance;
  }

  return annotation.source.turnDistance;
}

function buildPathRange(
  path: PreparedTracingPath,
  startDistance: number,
  endDistance: number,
  lateralOffset: number
): PathRangeResult | null {
  if (endDistance - startDistance <= DISTANCE_EPSILON) {
    return null;
  }

  const samples = buildOffsetPathSamplesFromOverallDistanceRange(
    path,
    startDistance,
    endDistance,
    lateralOffset
  );
  if (samples.length < 2) {
    return null;
  }

  const commands: AnnotationPathCommand[] = [];
  const [firstSample, ...remainingSamples] = samples;
  if (!firstSample) {
    return null;
  }

  commands.push({ type: "move", to: firstSample.point });
  remainingSamples.forEach((sample) => {
    commands.push({ type: "line", to: sample.point });
  });

  const lastSample = samples[samples.length - 1];
  if (!lastSample) {
    return null;
  }

  return {
    commands,
    anchor: lastSample.point,
    direction: getPolylineEndDirection(
      samples.map((sample) => sample.point),
      getPoseAtOverallDistance(path, endDistance, "backward").tangent
    )
  };
}

function buildOffsetPathSamplesFromOverallDistanceRange(
  path: PreparedTracingPath,
  startDistance: number,
  endDistance: number,
  lateralOffset: number
): Array<{ distance: number; point: Point }> {
  if (endDistance <= startDistance) {
    return [];
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

  return distances
    .map((distance, index) => {
      const bias =
        index === 0 ? "forward" : index === distances.length - 1 ? "backward" : "center";
      return {
        distance,
        point: offsetPosePoint(getPoseAtOverallDistance(path, distance, bias), lateralOffset)
      };
    })
    .filter((sample, index, samples) => {
      const previous = samples[index - 1];
      return (
        !previous ||
        Math.hypot(sample.point.x - previous.point.x, sample.point.y - previous.point.y) > 0.01
      );
    });
}

function resolveHeadOptions(
  path: PreparedTracingPath,
  options: false | FormationArrowHeadOptions | undefined
): false | ResolvedArrowHeadOptions {
  if (options === false) {
    return false;
  }

  const guideHeight = getGuideHeight(path);

  return {
    length: options?.length ?? guideHeight * DEFAULT_HEAD_LENGTH_RATIO,
    width: options?.width ?? guideHeight * DEFAULT_HEAD_WIDTH_RATIO,
    tipExtension: options?.tipExtension ?? guideHeight * DEFAULT_HEAD_TIP_EXTENSION_RATIO
  };
}

function buildArrowhead(
  pathEnd: Point,
  direction: Point,
  options: ResolvedArrowHeadOptions
): FormationArrowHead {
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

function getStrokeStarts(path: PreparedTracingPath): number[] {
  const starts: number[] = [];
  let offset = 0;

  path.strokes.forEach((stroke) => {
    starts.push(offset);
    offset += stroke.totalLength;
  });

  return starts;
}

function findStrokeIndexForDistance(strokeStarts: number[], distance: number): number {
  for (let index = strokeStarts.length - 1; index >= 0; index -= 1) {
    const strokeStart = strokeStarts[index];
    if (strokeStart !== undefined && distance >= strokeStart - DISTANCE_EPSILON) {
      return index;
    }
  }

  return 0;
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

function getPointAtOverallDistance(
  path: PreparedTracingPath,
  targetDistance: number
): Point {
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

  if (Math.abs(toDistance - fromDistance) < DISTANCE_EPSILON) {
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

function interpolateSamplePoint(
  samples: TracingSample[],
  distanceAlongStroke: number
): Point {
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
}

function offsetPosePoint(
  pose: { point: Point; tangent: Point },
  lateralOffset: number
): Point {
  const normal = { x: -pose.tangent.y, y: pose.tangent.x };
  return {
    x: pose.point.x + normal.x * lateralOffset,
    y: pose.point.y + normal.y * lateralOffset
  };
}

function resolveSignedOffset(offset: number, side: "left" | "right"): number {
  return side === "left" ? offset : -offset;
}

function findGroupForDistance(
  groups: TracingGroup[],
  distance: number
): TracingGroup | undefined {
  return groups.find(
    (group) =>
      distance >= group.startDistance - DISTANCE_EPSILON &&
      distance <= group.endDistance + DISTANCE_EPSILON
  );
}

function findGroupIndexForDistance(groups: TracingGroup[], distance: number): number | undefined {
  return findGroupForDistance(groups, distance)?.index;
}

function findSectionAtStartDistance(
  sections: TracingSection[],
  distance: number
): TracingSection | undefined {
  return sections.find((section) => Math.abs(section.startDistance - distance) <= DISTANCE_EPSILON);
}

function findSectionForDistance(
  sections: TracingSection[],
  distance: number
): TracingSection | undefined {
  return sections.find(
    (section) =>
      distance >= section.startDistance - DISTANCE_EPSILON &&
      distance <= section.endDistance + DISTANCE_EPSILON
  );
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

    const distance = Math.hypot(tip.x - point.x, tip.y - point.y);
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
