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

export type DirectionalDashAnnotation = {
  kind: "directional-dash";
  commands: AnnotationPathCommand[];
  head?: AnnotationArrowHead;
  tailHead?: AnnotationArrowHead;
  anchor: Point;
  direction: Point;
  source: AnnotationSource & {
    distance: number;
    ordinalInSection: number;
    countInSection: number;
    directionality: "unidirectional" | "bidirectional";
  };
  metrics: {
    spacing: number;
    length: number;
    offset: number;
    headLength?: number;
    headWidth?: number;
    tipExtension?: number;
  };
};

export type FormationAnnotation =
  | DirectionalDashAnnotation
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

export type DirectionalDashAnnotationOptions = {
  /** Distance between consecutive dash centres along each section. */
  spacing?: number;
  /** Length of each dash measured along the tracing path. */
  length?: number;
  offset?: number;
  side?: "left" | "right";
  minSectionLength?: number;
  head?: false | FormationArrowHeadOptions;
};

export type CompileFormationAnnotationsOptions = {
  sections?: TracingSection[];
  sectionAnalysis?: AnalyzeTracingSectionsOptions;
  directionalDashes?: false | DirectionalDashAnnotationOptions;
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
  startAnchor: Point;
  startDirection: Point;
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

type StrokePosition = {
  stroke: PreparedTracingPath["strokes"][number];
  distanceAlongStroke: number;
};

type FlattenedTracingSample = TracingSample & {
  overallDistance: number;
};

type DistanceRange = {
  startDistance: number;
  endDistance: number;
};

type DirectionalDashCoverage = {
  earlier: DistanceRange[];
  later: DistanceRange[];
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
const DEFAULT_DIRECTIONAL_DASH_SPACING_RATIO = 84 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_DIRECTIONAL_DASH_LENGTH_RATIO = 68 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_DIRECTIONAL_DASH_MIN_SECTION_LENGTH_RATIO = 60 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_DIRECTIONAL_DASH_LENGTH_TO_SPACING_RATIO = 0.8;
const DEFAULT_DIRECTIONAL_DASH_MATCH_PROXIMITY_RATIO = 28 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_DIRECTIONAL_DASH_MATCH_MIN_PATH_SEPARATION_RATIO = 90 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_DIRECTIONAL_DASH_MATCH_PADDING_RATIO = 6 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_DIRECTIONAL_DASH_MATCH_OPPOSITE_DIRECTION_DOT_THRESHOLD = -0.2;
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

  if (options.directionalDashes) {
    annotations.push(...compileDirectionalDashAnnotations(path, sections, options.directionalDashes));
  }

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

function compileDirectionalDashAnnotations(
  path: PreparedTracingPath,
  sections: TracingSection[],
  options: DirectionalDashAnnotationOptions = {}
): DirectionalDashAnnotation[] {
  const guideHeight = getGuideHeight(path);
  const defaultSpacing = guideHeight * DEFAULT_DIRECTIONAL_DASH_SPACING_RATIO;
  const spacing = options.spacing ?? defaultSpacing;
  const safeSpacing =
    Number.isFinite(spacing) && spacing > DISTANCE_EPSILON ? spacing : defaultSpacing;
  const head = resolveHeadOptions(path, options.head);
  const defaultLength = Math.min(
    safeSpacing * DEFAULT_DIRECTIONAL_DASH_LENGTH_TO_SPACING_RATIO,
    Math.max(
      guideHeight * DEFAULT_DIRECTIONAL_DASH_LENGTH_RATIO,
      head ? head.length * 2.4 : guideHeight * DEFAULT_DIRECTIONAL_DASH_LENGTH_RATIO
    )
  );
  const length = options.length ?? defaultLength;
  const safeLength =
    Number.isFinite(length) && length > DISTANCE_EPSILON
      ? Math.min(length, safeSpacing)
      : defaultLength;
  const minSectionLength =
    options.minSectionLength ??
    Math.max(safeLength * 0.75, guideHeight * DEFAULT_DIRECTIONAL_DASH_MIN_SECTION_LENGTH_RATIO);
  const offset = resolveSignedOffset(options.offset ?? 0, options.side ?? "left");
  const coverage = analyzeDirectionalDashCoverage(path, sections);
  const annotations: DirectionalDashAnnotation[] = [];

  sections.forEach((section) => {
    const sectionLength = section.endDistance - section.startDistance;
    if (sectionLength < minSectionLength || sectionLength <= DISTANCE_EPSILON) {
      return;
    }

    const candidateDistances = collectDirectionalDashCandidateDistances(
      section.startDistance,
      section.endDistance,
      safeSpacing,
      safeLength,
      minSectionLength
    );
    if (candidateDistances.length === 0) {
      return;
    }

    const sectionAnnotations = candidateDistances
      .map((distance, index) => {
        const startDistance = Math.max(section.startDistance, distance - safeLength / 2);
        const endDistance = Math.min(section.endDistance, distance + safeLength / 2);
        const range = buildPathRange(path, startDistance, endDistance, offset);
        if (!range) {
          return null;
        }

        const isAtRetraceTurn = section.startReason === "retrace-turn" && index === 0;
        const isBidirectional =
          isAtRetraceTurn || isDistanceWithinRanges(distance, coverage.earlier);

        return {
          distance,
          range,
          length: endDistance - startDistance,
          isLaterDuplicate: isDistanceWithinRanges(distance, coverage.later),
          directionality: isBidirectional ? "bidirectional" : "unidirectional"
        };
      })
      .filter(
        (
          entry
        ): entry is {
          distance: number;
          range: PathRangeResult;
          length: number;
          isLaterDuplicate: boolean;
          directionality: DirectionalDashAnnotation["source"]["directionality"];
        } => entry !== null
      );

    if (sectionAnnotations.length === 0) {
      return;
    }

    const keptSectionAnnotations = sectionAnnotations.filter(
      (entry, index) => index === 0 || !entry.isLaterDuplicate
    );
    const firstAnnotation = keptSectionAnnotations[0];
    if (firstAnnotation?.isLaterDuplicate) {
      removeClosestDirectionalDashAnnotation(
        annotations,
        path,
        firstAnnotation.distance,
        safeSpacing,
        section.index
      );
    }

    keptSectionAnnotations.forEach((entry) => {
      annotations.push({
        kind: "directional-dash",
        commands: entry.range.commands,
        ...(head ? { head: buildArrowhead(entry.range.anchor, entry.range.direction, head) } : {}),
        ...(head && entry.directionality === "bidirectional"
          ? {
              tailHead: buildArrowhead(
                entry.range.startAnchor,
                negateVector(entry.range.startDirection),
                head
              )
            }
          : {}),
        anchor: entry.range.anchor,
        direction: entry.range.direction,
        source: {
          sectionIndex: section.index,
          strokeIndex: section.strokeIndex,
          startDistance: section.startDistance,
          endDistance: section.endDistance,
          distance: entry.distance,
          ordinalInSection: 0,
          countInSection: 0,
          directionality: entry.directionality
        },
        metrics: {
          spacing: safeSpacing,
          length: entry.length,
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
    });
  });

  finalizeDirectionalDashAnnotationSections(annotations);
  return annotations;
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
    "directional-dash": 0,
    "turning-point": 1,
    "draw-order-number": 2,
    "start-arrow": 3,
    "midpoint-arrow": 4
  };
  const kindDifference = kindRank[a.kind] - kindRank[b.kind];
  if (kindDifference !== 0) {
    return kindDifference;
  }

  if (a.kind === "directional-dash" && b.kind === "directional-dash") {
    return a.source.ordinalInSection - b.source.ordinalInSection;
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

  const points = samples.map((sample) => sample.point);
  const startDirection = getPolylineStartDirection(
    points,
    getPoseAtOverallDistance(path, startDistance, "forward").tangent
  );
  const lastSample = samples[samples.length - 1];
  if (!lastSample) {
    return null;
  }

  return {
    commands,
    startAnchor: firstSample.point,
    startDirection,
    anchor: lastSample.point,
    direction: getPolylineEndDirection(
      points,
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

function flattenTracingSamples(path: PreparedTracingPath): FlattenedTracingSample[] {
  const flattened: FlattenedTracingSample[] = [];
  let strokeOffset = 0;

  path.strokes.forEach((stroke) => {
    stroke.samples.forEach((sample) => {
      flattened.push({
        ...sample,
        overallDistance: strokeOffset + sample.distanceAlongStroke
      });
    });
    strokeOffset += stroke.totalLength;
  });

  return flattened;
}

function analyzeDirectionalDashCoverage(
  path: PreparedTracingPath,
  sections: TracingSection[]
): DirectionalDashCoverage {
  const retraceSections = sections.filter((section) => section.kind === "retrace");
  if (retraceSections.length === 0) {
    return { earlier: [], later: [] };
  }

  const samples = flattenTracingSamples(path);
  if (samples.length === 0) {
    return { earlier: [], later: [] };
  }

  const totalLength = getTotalLength(path);
  const guideHeight = getGuideHeight(path);
  const proximityThreshold = guideHeight * DEFAULT_DIRECTIONAL_DASH_MATCH_PROXIMITY_RATIO;
  const minPathSeparation =
    guideHeight * DEFAULT_DIRECTIONAL_DASH_MATCH_MIN_PATH_SEPARATION_RATIO;
  const intervalPadding = Math.max(
    estimateTracingSampleGap(samples),
    guideHeight * DEFAULT_DIRECTIONAL_DASH_MATCH_PADDING_RATIO
  );
  const matchedEarlierDistances: number[] = [];
  const matchedLaterDistances: number[] = [];

  retraceSections.forEach((section) => {
    const sectionStartIndex = findSampleIndexAtOrAfterDistance(samples, section.startDistance);

    for (let index = sectionStartIndex; index < samples.length; index += 1) {
      const sample = samples[index];
      if (!sample || sample.overallDistance > section.endDistance + DISTANCE_EPSILON) {
        break;
      }

      const matchIndex = findDirectionalDashEarlierMatch(
        samples,
        index,
        sectionStartIndex,
        proximityThreshold,
        minPathSeparation
      );
      if (matchIndex === null) {
        continue;
      }

      matchedEarlierDistances.push(samples[matchIndex]!.overallDistance);
      matchedLaterDistances.push(sample.overallDistance);
    }
  });

  return {
    earlier: mergeMatchedDistancesIntoRanges(matchedEarlierDistances, intervalPadding, totalLength),
    later: mergeMatchedDistancesIntoRanges(matchedLaterDistances, intervalPadding, totalLength)
  };
}

function collectDirectionalDashCandidateDistances(
  startDistance: number,
  endDistance: number,
  spacing: number,
  length: number,
  minSectionLength: number
): number[] {
  const sectionLength = endDistance - startDistance;
  if (sectionLength < minSectionLength || sectionLength <= DISTANCE_EPSILON) {
    return [];
  }

  const candidates: number[] = [];
  let centerDistance = startDistance + length / 2;

  while (centerDistance <= endDistance - length / 2 + DISTANCE_EPSILON) {
    candidates.push(centerDistance);
    centerDistance += spacing;
  }

  if (candidates.length === 0) {
    candidates.push(startDistance + sectionLength / 2);
  }

  return candidates;
}

function findDirectionalDashEarlierMatch(
  samples: FlattenedTracingSample[],
  currentIndex: number,
  maxEarlierIndexExclusive: number,
  proximityThreshold: number,
  minPathSeparation: number
): number | null {
  const current = samples[currentIndex];
  if (!current) {
    return null;
  }

  let bestIndex: number | null = null;
  let bestDistance = Infinity;

  for (let earlierIndex = 0; earlierIndex < maxEarlierIndexExclusive; earlierIndex += 1) {
    const earlier = samples[earlierIndex];
    if (!earlier) {
      continue;
    }

    if (current.overallDistance - earlier.overallDistance < minPathSeparation) {
      continue;
    }

    const spatialDistance = Math.hypot(current.x - earlier.x, current.y - earlier.y);
    if (spatialDistance > proximityThreshold || spatialDistance >= bestDistance) {
      continue;
    }

    const directionDot =
      current.tangent.x * earlier.tangent.x + current.tangent.y * earlier.tangent.y;
    if (directionDot > DEFAULT_DIRECTIONAL_DASH_MATCH_OPPOSITE_DIRECTION_DOT_THRESHOLD) {
      continue;
    }

    bestIndex = earlierIndex;
    bestDistance = spatialDistance;
  }

  return bestIndex;
}

function mergeMatchedDistancesIntoRanges(
  distances: number[],
  padding: number,
  totalLength: number
): DistanceRange[] {
  const sortedDistances = distances
    .filter((distance) => Number.isFinite(distance))
    .sort((a, b) => a - b);
  if (sortedDistances.length === 0) {
    return [];
  }

  const maxGap = padding * 2;
  const ranges: DistanceRange[] = [];

  sortedDistances.forEach((distance) => {
    const nextRange = {
      startDistance: Math.max(0, distance - padding),
      endDistance: Math.min(totalLength, distance + padding)
    };
    const previousRange = ranges[ranges.length - 1];

    if (!previousRange || nextRange.startDistance > previousRange.endDistance + maxGap) {
      ranges.push(nextRange);
      return;
    }

    previousRange.endDistance = Math.max(previousRange.endDistance, nextRange.endDistance);
  });

  return ranges;
}

function estimateTracingSampleGap(samples: FlattenedTracingSample[]): number {
  const gaps: number[] = [];

  for (let index = 1; index < samples.length && gaps.length < 24; index += 1) {
    const current = samples[index];
    const previous = samples[index - 1];
    if (!current || !previous) {
      continue;
    }

    const gap = current.overallDistance - previous.overallDistance;
    if (gap > DISTANCE_EPSILON) {
      gaps.push(gap);
    }
  }

  if (gaps.length === 0) {
    return 2;
  }

  const sortedGaps = [...gaps].sort((a, b) => a - b);
  return sortedGaps[Math.floor(sortedGaps.length / 2)] ?? 2;
}

function removeClosestDirectionalDashAnnotation(
  annotations: DirectionalDashAnnotation[],
  path: PreparedTracingPath,
  targetDistance: number,
  maxSpatialDistance: number,
  currentSectionIndex: number
): void {
  const targetPoint = getPointAtOverallDistance(path, targetDistance);
  let bestIndex = -1;
  let bestScore = Infinity;

  annotations.forEach((annotation, index) => {
    if (
      annotation.source.sectionIndex >= currentSectionIndex ||
      annotation.source.directionality !== "bidirectional"
    ) {
      return;
    }

    const annotationPoint = getPointAtOverallDistance(path, annotation.source.distance);
    const spatialDistance = Math.hypot(
      targetPoint.x - annotationPoint.x,
      targetPoint.y - annotationPoint.y
    );
    if (spatialDistance > maxSpatialDistance) {
      return;
    }

    const score = spatialDistance + (currentSectionIndex - annotation.source.sectionIndex) * 0.001;
    if (score <= bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  if (bestIndex >= 0) {
    annotations.splice(bestIndex, 1);
  }
}

function finalizeDirectionalDashAnnotationSections(
  annotations: DirectionalDashAnnotation[]
): void {
  const sectionCounts = new Map<number, number>();

  annotations.forEach((annotation) => {
    sectionCounts.set(
      annotation.source.sectionIndex,
      (sectionCounts.get(annotation.source.sectionIndex) ?? 0) + 1
    );
  });

  const sectionOrdinals = new Map<number, number>();
  annotations.forEach((annotation) => {
    const ordinal = sectionOrdinals.get(annotation.source.sectionIndex) ?? 0;
    sectionOrdinals.set(annotation.source.sectionIndex, ordinal + 1);
    annotation.source.ordinalInSection = ordinal;
    annotation.source.countInSection = sectionCounts.get(annotation.source.sectionIndex) ?? 0;
  });
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
  targetDistance: number,
  bias: PoseAtDistanceBias = "center"
): Point {
  const position = findStrokePositionAtOverallDistance(path, targetDistance, bias);
  return position
    ? interpolateSamplePose(position.stroke.samples, position.distanceAlongStroke).point
    : { x: 0, y: 0 };
}

function getPoseAtOverallDistance(
  path: PreparedTracingPath,
  targetDistance: number,
  bias: PoseAtDistanceBias = "center"
): { point: Point; tangent: Point } {
  const totalLength = getTotalLength(path);
  const clampedDistance = Math.max(0, Math.min(targetDistance, totalLength));
  const boundary = findBoundaryAtDistance(path, clampedDistance);
  if (boundary && bias !== "center") {
    return {
      point: { x: boundary.point.x, y: boundary.point.y },
      tangent:
        bias === "forward"
          ? normalizeVector(boundary.outgoingTangent)
          : normalizeVector(boundary.incomingTangent)
    };
  }

  const position = findStrokePositionAtOverallDistance(path, clampedDistance, bias);
  return position
    ? interpolateSamplePose(position.stroke.samples, position.distanceAlongStroke)
    : { point: { x: 0, y: 0 }, tangent: { x: 1, y: 0 } };
}

function findBoundaryAtDistance(
  path: PreparedTracingPath,
  distance: number
): PreparedTracingPath["boundaries"][number] | null {
  return (
    path.boundaries.find(
      (boundary) => Math.abs(boundary.overallDistance - distance) <= DISTANCE_EPSILON
    ) ?? null
  );
}

function findStrokePositionAtOverallDistance(
  path: PreparedTracingPath,
  targetDistance: number,
  bias: PoseAtDistanceBias
): StrokePosition | null {
  let remaining = targetDistance;

  for (let index = 0; index < path.strokes.length; index += 1) {
    const stroke = path.strokes[index];
    if (!stroke) {
      continue;
    }

    const isAtStrokeEnd = Math.abs(remaining - stroke.totalLength) <= DISTANCE_EPSILON;
    if (bias === "forward" && isAtStrokeEnd && index < path.strokes.length - 1) {
      remaining = 0;
      continue;
    }

    if (remaining <= stroke.totalLength + DISTANCE_EPSILON || index === path.strokes.length - 1) {
      return {
        stroke,
        distanceAlongStroke: Math.max(0, Math.min(remaining, stroke.totalLength))
      };
    }

    remaining -= stroke.totalLength;
  }

  return null;
}

function interpolateSamplePose(
  samples: TracingSample[],
  distanceAlongStroke: number
): { point: Point; tangent: Point } {
  if (samples.length === 0) {
    return { point: { x: 0, y: 0 }, tangent: { x: 1, y: 0 } };
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
        point: {
          x: previous.x + (current.x - previous.x) * ratio,
          y: previous.y + (current.y - previous.y) * ratio
        },
        tangent: normalizeVector({
          x: previous.tangent.x + (current.tangent.x - previous.tangent.x) * ratio,
          y: previous.tangent.y + (current.tangent.y - previous.tangent.y) * ratio
        })
      };
    }
  }

  const last = samples[samples.length - 1];
  return last
    ? {
      point: { x: last.x, y: last.y },
      tangent: normalizeVector(last.tangent)
    }
    : { point: { x: 0, y: 0 }, tangent: { x: 1, y: 0 } };
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

function findSampleIndexAtOrAfterDistance(
  samples: FlattenedTracingSample[],
  overallDistance: number
): number {
  for (let index = 0; index < samples.length; index += 1) {
    const sample = samples[index];
    if (sample && sample.overallDistance >= overallDistance - DISTANCE_EPSILON) {
      return index;
    }
  }

  return Math.max(0, samples.length - 1);
}

function isDistanceWithinRanges(distance: number, ranges: DistanceRange[]): boolean {
  return ranges.some(
    (range) =>
      distance >= range.startDistance - DISTANCE_EPSILON &&
      distance <= range.endDistance + DISTANCE_EPSILON
  );
}

function negateVector(vector: Point): Point {
  return {
    x: -vector.x,
    y: -vector.y
  };
}

function getPolylineStartDirection(points: Point[], fallback: Point): Point {
  const start = points[0];
  if (!start) {
    return normalizeVector(fallback);
  }

  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    if (!point) {
      continue;
    }

    const distance = Math.hypot(point.x - start.x, point.y - start.y);
    if (distance >= 1) {
      return normalizeVector({
        x: point.x - start.x,
        y: point.y - start.y
      });
    }
  }

  return normalizeVector(fallback);
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
