import type {
  BezierLetter,
  BezierStep,
  Curve,
  CursiveKerningPair,
  CursiveKerningPairs,
  JoinMetric,
  Point,
  WritingPath
} from "../types";
import {
  defaultCursiveEntryVariant,
  defaultCursiveKerningPairs,
  type CursiveExitVariant
} from "../data";
import {
  buildJoinCurve,
  buildStepsFromDeferredStrokes,
  buildStepsFromStrokes,
  buildStrokesFromSteps,
  cursiveLetterSpacing,
  curveToStep,
  dropLeadingMove,
  ensureJoinStart,
  filterCurvesBySegment,
  findCursiveLetter,
  findEntryCurve,
  findExitCurve,
  findStandaloneLetter,
  getEntryVariantForExitVariant,
  getExitVariantForLetter,
  getGuides,
  isUppercaseLetter,
  measureBounds,
  measureCurveBounds,
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
  const letterMap: Record<string, BezierLetter> = options.letters ?? {};
  const target = resolveTargetGuides(options);
  const joinSpacing = resolveJoinSpacingOptions(options.joinSpacing);
  const joinKerningOverrides = options.joinKerning ?? {};
  const joinKerning = mergeKerningPairs(defaultCursiveKerningPairs, joinKerningOverrides);
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
  let prevStandaloneRightSidebearing: number | null = null;
  let prevChar: string | null = null;
  let hasPlacedLetter = false;
  const keepInitialLeadIn = options.keepInitialLeadIn ?? false;
  const keepFinalLeadOut = options.keepFinalLeadOut ?? false;

  for (let charIndex = 0; charIndex < text.length; charIndex += 1) {
    const rawChar = text[charIndex] ?? "";
    if (rawChar.trim() === "") {
      flushDeferredWordSteps();
      prevExitCurve = null;
      prevExitVariant = null;
      prevRightSidebearing = 0;
      prevStandaloneRightSidebearing = null;
      prevChar = null;
      hasPlacedLetter = false;
      cursorX = rightEdge + wordSpacing;
      continue;
    }

    if (isUppercaseLetter(rawChar)) {
      flushDeferredWordSteps();

      const letter = findStandaloneLetter(letterMap, rawChar, "print");
      if (!letter) {
        prevExitCurve = null;
        prevExitVariant = null;
        prevRightSidebearing = 0;
        prevStandaloneRightSidebearing = null;
        prevChar = null;
        hasPlacedLetter = false;
        cursorX = rightEdge + wordSpacing;
        continue;
      }

      if (hasPlacedLetter) {
        cursorX = rightEdge + cursiveLetterSpacing;
      }

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
      const mainSteps = buildStepsFromStrokes(mainStrokes);
      const deferredStepsForLetter = buildStepsFromDeferredStrokes(deferredStrokes);
      const offsetX = cursorX - normalizedGuides.left;
      const shifted = offsetStepsX(mainSteps, offsetX);
      const shiftedDeferred = offsetStepsX(deferredStepsForLetter, offsetX);

      outputSteps.push(...shifted, ...shiftedDeferred);

      const visibleBounds = measureCurveBounds(
        mainStrokes.flatMap((stroke) => stroke.curves)
      );
      const advanceWidth = normalizedGuides.right - normalizedGuides.left;
      const rightSidebearing = cursorX + advanceWidth;
      const visibleRight = visibleBounds.maxX + offsetX;
      rightEdge = Math.max(rightEdge, visibleRight, rightSidebearing);
      prevExitCurve = null;
      prevExitVariant = null;
      prevRightSidebearing = 0;
      prevStandaloneRightSidebearing = rightSidebearing;
      prevChar = null;
      hasPlacedLetter = true;
      continue;
    }

    const char = rawChar.toLowerCase();
    if (!prevExitCurve && hasPlacedLetter) {
      cursorX = (prevStandaloneRightSidebearing ?? rightEdge) + cursiveLetterSpacing;
    }

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
      prevStandaloneRightSidebearing = null;
      prevChar = null;
      hasPlacedLetter = false;
      cursorX = rightEdge + wordSpacing;
      continue;
    }

    const isLastInWord = isLastDrawableCharInWord(text, charIndex, letterMap);
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
          !isLastInWord || keepFinalLeadOut,
          keepFinalLeadOut && isLastInWord
        )
      }))
      .filter((stroke) => stroke.curves.length > 0);

    if (prevStandaloneRightSidebearing !== null) {
      const visibleBounds = measureCurveBounds(
        filteredMainStrokes.flatMap((stroke) => stroke.curves)
      );
      const visibleMinFromLeftSidebearing = visibleBounds.minX - normalizedGuides.left;
      const minCursorX =
        prevStandaloneRightSidebearing + cursiveLetterSpacing - visibleMinFromLeftSidebearing;
      cursorX = Math.max(cursorX, minCursorX);
    }

    const entryCurve = findEntryCurve(filteredMainStrokes);
    const exitCurve = findExitCurve(filteredMainStrokes);
    if (!entryCurve || !exitCurve) {
      continue;
    }

    const mainSteps = buildStepsFromStrokes(filteredMainStrokes);
    const deferredStepsForLetter = buildStepsFromDeferredStrokes(deferredStrokes);

    let appliedGap = 0;
    let joinCurveOptions: CursiveKerningPair = {};
    if (prevExitCurve && prevChar) {
      const pair = `${prevChar}${char}`;
      const kerning = getKerningPair(joinKerning, pair);
      joinCurveOptions = kerning;
      const entryOffsetFromLeftSidebearing = entryCurve.p0.x - normalizedGuides.left;
      const previousExitToRightSidebearing = prevRightSidebearing - prevExitCurve.p3.x;
      const baseSidebearingGap = kerning.sidebearingGap ?? 0;
      const renderedSidebearingGap =
        baseSidebearingGap + joinSpacing.sidebearingGapAdjustment;
      cursorX = prevRightSidebearing + renderedSidebearingGap;
      const offsetX = cursorX - normalizedGuides.left;
      const shiftedEntryX = entryCurve.p0.x + offsetX;
      const renderedNextEntryFromLeftSidebearing = shiftedEntryX - cursorX;
      appliedGap = shiftedEntryX - prevExitCurve.p3.x;
      joinMetrics.push({
        pairIndex: joinMetrics.length,
        pair,
        previousChar: prevChar,
        nextChar: char,
        kerningSource: joinKerningOverrides[pair] ? "override" : "default",
        baseSidebearingGap,
        sidebearingGapAdjustment: joinSpacing.sidebearingGapAdjustment,
        exitHandleScale: kerning.exitHandleScale ?? 1,
        entryHandleScale: kerning.entryHandleScale ?? 1,
        appliedGap,
        renderedSidebearingGap,
        renderedExitToEntryGap: appliedGap,
        previousExitToRightSidebearing,
        nextEntryFromLeftSidebearing: renderedNextEntryFromLeftSidebearing,
        previousExitX: prevExitCurve.p3.x,
        previousRightSidebearingX: prevRightSidebearing,
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
      const joinCurve = buildJoinCurve(prevExitCurve, shiftedEntryCurve, joinCurveOptions);
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
    prevStandaloneRightSidebearing = null;
    prevChar = char;
    hasPlacedLetter = true;
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

function isLastDrawableCharInWord(
  text: string,
  index: number,
  letterMap: Record<string, BezierLetter>
): boolean {
  for (let i = index + 1; i < text.length; i += 1) {
    const rawChar = text[i] ?? "";
    if (rawChar.trim() === "") {
      return true;
    }
    if (isUppercaseLetter(rawChar)) {
      return true;
    }
    const char = rawChar.toLowerCase();
    if (findCursiveLetter(letterMap, char, defaultCursiveEntryVariant)) {
      return false;
    }
    return true;
  }
  return true;
}

function getKerningPair(
  joinKerning: CursiveKerningPairs,
  pair: string
): CursiveKerningPair {
  const override = joinKerning[pair];
  if (!override) {
    return {};
  }
  const sidebearingGap =
    typeof override.sidebearingGap === "number" &&
    Number.isFinite(override.sidebearingGap)
      ? override.sidebearingGap
      : undefined;
  const exitHandleScale =
    typeof override.exitHandleScale === "number" &&
    Number.isFinite(override.exitHandleScale)
      ? Math.max(0, override.exitHandleScale)
      : undefined;
  const entryHandleScale =
    typeof override.entryHandleScale === "number" &&
    Number.isFinite(override.entryHandleScale)
      ? Math.max(0, override.entryHandleScale)
      : undefined;
  return sidebearingGap === undefined &&
    exitHandleScale === undefined &&
    entryHandleScale === undefined
    ? {}
    : { sidebearingGap, exitHandleScale, entryHandleScale };
}

function mergeKerningPairs(
  defaults: CursiveKerningPairs,
  overrides: CursiveKerningPairs
): CursiveKerningPairs {
  const merged = { ...defaults };
  for (const [pair, override] of Object.entries(overrides)) {
    merged[pair] = {
      ...defaults[pair],
      ...override
    };
  }
  return merged;
}
