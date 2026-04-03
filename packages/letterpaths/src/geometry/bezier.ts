import type { Point } from "../types";

type LutEntry = {
  t: number;
  length: number;
  point: Point;
};

export class CubicBezier {
  readonly p0: Point;
  readonly p1: Point;
  readonly p2: Point;
  readonly p3: Point;

  private cachedLut: LutEntry[] | null = null;

  constructor(p0: Point, p1: Point, p2: Point, p3: Point) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
  }

  getPointAt(t: number): Point {
    const clamped = Math.min(Math.max(t, 0), 1);
    const mt = 1 - clamped;
    const mt2 = mt * mt;
    const t2 = clamped * clamped;
    const a = mt2 * mt;
    const b = 3 * mt2 * clamped;
    const c = 3 * mt * t2;
    const d = t2 * clamped;
    return {
      x: this.p0.x * a + this.p1.x * b + this.p2.x * c + this.p3.x * d,
      y: this.p0.y * a + this.p1.y * b + this.p2.y * c + this.p3.y * d
    };
  }

  getTangentAt(t: number): Point {
    const clamped = Math.min(Math.max(t, 0), 1);
    const mt = 1 - clamped;
    const a = -3 * mt * mt;
    const b = 3 * mt * mt - 6 * mt * clamped;
    const c = 6 * mt * clamped - 3 * clamped * clamped;
    const d = 3 * clamped * clamped;
    return {
      x: this.p0.x * a + this.p1.x * b + this.p2.x * c + this.p3.x * d,
      y: this.p0.y * a + this.p1.y * b + this.p2.y * c + this.p3.y * d
    };
  }

  length(steps = 60): number {
    const lut = this.getLut(steps);
    return lut[lut.length - 1]?.length ?? 0;
  }

  getPointAtLength(distance: number): Point {
    const t = this.getTAtLength(distance);
    return this.getPointAt(t);
  }

  getTAtLength(distance: number, steps = 60): number {
    const lut = this.getLut(steps);
    const total = lut[lut.length - 1]?.length ?? 0;
    if (total === 0) {
      return 0;
    }
    const clamped = Math.min(Math.max(distance, 0), total);
    let low = 0;
    let high = lut.length - 1;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if ((lut[mid]?.length ?? 0) < clamped) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    const right = lut[low] ?? lut[lut.length - 1];
    const left = lut[Math.max(0, low - 1)] ?? lut[0];
    const span = right.length - left.length;
    if (span <= 0) {
      return right.t;
    }
    const ratio = (clamped - left.length) / span;
    return left.t + (right.t - left.t) * ratio;
  }

  private getLut(steps = 60): LutEntry[] {
    if (this.cachedLut && this.cachedLut.length === steps + 1) {
      return this.cachedLut;
    }
    const entries: LutEntry[] = [];
    let total = 0;
    let prev = this.getPointAt(0);
    entries.push({ t: 0, length: 0, point: prev });
    for (let i = 1; i <= steps; i += 1) {
      const t = i / steps;
      const point = this.getPointAt(t);
      total += Math.hypot(point.x - prev.x, point.y - prev.y);
      entries.push({ t, length: total, point });
      prev = point;
    }
    this.cachedLut = entries;
    return entries;
  }
}
