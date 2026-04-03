export type LetterStyle = "print" | "cursive";
export type LetterCase = "upper" | "lower";
export type SegmentId =
  | "lead-in"
  | "entry"
  | "lead-out"
  | "exit"
  | "body"
  | "ascender"
  | "descender"
  | "dot";

export type WritingPathSegment = SegmentId | "join";

export type JoinMetric = {
  pairIndex: number;
  pair: string;
  previousChar: string;
  nextChar: string;
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
  appliedGap: number;
  minSidebearingGap: number;
  renderedSidebearingGap: number;
  renderedExitToEntryGap: number;
  previousExitToRightSidebearing: number;
  nextEntryFromLeftSidebearing: number;
  previousExitX: number;
  previousRightSidebearingX: number;
  targetNextLeftSidebearingX: number;
  clampedNextLeftSidebearingX: number;
  actualNextLeftSidebearingX: number;
  nextEntryX: number;
};

export type Point = {
  x: number;
  y: number;
};

export type BezierPoint = Point;

export type BezierMark = { kind: "dot"; size?: number };

export type BezierMarkPoint = {
  x: number;
  y: number;
  kind: "dot";
  size?: number;
};

export type BezierStep = {
  action: "move" | "draw" | "mark";
  x: number;
  y: number;
  c1?: BezierPoint;
  c2?: BezierPoint;
  cornerStart?: boolean;
  cornerEnd?: boolean;
  mark?: BezierMark;
  segment?: WritingPathSegment;
  deferred?: boolean;
};

export type Curve = {
  p0: Point;
  p1: Point;
  p2: Point;
  p3: Point;
  segment?: SegmentId;
};

export type LetterStroke = {
  kind: "stroke" | "mark";
  phase: "main" | "deferred";
  segment?: SegmentId;
  mark?: { x: number; y: number; size?: number };
  curves: Curve[];
};

export type LetterGuides = {
  xHeight: number;
  baseline: number;
  ascender?: number;
  descender?: number;
  leftSidebearing?: number;
  rightSidebearing?: number;
};

export type BezierLetter = {
  schemaVersion: string;
  glyph: {
    char: string;
    case: LetterCase;
    style: LetterStyle;
    name?: string;
  };
  guides?: LetterGuides;
  strokes: LetterStroke[];
};

import type { CubicBezier } from "./geometry/bezier";

export type WritingPath = {
  strokes: {
    type: "lead-in" | "body" | "join" | "exit" | "lift";
    curves: CubicBezier[];
    curveSegments?: Array<WritingPathSegment | undefined>;
    deferred: boolean;
  }[];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  guides: LetterGuides;
  joinMetrics?: JoinMetric[];
};
