import { buildHandwritingPath, lettersByVariantId } from "letterpaths";
import { buildPathD } from "./shared";

export const PAGE_WIDTH = 210;
export const PAGE_HEIGHT = 297;
export const MARGIN = 15;
export const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const UNIT = 380;
const STROKE = 28;

type Shape = { markup: string; width: number; offsets: number[] };
export type CaretStop = { index: number; x: number };
export type WorksheetLine = { markup: string; stops: CaretStop[] };
export type WorksheetLayout = {
  lines: WorksheetLine[];
  rowsPerPage: number;
  pageCount: number;
  rowPitch: number;
  firstBaseline: number;
  height: number;
};

const shapes = new Map<string, Shape>();
const escapeText = (text: string) => text.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]!));

function buildLetters(text: string) {
  return buildHandwritingPath(text, {
    style: "cursive", letters: lettersByVariantId,
    targetGuides: { baseline: 0, xHeight: -UNIT },
    keepInitialLeadIn: true, keepFinalLeadOut: true
  });
}

// Cache geometry at a fixed x-height. Changing height or darkness does not
// rebuild Beziers; editing only generates shapes for newly encountered words.
function shapeWord(text: string): Shape {
  const cached = shapes.get(text);
  if (cached) return cached;
  let x = 0;
  let markup = "";
  const offsets = [0];
  for (const match of text.matchAll(/[A-Za-z]+|[^A-Za-z]/gu)) {
    const part = match[0];
    if (/^[A-Za-z]+$/.test(part)) {
      const path = buildLetters(part);
      const shift = STROKE / 2 - path.bounds.minX;
      const width = path.bounds.maxX - path.bounds.minX + STROKE;
      markup += `<g transform="translate(${x + shift},0)">`;
      markup += path.strokes.filter(stroke => stroke.type !== "lift")
        .map(stroke => `<path d="${buildPathD(stroke.curves)}"/>`).join("");
      markup += "</g>";
      let joinIndex = 0;
      let capitalIndex = 0;
      for (let i = 1; i < part.length; i++) {
        let boundary: number;
        if (/[a-z]/.test(part[i]) && /[a-z]/.test(part[i - 1])) {
          boundary = (path.joinMetrics?.[joinIndex++]?.actualNextLeftSidebearingX ?? 0) + shift;
        } else if (/[a-z]/.test(part[i]) && /[A-Z]/.test(part[i - 1])) {
          boundary = (path.capitalKerningMetrics?.[capitalIndex++]?.actualNextLeftSidebearingX ?? 0) + shift;
        } else {
          const prefix = buildLetters(part.slice(0, i));
          boundary = prefix.bounds.maxX + shift;
        }
        offsets.push(Math.max(offsets[offsets.length - 1], x + Math.min(width, boundary)));
      }
      x += width;
      offsets.push(x);
    } else {
      // Letterpaths has no digit/punctuation glyphs. Keep pasted symbols visible
      // in an ordinary serif face; all A–Z/a–z handwriting is generated paths.
      const width = UNIT * (/[.,:;'’!|]/u.test(part) ? 0.4 : 1.0);
      markup += `<text x="${x}" y="0" textLength="${width}" lengthAdjust="spacingAndGlyphs" class="writer-symbol">${escapeText(part)}</text>`;
      for (let i = 1; i < part.length; i++) offsets.push(x);
      x += width;
      offsets.push(x);
    }
  }
  const shape = { markup, width: x, offsets };
  if (shapes.size >= 512) shapes.delete(shapes.keys().next().value!);
  shapes.set(text, shape);
  return shape;
}

export function layoutWorksheet(text: string, height: number): WorksheetLayout {
  const scale = height / UNIT;
  const rowPitch = height * 3.1;
  const firstBaseline = MARGIN + height * 1.8;
  const rowsPerPage = Math.max(1, Math.floor((PAGE_HEIGHT - MARGIN - firstBaseline - height * 0.8) / rowPitch) + 1);
  const lines: WorksheetLine[] = [];
  let line: WorksheetLine = { markup: "", stops: [{ index: 0, x: 0 }] };
  let x = 0;
  const newLine = (index: number) => {
    lines.push(line);
    line = { markup: "", stops: [{ index, x: 0 }] };
    x = 0;
  };
  const placeWord = (word: string, start: number) => {
    const shape = shapeWord(word);
    // The same index appears on both sides of a soft wrap. Caret lookup chooses
    // the following line while selection can still highlight the preceding one.
    line.stops.push({ index: start, x });
    line.markup += `<g class="writer-ink" transform="translate(${x},0) scale(${scale})" stroke-width="${STROKE}">${shape.markup}</g>`;
    let offset = 0;
    for (const char of word) {
      offset += char.length;
      line.stops.push({ index: start + offset, x: x + shape.offsets[offset] * scale });
    }
    x += shape.width * scale;
  };

  for (const match of text.matchAll(/\n|[^\S\n]+|\S+/gu)) {
    const token = match[0];
    let start = match.index!;
    if (token === "\n") {
      newLine(start + 1);
    } else if (/^\s+$/u.test(token)) {
      for (const char of token) {
        const width = height * (char === "\t" ? 3.6 : 0.9);
        if (x + width > CONTENT_WIDTH) newLine(start);
        x += width;
        start += char.length;
        line.stops.push({ index: start, x });
      }
    } else {
      let remaining = token;
      while (remaining) {
        // Bound the amount of geometry work for a pasted unbroken string.
        const candidates = Array.from(remaining).slice(0, 96);
        const candidate = candidates.join("");
        if (x > 0 && shapeWord(candidate).width * scale > CONTENT_WIDTH - x) newLine(start);
        let count = candidates.length;
        if (shapeWord(candidate).width * scale > CONTENT_WIDTH - x) {
          let low = 1;
          let high = count;
          while (low < high) {
            const mid = Math.ceil((low + high) / 2);
            if (shapeWord(candidates.slice(0, mid).join("")).width * scale <= CONTENT_WIDTH - x) low = mid;
            else high = mid - 1;
          }
          count = low;
        }
        const part = candidates.slice(0, count).join("");
        placeWord(part, start);
        start += part.length;
        remaining = remaining.slice(part.length);
        if (remaining) newLine(start);
      }
    }
  }
  lines.push(line);
  return { lines, rowsPerPage, pageCount: Math.ceil(lines.length / rowsPerPage), rowPitch, firstBaseline, height };
}

export function caretLocation(layout: WorksheetLayout, index: number) {
  for (let row = layout.lines.length - 1; row >= 0; row--) {
    const stop = layout.lines[row].stops.find(stop => stop.index === index);
    if (stop) return { row, x: stop.x };
  }
  return { row: 0, x: 0 };
}

export function nearestStop(line: WorksheetLine, x: number) {
  return line.stops.reduce((best, stop) => Math.abs(stop.x - x) < Math.abs(best.x - x) ? stop : best);
}
