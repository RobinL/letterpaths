import assert from "node:assert/strict";
import test from "node:test";

import { buildHandwritingPath } from "../dist/index.js";

const metricFor = (pair, options = {}) => {
  const metric = buildHandwritingPath(pair, { style: "cursive", ...options }).joinMetrics?.[0];
  assert.ok(metric, `Expected a join metric for ${pair}.`);
  return metric;
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
