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

test("bend metric is the tangent-angle-rate term used by join spacing", () => {
  for (const pair of ["oo", "rs", "cu", "aa", "er"]) {
    const metric = metricFor(pair);
    assert.equal(metric.angleChangeDegrees, metric.sharpestBendDegrees);
    assert.ok(metric.sharpestBendDegrees >= 0, `Expected non-negative bend for ${pair}.`);
    assert.ok(metric.sharpestBendT > 0 && metric.sharpestBendT < 1, `Expected bend t inside join for ${pair}.`);
  }
});

test("fixed-gap bend measurement does not depend on spacing controls", () => {
  const defaultMetric = metricFor("cu");
  const retunedMetric = metricFor("cu", {
    joinSpacing: {
      verticalDistanceWeight: -0.8,
      angleChangeWeight: 3.5,
      kerningScale: 0.2,
      minSidebearingGap: -220
    }
  });

  assert.equal(defaultMetric.bendMeasurementSidebearingGap, 5);
  assert.equal(retunedMetric.bendMeasurementSidebearingGap, 5);
  assert.equal(defaultMetric.sharpestBendDegrees, retunedMetric.sharpestBendDegrees);
  assert.equal(defaultMetric.sharpestBendT, retunedMetric.sharpestBendT);
});

test("raw gap combines vertical and fixed-gap bend contributions", () => {
  const metric = metricFor("ac");
  assert.equal(
    metric.rawGap,
    metric.kerningScale * (metric.verticalContribution + metric.angleChangeContribution)
  );
});

test("curvier fixed-gap joins receive larger bend influence", () => {
  const oo = metricFor("oo");
  const rs = metricFor("rs");
  const cu = metricFor("cu");
  const ac = metricFor("ac");
  const er = metricFor("er");

  assert.ok(rs.sharpestBendDegrees > oo.sharpestBendDegrees, `Expected rs bend > oo bend.`);
  assert.ok(cu.sharpestBendDegrees > rs.sharpestBendDegrees, `Expected cu bend > rs bend.`);
  assert.ok(ac.sharpestBendDegrees > er.sharpestBendDegrees, `Expected ac bend > er bend.`);
  assert.ok(cu.angleChangeContribution > rs.angleChangeContribution, `Expected cu bend contribution > rs.`);
  assert.ok(ac.angleChangeContribution > er.angleChangeContribution, `Expected ac bend contribution > er.`);
});

test("bend influence increases raw and applied spacing for sharp unclamped joins", () => {
  const withoutBend = metricFor("aa", { joinSpacing: { angleChangeWeight: 0 } });
  const withBend = metricFor("aa", { joinSpacing: { angleChangeWeight: 5 } });

  assert.ok(withBend.rawGap > withoutBend.rawGap, `Expected bend influence to increase raw gap.`);
  assert.ok(
    withBend.appliedGap > withoutBend.appliedGap,
    `Expected bend influence to increase applied gap when the join is not clamped.`
  );
});

test("minimum sidebearing clamp still applies when raw target is tighter than the minimum", () => {
  const metric = metricFor("oo", { joinSpacing: { angleChangeWeight: 0 } });

  assert.equal(metric.renderedSidebearingGap, metric.minSidebearingGap);
  assert.equal(metric.actualNextLeftSidebearingX, metric.clampedNextLeftSidebearingX);
  assert.ok(metric.appliedGap > metric.rawGap, `Expected sidebearing clamp to dominate oo.`);
});

test("no-backwards clamp applies a pair-specific sidebearing gap after all spacing controls", () => {
  const negativeSpacingOptions = {
    joinSpacing: {
      verticalDistanceWeight: -1,
      angleChangeWeight: 0,
      kerningScale: 1,
      minSidebearingGap: -500
    }
  };
  const metric = metricFor("ur", negativeSpacingOptions);

  assert.ok(metric.rawGap < 0, `Expected retuned controls to request a negative raw gap.`);
  assert.equal(metric.actualNextLeftSidebearingX, metric.noBackwardsNextLeftSidebearingX);
  assert.ok(
    Math.abs(metric.renderedSidebearingGap - metric.noBackwardsSidebearingGap) < 0.000001,
    `Expected rendered gap to use the pair-specific no-backwards gap.`
  );
  assert.ok(metric.noBackwardsSidebearingGap > 0, `Expected a positive no-backwards minimum gap.`);
  assert.ok(minimumCurveDx(firstJoinCurveFor("ur", negativeSpacingOptions)) >= -0.001);
});
