import type { Point, WritingPath } from "../types";
import { CubicBezier } from "../geometry/bezier";

type AnimationSegment = {
  kind: "stroke" | "lift" | "pause";
  startTime: number;
  duration: number;
  length: number;
  from: Point;
  to: Point;
  strokeIndex: number;
  stroke?: WritingPath["strokes"][number];
};

export type AnimationOptions = {
  speed?: number; // pixels per ms
  penUpSpeed?: number; // pixels per ms
  minLiftDistance?: number;
  strokeDelayMs?: number;
  deferredDelayMs?: number;
};

export type AnimationFrame = {
  point: Point;
  velocity: Point;
  isPenDown: boolean;
  completedStrokes: number[];
  activeStrokeIndex: number;
  activeStrokeProgress: number;
};

export function compileAnimation(
  writingPath: WritingPath,
  options: AnimationOptions = {}
): AnimationPlayer {
  return new AnimationPlayer(writingPath, options);
}

export class AnimationPlayer {
  private readonly strokes: WritingPath["strokes"];
  private readonly strokeLengths: number[];
  private readonly strokeTimings: { start: number; duration: number }[];
  private readonly segments: AnimationSegment[];
  private readonly speed: number;
  private readonly penUpSpeed: number;
  private readonly minLiftDistance: number;
  private readonly strokeDelayMs: number;
  private readonly deferredDelayMs: number;

  readonly totalDuration: number;

  constructor(writingPath: WritingPath, options: AnimationOptions = {}) {
    this.strokes = writingPath.strokes;
    this.speed = options.speed ?? 1.8;
    this.penUpSpeed = options.penUpSpeed ?? 2.2;
    this.minLiftDistance = options.minLiftDistance ?? 0.5;
    this.strokeDelayMs = options.strokeDelayMs ?? 0;
    this.deferredDelayMs = options.deferredDelayMs ?? 120;

    this.strokeLengths = this.strokes.map((stroke) =>
      stroke.curves.reduce((sum, curve) => sum + curve.length(), 0)
    );

    this.strokeTimings = [];
    this.segments = [];

    let cursor = 0;
    let lastEnd: Point | null = null;

    this.strokes.forEach((stroke, index) => {
      const start = stroke.curves[0]?.p0 ?? { x: 0, y: 0 };
      const end = stroke.curves[stroke.curves.length - 1]?.p3 ?? start;
      const pauseDuration =
        this.strokeDelayMs + (stroke.deferred ? this.deferredDelayMs : 0);
      if (pauseDuration > 0) {
        const pausePoint = lastEnd ?? start;
        this.segments.push({
          kind: "pause",
          startTime: cursor,
          duration: pauseDuration,
          length: 0,
          from: pausePoint,
          to: pausePoint,
          strokeIndex: index
        });
        cursor += pauseDuration;
      }
      if (lastEnd) {
        const liftDistance = Math.hypot(start.x - lastEnd.x, start.y - lastEnd.y);
        if (liftDistance > this.minLiftDistance) {
          const liftDuration = liftDistance / this.penUpSpeed;
          this.segments.push({
            kind: "lift",
            startTime: cursor,
            duration: liftDuration,
            length: liftDistance,
            from: lastEnd,
            to: start,
            strokeIndex: index
          });
          cursor += liftDuration;
        }
      }

      const length = this.strokeLengths[index] ?? 0;
      const duration = length / this.speed;
      this.strokeTimings.push({ start: cursor, duration });
      this.segments.push({
        kind: "stroke",
        startTime: cursor,
        duration,
        length,
        from: start,
        to: end,
        strokeIndex: index,
        stroke
      });
      cursor += duration;
      lastEnd = end;
    });

    this.totalDuration = cursor;
  }

  getFrame(timeOffset: number): AnimationFrame {
    if (this.strokes.length === 0 || this.segments.length === 0) {
      return {
        point: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        isPenDown: false,
        completedStrokes: [],
        activeStrokeIndex: -1,
        activeStrokeProgress: 0
      };
    }

    const clamped = Math.max(0, timeOffset);
    const segment =
      this.segments.find(
        (item) => clamped >= item.startTime && clamped <= item.startTime + item.duration
      ) ?? this.segments[this.segments.length - 1];

    const progress =
      segment.duration > 0
        ? Math.min((clamped - segment.startTime) / segment.duration, 1)
        : 1;

    if (segment.kind === "lift" || segment.kind === "pause") {
      const point = {
        x: segment.from.x + (segment.to.x - segment.from.x) * progress,
        y: segment.from.y + (segment.to.y - segment.from.y) * progress
      };
      const direction =
        segment.kind === "lift"
          ? normalizeVector({
              x: segment.to.x - segment.from.x,
              y: segment.to.y - segment.from.y
            })
          : { x: 0, y: 0 };
      return {
        point,
        velocity: {
          x: direction.x * this.penUpSpeed,
          y: direction.y * this.penUpSpeed
        },
        isPenDown: false,
        completedStrokes: this.collectCompletedStrokes(clamped),
        activeStrokeIndex: -1,
        activeStrokeProgress: 0
      };
    }

    const strokeIndex = segment.strokeIndex;
    const stroke = segment.stroke ?? this.strokes[strokeIndex];
    const strokeLength = this.strokeLengths[strokeIndex] ?? 0;
    const strokeDistance = strokeLength * progress;
    const { point, tangent } = getPointAndTangentAtStrokeLength(stroke, strokeDistance);
    return {
      point,
      velocity: {
        x: tangent.x * this.speed,
        y: tangent.y * this.speed
      },
      isPenDown: true,
      completedStrokes: this.collectCompletedStrokes(clamped),
      activeStrokeIndex: strokeIndex,
      activeStrokeProgress: strokeLength > 0 ? strokeDistance / strokeLength : 1
    };
  }

  private collectCompletedStrokes(timeOffset: number): number[] {
    const completed: number[] = [];
    this.strokeTimings.forEach((timing, index) => {
      if (timeOffset >= timing.start + timing.duration) {
        completed.push(index);
      }
    });
    return completed;
  }
}

function getPointAndTangentAtStrokeLength(
  stroke: WritingPath["strokes"][number],
  distance: number
): { point: Point; tangent: Point } {
  let remaining = distance;
  for (let i = 0; i < stroke.curves.length; i += 1) {
    const curve = stroke.curves[i];
    const length = curve.length();
    if (remaining <= length || i === stroke.curves.length - 1) {
      const t = curve.getTAtLength(Math.max(0, remaining));
      const point = curve.getPointAt(t);
      const tangent = normalizeVector(curve.getTangentAt(t));
      return { point, tangent };
    }
    remaining -= length;
  }
  const last = stroke.curves[stroke.curves.length - 1] ?? new CubicBezier(
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  );
  return {
    point: last.p3,
    tangent: { x: 1, y: 0 }
  };
}

function normalizeVector(vector: Point): Point {
  const length = Math.hypot(vector.x, vector.y);
  if (length === 0) {
    return { x: 1, y: 0 };
  }
  return { x: vector.x / length, y: vector.y / length };
}
