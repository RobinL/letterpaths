import "./type-in-worksheet.css";
import {
  CONTENT_WIDTH, MARGIN, PAGE_HEIGHT, PAGE_WIDTH,
  caretLocation, layoutWorksheet, nearestStop, type WorksheetLayout
} from "./type-in-worksheet-layout";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Missing worksheet root.");
app.innerHTML = `
  <header class="writer-header">
    <a class="writer-back" href="../">← All handwriting tools</a>
    <div class="writer-heading">
      <div><h1>Type-in worksheet</h1><p>Your words, ready to trace.</p></div>
      <button id="print-worksheet" type="button">Print / save PDF</button>
    </div>
  </header>
  <main>
    <section class="writer-toolbar" aria-label="Worksheet settings">
      <label for="letter-height">Letter height <output id="height-value" for="letter-height">8 mm</output>
        <input id="letter-height" type="range" min="3" max="16" step="0.5" value="8" aria-describedby="height-help" />
        <span id="height-help">Height of a small letter, like a or e</span>
      </label>
      <label for="trace-darkness">Darkness <output id="darkness-value" for="trace-darkness">25%</output>
        <input id="trace-darkness" type="range" min="10" max="80" step="5" value="25" />
        <span>Pale grey → dark grey</span>
      </label>
      <p class="writer-paper-note">A4 · Cursive<br />Print at 100% for the chosen letter height</p>
    </section>
    <fieldset class="writer-guides"><legend>Writing lines</legend>
      <label><input type="checkbox" id="guide-baseline" checked /> Baseline</label>
      <label><input type="checkbox" id="guide-xHeight" checked /> Small-letter height</label>
      <label><input type="checkbox" id="guide-ascender" /> Ascender</label>
      <label><input type="checkbox" id="guide-descender" /> Descender</label>
    </fieldset>
    <div class="writer-help"><p id="typing-help">Click the page to type, or paste your text. Press Enter for a new line.</p><span id="draft-status" role="status">Your draft saves in this browser</span></div>
    <div class="writer-viewport">
      <div class="writer-pages" aria-hidden="true"></div>
      <textarea id="worksheet-text" aria-label="Worksheet text" aria-describedby="typing-help" spellcheck="false" autocapitalize="sentences" autocomplete="off"></textarea>
    </div>
    <p class="writer-footer" id="page-count"></p>
  </main>
`;

const editor = document.querySelector<HTMLTextAreaElement>("#worksheet-text")!;
const height = document.querySelector<HTMLInputElement>("#letter-height")!;
const darkness = document.querySelector<HTMLInputElement>("#trace-darkness")!;
const heightValue = document.querySelector<HTMLOutputElement>("#height-value")!;
const darknessValue = document.querySelector<HTMLOutputElement>("#darkness-value")!;
const printButton = document.querySelector<HTMLButtonElement>("#print-worksheet")!;
const status = document.querySelector<HTMLSpanElement>("#draft-status")!;
const viewport = document.querySelector<HTMLDivElement>(".writer-viewport")!;
const pages = document.querySelector<HTMLDivElement>(".writer-pages")!;
const pageCount = document.querySelector<HTMLParagraphElement>("#page-count")!;
const guideNames = ["baseline", "xHeight", "ascender", "descender"] as const;
const guideInputs = Object.fromEntries(guideNames.map(name => [name,
  document.querySelector<HTMLInputElement>(`#guide-${name}`)!
])) as Record<typeof guideNames[number], HTMLInputElement>;
const storageKey = "letterpaths:type-in-worksheet:v1";
let layout: WorksheetLayout;
let renderRequest = 0;
let desiredX: number | undefined;
let caretRowHint: number | undefined;
let renderedPages: string[] = [];
let saveTimer: ReturnType<typeof setTimeout> | undefined;

const validSetting = (value: unknown, min: number, max: number): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
  if (saved && typeof saved.text === "string") editor.value = saved.text;
  if (saved && validSetting(saved.height, 3, 16)) height.value = String(saved.height);
  if (saved && validSetting(saved.darkness, 10, 80)) darkness.value = String(saved.darkness);
  for (const name of guideNames) {
    if (typeof saved?.guides?.[name] === "boolean") guideInputs[name].checked = saved.guides[name];
  }
  if (editor.value) status.textContent = "Draft restored from this browser";
} catch { /* Browser storage is optional. */ }

function saveDraft() {
  clearTimeout(saveTimer);
  try {
    localStorage.setItem(storageKey, JSON.stringify({
      text: editor.value, height: Number(height.value), darkness: Number(darkness.value),
      guides: Object.fromEntries(guideNames.map(name => [name, guideInputs[name].checked]))
    }));
    status.textContent = "Draft saved in this browser";
  } catch {
    status.textContent = "Draft could not be saved in this browser";
  }
}

function baselineAt(row: number) {
  return layout.firstBaseline + (row % layout.rowsPerPage) * layout.rowPitch;
}

function renderGuides() {
  const offsets = { baseline: 0, xHeight: -layout.height, ascender: -layout.height * 1.63, descender: layout.height * 0.66 };
  return Array.from({ length: layout.rowsPerPage }, (_, row) => guideNames
    .filter(name => guideInputs[name].checked)
    .map(name => {
      const y = baselineAt(row) + offsets[name];
      return `<line class="writer-guide writer-guide--${name}" x1="${MARGIN}" y1="${y}" x2="${PAGE_WIDTH - MARGIN}" y2="${y}"/>`;
    }).join("")).join("");
}

function renderWorksheet() {
  cancelAnimationFrame(renderRequest);
  renderRequest = 0;
  layout = layoutWorksheet(editor.value, Number(height.value));
  const guides = renderGuides();
  const nextPages = Array.from({ length: layout.pageCount }, (_, page) => {
    const startRow = page * layout.rowsPerPage;
    const content = layout.lines.slice(startRow, startRow + layout.rowsPerPage)
      .map((line, row) => `<g transform="translate(${MARGIN},${baselineAt(row)})">${line.markup}</g>`).join("");
    return `<svg class="writer-sheet" data-page="${page}" viewBox="0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      ${guides}<g class="writer-selection"></g>${content}<g class="writer-caret-layer"></g>
    </svg><p class="writer-page-label">Page ${page + 1}</p>`;
  });
  // Preserve unchanged pages while typing into a long worksheet.
  nextPages.forEach((markup, index) => {
    if (renderedPages[index] === markup) return;
    let page = pages.children[index] as HTMLDivElement | undefined;
    if (!page) { page = document.createElement("div"); page.className = "writer-page"; pages.append(page); }
    page.innerHTML = markup;
  });
  while (pages.children.length > nextPages.length) pages.lastElementChild!.remove();
  renderedPages = nextPages;
  pageCount.textContent = `${layout.pageCount} ${layout.pageCount === 1 ? "page" : "pages"} · A4`;
  updateSelection();
}

function applySettings() {
  const grey = Math.round(255 * (1 - Number(darkness.value) / 100));
  document.documentElement.style.setProperty("--trace-colour", `rgb(${grey}, ${grey}, ${grey})`);
  heightValue.value = `${height.value} mm`;
  darknessValue.value = `${darkness.value}%`;
  renderWorksheet();
}

function activeIndex() {
  return editor.selectionDirection === "backward" ? editor.selectionStart : editor.selectionEnd;
}

function currentCaret() {
  const index = activeIndex();
  const stop = caretRowHint === undefined ? undefined : layout.lines[caretRowHint]?.stops.find(stop => stop.index === index);
  return stop ? { row: caretRowHint!, x: stop.x } : caretLocation(layout, index);
}

function updateSelection() {
  if (!layout) return;
  const focused = document.activeElement === editor;
  viewport.classList.toggle("writer-viewport--focused", focused);
  const [start, end] = [editor.selectionStart, editor.selectionEnd];
  const selectionMarkup = Array<string>(layout.pageCount).fill("");
  if (start !== end) {
    layout.lines.forEach((line, row) => {
      const first = line.stops[0];
      const last = line.stops[line.stops.length - 1];
      if (end <= first.index || start > last.index) return;
      const left = start <= first.index ? 0 : (line.stops.find(stop => stop.index >= start)?.x ?? last.x);
      const right = end > last.index ? CONTENT_WIDTH : (line.stops.find(stop => stop.index >= end)?.x ?? last.x);
      selectionMarkup[Math.floor(row / layout.rowsPerPage)] += `<rect x="${MARGIN + left}" y="${baselineAt(row) - layout.height * 1.65}" width="${Math.max(0.7, right - left)}" height="${layout.height * 2.35}"/>`;
    });
  }
  const caret = currentCaret();
  const caretPage = Math.floor(caret.row / layout.rowsPerPage);
  const x = MARGIN + caret.x;
  const y = baselineAt(caret.row) - layout.height * 1.65;
  const sheets = pages.querySelectorAll<SVGSVGElement>(".writer-sheet");
  sheets.forEach((sheet, page) => {
    sheet.querySelector(".writer-selection")!.innerHTML = selectionMarkup[page];
    sheet.querySelector(".writer-caret-layer")!.innerHTML = focused && start === end && page === caretPage
      ? `<line class="writer-caret" x1="${x}" y1="${y}" x2="${x}" y2="${baselineAt(caret.row) + layout.height * 0.65}"/>` : "";
  });
  const sheet = sheets[caretPage];
  if (sheet) {
    const rect = sheet.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    const scale = rect.width / PAGE_WIDTH;
    // Anchor the native input at the visible caret for mobile keyboards and IME.
    editor.style.left = `${rect.left - viewportRect.left + x * scale}px`;
    editor.style.top = `${rect.top - viewportRect.top + y * scale}px`;
    editor.style.height = `${layout.height * 2.3 * scale}px`;
  }
}

function revealCaret() {
  const rect = editor.getBoundingClientRect();
  if (rect.top < 16 || rect.bottom > window.innerHeight - 30) editor.scrollIntoView({ block: "nearest" });
}

function setSelection(index: number, anchor = index, rowHint?: number) {
  caretRowHint = rowHint;
  editor.setSelectionRange(Math.min(index, anchor), Math.max(index, anchor), index < anchor ? "backward" : "forward");
  updateSelection();
}

function selectionAnchor() {
  return editor.selectionDirection === "backward" ? editor.selectionEnd : editor.selectionStart;
}

function indexAtPointer(event: PointerEvent | MouseEvent) {
  if (renderRequest) renderWorksheet();
  const sheets = Array.from(pages.querySelectorAll<SVGSVGElement>(".writer-sheet"));
  let page = sheets.findIndex(sheet => event.clientY <= sheet.getBoundingClientRect().bottom);
  if (page < 0) page = sheets.length - 1;
  const rect = sheets[page].getBoundingClientRect();
  const x = (event.clientX - rect.left) * PAGE_WIDTH / rect.width - MARGIN;
  const y = (event.clientY - rect.top) * PAGE_HEIGHT / rect.height;
  const localRow = Math.max(0, Math.min(layout.rowsPerPage - 1, Math.round((y - layout.firstBaseline + layout.height * 0.5) / layout.rowPitch)));
  const row = Math.min(layout.lines.length - 1, page * layout.rowsPerPage + localRow);
  return { index: nearestStop(layout.lines[row], x).index, row };
}

let dragAnchor: number | undefined;
let touchStart: { x: number; y: number } | undefined;
pages.addEventListener("pointerdown", event => {
  if (event.button !== 0) return;
  if (event.pointerType === "touch") { touchStart = { x: event.clientX, y: event.clientY }; return; }
  event.preventDefault();
  const { index, row } = indexAtPointer(event);
  dragAnchor = event.shiftKey ? selectionAnchor() : index;
  desiredX = undefined;
  editor.focus({ preventScroll: true });
  setSelection(index, dragAnchor, row);
  pages.setPointerCapture(event.pointerId);
});
pages.addEventListener("pointermove", event => {
  if (dragAnchor !== undefined) {
    const { index, row } = indexAtPointer(event);
    setSelection(index, dragAnchor, row);
  }
});
pages.addEventListener("pointerup", event => {
  if (touchStart && Math.hypot(event.clientX - touchStart.x, event.clientY - touchStart.y) < 10) {
    editor.focus({ preventScroll: true });
    const { index, row } = indexAtPointer(event);
    setSelection(index, index, row);
  }
  touchStart = undefined;
  dragAnchor = undefined;
});
pages.addEventListener("pointercancel", () => { touchStart = undefined; dragAnchor = undefined; });
pages.addEventListener("dblclick", event => {
  const { index } = indexAtPointer(event);
  let start = index;
  let end = index;
  while (start > 0 && !/\s/.test(editor.value[start - 1])) start--;
  while (end < editor.value.length && !/\s/.test(editor.value[end])) end++;
  setSelection(end, start);
});

// The textarea owns text, clipboard, undo and composition. Only navigation that
// depends on visual line wrapping is handled here using the generated geometry.
editor.addEventListener("keydown", event => {
  if (event.isComposing) return;
  const vertical = ["ArrowUp", "ArrowDown", "PageUp", "PageDown"].includes(event.key);
  const lineEdge = ["Home", "End"].includes(event.key) || (event.metaKey && ["ArrowLeft", "ArrowRight"].includes(event.key));
  // A navigation key can arrive before the pending animation frame after input.
  if ((vertical || lineEdge) && renderRequest) renderWorksheet();
  const caret = currentCaret();
  const anchor = event.shiftKey ? selectionAnchor() : undefined;
  if (vertical && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    desiredX ??= caret.x;
    const delta = (event.key === "PageUp" || event.key === "PageDown" ? layout.rowsPerPage : 1) * (event.key.endsWith("Up") ? -1 : 1);
    const row = Math.max(0, Math.min(layout.lines.length - 1, caret.row + delta));
    setSelection(nearestStop(layout.lines[row], desiredX).index, anchor, row);
    revealCaret();
  } else if (lineEdge && !event.ctrlKey) {
    event.preventDefault();
    const stops = layout.lines[caret.row].stops;
    const index = (event.key === "Home" || event.key === "ArrowLeft" ? stops[0] : stops[stops.length - 1]).index;
    setSelection(index, anchor, caret.row);
    desiredX = undefined;
    revealCaret();
  } else {
    desiredX = undefined;
    caretRowHint = undefined;
  }
});
editor.addEventListener("input", () => {
  desiredX = undefined;
  caretRowHint = undefined;
  cancelAnimationFrame(renderRequest);
  renderRequest = requestAnimationFrame(() => { renderWorksheet(); revealCaret(); });
  status.textContent = "Saving…";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveDraft, 300);
});
for (const event of ["select", "keyup", "focus", "blur"] as const) editor.addEventListener(event, updateSelection);
document.addEventListener("selectionchange", () => {
  if (document.activeElement === editor) updateSelection();
});
for (const input of [height, darkness, ...Object.values(guideInputs)]) {
  input.addEventListener("input", () => { applySettings(); saveDraft(); });
}
window.addEventListener("pagehide", saveDraft);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") saveDraft(); });
window.addEventListener("beforeprint", renderWorksheet);
printButton.addEventListener("click", () => { renderWorksheet(); window.print(); });
new ResizeObserver(updateSelection).observe(viewport);
applySettings();
