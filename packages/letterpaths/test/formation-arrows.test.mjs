import assert from "node:assert/strict";
import test from "node:test";

import {
  buildHandwritingPath,
  compileFormationArrows,
  compileTracingPath,
  formationArrowCommandsToSvgPathData
} from "../dist/index.js";

const preparedSys = () =>
  compileTracingPath(buildHandwritingPath("sys", { style: "cursive" }));

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
