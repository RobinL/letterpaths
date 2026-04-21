import assert from "node:assert/strict";
import test from "node:test";

import {
  analyzeTracingSections,
  buildHandwritingPath,
  compileFormationAnnotations,
  compileFormationArrows,
  compileTracingPath,
  annotationCommandsToSvgPathData,
  formationArrowCommandsToSvgPathData
} from "../dist/index.js";

const preparedSys = () =>
  compileTracingPath(buildHandwritingPath("sys", { style: "cursive" }));

test("tracing boundaries expose incoming and outgoing tangents", () => {
  const prepared = compileTracingPath(buildHandwritingPath("p", { style: "cursive" }));
  const retraceBoundary = prepared.boundaries.find(
    (boundary) =>
      boundary.previousSegment === "descender" && boundary.nextSegment === "ascender"
  );

  assert.ok(retraceBoundary, "Expected p to expose the descender-to-ascender turn boundary.");
  assert.ok(Math.abs(Math.hypot(retraceBoundary.incomingTangent.x, retraceBoundary.incomingTangent.y) - 1) < 0.001);
  assert.ok(Math.abs(Math.hypot(retraceBoundary.outgoingTangent.x, retraceBoundary.outgoingTangent.y) - 1) < 0.001);
  assert.ok(retraceBoundary.incomingTangent.y > 0.9);
  assert.ok(retraceBoundary.outgoingTangent.y < -0.9);
});

test("formation arrows return renderer-agnostic retrace turn geometry", () => {
  const arrows = compileFormationArrows(preparedSys());

  assert.ok(arrows.length > 0, "Expected sys to produce retrace turn arrows.");

  const arrow = arrows[arrows.length - 1];
  assert.equal(arrow.kind, "retrace-turn");
  assert.ok(arrow.commands.some((command) => command.type === "cubic"));
  assert.ok(arrow.head, "Expected default arrowhead geometry.");
  assert.ok(arrow.head.polygon.length >= 3, "Expected polygon arrowhead points.");

  const pathData = formationArrowCommandsToSvgPathData(arrow.commands);
  assert.match(pathData, /^M /);
  assert.match(pathData, / C /);
});

test("formation arrows allow callers to omit arrowhead geometry", () => {
  const arrows = compileFormationArrows(preparedSys(), {
    retraceTurns: {
      head: false
    }
  });

  assert.ok(arrows.length > 0, "Expected retrace turn arrows.");
  assert.equal(arrows[0].head, undefined);
});

test("formation arrow stem lengths clamp to available tracing group ranges", () => {
  const arrows = compileFormationArrows(preparedSys(), {
    retraceTurns: {
      stemLength: 1_000_000
    }
  });

  assert.ok(arrows.length > 0, "Expected retrace turn arrows.");

  arrows.forEach((arrow) => {
    assert.ok(arrow.metrics.incomingStemLength > 0);
    assert.ok(arrow.metrics.outgoingStemLength > 0);
    assert.ok(
      Math.abs(
        arrow.metrics.incomingStemLength -
        (arrow.source.turnDistance - arrow.source.startDistance)
      ) < 0.001
    );
    assert.ok(
      Math.abs(
        arrow.metrics.outgoingStemLength -
        (arrow.source.endDistance - arrow.source.turnDistance)
      ) < 0.001
    );
  });
});

test("tracing sections include retrace restarts for annotation placement", () => {
  const analysis = analyzeTracingSections(preparedSys());

  assert.ok(analysis.sections.length > 1, "Expected sys to split into multiple tracing sections.");
  assert.equal(analysis.sections[0].index, 0);
  assert.equal(analysis.sections[0].startReason, "path-start");
  assert.ok(
    analysis.sections.some((section) => section.startReason === "retrace-turn"),
    "Expected at least one retrace turn section."
  );

  analysis.sections.forEach((section, index) => {
    assert.equal(section.index, index);
    assert.ok(section.endDistance >= section.startDistance);
    assert.ok(Number.isFinite(section.startPoint.x));
    assert.ok(Number.isFinite(section.startPoint.y));
    assert.ok(Number.isFinite(section.startTangent.x));
    assert.ok(Number.isFinite(section.startTangent.y));
  });
});

test("tracing sections use one-sided tangents at retrace boundaries", () => {
  const prepared = compileTracingPath(buildHandwritingPath("p", { style: "cursive" }));
  const boundary = prepared.boundaries.find(
    (candidate) =>
      candidate.previousSegment === "descender" && candidate.nextSegment === "ascender"
  );
  assert.ok(boundary, "Expected p to expose the descender-to-ascender boundary.");

  const sections = analyzeTracingSections(prepared).sections;
  const retraceSection = sections.find(
    (section) => Math.abs(section.startDistance - boundary.overallDistance) < 0.001
  );
  assert.ok(retraceSection, "Expected a retrace section to start at the boundary.");
  const previousSection = sections[retraceSection.index - 1];
  assert.ok(previousSection, "Expected a section before the retrace boundary.");

  const incomingDot =
    previousSection.endTangent.x * boundary.incomingTangent.x +
    previousSection.endTangent.y * boundary.incomingTangent.y;
  const outgoingDot =
    retraceSection.startTangent.x * boundary.outgoingTangent.x +
    retraceSection.startTangent.y * boundary.outgoingTangent.y;

  assert.ok(
    incomingDot > 0.999,
    `Expected previous section to end with incoming tangent, got ${incomingDot}.`
  );
  assert.ok(
    outgoingDot > 0.999,
    `Expected retrace section to start with outgoing tangent, got ${outgoingDot}.`
  );
  assert.ok(
    previousSection.endTangent.y > 0.9 && retraceSection.startTangent.y < -0.9,
    "Expected the p descender turn to switch from downward to upward."
  );
});

test("tracing sections start lifted strokes at the next pen-down point", () => {
  const prepared = compileTracingPath(buildHandwritingPath("x", { style: "cursive" }));
  const analysis = analyzeTracingSections(prepared, { includeRetraceTurns: false });

  assert.equal(analysis.sections.length, 2);
  assert.equal(analysis.sections[1].startReason, "stroke-start");

  const firstStrokeEnd = prepared.strokes[0].samples.at(-1);
  const secondStrokeStart = prepared.strokes[1].samples[0];
  assert.ok(firstStrokeEnd);
  assert.ok(secondStrokeStart);
  assert.ok(Math.hypot(
    analysis.sections[0].endPoint.x - firstStrokeEnd.x,
    analysis.sections[0].endPoint.y - firstStrokeEnd.y
  ) < 0.001);
  assert.ok(Math.hypot(
    analysis.sections[1].startPoint.x - secondStrokeStart.x,
    analysis.sections[1].startPoint.y - secondStrokeStart.y
  ) < 0.001);
});

test("tracing sections end short deferred dots before the next pen-down point", () => {
  ["it", "init"].forEach((word) => {
    const path = buildHandwritingPath(word, {
      style: "cursive",
      keepInitialLeadIn: true,
      keepFinalLeadOut: true
    });
    const prepared = compileTracingPath(path);
    const analysis = analyzeTracingSections(prepared, { includeRetraceTurns: false });
    const dotStrokeIndex = path.strokes.findIndex(
      (stroke) => stroke.deferred && stroke.curveSegments?.includes("dot")
    );
    assert.notEqual(dotStrokeIndex, -1, `Expected ${word} to include a deferred dot.`);

    const dotSection = analysis.sections.find((section) => section.strokeIndex === dotStrokeIndex);
    const dotEnd = prepared.strokes[dotStrokeIndex]?.samples.at(-1);
    const nextStrokeStart = prepared.strokes[dotStrokeIndex + 1]?.samples[0];
    assert.ok(dotSection, `Expected ${word} to include a tracing section for the dot.`);
    assert.ok(dotEnd, `Expected ${word} dot stroke to have samples.`);
    assert.ok(nextStrokeStart, `Expected ${word} dot to be followed by another deferred stroke.`);

    assert.ok(
      Math.hypot(dotSection.endPoint.x - dotEnd.x, dotSection.endPoint.y - dotEnd.y) < 0.001,
      `Expected ${word} dot section to end at its own dot stroke.`
    );
    assert.ok(
      Math.hypot(
        dotSection.endPoint.x - nextStrokeStart.x,
        dotSection.endPoint.y - nextStrokeStart.y
      ) > 1,
      `Expected ${word} dot section not to jump to the next stroke start.`
    );
  });
});

test("offset start arrows at deferred stroke starts ignore pen-up travel", () => {
  const path = buildHandwritingPath("st", {
    style: "cursive",
    keepInitialLeadIn: true,
    keepFinalLeadOut: true
  });
  const prepared = compileTracingPath(path);
  const annotations = compileFormationAnnotations(prepared, {
    turningPoints: false,
    drawOrderNumbers: false,
    midpointArrows: false,
    startArrows: {
      offset: 30
    }
  });
  const crossStartArrow = annotations.find(
    (annotation) =>
      annotation.kind === "start-arrow" &&
      path.strokes[annotation.source.strokeIndex]?.deferred
  );

  assert.ok(crossStartArrow, "Expected st to include a start arrow for the deferred t cross.");

  const points = crossStartArrow.commands.map((command) => command.to);
  const firstSegmentLengths = points
    .slice(1, 8)
    .map((point, index) => Math.hypot(point.x - points[index].x, point.y - points[index].y));
  const maxFirstSegmentLength = Math.max(...firstSegmentLengths);

  assert.ok(
    maxFirstSegmentLength < 10,
    `Expected the deferred cross arrow to stay smooth, got initial segment length ${maxFirstSegmentLength}.`
  );
});

test("offset start arrows at retrace starts follow the outgoing path", () => {
  const prepared = compileTracingPath(buildHandwritingPath("p", { style: "cursive" }));
  const sections = analyzeTracingSections(prepared).sections;
  const annotations = compileFormationAnnotations(prepared, {
    turningPoints: false,
    drawOrderNumbers: false,
    midpointArrows: false,
    startArrows: {
      offset: 30
    }
  });
  const retraceStartArrow = annotations.find(
    (annotation) =>
      annotation.kind === "start-arrow" &&
      sections[annotation.source.sectionIndex]?.startReason === "retrace-turn"
  );
  assert.ok(retraceStartArrow, "Expected p to include a start arrow for the retrace section.");

  const points = retraceStartArrow.commands.map((command) => command.to);
  assert.ok(points.length >= 3, "Expected the retrace start arrow to include multiple points.");
  const first = points[0];
  const second = points[1];
  const third = points[2];
  assert.ok(first);
  assert.ok(second);
  assert.ok(third);

  const firstSegment = normalizeTestVector({
    x: second.x - first.x,
    y: second.y - first.y
  });
  const secondSegment = normalizeTestVector({
    x: third.x - second.x,
    y: third.y - second.y
  });
  const segmentDot = firstSegment.x * secondSegment.x + firstSegment.y * secondSegment.y;

  assert.ok(
    segmentDot > 0,
    `Expected the start arrow to continue forward without an initial reversal, got ${segmentDot}.`
  );
});

test("formation annotations include all supported annotation kinds by default", () => {
  const annotations = compileFormationAnnotations(preparedSys());
  const kinds = new Set(annotations.map((annotation) => annotation.kind));

  assert.ok(kinds.has("turning-point"));
  assert.ok(kinds.has("start-arrow"));
  assert.ok(kinds.has("draw-order-number"));
  assert.ok(kinds.has("midpoint-arrow"));

  const numbers = annotations.filter((annotation) => annotation.kind === "draw-order-number");
  assert.ok(numbers.length > 1);
  numbers.forEach((annotation, index) => {
    assert.equal(annotation.value, index + 1);
    assert.equal(annotation.text, String(index + 1));
  });

  const arrow = annotations.find((annotation) => annotation.kind === "start-arrow");
  assert.ok(arrow, "Expected a start arrow annotation.");
  assert.match(annotationCommandsToSvgPathData(arrow.commands), /^M /);
});

test("directional dashes show bidirectional corridors once with double heads", () => {
  const prepared = compileTracingPath(buildHandwritingPath("p", { style: "cursive" }));
  const annotations = compileFormationAnnotations(prepared, {
    turningPoints: false,
    startArrows: false,
    drawOrderNumbers: false,
    midpointArrows: false,
    directionalDashes: {
      spacing: 120
    }
  }).filter((annotation) => annotation.kind === "directional-dash");

  assert.ok(annotations.length > 0, "Expected p to include directional dashes.");
  assert.ok(
    annotations.some((annotation) => annotation.source.directionality === "bidirectional"),
    "Expected at least one bidirectional directional dash."
  );
  assert.ok(
    annotations.some((annotation) => annotation.source.directionality === "unidirectional"),
    "Expected at least one unidirectional directional dash."
  );

  annotations.forEach((annotation) => {
    assert.match(annotationCommandsToSvgPathData(annotation.commands), /^M /);
    if (annotation.source.directionality === "bidirectional") {
      assert.ok(annotation.tailHead, "Expected bidirectional dashes to include a reverse head.");
    } else {
      assert.equal(annotation.tailHead, undefined);
    }
  });
});

test("directional dash spacing changes dash density", () => {
  const prepared = preparedSys();
  const sparse = compileFormationAnnotations(prepared, {
    turningPoints: false,
    startArrows: false,
    drawOrderNumbers: false,
    midpointArrows: false,
    directionalDashes: {
      spacing: 150
    }
  }).filter((annotation) => annotation.kind === "directional-dash");
  const dense = compileFormationAnnotations(prepared, {
    turningPoints: false,
    startArrows: false,
    drawOrderNumbers: false,
    midpointArrows: false,
    directionalDashes: {
      spacing: 90
    }
  }).filter((annotation) => annotation.kind === "directional-dash");

  assert.ok(dense.length > sparse.length);
});

test("midpoint arrow density controls midpoint threshold and fractional placement", () => {
  const prepared = preparedSys();
  const sparseThreshold = 500;
  const denseThreshold = 180;
  const sparse = compileFormationAnnotations(prepared, {
    turningPoints: false,
    startArrows: false,
    drawOrderNumbers: false,
    midpointArrows: {
      density: sparseThreshold
    }
  }).filter((annotation) => annotation.kind === "midpoint-arrow");
  const dense = compileFormationAnnotations(prepared, {
    turningPoints: false,
    startArrows: false,
    drawOrderNumbers: false,
    midpointArrows: {
      density: denseThreshold
    }
  }).filter((annotation) => annotation.kind === "midpoint-arrow");

  assert.ok(dense.length >= sparse.length);
  assert.ok(dense.length > 0);
  dense.forEach((annotation) => {
    assert.ok(annotation.source.distance > annotation.source.startDistance);
    assert.ok(annotation.source.distance < annotation.source.endDistance);
    const sectionLength = annotation.source.endDistance - annotation.source.startDistance;
    assert.equal(annotation.source.countInSection, Math.floor(sectionLength / denseThreshold));
    assert.ok(
      Math.abs(
        annotation.source.distance -
        (annotation.source.startDistance +
          ((annotation.source.ordinalInSection + 1) * sectionLength) /
            (annotation.source.countInSection + 1))
      ) < 0.001
    );
  });
});

function normalizeTestVector(vector) {
  const length = Math.hypot(vector.x, vector.y);
  return length > 0.0001 ? { x: vector.x / length, y: vector.y / length } : { x: 1, y: 0 };
}
