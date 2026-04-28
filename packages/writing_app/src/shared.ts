import {
  CubicBezier,
  buildHandwritingPath,
  lettersByVariantId,
  type BuildHandwritingOptions,
  type HandwritingStyle,
  type Point,
  type WritingPath
} from "letterpaths";

export const WORDS = ["sam", "pat", "mat", "pit", "sit", "pad"] as const;
export const TARGET_GUIDES = {
  xHeight: 320,
  baseline: 700
} as const;
export const JOIN_SPACING = {
  targetBendRate: 16,
  minSidebearingGap: 80,
  bendSearchMinSidebearingGap: -30,
  bendSearchMaxSidebearingGap: 240,
  exitHandleScale: 0.75,
  entryHandleScale: 0.75
} as const;
export const DEMO_PAUSE_MS = 500;
export const DEFAULT_TRACE_TOLERANCE = 150;
export const MIN_TRACE_TOLERANCE = 25;
export const MAX_TRACE_TOLERANCE = 300;
export const TRACE_TOLERANCE_STEP = 5;

export type ShiftedWordLayout = {
  path: WritingPath;
  width: number;
  height: number;
  offsetY: number;
};

export type ShiftedWordLayoutOptions = Pick<
  BuildHandwritingOptions,
  "joinSpacing" | "keepInitialLeadIn" | "keepFinalLeadOut"
>;

export type ShiftedHandwritingLayoutOptions = ShiftedWordLayoutOptions & {
  style?: HandwritingStyle;
};

export const chooseNextWordIndex = (previousIndex: number): number => {
  if (WORDS.length <= 1) {
    return 0;
  }

  let nextIndex = previousIndex;
  while (nextIndex === previousIndex) {
    nextIndex = Math.floor(Math.random() * WORDS.length);
  }
  return nextIndex;
};

export const buildPathD = (curves: CubicBezier[]): string => {
  if (curves.length === 0) {
    return "";
  }

  const [first] = curves;
  let d = `M ${first.p0.x} ${first.p0.y}`;

  curves.forEach((curve) => {
    d += ` C ${curve.p1.x} ${curve.p1.y} ${curve.p2.x} ${curve.p2.y} ${curve.p3.x} ${curve.p3.y}`;
  });

  return d;
};

export const shiftWritingPath = (path: WritingPath, dx: number, dy: number): WritingPath => ({
  ...path,
  strokes: path.strokes.map((stroke) => ({
    ...stroke,
    curves: stroke.curves.map(
      (curve) =>
        new CubicBezier(
          { x: curve.p0.x + dx, y: curve.p0.y + dy },
          { x: curve.p1.x + dx, y: curve.p1.y + dy },
          { x: curve.p2.x + dx, y: curve.p2.y + dy },
          { x: curve.p3.x + dx, y: curve.p3.y + dy }
        )
    )
  })),
  bounds: {
    minX: path.bounds.minX + dx,
    maxX: path.bounds.maxX + dx,
    minY: path.bounds.minY + dy,
    maxY: path.bounds.maxY + dy
  }
});

export const buildShiftedHandwritingLayout = (
  text: string,
  options: ShiftedHandwritingLayoutOptions = {}
): ShiftedWordLayout => {
  const style = options.style ?? "cursive";
  const writingPath = buildHandwritingPath(text, {
    style,
    targetGuides: TARGET_GUIDES,
    joinSpacing: options.joinSpacing ?? JOIN_SPACING,
    letters: lettersByVariantId,
    keepInitialLeadIn: options.keepInitialLeadIn,
    keepFinalLeadOut: options.keepFinalLeadOut
  });

  if (writingPath.strokes.length === 0) {
    throw new Error(`No drawable strokes found for "${text}".`);
  }

  const paddingX = 180;
  const paddingY = 150;
  const width = Math.ceil(writingPath.bounds.maxX - writingPath.bounds.minX + paddingX * 2);
  const height = Math.ceil(writingPath.bounds.maxY - writingPath.bounds.minY + paddingY * 2);
  const offsetX = paddingX - writingPath.bounds.minX;
  const offsetY = paddingY - writingPath.bounds.minY;

  return {
    path: shiftWritingPath(writingPath, offsetX, offsetY),
    width,
    height,
    offsetY
  };
};

export const buildShiftedWordLayout = (
  word: string,
  options: ShiftedWordLayoutOptions = {}
): ShiftedWordLayout => buildShiftedHandwritingLayout(word, { ...options, style: "cursive" });

export const getPointerInSvg = (
  svg: SVGSVGElement,
  event: PointerEvent
): Point => {
  const ctm = svg.getScreenCTM();
  if (ctm) {
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(ctm.inverse());
    return { x: transformed.x, y: transformed.y };
  }

  const rect = svg.getBoundingClientRect();
  const viewBox = svg.viewBox.baseVal;
  const scaleX = viewBox.width / rect.width;
  const scaleY = viewBox.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX + viewBox.x,
    y: (event.clientY - rect.top) * scaleY + viewBox.y
  };
};
