import assert from "node:assert/strict";
import test from "node:test";
import { buildWritingTimeline } from "../src/magic-pencil/writing-timeline";

const width = 1280;
const height = 720;

test("connected cursive letters cross even very short joins at writing speed", () => {
  for (const word of ["ea", "hello", "minimum", "oo", "gg"]) {
    const { steps } = buildWritingTimeline(word, width, height, height, 216);
    assert.equal(steps.filter(step => step.travel).length, word === "minimum" ? 4 : 2);
    const penDown = steps.slice(1, steps.findIndex((step, index) => index > 0 && step.travel));
    const speed = penDown[0].length / (penDown[0].end - penDown[0].start);
    if (word === "hello") assert.ok(Math.abs(speed - height * 0.27) < 1e-8);
    let hasShortCurve = false;
    for (const [index, step] of penDown.entries()) {
      const duration = step.end - step.start;
      assert.ok(step.length > 0);
      assert.ok(Math.abs(step.length - duration * speed) < 1e-8);
      if (duration < 0.085) hasShortCurve = true;
      if (index > 0) assert.deepEqual(step.curve.p0, penDown[index - 1].curve.p3);
    }
    if (word === "hello" || word === "oo") assert.ok(hasShortCurve);
  }
});

test("multiword text wraps at six characters without splitting a word", () => {
  const innerTravel = (value: string) =>
    buildWritingTimeline(value, width, height, height, 216).steps
      .slice(1, -1).filter(step => step.travel);
  const [sameRow] = innerTravel("go go");
  assert.ok(Math.abs(sameRow.curve.p3.y - sameRow.curve.p0.y) < height * 0.15);
  const [nextRow] = innerTravel("go moo");
  assert.equal(innerTravel("go moo").length, 1);
  assert.ok(nextRow.curve.p3.y - nextRow.curve.p0.y > height * 0.15);
  assert.ok(nextRow.curve.p3.x < nextRow.curve.p0.x);
  assert.equal(innerTravel("marshmallow").length, 0);
});

test("hello takes the same time on its own and when scaled to fit a longer phrase", () => {
  const firstStroke = (value: string) => {
    const { steps } = buildWritingTimeline(value, width, height, height, 216);
    return steps.slice(1, steps.findIndex((step, index) => index > 0 && step.travel));
  };
  const hello = firstStroke("hello");
  const withLongWord = firstStroke("hello extraordinary");
  assert.equal(hello.length, withLongWord.length);
  assert.ok(withLongWord[0].length < hello[0].length);
  assert.ok(Math.abs(hello.at(-1)!.end - withLongWord.at(-1)!.end) < 1e-8);
});

test("separate letters and deferred dots still lift the pencil", () => {
  const repeated = buildWritingTimeline("a", width, height, height, 216).steps;
  assert.equal(repeated.filter(step => step.travel).length, 7);
  const dotted = buildWritingTimeline("ij", width, height, height, 216).steps;
  assert.equal(dotted.filter(step => step.travel).length, 4);
  const dots = dotted.filter(step => !step.travel && step.length < 1);
  assert.equal(dots.length, 2);
  for (const dot of dots) assert.ok(dot.end - dot.start >= 0.084);
});
