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
  JoinMetric,
  LetterGuides,
  LetterStroke,
  Point,
  WritingPathSegment,
  WritingPath
} from "../types";
import type { CursiveEntryVariant, CursiveExitVariant } from "../data";

export type JoinCursiveOptions = {
  letters?: Record<string, BezierLetter>;
  targetGuides?: LetterGuides;
  joinSpacing?: JoinSpacingOptions;
  wordSpacing?: number;
};

export type JoinSpacingOptions = {
  verticalDistanceWeight?: number;
  angleDifferenceWeight?: number;
  bendReversalWeight?: number;
  kerningScale?: number;
  minSidebearingGap?: number;
};

const defaultGuideValues = {
  xHeight: 360,
  baseline: 720
};

export const defaultJoinSpacingOptions: Required<JoinSpacingOptions> = {
  verticalDistanceWeight: 0.19,
  angleDifferenceWeight: 0.45,
  bendReversalWeight: 0.5,
  kerningScale: 1,
  minSidebearingGap: 50
};

const maxTangentMismatchForReverseBendDegrees = 60;

export function joinCursiveWord(
  text: string,
  options: JoinCursiveOptions = {}
): WritingPath {
  const letterMap = options.letters ?? lettersByVariantId;
  const target: LetterGuides = options.targetGuides ?? {
    xHeight: defaultGuideValues.xHeight,
    baseline: defaultGuideValues.baseline
  };
  const joinSpacing = resolveJoinSpacingOptions(options.joinSpacing);
  const wordSpacing = options.wordSpacing ?? target.xHeight * 1.5;

  const outputSteps: BezierStep[] = [];
  const deferredWordSteps: BezierStep[] = [];
  const joinStepIndices = new Set<number>();
  const joinMetrics: JoinMetric[] = [];

  const flushDeferredWordSteps = () => {
    if (deferredWordSteps.length === 0) {
      return;
    }
    outputSteps.push(...deferredWordSteps);
    deferredWordSteps.length = 0;
  };

  let cursorX = 0;
  let rightEdge = 0;
  let prevExitCurve: Curve | null = null;
  let prevExitVariant: CursiveExitVariant | null = null;
  let prevRightSidebearing = 0;
  let prevChar: string | null = null;

  for (let charIndex = 0; charIndex < text.length; charIndex += 1) {
    const rawChar = text[charIndex] ?? "";
    if (rawChar.trim() === "") {
      flushDeferredWordSteps();
      prevExitCurve = null;
      prevExitVariant = null;
      prevRightSidebearing = 0;
      prevChar = null;
      cursorX = rightEdge + wordSpacing;
      continue;
    }

    const char = rawChar.toLowerCase();
    const entryVariant = getEntryVariantForExitVariant(prevExitVariant);
    const letter = findCursiveLetter(letterMap, char, entryVariant);
    if (!letter) {
      flushDeferredWordSteps();
      prevExitCurve = null;
      prevExitVariant = null;
      prevRightSidebearing = 0;
      prevChar = null;
      cursorX = rightEdge + wordSpacing;
      continue;
    }

    const isLast = isLastDrawableChar(text, charIndex);
    const guides = getGuides(letter);
    const normalizedStrokes = normalizeStrokes(letter.strokes, guides, target);
    const normalizedCurves = normalizedStrokes.flatMap((stroke) => stroke.curves);
    const normalizedGuides = normalizeGuidesX(letter, target, normalizedCurves);

    const keepLeadIn = false;
    const keepEntry = prevExitCurve !== null;
    const keepExit = !isLast;
    const keepLeadOut = false;

    const mainStrokes = normalizedStrokes.filter(
      (stroke) => stroke.phase === "main" && stroke.kind === "stroke"
    );
    const deferredStrokes = normalizedStrokes.filter(
      (stroke) => stroke.phase === "deferred" || stroke.kind === "mark"
    );

    const filteredMainStrokes = mainStrokes
      .map((stroke) => ({
        ...stroke,
        curves: filterCurvesBySegment(
          stroke.curves,
          keepLeadIn,
          keepEntry,
          keepExit,
          keepLeadOut
        )
      }))
      .filter((stroke) => stroke.curves.length > 0);

    const entryCurve = findEntryCurve(filteredMainStrokes);
    const exitCurve = findExitCurve(filteredMainStrokes);
    if (!entryCurve || !exitCurve) {
      continue;
    }

    const mainSteps = buildStepsFromStrokes(filteredMainStrokes);
    const deferredStepsForLetter = buildStepsFromDeferredStrokes(deferredStrokes);

    let appliedGap = 0;
    if (prevExitCurve && prevChar) {
      const spacing = measureJoinSpacing(prevExitCurve, entryCurve, joinSpacing);
      const entryOffsetFromLeftSidebearing = entryCurve.p0.x - normalizedGuides.left;
      const targetCursorX =
        prevExitCurve.p3.x + spacing.rawGap - entryOffsetFromLeftSidebearing;
      const minCursorX = prevRightSidebearing + joinSpacing.minSidebearingGap;
      cursorX = Math.max(targetCursorX, minCursorX);
      const offsetX = cursorX - normalizedGuides.left;
      const shiftedEntryX = entryCurve.p0.x + offsetX;
      const renderedSidebearingGap = cursorX - prevRightSidebearing;
      const previousExitToRightSidebearing = prevRightSidebearing - prevExitCurve.p3.x;
      const nextEntryFromLeftSidebearing = shiftedEntryX - cursorX;
      appliedGap = shiftedEntryX - prevExitCurve.p3.x;
      joinMetrics.push({
        pairIndex: joinMetrics.length,
        pair: `${prevChar}${char}`,
        previousChar: prevChar,
        nextChar: char,
        verticalDistance: spacing.verticalDistance,
        bendDemandDegrees: spacing.bendDemandDegrees,
        exitToChordTurnDegrees: spacing.exitToChordTurnDegrees,
        chordToEntryTurnDegrees: spacing.chordToEntryTurnDegrees,
        bendReversalDegrees: spacing.bendReversalDegrees,
        verticalContribution: spacing.verticalContribution,
        bendContribution: spacing.bendContribution,
        bendReversalContribution: spacing.bendReversalContribution,
        combinedContribution: spacing.combinedContribution,
        kerningScale: spacing.kerningScale,
        rawGap: spacing.rawGap,
        appliedGap,
        minSidebearingGap: joinSpacing.minSidebearingGap,
        renderedSidebearingGap,
        renderedExitToEntryGap: appliedGap,
        previousExitToRightSidebearing,
        nextEntryFromLeftSidebearing,
        previousExitX: prevExitCurve.p3.x,
        previousRightSidebearingX: prevRightSidebearing,
        targetNextLeftSidebearingX: targetCursorX,
        clampedNextLeftSidebearingX: minCursorX,
        actualNextLeftSidebearingX: cursorX,
        nextEntryX: shiftedEntryX
      });
    }

    const offsetX: number = cursorX - normalizedGuides.left;
    let shifted = offsetStepsX(mainSteps, offsetX);
    const shiftedDeferred = offsetStepsX(deferredStepsForLetter, offsetX);
    const shiftedEntryCurve = translateCurve(entryCurve, offsetX, 0);
    const shiftedExitCurve = translateCurve(exitCurve, offsetX, 0);
    const shiftedEntryPoint: Point = shiftedEntryCurve.p0;

    if (prevExitCurve) {
      shifted = dropLeadingMove(shifted, shiftedEntryPoint);
    }

    if (prevExitCurve) {
      const joinCurve = buildJoinCurve(prevExitCurve, shiftedEntryCurve);
      joinStepIndices.add(outputSteps.length);
      outputSteps.push(curveToStep(joinCurve, "join"));
      ensureJoinStart(shifted, shiftedEntryPoint);
    }

    outputSteps.push(...shifted);
    deferredWordSteps.push(...shiftedDeferred);

    const letterBounds = measureBounds(shifted);
    const advanceWidth = normalizedGuides.right - normalizedGuides.left;
    prevRightSidebearing = cursorX + advanceWidth;
    rightEdge = Math.max(rightEdge, letterBounds.maxX, prevRightSidebearing);
    prevExitCurve = shiftedExitCurve;
    prevExitVariant = getExitVariantForLetter(char);
    prevChar = char;
  }

  flushDeferredWordSteps();

  const { strokes, curves } = buildStrokesFromSteps(outputSteps, joinStepIndices);
  const bounds = measureCurveBounds(curves);

  return {
    strokes,
    bounds,
    guides: target,
    joinMetrics
  };
}

function buildStepsFromStrokes(strokes: LetterStroke[]): BezierStep[] {
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

function buildStepsFromDeferredStrokes(strokes: LetterStroke[]): BezierStep[] {
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

function findEntryCurve(strokes: LetterStroke[]): Curve | null {
  for (const stroke of strokes) {
    const entry = stroke.curves.find((curve) => curve.segment === "entry");
    if (entry) {
      return entry;
    }
  }
  return strokes[0]?.curves[0] ?? null;
}

function findExitCurve(strokes: LetterStroke[]): Curve | null {
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

function filterCurvesBySegment(
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

function normalizeStrokes(
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

function getGuides(letter: BezierLetter): LetterGuides {
  return {
    xHeight: letter.guides?.xHeight ?? defaultGuideValues.xHeight,
    baseline: letter.guides?.baseline ?? defaultGuideValues.baseline,
    ascender: letter.guides?.ascender,
    descender: letter.guides?.descender,
    leftSidebearing: letter.guides?.leftSidebearing,
    rightSidebearing: letter.guides?.rightSidebearing
  };
}

function normalizeGuidesX(
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

function curveToStep(curve: Curve, segment?: WritingPathSegment): BezierStep {
  return {
    action: "draw",
    x: curve.p3.x,
    y: curve.p3.y,
    c1: { x: curve.p1.x, y: curve.p1.y },
    c2: { x: curve.p2.x, y: curve.p2.y },
    segment
  };
}

function buildJoinCurve(exitCurve: Curve, entryCurve: Curve): Curve {
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

function resolveJoinSpacingOptions(
  options?: JoinSpacingOptions
): Required<JoinSpacingOptions> {
  return {
    verticalDistanceWeight:
      options?.verticalDistanceWeight ?? defaultJoinSpacingOptions.verticalDistanceWeight,
    angleDifferenceWeight:
      options?.angleDifferenceWeight ?? defaultJoinSpacingOptions.angleDifferenceWeight,
    bendReversalWeight:
      options?.bendReversalWeight ?? defaultJoinSpacingOptions.bendReversalWeight,
    kerningScale: options?.kerningScale ?? defaultJoinSpacingOptions.kerningScale,
    minSidebearingGap:
      options?.minSidebearingGap ?? defaultJoinSpacingOptions.minSidebearingGap
  };
}

function measureJoinSpacing(
  exitCurve: Curve,
  entryCurve: Curve,
  options: Required<JoinSpacingOptions>
): {
  verticalDistance: number;
  bendDemandDegrees: number;
  exitToChordTurnDegrees: number;
  chordToEntryTurnDegrees: number;
  bendReversalDegrees: number;
  verticalContribution: number;
  bendContribution: number;
  bendReversalContribution: number;
  combinedContribution: number;
  kerningScale: number;
  rawGap: number;
} {
  const exitTangent = getExitTangent(exitCurve);
  const entryTangent = getEntryTangent(entryCurve);
  const chordDirection = normalizeVector({
    x: entryCurve.p0.x - exitCurve.p3.x,
    y: entryCurve.p0.y - exitCurve.p3.y
  });
  const verticalDistance = Math.abs(entryCurve.p0.y - exitCurve.p3.y);
  const exitToChordTurnDegrees = Math.abs(getSignedAngleBetweenVectorsDegrees(exitTangent, chordDirection));
  const chordToEntryTurnDegrees = Math.abs(
    getSignedAngleBetweenVectorsDegrees(chordDirection, entryTangent)
  );
  const exitToEntryTangentDegrees = getAngleBetweenVectorsDegrees(exitTangent, entryTangent);
  const signedExitToChordTurnDegrees = getSignedAngleBetweenVectorsDegrees(
    exitTangent,
    chordDirection
  );
  const signedChordToEntryTurnDegrees = getSignedAngleBetweenVectorsDegrees(
    chordDirection,
    entryTangent
  );
  const bendDemandDegrees = exitToChordTurnDegrees + chordToEntryTurnDegrees;
  const bendReversalDegrees =
    signedExitToChordTurnDegrees !== 0 &&
    signedChordToEntryTurnDegrees !== 0 &&
    Math.sign(signedExitToChordTurnDegrees) !== Math.sign(signedChordToEntryTurnDegrees) &&
    exitToEntryTangentDegrees <= maxTangentMismatchForReverseBendDegrees
      ? Math.min(exitToChordTurnDegrees, chordToEntryTurnDegrees)
      : 0;
  const verticalContribution = options.verticalDistanceWeight * verticalDistance;
  const bendContribution = options.angleDifferenceWeight * bendDemandDegrees;
  const bendReversalContribution = options.bendReversalWeight * bendReversalDegrees;
  const combinedContribution =
    verticalContribution + bendContribution + bendReversalContribution;
  const rawGap = options.kerningScale * combinedContribution;

  return {
    verticalDistance,
    bendDemandDegrees,
    exitToChordTurnDegrees,
    chordToEntryTurnDegrees,
    bendReversalDegrees,
    verticalContribution,
    bendContribution,
    bendReversalContribution,
    combinedContribution,
    kerningScale: options.kerningScale,
    rawGap
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

function getSignedAngleBetweenVectorsDegrees(a: Point, b: Point): number {
  const angle = getAngleBetweenVectorsDegrees(a, b);
  const cross = a.x * b.y - a.y * b.x;
  if (cross === 0) {
    return 0;
  }
  return Math.sign(cross) * angle;
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

function dropLeadingMove(steps: BezierStep[], joinPoint: Point): BezierStep[] {
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

function ensureJoinStart(steps: BezierStep[], joinPoint: Point): void {
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

function offsetStepsX(steps: BezierStep[], offset: number): BezierStep[] {
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

function translateCurve(curve: Curve, dx: number, dy: number): Curve {
  return {
    ...curve,
    p0: { x: curve.p0.x + dx, y: curve.p0.y + dy },
    p1: { x: curve.p1.x + dx, y: curve.p1.y + dy },
    p2: { x: curve.p2.x + dx, y: curve.p2.y + dy },
    p3: { x: curve.p3.x + dx, y: curve.p3.y + dy }
  };
}

function measureBounds(steps: BezierStep[]): {
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

function measureCurveBounds(curves: Curve[]): {
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

function isLastDrawableChar(text: string, index: number): boolean {
  for (let i = index + 1; i < text.length; i += 1) {
    if (text[i] && text[i].trim() !== "") {
      return false;
    }
  }
  return true;
}

function findCursiveLetter(
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

function getEntryVariantForExitVariant(
  exitVariant: CursiveExitVariant | null
): CursiveEntryVariant {
  if (!exitVariant) {
    return defaultCursiveEntryVariant;
  }
  return cursiveEntryVariantByExitVariant[exitVariant];
}

function getExitVariantForLetter(char: string): CursiveExitVariant {
  return cursiveExitVariantByLetter[char] ?? "low";
}

function buildStrokesFromSteps(
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
