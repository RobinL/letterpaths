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
