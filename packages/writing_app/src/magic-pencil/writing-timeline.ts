import { buildHandwritingPath, lettersByVariantId, CubicBezier, type Point, type WritingPath } from "letterpaths";
import { MathUtils } from "three";
import { JOIN_SPACING, TARGET_GUIDES } from "../shared";

export type WritingStep = {
  curve: CubicBezier;
  length: number;
  start: number;
  end: number;
  travel: boolean;
};

const lineWidth = ({ bounds }: WritingPath) => bounds.maxX - bounds.minX;
const lineHeight = ({ bounds }: WritingPath) => bounds.maxY - bounds.minY;

function textRows(value: string, repeated: boolean) {
  const build = (line: string) => buildHandwritingPath(line, {
    style: repeated ? "pre-cursive" : "cursive",
    letters: lettersByVariantId,
    targetGuides: TARGET_GUIDES,
    joinSpacing: JOIN_SPACING,
    keepInitialLeadIn: !repeated,
    keepFinalLeadOut: true,
  });
  const words = value.split(" ");
  if (words.length === 1 || value.length < 6) return [build(value)];

  // Minimize the widest row so both rows can use the largest common scale.
  let rows: WritingPath[] = [];
  let widest = Infinity;
  for (let split = 1; split < words.length; split++) {
    const first = build(words.slice(0, split).join(" "));
    const second = build(words.slice(split).join(" "));
    const width = Math.max(lineWidth(first), lineWidth(second));
    if (width < widest) {
      rows = [first, second];
      widest = width;
    }
  }
  return rows;
}

export function buildWritingTimeline(
  value: string,
  width: number,
  height: number,
  frameHeight: number,
  pencilSize: number,
) {
  const repeated = value.length === 1;
  const rows = textRows(value, repeated);
  const frameWidth = frameHeight * 4 / 3;
  const frameX = (width - frameWidth) / 2;
  const frameY = Math.min((height - frameHeight) * 0.16, 45);
  const maxTextWidth = frameWidth * (repeated ? 0.116 : 0.64);
  const maxTextHeight = frameHeight * (repeated ? 0.128 : 0.24);
  const widest = Math.max(...rows.map(lineWidth));
  const tallest = Math.max(...rows.map(lineHeight));
  const referenceScale = frameHeight * 0.12 / (TARGET_GUIDES.baseline - TARGET_GUIDES.xHeight);
  const scale = Math.min(
    maxTextWidth / Math.max(widest, 1),
    maxTextHeight / Math.max(tallest, 1),
    referenceScale,
  );
  const leftEdge = (width - (widest * scale + pencilSize * 0.55)) / 2;
  const linePitch = Math.max(frameHeight * 0.19, tallest * scale + frameHeight * 0.065);

  const steps: WritingStep[] = [];
  let total = 0;
  let previous: Point | undefined;
  // "hello" is drawn at the reference scale. If a longer word needs to shrink,
  // reduce screen speed by the same factor to preserve its handwriting pace.
  const writingSpeed = frameHeight * (repeated ? 0.16 : 0.27 * scale / referenceScale);
  const add = (curve: CubicBezier, length: number, seconds: number, travel: boolean) => {
    steps.push({ curve, length, start: total, end: total + seconds, travel });
    total += seconds;
  };
  const move = (from: Point, to: Point, seconds: number) => {
    add(new CubicBezier(from, from, to, to), 0, seconds, true);
  };
  for (let copy = 0; copy < (repeated ? 6 : rows.length); copy++) {
    const path = rows[repeated ? 0 : copy];
    const { bounds } = path;
    const left = repeated
      ? frameX + frameWidth * (0.251 + (copy % 3) * 0.195)
      : leftEdge;
    const top = repeated
      ? frameY + frameHeight * (0.20 + Math.floor(copy / 3) * 0.205)
      : frameY + frameHeight * (rows.length > 1 ? 0.19 : 0.26) + copy * linePitch;
    const place = (point: Point) => ({
      x: left + (point.x - bounds.minX) * scale,
      y: top + (point.y - bounds.minY) * scale,
    });

    for (const stroke of path.strokes) {
      if (stroke.type === "lift") continue;
      const curves = stroke.curves.map((original, index) => {
        const curve = new CubicBezier(place(original.p0), place(original.p1), place(original.p2), place(original.p3));
        return { curve, length: curve.length(), dot: stroke.curveSegments?.[index] === "dot" };
      }).filter(({ length, dot }) => length > 1e-6 || dot);
      if (!curves.length) continue;
      const start = curves[0].curve.p0;
      if (!previous) {
        move(start, start, 0.26);
      } else {
        const gap = Math.hypot(start.x - previous.x, start.y - previous.y);
        if (gap > 0.1) {
          move(previous, start, MathUtils.clamp(gap / (frameHeight * 0.39) + 0.38, 0.48, 1.52));
        }
      }
      // Each connected stroke includes its joins. Every drawn curve shares
      // one speed, including the tiny segments around a letter boundary.
      for (const { curve, length, dot } of curves) {
        add(curve, length, dot ? Math.max(0.085, length / writingSpeed) : length / writingSpeed, false);
        previous = curve.p3;
      }
    }
  }
  if (previous) {
    move(previous, { x: previous.x + pencilSize * 0.33, y: previous.y + pencilSize * 0.48 }, 0.95);
  }
  return { steps, total };
}
