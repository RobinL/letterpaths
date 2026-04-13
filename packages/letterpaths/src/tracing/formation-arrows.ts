import type { Point } from "../types";
import type { PreparedTracingPath, TracingSample } from "./compiler";
import {
  analyzeTracingGroups,
  type AnalyzeTracingGroupsOptions,
  type TracingGroup
} from "./groups";

export type FormationArrowPathCommand =
  | { type: "move"; to: Point }
  | { type: "line"; to: Point }
  | { type: "cubic"; cp1: Point; cp2: Point; to: Point };

export type FormationArrowHead = {
  tip: Point;
  direction: Point;
  polygon: Point[];
};

export type FormationArrow = {
  kind: "retrace-turn";
  commands: FormationArrowPathCommand[];
  head?: FormationArrowHead;
  source: {
    previousGroupIndex: number;
    groupIndex: number;
    startDistance: number;
    turnDistance: number;
    endDistance: number;
  };
  metrics: {
    offset: number;
    incomingStemLength: number;
    outgoingStemLength: number;
    headLength?: number;
    headWidth?: number;
    tipExtension?: number;
  };
};

export type FormationArrowHeadOptions = {
  length?: number;
  width?: number;
  tipExtension?: number;
};

export type RetraceTurnArrowOptions = {
  /** Perpendicular distance from the handwriting centreline. */
  offset?: number;
  /** Length outside the U-turn cap, measured along the source handwriting path. */
  stemLength?:
    | number
    | {
        incoming?: number;
        outgoing?: number;
      };
  /** Arrowhead geometry. Set to false to return only the arrow body. */
  head?: false | FormationArrowHeadOptions;
  /** Passed through to retrace group detection when groups are not supplied. */
  groupAnalysis?: AnalyzeTracingGroupsOptions;
  /** Optional precomputed groups for callers that already ran analyzeTracingGroups(). */
  groups?: TracingGroup[];
};

export type CompileFormationArrowsOptions = {
  /** Generate arrows for retrace U-turns. Defaults to enabled. */
  retraceTurns?: false | RetraceTurnArrowOptions;
};

type PoseAtDistanceBias = "forward" | "backward" | "center";

type OffsetPathSample = {
  distance: number;
  point: Point;
};

type ResolvedRetraceTurnArrowOptions = {
  offset: number;
  incomingStemLength: number;
  outgoingStemLength: number;
  head:
    | false
    | {
        length: number;
        width: number;
        tipExtension: number;
      };
  groupAnalysis?: AnalyzeTracingGroupsOptions;
  groups?: TracingGroup[];
};

const REFERENCE_GUIDE_HEIGHT = 380;
const DEFAULT_OFFSET_RATIO = 13 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_STEM_LENGTH_RATIO = 45.6 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_HEAD_LENGTH_RATIO = 26 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_HEAD_WIDTH_RATIO = 22 / REFERENCE_GUIDE_HEIGHT;
const DEFAULT_HEAD_TIP_EXTENSION_RATIO = 11 / REFERENCE_GUIDE_HEIGHT;
const CIRCLE_KAPPA = 0.5522847498;

export function compileFormationArrows(
  path: PreparedTracingPath,
  options: CompileFormationArrowsOptions = {}
): FormationArrow[] {
  if (options.retraceTurns === false) {
    return [];
  }

  return compileRetraceTurnArrows(path, resolveRetraceTurnOptions(path, options.retraceTurns));
}

export function formationArrowCommandsToSvgPathData(
  commands: FormationArrowPathCommand[]
): string {
  return commands
    .map((command) => {
      if (command.type === "move") {
        return `M ${command.to.x} ${command.to.y}`;
      }

      if (command.type === "line") {
        return `L ${command.to.x} ${command.to.y}`;
      }

      return `C ${command.cp1.x} ${command.cp1.y} ${command.cp2.x} ${command.cp2.y} ${command.to.x} ${command.to.y}`;
    })
    .join(" ");
}

function compileRetraceTurnArrows(
  path: PreparedTracingPath,
  options: ResolvedRetraceTurnArrowOptions
): FormationArrow[] {
  const groups =
    options.groups ?? analyzeTracingGroups(path, options.groupAnalysis ?? {}).groups;
  const arrows: FormationArrow[] = [];

  groups.forEach((group, index) => {
    if (group.kind !== "retrace" || index === 0) {
      return;
    }

    const previousGroup = groups[index - 1];
    if (!previousGroup) {
      return;
    }

    const incomingTangent = getGroupEndTangent(path, previousGroup);
    const outgoingTangent = getGroupStartTangent(path, group);
    const turnVector = {
      x: outgoingTangent.x - incomingTangent.x,
      y: outgoingTangent.y - incomingTangent.y
    };
    if (vectorLength(turnVector) < 0.001) {
      return;
    }

    const turnDirection = normalizeVector(turnVector);
    const bendDirection = {
      x: -turnDirection.x,
      y: -turnDirection.y
    };

    const incomingStemLength = Math.min(
      options.incomingStemLength,
      Math.max(0, previousGroup.endDistance - previousGroup.startDistance)
    );
    const outgoingStemLength = Math.min(
      options.outgoingStemLength,
      Math.max(0, group.endDistance - group.startDistance)
    );

    if (incomingStemLength <= 0 || outgoingStemLength <= 0) {
      return;
    }

    const transitionLength = Math.min(
      Math.min(incomingStemLength, outgoingStemLength) * 0.7,
      options.offset * 5.4
    );
    const straightLength = transitionLength * 0.2;
    const blendLength = transitionLength - straightLength;
    const startDistance = previousGroup.endDistance - incomingStemLength;
    const endDistance = group.startDistance + outgoingStemLength;

    const incomingSamples = buildOffsetPathSamplesFromOverallDistanceRange(
      path,
      startDistance,
      previousGroup.endDistance,
      options.offset
    );
    const outgoingSamples = buildOffsetPathSamplesFromOverallDistanceRange(
      path,
      group.startDistance,
      endDistance,
      options.offset
    );

    const arcStart = incomingSamples[incomingSamples.length - 1]?.point;
    const arcEnd = outgoingSamples[0]?.point;
    if (!arcStart || !arcEnd) {
      return;
    }

    const incomingPoints = blendOffsetPathSamplesIntoStraightLane(
      incomingSamples,
      previousGroup.endDistance,
      arcStart,
      bendDirection,
      straightLength,
      blendLength,
      "incoming"
    );
    const outgoingPoints = blendOffsetPathSamplesIntoStraightLane(
      outgoingSamples,
      group.startDistance,
      arcEnd,
      bendDirection,
      straightLength,
      blendLength,
      "outgoing"
    );

    const laneNormal = normalizeVector({
      x: arcStart.x - group.startPoint.x,
      y: arcStart.y - group.startPoint.y
    });
    const commands: FormationArrowPathCommand[] = [];
    appendPolylineCommands(commands, incomingPoints, true);
    commands.push(
      ...buildRetraceArrowPath(
        group.startPoint,
        arcStart,
        arcEnd,
        turnDirection,
        laneNormal,
        options.offset
      )
    );
    appendPolylineCommands(commands, outgoingPoints.slice(1));

    const arrowheadDirection = getPolylineEndDirection(outgoingPoints, outgoingTangent);
    const arrowheadPathEnd = outgoingPoints[outgoingPoints.length - 1] ?? arcEnd;
    const head =
      options.head === false
        ? undefined
        : buildArrowhead(arrowheadPathEnd, arrowheadDirection, options.head);

    arrows.push({
      kind: "retrace-turn",
      commands,
      head,
      source: {
        previousGroupIndex: previousGroup.index,
        groupIndex: group.index,
        startDistance,
        turnDistance: group.startDistance,
        endDistance
      },
      metrics: {
        offset: options.offset,
        incomingStemLength,
        outgoingStemLength,
        ...(options.head === false
          ? {}
          : {
              headLength: options.head.length,
              headWidth: options.head.width,
              tipExtension: options.head.tipExtension
            })
      }
    });
  });

  return arrows;
}

function resolveRetraceTurnOptions(
  path: PreparedTracingPath,
  options: RetraceTurnArrowOptions = {}
): ResolvedRetraceTurnArrowOptions {
  const guideHeight = getGuideHeight(path);
  const defaultStemLength = guideHeight * DEFAULT_STEM_LENGTH_RATIO;
  const stemLength = options.stemLength;
  const incomingStemLength =
    typeof stemLength === "number" ? stemLength : stemLength?.incoming ?? defaultStemLength;
  const outgoingStemLength =
    typeof stemLength === "number" ? stemLength : stemLength?.outgoing ?? defaultStemLength;

  return {
    offset: options.offset ?? guideHeight * DEFAULT_OFFSET_RATIO,
    incomingStemLength,
    outgoingStemLength,
    head:
      options.head === false
        ? false
        : {
            length: options.head?.length ?? guideHeight * DEFAULT_HEAD_LENGTH_RATIO,
            width: options.head?.width ?? guideHeight * DEFAULT_HEAD_WIDTH_RATIO,
            tipExtension:
              options.head?.tipExtension ?? guideHeight * DEFAULT_HEAD_TIP_EXTENSION_RATIO
          },
    groupAnalysis: options.groupAnalysis,
    groups: options.groups
  };
}

function getGuideHeight(path: PreparedTracingPath): number {
  const guideHeight = Math.abs(path.guides.baseline - path.guides.xHeight);
  if (Number.isFinite(guideHeight) && guideHeight > 0) {
    return guideHeight;
  }

  const boundsHeight = Math.abs(path.bounds.maxY - path.bounds.minY);
  return Number.isFinite(boundsHeight) && boundsHeight > 0 ? boundsHeight : REFERENCE_GUIDE_HEIGHT;
}

function interpolateSamplePoint(
  samples: TracingSample[],
  distanceAlongStroke: number
): Point {
  if (samples.length === 0) {
    return { x: 0, y: 0 };
  }

  for (let index = 1; index < samples.length; index += 1) {
    const previous = samples[index - 1];
    const current = samples[index];
    if (!previous || !current) {
      continue;
    }

    if (current.distanceAlongStroke >= distanceAlongStroke) {
      const span = current.distanceAlongStroke - previous.distanceAlongStroke;
      const ratio = span > 0 ? (distanceAlongStroke - previous.distanceAlongStroke) / span : 0;
      return {
        x: previous.x + (current.x - previous.x) * ratio,
        y: previous.y + (current.y - previous.y) * ratio
      };
    }
  }

  const last = samples[samples.length - 1];
  return last ? { x: last.x, y: last.y } : { x: 0, y: 0 };
}

function getPointAtOverallDistance(
  path: PreparedTracingPath,
  targetDistance: number
): Point {
  let remaining = targetDistance;

  for (let index = 0; index < path.strokes.length; index += 1) {
    const stroke = path.strokes[index];
    if (!stroke) {
      continue;
    }

    if (remaining <= stroke.totalLength || index === path.strokes.length - 1) {
      return interpolateSamplePoint(
        stroke.samples,
        Math.max(0, Math.min(remaining, stroke.totalLength))
      );
    }

    remaining -= stroke.totalLength;
  }

  return { x: 0, y: 0 };
}

function getPoseAtOverallDistance(
  path: PreparedTracingPath,
  targetDistance: number,
  bias: PoseAtDistanceBias = "center"
): { point: Point; tangent: Point } {
  const totalLength = getTotalLength(path);
  const clampedDistance = Math.max(0, Math.min(targetDistance, totalLength));
  const point = getPointAtOverallDistance(path, clampedDistance);
  const delta = Math.min(8, Math.max(2, totalLength / 200));

  let fromDistance = Math.max(0, clampedDistance - delta);
  let toDistance = Math.min(totalLength, clampedDistance + delta);

  if (bias === "forward") {
    fromDistance = clampedDistance;
  } else if (bias === "backward") {
    toDistance = clampedDistance;
  }

  if (Math.abs(toDistance - fromDistance) < 0.001) {
    if (clampedDistance <= delta) {
      toDistance = Math.min(totalLength, clampedDistance + delta);
    } else {
      fromDistance = Math.max(0, clampedDistance - delta);
    }
  }

  const fromPoint = getPointAtOverallDistance(path, fromDistance);
  const toPoint = getPointAtOverallDistance(path, toDistance);

  return {
    point,
    tangent: normalizeVector({
      x: toPoint.x - fromPoint.x,
      y: toPoint.y - fromPoint.y
    })
  };
}

function getTotalLength(path: PreparedTracingPath): number {
  return path.strokes.reduce((sum, stroke) => sum + stroke.totalLength, 0);
}

function offsetPosePoint(
  pose: { point: Point; tangent: Point },
  lateralOffset: number
): Point {
  const normal = { x: -pose.tangent.y, y: pose.tangent.x };
  return {
    x: pose.point.x + normal.x * lateralOffset,
    y: pose.point.y + normal.y * lateralOffset
  };
}

function buildOffsetPathSamplesFromOverallDistanceRange(
  path: PreparedTracingPath,
  startDistance: number,
  endDistance: number,
  lateralOffset: number
): OffsetPathSample[] {
  if (endDistance <= startDistance) {
    return [];
  }

  const distances = [startDistance];
  let strokeOffset = 0;

  path.strokes.forEach((stroke) => {
    const strokeStart = strokeOffset;
    const strokeEnd = strokeOffset + stroke.totalLength;
    strokeOffset = strokeEnd;

    if (endDistance < strokeStart || startDistance > strokeEnd) {
      return;
    }

    stroke.samples.forEach((sample) => {
      const overallDistance = strokeStart + sample.distanceAlongStroke;
      if (overallDistance > startDistance && overallDistance < endDistance) {
        distances.push(overallDistance);
      }
    });
  });

  distances.push(endDistance);

  return distances
    .map((distance, index) => {
      const bias =
        index === 0 ? "forward" : index === distances.length - 1 ? "backward" : "center";
      return {
        distance,
        point: offsetPosePoint(getPoseAtOverallDistance(path, distance, bias), lateralOffset)
      };
    })
    .filter((sample, index, samples) => {
      const previous = samples[index - 1];
      return (
        !previous ||
        Math.hypot(sample.point.x - previous.point.x, sample.point.y - previous.point.y) > 0.01
      );
    });
}

function blendOffsetPathSamplesIntoStraightLane(
  samples: OffsetPathSample[],
  turnDistance: number,
  laneAnchor: Point,
  laneDirection: Point,
  straightLength: number,
  blendLength: number,
  mode: "incoming" | "outgoing"
): Point[] {
  const transitionLength = straightLength + blendLength;

  return samples
    .map((sample) => {
      const distanceFromTurn =
        mode === "incoming" ? turnDistance - sample.distance : sample.distance - turnDistance;
      const positiveDistanceFromTurn = Math.max(0, distanceFromTurn);
      const lanePoint = {
        x: laneAnchor.x - laneDirection.x * positiveDistanceFromTurn,
        y: laneAnchor.y - laneDirection.y * positiveDistanceFromTurn
      };

      if (positiveDistanceFromTurn <= straightLength) {
        return lanePoint;
      }

      if (positiveDistanceFromTurn >= transitionLength || blendLength <= 0) {
        return sample.point;
      }

      const blendProgress = (positiveDistanceFromTurn - straightLength) / blendLength;
      return lerpPoint(sample.point, lanePoint, 1 - smoothstep(blendProgress));
    })
    .filter((point, index, points) => {
      const previous = points[index - 1];
      return !previous || Math.hypot(point.x - previous.x, point.y - previous.y) > 0.01;
    });
}

function appendPolylineCommands(
  commands: FormationArrowPathCommand[],
  points: Point[],
  moveToFirst = false
): void {
  if (points.length === 0) {
    return;
  }

  const [firstPoint, ...remainingPoints] = points;
  if (!firstPoint) {
    return;
  }

  commands.push({ type: moveToFirst ? "move" : "line", to: firstPoint });
  remainingPoints.forEach((point) => {
    commands.push({ type: "line", to: point });
  });
}

function buildRetraceArrowPath(
  turnPoint: Point,
  startPoint: Point,
  endPoint: Point,
  turnDirection: Point,
  laneNormal: Point,
  radius: number
): FormationArrowPathCommand[] {
  const bendDirection = {
    x: -turnDirection.x,
    y: -turnDirection.y
  };
  const apex = {
    x: turnPoint.x + bendDirection.x * radius,
    y: turnPoint.y + bendDirection.y * radius
  };
  const control1 = {
    x: startPoint.x + bendDirection.x * radius * CIRCLE_KAPPA,
    y: startPoint.y + bendDirection.y * radius * CIRCLE_KAPPA
  };
  const control2 = {
    x: apex.x + laneNormal.x * radius * CIRCLE_KAPPA,
    y: apex.y + laneNormal.y * radius * CIRCLE_KAPPA
  };
  const control3 = {
    x: apex.x - laneNormal.x * radius * CIRCLE_KAPPA,
    y: apex.y - laneNormal.y * radius * CIRCLE_KAPPA
  };
  const control4 = {
    x: endPoint.x + bendDirection.x * radius * CIRCLE_KAPPA,
    y: endPoint.y + bendDirection.y * radius * CIRCLE_KAPPA
  };

  return [
    { type: "cubic", cp1: control1, cp2: control2, to: apex },
    { type: "cubic", cp1: control3, cp2: control4, to: endPoint }
  ];
}

function buildArrowhead(
  pathEnd: Point,
  direction: Point,
  options: { length: number; width: number; tipExtension: number }
): FormationArrowHead {
  const unitDirection = normalizeVector(direction);
  const tip = {
    x: pathEnd.x + unitDirection.x * options.tipExtension,
    y: pathEnd.y + unitDirection.y * options.tipExtension
  };
  const normal = {
    x: -unitDirection.y,
    y: unitDirection.x
  };
  const baseCenter = {
    x: tip.x - unitDirection.x * options.length,
    y: tip.y - unitDirection.y * options.length
  };
  const halfWidth = options.width / 2;

  return {
    tip,
    direction: unitDirection,
    polygon: [
      tip,
      {
        x: baseCenter.x + normal.x * halfWidth,
        y: baseCenter.y + normal.y * halfWidth
      },
      {
        x: baseCenter.x - normal.x * halfWidth,
        y: baseCenter.y - normal.y * halfWidth
      }
    ]
  };
}

function getPolylineEndDirection(points: Point[], fallback: Point): Point {
  const tip = points[points.length - 1];
  if (!tip) {
    return normalizeVector(fallback);
  }

  for (let index = points.length - 2; index >= 0; index -= 1) {
    const point = points[index];
    if (!point) {
      continue;
    }

    const distance = Math.hypot(tip.x - point.x, tip.y - point.y);
    if (distance >= 1) {
      return normalizeVector({
        x: tip.x - point.x,
        y: tip.y - point.y
      });
    }
  }

  return normalizeVector(fallback);
}

function getGroupEndTangent(path: PreparedTracingPath, group: TracingGroup): Point {
  const sampleDistance = Math.max(group.startDistance, group.endDistance - 24);
  const samplePoint = getPointAtOverallDistance(path, sampleDistance);
  const tangent = normalizeVector({
    x: group.endPoint.x - samplePoint.x,
    y: group.endPoint.y - samplePoint.y
  });

  if (vectorLength(tangent) > 0.001) {
    return tangent;
  }

  return normalizeVector({
    x: group.endPoint.x - group.startPoint.x,
    y: group.endPoint.y - group.startPoint.y
  });
}

function getGroupStartTangent(path: PreparedTracingPath, group: TracingGroup): Point {
  const sampleDistance = Math.min(group.endDistance, group.startDistance + 24);
  const samplePoint = getPointAtOverallDistance(path, sampleDistance);
  const tangent = normalizeVector({
    x: samplePoint.x - group.startPoint.x,
    y: samplePoint.y - group.startPoint.y
  });

  if (vectorLength(tangent) > 0.001) {
    return tangent;
  }

  return normalizeVector({
    x: group.endPoint.x - group.startPoint.x,
    y: group.endPoint.y - group.startPoint.y
  });
}

function smoothstep(value: number): number {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
}

function lerpPoint(from: Point, to: Point, amount: number): Point {
  return {
    x: from.x + (to.x - from.x) * amount,
    y: from.y + (to.y - from.y) * amount
  };
}

function normalizeVector(vector: Point): Point {
  const length = vectorLength(vector);
  return length > 0.0001
    ? {
        x: vector.x / length,
        y: vector.y / length
      }
    : { x: 1, y: 0 };
}

function vectorLength(vector: Point): number {
  return Math.hypot(vector.x, vector.y);
}
