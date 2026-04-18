import {
  createLegacyLetterId,
  createLetterId,
  cursiveEntryVariantByExitVariant,
  cursiveExitVariantByLetter,
  defaultCursiveEntryVariant,
  letters as defaultLetters,
  lettersById,
  lettersByVariantId
} from "../data";
import { CubicBezier } from "../geometry/bezier";
import type {
  BezierLetter,
  BezierMarkPoint,
  BezierStep,
  Curve,
  HandwritingStyle,
  JoinMetric,
  LetterGuides,
  LetterStroke,
  Point,
  WritingPath,
  WritingPathSegment
} from "../types";
import type { CursiveEntryVariant, CursiveExitVariant } from "../data";

export type JoinCursiveOptions = {
  letters?: Record<string, BezierLetter>;
  targetGuides?: LetterGuides;
  joinSpacing?: JoinSpacingOptions;
  wordSpacing?: number;
  keepInitialLeadIn?: boolean;
  keepFinalLeadOut?: boolean;
};

export type BuildHandwritingOptions = JoinCursiveOptions & {
  style?: HandwritingStyle;
};

export type JoinSpacingOptions = {
  verticalDistanceWeight?: number;
  angleChangeWeight?: number;
  kerningScale?: number;
  minSidebearingGap?: number;
  angleDifferenceWeight?: number;
  bendReversalWeight?: number;
};

export type ResolvedJoinSpacingOptions = {
  verticalDistanceWeight: number;
  angleChangeWeight: number;
  kerningScale: number;
  minSidebearingGap: number;
};

type StandaloneLayoutConfig = {
  keepLeadIn: boolean;
  keepEntry: boolean;
  keepExit: boolean;
  keepLeadOut: boolean;
  additionalSpacing: number;
};

const defaultGuideValues = {
  xHeight: 360,
  baseline: 720
};

export const printLetterSpacing = 130;
export const cursiveLetterSpacing = 60;
export const preCursiveLetterSpacing = cursiveLetterSpacing;

export const defaultJoinSpacingOptions: ResolvedJoinSpacingOptions = {
  verticalDistanceWeight: 0.19,
  angleChangeWeight: 0.45,
  kerningScale: 1,
  minSidebearingGap: 50
};
const bendMeasurementSidebearingGap = 5;

export function buildStandaloneWord(
  text: string,
  options: JoinCursiveOptions,
  config: StandaloneLayoutConfig
): WritingPath {
  const letterMap = options.letters ?? lettersByVariantId;
  const target = resolveTargetGuides(options);
  const wordSpacing = resolveWordSpacing(target, options);

  const outputSteps: BezierStep[] = [];
  let cursorX = 0;
  let rightSidebearingEdge = 0;
  let visibleRightEdge = 0;
  let hasPlacedLetter = false;

  for (let charIndex = 0; charIndex < text.length; charIndex += 1) {
    const rawChar = text[charIndex] ?? "";
    if (rawChar.trim() === "") {
      cursorX = Math.max(rightSidebearingEdge, visibleRightEdge) + wordSpacing;
      continue;
    }

    const char = rawChar.toLowerCase();
    const letter = findCursiveLetter(letterMap, char, defaultCursiveEntryVariant);
    if (!letter) {
      cursorX = Math.max(rightSidebearingEdge, visibleRightEdge) + wordSpacing;
      continue;
    }

    const guides = getGuides(letter);
    const normalizedStrokes = normalizeStrokes(letter.strokes, guides, target);
    const normalizedCurves = normalizedStrokes.flatMap((stroke) => stroke.curves);
    const normalizedGuides = normalizeGuidesX(letter, target, normalizedCurves);

    const filteredMainStrokes = filterLetterStrokes(normalizedStrokes, "main", config);
    const filteredDeferredStrokes = filterLetterStrokes(
      normalizedStrokes,
      "deferred",
      config
    );
    const mainSteps = buildStepsFromStrokes(filteredMainStrokes);
    const deferredSteps = buildStepsFromDeferredStrokes(filteredDeferredStrokes);
    const visibleBounds = measureCurveBounds(
      filteredMainStrokes.flatMap((stroke) => stroke.curves)
    );

    if (hasPlacedLetter) {
      const visibleMinFromLeftSidebearing = visibleBounds.minX - normalizedGuides.left;
      const sidebearingCursorX = rightSidebearingEdge + config.additionalSpacing;
      const visibleCursorX =
        visibleRightEdge + config.additionalSpacing - visibleMinFromLeftSidebearing;
      cursorX = Math.max(sidebearingCursorX, visibleCursorX);
    }

    const offsetX = cursorX - normalizedGuides.left;
    outputSteps.push(...offsetStepsX(mainSteps, offsetX));
    outputSteps.push(...offsetStepsX(deferredSteps, offsetX));

    const advanceWidth = normalizedGuides.right - normalizedGuides.left;
    rightSidebearingEdge = cursorX + advanceWidth;
    visibleRightEdge = visibleBounds.maxX + offsetX;
    cursorX = Math.max(rightSidebearingEdge, visibleRightEdge);
    hasPlacedLetter = true;
  }

  const { strokes, curves } = buildStrokesFromSteps(outputSteps, new Set<number>());
  const bounds = measureCurveBounds(curves);

  return {
    strokes,
    bounds,
    guides: target
  };
}

export function resolveTargetGuides(options: JoinCursiveOptions): LetterGuides {
  return options.targetGuides ?? {
    xHeight: defaultGuideValues.xHeight,
    baseline: defaultGuideValues.baseline
  };
}

export function resolveWordSpacing(
  target: LetterGuides,
  options: JoinCursiveOptions
): number {
  return options.wordSpacing ?? target.xHeight * 1.5;
}

export function buildStepsFromStrokes(strokes: LetterStroke[]): BezierStep[] {
  const steps: BezierStep[] = [];
  let lastPoint: Point | null = null;
  strokes.forEach((stroke) => {
    const curves = stroke.curves;
    if (curves.length === 0) {
      return;
    }
    const first = curves[0];
    const start = first.p0;
    if (!lastPoint || !pointsMatch(lastPoint, start)) {
      steps.push({ action: "move", x: start.x, y: start.y });
    }
    curves.forEach((curve) => {
      steps.push({
        action: "draw",
        x: curve.p3.x,
        y: curve.p3.y,
        c1: { x: curve.p1.x, y: curve.p1.y },
        c2: { x: curve.p2.x, y: curve.p2.y },
        segment: curve.segment
      });
      lastPoint = curve.p3;
    });
  });
  return steps;
}

export function buildStepsFromDeferredStrokes(strokes: LetterStroke[]): BezierStep[] {
  const steps: BezierStep[] = [];
  strokes.forEach((stroke) => {
    if (stroke.kind === "mark") {
      const mark = stroke.mark ?? stroke.curves[0]?.p0;
      if (!mark) {
        return;
      }
      steps.push({
        action: "mark",
        x: mark.x,
        y: mark.y,
        mark: {
          kind: "dot",
          size: "size" in mark ? (mark.size as number | undefined) : undefined
        },
        segment: "dot",
        deferred: true
      });
      return;
    }
    steps.push(...buildStepsFromCurves(stroke.curves, true));
  });
  return steps;
}

function filterLetterStrokes(
  strokes: LetterStroke[],
  phase: "main" | "deferred",
  visibility: {
    keepLeadIn: boolean;
    keepEntry: boolean;
    keepExit: boolean;
    keepLeadOut: boolean;
  }
): LetterStroke[] {
  return strokes
    .filter((stroke) =>
      phase === "main"
        ? stroke.phase === "main" && stroke.kind === "stroke"
        : stroke.phase === "deferred" || stroke.kind === "mark"
    )
    .map((stroke) => {
      if (stroke.kind === "mark") {
        return stroke;
      }
      return {
        ...stroke,
        curves: filterCurvesBySegment(
          stroke.curves,
          visibility.keepLeadIn,
          visibility.keepEntry,
          visibility.keepExit,
          visibility.keepLeadOut
        )
      };
    })
    .filter((stroke) => stroke.kind === "mark" || stroke.curves.length > 0);
}

function buildStepsFromCurves(curves: Curve[], deferred = false): BezierStep[] {
  if (curves.length === 0) {
    return [];
  }
  const steps: BezierStep[] = [];
  steps.push({ action: "move", x: curves[0].p0.x, y: curves[0].p0.y, deferred });
  curves.forEach((curve) => {
    steps.push({
      action: "draw",
      x: curve.p3.x,
      y: curve.p3.y,
      c1: { x: curve.p1.x, y: curve.p1.y },
      c2: { x: curve.p2.x, y: curve.p2.y },
      segment: curve.segment,
      deferred
    });
  });
  return steps;
}

export function findEntryCurve(strokes: LetterStroke[]): Curve | null {
  for (const stroke of strokes) {
    const entry = stroke.curves.find((curve) => curve.segment === "entry");
    if (entry) {
      return entry;
    }
  }
  return strokes[0]?.curves[0] ?? null;
}

export function findEntryPhaseCurves(strokes: LetterStroke[]): Curve[] {
  const curves = strokes.flatMap((stroke) => stroke.curves);
  const entryPhaseCurves: Curve[] = [];
  let collecting = false;

  for (const curve of curves) {
    if (curve.segment === "entry") {
      collecting = true;
      entryPhaseCurves.push(curve);
      continue;
    }
    if (collecting) {
      break;
    }
  }

  return entryPhaseCurves;
}

export function findExitCurve(strokes: LetterStroke[]): Curve | null {
  for (let i = strokes.length - 1; i >= 0; i -= 1) {
    const curves = strokes[i]?.curves ?? [];
    for (let j = curves.length - 1; j >= 0; j -= 1) {
      if (curves[j]?.segment === "exit") {
        return curves[j];
      }
    }
  }
  const lastStroke = strokes[strokes.length - 1];
  return lastStroke?.curves[lastStroke.curves.length - 1] ?? null;
}

export function filterCurvesBySegment(
  curves: Curve[],
  keepLeadIn: boolean,
  keepEntry: boolean,
  keepExit: boolean,
  keepLeadOut: boolean
): Curve[] {
  return curves.filter((curve) => {
    if (!keepLeadIn && curve.segment === "lead-in") {
      return false;
    }
    if (!keepEntry && curve.segment === "entry") {
      return false;
    }
    if (!keepExit && curve.segment === "exit") {
      return false;
    }
    if (!keepLeadOut && curve.segment === "lead-out") {
      return false;
    }
    return true;
  });
}

function curveToBezier(curve: Curve): CubicBezier {
  return new CubicBezier(curve.p0, curve.p1, curve.p2, curve.p3);
}

export function normalizeStrokes(
  strokes: LetterStroke[],
  guides: LetterGuides,
  target: LetterGuides
): LetterStroke[] {
  const { scale, offset } = getGuideTransform(guides, target);
  const sizeScale = Math.abs(scale);
  return strokes.map((stroke) => ({
    ...stroke,
    mark: stroke.mark
      ? {
          x: stroke.mark.x * scale,
          y: stroke.mark.y * scale + offset,
          size: stroke.mark.size ? stroke.mark.size * sizeScale : undefined
        }
      : undefined,
    curves: stroke.curves.map((curve) => ({
      ...curve,
      p0: { x: curve.p0.x * scale, y: curve.p0.y * scale + offset },
      p1: { x: curve.p1.x * scale, y: curve.p1.y * scale + offset },
      p2: { x: curve.p2.x * scale, y: curve.p2.y * scale + offset },
      p3: { x: curve.p3.x * scale, y: curve.p3.y * scale + offset }
    }))
  }));
}

export function getGuides(letter: BezierLetter): LetterGuides {
  return {
    xHeight: letter.guides?.xHeight ?? defaultGuideValues.xHeight,
    baseline: letter.guides?.baseline ?? defaultGuideValues.baseline,
    ascender: letter.guides?.ascender,
    descender: letter.guides?.descender,
    leftSidebearing: letter.guides?.leftSidebearing,
    rightSidebearing: letter.guides?.rightSidebearing
  };
}

export function normalizeGuidesX(
  letter: BezierLetter,
  target: LetterGuides,
  normalizedCurves: Curve[]
): { left: number; right: number } {
  const guides = getGuides(letter);
  const { scale } = getGuideTransform(guides, target);
  const bounds = measureCurveBounds(normalizedCurves);

  const left = Number.isFinite(guides.leftSidebearing)
    ? guides.leftSidebearing! * scale
    : bounds.minX;
  const right = Number.isFinite(guides.rightSidebearing)
    ? guides.rightSidebearing! * scale
    : bounds.maxX;

  return { left, right };
}

function getGuideTransform(
  guides: LetterGuides,
  target: LetterGuides
): { scale: number; offset: number } {
  const sourceDelta = guides.xHeight - guides.baseline;
  const targetDelta = target.xHeight - target.baseline;
  const scale = sourceDelta !== 0 ? targetDelta / sourceDelta : 1;
  const offset = target.baseline - guides.baseline * scale;
  return { scale, offset };
}

export function curveToStep(curve: Curve, segment?: WritingPathSegment): BezierStep {
  return {
    action: "draw",
    x: curve.p3.x,
    y: curve.p3.y,
    c1: { x: curve.p1.x, y: curve.p1.y },
    c2: { x: curve.p2.x, y: curve.p2.y },
    segment
  };
}

export function buildJoinCurve(exitCurve: Curve, entryCurve: Curve): Curve {
  const p0 = exitCurve.p3;
  const p3 = entryCurve.p0;
  const dx = p3.x - p0.x;
  const dy = p3.y - p0.y;
  const distance = Math.hypot(dx, dy);

  if (distance < 0.1) {
    return { p0, p1: p0, p2: p3, p3 };
  }

  const tanOut = getExitTangent(exitCurve);
  const tanIn = getEntryTangent(entryCurve);

  let lenOut = distance * 0.45;
  let lenIn = distance * 0.45;

  const adjusted = resolveHandleLengths(
    p0,
    p3,
    tanOut,
    tanIn,
    lenOut,
    lenIn,
    distance
  );

  return {
    p0,
    p1: { x: p0.x + tanOut.x * adjusted.lenOut, y: p0.y + tanOut.y * adjusted.lenOut },
    p2: { x: p3.x - tanIn.x * adjusted.lenIn, y: p3.y - tanIn.y * adjusted.lenIn },
    p3
  };
}

function normalizeVector(vector: Point): Point {
  const length = Math.hypot(vector.x, vector.y);
  return length === 0 ? { x: 1, y: 0 } : { x: vector.x / length, y: vector.y / length };
}

function resolveHandleLengths(
  p0: Point,
  p3: Point,
  tanOut: Point,
  tanIn: Point,
  lenOut: number,
  lenIn: number,
  distance: number
): { lenOut: number; lenIn: number } {
  const dx = p3.x - p0.x;
  const dy = p3.y - p0.y;
  const projOut = (tanOut.x * dx + tanOut.y * dy) / distance;
  const projIn = (tanIn.x * dx + tanIn.y * dy) / distance;

  if (projOut < 0) lenOut *= 0.1;
  if (projIn < 0) lenIn *= 0.1;

  const effProjOut = projOut < 0 ? projOut : Math.max(projOut, 0.15);
  const effProjIn = projIn < 0 ? projIn : Math.max(projIn, 0.15);

  const d1 = lenOut * effProjOut;
  const d2 = lenIn * effProjIn;

  if (d1 > 0 && d2 > 0 && d1 + d2 > distance) {
    const scale = (distance * 0.95) / (d1 + d2);
    lenOut *= scale;
    lenIn *= scale;
  }

  return { lenOut: Math.min(lenOut, distance), lenIn: Math.min(lenIn, distance) };
}

export function resolveJoinSpacingOptions(
  options?: JoinSpacingOptions
): ResolvedJoinSpacingOptions {
  return {
    verticalDistanceWeight:
      options?.verticalDistanceWeight ?? defaultJoinSpacingOptions.verticalDistanceWeight,
    angleChangeWeight:
      options?.angleChangeWeight ??
      options?.angleDifferenceWeight ??
      defaultJoinSpacingOptions.angleChangeWeight,
    kerningScale: options?.kerningScale ?? defaultJoinSpacingOptions.kerningScale,
    minSidebearingGap:
      options?.minSidebearingGap ?? defaultJoinSpacingOptions.minSidebearingGap
  };
}

export function measureJoinSpacing(
  exitCurve: Curve,
  entryPhaseCurves: Curve[],
  previousExitToRightSidebearing: number,
  nextEntryFromLeftSidebearing: number,
  options: ResolvedJoinSpacingOptions
): {
  verticalDistance: number;
  angleChangeDegrees: number;
  sharpestBendDegrees: number;
  sharpestBendT: number;
  bendMeasurementSidebearingGap: number;
  bendMeasurementJoinCurve: Curve;
  noBackwardsSidebearingGap: number;
  verticalContribution: number;
  angleChangeContribution: number;
  combinedContribution: number;
  kerningScale: number;
  rawGap: number;
} {
  const entryCurve = entryPhaseCurves[0];
  const lastEntryCurve = entryPhaseCurves[entryPhaseCurves.length - 1];
  if (!entryCurve || !lastEntryCurve) {
    return {
      verticalDistance: 0,
      angleChangeDegrees: 0,
      sharpestBendDegrees: 0,
      sharpestBendT: 0,
      bendMeasurementSidebearingGap,
      bendMeasurementJoinCurve: {
        p0: { x: 0, y: 0 },
        p1: { x: 0, y: 0 },
        p2: { x: 0, y: 0 },
        p3: { x: 0, y: 0 }
      },
      noBackwardsSidebearingGap: 0,
      verticalContribution: 0,
      angleChangeContribution: 0,
      combinedContribution: 0,
      kerningScale: options.kerningScale,
      rawGap: 0
    };
  }

  const minJoinEntryX =
    exitCurve.p3.x +
    previousExitToRightSidebearing +
    options.minSidebearingGap +
    nextEntryFromLeftSidebearing;
  const verticalDistance = Math.abs(entryCurve.p0.y - exitCurve.p3.y);
  const verticalContribution = options.verticalDistanceWeight * verticalDistance;
  const bendMeasurementEntryX =
    exitCurve.p3.x +
    previousExitToRightSidebearing +
    bendMeasurementSidebearingGap +
    nextEntryFromLeftSidebearing;
  const entryOffsetX = bendMeasurementEntryX - entryCurve.p0.x;
  const bendMeasurementEntryCurves = entryPhaseCurves.map((curve) =>
    translateCurve(curve, entryOffsetX, 0)
  );
  const bendMeasurementEntryCurve = bendMeasurementEntryCurves[0]!;
  const bendMeasurementJoinCurve = buildJoinCurve(exitCurve, bendMeasurementEntryCurve);
  const sharpestBend = measureSharpestBend(bendMeasurementJoinCurve);
  const noBackwardsSidebearingGap = measureNoBackwardsSidebearingGap(
    exitCurve,
    entryCurve,
    previousExitToRightSidebearing,
    nextEntryFromLeftSidebearing
  );
  const angleChangeDegrees = sharpestBend.degrees;
  const angleChangeContribution = options.angleChangeWeight * sharpestBend.degrees;
  const combinedContribution = verticalContribution + angleChangeContribution;
  const rawGap = options.kerningScale * combinedContribution;

  return {
    verticalDistance,
    angleChangeDegrees,
    sharpestBendDegrees: sharpestBend.degrees,
    sharpestBendT: sharpestBend.t,
    bendMeasurementSidebearingGap,
    bendMeasurementJoinCurve,
    noBackwardsSidebearingGap,
    verticalContribution,
    angleChangeContribution,
    combinedContribution,
    kerningScale: options.kerningScale,
    rawGap
  };
}

function measureNoBackwardsSidebearingGap(
  exitCurve: Curve,
  entryCurve: Curve,
  previousExitToRightSidebearing: number,
  nextEntryFromLeftSidebearing: number
): number {
  const buildJoinAtSidebearingGap = (sidebearingGap: number): Curve => {
    const entryX =
      exitCurve.p3.x +
      previousExitToRightSidebearing +
      sidebearingGap +
      nextEntryFromLeftSidebearing;
    const shiftedEntryCurve = translateCurve(entryCurve, entryX - entryCurve.p0.x, 0);
    return buildJoinCurve(exitCurve, shiftedEntryCurve);
  };

  const baseRange =
    Math.abs(previousExitToRightSidebearing) + Math.abs(nextEntryFromLeftSidebearing) + 1000;
  let low = -Math.max(1000, baseRange);
  let high = Math.max(1000, baseRange);

  while (!isCurveNonBacktrackingX(buildJoinAtSidebearingGap(high)) && high < 10000) {
    high *= 2;
  }

  if (!isCurveNonBacktrackingX(buildJoinAtSidebearingGap(high))) {
    return high;
  }

  for (let i = 0; i < 36; i += 1) {
    const mid = (low + high) / 2;
    if (isCurveNonBacktrackingX(buildJoinAtSidebearingGap(mid))) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return high;
}

function isCurveNonBacktrackingX(curve: Curve): boolean {
  return getMinimumCurveDx(curve) >= -0.001;
}

function getMinimumCurveDx(curve: Curve): number {
  const x0 = curve.p0.x;
  const x1 = curve.p1.x;
  const x2 = curve.p2.x;
  const x3 = curve.p3.x;
  const a = -x0 + 3 * x1 - 3 * x2 + x3;
  const b = 2 * x0 - 4 * x1 + 2 * x2;
  const c = x1 - x0;
  const candidates = [0, 1];
  if (Math.abs(a) > 0.000001) {
    const vertex = -b / (2 * a);
    if (vertex > 0 && vertex < 1) {
      candidates.push(vertex);
    }
  }
  return Math.min(...candidates.map((t) => 3 * (a * t * t + b * t + c)));
}

function measureSharpestBend(curve: Curve, sampleCount = 80): { degrees: number; t: number } {
  const sampleWindowT = 0.02;
  const rateScaleT = 0.1;
  let sharpest = { degrees: 0, t: 0 };
  const edgeSamplePadding = Math.max(1, Math.ceil(sampleCount * 0.05));

  for (let index = edgeSamplePadding; index <= sampleCount - edgeSamplePadding; index += 1) {
    const t = index / sampleCount;
    const before = getTangentAngleAt(curve, Math.max(0, t - sampleWindowT));
    const after = getTangentAngleAt(curve, Math.min(1, t + sampleWindowT));
    const radiansPerT = getAngleDeltaRadians(before, after) / (sampleWindowT * 2);
    const degrees = radiansPerT * rateScaleT * (180 / Math.PI);
    if (degrees > sharpest.degrees) {
      sharpest = { degrees, t };
    }
  }

  return sharpest;
}

function getTangentAngleAt(curve: Curve, t: number): number {
  const tangent = getCurveDerivativeAt(curve, t);
  return Math.atan2(tangent.y, tangent.x);
}

function getAngleDeltaRadians(a: number, b: number): number {
  let delta = b - a;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return Math.abs(delta);
}

function getCurveDerivativeAt(curve: Curve, t: number): Point {
  const mt = 1 - t;
  return {
    x:
      3 * mt * mt * (curve.p1.x - curve.p0.x) +
      6 * mt * t * (curve.p2.x - curve.p1.x) +
      3 * t * t * (curve.p3.x - curve.p2.x),
    y:
      3 * mt * mt * (curve.p1.y - curve.p0.y) +
      6 * mt * t * (curve.p2.y - curve.p1.y) +
      3 * t * t * (curve.p3.y - curve.p2.y)
  };
}


function getExitTangent(curve: Curve): Point {
  return normalizeVector({
    x: curve.p3.x - curve.p2.x || curve.p3.x - curve.p1.x,
    y: curve.p3.y - curve.p2.y || curve.p3.y - curve.p1.y
  });
}

function getEntryTangent(curve: Curve): Point {
  return normalizeVector({
    x: curve.p1.x - curve.p0.x || curve.p2.x - curve.p0.x,
    y: curve.p1.y - curve.p0.y || curve.p2.y - curve.p0.y
  });
}

function getAngleBetweenVectorsDegrees(a: Point, b: Point): number {
  const dot = a.x * b.x + a.y * b.y;
  const clamped = Math.min(1, Math.max(-1, dot));
  return (Math.acos(clamped) * 180) / Math.PI;
}

function getStepStartPoint(steps: BezierStep[], index: number): Point {
  for (let i = index - 1; i >= 0; i -= 1) {
    const step = steps[i];
    if (step && step.action !== "mark") {
      return { x: step.x, y: step.y };
    }
  }
  const current = steps[index];
  return current ? { x: current.x, y: current.y } : { x: 0, y: 0 };
}

function findFirstDrawableIndex(steps: BezierStep[]): number | null {
  const index = steps.findIndex((step) => step.action !== "mark");
  return index >= 0 ? index : null;
}

export function dropLeadingMove(steps: BezierStep[], joinPoint: Point): BezierStep[] {
  const firstIndex = findFirstDrawableIndex(steps);
  if (firstIndex === null) {
    return steps;
  }
  const first = steps[firstIndex];
  if (first.action === "move" && !pointsMatch(first, joinPoint)) {
    return steps.filter((_, index) => index !== firstIndex);
  }
  return steps;
}

export function ensureJoinStart(steps: BezierStep[], joinPoint: Point): void {
  const firstIndex = findFirstDrawableIndex(steps);
  if (firstIndex === null) {
    return;
  }
  const first = steps[firstIndex];
  if (pointsMatch(first, joinPoint)) {
    if (first.action === "move") {
      first.action = "draw";
    }
    return;
  }
  steps.splice(firstIndex, 0, {
    action: "draw",
    x: joinPoint.x,
    y: joinPoint.y
  });
}

function pointsMatch(a: Point, b: Point, tolerance = 0.5): boolean {
  return Math.abs(a.x - b.x) <= tolerance && Math.abs(a.y - b.y) <= tolerance;
}

export function offsetStepsX(steps: BezierStep[], offset: number): BezierStep[] {
  if (!Number.isFinite(offset) || offset === 0) {
    return steps;
  }
  return steps.map((step) => ({
    ...step,
    x: step.x + offset,
    c1: step.c1 ? { x: step.c1.x + offset, y: step.c1.y } : undefined,
    c2: step.c2 ? { x: step.c2.x + offset, y: step.c2.y } : undefined
  }));
}

export function translateCurve(curve: Curve, dx: number, dy: number): Curve {
  return {
    ...curve,
    p0: { x: curve.p0.x + dx, y: curve.p0.y + dy },
    p1: { x: curve.p1.x + dx, y: curve.p1.y + dy },
    p2: { x: curve.p2.x + dx, y: curve.p2.y + dy },
    p3: { x: curve.p3.x + dx, y: curve.p3.y + dy }
  };
}

export function measureBounds(steps: BezierStep[]): {
  minX: number;
  maxX: number;
} {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;

  steps.forEach((step) => {
    if (step.action === "mark") {
      return;
    }
    minX = Math.min(minX, step.x);
    maxX = Math.max(maxX, step.x);
  });

  return {
    minX: Number.isFinite(minX) ? minX : 0,
    maxX: Number.isFinite(maxX) ? maxX : 0
  };
}

export function measureCurveBounds(curves: Curve[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  curves.forEach((curve) => {
    [curve.p0, curve.p1, curve.p2, curve.p3].forEach((point) => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });
  });

  return {
    minX: Number.isFinite(minX) ? minX : 0,
    maxX: Number.isFinite(maxX) ? maxX : 0,
    minY: Number.isFinite(minY) ? minY : 0,
    maxY: Number.isFinite(maxY) ? maxY : 0
  };
}

export function isLastDrawableChar(text: string, index: number): boolean {
  for (let i = index + 1; i < text.length; i += 1) {
    if (text[i] && text[i].trim() !== "") {
      return false;
    }
  }
  return true;
}

export function findCursiveLetter(
  letterMap: Record<string, BezierLetter>,
  char: string,
  entryVariant: CursiveEntryVariant
): BezierLetter | null {
  const variantKey = createLetterId(char, entryVariant);
  const variantMatch = letterMap[variantKey] ?? lettersByVariantId[variantKey];
  if (variantMatch) {
    return variantMatch;
  }

  const legacyKey = createLegacyLetterId(char);
  const legacyMatch = letterMap[legacyKey] ?? lettersById[legacyKey];
  if (legacyMatch) {
    return legacyMatch;
  }

  const match = Object.values(letterMap).find(
    (letter) =>
      letter.glyph.char.toLowerCase() === char &&
      letter.glyph.case === "lower" &&
      letter.glyph.style === "cursive"
  );
  return match ?? null;
}

export function getEntryVariantForExitVariant(
  exitVariant: CursiveExitVariant | null
): CursiveEntryVariant {
  if (!exitVariant) {
    return defaultCursiveEntryVariant;
  }
  return cursiveEntryVariantByExitVariant[exitVariant];
}

export function getExitVariantForLetter(char: string): CursiveExitVariant {
  return cursiveExitVariantByLetter[char] ?? "low";
}

export function buildStrokesFromSteps(
  steps: BezierStep[],
  joinStepIndices: Set<number>
): { strokes: WritingPath["strokes"]; curves: Curve[] } {
  const strokes: WritingPath["strokes"] = [];
  const curves: Curve[] = [];
  let currentCurves: CubicBezier[] = [];
  let currentSegments: Array<WritingPathSegment | undefined> = [];
  let currentDeferred = false;
  let currentHasJoin = false;

  const flushCurrent = () => {
    if (currentCurves.length === 0) {
      return;
    }
    strokes.push({
      type: currentHasJoin ? "join" : "body",
      curves: currentCurves,
      curveSegments: currentSegments,
      deferred: currentDeferred
    });
    currentCurves = [];
    currentSegments = [];
    currentDeferred = false;
    currentHasJoin = false;
  };

  steps.forEach((step, index) => {
    if (step.action === "move") {
      flushCurrent();
      return;
    }
    const deferred = step.deferred === true || step.action === "mark";
    if (step.action === "mark") {
      flushCurrent();
      const markCurve = markToCurve({
        x: step.x,
        y: step.y,
        kind: step.mark?.kind ?? "dot",
        size: step.mark?.size
      });
      strokes.push({
        type: "body",
        curves: [curveToBezier(markCurve)],
        curveSegments: ["dot"],
        deferred
      });
      curves.push(markCurve);
      return;
    }

    const curve = getCurveFromDrawStep(steps, index);
    currentDeferred = currentDeferred || deferred;
    currentHasJoin = currentHasJoin || joinStepIndices.has(index);
    currentCurves.push(curveToBezier(curve));
    currentSegments.push(step.segment);
    curves.push(curve);
  });

  flushCurrent();

  return { strokes, curves };
}

function markToCurve(mark: BezierMarkPoint): Curve {
  const size = mark.size && mark.size > 0 ? mark.size : 18;
  const radius = Math.max(1, size / 2);
  const endX = mark.x + Math.max(0.5, radius * 0.1);
  const p0 = { x: mark.x, y: mark.y };
  const p3 = { x: endX, y: mark.y };
  const p1 = { x: mark.x + (p3.x - p0.x) / 3, y: mark.y };
  const p2 = { x: mark.x + (2 * (p3.x - p0.x)) / 3, y: mark.y };
  return { p0, p1, p2, p3 };
}

function createLineCurve(p0: Point, p3: Point): Curve {
  return {
    p0,
    p1: { x: p0.x + (p3.x - p0.x) / 3, y: p0.y + (p3.y - p0.y) / 3 },
    p2: { x: p0.x + (2 * (p3.x - p0.x)) / 3, y: p0.y + (2 * (p3.y - p0.y)) / 3 },
    p3
  };
}

function getCurveFromDrawStep(steps: BezierStep[], index: number): Curve {
  const step = steps[index];
  if (!step || step.action !== "draw") {
    const fallback = steps[steps.length - 1];
    return {
      p0: fallback ? { x: fallback.x, y: fallback.y } : { x: 0, y: 0 },
      p1: fallback ? { x: fallback.x, y: fallback.y } : { x: 0, y: 0 },
      p2: fallback ? { x: fallback.x, y: fallback.y } : { x: 0, y: 0 },
      p3: fallback ? { x: fallback.x, y: fallback.y } : { x: 0, y: 0 }
    };
  }
  const start = getStepStartPoint(steps, index);
  if (step.c1 && step.c2) {
    return {
      p0: start,
      p1: step.c1,
      p2: step.c2,
      p3: { x: step.x, y: step.y }
    };
  }
  return createLineCurve(start, { x: step.x, y: step.y });
}

export function listAvailableLetters(): BezierLetter[] {
  return defaultLetters;
}
