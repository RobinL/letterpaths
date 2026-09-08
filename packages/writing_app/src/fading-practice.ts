import "./style.css";
import {
  compileTracingPath,
  type HandwritingStyle,
  type PreparedTracingPath
} from "letterpaths";
import {
  buildPathD,
  buildShiftedHandwritingLayout,
  type ShiftedWordLayout
} from "./shared";
import { setupWorksheetPreviewPanZoom } from "./worksheet-preview-pan-zoom";
import {
  buildFormationAnnotationMarkup,
  DEFAULT_FORMATION_ANNOTATION_VISIBILITY,
  type FormationAnnotationMarkupOptions,
  type FormationAnnotationVisibility
} from "./formation-annotation-markup";

type PracticeStyle = Extract<HandwritingStyle, "cursive" | "pre-cursive" | "print">;

type TopAnnotationSettings = FormationAnnotationMarkupOptions & {
  arrowColor: string;
  strokeColor: string;
};

type TopAnnotationSettingsPatch = Omit<
  Partial<TopAnnotationSettings>,
  "visibility"
> & {
  visibility?: Partial<FormationAnnotationVisibility>;
};

type WorksheetState = {
  text: string;
  style: PracticeStyle;
  previewZoom: number;
  rowHeightMm: number;
  rowGapMm: number;
  letterSpacing: number;
  wordSpacing: number;
  repeatCount: number;
  repeatGap: number;
  strokeWidth: number;
  fadeRows: number;
  initialTraceOpacity: number;
  showBaselineGuide: boolean;
  showXHeightGuide: boolean;
  showAscenderGuide: boolean;
  showDescenderGuide: boolean;
  guideStrokeWidth: number;
  guideColor: string;
  traceColor: string;
  keepInitialLeadIn: boolean;
  keepFinalLeadOut: boolean;
  includeNameDate: boolean;
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

const DEFAULT_TEXT = "practice";
const DEFAULT_STYLE: PracticeStyle = "cursive";
const DEFAULT_PREVIEW_ZOOM = 100;
const MIN_PREVIEW_ZOOM = 35;
const MAX_PREVIEW_ZOOM = 200;
const PREVIEW_ZOOM_STEP = 5;
const PREVIEW_FIT_PADDING_PX = 20;
const DEFAULT_ROW_HEIGHT_MM = 12;
const DEFAULT_ROW_GAP_MM = 2;
const DEFAULT_LETTER_SPACING = 0;
const DEFAULT_WORD_SPACING = 480;
const DEFAULT_REPEAT_COUNT = 1;
const DEFAULT_REPEAT_GAP = 140;
const DEFAULT_STROKE_WIDTH = 50;
const DEFAULT_FADE_ROWS = 10;
const DEFAULT_INITIAL_TRACE_OPACITY = 20;
const DEFAULT_GUIDE_STROKE_WIDTH = 0.8;
const DEFAULT_GUIDE_COLOR = "#9bb7d8";
const DEFAULT_TRACE_COLOR = "#d5dbe2";
const DEFAULT_TOP_STROKE_COLOR = "#83b0dd";
const DEFAULT_DIRECTIONAL_DASH_SPACING = 96;
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
const PRACTICE_AREA_HEIGHT_MM = 224;
const ASCENDER_GUIDE_RATIO = 0.63;
const DESCENDER_GUIDE_RATIO = 0.66;
const WORKSHEET_URL_PARAM_KEYS = [
  "text",
  "word",
  "style",
  "previewZoom",
  "rowHeight",
  "rowGap",
  "letterSpacing",
  "wordSpacing",
  "repeatCount",
  "repeatGap",
  "strokeWidth",
  "fadeRows",
  "initialTraceOpacity",
  "showBaselineGuide",
  "showXHeightGuide",
  "showAscenderGuide",
  "showDescenderGuide",
  "guideStrokeWidth",
  "guideColor",
  "traceColor",
  "keepInitialLeadIn",
  "keepFinalLeadOut",
  "includeNameDate"
] as const;

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app element for fading handwriting practice.");
}

document.body.classList.add("worksheet-body");
app.classList.add("worksheet-root");

const createDefaultState = (): WorksheetState => ({
  text: DEFAULT_TEXT,
  style: DEFAULT_STYLE,
  previewZoom: DEFAULT_PREVIEW_ZOOM,
  rowHeightMm: DEFAULT_ROW_HEIGHT_MM,
  rowGapMm: DEFAULT_ROW_GAP_MM,
  letterSpacing: DEFAULT_LETTER_SPACING,
  wordSpacing: DEFAULT_WORD_SPACING,
  repeatCount: DEFAULT_REPEAT_COUNT,
  repeatGap: DEFAULT_REPEAT_GAP,
  strokeWidth: DEFAULT_STROKE_WIDTH,
  fadeRows: DEFAULT_FADE_ROWS,
  initialTraceOpacity: DEFAULT_INITIAL_TRACE_OPACITY,
  showBaselineGuide: true,
  showXHeightGuide: true,
  showAscenderGuide: true,
  showDescenderGuide: true,
  guideStrokeWidth: DEFAULT_GUIDE_STROKE_WIDTH,
  guideColor: DEFAULT_GUIDE_COLOR,
  traceColor: DEFAULT_TRACE_COLOR,
  keepInitialLeadIn: true,
  keepFinalLeadOut: true,
  includeNameDate: false
});

const cloneVisibility = (
  visibility: FormationAnnotationVisibility
): FormationAnnotationVisibility => ({
  "directional-dash": visibility["directional-dash"],
  "turning-point": visibility["turning-point"],
  "start-arrow": visibility["start-arrow"],
  "draw-order-number": visibility["draw-order-number"],
  "midpoint-arrow": visibility["midpoint-arrow"]
});

const createTopAnnotationSettings = (): TopAnnotationSettings => ({
  directionalDashSpacing: DEFAULT_DIRECTIONAL_DASH_SPACING,
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
  alwaysOffsetArrowLanes: false,
  visibility: cloneVisibility(DEFAULT_FORMATION_ANNOTATION_VISIBILITY),
  arrowColor: DEFAULT_ARROW_COLOR,
  strokeColor: DEFAULT_TOP_STROKE_COLOR
});

const applyTopAnnotationSettingsPatch = (
  settings: TopAnnotationSettings,
  patch: TopAnnotationSettingsPatch
): TopAnnotationSettings => ({
  ...settings,
  ...patch,
  visibility: patch.visibility
    ? {
        ...settings.visibility,
        ...patch.visibility
      }
    : settings.visibility
});

const TOP_ANNOTATION_SETTINGS = applyTopAnnotationSettingsPatch(
  createTopAnnotationSettings(),
  {
    directionalDashSpacing: 152,
    midpointDensity: DEFAULT_MIDPOINT_DENSITY,
    turnRadius: 48,
    uTurnLength: 52,
    arrowLength: 149,
    arrowHeadSize: DEFAULT_ARROW_HEAD_SIZE,
    arrowStrokeWidth: 5.5,
    numberSize: 64,
    numberPathOffset: -77,
    offsetArrowLanes: false,
    visibility: {
      "directional-dash": true,
      "turning-point": false,
      "start-arrow": false,
      "draw-order-number": true,
      "midpoint-arrow": false
    }
  }
);

const DEFAULT_STATE = createDefaultState();
let state = createDefaultState();
let isPreviewZoomManual = false;

app.innerHTML = `
  <div class="worksheet-app">
    <aside class="worksheet-app__controls" aria-label="Worksheet controls">
      <div class="worksheet-app__controls-inner">
        <div class="worksheet-app__heading">
          <h1 class="worksheet-app__title">Fading handwriting practice</h1>
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

        ${renderStyleSelect()}

        <div class="worksheet-app__standalone-spacing-controls" id="standalone-spacing-controls" hidden>
          ${renderRangeControl({
  id: "letter-spacing-slider",
  label: "Letter spacing",
  value: DEFAULT_LETTER_SPACING,
  min: -40,
  max: 280,
  step: 10,
  valueId: "letter-spacing-value"
})}
          ${renderRangeControl({
  id: "word-spacing-slider",
  label: "Space width",
  value: DEFAULT_WORD_SPACING,
  min: 180,
  max: 960,
  step: 20,
  valueId: "word-spacing-value"
})}
        </div>

        ${renderRangeControl({
  id: "row-height-slider",
  label: "Line height",
  value: DEFAULT_ROW_HEIGHT_MM,
  min: 8,
  max: 24,
  step: 1,
  valueId: "row-height-value"
})}

        ${renderRangeControl({
  id: "row-gap-slider",
  label: "Line spacing",
  value: DEFAULT_ROW_GAP_MM,
  min: 0,
  max: 12,
  step: 1,
  valueId: "row-gap-value"
})}

        ${renderRangeControl({
  id: "repeat-count-slider",
  label: "Words per line",
  value: DEFAULT_REPEAT_COUNT,
  min: 1,
  max: 8,
  step: 1,
  valueId: "repeat-count-value"
})}

        ${renderRangeControl({
  id: "repeat-gap-slider",
  label: "Word spacing",
  value: DEFAULT_REPEAT_GAP,
  min: 0,
  max: 420,
  step: 10,
  valueId: "repeat-gap-value"
})}

        ${renderRangeControl({
  id: "fade-rows-slider",
  label: "Fading trace rows",
  value: DEFAULT_FADE_ROWS,
  min: 2,
  max: 20,
  step: 1,
  valueId: "fade-rows-value"
})}

        ${renderRangeControl({
  id: "initial-trace-opacity-slider",
  label: "Initial trace darkness",
  value: DEFAULT_INITIAL_TRACE_OPACITY,
  min: 1,
  max: 100,
  step: 1,
  valueId: "initial-trace-opacity-value"
})}

        ${renderRangeControl({
  id: "stroke-width-slider",
  label: "Stroke thickness",
  value: DEFAULT_STROKE_WIDTH,
  min: 20,
  max: 90,
  step: 2,
  valueId: "stroke-width-value"
})}

        <fieldset class="worksheet-app__checks" aria-label="Worksheet options">
          ${renderGlobalToggle("include-initial-lead-in", "keepInitialLeadIn", "Initial lead-in", true)}
          ${renderGlobalToggle("include-final-lead-out", "keepFinalLeadOut", "Final lead-out", true)}
          ${renderGlobalToggle("include-name-date", "includeNameDate", "Include name/date", false)}
        </fieldset>

        <details class="worksheet-app__details">
          <summary>Lined paper settings</summary>
          <div class="worksheet-app__details-body">
            ${renderRangeControl({
  id: "guide-stroke-width-slider",
  label: "Line thickness",
  value: DEFAULT_GUIDE_STROKE_WIDTH,
  min: 0.4,
  max: 3,
  step: 0.1,
  valueId: "guide-stroke-width-value",
  attrs: 'data-global-setting="guideStrokeWidth"'
})}
            ${renderGlobalColorControl("guide-color-picker", "guideColor", "Line colour", DEFAULT_GUIDE_COLOR)}
            ${renderGlobalColorControl("trace-color-picker", "traceColor", "Trace colour", DEFAULT_TRACE_COLOR)}
            <fieldset class="worksheet-app__checks" aria-label="Lined paper visibility">
              ${renderGlobalToggle("show-baseline-guide", "showBaselineGuide", "Baseline", true)}
              ${renderGlobalToggle("show-descender-guide", "showDescenderGuide", "Descender", true)}
              ${renderGlobalToggle("show-x-height-guide", "showXHeightGuide", "X-height", true)}
              ${renderGlobalToggle("show-ascender-guide", "showAscenderGuide", "Ascender", true)}
            </fieldset>
          </div>
        </details>

        <div class="worksheet-app__button-row worksheet-app__button-row--single">
          <button class="worksheet-app__button" id="print-worksheet-button" type="button">
            Print worksheet
          </button>
        </div>
        <p class="worksheet-app__status" id="worksheet-status" role="status" aria-live="polite"></p>
      </div>
    </aside>

    <main class="worksheet-app__preview" aria-label="Worksheet preview">
      <div class="worksheet-app__preview-toolbar" aria-label="Preview zoom controls">
        <button class="worksheet-app__zoom-button" id="preview-zoom-out-button" type="button" aria-label="Zoom out">&minus;</button>
        <output class="worksheet-app__zoom-value" id="preview-zoom-value" aria-live="polite">${DEFAULT_PREVIEW_ZOOM}%</output>
        <button class="worksheet-app__zoom-button" id="preview-zoom-in-button" type="button" aria-label="Zoom in">+</button>
        <span class="worksheet-app__gesture-hint">Scroll to pan · pinch or Ctrl + scroll to zoom</span>
      </div>
      <div
        class="worksheet-app__preview-viewport"
        id="worksheet-preview-viewport"
        tabindex="0"
        aria-label="Worksheet canvas. Scroll or drag to pan. Pinch or Control plus scroll to zoom."
      >
        <div class="worksheet-app__page-frame" id="worksheet-page-frame">
          <section class="worksheet-page worksheet-page--handwriting-practice" id="worksheet-page" aria-label="Printable worksheet"></section>
        </div>
      </div>
    </main>
  </div>
`;

const textInput = document.querySelector<HTMLInputElement>("#worksheet-text-input");
const styleSelect = document.querySelector<HTMLSelectElement>("#worksheet-style-select");
const standaloneSpacingControls = document.querySelector<HTMLElement>("#standalone-spacing-controls");
const previewZoomInButton = document.querySelector<HTMLButtonElement>("#preview-zoom-in-button");
const previewZoomOutButton = document.querySelector<HTMLButtonElement>("#preview-zoom-out-button");
const worksheetPreviewViewport = document.querySelector<HTMLElement>("#worksheet-preview-viewport");
const rowHeightSlider = document.querySelector<HTMLInputElement>("#row-height-slider");
const rowGapSlider = document.querySelector<HTMLInputElement>("#row-gap-slider");
const letterSpacingSlider = document.querySelector<HTMLInputElement>("#letter-spacing-slider");
const wordSpacingSlider = document.querySelector<HTMLInputElement>("#word-spacing-slider");
const repeatCountSlider = document.querySelector<HTMLInputElement>("#repeat-count-slider");
const repeatGapSlider = document.querySelector<HTMLInputElement>("#repeat-gap-slider");
const fadeRowsSlider = document.querySelector<HTMLInputElement>("#fade-rows-slider");
const initialTraceOpacitySlider = document.querySelector<HTMLInputElement>(
  "#initial-trace-opacity-slider"
);
const strokeWidthSlider = document.querySelector<HTMLInputElement>("#stroke-width-slider");
const printButton = document.querySelector<HTMLButtonElement>("#print-worksheet-button");
const worksheetPageFrame = document.querySelector<HTMLElement>("#worksheet-page-frame");
const worksheetPage = document.querySelector<HTMLElement>("#worksheet-page");
const statusEl = document.querySelector<HTMLParagraphElement>("#worksheet-status");

if (
  !textInput ||
  !styleSelect ||
  !standaloneSpacingControls ||
  !previewZoomInButton ||
  !previewZoomOutButton ||
  !worksheetPreviewViewport ||
  !rowHeightSlider ||
  !rowGapSlider ||
  !letterSpacingSlider ||
  !wordSpacingSlider ||
  !repeatCountSlider ||
  !repeatGapSlider ||
  !fadeRowsSlider ||
  !initialTraceOpacitySlider ||
  !strokeWidthSlider ||
  !printButton ||
  !worksheetPageFrame ||
  !worksheetPage ||
  !statusEl
) {
  throw new Error("Missing elements for fading handwriting practice.");
}

const globalSettingInputs = Array.from(
  document.querySelectorAll<HTMLInputElement>("[data-global-setting]")
);

function renderStyleSelect(): string {
  return `
    <label class="worksheet-app__field" for="worksheet-style-select">
      <span>Style</span>
      <select class="worksheet-app__select" id="worksheet-style-select">
        <option value="cursive" selected>Full cursive</option>
        <option value="pre-cursive">Pre-cursive</option>
        <option value="print">Print</option>
      </select>
    </label>
  `;
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

function renderGlobalToggle(
  id: string,
  setting: keyof Pick<
    WorksheetState,
    | "keepInitialLeadIn"
    | "keepFinalLeadOut"
    | "includeNameDate"
    | "showBaselineGuide"
    | "showXHeightGuide"
    | "showAscenderGuide"
    | "showDescenderGuide"
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

function renderGlobalColorControl(
  id: string,
  setting: "guideColor" | "traceColor",
  label: string,
  value: string
): string {
  return `
    <label class="worksheet-app__field worksheet-app__field--inline" for="${id}">
      <span>${label}</span>
      <input
        class="worksheet-app__color"
        id="${id}"
        type="color"
        value="${value}"
        data-global-setting="${setting}"
      />
    </label>
  `;
}

const normalizeText = (value: string): string => value.trim().replace(/\s+/g, " ");

const normalizeStyle = (value: string): PracticeStyle | null =>
  value === "cursive" || value === "pre-cursive" || value === "print" ? value : null;

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const normalizeColor = (value: string): string | null =>
  /^#[0-9a-fA-F]{6}$/.test(value) ? value.toLowerCase() : null;

const getSliderValuePrecision = (input: HTMLInputElement): number => {
  if (input.step === "any" || input.step.length === 0) {
    return 0;
  }

  const [, fractional = ""] = input.step.split(".");
  return fractional.length;
};

const normalizeSliderValue = (input: HTMLInputElement, value: number): number => {
  const min = input.min === "" ? Number.NEGATIVE_INFINITY : Number(input.min);
  const max = input.max === "" ? Number.POSITIVE_INFINITY : Number(input.max);
  const step = input.step === "" || input.step === "any" ? Number.NaN : Number(input.step);
  const base = Number.isFinite(min) ? min : 0;
  let nextValue = value;

  if (Number.isFinite(min)) {
    nextValue = Math.max(min, nextValue);
  }
  if (Number.isFinite(max)) {
    nextValue = Math.min(max, nextValue);
  }
  if (Number.isFinite(step) && step > 0) {
    nextValue = base + Math.round((nextValue - base) / step) * step;
  }
  if (Number.isFinite(min)) {
    nextValue = Math.max(min, nextValue);
  }
  if (Number.isFinite(max)) {
    nextValue = Math.min(max, nextValue);
  }

  return Number(nextValue.toFixed(getSliderValuePrecision(input)));
};

const syncSliderValue = (input: HTMLInputElement, value: number): number => {
  const normalizedValue = normalizeSliderValue(input, value);
  input.value = normalizedValue.toFixed(getSliderValuePrecision(input));
  return normalizedValue;
};

const normalizePreviewZoom = (value: number): number => {
  const clampedValue = Math.min(MAX_PREVIEW_ZOOM, Math.max(MIN_PREVIEW_ZOOM, value));
  return Math.round(clampedValue / PREVIEW_ZOOM_STEP) * PREVIEW_ZOOM_STEP;
};

const parseBooleanSearchParam = (params: URLSearchParams, key: string): boolean | null => {
  const rawValue = params.get(key);
  if (rawValue === null) {
    return null;
  }

  const normalizedValue = rawValue.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalizedValue)) {
    return true;
  }
  if (["0", "false", "no", "off"].includes(normalizedValue)) {
    return false;
  }

  return null;
};

const parseSliderSearchParam = (
  params: URLSearchParams,
  key: string,
  input: HTMLInputElement
): number | null => {
  const rawValue = params.get(key);
  if (rawValue === null) {
    return null;
  }

  const parsedValue = Number(rawValue);
  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  return normalizeSliderValue(input, parsedValue);
};

const parsePreviewZoomSearchParam = (params: URLSearchParams): number | null => {
  const rawValue = params.get("previewZoom");
  if (rawValue === null) {
    return null;
  }

  const parsedValue = Number(rawValue);
  return Number.isFinite(parsedValue) ? normalizePreviewZoom(parsedValue) : null;
};

const parseColorSearchParam = (params: URLSearchParams, key: string): string | null =>
  normalizeColor(params.get(key) ?? "");

const syncSettingsUrl = () => {
  const url = new URL(window.location.href);
  WORKSHEET_URL_PARAM_KEYS.forEach((key) => {
    url.searchParams.delete(key);
  });

  if (state.text !== DEFAULT_STATE.text) {
    url.searchParams.set("text", state.text);
  }
  if (state.style !== DEFAULT_STATE.style) {
    url.searchParams.set("style", state.style);
  }
  if (state.rowHeightMm !== DEFAULT_STATE.rowHeightMm) {
    url.searchParams.set("rowHeight", String(state.rowHeightMm));
  }
  if (state.rowGapMm !== DEFAULT_STATE.rowGapMm) {
    url.searchParams.set("rowGap", String(state.rowGapMm));
  }
  if (state.letterSpacing !== DEFAULT_STATE.letterSpacing) {
    url.searchParams.set("letterSpacing", String(state.letterSpacing));
  }
  if (state.wordSpacing !== DEFAULT_STATE.wordSpacing) {
    url.searchParams.set("wordSpacing", String(state.wordSpacing));
  }
  if (state.repeatCount !== DEFAULT_STATE.repeatCount) {
    url.searchParams.set("repeatCount", String(state.repeatCount));
  }
  if (state.repeatGap !== DEFAULT_STATE.repeatGap) {
    url.searchParams.set("repeatGap", String(state.repeatGap));
  }
  if (state.strokeWidth !== DEFAULT_STATE.strokeWidth) {
    url.searchParams.set("strokeWidth", String(state.strokeWidth));
  }
  if (state.fadeRows !== DEFAULT_STATE.fadeRows) {
    url.searchParams.set("fadeRows", String(state.fadeRows));
  }
  if (state.initialTraceOpacity !== DEFAULT_STATE.initialTraceOpacity) {
    url.searchParams.set("initialTraceOpacity", String(state.initialTraceOpacity));
  }
  if (state.showBaselineGuide !== DEFAULT_STATE.showBaselineGuide) {
    url.searchParams.set("showBaselineGuide", state.showBaselineGuide ? "1" : "0");
  }
  if (state.showXHeightGuide !== DEFAULT_STATE.showXHeightGuide) {
    url.searchParams.set("showXHeightGuide", state.showXHeightGuide ? "1" : "0");
  }
  if (state.showAscenderGuide !== DEFAULT_STATE.showAscenderGuide) {
    url.searchParams.set("showAscenderGuide", state.showAscenderGuide ? "1" : "0");
  }
  if (state.showDescenderGuide !== DEFAULT_STATE.showDescenderGuide) {
    url.searchParams.set("showDescenderGuide", state.showDescenderGuide ? "1" : "0");
  }
  if (state.guideStrokeWidth !== DEFAULT_STATE.guideStrokeWidth) {
    url.searchParams.set("guideStrokeWidth", String(state.guideStrokeWidth));
  }
  if (state.guideColor !== DEFAULT_STATE.guideColor) {
    url.searchParams.set("guideColor", state.guideColor);
  }
  if (state.traceColor !== DEFAULT_STATE.traceColor) {
    url.searchParams.set("traceColor", state.traceColor);
  }
  if (state.keepInitialLeadIn !== DEFAULT_STATE.keepInitialLeadIn) {
    url.searchParams.set("keepInitialLeadIn", state.keepInitialLeadIn ? "1" : "0");
  }
  if (state.keepFinalLeadOut !== DEFAULT_STATE.keepFinalLeadOut) {
    url.searchParams.set("keepFinalLeadOut", state.keepFinalLeadOut ? "1" : "0");
  }
  if (state.includeNameDate !== DEFAULT_STATE.includeNameDate) {
    url.searchParams.set("includeNameDate", state.includeNameDate ? "1" : "0");
  }

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (nextUrl !== currentUrl) {
    window.history.replaceState(null, "", nextUrl);
  }
};

const setText = (id: string, value: string) => {
  const element = document.querySelector<HTMLElement>(`#${id}`);
  if (element) {
    element.textContent = value;
  }
};

const syncLabels = () => {
  setText("preview-zoom-value", `${state.previewZoom}%`);
  setText("row-height-value", `${state.rowHeightMm} mm`);
  setText("row-gap-value", `${state.rowGapMm} mm`);
  setText("letter-spacing-value", `${state.letterSpacing > 0 ? "+" : ""}${state.letterSpacing}px`);
  setText("word-spacing-value", `${state.wordSpacing}px`);
  setText("repeat-count-value", `${state.repeatCount}`);
  setText("repeat-gap-value", `${state.repeatGap}px`);
  setText("fade-rows-value", `${state.fadeRows}`);
  setText("initial-trace-opacity-value", `${state.initialTraceOpacity}%`);
  setText("stroke-width-value", `${state.strokeWidth}px`);
  setText("guide-stroke-width-value", `${state.guideStrokeWidth.toFixed(1)}px`);
};

const syncSettingsControlsFromState = () => {
  textInput.value = state.text;
  styleSelect.value = state.style;
  state.previewZoom = normalizePreviewZoom(state.previewZoom);
  state.rowHeightMm = syncSliderValue(rowHeightSlider, state.rowHeightMm);
  state.rowGapMm = syncSliderValue(rowGapSlider, state.rowGapMm);
  state.letterSpacing = syncSliderValue(letterSpacingSlider, state.letterSpacing);
  state.wordSpacing = syncSliderValue(wordSpacingSlider, state.wordSpacing);
  state.repeatCount = syncSliderValue(repeatCountSlider, state.repeatCount);
  state.repeatGap = syncSliderValue(repeatGapSlider, state.repeatGap);
  state.fadeRows = syncSliderValue(fadeRowsSlider, state.fadeRows);
  state.initialTraceOpacity = syncSliderValue(
    initialTraceOpacitySlider,
    state.initialTraceOpacity
  );
  state.strokeWidth = syncSliderValue(strokeWidthSlider, state.strokeWidth);

  globalSettingInputs.forEach((input) => {
    const setting = input.dataset.globalSetting;
    if (setting === "guideStrokeWidth") {
      state.guideStrokeWidth = syncSliderValue(input, state.guideStrokeWidth);
    } else if (setting === "guideColor") {
      input.value = state.guideColor;
    } else if (setting === "traceColor") {
      input.value = state.traceColor;
    } else if (setting === "keepInitialLeadIn") {
      input.checked = state.keepInitialLeadIn;
    } else if (setting === "keepFinalLeadOut") {
      input.checked = state.keepFinalLeadOut;
    } else if (setting === "includeNameDate") {
      input.checked = state.includeNameDate;
    } else if (setting === "showBaselineGuide") {
      input.checked = state.showBaselineGuide;
    } else if (setting === "showXHeightGuide") {
      input.checked = state.showXHeightGuide;
    } else if (setting === "showAscenderGuide") {
      input.checked = state.showAscenderGuide;
    } else if (setting === "showDescenderGuide") {
      input.checked = state.showDescenderGuide;
    }
  });

  applyPreviewZoom();
  syncLabels();
};

const applyUrlSettings = () => {
  const params = new URLSearchParams(window.location.search);
  state = createDefaultState();

  const textParam = params.get("text") ?? params.get("word");
  if (textParam !== null) {
    state.text = normalizeText(textParam);
  }

  const styleParam = params.get("style");
  if (styleParam !== null) {
    state.style = normalizeStyle(styleParam) ?? state.style;
  }

  const previewZoomParam = parsePreviewZoomSearchParam(params);
  if (previewZoomParam !== null) {
    state.previewZoom = previewZoomParam;
    isPreviewZoomManual = true;
  } else {
    isPreviewZoomManual = false;
  }

  state.rowHeightMm = parseSliderSearchParam(params, "rowHeight", rowHeightSlider) ?? state.rowHeightMm;
  state.rowGapMm = parseSliderSearchParam(params, "rowGap", rowGapSlider) ?? state.rowGapMm;
  state.letterSpacing =
    parseSliderSearchParam(params, "letterSpacing", letterSpacingSlider) ?? state.letterSpacing;
  state.wordSpacing =
    parseSliderSearchParam(params, "wordSpacing", wordSpacingSlider) ?? state.wordSpacing;
  state.repeatCount =
    parseSliderSearchParam(params, "repeatCount", repeatCountSlider) ?? state.repeatCount;
  state.repeatGap =
    parseSliderSearchParam(params, "repeatGap", repeatGapSlider) ?? state.repeatGap;
  state.strokeWidth =
    parseSliderSearchParam(params, "strokeWidth", strokeWidthSlider) ?? state.strokeWidth;
  state.fadeRows = parseSliderSearchParam(params, "fadeRows", fadeRowsSlider) ?? state.fadeRows;
  state.initialTraceOpacity =
    parseSliderSearchParam(params, "initialTraceOpacity", initialTraceOpacitySlider) ??
    state.initialTraceOpacity;

  globalSettingInputs.forEach((input) => {
    const setting = input.dataset.globalSetting;
    if (setting === "guideStrokeWidth") {
      state.guideStrokeWidth =
        parseSliderSearchParam(params, setting, input) ?? state.guideStrokeWidth;
    } else if (setting === "guideColor") {
      state.guideColor = parseColorSearchParam(params, setting) ?? state.guideColor;
    } else if (setting === "traceColor") {
      state.traceColor = parseColorSearchParam(params, setting) ?? state.traceColor;
    } else if (setting === "keepInitialLeadIn") {
      state.keepInitialLeadIn =
        parseBooleanSearchParam(params, setting) ?? state.keepInitialLeadIn;
    } else if (setting === "keepFinalLeadOut") {
      state.keepFinalLeadOut =
        parseBooleanSearchParam(params, setting) ?? state.keepFinalLeadOut;
    } else if (setting === "includeNameDate") {
      state.includeNameDate = parseBooleanSearchParam(params, setting) ?? state.includeNameDate;
    } else if (setting === "showBaselineGuide") {
      state.showBaselineGuide =
        parseBooleanSearchParam(params, setting) ?? state.showBaselineGuide;
    } else if (setting === "showXHeightGuide") {
      state.showXHeightGuide =
        parseBooleanSearchParam(params, setting) ?? state.showXHeightGuide;
    } else if (setting === "showAscenderGuide") {
      state.showAscenderGuide =
        parseBooleanSearchParam(params, setting) ?? state.showAscenderGuide;
    } else if (setting === "showDescenderGuide") {
      state.showDescenderGuide =
        parseBooleanSearchParam(params, setting) ?? state.showDescenderGuide;
    }
  });

  syncSettingsControlsFromState();
};

const applyPreviewZoom = () => {
  worksheetPageFrame.style.setProperty("--worksheet-preview-scale", `${state.previewZoom / 100}`);
};

const setPreviewZoom = (value: number, options: { manual?: boolean; syncUrl?: boolean } = {}) => {
  state.previewZoom = normalizePreviewZoom(value);
  if (options.manual) {
    isPreviewZoomManual = true;
  }
  applyPreviewZoom();
  syncLabels();
  if (options.syncUrl ?? true) {
    syncSettingsUrl();
  }
};

const fitPreviewZoomToWidth = () => {
  if (isPreviewZoomManual) {
    return;
  }

  const previewStyles = window.getComputedStyle(worksheetPageFrame.parentElement ?? worksheetPageFrame);
  const horizontalPadding =
    Number.parseFloat(previewStyles.paddingLeft) + Number.parseFloat(previewStyles.paddingRight);
  const availableWidth =
    worksheetPageFrame.parentElement?.clientWidth ?? worksheetPageFrame.clientWidth;
  const previewWidth = Math.max(0, availableWidth - horizontalPadding - PREVIEW_FIT_PADDING_PX);
  const pageWidth = worksheetPage.offsetWidth;
  if (pageWidth <= 0 || previewWidth <= 0) {
    return;
  }

  const fittedZoom =
    Math.floor(((previewWidth / pageWidth) * 100) / PREVIEW_ZOOM_STEP) * PREVIEW_ZOOM_STEP;
  setPreviewZoom(fittedZoom, { syncUrl: false });
};

const getGuideLineY = (
  layout: ShiftedWordLayout,
  kind: "baseline" | "xHeight" | "ascender" | "descender"
): number => {
  const guides = layout.path.guides;
  const halfStrokeWidth = state.strokeWidth / 2;
  const guideHeight = Math.abs(guides.baseline - guides.xHeight);

  if (kind === "baseline") {
    return guides.baseline + layout.offsetY + halfStrokeWidth;
  }
  if (kind === "xHeight") {
    return guides.xHeight + layout.offsetY - halfStrokeWidth;
  }
  if (kind === "ascender") {
    const ascenderGuide = guides.ascender ?? guides.xHeight - guideHeight * ASCENDER_GUIDE_RATIO;
    return ascenderGuide + layout.offsetY - halfStrokeWidth;
  }

  const descenderGuide = guides.descender ?? guides.baseline + guideHeight * DESCENDER_GUIDE_RATIO;
  return descenderGuide + layout.offsetY + halfStrokeWidth;
};

const renderGuideLine = (
  layout: ShiftedWordLayout,
  width: number,
  kind: "baseline" | "xHeight" | "ascender" | "descender"
): string => {
  const enabled = {
    baseline: state.showBaselineGuide,
    xHeight: state.showXHeightGuide,
    ascender: state.showAscenderGuide,
    descender: state.showDescenderGuide
  }[kind];

  if (!enabled) {
    return "";
  }

  return `
    <line
      class="worksheet-word__guide worksheet-word__guide--${kind}"
      x1="0"
      y1="${getGuideLineY(layout, kind)}"
      x2="${width}"
      y2="${getGuideLineY(layout, kind)}"
    ></line>
  `;
};

const renderGuideLines = (layout: ShiftedWordLayout, width: number): string => `
  ${renderGuideLine(layout, width, "ascender")}
  ${renderGuideLine(layout, width, "xHeight")}
  ${renderGuideLine(layout, width, "baseline")}
  ${renderGuideLine(layout, width, "descender")}
`;

const renderWordContent = (layout: ShiftedWordLayout): string =>
  layout.path.strokes
    .filter((stroke) => stroke.type !== "lift")
    .map((stroke) => `<path class="worksheet-word__stroke" d="${buildPathD(stroke.curves)}"></path>`)
    .join("");

const renderAnnotatedTopWordContent = (
  layout: ShiftedWordLayout,
  preparedPath: PreparedTracingPath
): string => `
  ${renderWordContent(layout)}
  ${buildFormationAnnotationMarkup(layout.path, preparedPath, TOP_ANNOTATION_SETTINGS)}
`;

const getPracticeAdvance = (layout: ShiftedWordLayout): number => {
  const contentWidth = layout.path.bounds.maxX - layout.path.bounds.minX;
  const leadingPadding = layout.path.bounds.minX;
  return contentWidth + leadingPadding + state.repeatGap;
};

const renderWordSvg = (
  layout: ShiftedWordLayout,
  className: string,
  ariaLabel: string,
  opacity: number,
  preserveAspectRatio = "xMidYMid meet",
  repeatCount = 1,
  symbolId = "practice-word"
): string => {
  const advance = getPracticeAdvance(layout);
  const width = layout.width + advance * (repeatCount - 1);
  const wordContent = renderWordContent(layout);
  const repeatedWords =
    repeatCount <= 1
      ? wordContent
      : `
        <defs>
          <g id="${symbolId}">
            ${wordContent}
          </g>
        </defs>
        ${Array.from({ length: repeatCount }, (_, repeatIndex) => {
    const x = repeatIndex * advance;
    return `<use href="#${symbolId}" x="${x}" y="0"></use>`;
  }).join("")}
      `;

  return `
    <svg
      class="${className}"
      viewBox="0 0 ${width} ${layout.height}"
      preserveAspectRatio="${preserveAspectRatio}"
      role="img"
      aria-label="${escapeHtml(ariaLabel)}"
      style="--worksheet-word-stroke: #000000; --worksheet-word-stroke-width: ${state.strokeWidth}; --worksheet-word-stroke-opacity: ${opacity}; --worksheet-guide-color: ${state.guideColor}; --worksheet-guide-stroke-width: ${state.guideStrokeWidth};"
    >
      ${renderGuideLines(layout, width)}
      ${opacity > 0 ? repeatedWords : ""}
    </svg>
  `;
};

const renderTopWordSvg = (layout: ShiftedWordLayout): string => {
  const shouldAnnotateTopWord = state.style === "cursive";
  const preparedPath = shouldAnnotateTopWord ? compileTracingPath(layout.path) : null;
  const wordContent = preparedPath
    ? renderAnnotatedTopWordContent(layout, preparedPath)
    : renderWordContent(layout);
  const strokeColor = preparedPath ? TOP_ANNOTATION_SETTINGS.strokeColor : state.traceColor;
  const arrowColor = preparedPath ? TOP_ANNOTATION_SETTINGS.arrowColor : DEFAULT_ARROW_COLOR;
  const arrowStrokeWidth = preparedPath
    ? TOP_ANNOTATION_SETTINGS.arrowStrokeWidth
    : DEFAULT_ARROW_STROKE_WIDTH;

  return `
    <svg
      class="worksheet-word worksheet-word--top"
      viewBox="0 0 ${layout.width} ${layout.height}"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="${escapeHtml(`${state.text} handwriting example${preparedPath ? " with formation annotations" : ""}`)}"
      style="--formation-arrow-color: ${arrowColor}; --formation-arrow-stroke-width: ${arrowStrokeWidth}; --worksheet-word-stroke: ${strokeColor}; --worksheet-word-stroke-width: ${state.strokeWidth}; --worksheet-word-stroke-opacity: 1; --worksheet-guide-color: ${state.guideColor}; --worksheet-guide-stroke-width: ${state.guideStrokeWidth};"
    >
      ${renderGuideLines(layout, layout.width)}
      ${wordContent}
    </svg>
  `;
};

const getPracticeRowCount = (): number =>
  Math.max(
    1,
    Math.floor(
      (PRACTICE_AREA_HEIGHT_MM + state.rowGapMm) / (state.rowHeightMm + state.rowGapMm)
    )
  );

const getRowOpacity = (rowIndex: number): number => {
  if (rowIndex >= state.fadeRows) {
    return 0;
  }

  const progress = state.fadeRows <= 1 ? 1 : rowIndex / (state.fadeRows - 1);
  const opacity = Math.max(0, (state.initialTraceOpacity / 100) * (1 - progress));
  return Number(opacity.toFixed(3));
};

const syncStandaloneSpacingControls = () => {
  standaloneSpacingControls.hidden = state.style === "cursive";
};

const renderWorksheet = () => {
  state = {
    ...state,
    text: normalizeText(textInput.value),
    style: normalizeStyle(styleSelect.value) ?? state.style,
    rowHeightMm: Number(rowHeightSlider.value),
    rowGapMm: Number(rowGapSlider.value),
    letterSpacing: Number(letterSpacingSlider.value),
    wordSpacing: Number(wordSpacingSlider.value),
    repeatCount: Number(repeatCountSlider.value),
    repeatGap: Number(repeatGapSlider.value),
    fadeRows: Number(fadeRowsSlider.value),
    initialTraceOpacity: Number(initialTraceOpacitySlider.value),
    strokeWidth: Number(strokeWidthSlider.value)
  };
  syncStandaloneSpacingControls();
  syncLabels();
  syncSettingsUrl();

  if (state.text.length === 0) {
    worksheetPage.innerHTML = `
      <div class="worksheet-page__empty">Enter a word or words.</div>
    `;
    statusEl.textContent = "";
    return;
  }

  let layout: ShiftedWordLayout;
  try {
    layout = buildShiftedHandwritingLayout(state.text, {
      style: state.style,
      ...(state.style === "cursive"
        ? {}
        : {
            letterSpacing: state.letterSpacing,
            wordSpacing: state.wordSpacing
          }),
      keepInitialLeadIn: state.keepInitialLeadIn,
      keepFinalLeadOut: state.keepFinalLeadOut
    });
  } catch {
    worksheetPage.innerHTML = `
      <div class="worksheet-page__empty">Use supported letters and spaces.</div>
    `;
    statusEl.textContent = "This text could not be drawn.";
    return;
  }

  const practiceRowCount = getPracticeRowCount();
  const practiceRows = Array.from({ length: practiceRowCount }, (_, rowIndex) =>
    renderWordSvg(
      layout,
      "worksheet-word worksheet-word--practice",
      rowIndex < state.fadeRows
        ? `${state.text} fading trace row ${rowIndex + 1}, ${state.repeatCount} word${state.repeatCount === 1 ? "" : "s"}`
        : `${state.text} blank practice row ${rowIndex + 1}`,
      getRowOpacity(rowIndex),
      "xMidYMid meet",
      state.repeatCount,
      `practice-word-${rowIndex}`
    )
  ).join("");
  const nameDateHeader = state.includeNameDate
    ? `
    <header class="worksheet-page__header">
      <div class="worksheet-page__meta-line">
        <span>Name</span>
        <span>Date</span>
      </div>
    </header>
  `
    : "";

  worksheetPage.style.setProperty("--practice-row-height", `${state.rowHeightMm}mm`);
  worksheetPage.style.setProperty("--practice-row-gap", `${state.rowGapMm}mm`);
  worksheetPage.classList.toggle("worksheet-page--without-meta", !state.includeNameDate);
  worksheetPage.innerHTML = `
    ${nameDateHeader}
    <section class="worksheet-page__example" aria-label="Top example">
      ${renderTopWordSvg(layout)}
    </section>
    <section class="worksheet-page__practice" aria-label="Fading handwriting practice lines">
      ${practiceRows}
    </section>
  `;
  statusEl.textContent = `${practiceRowCount} practice lines, fading across ${Math.min(
    state.fadeRows,
    practiceRowCount
  )}, ${state.repeatCount} word${state.repeatCount === 1 ? "" : "s"} per line`;
};

const previewPanZoom = setupWorksheetPreviewPanZoom({
  viewport: worksheetPreviewViewport,
  frame: worksheetPageFrame,
  getZoom: () => state.previewZoom,
  setZoom: (zoom) => setPreviewZoom(zoom, { manual: true }),
  minZoom: MIN_PREVIEW_ZOOM,
  maxZoom: MAX_PREVIEW_ZOOM,
  zoomStep: PREVIEW_ZOOM_STEP
});

textInput.addEventListener("input", renderWorksheet);
styleSelect.addEventListener("change", renderWorksheet);
previewZoomOutButton.addEventListener("click", () => {
  previewPanZoom.zoomBy(-PREVIEW_ZOOM_STEP);
});
previewZoomInButton.addEventListener("click", () => {
  previewPanZoom.zoomBy(PREVIEW_ZOOM_STEP);
});
rowHeightSlider.addEventListener("input", renderWorksheet);
rowGapSlider.addEventListener("input", renderWorksheet);
letterSpacingSlider.addEventListener("input", renderWorksheet);
wordSpacingSlider.addEventListener("input", renderWorksheet);
repeatCountSlider.addEventListener("input", renderWorksheet);
repeatGapSlider.addEventListener("input", renderWorksheet);
fadeRowsSlider.addEventListener("input", renderWorksheet);
initialTraceOpacitySlider.addEventListener("input", renderWorksheet);
strokeWidthSlider.addEventListener("input", renderWorksheet);
printButton.addEventListener("click", () => {
  window.print();
});

globalSettingInputs.forEach((input) => {
  input.addEventListener("input", () => {
    const setting = input.dataset.globalSetting;
    if (setting === "guideStrokeWidth") {
      state.guideStrokeWidth = Number(input.value);
    } else if (setting === "guideColor") {
      const nextColor = normalizeColor(input.value);
      if (!nextColor) {
        return;
      }
      state.guideColor = nextColor;
    } else if (setting === "traceColor") {
      const nextColor = normalizeColor(input.value);
      if (!nextColor) {
        return;
      }
      state.traceColor = nextColor;
    } else if (setting === "keepInitialLeadIn") {
      state.keepInitialLeadIn = input.checked;
    } else if (setting === "keepFinalLeadOut") {
      state.keepFinalLeadOut = input.checked;
    } else if (setting === "includeNameDate") {
      state.includeNameDate = input.checked;
    } else if (setting === "showBaselineGuide") {
      state.showBaselineGuide = input.checked;
    } else if (setting === "showXHeightGuide") {
      state.showXHeightGuide = input.checked;
    } else if (setting === "showAscenderGuide") {
      state.showAscenderGuide = input.checked;
    } else if (setting === "showDescenderGuide") {
      state.showDescenderGuide = input.checked;
    }

    renderWorksheet();
  });
});

applyUrlSettings();
renderWorksheet();
fitPreviewZoomToWidth();

new ResizeObserver(() => {
  fitPreviewZoomToWidth();
}).observe(worksheetPageFrame.parentElement ?? worksheetPageFrame);
