import type { BezierStep, Curve, JoinMetric, Point, WritingPath } from "../types";
import { defaultCursiveEntryVariant, type CursiveExitVariant } from "../data";
import {
  buildJoinCurve,
  buildStepsFromDeferredStrokes,
  buildStepsFromStrokes,
  buildStrokesFromSteps,
  curveToStep,
  dropLeadingMove,
  ensureJoinStart,
  filterCurvesBySegment,
  findCursiveLetter,
  findEntryCurve,
  findEntryPhaseCurves,
  findExitCurve,
  getEntryVariantForExitVariant,
  getExitVariantForLetter,
  getGuides,
  isLastDrawableChar,
  measureBounds,
  measureCurveBounds,
  measureJoinSpacing,
  normalizeGuidesX,
  normalizeStrokes,
  offsetStepsX,
  resolveJoinSpacingOptions,
  resolveTargetGuides,
  resolveWordSpacing,
  translateCurve,
  type JoinCursiveOptions
} from "./shared";

export function joinCursiveWord(
  text: string,
  options: JoinCursiveOptions = {}
): WritingPath {
  const letterMap = options.letters ?? {};
  const target = resolveTargetGuides(options);
  const joinSpacing = resolveJoinSpacingOptions(options.joinSpacing);
  const wordSpacing = resolveWordSpacing(target, options);

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
  const keepInitialLeadIn = options.keepInitialLeadIn ?? false;
  const keepFinalLeadOut = options.keepFinalLeadOut ?? false;

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
    const isFirstDrawableLetter = prevExitCurve === null;
    const entryVariant =
      keepInitialLeadIn && isFirstDrawableLetter
        ? defaultCursiveEntryVariant
        : getEntryVariantForExitVariant(prevExitVariant);
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
          keepInitialLeadIn && isFirstDrawableLetter,
          prevExitCurve !== null || (keepInitialLeadIn && isFirstDrawableLetter),
          !isLast || keepFinalLeadOut,
          keepFinalLeadOut && isLast
        )
      }))
      .filter((stroke) => stroke.curves.length > 0);

    const entryCurve = findEntryCurve(filteredMainStrokes);
    const entryPhaseCurves = findEntryPhaseCurves(filteredMainStrokes);
    const exitCurve = findExitCurve(filteredMainStrokes);
    if (!entryCurve || !exitCurve) {
      continue;
    }
    const effectiveEntryPhaseCurves =
      entryPhaseCurves.length > 0 ? entryPhaseCurves : [entryCurve];

    const mainSteps = buildStepsFromStrokes(filteredMainStrokes);
    const deferredStepsForLetter = buildStepsFromDeferredStrokes(deferredStrokes);

    let appliedGap = 0;
    if (prevExitCurve && prevChar) {
      const entryOffsetFromLeftSidebearing = entryCurve.p0.x - normalizedGuides.left;
      const previousExitToRightSidebearing = prevRightSidebearing - prevExitCurve.p3.x;
      const nextEntryFromLeftSidebearing = entryOffsetFromLeftSidebearing;
      const spacing = measureJoinSpacing(
        prevExitCurve,
        effectiveEntryPhaseCurves,
        previousExitToRightSidebearing,
        nextEntryFromLeftSidebearing,
        joinSpacing
      );
      const targetCursorX =
        prevExitCurve.p3.x + spacing.rawGap - entryOffsetFromLeftSidebearing;
      const minCursorX = prevRightSidebearing + joinSpacing.minSidebearingGap;
      cursorX = Math.max(targetCursorX, minCursorX);
      const offsetX = cursorX - normalizedGuides.left;
      const shiftedEntryX = entryCurve.p0.x + offsetX;
      const renderedSidebearingGap = cursorX - prevRightSidebearing;
      const renderedNextEntryFromLeftSidebearing = shiftedEntryX - cursorX;
      appliedGap = shiftedEntryX - prevExitCurve.p3.x;
      joinMetrics.push({
        pairIndex: joinMetrics.length,
        pair: `${prevChar}${char}`,
        previousChar: prevChar,
        nextChar: char,
        verticalDistance: spacing.verticalDistance,
        angleChangeDegrees: spacing.angleChangeDegrees,
        sharpestBendDegrees: spacing.sharpestBendDegrees,
        sharpestBendT: spacing.sharpestBendT,
        bendMeasurementSidebearingGap: spacing.bendMeasurementSidebearingGap,
        bendMeasurementJoinCurve: spacing.bendMeasurementJoinCurve,
        verticalContribution: spacing.verticalContribution,
        angleChangeContribution: spacing.angleChangeContribution,
        combinedContribution: spacing.combinedContribution,
        kerningScale: spacing.kerningScale,
        rawGap: spacing.rawGap,
        appliedGap,
        minSidebearingGap: joinSpacing.minSidebearingGap,
        renderedSidebearingGap,
        renderedExitToEntryGap: appliedGap,
        previousExitToRightSidebearing,
        nextEntryFromLeftSidebearing: renderedNextEntryFromLeftSidebearing,
        previousExitX: prevExitCurve.p3.x,
        previousRightSidebearingX: prevRightSidebearing,
        targetNextLeftSidebearingX: targetCursorX,
        clampedNextLeftSidebearingX: minCursorX,
        actualNextLeftSidebearingX: cursorX,
        nextEntryX: shiftedEntryX
      });
    }

    const offsetX = cursorX - normalizedGuides.left;
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
