import test from "node:test";
import assert from "node:assert/strict";
import { CONTENT_WIDTH, layoutWorksheet, caretLocation } from "../src/type-in-worksheet-layout";

test("a blank worksheet has one page and a usable insertion point", () => {
  const layout = layoutWorksheet("", 8);
  assert.equal(layout.pageCount, 1);
  assert.equal(layout.lines.length, 1);
  assert.deepEqual(caretLocation(layout, 0), { row: 0, x: 0 });
});

test("letters render as paths and retain an insertion point for every character", () => {
  const text = "The quick brown fox jumps over the lazy dog";
  const layout = layoutWorksheet(text, 8);
  assert.match(layout.lines[0].markup, /<path d="M /);
  assert.doesNotMatch(layout.lines.map(line => line.markup).join(""), /<text/);
  const indices = new Set(layout.lines.flatMap(line => line.stops.map(stop => stop.index)));
  for (let index = 0; index <= text.length; index++) assert.ok(indices.has(index), `missing caret ${index}`);
  for (const line of layout.lines) {
    assert.ok(line.stops.every(stop => stop.x >= 0 && stop.x <= CONTENT_WIDTH + 0.01));
    assert.ok(line.stops.every((stop, i) => i === 0 || stop.x >= line.stops[i - 1].x));
  }
});

test("blank lines, indentation and a trailing newline survive layout", () => {
  const layout = layoutWorksheet("  cat\n\n dog\n", 8);
  assert.equal(layout.lines.length, 4);
  assert.equal(layout.lines[1].markup, "");
  assert.equal(layout.lines[3].markup, "");
  assert.ok(layout.lines[0].stops.find(stop => stop.index === 2)!.x > 0);
  assert.equal(caretLocation(layout, 12).row, 3);
});

test("long passages paginate and very long unbroken words stay inside the margins", () => {
  for (const height of [3, 8, 16]) {
    const layout = layoutWorksheet("Handwriting practice\n".repeat(35) + "w".repeat(220), height);
    assert.ok(layout.pageCount > 1);
    assert.equal(layout.pageCount, Math.ceil(layout.lines.length / layout.rowsPerPage));
    assert.ok(layout.lines.every(line => line.stops.every(stop => stop.x <= CONTENT_WIDTH + 0.01)));
    const lastBaseline = layout.firstBaseline + (layout.rowsPerPage - 1) * layout.rowPitch;
    assert.ok(lastBaseline + height * 0.8 <= 282);
  }
});

test("pasted punctuation and symbols are escaped and preserve UTF-16 editing offsets", () => {
  const text = "Hi <script> & 123 😀";
  const layout = layoutWorksheet(text, 8);
  const markup = layout.lines.map(line => line.markup).join("");
  assert.ok(!markup.includes("<script>"));
  assert.ok(markup.includes("&lt;") && markup.includes("&gt;") && markup.includes("&amp;"));
  const stops = layout.lines.flatMap(line => line.stops.map(stop => stop.index));
  assert.ok(stops.includes(text.length));
  assert.ok(!stops.includes(text.length - 1), "do not place the caret inside a surrogate pair");
});

test("the same word scales to the selected physical letter height", () => {
  const small = layoutWorksheet("hello", 4).lines[0].stops.at(-1)!.x;
  const large = layoutWorksheet("hello", 8).lines[0].stops.at(-1)!.x;
  assert.equal(large, small * 2);
});
