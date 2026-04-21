import "./style.css";
import {
  compileTracingPath,
  type FormationAnnotation,
  type JoinSpacingOptions,
  type PreparedTracingPath
} from "letterpaths";
import {
  buildFormationAnnotationMarkup,
  DEFAULT_FORMATION_ANNOTATION_VISIBILITY,
  EMPTY_FORMATION_ANNOTATION_VISIBILITY,
  type FormationAnnotationMarkupOptions,
  type FormationAnnotationVisibility
} from "./formation-annotation-markup";
import { buildPathD, buildShiftedWordLayout, type ShiftedWordLayout } from "./shared";

type AnnotationScope = "top" | "practice";

type WorksheetAnnotationSettings = FormationAnnotationMarkupOptions & {
  arrowColor: string;
  strokeColor: string;
};

type WorksheetState = {
  text: string;
  previewZoom: number;
  practiceRowHeightMm: number;
  practiceRepeatCount: number;
  strokeWidth: number;
  joinSpacing: Required<JoinSpacingOptions>;
  showAscenderGuide: boolean;
  showDescenderGuide: boolean;
  keepInitialLeadIn: boolean;
  keepFinalLeadOut: boolean;
  top: WorksheetAnnotationSettings;
  practice: WorksheetAnnotationSettings;
};

type RangeControlOptions = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  valueId?: string;
  attrs?: string;
};

const DEFAULT_TEXT = "zephyr";
const DEFAULT_MIDPOINT_DENSITY = 320;
const DEFAULT_TURN_RADIUS = 13;
const DEFAULT_U_TURN_LENGTH = 53;
const DEFAULT_ARROW_LENGTH = 53;
const DEFAULT_ARROW_HEAD_SIZE = 26;
const DEFAULT_ARROW_STROKE_WIDTH = 5.6;
const DEFAULT_NUMBER_SIZE = DEFAULT_TURN_RADIUS * 2;
const DEFAULT_NUMBER_PATH_OFFSET = 0;
const DEFAULT_NUMBER_COLOR = "#3f454b";
const DEFAULT_ARROW_COLOR = "#ffffff";
const DEFAULT_TOP_STROKE_COLOR = "#bac4ce";
const DEFAULT_PRACTICE_STROKE_COLOR = "#d5dbe2";
const DEFAULT_PRACTICE_ROW_HEIGHT_MM = 24;
const DEFAULT_PRACTICE_REPEAT_COUNT = 1;
const DEFAULT_STROKE_WIDTH = 54;
const DEFAULT_PREVIEW_ZOOM = 100;
const PRACTICE_AREA_HEIGHT_MM = 178;
const ASCENDER_GUIDE_RATIO = 0.63;
const DESCENDER_GUIDE_RATIO = 0.66;
const PNG_EXPORT_SCALE = 2;
const SVG_NS = "http://www.w3.org/2000/svg";
const WORKSHEET_SVG_EXPORT_STYLES = `
  .worksheet-word__stroke {
    fill: none;
    stroke: var(--worksheet-word-stroke, #d5dbe2);
    stroke-width: var(--worksheet-word-stroke-width, 54);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-opacity: 0.92;
  }
  .worksheet-word--top .worksheet-word__stroke {
    stroke: var(--worksheet-word-stroke, #bac4ce);
    stroke-opacity: 1;
  }
  .worksheet-word__guide {
    stroke: rgba(35, 49, 61, 0.14);
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
  }
  .worksheet-word__guide--baseline {
    stroke: rgba(47, 125, 104, 0.72);
  }
  .worksheet-word__guide--midline {
    stroke: rgba(202, 83, 72, 0.45);
  }
  .worksheet-word__guide--ascender {
    stroke: rgba(49, 90, 157, 0.38);
  }
  .worksheet-word__guide--descender {
    stroke: rgba(13, 127, 140, 0.38);
  }
  .writing-app__section-arrow {
    fill: none;
    stroke-width: var(--formation-arrow-stroke-width, 5.6);
    stroke-linecap: butt;
    stroke-linejoin: round;
  }
  .writing-app__section-arrow--formation {
    stroke: var(--formation-arrow-color, #ffffff);
  }
  .writing-app__section-arrowhead--formation {
    fill: var(--formation-arrow-color, #ffffff);
    stroke: none;
  }
  .writing-app__annotation-number {
    font-weight: 800;
  }
`;
const DEFAULT_WORKSHEET_JOIN_SPACING = {
  targetBendRate: 16,
  minSidebearingGap: 80,
  bendSearchMinSidebearingGap: -30,
  bendSearchMaxSidebearingGap: 240,
  exitHandleScale: 0.75,
  entryHandleScale: 0.75
} as const satisfies Required<JoinSpacingOptions>;

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app element for cursive worksheet generator.");
}

document.body.classList.add("worksheet-body");
app.classList.add("worksheet-root");

const cloneVisibility = (
  visibility: FormationAnnotationVisibility
): FormationAnnotationVisibility => ({
  "directional-dash": visibility["directional-dash"],
  "turning-point": visibility["turning-point"],
  "start-arrow": visibility["start-arrow"],
  "draw-order-number": visibility["draw-order-number"],
  "midpoint-arrow": visibility["midpoint-arrow"]
});

const createSettings = (
  visibility: FormationAnnotationVisibility,
  strokeColor: string
): WorksheetAnnotationSettings => ({
  midpointDensity: DEFAULT_MIDPOINT_DENSITY,
  turnRadius: DEFAULT_TURN_RADIUS,
  uTurnLength: DEFAULT_U_TURN_LENGTH,
  arrowLength: DEFAULT_ARROW_LENGTH,
  arrowHeadSize: DEFAULT_ARROW_HEAD_SIZE,
  arrowStrokeWidth: DEFAULT_ARROW_STROKE_WIDTH,
  numberSize: DEFAULT_NUMBER_SIZE,
  numberPathOffset: DEFAULT_NUMBER_PATH_OFFSET,
  numberColor: DEFAULT_NUMBER_COLOR,
  offsetArrowLanes: true,
  visibility: cloneVisibility(visibility),
  arrowColor: DEFAULT_ARROW_COLOR,
  strokeColor
});

let state: WorksheetState = {
  text: DEFAULT_TEXT,
  previewZoom: DEFAULT_PREVIEW_ZOOM,
  practiceRowHeightMm: DEFAULT_PRACTICE_ROW_HEIGHT_MM,
  practiceRepeatCount: DEFAULT_PRACTICE_REPEAT_COUNT,
  strokeWidth: DEFAULT_STROKE_WIDTH,
  joinSpacing: { ...DEFAULT_WORKSHEET_JOIN_SPACING },
  showAscenderGuide: false,
  showDescenderGuide: false,
  keepInitialLeadIn: true,
  keepFinalLeadOut: true,
  top: createSettings(DEFAULT_FORMATION_ANNOTATION_VISIBILITY, DEFAULT_TOP_STROKE_COLOR),
  practice: createSettings(EMPTY_FORMATION_ANNOTATION_VISIBILITY, DEFAULT_PRACTICE_STROKE_COLOR)
};

app.innerHTML = `
  <div class="worksheet-app">
    <aside class="worksheet-app__controls" aria-label="Worksheet controls">
      <div class="worksheet-app__controls-inner">
        <div class="worksheet-app__heading">
          <p class="worksheet-app__eyebrow">Worksheet generator</p>
          <h1 class="worksheet-app__title">Cursive worksheet</h1>
        </div>

        <label class="worksheet-app__field" for="worksheet-text-input">
          <span>Word or words</span>
          <input
            class="worksheet-app__text-input"
            id="worksheet-text-input"
            type="text"
            value="${DEFAULT_TEXT}"
            autocomplete="off"
            spellcheck="false"
          />
        </label>

        ${renderRangeControl({
  id: "preview-zoom-slider",
  label: "Preview zoom",
  value: DEFAULT_PREVIEW_ZOOM,
  min: 50,
  max: 200,
  step: 5,
  valueId: "preview-zoom-value"
})}

        ${renderRangeControl({
  id: "practice-size-slider",
  label: "Practice size",
  value: DEFAULT_PRACTICE_ROW_HEIGHT_MM,
  min: 14,
  max: 38,
  step: 1,
  valueId: "practice-size-value"
})}

        ${renderRangeControl({
  id: "practice-repeat-slider",
  label: "Practice repeats",
  value: DEFAULT_PRACTICE_REPEAT_COUNT,
  min: 1,
  max: 6,
  step: 1,
  valueId: "practice-repeat-value"
})}

        ${renderRangeControl({
  id: "stroke-width-slider",
  label: "Main stroke thickness",
  value: DEFAULT_STROKE_WIDTH,
  min: 20,
  max: 90,
  step: 2,
  valueId: "stroke-width-value"
})}

        ${renderAdvancedSettings()}

        ${renderAnnotationControlSection("top", "Top word annotations", state.top)}
        ${renderAnnotationControlSection("practice", "Practice annotations", state.practice)}

        <div class="worksheet-app__button-row">
          <button class="worksheet-app__button" id="print-worksheet-button" type="button">
            Print worksheet
          </button>
          <button class="worksheet-app__button worksheet-app__button--secondary" id="download-png-button" type="button">
            Download PNG
          </button>
        </div>
        <p class="worksheet-app__status" id="worksheet-status" role="status" aria-live="polite"></p>
      </div>
    </aside>

    <main class="worksheet-app__preview" aria-label="Worksheet preview">
      <div class="worksheet-app__page-frame" id="worksheet-page-frame">
        <section class="worksheet-page" id="worksheet-page" aria-label="Printable worksheet"></section>
      </div>
    </main>
  </div>
`;

const textInput = document.querySelector<HTMLInputElement>("#worksheet-text-input");
const previewZoomSlider = document.querySelector<HTMLInputElement>("#preview-zoom-slider");
const practiceSizeSlider = document.querySelector<HTMLInputElement>("#practice-size-slider");
const practiceRepeatSlider = document.querySelector<HTMLInputElement>("#practice-repeat-slider");
const strokeWidthSlider = document.querySelector<HTMLInputElement>("#stroke-width-slider");
const printButton = document.querySelector<HTMLButtonElement>("#print-worksheet-button");
const downloadPngButton = document.querySelector<HTMLButtonElement>("#download-png-button");
const worksheetPageFrame = document.querySelector<HTMLElement>("#worksheet-page-frame");
const worksheetPage = document.querySelector<HTMLElement>("#worksheet-page");
const statusEl = document.querySelector<HTMLParagraphElement>("#worksheet-status");

if (
  !textInput ||
  !previewZoomSlider ||
  !practiceSizeSlider ||
  !practiceRepeatSlider ||
  !strokeWidthSlider ||
  !printButton ||
  !downloadPngButton ||
  !worksheetPageFrame ||
  !worksheetPage ||
  !statusEl
) {
  throw new Error("Missing elements for cursive worksheet generator.");
}

function renderRangeControl({
  id,
  label,
  value,
  min,
  max,
  step,
  valueId = `${id}-value`,
  attrs = ""
}: RangeControlOptions): string {
  return `
    <label class="worksheet-app__field" for="${id}">
      <span>
        ${label}
        <strong id="${valueId}"></strong>
      </span>
      <input
        class="worksheet-app__range"
        id="${id}"
        type="range"
        min="${min}"
        max="${max}"
        step="${step}"
        value="${value}"
        ${attrs}
      />
    </label>
  `;
}

function renderAdvancedSettings(): string {
  return `
    <details class="worksheet-app__details">
      <summary>Advanced settings</summary>
      <div class="worksheet-app__details-body">
        ${renderRangeControl({
    id: "target-bend-rate-slider",
    label: "Target maximum bend rate",
    value: DEFAULT_WORKSHEET_JOIN_SPACING.targetBendRate,
    min: 0,
    max: 60,
    step: 1,
    valueId: "target-bend-rate-value",
    attrs: 'data-global-setting="targetBendRate"'
  })}
        ${renderRangeControl({
    id: "min-sidebearing-gap-slider",
    label: "Minimum sidebearing gap",
    value: DEFAULT_WORKSHEET_JOIN_SPACING.minSidebearingGap,
    min: -300,
    max: 200,
    step: 5,
    valueId: "min-sidebearing-gap-value",
    attrs: 'data-global-setting="minSidebearingGap"'
  })}
        ${renderRangeControl({
    id: "bend-search-min-sidebearing-gap-slider",
    label: "Search minimum sidebearing gap",
    value: DEFAULT_WORKSHEET_JOIN_SPACING.bendSearchMinSidebearingGap,
    min: -300,
    max: 200,
    step: 5,
    valueId: "bend-search-min-sidebearing-gap-value",
    attrs: 'data-global-setting="bendSearchMinSidebearingGap"'
  })}
        ${renderRangeControl({
    id: "bend-search-max-sidebearing-gap-slider",
    label: "Search maximum sidebearing gap",
    value: DEFAULT_WORKSHEET_JOIN_SPACING.bendSearchMaxSidebearingGap,
    min: -100,
    max: 300,
    step: 5,
    valueId: "bend-search-max-sidebearing-gap-value",
    attrs: 'data-global-setting="bendSearchMaxSidebearingGap"'
  })}
        ${renderRangeControl({
    id: "exit-handle-scale-slider",
    label: "p0-p1 handle scale",
    value: DEFAULT_WORKSHEET_JOIN_SPACING.exitHandleScale,
    min: 0,
    max: 2,
    step: 0.05,
    valueId: "exit-handle-scale-value",
    attrs: 'data-global-setting="exitHandleScale"'
  })}
        ${renderRangeControl({
    id: "entry-handle-scale-slider",
    label: "p2-p3 handle scale",
    value: DEFAULT_WORKSHEET_JOIN_SPACING.entryHandleScale,
    min: 0,
    max: 2,
    step: 0.05,
    valueId: "entry-handle-scale-value",
    attrs: 'data-global-setting="entryHandleScale"'
  })}
        <fieldset class="worksheet-app__checks" aria-label="Advanced worksheet toggles">
          ${renderGlobalToggle("include-initial-lead-in", "keepInitialLeadIn", "Initial lead-in", true)}
          ${renderGlobalToggle("include-final-lead-out", "keepFinalLeadOut", "Final lead-out", true)}
          ${renderGlobalToggle("show-ascender-guide", "showAscenderGuide", "Ascender gridline", false)}
          ${renderGlobalToggle("show-descender-guide", "showDescenderGuide", "Descender gridline", false)}
        </fieldset>
      </div>
    </details>
  `;
}

function renderGlobalToggle(
  id: string,
  setting: keyof Pick<
    WorksheetState,
    "keepInitialLeadIn" | "keepFinalLeadOut" | "showAscenderGuide" | "showDescenderGuide"
  >,
  label: string,
  checked: boolean
): string {
  return `
    <label class="worksheet-app__check" for="${id}">
      <input
        id="${id}"
        type="checkbox"
        data-global-setting="${setting}"
        ${checked ? "checked" : ""}
      />
      <span>${label}</span>
    </label>
  `;
}

function renderAnnotationControlSection(
  scope: AnnotationScope,
  label: string,
  settings: WorksheetAnnotationSettings
): string {
  return `
    <details class="worksheet-app__details" open>
      <summary>${label}</summary>
      <div class="worksheet-app__details-body">
        ${renderRangeControl({
    id: `${scope}-midpoint-density-slider`,
    label: "Midpoint density",
    value: settings.midpointDensity,
    min: 120,
    max: 600,
    step: 20,
    valueId: `${scope}-midpoint-density-value`,
    attrs: `data-scope="${scope}" data-setting="midpointDensity"`
  })}
        ${renderRangeControl({
          id: `${scope}-turn-radius-slider`,
          label: "Turn radius",
          value: settings.turnRadius,
          min: 0,
    max: 48,
    step: 1,
          valueId: `${scope}-turn-radius-value`,
          attrs: `data-scope="${scope}" data-setting="turnRadius"`
        })}
        ${renderRangeControl({
          id: `${scope}-u-turn-length-slider`,
          label: "U-turn length",
          value: settings.uTurnLength,
          min: 0,
          max: 300,
          step: 1,
          valueId: `${scope}-u-turn-length-value`,
          attrs: `data-scope="${scope}" data-setting="uTurnLength"`
        })}
        ${renderRangeControl({
          id: `${scope}-arrow-length-slider`,
          label: "Other arrow length",
          value: settings.arrowLength,
          min: 0,
          max: 300,
    step: 1,
    valueId: `${scope}-arrow-length-value`,
    attrs: `data-scope="${scope}" data-setting="arrowLength"`
  })}
        ${renderRangeControl({
    id: `${scope}-arrow-head-size-slider`,
    label: "Arrow head size",
    value: settings.arrowHeadSize,
    min: 0,
    max: 64,
    step: 1,
    valueId: `${scope}-arrow-head-size-value`,
    attrs: `data-scope="${scope}" data-setting="arrowHeadSize"`
  })}
        ${renderRangeControl({
    id: `${scope}-arrow-stroke-width-slider`,
    label: "Arrow stroke width",
    value: settings.arrowStrokeWidth,
    min: 1,
    max: 14,
    step: 0.5,
    valueId: `${scope}-arrow-stroke-width-value`,
    attrs: `data-scope="${scope}" data-setting="arrowStrokeWidth"`
  })}
        ${renderRangeControl({
    id: `${scope}-number-size-slider`,
    label: "Number size",
    value: settings.numberSize,
    min: 8,
    max: 72,
    step: 1,
    valueId: `${scope}-number-size-value`,
    attrs: `data-scope="${scope}" data-setting="numberSize"`
  })}
        ${renderRangeControl({
    id: `${scope}-number-offset-slider`,
    label: "Number offset",
    value: settings.numberPathOffset,
    min: -80,
    max: 80,
    step: 1,
    valueId: `${scope}-number-offset-value`,
    attrs: `data-scope="${scope}" data-setting="numberPathOffset"`
  })}
        <fieldset class="worksheet-app__checks" aria-label="${label}">
          ${renderAnnotationToggle(scope, "turning-point", "Turns", settings.visibility["turning-point"])}
          ${renderAnnotationToggle(scope, "start-arrow", "Starts", settings.visibility["start-arrow"])}
          ${renderAnnotationToggle(scope, "draw-order-number", "Numbers", settings.visibility["draw-order-number"])}
          ${renderAnnotationToggle(scope, "midpoint-arrow", "Midpoints", settings.visibility["midpoint-arrow"])}
          <label class="worksheet-app__check">
            <input
              type="checkbox"
              data-scope="${scope}"
              data-setting="offsetArrowLanes"
              ${settings.offsetArrowLanes ? "checked" : ""}
            />
            <span>Offset lanes</span>
          </label>
        </fieldset>
        ${renderColorControl(scope, "strokeColor", "Word stroke colour", settings.strokeColor)}
        ${renderColorControl(scope, "numberColor", "Number colour", settings.numberColor)}
        ${renderColorControl(scope, "arrowColor", "Arrow colour", settings.arrowColor)}
      </div>
    </details>
  `;
}

function renderColorControl(
  scope: AnnotationScope,
  setting: "arrowColor" | "numberColor" | "strokeColor",
  label: string,
  value: string
): string {
  return `
    <label class="worksheet-app__field worksheet-app__field--inline" for="${scope}-${setting}-picker">
      <span>${label}</span>
      <input
        class="worksheet-app__color"
        id="${scope}-${setting}-picker"
        type="color"
        value="${value}"
        data-scope="${scope}"
        data-setting="${setting}"
      />
    </label>
  `;
}

function renderAnnotationToggle(
  scope: AnnotationScope,
  kind: FormationAnnotation["kind"],
  label: string,
  checked: boolean
): string {
  return `
    <label class="worksheet-app__check">
      <input
        type="checkbox"
        data-scope="${scope}"
        data-annotation-kind="${kind}"
        ${checked ? "checked" : ""}
      />
      <span>${label}</span>
    </label>
  `;
}

const normalizeText = (value: string): string => value.trim().toLowerCase().replace(/\s+/g, " ");

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const normalizeColor = (value: string): string | null =>
  /^#[0-9a-fA-F]{6}$/.test(value) ? value.toLowerCase() : null;

const getScopeSettings = (scope: AnnotationScope): WorksheetAnnotationSettings => state[scope];

const getPracticeRowCount = (): number =>
  Math.max(1, Math.floor(PRACTICE_AREA_HEIGHT_MM / state.practiceRowHeightMm));

const formatScale = (value: number): string => value.toFixed(2);

const setText = (id: string, value: string) => {
  const element = document.querySelector<HTMLElement>(`#${id}`);
  if (element) {
    element.textContent = value;
  }
};

const syncLabels = () => {
  setText("preview-zoom-value", `${state.previewZoom}%`);
  setText("practice-size-value", `${state.practiceRowHeightMm} mm`);
  setText("practice-repeat-value", `${state.practiceRepeatCount}`);
  setText("stroke-width-value", `${state.strokeWidth}px`);
  setText("target-bend-rate-value", `${state.joinSpacing.targetBendRate}`);
  setText("min-sidebearing-gap-value", `${state.joinSpacing.minSidebearingGap}`);
  setText(
    "bend-search-min-sidebearing-gap-value",
    `${state.joinSpacing.bendSearchMinSidebearingGap}`
  );
  setText(
    "bend-search-max-sidebearing-gap-value",
    `${state.joinSpacing.bendSearchMaxSidebearingGap}`
  );
  setText("exit-handle-scale-value", formatScale(state.joinSpacing.exitHandleScale));
  setText("entry-handle-scale-value", formatScale(state.joinSpacing.entryHandleScale));

  (["top", "practice"] as const).forEach((scope) => {
    const settings = getScopeSettings(scope);
    setText(`${scope}-midpoint-density-value`, `1 per ${settings.midpointDensity}px`);
    setText(`${scope}-turn-radius-value`, `${settings.turnRadius}px`);
    setText(`${scope}-u-turn-length-value`, `${settings.uTurnLength}px`);
    setText(`${scope}-arrow-length-value`, `${settings.arrowLength}px`);
    setText(`${scope}-arrow-head-size-value`, `${settings.arrowHeadSize}px`);
    setText(`${scope}-arrow-stroke-width-value`, `${settings.arrowStrokeWidth.toFixed(1)}px`);
    setText(`${scope}-number-size-value`, `${settings.numberSize}px`);
    setText(`${scope}-number-offset-value`, `${settings.numberPathOffset}px`);
  });
};

const applyPreviewZoom = () => {
  worksheetPageFrame.style.setProperty("--worksheet-preview-scale", `${state.previewZoom / 100}`);
};

const setPreviewZoom = (value: number) => {
  state.previewZoom = value;
  previewZoomSlider.value = `${value}`;
  applyPreviewZoom();
  syncLabels();
};

const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

const withPreviewZoom = async <T>(zoom: number, action: () => Promise<T>): Promise<T> => {
  const previousZoom = state.previewZoom;
  if (previousZoom !== zoom) {
    setPreviewZoom(zoom);
    await nextFrame();
  }

  try {
    return await action();
  } finally {
    if (previousZoom !== zoom) {
      setPreviewZoom(previousZoom);
      await nextFrame();
    }
  }
};

const getGuideLineY = (layout: ShiftedWordLayout, kind: "ascender" | "descender"): number => {
  const guides = layout.path.guides;
  const guideHeight = Math.abs(guides.baseline - guides.xHeight);
  const rawGuide =
    kind === "ascender"
      ? guides.ascender ?? guides.xHeight - guideHeight * ASCENDER_GUIDE_RATIO
      : guides.descender ?? guides.baseline + guideHeight * DESCENDER_GUIDE_RATIO;
  return rawGuide + layout.offsetY;
};

const renderGuideLines = (layout: ShiftedWordLayout, width: number): string => `
  ${state.showAscenderGuide ? `
    <line
      class="worksheet-word__guide worksheet-word__guide--ascender"
      x1="0"
      y1="${getGuideLineY(layout, "ascender")}"
      x2="${width}"
      y2="${getGuideLineY(layout, "ascender")}"
    ></line>
  ` : ""}
  <line
    class="worksheet-word__guide worksheet-word__guide--midline"
    x1="0"
    y1="${layout.path.guides.xHeight + layout.offsetY}"
    x2="${width}"
    y2="${layout.path.guides.xHeight + layout.offsetY}"
  ></line>
  <line
    class="worksheet-word__guide worksheet-word__guide--baseline"
    x1="0"
    y1="${layout.path.guides.baseline + layout.offsetY}"
    x2="${width}"
    y2="${layout.path.guides.baseline + layout.offsetY}"
  ></line>
  ${state.showDescenderGuide ? `
    <line
      class="worksheet-word__guide worksheet-word__guide--descender"
      x1="0"
      y1="${getGuideLineY(layout, "descender")}"
      x2="${width}"
      y2="${getGuideLineY(layout, "descender")}"
    ></line>
  ` : ""}
`;

const renderWordContent = (
  layout: ShiftedWordLayout,
  preparedPath: PreparedTracingPath,
  settings: WorksheetAnnotationSettings
): string => {
  const drawableStrokes = layout.path.strokes.filter((stroke) => stroke.type !== "lift");
  const strokePaths = drawableStrokes
    .map((stroke) => `<path class="worksheet-word__stroke" d="${buildPathD(stroke.curves)}"></path>`)
    .join("");
  const annotationMarkup = buildFormationAnnotationMarkup(layout.path, preparedPath, settings);

  return `
    ${strokePaths}
    ${annotationMarkup}
  `;
};

const renderWordSvg = (
  layout: ShiftedWordLayout,
  preparedPath: PreparedTracingPath,
  settings: WorksheetAnnotationSettings,
  className: string,
  ariaLabel: string
): string => {
  const wordContent = renderWordContent(layout, preparedPath, settings);

  return `
    <svg
      class="${className}"
      viewBox="0 0 ${layout.width} ${layout.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${escapeHtml(ariaLabel)}"
      style="--formation-arrow-color: ${settings.arrowColor}; --formation-arrow-stroke-width: ${settings.arrowStrokeWidth}; --worksheet-word-stroke: ${settings.strokeColor}; --worksheet-word-stroke-width: ${state.strokeWidth};"
    >
      ${renderGuideLines(layout, layout.width)}
      ${wordContent}
    </svg>
  `;
};

const getPracticeAdvance = (layout: ShiftedWordLayout): number => {
  const contentWidth = layout.path.bounds.maxX - layout.path.bounds.minX;
  const leadingPadding = layout.path.bounds.minX;
  return contentWidth + leadingPadding;
};

const renderPracticeRowSvg = (
  layout: ShiftedWordLayout,
  preparedPath: PreparedTracingPath,
  settings: WorksheetAnnotationSettings,
  repeatCount: number,
  rowIndex: number
): string => {
  const advance = getPracticeAdvance(layout);
  const rowWidth = layout.width + advance * (repeatCount - 1);
  const wordContent = renderWordContent(layout, preparedPath, settings);
  const symbolId = `practice-word-${rowIndex}`;
  const repeatedWords = Array.from({ length: repeatCount }, (_, repeatIndex) => {
    const x = repeatIndex * advance;
    return `<use href="#${symbolId}" x="${x}" y="0"></use>`;
  }).join("");

  return `
    <svg
      class="worksheet-word worksheet-word--practice"
      viewBox="0 0 ${rowWidth} ${layout.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${escapeHtml(`${state.text} practice line, ${repeatCount} repeat${repeatCount === 1 ? "" : "s"}`)}"
      style="--formation-arrow-color: ${settings.arrowColor}; --formation-arrow-stroke-width: ${settings.arrowStrokeWidth}; --worksheet-word-stroke: ${settings.strokeColor}; --worksheet-word-stroke-width: ${state.strokeWidth};"
    >
      ${renderGuideLines(layout, rowWidth)}
      <defs>
        <g id="${symbolId}">
          ${wordContent}
        </g>
      </defs>
      ${repeatedWords}
    </svg>
  `;
};

const renderWorksheet = () => {
  state = {
    ...state,
    text: normalizeText(textInput.value),
    practiceRowHeightMm: Number(practiceSizeSlider.value),
    practiceRepeatCount: Number(practiceRepeatSlider.value),
    strokeWidth: Number(strokeWidthSlider.value)
  };
  syncLabels();

  if (state.text.length === 0) {
    worksheetPage.innerHTML = `
      <div class="worksheet-page__empty">Enter a word or words.</div>
    `;
    statusEl.textContent = "";
    return;
  }

  const layoutOptions = {
    joinSpacing: state.joinSpacing,
    keepInitialLeadIn: state.keepInitialLeadIn,
    keepFinalLeadOut: state.keepFinalLeadOut
  };
  let topLayout: ShiftedWordLayout;
  let practiceLayout: ShiftedWordLayout;
  try {
    topLayout = buildShiftedWordLayout(state.text, layoutOptions);
    practiceLayout = buildShiftedWordLayout(state.text, layoutOptions);
  } catch {
    worksheetPage.innerHTML = `
      <div class="worksheet-page__empty">Use supported cursive letters and spaces.</div>
    `;
    statusEl.textContent = "This text could not be drawn.";
    return;
  }

  const topPreparedPath = compileTracingPath(topLayout.path);
  const practicePreparedPath = compileTracingPath(practiceLayout.path);
  const topSvg = renderWordSvg(
    topLayout,
    topPreparedPath,
    state.top,
    "worksheet-word worksheet-word--top",
    `${state.text} with formation annotations`
  );
  const practiceRowCount = getPracticeRowCount();
  const practiceRows = Array.from({ length: practiceRowCount }, (_, rowIndex) =>
    renderPracticeRowSvg(
      practiceLayout,
      practicePreparedPath,
      state.practice,
      state.practiceRepeatCount,
      rowIndex
    )
  ).join("");

  worksheetPage.style.setProperty("--practice-row-height", `${state.practiceRowHeightMm}mm`);
  worksheetPage.innerHTML = `
    <header class="worksheet-page__header">
      <div class="worksheet-page__meta-line">
        <span>Name</span>
        <span>Date</span>
      </div>
    </header>
    <section class="worksheet-page__example" aria-label="Top example">
      ${topSvg}
    </section>
    <section class="worksheet-page__practice" aria-label="Practice lines">
      ${practiceRows}
    </section>
  `;
  statusEl.textContent = `${practiceRowCount} practice lines, ${state.practiceRepeatCount} repeat${state.practiceRepeatCount === 1 ? "" : "s"} per line`;
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not render worksheet image."));
    image.src = src;
  });

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const getRelativeRect = (
  element: Element,
  containerRect: DOMRect
): { x: number; y: number; width: number; height: number } => {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left - containerRect.left,
    y: rect.top - containerRect.top,
    width: rect.width,
    height: rect.height
  };
};

const drawHorizontalLine = (
  context: CanvasRenderingContext2D,
  x1: number,
  x2: number,
  y: number,
  color: string,
  width: number
) => {
  context.save();
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = width;
  context.moveTo(x1, y);
  context.lineTo(x2, y);
  context.stroke();
  context.restore();
};

const drawWorksheetHeader = (
  context: CanvasRenderingContext2D,
  containerRect: DOMRect
) => {
  context.save();
  context.fillStyle = "#23313d";
  context.font = "700 14.5px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  context.textBaseline = "alphabetic";

  worksheetPage.querySelectorAll<HTMLElement>(".worksheet-page__meta-line span").forEach((span) => {
    const rect = getRelativeRect(span, containerRect);
    const label = span.textContent?.trim() ?? "";
    const textY = rect.y + rect.height - 3;
    context.fillText(label, rect.x, textY);
    const lineStart = rect.x + context.measureText(label).width + 15;
    drawHorizontalLine(
      context,
      lineStart,
      rect.x + rect.width,
      rect.y + rect.height - 1,
      "#cfd6dc",
      1.3
    );
  });
  context.restore();
};

const createSerializableSvg = (svg: SVGSVGElement): string => {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", SVG_NS);
  const styleEl = document.createElementNS(SVG_NS, "style");
  styleEl.textContent = WORKSHEET_SVG_EXPORT_STYLES;
  clone.insertBefore(styleEl, clone.firstChild);
  return new XMLSerializer().serializeToString(clone);
};

const drawSvgElement = async (
  context: CanvasRenderingContext2D,
  svg: SVGSVGElement,
  containerRect: DOMRect
) => {
  const rect = getRelativeRect(svg, containerRect);
  const svgSource = createSerializableSvg(svg);
  const svgUrl = URL.createObjectURL(
    new Blob([svgSource], { type: "image/svg+xml;charset=utf-8" })
  );
  try {
    const image = await loadImage(svgUrl);
    context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
};

const createWorksheetPngBlob = async (): Promise<Blob> => {
  return await withPreviewZoom(DEFAULT_PREVIEW_ZOOM, async () => {
    renderWorksheet();

    const rect = worksheetPage.getBoundingClientRect();
    const width = Math.ceil(rect.width);
    const height = Math.ceil(rect.height);
    const canvas = document.createElement("canvas");
    canvas.width = width * PNG_EXPORT_SCALE;
    canvas.height = height * PNG_EXPORT_SCALE;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not prepare worksheet image.");
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.scale(PNG_EXPORT_SCALE, PNG_EXPORT_SCALE);

    drawWorksheetHeader(context, rect);
    for (const svg of worksheetPage.querySelectorAll<SVGSVGElement>(".worksheet-word")) {
      await drawSvgElement(context, svg, rect);
    }

    const exampleSection = worksheetPage.querySelector<HTMLElement>(".worksheet-page__example");
    if (exampleSection) {
      const exampleRect = getRelativeRect(exampleSection, rect);
      drawHorizontalLine(
        context,
        exampleRect.x,
        exampleRect.x + exampleRect.width,
        exampleRect.y + exampleRect.height - 1,
        "#d7dde2",
        1.3
      );
    }

    worksheetPage.querySelectorAll<SVGSVGElement>(".worksheet-word--practice").forEach((svg) => {
      const rowRect = getRelativeRect(svg, rect);
      drawHorizontalLine(
        context,
        rowRect.x,
        rowRect.x + rowRect.width,
        rowRect.y + rowRect.height - 0.6,
        "#d7dde2",
        1.1
      );
    });

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Could not encode worksheet image."));
        }
      }, "image/png");
    });
  });
};

textInput.addEventListener("input", renderWorksheet);
previewZoomSlider.addEventListener("input", () => {
  setPreviewZoom(Number(previewZoomSlider.value));
});
practiceSizeSlider.addEventListener("input", renderWorksheet);
practiceRepeatSlider.addEventListener("input", renderWorksheet);
strokeWidthSlider.addEventListener("input", renderWorksheet);
printButton.addEventListener("click", () => {
  renderWorksheet();
  window.print();
});
downloadPngButton.addEventListener("click", () => {
  downloadPngButton.disabled = true;
  statusEl.textContent = "Preparing PNG...";
  createWorksheetPngBlob()
    .then((blob) => {
      const filenameText = normalizeText(state.text).replaceAll(/\s+/g, "-") || "worksheet";
      downloadBlob(blob, `${filenameText}-cursive-worksheet.png`);
      statusEl.textContent = "PNG downloaded.";
    })
    .catch((error) => {
      statusEl.textContent = error instanceof Error ? error.message : "Could not download PNG.";
    })
    .finally(() => {
      downloadPngButton.disabled = false;
    });
});

document.querySelectorAll<HTMLInputElement>("[data-global-setting]").forEach((input) => {
  input.addEventListener("input", () => {
    const setting = input.dataset.globalSetting;
    if (
      setting === "targetBendRate" ||
      setting === "minSidebearingGap" ||
      setting === "bendSearchMinSidebearingGap" ||
      setting === "bendSearchMaxSidebearingGap" ||
      setting === "exitHandleScale" ||
      setting === "entryHandleScale"
    ) {
      state.joinSpacing = {
        ...state.joinSpacing,
        [setting]: Number(input.value)
      };
    } else if (setting === "keepInitialLeadIn") {
      state.keepInitialLeadIn = input.checked;
    } else if (setting === "keepFinalLeadOut") {
      state.keepFinalLeadOut = input.checked;
    } else if (setting === "showAscenderGuide") {
      state.showAscenderGuide = input.checked;
    } else if (setting === "showDescenderGuide") {
      state.showDescenderGuide = input.checked;
    }

    renderWorksheet();
  });
});

document.querySelectorAll<HTMLInputElement>("[data-scope][data-setting]").forEach((input) => {
  input.addEventListener("input", () => {
    const scope = input.dataset.scope as AnnotationScope | undefined;
    const setting = input.dataset.setting;
    if (!scope || (scope !== "top" && scope !== "practice")) {
      return;
    }

    const settings = getScopeSettings(scope);
    if (setting === "midpointDensity") {
      settings.midpointDensity = Number(input.value);
    } else if (setting === "turnRadius") {
      settings.turnRadius = Number(input.value);
    } else if (setting === "uTurnLength") {
      settings.uTurnLength = Number(input.value);
    } else if (setting === "arrowLength") {
      settings.arrowLength = Number(input.value);
    } else if (setting === "arrowHeadSize") {
      settings.arrowHeadSize = Number(input.value);
    } else if (setting === "arrowStrokeWidth") {
      settings.arrowStrokeWidth = Number(input.value);
    } else if (setting === "numberSize") {
      settings.numberSize = Number(input.value);
    } else if (setting === "numberPathOffset") {
      settings.numberPathOffset = Number(input.value);
    } else if (setting === "offsetArrowLanes") {
      settings.offsetArrowLanes = input.checked;
    } else if (setting === "arrowColor" || setting === "numberColor" || setting === "strokeColor") {
      const nextColor = normalizeColor(input.value);
      if (!nextColor) {
        return;
      }
      settings[setting] = nextColor;
    }

    renderWorksheet();
  });
});

document.querySelectorAll<HTMLInputElement>("[data-scope][data-annotation-kind]").forEach((input) => {
  input.addEventListener("change", () => {
    const scope = input.dataset.scope as AnnotationScope | undefined;
    const kind = input.dataset.annotationKind as FormationAnnotation["kind"] | undefined;
    if (!scope || (scope !== "top" && scope !== "practice") || !kind) {
      return;
    }

    getScopeSettings(scope).visibility = {
      ...getScopeSettings(scope).visibility,
      [kind]: input.checked
    };
    renderWorksheet();
  });
});

syncLabels();
applyPreviewZoom();
renderWorksheet();
