import assert from "node:assert/strict";
import test from "node:test";

import {
  buildHandwritingPath,
  defaultCapitalToLowercaseKerningPairs,
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

test("default capital kerning covers every capital-to-lowercase pair and lead-in mode", () => {
  const missing = [];
  for (const previous of alphabet.map((letter) => letter.toUpperCase())) {
    for (const next of alphabet) {
      const pair = `${previous}${next}`;
      const kerning = defaultCapitalToLowercaseKerningPairs[pair];
      if (
        typeof kerning?.withLeadIn !== "number" ||
        typeof kerning?.withoutLeadIn !== "number"
      ) {
        missing.push(pair);
      }
    }
  }

  assert.deepEqual(missing, []);
  assert.equal(
    Object.values(defaultCapitalToLowercaseKerningPairs).filter(
      (kerning) => kerning.reviewed
    ).length,
    676
  );
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

test("pre-cursive and print spaces preserve a word gap", () => {
  const wordSpacing = 900;
  const styles = ["pre-cursive", "print"];

  for (const style of styles) {
    const compact = buildHandwritingPath("ab", { style, wordSpacing });
    const spaced = buildHandwritingPath("a b", { style, wordSpacing });
    const looser = buildHandwritingPath("ab", { style, letterSpacing: 200 });

    assert.ok(
      spaced.bounds.maxX - compact.bounds.maxX >= wordSpacing * 0.7,
      `${style} should use the configured word spacing after a space`
    );
    assert.ok(
      looser.bounds.maxX - compact.bounds.maxX >= 200,
      `${style} should apply the configured letter spacing adjustment`
    );
  }
});

test("capital letters in cursive text render as standalone print letters", () => {
  const capitalOnly = buildHandwritingPath("A", { style: "cursive" });
  const mixed = buildHandwritingPath("Apple", { style: "cursive" });

  assert.ok(capitalOnly.strokes.length > 0);
  assert.equal(countSegments(capitalOnly, "join"), 0);
  assert.equal(mixed.joinMetrics?.length, 3);
  assert.equal(countSegments(mixed, "join"), 3);
});

test("capital letters follow the cursive initial lead-in setting for the next lowercase", () => {
  const initialLowercase = buildHandwritingPath("apple", {
    style: "cursive",
    keepInitialLeadIn: true
  });
  const capitalOnly = buildHandwritingPath("H", {
    style: "cursive",
    keepInitialLeadIn: true
  });
  const mixed = buildHandwritingPath("Hello", {
    style: "cursive",
    keepInitialLeadIn: true
  });
  const mixedWithoutLeadIn = buildHandwritingPath("Hello", {
    style: "cursive",
    keepInitialLeadIn: false
  });
  const firstLowercaseStroke = mixed.strokes[capitalOnly.strokes.length];
  const firstLowercaseStrokeWithoutLeadIn =
    mixedWithoutLeadIn.strokes[capitalOnly.strokes.length];

  assert.ok(countSegments(initialLowercase, "lead-in") > 0);
  assert.ok(countSegments(initialLowercase, "entry") > 0);
  assert.ok(firstLowercaseStroke);
  assert.equal(firstLowercaseStroke.curveSegments?.[0], "lead-in");
  assert.ok(firstLowercaseStrokeWithoutLeadIn);
  assert.notEqual(firstLowercaseStrokeWithoutLeadIn.curveSegments?.[0], "lead-in");
  assert.notEqual(firstLowercaseStrokeWithoutLeadIn.curveSegments?.[0], "entry");
});

test("capital-to-lowercase pairs use separate manual gaps for each lead-in mode", () => {
  const withLeadIn = buildHandwritingPath("Th", {
    style: "cursive",
    keepInitialLeadIn: true
  }).capitalKerningMetrics?.[0];
  const withoutLeadIn = buildHandwritingPath("Th", {
    style: "cursive",
    keepInitialLeadIn: false
  }).capitalKerningMetrics?.[0];

  assert.ok(withLeadIn);
  assert.ok(withoutLeadIn);
  assert.equal(withLeadIn.pair, "Th");
  assert.equal(withLeadIn.hasLeadIn, true);
  assert.equal(withLeadIn.kerningSource, "default");
  assert.equal(
    withLeadIn.renderedGap,
    defaultCapitalToLowercaseKerningPairs.Th.withLeadIn
  );
  assert.equal(withoutLeadIn.hasLeadIn, false);
  assert.equal(
    withoutLeadIn.renderedGap,
    defaultCapitalToLowercaseKerningPairs.Th.withoutLeadIn
  );
  assert.ok(
    Math.abs(
      withLeadIn.nextVisibleLeftX -
        withLeadIn.previousVisibleRightX -
        withLeadIn.renderedGap
    ) < 0.000001
  );
  assert.ok(
    Math.abs(
      withoutLeadIn.nextVisibleLeftX -
        withoutLeadIn.previousVisibleRightX -
        withoutLeadIn.renderedGap
    ) < 0.000001
  );
});

test("capital kerning can be overridden without affecting lowercase joins", () => {
  const path = buildHandwritingPath("Then", {
    style: "cursive",
    keepInitialLeadIn: true,
    capitalKerning: {
      Th: { withLeadIn: 17.5, withoutLeadIn: 23.5 }
    }
  });
  const capitalMetric = path.capitalKerningMetrics?.[0];

  assert.ok(capitalMetric);
  assert.equal(capitalMetric.kerningSource, "override");
  assert.equal(capitalMetric.renderedGap, 17.5);
  assert.deepEqual(path.joinMetrics?.map((metric) => metric.pair), ["he", "en"]);
});

test("capital-to-lowercase cursive spacing is tighter than capital-to-capital spacing", () => {
  const options = {
    style: "cursive",
    keepInitialLeadIn: false,
    keepFinalLeadOut: false
  };
  const capitalOnly = buildHandwritingPath("F", options);
  const capitalCapital = buildHandwritingPath("FO", options);
  const capitalLowercaseO = buildHandwritingPath("Fo", options);
  const capitalLowercaseC = buildHandwritingPath("Fc", options);
  const capitalRight = maxCurveX(capitalOnly.strokes.flatMap((stroke) => stroke.curves));
  const secondCapitalLeft = minCurveX(
    capitalCapital.strokes.slice(capitalOnly.strokes.length).flatMap((stroke) => stroke.curves)
  );
  const lowercaseOLeft = minCurveX(
    capitalLowercaseO.strokes
      .slice(capitalOnly.strokes.length)
      .flatMap((stroke) => stroke.curves)
  );
  const lowercaseCLeft = minCurveX(
    capitalLowercaseC.strokes
      .slice(capitalOnly.strokes.length)
      .flatMap((stroke) => stroke.curves)
  );

  assert.ok(lowercaseOLeft - capitalRight < secondCapitalLeft - capitalRight);
  assert.ok(lowercaseCLeft - capitalRight < secondCapitalLeft - capitalRight);
});

test("capital letters follow the pre-cursive initial lead-in setting for the next lowercase", () => {
  const initialLowercase = buildHandwritingPath("apple", {
    style: "pre-cursive",
    keepInitialLeadIn: true
  });
  const capitalOnly = buildHandwritingPath("H", {
    style: "pre-cursive",
    keepInitialLeadIn: true
  });
  const mixed = buildHandwritingPath("Happy", {
    style: "pre-cursive",
    keepInitialLeadIn: true
  });
  const mixedWithoutLeadIn = buildHandwritingPath("Happy", {
    style: "pre-cursive",
    keepInitialLeadIn: false
  });
  const firstLowercaseStrokeWithoutLeadIn =
    mixedWithoutLeadIn.strokes[capitalOnly.strokes.length];

  assert.ok(countSegments(initialLowercase, "lead-in") > 0);
  assert.ok(countSegments(initialLowercase, "entry") > 0);
  assert.ok(countSegments(mixed, "lead-in") > 0);
  assert.ok(countSegments(mixed, "entry") > 0);
  assert.ok(firstLowercaseStrokeWithoutLeadIn);
  assert.notEqual(firstLowercaseStrokeWithoutLeadIn.curveSegments?.[0], "lead-in");
  assert.notEqual(firstLowercaseStrokeWithoutLeadIn.curveSegments?.[0], "entry");
});
