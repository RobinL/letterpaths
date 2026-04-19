import type { Point, WritingPath, LetterGuides, WritingPathSegment } from "../types";

export type TracingSample = {
  x: number;
  y: number;
  tangent: Point;
  distanceAlongStroke: number;
};

export type PreparedStroke = {
  samples: TracingSample[];
  totalLength: number;
  isDot: boolean;
};

export type PreparedTracingBoundary = {
  overallDistance: number;
  point: Point;
  previousSegment?: WritingPathSegment;
  nextSegment?: WritingPathSegment;
  incomingTangent: Point;
  outgoingTangent: Point;
  turnAngleDegrees: number;
};

export type PreparedTracingPath = {
  strokes: PreparedStroke[];
  boundaries: PreparedTracingBoundary[];
  guides: LetterGuides;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
};

export type CompileOptions = {
  /** Distance between samples in pixels (default: 2) */
  sampleRate?: number;
};

/**
 * Flatten complex Bezier paths into equidistant sample points.
 * This pre-computation decouples heavy math from the interaction loop.
 */
export function compileTracingPath(
  path: WritingPath,
  opts: CompileOptions = {}
): PreparedTracingPath {
  const sampleRate = opts.sampleRate ?? 2;
  const boundaries: PreparedTracingBoundary[] = [];
  let strokeOffset = 0;
  const strokes: PreparedStroke[] = [];

  path.strokes
    .filter((stroke) => stroke.type !== "lift")
    .forEach((stroke) => {
      const samples: TracingSample[] = [];
      let totalLength = 0;
      let distanceBeforeCurve = 0;

      // Calculate total length of all curves in stroke
      for (const curve of stroke.curves) {
        totalLength += curve.length();
      }

      for (let curveIndex = 0; curveIndex < stroke.curves.length - 1; curveIndex += 1) {
        const curve = stroke.curves[curveIndex];
        const nextCurve = stroke.curves[curveIndex + 1];
        if (!curve || !nextCurve) {
          continue;
        }

        const curveLength = curve.length();
        const previousSegment = stroke.curveSegments?.[curveIndex];
        const nextSegment = stroke.curveSegments?.[curveIndex + 1];
        const incomingTangent = normalizeVector(curve.getTangentAt(1));
        const outgoingTangent = normalizeVector(nextCurve.getTangentAt(0));
        const directionDot = clampDot(
          incomingTangent.x * outgoingTangent.x + incomingTangent.y * outgoingTangent.y
        );

        boundaries.push({
          overallDistance: strokeOffset + distanceBeforeCurve + curveLength,
          point: { x: curve.p3.x, y: curve.p3.y },
          previousSegment,
          nextSegment,
          incomingTangent,
          outgoingTangent,
          turnAngleDegrees: Math.acos(directionDot) * (180 / Math.PI)
        });

        distanceBeforeCurve += curveLength;
      }

      // Handle zero-length strokes (dots)
      const isDot = totalLength < sampleRate;
      if (isDot) {
        const firstCurve = stroke.curves[0];
        if (firstCurve) {
          const tangent = normalizeVector(firstCurve.getTangentAt(0));
          samples.push({
            x: firstCurve.p0.x,
            y: firstCurve.p0.y,
            tangent,
            distanceAlongStroke: 0
          });
        }
        strokes.push({ samples, totalLength, isDot });
        strokeOffset += totalLength;
        return;
      }

      // Sample points at regular intervals
      const numSamples = Math.max(2, Math.ceil(totalLength / sampleRate));
      for (let i = 0; i <= numSamples; i++) {
        const targetDistance = (i / numSamples) * totalLength;
        const { point, tangent } = getPointAndTangentAtDistance(stroke.curves, targetDistance);
        samples.push({
          x: point.x,
          y: point.y,
          tangent,
          distanceAlongStroke: targetDistance
        });
      }

      strokes.push({ samples, totalLength, isDot });
      strokeOffset += totalLength;
    });

  return {
    strokes,
    boundaries,
    guides: path.guides,
    bounds: path.bounds
  };
}

function getPointAndTangentAtDistance(
  curves: WritingPath["strokes"][number]["curves"],
  distance: number
): { point: Point; tangent: Point } {
  let remaining = distance;

  for (let i = 0; i < curves.length; i++) {
    const curve = curves[i];
    const length = curve.length();

    if (remaining <= length || i === curves.length - 1) {
      const t = curve.getTAtLength(Math.max(0, remaining));
      const point = curve.getPointAt(t);
      const tangent = normalizeVector(curve.getTangentAt(t));
      return { point, tangent };
    }
    remaining -= length;
  }

  // Fallback to last point
  const lastCurve = curves[curves.length - 1];
  if (lastCurve) {
    return {
      point: lastCurve.p3,
      tangent: normalizeVector(lastCurve.getTangentAt(1))
    };
  }

  return { point: { x: 0, y: 0 }, tangent: { x: 1, y: 0 } };
}

function normalizeVector(v: Point): Point {
  const len = Math.hypot(v.x, v.y);
  if (len === 0) return { x: 1, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

function clampDot(value: number): number {
  return Math.max(-1, Math.min(1, value));
}
