import assert from "node:assert/strict";
import test from "node:test";

import {
  buildHandwritingPath,
  defaultCursiveKerningPairs
} from "../dist/index.js";

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

const metricFor = (pair, options = {}) => {
  const metric = buildHandwritingPath(pair, { style: "cursive", ...options }).joinMetrics?.[0];
  assert.ok(metric, `Expected a join metric for ${pair}.`);
  return metric;
};

const firstJoinCurveFor = (pair, options = {}) => {
  const path = buildHandwritingPath(pair, { style: "cursive", ...options });
  const curve = path.strokes
    .flatMap((stroke) =>
      stroke.curves.map((curve, index) => ({
        curve,
        segment: stroke.curveSegments?.[index]
      }))
    )
    .find((item) => item.segment === "join")?.curve;
  assert.ok(curve, `Expected a join curve for ${pair}.`);
  return curve;
};

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const countSegments = (path, segment) =>
  path.strokes
    .flatMap((stroke) => stroke.curveSegments ?? [])
    .filter((curveSegment) => curveSegment === segment).length;

const maxCurveX = (curves) =>
  Math.max(...curves.flatMap((curve) => [curve.p0.x, curve.p1.x, curve.p2.x, curve.p3.x]));

const minCurveX = (curves) =>
  Math.min(...curves.flatMap((curve) => [curve.p0.x, curve.p1.x, curve.p2.x, curve.p3.x]));

test("default cursive kerning has a sidebearing gap for every lowercase pair", () => {
  const missing = [];
  for (const previous of alphabet) {
    for (const next of alphabet) {
      const pair = `${previous}${next}`;
      if (typeof defaultCursiveKerningPairs[pair]?.sidebearingGap !== "number") {
        missing.push(pair);
      }
    }
  }

  assert.deepEqual(missing, []);
});

test("joins use hard-coded sidebearing gaps by default", () => {
  const pair = "cu";
  const metric = metricFor(pair);

  assert.equal(metric.kerningSource, "default");
  assert.equal(metric.baseSidebearingGap, defaultCursiveKerningPairs[pair].sidebearingGap);
  assert.equal(metric.renderedSidebearingGap, metric.baseSidebearingGap);
  assert.equal(
    metric.actualNextLeftSidebearingX,
    metric.previousRightSidebearingX + metric.renderedSidebearingGap
  );
});

test("sidebearing gap adjustment adds a constant to every hard-coded pair gap", () => {
  const base = metricFor("cu");
  const adjusted = metricFor("cu", {
    joinSpacing: {
      sidebearingGapAdjustment: 25
    }
  });

  assert.equal(adjusted.baseSidebearingGap, base.baseSidebearingGap);
  assert.equal(adjusted.sidebearingGapAdjustment, 25);
  assert.equal(adjusted.renderedSidebearingGap, base.renderedSidebearingGap + 25);
});

test("explicit pair kerning overrides the default hard-coded pair", () => {
  const metric = metricFor("cu", {
    joinKerning: {
      cu: { sidebearingGap: 12.5 }
    }
  });

  assert.equal(metric.kerningSource, "override");
  assert.equal(metric.baseSidebearingGap, 12.5);
  assert.equal(metric.renderedSidebearingGap, 12.5);
});

test("explicit pair kerning can override join handle scales", () => {
  const base = firstJoinCurveFor("cu", {
    joinKerning: {
      cu: { sidebearingGap: 30, exitHandleScale: 1, entryHandleScale: 1 }
    }
  });
  const scaled = firstJoinCurveFor("cu", {
    joinKerning: {
      cu: {
        sidebearingGap: 30,
        exitHandleScale: 0.5,
        entryHandleScale: 0.25
      }
    }
  });
  const metric = metricFor("cu", {
    joinKerning: {
      cu: {
        exitHandleScale: 0.5,
        entryHandleScale: 0.25
      }
    }
  });

  assert.equal(metric.kerningSource, "override");
  assert.equal(metric.baseSidebearingGap, defaultCursiveKerningPairs.cu.sidebearingGap);
  assert.equal(metric.exitHandleScale, 0.5);
  assert.equal(metric.entryHandleScale, 0.25);
  assert.ok(
    Math.abs(distance(scaled.p0, scaled.p1) - distance(base.p0, base.p1) * 0.5) <
      0.000001
  );
  assert.ok(
    Math.abs(distance(scaled.p2, scaled.p3) - distance(base.p2, base.p3) * 0.25) <
      0.000001
  );
});

test("lead-in and lead-out options apply to every word", () => {
  const options = {
    style: "cursive",
    keepInitialLeadIn: true,
    keepFinalLeadOut: true
  };
  const single = buildHandwritingPath("a", options);
  const multi = buildHandwritingPath("a a", options);

  assert.equal(countSegments(multi, "lead-in"), countSegments(single, "lead-in") * 2);
  assert.equal(countSegments(multi, "lead-out"), countSegments(single, "lead-out") * 2);
});

test("capital letters in cursive text render as standalone print letters", () => {
  const capitalOnly = buildHandwritingPath("A", { style: "cursive" });
  const mixed = buildHandwritingPath("Apple", { style: "cursive" });

  assert.ok(capitalOnly.strokes.length > 0);
  assert.equal(countSegments(capitalOnly, "join"), 0);
  assert.equal(mixed.joinMetrics?.length, 3);
  assert.equal(countSegments(mixed, "join"), 3);
});

test("capital letters do not consume initial cursive lead-in", () => {
  const initialLowercase = buildHandwritingPath("apple", {
    style: "cursive",
    keepInitialLeadIn: true
  });
  const mixed = buildHandwritingPath("Hello", {
    style: "cursive",
    keepInitialLeadIn: true
  });
  const firstStrokeWithLeadIn = mixed.strokes.find((stroke) =>
    stroke.curveSegments?.includes("lead-in")
  );
  const firstLeadInStrokeIndex = mixed.strokes.findIndex((stroke) =>
    stroke.curveSegments?.includes("lead-in")
  );
  const previousVisibleMaxX = maxCurveX(
    mixed.strokes.slice(0, firstLeadInStrokeIndex).flatMap((stroke) => stroke.curves)
  );
  const leadInMinX = minCurveX(
    firstStrokeWithLeadIn?.curves.filter(
      (_curve, index) => firstStrokeWithLeadIn.curveSegments?.[index] === "lead-in"
    ) ?? []
  );

  assert.ok(countSegments(initialLowercase, "lead-in") > 0);
  assert.ok(countSegments(initialLowercase, "entry") > 0);
  assert.ok(countSegments(mixed, "lead-in") > 0);
  assert.equal(firstStrokeWithLeadIn?.curveSegments?.[0], "lead-in");
  assert.ok(leadInMinX > previousVisibleMaxX);
});
