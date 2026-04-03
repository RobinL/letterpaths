import "./editor.css";
import type { BezierLetter, LetterGuides, SegmentId } from "letterpaths";

type Point = { x: number; y: number };

type EditorMark = {
  x: number;
  y: number;
  size?: number;
};

type EditorCurve = {
  id: string;
  strokeIndex: number;
  curveIndex: number;
  points: Point[];
  segmentId?: SegmentId;
  cornerStart?: boolean;
  cornerEnd?: boolean;
};

type EditorContext = {
  glyph?: BezierLetter["glyph"];
  guides?: LetterGuides;
  marks?: EditorMark[];
};

type EditorLoadResult = {
  curves: EditorCurve[];
  context: EditorContext;
  label: string;
};

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing app container.");
}

app.innerHTML = `
  <div class="editor-page">
    <header class="editor-header">
      <div>
        <div class="editor-eyebrow">Bezier editor</div>
        <h1>Single-letter editor</h1>
        <p class="editor-subtitle">
          Load a letter JSON, adjust bezier handles, tag segments, and export back out.
        </p>
      </div>
      <div class="editor-meta" id="editor-meta">No letter loaded.</div>
    </header>
    <section class="bezier-editor">
      <header class="bezier-editor__header">
        <div class="bezier-editor__controls">
          <label class="toggle">
            <input type="checkbox" id="show-guides" checked />
            <span>Show guides</span>
          </label>
          <label class="control">
            <span>Curve</span>
            <select id="curve-select"></select>
          </label>
          <label class="control">
            <span>Segment</span>
            <select id="curve-segment">
              <option value="">Unlabeled</option>
              <option value="lead-in">Lead-in</option>
              <option value="entry">Entry</option>
              <option value="body">Body</option>
              <option value="exit">Exit</option>
              <option value="lead-out">Lead-out</option>
              <option value="ascender">Ascender</option>
              <option value="descender">Descender</option>
              <option value="dot">Dot</option>
            </select>
          </label>
          <button class="editor-button" id="curve-apply-segment" type="button">
            Apply segment
          </button>
          <button class="editor-button" id="dot-toggle" type="button">Dot tool</button>
          <label class="control">
            <span>Dot size</span>
            <input type="number" id="dot-size" min="4" max="60" step="1" value="18" />
          </label>
          <button class="editor-button" id="dot-clear" type="button">Clear dots</button>
          <label class="control">
            <span>Min curve length</span>
            <input type="number" id="short-threshold" min="0" max="200" step="1" value="12" />
          </label>
          <button class="editor-button" id="curve-prev" type="button">Prev</button>
          <button class="editor-button" id="curve-next" type="button">Next</button>
          <button class="editor-button" id="curve-reset" type="button">Reset</button>
          <button class="editor-button" id="curve-delete" type="button">Delete</button>
          <button class="editor-button" id="curve-delete-short" type="button">Delete short</button>
          <button class="editor-button" id="curve-join" type="button">Join</button>
          <button class="editor-button" id="curve-scissors" type="button">Scissors</button>
          <button class="editor-button" id="curve-copy" type="button">Copy JSON</button>
          <button class="editor-button" id="curve-download" type="button">Download JSON</button>
        </div>
        <div class="bezier-editor__load">
          <input id="editor-load-input" type="file" accept="application/json,.json" hidden />
          <button class="editor-button" id="editor-load-json" type="button">
            Load JSON
          </button>
          <div class="bezier-editor__drop" id="editor-load-drop">
            Drop JSON here or click to load.
          </div>
        </div>
      </header>
      <div class="bezier-editor__canvas">
        <svg id="bezier-editor-svg" viewBox="0 0 1000 1000" aria-label="Bezier editor"></svg>
      </div>
      <div class="bezier-editor__status" id="bezier-editor-status"></div>
    </section>
  </div>
`;

const showGuidesEl =
  document.querySelector<HTMLInputElement>("#show-guides")!;
const editorMetaEl =
  document.querySelector<HTMLDivElement>("#editor-meta")!;
const editorSvg =
  document.querySelector<SVGSVGElement>("#bezier-editor-svg")!;
const editorStatusEl =
  document.querySelector<HTMLDivElement>("#bezier-editor-status")!;
const curveSelectEl =
  document.querySelector<HTMLSelectElement>("#curve-select")!;
const curveSegmentEl =
  document.querySelector<HTMLSelectElement>("#curve-segment")!;
const curveApplySegmentEl =
  document.querySelector<HTMLButtonElement>("#curve-apply-segment")!;
const dotToggleEl =
  document.querySelector<HTMLButtonElement>("#dot-toggle")!;
const dotSizeEl =
  document.querySelector<HTMLInputElement>("#dot-size")!;
const dotClearEl =
  document.querySelector<HTMLButtonElement>("#dot-clear")!;
const shortThresholdEl =
  document.querySelector<HTMLInputElement>("#short-threshold")!;
const curvePrevEl =
  document.querySelector<HTMLButtonElement>("#curve-prev")!;
const curveNextEl =
  document.querySelector<HTMLButtonElement>("#curve-next")!;
const curveResetEl =
  document.querySelector<HTMLButtonElement>("#curve-reset")!;
const curveDeleteEl =
  document.querySelector<HTMLButtonElement>("#curve-delete")!;
const curveDeleteShortEl =
  document.querySelector<HTMLButtonElement>("#curve-delete-short")!;
const curveJoinEl =
  document.querySelector<HTMLButtonElement>("#curve-join")!;
const curveScissorsEl =
  document.querySelector<HTMLButtonElement>("#curve-scissors")!;
const curveCopyEl =
  document.querySelector<HTMLButtonElement>("#curve-copy")!;
const curveDownloadEl =
  document.querySelector<HTMLButtonElement>("#curve-download")!;
const editorLoadButton =
  document.querySelector<HTMLButtonElement>("#editor-load-json")!;
const editorLoadInput =
  document.querySelector<HTMLInputElement>("#editor-load-input")!;
const editorLoadDrop =
  document.querySelector<HTMLDivElement>("#editor-load-drop")!;

const state = {
  editorIndex: 0,
  shortThreshold: Number(shortThresholdEl.value) || 12,
  dotMode: false,
  dotSize: Number(dotSizeEl.value) || 18
};

const MAX_TURN_ANGLE = 45;
const SEGMENT_TYPES: SegmentId[] = [
  "lead-in",
  "entry",
  "body",
  "exit",
  "lead-out",
  "ascender",
  "descender",
  "dot"
];
const DEFAULT_GUIDES: LetterGuides = {
  xHeight: 360,
  baseline: 720,
  leftSidebearing: 140,
  rightSidebearing: 860
};

let editorCurves: EditorCurve[] = [];
let editorOriginal: EditorCurve[] = [];
let editorDrag: { curveIndex: number; pointIndex: number } | null = null;
let editorMarkDrag: { index: number } | null = null;
let editorMarkPointerId: number | null = null;
let editorContext: EditorContext = {};
let scissorsMode = false;
let draggingGuideId: keyof LetterGuides | null = null;
let draggingGuidePointerId: number | null = null;
let selectionState: { start: Point; end: Point } | null = null;
let selectedHandles: Array<{ curveIndex: number; pointIndex: number }> = [];

showGuidesEl.addEventListener("change", renderEditor);
shortThresholdEl.addEventListener("input", () => {
  state.shortThreshold = Number(shortThresholdEl.value) || 0;
});
curveSelectEl.addEventListener("change", () => {
  const nextIndex = Number(curveSelectEl.value);
  if (Number.isFinite(nextIndex)) {
    state.editorIndex = nextIndex;
    updateEditorUI();
  }
});
curveSegmentEl.addEventListener("change", () => {
  applySelectedSegment();
});
curveApplySegmentEl.addEventListener("click", () => {
  applySelectedSegment();
});
dotToggleEl.addEventListener("click", () => {
  state.dotMode = !state.dotMode;
  updateEditorUI();
  editorStatusEl.textContent = state.dotMode
    ? "Dot tool enabled: click to place a dot. Drag to reposition, shift-click to delete."
    : "Dot tool disabled.";
});
dotSizeEl.addEventListener("input", () => {
  state.dotSize = Number(dotSizeEl.value) || 18;
});
dotClearEl.addEventListener("click", () => {
  if (!editorContext.marks || editorContext.marks.length === 0) {
    editorStatusEl.textContent = "No dots to clear.";
    return;
  }
  editorContext.marks = [];
  renderEditor();
  editorStatusEl.textContent = "Cleared dots.";
});
curvePrevEl.addEventListener("click", () => {
  if (editorCurves.length === 0) {
    return;
  }
  const startIndex = state.editorIndex < 0 ? 0 : state.editorIndex;
  state.editorIndex = (startIndex - 1 + editorCurves.length) % editorCurves.length;
  renderEditor();
});
curveNextEl.addEventListener("click", () => {
  if (editorCurves.length === 0) {
    return;
  }
  const startIndex = state.editorIndex < 0 ? -1 : state.editorIndex;
  state.editorIndex = (startIndex + 1) % editorCurves.length;
  renderEditor();
});
curveResetEl.addEventListener("click", () => {
  const current = editorCurves[state.editorIndex];
  const original = editorOriginal[state.editorIndex];
  if (current && original) {
    current.points = original.points.map((point) => ({ ...point }));
    renderEditor();
  }
});
curveDeleteEl.addEventListener("click", () => {
  deleteSelectedCurve();
});
curveDeleteShortEl.addEventListener("click", () => {
  deleteShortCurves(state.shortThreshold);
});
curveJoinEl.addEventListener("click", () => {
  joinSelectedHandles();
});
curveScissorsEl.addEventListener("click", () => {
  scissorsMode = !scissorsMode;
  updateEditorUI();
  editorStatusEl.textContent = scissorsMode
    ? "Scissors enabled: click a lead-in/out curve to split."
    : "Scissors disabled.";
});
curveCopyEl.addEventListener("click", async () => {
  const payload = buildBezierExport();
  if (!payload) {
    editorStatusEl.textContent = "No curves to export.";
    return;
  }
  try {
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    editorStatusEl.textContent = "Copied bezier JSON to clipboard.";
  } catch (error) {
    editorStatusEl.textContent = "Clipboard access failed.";
  }
});
curveDownloadEl.addEventListener("click", () => {
  const payload = buildBezierExport();
  if (!payload) {
    editorStatusEl.textContent = "No curves to export.";
    return;
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${makeExportName(payload)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
});
editorLoadButton.addEventListener("click", () => {
  editorLoadInput.click();
});
editorLoadDrop.addEventListener("click", () => {
  editorLoadInput.click();
});
editorLoadInput.addEventListener("change", async () => {
  const file = editorLoadInput.files?.[0];
  if (!file) {
    return;
  }
  await handleEditorLoadFile(file);
  editorLoadInput.value = "";
});
["dragenter", "dragover"].forEach((eventName) => {
  editorLoadDrop.addEventListener(eventName, (event) => {
    event.preventDefault();
    editorLoadDrop.classList.add("bezier-editor__drop--active");
  });
});
["dragleave", "dragend"].forEach((eventName) => {
  editorLoadDrop.addEventListener(eventName, (event) => {
    event.preventDefault();
    editorLoadDrop.classList.remove("bezier-editor__drop--active");
  });
});
editorLoadDrop.addEventListener("drop", async (event) => {
  event.preventDefault();
  editorLoadDrop.classList.remove("bezier-editor__drop--active");
  const file = event.dataTransfer?.files?.[0];
  if (!file) {
    return;
  }
  await handleEditorLoadFile(file);
});

editorSvg.addEventListener("pointerdown", (event) => {
  const target = event.target as HTMLElement | null;
  if (!target) {
    return;
  }
  const markIndex = Number(target.dataset.markIndex);
  if (Number.isFinite(markIndex)) {
    if (event.shiftKey) {
      removeEditorMark(markIndex);
      renderEditor();
      editorStatusEl.textContent = "Dot removed.";
      return;
    }
    editorMarkDrag = { index: markIndex };
    editorMarkPointerId = event.pointerId;
    editorSvg.setPointerCapture(event.pointerId);
    return;
  }
  if (state.dotMode && !target.dataset.pointIndex && !target.dataset.guide) {
    const coords = toSvgCoords(event, editorSvg);
    const mark = addEditorMark(coords);
    if (mark) {
      editorMarkDrag = { index: mark.index };
      editorMarkPointerId = event.pointerId;
      editorSvg.setPointerCapture(event.pointerId);
      renderEditor();
      editorStatusEl.textContent =
        "Dot added. Drag to reposition, shift-click to delete.";
    }
    return;
  }
  if (scissorsMode) {
    const curveIndex = Number(target.dataset.curveIndex);
    const pointIndex = Number(target.dataset.pointIndex);
    if (Number.isFinite(curveIndex) && !Number.isFinite(pointIndex)) {
      const coords = toSvgCoords(event, editorSvg);
      splitCurveAtPoint(curveIndex, coords);
      return;
    }
    if (Number.isFinite(pointIndex)) {
      editorStatusEl.textContent = "Scissors: click the curve line, not a handle.";
      return;
    }
    editorStatusEl.textContent = "Scissors: click a lead-in/out curve to split.";
    return;
  }
  const guideId = target.dataset.guide as keyof LetterGuides | undefined;
  if (
    guideId === "leftSidebearing" ||
    guideId === "rightSidebearing" ||
    guideId === "ascender" ||
    guideId === "xHeight" ||
    guideId === "baseline" ||
    guideId === "descender"
  ) {
    draggingGuideId = guideId;
    draggingGuidePointerId = event.pointerId;
    editorSvg.setPointerCapture(event.pointerId);
    return;
  }
  const curveIndex = Number(target.dataset.curveIndex);
  const pointIndex = Number(target.dataset.pointIndex);
  if (Number.isFinite(curveIndex) && Number.isFinite(pointIndex)) {
    clearSelection();
    editorDrag = { curveIndex, pointIndex };
    editorSvg.setPointerCapture(event.pointerId);
    return;
  }
  if (Number.isFinite(curveIndex)) {
    clearSelection();
    state.editorIndex = curveIndex;
    updateEditorUI();
    return;
  }
  clearSelection();
  const coords = toSvgCoords(event, editorSvg);
  selectionState = { start: coords, end: coords };
  updateSelectionFromRect(selectionState);
  editorSvg.setPointerCapture(event.pointerId);
  renderEditor();
});
editorSvg.addEventListener("pointermove", (event) => {
  if (editorMarkDrag && editorMarkPointerId === event.pointerId) {
    const coords = toSvgCoords(event, editorSvg);
    updateEditorMark(editorMarkDrag.index, coords);
    renderEditor();
    return;
  }
  if (draggingGuideId && draggingGuidePointerId === event.pointerId) {
    const guides = editorContext.guides ?? { ...DEFAULT_GUIDES };
    const point = toSvgCoords(event, editorSvg);
    if (isVerticalGuide(draggingGuideId)) {
      guides[draggingGuideId] = clamp(point.x, 0, 1000);
    } else {
      guides[draggingGuideId] = clamp(point.y, 0, 1000);
    }
    editorContext.guides = guides;
    renderEditor();
    return;
  }
  if (!editorDrag) {
    if (!selectionState) {
      return;
    }
    selectionState.end = toSvgCoords(event, editorSvg);
    updateSelectionFromRect(selectionState);
    renderEditor();
    return;
  }
  const curve = editorCurves[editorDrag.curveIndex];
  if (!curve) {
    return;
  }
  const coords = toSvgCoords(event, editorSvg);
  const pointIndex = editorDrag.pointIndex;
  const point = curve.points[pointIndex];
  const delta = {
    x: coords.x - point.x,
    y: coords.y - point.y
  };
  curve.points[pointIndex] = {
    x: coords.x,
    y: coords.y
  };

  const prev = findEditorCurve(curve.strokeIndex, curve.curveIndex - 1);
  const next = findEditorCurve(curve.strokeIndex, curve.curveIndex + 1);

  if (pointIndex === 0) {
    if (prev) {
      prev.points[3] = { x: coords.x, y: coords.y };
      prev.points[2] = translatePoint(prev.points[2], delta);
    }
    curve.points[1] = translatePoint(curve.points[1], delta);
  }

  if (pointIndex === 3) {
    if (next) {
      next.points[0] = { x: coords.x, y: coords.y };
      next.points[1] = translatePoint(next.points[1], delta);
    }
    curve.points[2] = translatePoint(curve.points[2], delta);
  }

  if (pointIndex === 1) {
    const anchor = curve.points[0];
    if (!event.shiftKey && prev && !isCornerJoin(prev, curve)) {
      prev.points[3] = { x: anchor.x, y: anchor.y };
      prev.points[2] = mirrorHandle(anchor, curve.points[1]);
    }
  }

  if (pointIndex === 2) {
    const anchor = curve.points[3];
    if (!event.shiftKey && next && !isCornerJoin(curve, next)) {
      next.points[0] = { x: anchor.x, y: anchor.y };
      next.points[1] = mirrorHandle(anchor, curve.points[2]);
    }
  }

  renderEditor();
});
editorSvg.addEventListener("pointerup", (event) => {
  if (editorMarkDrag && editorMarkPointerId === event.pointerId) {
    editorSvg.releasePointerCapture(event.pointerId);
    editorMarkDrag = null;
    editorMarkPointerId = null;
  }
  if (draggingGuideId && draggingGuidePointerId === event.pointerId) {
    editorSvg.releasePointerCapture(event.pointerId);
    draggingGuideId = null;
    draggingGuidePointerId = null;
    renderEditor();
    return;
  }
  if (editorDrag) {
    editorSvg.releasePointerCapture(event.pointerId);
  }
  if (selectionState) {
    editorSvg.releasePointerCapture(event.pointerId);
    const dx = Math.abs(selectionState.end.x - selectionState.start.x);
    const dy = Math.abs(selectionState.end.y - selectionState.start.y);
    const isClick = dx < 2 && dy < 2;
    if (isClick) {
      clearSelection();
      state.editorIndex = -1;
    }
    selectionState = null;
    renderEditor();
  }
  editorDrag = null;
});
editorSvg.addEventListener("pointerleave", () => {
  editorDrag = null;
  editorMarkDrag = null;
  editorMarkPointerId = null;
  draggingGuideId = null;
  draggingGuidePointerId = null;
});

updateEditorUI();

async function handleEditorLoadFile(file: File) {
  try {
    const text = await file.text();
    const payload = JSON.parse(text) as unknown;
    const result = extractEditorLoadResult(payload);
    if (!result || result.curves.length === 0) {
      editorStatusEl.textContent = "No bezier curves found in that file.";
      return;
    }
    setEditorCurves(result.curves, result.context, result.label);
    editorStatusEl.textContent = `Loaded ${result.label}.`;
  } catch (error) {
    editorStatusEl.textContent = "Failed to load JSON file.";
  }
}

function setEditorCurves(
  curves: EditorCurve[],
  context: EditorContext,
  label: string
) {
  editorContext = context;
  if (!editorContext.guides) {
    editorContext.guides = { ...DEFAULT_GUIDES };
  } else {
    if (!Number.isFinite(editorContext.guides.leftSidebearing)) {
      editorContext.guides.leftSidebearing = DEFAULT_GUIDES.leftSidebearing;
    }
    if (!Number.isFinite(editorContext.guides.rightSidebearing)) {
      editorContext.guides.rightSidebearing = DEFAULT_GUIDES.rightSidebearing;
    }
  }
  clearSelection();
  const normalized = normalizeEditorCurves(curves, curves);
  editorCurves = normalized.curves;
  unifyEditorEndpoints(editorCurves);
  markCornerJoins(editorCurves, MAX_TURN_ANGLE);
  editorOriginal = editorCurves.map((curve) => ({
    ...curve,
    points: curve.points.map((point) => ({ ...point }))
  }));
  state.editorIndex = editorCurves.length > 0 ? 0 : -1;
  updateEditorMeta(label);
  updateEditorUI();
}

function updateEditorMeta(label: string) {
  const glyph = editorContext.glyph;
  if (!glyph) {
    editorMetaEl.textContent = label;
    return;
  }
  const name = glyph.name ? ` - ${glyph.name}` : "";
  editorMetaEl.textContent = `${glyph.char} (${glyph.case} ${glyph.style})${name}`;
}

function updateEditorUI() {
  const hasCurves = editorCurves.length > 0;
  curveSelectEl.disabled = !hasCurves;
  curvePrevEl.disabled = !hasCurves;
  curveNextEl.disabled = !hasCurves;
  curveResetEl.disabled = !hasCurves;
  curveDeleteEl.disabled = !hasCurves;
  curveDeleteShortEl.disabled = !hasCurves;
  curveJoinEl.disabled = !hasCurves;
  curveScissorsEl.disabled = !hasCurves;
  curveScissorsEl.classList.toggle("is-active", scissorsMode);
  dotToggleEl.disabled = !hasCurves;
  dotToggleEl.classList.toggle("is-active", state.dotMode);
  dotSizeEl.disabled = !hasCurves;
  dotClearEl.disabled = !hasCurves;
  curveCopyEl.disabled = !hasCurves;
  curveDownloadEl.disabled = !hasCurves;

  curveSelectEl.innerHTML = editorCurves
    .map((curve, index) => {
      const segmentLabel = normalizeSegmentId(curve.segmentId);
      const suffix = segmentLabel ? ` (${segmentLabel})` : "";
      return `<option value="${index}">Stroke ${curve.strokeIndex + 1} - Curve ${
        curve.curveIndex + 1
      }${suffix}</option>`;
    })
    .join("");
  if (state.editorIndex >= 0 && state.editorIndex < editorCurves.length) {
    curveSelectEl.value = String(state.editorIndex);
  } else {
    curveSelectEl.selectedIndex = -1;
  }
  renderEditor();
}

function syncSegmentControls() {
  const selected =
    state.editorIndex >= 0 && state.editorIndex < editorCurves.length
      ? editorCurves[state.editorIndex]
      : null;
  const segmentLabel = normalizeSegmentId(selected?.segmentId);
  curveSegmentEl.disabled = !selected;
  curveApplySegmentEl.disabled = !selected;
  curveSegmentEl.value = segmentLabel ?? "";
}

function applySelectedSegment() {
  const selected =
    state.editorIndex >= 0 && state.editorIndex < editorCurves.length
      ? editorCurves[state.editorIndex]
      : null;
  if (!selected) {
    return;
  }
  const nextSegment = normalizeSegmentId(curveSegmentEl.value) ?? undefined;
  selected.segmentId = nextSegment;
  updateEditorUI();
  editorStatusEl.textContent = nextSegment
    ? `Segment set to ${nextSegment}.`
    : "Segment cleared.";
}

function clearSelection() {
  selectionState = null;
  selectedHandles = [];
}

function addEditorMark(point: Point) {
  if (!editorContext.marks) {
    editorContext.marks = [];
  }
  const size = Number.isFinite(state.dotSize) ? Math.max(1, state.dotSize) : 18;
  const nextMark = {
    x: clamp(point.x, 0, 1000),
    y: clamp(point.y, 0, 1000),
    size
  };
  editorContext.marks.push(nextMark);
  return { mark: nextMark, index: editorContext.marks.length - 1 };
}

function updateEditorMark(index: number, point: Point) {
  const marks = editorContext.marks;
  if (!marks || !marks[index]) {
    return;
  }
  marks[index] = {
    ...marks[index],
    x: clamp(point.x, 0, 1000),
    y: clamp(point.y, 0, 1000)
  };
}

function removeEditorMark(index: number) {
  if (!editorContext.marks) {
    return;
  }
  editorContext.marks.splice(index, 1);
}

function isHandleSelected(curveIndex: number, pointIndex: number) {
  return selectedHandles.some(
    (handle) =>
      handle.curveIndex === curveIndex && handle.pointIndex === pointIndex
  );
}

function updateSelectionFromRect(selection: { start: Point; end: Point }) {
  const minX = Math.min(selection.start.x, selection.end.x);
  const maxX = Math.max(selection.start.x, selection.end.x);
  const minY = Math.min(selection.start.y, selection.end.y);
  const maxY = Math.max(selection.start.y, selection.end.y);
  const handles: Array<{ curveIndex: number; pointIndex: number }> = [];

  editorCurves.forEach((curve, curveIndex) => {
    [0, 3].forEach((pointIndex) => {
      const point = curve.points[pointIndex];
      if (
        point.x >= minX &&
        point.x <= maxX &&
        point.y >= minY &&
        point.y <= maxY
      ) {
        handles.push({ curveIndex, pointIndex });
      }
    });
  });

  selectedHandles = handles;
}

function joinSelectedHandles() {
  if (selectedHandles.length !== 2) {
    editorStatusEl.textContent = "Select exactly two endpoints to join.";
    return;
  }
  const [firstHandle, secondHandle] = selectedHandles;
  if (firstHandle.curveIndex === secondHandle.curveIndex) {
    editorStatusEl.textContent =
      "Pick endpoints from different curves to join.";
    return;
  }

  const firstCurve = editorCurves[firstHandle.curveIndex];
  const secondCurve = editorCurves[secondHandle.curveIndex];
  if (!firstCurve || !secondCurve) {
    editorStatusEl.textContent = "Unable to find both curves.";
    return;
  }
  const firstIsStart = firstHandle.pointIndex === 0;
  const firstIsEnd = firstHandle.pointIndex === 3;
  const secondIsStart = secondHandle.pointIndex === 0;
  const secondIsEnd = secondHandle.pointIndex === 3;
  if (!((firstIsStart && secondIsEnd) || (firstIsEnd && secondIsStart))) {
    editorStatusEl.textContent =
      "Join needs a start point and an end point.";
    return;
  }
  const startHandle = firstIsStart ? firstHandle : secondHandle;
  const endHandle = firstIsEnd ? firstHandle : secondHandle;
  const startCurve = editorCurves[startHandle.curveIndex];
  const endCurve = editorCurves[endHandle.curveIndex];
  if (!startCurve || !endCurve) {
    editorStatusEl.textContent = "Unable to locate the join curves.";
    return;
  }
  if (!isStrokeStart(startCurve) || !isStrokeEnd(endCurve)) {
    editorStatusEl.textContent =
      "Join needs the start of a stroke and the end of another.";
    return;
  }

  const anchor = { ...endCurve.points[3] };
  applyAnchorMove(startCurve, 0, anchor);

  if (startCurve.strokeIndex !== endCurve.strokeIndex) {
    mergeStrokes(endCurve.strokeIndex, startCurve.strokeIndex);
  }

  unifyEditorEndpoints(editorCurves);
  markCornerJoins(editorCurves, MAX_TURN_ANGLE);
  editorOriginal = editorCurves.map((curve) => ({
    ...curve,
    points: curve.points.map((point) => ({ ...point }))
  }));
  clearSelection();
  if (state.editorIndex >= editorCurves.length) {
    state.editorIndex = Math.max(0, editorCurves.length - 1);
  }
  updateEditorUI();
  editorStatusEl.textContent = "Joined endpoints.";
}

function applyAnchorMove(curve: EditorCurve, pointIndex: number, anchor: Point) {
  const current = curve.points[pointIndex];
  const delta = {
    x: anchor.x - current.x,
    y: anchor.y - current.y
  };

  curve.points[pointIndex] = { ...anchor };
  if (pointIndex === 0) {
    curve.points[1] = translatePoint(curve.points[1], delta);
  }
  if (pointIndex === 3) {
    curve.points[2] = translatePoint(curve.points[2], delta);
  }

  const neighbor =
    pointIndex === 0
      ? findEditorCurve(curve.strokeIndex, curve.curveIndex - 1)
      : findEditorCurve(curve.strokeIndex, curve.curveIndex + 1);
  if (!neighbor) {
    return;
  }
  const neighborPointIndex = pointIndex === 0 ? 3 : 0;
  if (isHandleSelected(neighbor.curveIndex, neighborPointIndex)) {
    return;
  }
  neighbor.points[neighborPointIndex] = { ...anchor };
  if (neighborPointIndex === 0) {
    neighbor.points[1] = translatePoint(neighbor.points[1], delta);
  }
  if (neighborPointIndex === 3) {
    neighbor.points[2] = translatePoint(neighbor.points[2], delta);
  }
}

function isStrokeStart(curve: EditorCurve) {
  return !editorCurves.some(
    (entry) =>
      entry.strokeIndex === curve.strokeIndex &&
      entry.curveIndex < curve.curveIndex
  );
}

function isStrokeEnd(curve: EditorCurve) {
  return !editorCurves.some(
    (entry) =>
      entry.strokeIndex === curve.strokeIndex &&
      entry.curveIndex > curve.curveIndex
  );
}

function mergeStrokes(targetStrokeIndex: number, sourceStrokeIndex: number) {
  if (targetStrokeIndex === sourceStrokeIndex) {
    return;
  }
  const targetMax = editorCurves
    .filter((curve) => curve.strokeIndex === targetStrokeIndex)
    .reduce((max, curve) => Math.max(max, curve.curveIndex), -1);
  const offset = targetMax + 1;

  editorCurves.forEach((curve) => {
    if (curve.strokeIndex === sourceStrokeIndex) {
      curve.strokeIndex = targetStrokeIndex;
      curve.curveIndex += offset;
    }
  });

  editorCurves = normalizeStrokeIndices(editorCurves);
  editorCurves = normalizeEditorCurves(editorCurves, editorCurves).curves;
}

function normalizeStrokeIndices(curves: EditorCurve[]) {
  const strokeOrder = Array.from(
    new Set(curves.map((curve) => curve.strokeIndex))
  ).sort((a, b) => a - b);
  const mapping = new Map<number, number>();
  strokeOrder.forEach((strokeIndex, nextIndex) => {
    mapping.set(strokeIndex, nextIndex);
  });
  return curves.map((curve) => ({
    ...curve,
    strokeIndex: mapping.get(curve.strokeIndex) ?? curve.strokeIndex
  }));
}

function deleteSelectedCurve() {
  if (editorCurves.length === 0) {
    return;
  }
  const target = editorCurves[state.editorIndex];
  if (!target) {
    return;
  }
  const prev = findEditorCurve(target.strokeIndex, target.curveIndex - 1);
  const next = findEditorCurve(target.strokeIndex, target.curveIndex + 1);

  if (prev && next) {
    const newAnchor = {
      x: (prev.points[3].x + next.points[0].x) / 2,
      y: (prev.points[3].y + next.points[0].y) / 2
    };
    const deltaPrev = {
      x: newAnchor.x - prev.points[3].x,
      y: newAnchor.y - prev.points[3].y
    };
    const deltaNext = {
      x: newAnchor.x - next.points[0].x,
      y: newAnchor.y - next.points[0].y
    };
    prev.points[3] = { ...newAnchor };
    prev.points[2] = translatePoint(prev.points[2], deltaPrev);
    next.points[0] = { ...newAnchor };
    next.points[1] = translatePoint(next.points[1], deltaNext);
  }

  const remaining = editorCurves.filter(
    (curve) =>
      !(
        curve.strokeIndex === target.strokeIndex &&
        curve.curveIndex === target.curveIndex
      )
  );
  const remainingOriginal = editorOriginal.filter(
    (curve) =>
      !(
        curve.strokeIndex === target.strokeIndex &&
        curve.curveIndex === target.curveIndex
      )
  );

  const normalized = normalizeEditorCurves(remaining, remainingOriginal);
  editorCurves = normalized.curves;
  unifyEditorEndpoints(editorCurves);
  markCornerJoins(editorCurves, MAX_TURN_ANGLE);
  clearSelection();
  editorOriginal = editorCurves.map((curve) => ({
    ...curve,
    points: curve.points.map((point) => ({ ...point }))
  }));

  if (editorCurves.length === 0) {
    state.editorIndex = 0;
  } else if (state.editorIndex >= editorCurves.length) {
    state.editorIndex = editorCurves.length - 1;
  }

  updateEditorUI();
}

function deleteShortCurves(threshold: number) {
  if (editorCurves.length === 0) {
    return;
  }
  const minLength = Math.max(0, threshold);
  if (minLength === 0) {
    return;
  }

  const remaining = editorCurves.filter((curve) => {
    const length = approximateCurveLength(curve.points, 12);
    return length >= minLength;
  });

  if (remaining.length === editorCurves.length) {
    editorStatusEl.textContent = "No curves below the threshold.";
    return;
  }

  editorCurves = reconnectCurves(remaining);
  unifyEditorEndpoints(editorCurves);
  markCornerJoins(editorCurves, MAX_TURN_ANGLE);
  clearSelection();
  editorOriginal = editorCurves.map((curve) => ({
    ...curve,
    points: curve.points.map((point) => ({ ...point }))
  }));

  if (editorCurves.length === 0) {
    state.editorIndex = 0;
  } else if (state.editorIndex >= editorCurves.length) {
    state.editorIndex = editorCurves.length - 1;
  }

  updateEditorUI();
}

function normalizeEditorCurves(curves: EditorCurve[], original: EditorCurve[]) {
  const sorted = [...curves].sort((a, b) => {
    if (a.strokeIndex !== b.strokeIndex) {
      return a.strokeIndex - b.strokeIndex;
    }
    return a.curveIndex - b.curveIndex;
  });
  const originalMap = new Map(original.map((curve) => [curve.id, curve]));
  const normalizedCurves: EditorCurve[] = [];
  const normalizedOriginal: EditorCurve[] = [];
  let currentStroke = -1;
  let index = 0;

  sorted.forEach((curve) => {
    if (curve.strokeIndex !== currentStroke) {
      currentStroke = curve.strokeIndex;
      index = 0;
    }
    const updated = {
      ...curve,
      curveIndex: index,
      id: `${curve.strokeIndex}-${index}`
    };
    normalizedCurves.push(updated);
    const source = originalMap.get(curve.id) ?? curve;
    normalizedOriginal.push({
      ...source,
      curveIndex: index,
      id: `${curve.strokeIndex}-${index}`
    });
    index += 1;
  });

  return { curves: normalizedCurves, original: normalizedOriginal };
}

function reconnectCurves(curves: EditorCurve[]) {
  const sorted = [...curves].sort((a, b) => {
    if (a.strokeIndex !== b.strokeIndex) {
      return a.strokeIndex - b.strokeIndex;
    }
    return a.curveIndex - b.curveIndex;
  });
  const grouped = new Map<number, EditorCurve[]>();
  sorted.forEach((curve) => {
    const list = grouped.get(curve.strokeIndex) ?? [];
    list.push(curve);
    grouped.set(curve.strokeIndex, list);
  });

  grouped.forEach((list) => {
    list.sort((a, b) => a.curveIndex - b.curveIndex);
    for (let i = 0; i < list.length - 1; i += 1) {
      const current = list[i];
      const next = list[i + 1];
      const anchor = {
        x: (current.points[3].x + next.points[0].x) / 2,
        y: (current.points[3].y + next.points[0].y) / 2
      };
      const deltaPrev = {
        x: anchor.x - current.points[3].x,
        y: anchor.y - current.points[3].y
      };
      const deltaNext = {
        x: anchor.x - next.points[0].x,
        y: anchor.y - next.points[0].y
      };
      current.points[3] = { ...anchor };
      current.points[2] = translatePoint(current.points[2], deltaPrev);
      next.points[0] = { ...anchor };
      next.points[1] = translatePoint(next.points[1], deltaNext);
    }
  });

  const normalized = normalizeEditorCurves(sorted, sorted);
  return normalized.curves;
}

function buildBezierExport(): BezierLetter | null {
  if (editorCurves.length === 0) {
    return null;
  }
  const grouped = new Map<number, EditorCurve[]>();
  editorCurves.forEach((curve) => {
    const list = grouped.get(curve.strokeIndex) ?? [];
    list.push(curve);
    grouped.set(curve.strokeIndex, list);
  });
  const sortedStrokeKeys = Array.from(grouped.keys()).sort((a, b) => a - b);

  const strokes = sortedStrokeKeys.map((strokeIndex) => {
    const curves = grouped.get(strokeIndex) ?? [];
    curves.sort((a, b) => a.curveIndex - b.curveIndex);
    const segmentId = normalizeSegmentId(curves[0]?.segmentId);
    return {
      kind: "stroke" as const,
      phase: "main" as const,
      segment: segmentId,
      curves: curves.map((curve) => ({
        p0: { ...curve.points[0] },
        p1: { ...curve.points[1] },
        p2: { ...curve.points[2] },
        p3: { ...curve.points[3] },
        segment: normalizeSegmentId(curve.segmentId)
      }))
    };
  });

  const marks = editorContext.marks ?? [];
  const markStrokes = marks.map((mark) => ({
    kind: "mark" as const,
    phase: "deferred" as const,
    mark: {
      x: mark.x,
      y: mark.y,
      size: mark.size
    },
    curves: [buildDotCurve(mark)]
  }));

  const glyph = {
    char: editorContext.glyph?.char || "letter",
    case: editorContext.glyph?.case || "lower",
    style: editorContext.glyph?.style || "cursive",
    name: editorContext.glyph?.name
  };

  return {
    schemaVersion: "2.0",
    glyph,
    guides: editorContext.guides,
    strokes: [...strokes, ...markStrokes]
  };
}

function buildDotCurve(mark: EditorMark) {
  const bump = 0.3;
  return {
    p0: { x: mark.x, y: mark.y },
    p1: { x: mark.x + bump, y: mark.y },
    p2: { x: mark.x + bump * 2, y: mark.y },
    p3: { x: mark.x + bump * 3, y: mark.y }
  };
}

function makeExportName(payload: {
  glyph?: { char?: string; case?: string; style?: string };
}) {
  const char = payload.glyph?.char || "letter";
  const casePart = payload.glyph?.case || "lower";
  const stylePart = payload.glyph?.style || "cursive";
  return `${char}-${casePart}-${stylePart}-bezier`;
}

function extractEditorLoadResult(payload: unknown): EditorLoadResult | null {
  const picked = pickLetterFromPayload(payload);
  if (!picked) {
    return null;
  }
  const letter = picked.letter;
  const context: EditorContext = {
    glyph: letter.glyph,
    guides: letter.guides
  };
  const { curves, marks } = buildEditorCurvesFromLetter(letter);
  if (marks.length > 0) {
    context.marks = marks;
  }
  return {
    curves,
    context,
    label: picked.label
  };
}

function pickLetterFromPayload(payload: unknown): {
  letter: BezierLetter;
  label: string;
} | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (isBezierLetter(payload)) {
    return { letter: payload, label: formatGlyphLabel(payload.glyph) };
  }

  const payloadRecord = payload as Record<string, unknown>;
  if (Array.isArray(payloadRecord.letters)) {
    const candidates = payloadRecord.letters.filter(isBezierLetter);
    if (candidates.length === 0) {
      return null;
    }
    const letter = candidates[0];
    return { letter, label: formatGlyphLabel(letter.glyph) };
  }

  const entries = Object.values(payloadRecord).filter(isBezierLetter);
  if (entries.length === 0) {
    return null;
  }
  const letter = entries[0];
  return { letter, label: formatGlyphLabel(letter.glyph) };
}

function isBezierLetter(value: unknown): value is BezierLetter {
  if (!value || typeof value !== "object") {
    return false;
  }
  const entry = value as BezierLetter;
  return Boolean(entry.glyph && Array.isArray(entry.strokes));
}

function formatGlyphLabel(glyph: BezierLetter["glyph"] | undefined) {
  if (!glyph) {
    return "letter";
  }
  const char = glyph.char || "letter";
  const casePart = glyph.case || "case";
  const stylePart = glyph.style || "style";
  return `${char} (${casePart} ${stylePart})`;
}

function buildEditorCurvesFromLetter(letter: BezierLetter): {
  curves: EditorCurve[];
  marks: EditorMark[];
} {
  const curves: EditorCurve[] = [];
  const marks: EditorMark[] = [];
  let strokeIndex = 0;

  letter.strokes.forEach((stroke) => {
    if (stroke.kind === "mark") {
      if (stroke.mark) {
        marks.push({
          x: stroke.mark.x,
          y: stroke.mark.y,
          size: stroke.mark.size
        });
      } else if (stroke.curves[0]) {
        const anchor = stroke.curves[0].p0;
        marks.push({ x: anchor.x, y: anchor.y });
      }
      return;
    }
    const fallbackSegment = normalizeSegmentId(stroke.segment);
    stroke.curves.forEach((curve, curveIndex) => {
      curves.push({
        id: `${strokeIndex}-${curveIndex}`,
        strokeIndex,
        curveIndex,
        points: [
          { x: curve.p0.x, y: curve.p0.y },
          { x: curve.p1.x, y: curve.p1.y },
          { x: curve.p2.x, y: curve.p2.y },
          { x: curve.p3.x, y: curve.p3.y }
        ],
        segmentId: normalizeSegmentId(curve.segment) ?? fallbackSegment
      });
    });
    strokeIndex += 1;
  });

  return { curves, marks };
}

function normalizeSegmentId(value: string | SegmentId | undefined | null) {
  if (!value) {
    return undefined;
  }
  const trimmed = String(value).trim();
  return SEGMENT_TYPES.includes(trimmed as SegmentId)
    ? (trimmed as SegmentId)
    : undefined;
}

function splitCurveAtPoint(curveIndex: number, target: Point) {
  const curve = editorCurves[curveIndex];
  if (!curve) {
    return;
  }
  const segmentId = normalizeSegmentId(curve.segmentId);
  const isLeadIn = segmentId === "lead-in";
  const isLeadOut = segmentId === "lead-out";
  const strokeIndex = curve.strokeIndex;
  const originalCurveIndex = curve.curveIndex;
  const sample = findClosestTOnCurve(curve.points, target, 50);
  if (!sample) {
    editorStatusEl.textContent = "Unable to find a split point.";
    return;
  }
  const t = sample.t;
  if (t <= 0.05 || t >= 0.95) {
    editorStatusEl.textContent =
      "Pick a point away from the endpoints to split.";
    return;
  }
  const [leftPoints, rightPoints] = splitCubic(curve.points, t);
  const firstSegmentId = isLeadIn ? "lead-in" : isLeadOut ? "exit" : segmentId;
  const secondSegmentId = isLeadIn ? "entry" : isLeadOut ? "lead-out" : segmentId;
  const leftCurve: EditorCurve = {
    ...curve,
    id: `split-${curve.id}-a`,
    curveIndex: curve.curveIndex,
    points: leftPoints,
    segmentId: firstSegmentId,
    cornerStart: curve.cornerStart,
    cornerEnd: false
  };
  const rightCurve: EditorCurve = {
    ...curve,
    id: `split-${curve.id}-b`,
    curveIndex: curve.curveIndex + 1,
    points: rightPoints,
    segmentId: secondSegmentId,
    cornerStart: false,
    cornerEnd: curve.cornerEnd
  };
  const updated = [...editorCurves];
  updated.splice(curveIndex, 1, leftCurve, rightCurve);
  const relabeled: EditorCurve[] = updated.map((entry) => {
    if (entry.strokeIndex !== strokeIndex) {
      return entry;
    }
    if (isLeadIn) {
      if (entry.segmentId === "lead-in" && entry.curveIndex > originalCurveIndex) {
        return { ...entry, segmentId: "entry" };
      }
    } else if (isLeadOut) {
      if (entry.segmentId === "lead-out" && entry.curveIndex <= originalCurveIndex) {
        return { ...entry, segmentId: "exit" };
      }
    }
    return entry;
  });
  const normalized = normalizeEditorCurves(relabeled, relabeled);
  editorCurves = normalized.curves;
  unifyEditorEndpoints(editorCurves);
  markCornerJoins(editorCurves, MAX_TURN_ANGLE);
  editorOriginal = editorCurves.map((entry) => ({
    ...entry,
    points: entry.points.map((point) => ({ ...point }))
  }));
  clearSelection();
  const nextIndex = editorCurves.findIndex(
    (entry) => entry.strokeIndex === strokeIndex && entry.curveIndex === originalCurveIndex + 1
  );
  state.editorIndex = nextIndex >= 0 ? nextIndex : Math.min(curveIndex, editorCurves.length - 1);
  scissorsMode = false;
  updateEditorUI();
  const fallbackLabel = segmentId ?? "unlabeled";
  const splitLabel =
    firstSegmentId && secondSegmentId
      ? `${firstSegmentId} + ${secondSegmentId}`
      : fallbackLabel;
  editorStatusEl.textContent = `Split into ${splitLabel}.`;
}

function findClosestTOnCurve(
  points: Point[],
  target: Point,
  samples = 40
): { t: number; point: Point } | null {
  if (points.length !== 4) {
    return null;
  }
  const [p0, p1, p2, p3] = points;
  let bestT = 0;
  let bestPoint = p0;
  let bestDistance = Number.POSITIVE_INFINITY;
  const steps = Math.max(10, Math.floor(samples));
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const point = cubicAt(p0, p1, p2, p3, t);
    const dx = point.x - target.x;
    const dy = point.y - target.y;
    const dist = dx * dx + dy * dy;
    if (dist < bestDistance) {
      bestDistance = dist;
      bestT = t;
      bestPoint = point;
    }
  }
  return { t: bestT, point: bestPoint };
}

function splitCubic(points: Point[], t: number): [Point[], Point[]] {
  const [p0, p1, p2, p3] = points;
  const p01 = lerpPoint(p0, p1, t);
  const p12 = lerpPoint(p1, p2, t);
  const p23 = lerpPoint(p2, p3, t);
  const p012 = lerpPoint(p01, p12, t);
  const p123 = lerpPoint(p12, p23, t);
  const p0123 = lerpPoint(p012, p123, t);
  return [
    [p0, p01, p012, p0123],
    [p0123, p123, p23, p3]
  ];
}

function lerpPoint(a: Point, b: Point, t: number): Point {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t
  };
}

function renderEditor() {
  syncSegmentControls();
  editorSvg.classList.toggle("is-dot-mode", state.dotMode);
  if (editorCurves.length === 0) {
    editorSvg.innerHTML =
      '<text class="empty-label" x="50" y="60">Load a bezier letter to begin.</text>';
    editorStatusEl.textContent = "";
    return;
  }
  const hasActiveCurve =
    state.editorIndex >= 0 && state.editorIndex < editorCurves.length;
  if (hasActiveCurve) {
    curveSelectEl.value = String(state.editorIndex);
  } else {
    curveSelectEl.selectedIndex = -1;
  }
  const selected = hasActiveCurve ? editorCurves[state.editorIndex] : null;
  const guideMarkup =
    showGuidesEl.checked && editorContext.guides
      ? renderGuides(editorContext.guides)
      : "";
  const guideHandles =
    showGuidesEl.checked && editorContext.guides
      ? renderGuideHandles(editorContext.guides)
      : "";
  const paths = editorCurves
    .map((curve, index) => {
      const [p0, p1, p2, p3] = curve.points;
      const d = `M ${round(p0.x)} ${round(p0.y)} C ${round(p1.x)} ${round(
        p1.y
      )} ${round(p2.x)} ${round(p2.y)} ${round(p3.x)} ${round(p3.y)}`;
      const className =
        hasActiveCurve && index === state.editorIndex
          ? "editor-curve is-active"
          : "editor-curve";
      const segmentId = normalizeSegmentId(curve.segmentId);
      const segmentAttr = segmentId ? ` data-segment="${segmentId}"` : "";
      return `<path class="${className}" d="${d}" data-curve-index="${index}"${segmentAttr}></path>`;
    })
    .join("");
  const selectionRect = selectionState
    ? renderSelectionRect(selectionState)
    : "";

  const handles = selected
    ? [
        { point: selected.points[0], index: 0, type: "anchor" },
        { point: selected.points[1], index: 1, type: "control" },
        { point: selected.points[2], index: 2, type: "control" },
        { point: selected.points[3], index: 3, type: "anchor" }
      ]
        .map((entry) => {
          const selectedHandle = isHandleSelected(state.editorIndex, entry.index);
          const classSuffix = selectedHandle ? " is-selected" : "";
          return `<circle class="editor-handle editor-handle--${entry.type}${classSuffix}" cx="${round(
            entry.point.x
          )}" cy="${round(entry.point.y)}" r="8" data-curve-index="${state.editorIndex}" data-point-index="${entry.index}"></circle>`;
        })
        .join("")
    : "";

  const selectedMarkers = selectedHandles
    .filter((handle) => !hasActiveCurve || handle.curveIndex !== state.editorIndex)
    .map((handle) => {
      const curve = editorCurves[handle.curveIndex];
      if (!curve) {
        return "";
      }
      const point = curve.points[handle.pointIndex];
      return `<circle class="editor-handle editor-handle--anchor is-selected is-passive" cx="${round(
        point.x
      )}" cy="${round(point.y)}" r="8"></circle>`;
    })
    .join("");

  const marks = (editorContext.marks ?? [])
    .map((mark, index) => {
      const radius =
        Number.isFinite(mark.size) && mark.size! > 0 ? mark.size! : state.dotSize;
      return `<circle class="editor-mark" cx="${round(
        mark.x
      )}" cy="${round(mark.y)}" r="${round(radius)}" data-mark-index="${index}"></circle>`;
    })
    .join("");

  const controlLines = selected
    ? [
        `<line class="editor-line" x1="${round(selected.points[0].x)}" y1="${round(
          selected.points[0].y
        )}" x2="${round(selected.points[1].x)}" y2="${round(
          selected.points[1].y
        )}"></line>`,
        `<line class="editor-line" x1="${round(selected.points[2].x)}" y1="${round(
          selected.points[2].y
        )}" x2="${round(selected.points[3].x)}" y2="${round(
          selected.points[3].y
        )}"></line>`
      ].join("")
    : "";

  editorSvg.innerHTML = `
    ${guideMarkup}
    <g class="editor-curves">${paths}</g>
    ${selectionRect}
    <g class="editor-guide-handles">${guideHandles}</g>
    <g class="editor-marks">${marks}</g>
    <g class="editor-controls">
      ${controlLines}
      ${handles}
      ${selectedMarkers}
    </g>
  `;
  if (!selected) {
    const selectionLabel =
      selectedHandles.length > 0
        ? `Selected endpoints: ${selectedHandles.length}`
        : "No curve selected.";
    const scissorsLabel = scissorsMode ? " | Scissors on" : "";
    const dotLabel = state.dotMode ? " | Dot tool on" : "";
    editorStatusEl.textContent = `${selectionLabel}${scissorsLabel}${dotLabel}`;
    return;
  }
  const segmentLabel = normalizeSegmentId(selected.segmentId) || "unlabeled";
  const selectionLabel =
    selectedHandles.length > 0
      ? ` | Selected endpoints: ${selectedHandles.length}`
      : "";
  const scissorsLabel = scissorsMode ? " | Scissors on" : "";
  const dotLabel = state.dotMode ? " | Dot tool on" : "";
  editorStatusEl.textContent = `Curve ${state.editorIndex + 1} of ${
    editorCurves.length
  } | Segment: ${segmentLabel}${selectionLabel}${scissorsLabel}${dotLabel}`;
}

function toSvgCoords(event: PointerEvent, svg: SVGSVGElement) {
  const rect = svg.getBoundingClientRect();
  const x = (event.clientX - rect.left) * (1000 / rect.width);
  const y = (event.clientY - rect.top) * (1000 / rect.height);
  return { x, y };
}

function renderSelectionRect(selection: { start: Point; end: Point }) {
  const x = Math.min(selection.start.x, selection.end.x);
  const y = Math.min(selection.start.y, selection.end.y);
  const width = Math.abs(selection.start.x - selection.end.x);
  const height = Math.abs(selection.start.y - selection.end.y);
  return `<rect class="editor-selection" x="${round(x)}" y="${round(
    y
  )}" width="${round(width)}" height="${round(height)}"></rect>`;
}

function renderGuides(guides?: LetterGuides) {
  if (!guides) {
    return "";
  }
  const horizontal: Array<{ id: string; y: number }> = [];
  if (Number.isFinite(guides.ascender)) {
    horizontal.push({ id: "ascender", y: guides.ascender! });
  }
  if (Number.isFinite(guides.xHeight)) {
    horizontal.push({ id: "xHeight", y: guides.xHeight! });
  }
  if (Number.isFinite(guides.baseline)) {
    horizontal.push({ id: "baseline", y: guides.baseline! });
  }
  if (Number.isFinite(guides.descender)) {
    horizontal.push({ id: "descender", y: guides.descender! });
  }
  const vertical: Array<{ id: string; x: number }> = [];
  if (Number.isFinite(guides.leftSidebearing)) {
    vertical.push({ id: "leftSidebearing", x: guides.leftSidebearing! });
  }
  if (Number.isFinite(guides.rightSidebearing)) {
    vertical.push({ id: "rightSidebearing", x: guides.rightSidebearing! });
  }
  return [
    ...horizontal.map(
      (entry) =>
        `<line class="guide guide--${entry.id}" x1="0" y1="${entry.y}" x2="1000" y2="${entry.y}"></line>`
    ),
    ...vertical.map(
      (entry) =>
        `<line class="guide guide--${entry.id}" x1="${entry.x}" y1="0" x2="${entry.x}" y2="1000"></line>`
    )
  ].join("");
}

function renderGuideHandles(guides?: LetterGuides) {
  if (!guides) {
    return "";
  }
  const handles: string[] = [];
  if (Number.isFinite(guides.ascender)) {
    handles.push(
      `<circle class="editor-guide-handle editor-guide-handle--horizontal" data-guide="ascender" cx="24" cy="${guides.ascender}" r="8"></circle>`,
      `<text class="editor-guide-label" x="38" y="${guides.ascender}">Ascender</text>`
    );
  }
  if (Number.isFinite(guides.xHeight)) {
    handles.push(
      `<circle class="editor-guide-handle editor-guide-handle--horizontal" data-guide="xHeight" cx="24" cy="${guides.xHeight}" r="8"></circle>`,
      `<text class="editor-guide-label" x="38" y="${guides.xHeight}">x-height</text>`
    );
  }
  if (Number.isFinite(guides.baseline)) {
    handles.push(
      `<circle class="editor-guide-handle editor-guide-handle--horizontal" data-guide="baseline" cx="24" cy="${guides.baseline}" r="8"></circle>`,
      `<text class="editor-guide-label" x="38" y="${guides.baseline}">Baseline</text>`
    );
  }
  if (Number.isFinite(guides.descender)) {
    handles.push(
      `<circle class="editor-guide-handle editor-guide-handle--horizontal" data-guide="descender" cx="24" cy="${guides.descender}" r="8"></circle>`,
      `<text class="editor-guide-label" x="38" y="${guides.descender}">Descender</text>`
    );
  }
  if (Number.isFinite(guides.leftSidebearing)) {
    handles.push(
      `<circle class="editor-guide-handle editor-guide-handle--vertical" data-guide="leftSidebearing" cx="${guides.leftSidebearing}" cy="24" r="8"></circle>`,
      `<text class="editor-guide-label" x="${guides.leftSidebearing! + 12}" y="28">Left sidebearing</text>`
    );
  }
  if (Number.isFinite(guides.rightSidebearing)) {
    handles.push(
      `<circle class="editor-guide-handle editor-guide-handle--vertical" data-guide="rightSidebearing" cx="${guides.rightSidebearing}" cy="24" r="8"></circle>`,
      `<text class="editor-guide-label" x="${guides.rightSidebearing! + 12}" y="28">Right sidebearing</text>`
    );
  }
  return handles.join("");
}

function isVerticalGuide(id: string) {
  return id === "leftSidebearing" || id === "rightSidebearing";
}

function unifyEditorEndpoints(curves: EditorCurve[]) {
  const grouped = new Map<number, EditorCurve[]>();
  curves.forEach((curve) => {
    const list = grouped.get(curve.strokeIndex) ?? [];
    list.push(curve);
    grouped.set(curve.strokeIndex, list);
  });

  grouped.forEach((list) => {
    list.sort((a, b) => a.curveIndex - b.curveIndex);
    for (let i = 0; i < list.length - 1; i += 1) {
      const current = list[i];
      const next = list[i + 1];
      const shared = {
        x: (current.points[3].x + next.points[0].x) / 2,
        y: (current.points[3].y + next.points[0].y) / 2
      };
      current.points[3] = { ...shared };
      next.points[0] = { ...shared };
    }
  });
}

function markCornerJoins(curves: EditorCurve[], threshold: number) {
  curves.forEach((curve) => {
    curve.cornerStart = false;
    curve.cornerEnd = false;
  });
  const grouped = new Map<number, EditorCurve[]>();
  curves.forEach((curve) => {
    const list = grouped.get(curve.strokeIndex) ?? [];
    list.push(curve);
    grouped.set(curve.strokeIndex, list);
  });

  grouped.forEach((list) => {
    list.sort((a, b) => a.curveIndex - b.curveIndex);
    for (let i = 0; i < list.length - 1; i += 1) {
      const current = list[i];
      const next = list[i + 1];
      const angle = angleBetweenVectors(
        endTangent(current),
        startTangent(next)
      );
      if (angle >= threshold) {
        current.cornerEnd = true;
        next.cornerStart = true;
      }
    }
  });
}

function isCornerJoin(prev: EditorCurve, next: EditorCurve) {
  return Boolean(prev.cornerEnd || next.cornerStart);
}

function startTangent(curve: EditorCurve) {
  const p0 = curve.points[0];
  const p1 = curve.points[1];
  const vector = { x: p1.x - p0.x, y: p1.y - p0.y };
  if (Math.hypot(vector.x, vector.y) > 0) {
    return vector;
  }
  return { x: curve.points[3].x - p0.x, y: curve.points[3].y - p0.y };
}

function endTangent(curve: EditorCurve) {
  const p2 = curve.points[2];
  const p3 = curve.points[3];
  const vector = { x: p3.x - p2.x, y: p3.y - p2.y };
  if (Math.hypot(vector.x, vector.y) > 0) {
    return vector;
  }
  return { x: p3.x - curve.points[0].x, y: p3.y - curve.points[0].y };
}

function angleBetweenVectors(first: Point, second: Point) {
  const len1 = Math.hypot(first.x, first.y);
  const len2 = Math.hypot(second.x, second.y);
  if (len1 === 0 || len2 === 0) {
    return 0;
  }
  const cos = clamp((first.x * second.x + first.y * second.y) / (len1 * len2), -1, 1);
  return Math.acos(cos) * (180 / Math.PI);
}

function findEditorCurve(strokeIndex: number, curveIndex: number) {
  return editorCurves.find(
    (curve) =>
      curve.strokeIndex === strokeIndex &&
      curve.curveIndex === curveIndex
  );
}

function mirrorHandle(anchor: Point, handle: Point) {
  return {
    x: anchor.x + (anchor.x - handle.x),
    y: anchor.y + (anchor.y - handle.y)
  };
}

function translatePoint(point: Point, delta: { x: number; y: number }) {
  return {
    x: point.x + delta.x,
    y: point.y + delta.y
  };
}

function approximateCurveLength(points: Point[], samples: number) {
  if (points.length < 4) {
    return 0;
  }
  const [p0, p1, p2, p3] = points;
  const steps = Math.max(2, Math.floor(samples));
  let length = 0;
  let prev = p0;
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const point = cubicAt(p0, p1, p2, p3, t);
    length += Math.hypot(point.x - prev.x, point.y - prev.y);
    prev = point;
  }
  return length;
}

function cubicAt(p0: Point, p1: Point, p2: Point, p3: Point, t: number) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;
  return {
    x:
      uuu * p0.x +
      3 * uu * t * p1.x +
      3 * u * tt * p2.x +
      ttt * p3.x,
    y:
      uuu * p0.y +
      3 * uu * t * p1.y +
      3 * u * tt * p2.y +
      ttt * p3.y
  };
}

function clamp(value: number, min: number, max: number) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}
