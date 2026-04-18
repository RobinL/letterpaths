import assert from "node:assert/strict";
import test from "node:test";

import { buildHandwritingPath } from "../dist/index.js";

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

const minimumCurveDx = (curve) => {
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
};

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

test("join spacing searches sidebearing gaps from -30 to 80 by default", () => {
  const metric = metricFor("cu", {
    joinSpacing: {
      minSidebearingGap: -500,
      targetBendRate: 30
    }
  });

  assert.equal(metric.bendSearchMinSidebearingGap, -30);
  assert.equal(metric.bendSearchMaxSidebearingGap, 80);
  assert.equal(metric.bendSearchStep, 1);
  assert.ok(metric.searchedSidebearingGap >= -30);
  assert.ok(metric.searchedSidebearingGap <= 80);
  assert.ok(metric.searchedBendRate <= metric.targetBendRate);
});

test("search sidebearing gap bounds are configurable", () => {
  const metric = metricFor("cu", {
    joinSpacing: {
      minSidebearingGap: -500,
      targetBendRate: 999,
      bendSearchMinSidebearingGap: 10,
      bendSearchMaxSidebearingGap: 40
    }
  });

  assert.equal(metric.bendSearchMinSidebearingGap, 10);
  assert.equal(metric.bendSearchMaxSidebearingGap, 40);
  assert.equal(metric.searchedSidebearingGap, 10);
});

test("reversed search sidebearing gap bounds are normalized", () => {
  const metric = metricFor("cu", {
    joinSpacing: {
      minSidebearingGap: -500,
      targetBendRate: 999,
      bendSearchMinSidebearingGap: 40,
      bendSearchMaxSidebearingGap: 10
    }
  });

  assert.equal(metric.bendSearchMinSidebearingGap, 10);
  assert.equal(metric.bendSearchMaxSidebearingGap, 40);
  assert.equal(metric.searchedSidebearingGap, 10);
});

test("looser bend target chooses the minimum searched sidebearing gap", () => {
  const metric = metricFor("cu", {
    joinSpacing: {
      minSidebearingGap: -500,
      targetBendRate: 999
    }
  });

  assert.equal(metric.searchedSidebearingGap, metric.bendSearchMinSidebearingGap);
});

test("unreachable bend target falls back to the maximum searched sidebearing gap", () => {
  const metric = metricFor("cu", {
    joinSpacing: {
      minSidebearingGap: -500,
      targetBendRate: 0
    }
  });

  assert.equal(metric.searchedSidebearingGap, metric.bendSearchMaxSidebearingGap);
  assert.ok(metric.searchedBendRate > metric.targetBendRate);
});

test("lower target bend rates choose wider sidebearing gaps", () => {
  const loose = metricFor("cu", {
    joinSpacing: {
      minSidebearingGap: -500,
      targetBendRate: 55
    }
  });
  const strict = metricFor("cu", {
    joinSpacing: {
      minSidebearingGap: -500,
      targetBendRate: 25
    }
  });

  assert.ok(strict.searchedSidebearingGap > loose.searchedSidebearingGap);
  assert.ok(strict.searchedBendRate <= strict.targetBendRate);
});

test("minimum sidebearing clamp still applies after bend search", () => {
  const metric = metricFor("oo", {
    joinSpacing: {
      minSidebearingGap: 95,
      targetBendRate: 999
    }
  });

  assert.equal(metric.searchedSidebearingGap, metric.bendSearchMinSidebearingGap);
  assert.equal(metric.renderedSidebearingGap, metric.minSidebearingGap);
  assert.equal(metric.actualNextLeftSidebearingX, metric.clampedNextLeftSidebearingX);
});

test("no-backwards clamp still applies after bend search and minimum sidebearing", () => {
  const options = {
    joinSpacing: {
      minSidebearingGap: -500,
      targetBendRate: 999
    }
  };
  const metric = metricFor("ur", options);

  assert.equal(metric.searchedSidebearingGap, metric.bendSearchMinSidebearingGap);
  assert.equal(metric.actualNextLeftSidebearingX, metric.noBackwardsNextLeftSidebearingX);
  assert.ok(
    Math.abs(metric.renderedSidebearingGap - metric.noBackwardsSidebearingGap) < 0.000001,
    "Expected rendered gap to use the pair-specific no-backwards gap."
  );
  assert.ok(metric.noBackwardsSidebearingGap > metric.searchedSidebearingGap);
  assert.ok(minimumCurveDx(firstJoinCurveFor("ur", options)) >= -0.001);
});

test("join handle scales shorten the outgoing and incoming control handles", () => {
  const base = firstJoinCurveFor("cu", {
    joinSpacing: {
      minSidebearingGap: 200,
      targetBendRate: 999
    }
  });
  const scaled = firstJoinCurveFor("cu", {
    joinSpacing: {
      minSidebearingGap: 200,
      targetBendRate: 999,
      exitHandleScale: 0.5,
      entryHandleScale: 0.25
    }
  });

  assert.equal(scaled.p0.x, base.p0.x);
  assert.equal(scaled.p0.y, base.p0.y);
  assert.equal(scaled.p3.x, base.p3.x);
  assert.equal(scaled.p3.y, base.p3.y);
  assert.ok(
    Math.abs(distance(scaled.p0, scaled.p1) - distance(base.p0, base.p1) * 0.5) <
      0.000001
  );
  assert.ok(
    Math.abs(distance(scaled.p2, scaled.p3) - distance(base.p2, base.p3) * 0.25) <
      0.000001
  );
});
