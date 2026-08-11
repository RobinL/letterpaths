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
  strokeIndex: number;
};

type OverlapRun = {
  startIndex: number;
  matchedEarlierIndex: number;
};

type TracingSampleSpatialIndex = {
  cellSize: number;
  buckets: Map<string, number[]>;
};

type RetraceBoundaryCandidate = {
  boundary: PreparedTracingBoundary;
  sampleIndex: number;
  strokeEndIndexExclusive: number;
};

type RetraceBoundaryMatch = {
  candidateIndex: number;
  sampleIndex: number;
  matchedEarlierIndex: number;
  overallDistance: number;
  point: Point;
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

  const sampleSpatialIndex = buildTracingSampleSpatialIndex(samples, proximityThreshold);
  // Candidate turns are authored curve boundaries. Resolve their sample positions once so the
  // group loop does not repeatedly rescan every boundary and every sample.
  const retraceBoundaryCandidates = buildRetraceBoundaryCandidates(
    path.boundaries,
    samples,
    retraceTurnAngleThreshold
  );

  const groups: TracingGroup[] = [];
  let groupStartIndex = 0;
  let groupStartDistance = samples[0]?.overallDistance ?? 0;
  let groupStartPoint = samples[0]
    ? { x: samples[0].x, y: samples[0].y }
    : { x: 0, y: 0 };
  let nextGroupKind: TracingGroup["kind"] = "base";
  let nextMatchedEarlierDistance: number | undefined;
  let nextBoundaryCandidateIndex = 0;

  while (groupStartIndex < samples.length) {
    const boundary = findFirstBoundaryFromIndex(
      samples,
      sampleSpatialIndex,
      retraceBoundaryCandidates,
      nextBoundaryCandidateIndex,
      groupStartIndex,
      {
        proximityThreshold,
        minOverlapLength,
        minPathSeparation,
        requireOpposingDirection,
        oppositeDirectionDotThreshold
      }
    );

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

    nextBoundaryCandidateIndex = boundary.candidateIndex + 1;
    groupStartIndex = boundary.sampleIndex;
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

  path.strokes.forEach((stroke, strokeIndex) => {
    stroke.samples.forEach((sample) => {
      flattened.push({
        ...sample,
        overallDistance: strokeOffset + sample.distanceAlongStroke,
        strokeIndex
      });
    });
    strokeOffset += stroke.totalLength;
  });

  return flattened;
}

function findMatchingEarlierSample(
  samples: FlattenedSample[],
  sampleSpatialIndex: TracingSampleSpatialIndex | null,
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

  if (options.proximityThreshold < 0) {
    return null;
  }

  let bestIndex: number | null = null;
  let bestDistance = Infinity;

  const cappedEarlierIndex = Math.min(maxEarlierIndexExclusive, currentIndex);
  const evaluateCandidate = (earlierIndex: number) => {
    const earlier = samples[earlierIndex];
    if (!earlier) {
      return;
    }

    if (current.overallDistance - earlier.overallDistance < options.minPathSeparation) {
      return;
    }

    const spatialDistance = Math.hypot(current.x - earlier.x, current.y - earlier.y);
    if (
      spatialDistance > options.proximityThreshold ||
      spatialDistance > bestDistance ||
      (spatialDistance === bestDistance && bestIndex !== null && earlierIndex >= bestIndex)
    ) {
      return;
    }

    if (options.requireOpposingDirection) {
      const directionDot =
        current.tangent.x * earlier.tangent.x + current.tangent.y * earlier.tangent.y;
      if (directionDot > options.oppositeDirectionDotThreshold) {
        return;
      }
    }

    bestIndex = earlierIndex;
    bestDistance = spatialDistance;
  };

  if (sampleSpatialIndex) {
    forEachNearbySampleIndex(
      sampleSpatialIndex,
      current,
      minEarlierIndex,
      cappedEarlierIndex,
      evaluateCandidate
    );
  } else {
    for (let earlierIndex = minEarlierIndex; earlierIndex < cappedEarlierIndex; earlierIndex += 1) {
      evaluateCandidate(earlierIndex);
    }
  }

  return bestIndex;
}

function findFirstBoundaryFromIndex(
  samples: FlattenedSample[],
  sampleSpatialIndex: TracingSampleSpatialIndex | null,
  boundaryCandidates: RetraceBoundaryCandidate[],
  startBoundaryCandidateIndex: number,
  startIndex: number,
  options: {
    proximityThreshold: number;
    minOverlapLength: number;
    minPathSeparation: number;
    requireOpposingDirection: boolean;
    oppositeDirectionDotThreshold: number;
  }
): RetraceBoundaryMatch | null {
  const groupStartDistance = samples[startIndex]?.overallDistance ?? 0;

  for (
    let candidateIndex = startBoundaryCandidateIndex;
    candidateIndex < boundaryCandidates.length;
    candidateIndex += 1
  ) {
    const candidate = boundaryCandidates[candidateIndex];
    if (!candidate) {
      continue;
    }
    const {
      boundary,
      sampleIndex: boundarySampleIndex,
      strokeEndIndexExclusive
    } = candidate;
    if (boundary.overallDistance <= groupStartDistance) {
      continue;
    }

    if (boundarySampleIndex <= startIndex) {
      continue;
    }

    const overlapRun = findOverlapRunAfterBoundary(
      samples,
      sampleSpatialIndex,
      startIndex,
      boundarySampleIndex,
      // A retrace is a continuous reversal of the current pen stroke. Do not search through a
      // later pen-down stroke for evidence that an earlier boundary was a retrace.
      strokeEndIndexExclusive,
      {
        proximityThreshold: options.proximityThreshold,
        minOverlapLength: options.minOverlapLength,
        minPathSeparation: options.minPathSeparation,
        requireOpposingDirection: options.requireOpposingDirection,
        oppositeDirectionDotThreshold: options.oppositeDirectionDotThreshold
      }
    );

    if (!overlapRun) {
      continue;
    }

    return {
      candidateIndex,
      sampleIndex: boundarySampleIndex,
      matchedEarlierIndex: overlapRun.matchedEarlierIndex,
      overallDistance: boundary.overallDistance,
      point: boundary.point
    };
  }

  return null;
}

function findOverlapRunAfterBoundary(
  samples: FlattenedSample[],
  sampleSpatialIndex: TracingSampleSpatialIndex | null,
  startIndex: number,
  boundarySampleIndex: number,
  maxCurrentIndexExclusive: number,
  options: {
    proximityThreshold: number;
    minOverlapLength: number;
    minPathSeparation: number;
    requireOpposingDirection: boolean;
    oppositeDirectionDotThreshold: number;
  }
): OverlapRun | null {
  let activeRun: OverlapRun | null = null;

  for (
    let currentIndex = boundarySampleIndex + 1;
    currentIndex < maxCurrentIndexExclusive;
    currentIndex += 1
  ) {
    const matchIndex = findMatchingEarlierSample(
      samples,
      sampleSpatialIndex,
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

function buildRetraceBoundaryCandidates(
  boundaries: PreparedTracingBoundary[],
  samples: FlattenedSample[],
  retraceTurnAngleThreshold: number
): RetraceBoundaryCandidate[] {
  return boundaries
    .filter((boundary) => isRetraceBoundary(boundary, retraceTurnAngleThreshold))
    .map((boundary) => {
      const sampleIndex = findSampleIndexAtOrAfterDistance(samples, boundary.overallDistance);
      return {
        boundary,
        sampleIndex,
        strokeEndIndexExclusive: findStrokeEndIndexExclusive(samples, sampleIndex)
      };
    });
}

function findStrokeEndIndexExclusive(samples: FlattenedSample[], startIndex: number): number {
  const strokeIndex = samples[startIndex]?.strokeIndex;
  if (strokeIndex === undefined) {
    return samples.length;
  }

  let endIndex = startIndex + 1;
  while (endIndex < samples.length && samples[endIndex]?.strokeIndex === strokeIndex) {
    endIndex += 1;
  }
  return endIndex;
}

function findSampleIndexAtOrAfterDistance(
  samples: FlattenedSample[],
  overallDistance: number
): number {
  let low = 0;
  let high = samples.length;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    const sample = samples[middle];
    if (sample && sample.overallDistance < overallDistance) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }

  return Math.min(low, Math.max(0, samples.length - 1));
}

function buildTracingSampleSpatialIndex(
  samples: FlattenedSample[],
  proximityThreshold: number
): TracingSampleSpatialIndex | null {
  if (!Number.isFinite(proximityThreshold)) {
    return null;
  }

  const cellSize = proximityThreshold > 0 ? proximityThreshold : 1;
  const buckets = new Map<string, number[]>();

  // A cell is exactly one match radius wide, so every possible match is in the current cell or
  // one of its eight neighbours.
  samples.forEach((sample, sampleIndex) => {
    const key = getTracingSampleSpatialIndexKey(
      Math.floor(sample.x / cellSize),
      Math.floor(sample.y / cellSize)
    );
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.push(sampleIndex);
    } else {
      buckets.set(key, [sampleIndex]);
    }
  });

  return { cellSize, buckets };
}

function forEachNearbySampleIndex(
  spatialIndex: TracingSampleSpatialIndex,
  sample: FlattenedSample,
  minSampleIndex: number,
  maxSampleIndexExclusive: number,
  visit: (sampleIndex: number) => void
): void {
  const cellX = Math.floor(sample.x / spatialIndex.cellSize);
  const cellY = Math.floor(sample.y / spatialIndex.cellSize);

  for (let dx = -1; dx <= 1; dx += 1) {
    for (let dy = -1; dy <= 1; dy += 1) {
      const bucket = spatialIndex.buckets.get(
        getTracingSampleSpatialIndexKey(cellX + dx, cellY + dy)
      );
      if (!bucket) {
        continue;
      }

      for (
        let bucketIndex = lowerBoundSampleIndices(bucket, minSampleIndex);
        bucketIndex < bucket.length;
        bucketIndex += 1
      ) {
        const sampleIndex = bucket[bucketIndex];
        if (sampleIndex === undefined || sampleIndex >= maxSampleIndexExclusive) {
          break;
        }
        visit(sampleIndex);
      }
    }
  }
}

function getTracingSampleSpatialIndexKey(cellX: number, cellY: number): string {
  return `${cellX},${cellY}`;
}

function lowerBoundSampleIndices(sampleIndices: number[], targetIndex: number): number {
  let low = 0;
  let high = sampleIndices.length;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    const sampleIndex = sampleIndices[middle];
    if (sampleIndex !== undefined && sampleIndex < targetIndex) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }

  return low;
}
