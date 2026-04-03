import type { Point, WritingPath, LetterGuides } from "../types";

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

export type PreparedTracingPath = {
  strokes: PreparedStroke[];
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

  const strokes: PreparedStroke[] = path.strokes
    .filter((stroke) => stroke.type !== "lift")
    .map((stroke) => {
      const samples: TracingSample[] = [];
      let totalLength = 0;

      // Calculate total length of all curves in stroke
      for (const curve of stroke.curves) {
        totalLength += curve.length();
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
        return { samples, totalLength, isDot };
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

      return { samples, totalLength, isDot };
    });

  return {
    strokes,
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
