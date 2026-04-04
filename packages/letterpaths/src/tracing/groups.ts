import type { Point } from "../types";
import type {
  PreparedTracingBoundary,
  PreparedTracingPath,
  TracingSample
} from "./compiler";

export type TracingGroup = {
  index: number;
  startDistance: number;
  endDistance: number;
  startPoint: Point;
  endPoint: Point;
  kind: "base" | "retrace";
  matchedEarlierDistance?: number;
};

export type AnalyzeTracingGroupsOptions = {
  /** Maximum spatial gap between samples to count as retracing the same corridor. */
  proximityThreshold?: number;
  /** Minimum length of sustained overlap after a retrace boundary before a new group is created. */
  minOverlapLength?: number;
  /** Minimum path distance between overlapping samples to avoid splitting at cusps. */
  minPathSeparation?: number;
  /** Require opposite-ish tangents for overlap to count as retracing. */
  requireOpposingDirection?: boolean;
  /** Dot-product threshold for "opposite-ish" direction. */
  oppositeDirectionDotThreshold?: number;
  /** Minimum turn angle at a segment boundary to count as a retrace point. */
  retraceTurnAngleThreshold?: number;
  /** Retained for compatibility; authored-boundary detection now uses exact boundary points. */
  boundaryLookbackDistance?: number;
};

export type TracingGroupAnalysis = {
  groups: TracingGroup[];
  totalLength: number;
};

type FlattenedSample = TracingSample & {
  overallDistance: number;
};

type OverlapRun = {
  startIndex: number;
  matchedEarlierIndex: number;
};

const MATCH_BACKTRACK_TOLERANCE = 12;
const MATCH_FORWARD_TOLERANCE = 24;

export function analyzeTracingGroups(
  path: PreparedTracingPath,
  options: AnalyzeTracingGroupsOptions = {}
): TracingGroupAnalysis {
  const proximityThreshold = options.proximityThreshold ?? 28;
  const minOverlapLength = options.minOverlapLength ?? 60;
  const minPathSeparation = options.minPathSeparation ?? 90;
  const requireOpposingDirection = options.requireOpposingDirection ?? true;
  const oppositeDirectionDotThreshold = options.oppositeDirectionDotThreshold ?? -0.2;
  const retraceTurnAngleThreshold = options.retraceTurnAngleThreshold ?? 150;

  const samples = flattenSamples(path);
  const totalLength =
    path.strokes.length === 0
      ? 0
      : path.strokes.reduce((sum, stroke) => sum + stroke.totalLength, 0);

  if (samples.length === 0) {
    return { groups: [], totalLength };
  }

  const groups: TracingGroup[] = [];
  let groupStartIndex = 0;
  let groupStartDistance = samples[0]?.overallDistance ?? 0;
  let groupStartPoint = samples[0]
    ? { x: samples[0].x, y: samples[0].y }
    : { x: 0, y: 0 };
  let nextGroupKind: TracingGroup["kind"] = "base";
  let nextMatchedEarlierDistance: number | undefined;

  while (groupStartIndex < samples.length) {
    const boundary = findFirstBoundaryFromIndex(samples, groupStartIndex, {
      boundaries: path.boundaries,
      proximityThreshold,
      minOverlapLength,
      minPathSeparation,
      requireOpposingDirection,
      oppositeDirectionDotThreshold,
      retraceTurnAngleThreshold
    });

    const endPoint = boundary
      ? boundary.point
      : samples[samples.length - 1]
        ? { x: samples[samples.length - 1]!.x, y: samples[samples.length - 1]!.y }
        : null;
    const endDistance = boundary
      ? boundary.overallDistance
      : samples[samples.length - 1]?.overallDistance;
    if (!endPoint || endDistance === undefined) {
      break;
    }

    groups.push({
      index: groups.length,
      startDistance: groupStartDistance,
      endDistance,
      startPoint: groupStartPoint,
      endPoint,
      kind: nextGroupKind,
      matchedEarlierDistance: nextMatchedEarlierDistance
    });

    if (!boundary) {
      break;
    }

    groupStartIndex = findSampleIndexAtOrAfterDistance(samples, boundary.overallDistance);
    groupStartDistance = boundary.overallDistance;
    groupStartPoint = boundary.point;
    nextGroupKind = "retrace";
    nextMatchedEarlierDistance = samples[boundary.matchedEarlierIndex]?.overallDistance;
  }

  return { groups, totalLength };
}

function flattenSamples(path: PreparedTracingPath): FlattenedSample[] {
  const flattened: FlattenedSample[] = [];
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

function findMatchingEarlierSample(
  samples: FlattenedSample[],
  currentIndex: number,
  minEarlierIndex: number,
  maxEarlierIndexExclusive: number,
  options: {
    proximityThreshold: number;
    minPathSeparation: number;
    requireOpposingDirection: boolean;
    oppositeDirectionDotThreshold: number;
  }
): number | null {
  const current = samples[currentIndex];
  if (!current) {
    return null;
  }

  let bestIndex: number | null = null;
  let bestDistance = Infinity;

  const cappedEarlierIndex = Math.min(maxEarlierIndexExclusive, currentIndex);

  for (let earlierIndex = minEarlierIndex; earlierIndex < cappedEarlierIndex; earlierIndex += 1) {
    const earlier = samples[earlierIndex];
    if (!earlier) {
      continue;
    }

    if (current.overallDistance - earlier.overallDistance < options.minPathSeparation) {
      continue;
    }

    const spatialDistance = Math.hypot(current.x - earlier.x, current.y - earlier.y);
    if (spatialDistance > options.proximityThreshold || spatialDistance >= bestDistance) {
      continue;
    }

    if (options.requireOpposingDirection) {
      const directionDot =
        current.tangent.x * earlier.tangent.x + current.tangent.y * earlier.tangent.y;
      if (directionDot > options.oppositeDirectionDotThreshold) {
        continue;
      }
    }

    bestIndex = earlierIndex;
    bestDistance = spatialDistance;
  }

  return bestIndex;
}

function findFirstBoundaryFromIndex(
  samples: FlattenedSample[],
  startIndex: number,
  options: {
    boundaries: PreparedTracingBoundary[];
    proximityThreshold: number;
    minOverlapLength: number;
    minPathSeparation: number;
    requireOpposingDirection: boolean;
    oppositeDirectionDotThreshold: number;
    retraceTurnAngleThreshold: number;
  }
): { startIndex: number; matchedEarlierIndex: number; overallDistance: number; point: Point } | null {
  const groupStartDistance = samples[startIndex]?.overallDistance ?? 0;

  for (const boundary of options.boundaries) {
    if (!isRetraceBoundary(boundary, options.retraceTurnAngleThreshold)) {
      continue;
    }
    if (boundary.overallDistance <= groupStartDistance) {
      continue;
    }

    const boundarySampleIndex = findSampleIndexAtOrAfterDistance(samples, boundary.overallDistance);
    if (boundarySampleIndex <= startIndex) {
      continue;
    }

    const overlapRun = findOverlapRunAfterBoundary(samples, startIndex, boundarySampleIndex, {
      proximityThreshold: options.proximityThreshold,
      minOverlapLength: options.minOverlapLength,
      minPathSeparation: options.minPathSeparation,
      requireOpposingDirection: options.requireOpposingDirection,
      oppositeDirectionDotThreshold: options.oppositeDirectionDotThreshold
    });

    if (!overlapRun) {
      continue;
    }

    return {
      startIndex: boundarySampleIndex,
      matchedEarlierIndex: overlapRun.matchedEarlierIndex,
      overallDistance: boundary.overallDistance,
      point: boundary.point
    };
  }

  return null;
}

function findOverlapRunAfterBoundary(
  samples: FlattenedSample[],
  startIndex: number,
  boundarySampleIndex: number,
  options: {
    proximityThreshold: number;
    minOverlapLength: number;
    minPathSeparation: number;
    requireOpposingDirection: boolean;
    oppositeDirectionDotThreshold: number;
  }
): OverlapRun | null {
  let activeRun: OverlapRun | null = null;

  for (let currentIndex = boundarySampleIndex + 1; currentIndex < samples.length; currentIndex += 1) {
    const matchIndex = findMatchingEarlierSample(
      samples,
      currentIndex,
      startIndex,
      boundarySampleIndex,
      {
        proximityThreshold: options.proximityThreshold,
        minPathSeparation: options.minPathSeparation,
        requireOpposingDirection: options.requireOpposingDirection,
        oppositeDirectionDotThreshold: options.oppositeDirectionDotThreshold
      }
    );

    if (matchIndex === null) {
      activeRun = null;
      continue;
    }

    if (
      !activeRun ||
      matchIndex < activeRun.matchedEarlierIndex - MATCH_BACKTRACK_TOLERANCE ||
      matchIndex > activeRun.matchedEarlierIndex + MATCH_FORWARD_TOLERANCE
    ) {
      activeRun = {
        startIndex: currentIndex,
        matchedEarlierIndex: matchIndex
      };
    } else {
      activeRun.matchedEarlierIndex = matchIndex;
    }

    const overlapStart = samples[activeRun.startIndex];
    const current = samples[currentIndex];
    if (!overlapStart || !current) {
      continue;
    }

    if (current.overallDistance - overlapStart.overallDistance >= options.minOverlapLength) {
      return activeRun;
    }
  }

  return null;
}

function isRetraceBoundary(
  boundary: PreparedTracingBoundary,
  retraceTurnAngleThreshold: number
): boolean {
  return (
    boundary.previousSegment !== boundary.nextSegment &&
    boundary.turnAngleDegrees >= retraceTurnAngleThreshold
  );
}

function findSampleIndexAtOrAfterDistance(
  samples: FlattenedSample[],
  overallDistance: number
): number {
  for (let index = 0; index < samples.length; index += 1) {
    const sample = samples[index];
    if (sample && sample.overallDistance >= overallDistance) {
      return index;
    }
  }
  return Math.max(0, samples.length - 1);
}
