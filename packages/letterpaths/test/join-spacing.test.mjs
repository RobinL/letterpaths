import assert from "node:assert/strict";
import test from "node:test";

import { buildHandwritingPath } from "../dist/index.js";

const metricFor = (pair) => {
  const metric = buildHandwritingPath(pair, { style: "cursive" }).joinMetrics?.[0];
  assert.ok(metric, `Expected a join metric for ${pair}.`);
  return metric;
};

test("angle-change metrics stay low for gentle top joins", () => {
  const om = metricFor("om");
  const oo = metricFor("oo");

  assert.ok(om.angleChangeDegrees < 5, `Expected om to stay near straight, got ${om.angleChangeDegrees}.`);
  assert.ok(oo.angleChangeDegrees < 15, `Expected oo to stay low-demand, got ${oo.angleChangeDegrees}.`);
  assert.ok(om.rawGap < oo.rawGap, `Expected om to kern tighter than oo, got ${om.rawGap} vs ${oo.rawGap}.`);
});

test("angle-change metrics keep re, le, and fe in the low-to-moderate range", () => {
  const re = metricFor("re");
  const le = metricFor("le");
  const fe = metricFor("fe");

  assert.ok(re.angleChangeDegrees > 20 && re.angleChangeDegrees < 45, `Expected re to stay moderate, got ${re.angleChangeDegrees}.`);
  assert.ok(le.angleChangeDegrees > 20 && le.angleChangeDegrees < 35, `Expected le to stay moderate, got ${le.angleChangeDegrees}.`);
  assert.ok(fe.angleChangeDegrees > 25 && fe.angleChangeDegrees < 40, `Expected fe to stay moderate, got ${fe.angleChangeDegrees}.`);
});

test("angle-change metrics stay higher for aa, af, ac, and ec than the gentle/moderate cases", () => {
  const oo = metricFor("oo");
  const re = metricFor("re");
  const le = metricFor("le");
  const fe = metricFor("fe");
  const aa = metricFor("aa");
  const af = metricFor("af");
  const ac = metricFor("ac");
  const ec = metricFor("ec");

  assert.ok(aa.angleChangeDegrees > 50, `Expected aa to have high angle demand, got ${aa.angleChangeDegrees}.`);
  assert.ok(af.angleChangeDegrees > 60, `Expected af to have very high angle demand, got ${af.angleChangeDegrees}.`);
  assert.ok(ac.angleChangeDegrees > 60, `Expected ac to have high angle demand, got ${ac.angleChangeDegrees}.`);
  assert.ok(ec.angleChangeDegrees > 60, `Expected ec to have high angle demand, got ${ec.angleChangeDegrees}.`);
  assert.ok(aa.angleChangeDegrees > re.angleChangeDegrees, `Expected aa > re, got ${aa.angleChangeDegrees} vs ${re.angleChangeDegrees}.`);
  assert.ok(aa.angleChangeDegrees > le.angleChangeDegrees, `Expected aa > le, got ${aa.angleChangeDegrees} vs ${le.angleChangeDegrees}.`);
  assert.ok(af.angleChangeDegrees > fe.angleChangeDegrees, `Expected af > fe, got ${af.angleChangeDegrees} vs ${fe.angleChangeDegrees}.`);
  assert.ok(ac.angleChangeDegrees > fe.angleChangeDegrees, `Expected ac > fe, got ${ac.angleChangeDegrees} vs ${fe.angleChangeDegrees}.`);
  assert.ok(ac.angleChangeDegrees > le.angleChangeDegrees, `Expected ac > le, got ${ac.angleChangeDegrees} vs ${le.angleChangeDegrees}.`);
  assert.ok(ec.angleChangeDegrees > fe.angleChangeDegrees, `Expected ec > fe, got ${ec.angleChangeDegrees} vs ${fe.angleChangeDegrees}.`);
  assert.ok(af.rawGap > aa.rawGap, `Expected af raw gap > aa raw gap, got ${af.rawGap} vs ${aa.rawGap}.`);
  assert.ok(aa.rawGap > oo.rawGap, `Expected aa raw gap > oo raw gap, got ${aa.rawGap} vs ${oo.rawGap}.`);
  assert.ok(ac.rawGap > re.rawGap, `Expected ac raw gap > re raw gap, got ${ac.rawGap} vs ${re.rawGap}.`);
});

test("entry-resolution cases distinguish c joins from r and t joins", () => {
  const ac = metricFor("ac");
  const ec = metricFor("ec");
  const er = metricFor("er");
  const ct = metricFor("ct");

  assert.ok(er.angleChangeDegrees > 30 && er.angleChangeDegrees < 45, `Expected er to stay moderate, got ${er.angleChangeDegrees}.`);
  assert.ok(ct.angleChangeDegrees > 30 && ct.angleChangeDegrees < 45, `Expected ct to stay moderate, got ${ct.angleChangeDegrees}.`);
  assert.ok(ac.angleChangeDegrees > er.angleChangeDegrees + 20, `Expected ac to be clearly higher than er, got ${ac.angleChangeDegrees} vs ${er.angleChangeDegrees}.`);
  assert.ok(ec.angleChangeDegrees > er.angleChangeDegrees + 20, `Expected ec to be clearly higher than er, got ${ec.angleChangeDegrees} vs ${er.angleChangeDegrees}.`);
  assert.ok(ac.angleChangeDegrees > ct.angleChangeDegrees + 20, `Expected ac to be clearly higher than ct, got ${ac.angleChangeDegrees} vs ${ct.angleChangeDegrees}.`);
  assert.ok(ec.angleChangeDegrees > ct.angleChangeDegrees + 20, `Expected ec to be clearly higher than ct, got ${ec.angleChangeDegrees} vs ${ct.angleChangeDegrees}.`);
});
