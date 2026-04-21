import "./style.css";
import {
  AnimationPlayer,
  TracingSession,
  annotationCommandsToSvgPathData,
  compileFormationAnnotations,
  compileTracingPath,
  cursiveEntryVariantByExitVariant,
  cursiveExitVariantByLetter,
  defaultCursiveEntryVariant,
  getCursiveLetterVariant,
  type AnnotationArrowHead,
  type AnnotationPathCommand,
  type FormationAnnotation,
  type JoinSpacingOptions,
  type LetterGuides,
  type Point,
  type PreparedTracingPath,
  type TracingState,
  type WritingPath
} from "letterpaths";
import {
  DEMO_PAUSE_MS,
  DEFAULT_TRACE_TOLERANCE,
  JOIN_SPACING,
  MAX_TRACE_TOLERANCE,
  MIN_TRACE_TOLERANCE,
  TRACE_TOLERANCE_STEP,
  WORDS,
  buildPathD,
  buildShiftedWordLayout,
  chooseNextWordIndex,
  getPointerInSvg
} from "./shared";

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

const DEFAULT_STROKE_WIDTH = 54;
const DEFAULT_GRIDLINE_STROKE_WIDTH = 1;
const DEFAULT_GRIDLINE_COLOR = "#ffb35c";
const DEFAULT_WORD_STROKE_COLOR = "#c2c2c2";
const DEFAULT_DIRECTIONAL_DASH_SPACING = 96;
const DEFAULT_MIDPOINT_DENSITY = 320;
const DEFAULT_TURN_RADIUS = 13;
const DEFAULT_U_TURN_LENGTH = 53;
const DEFAULT_ARROW_LENGTH = 53;
const DEFAULT_ARROW_HEAD_SIZE = 26;
const DEFAULT_ARROW_STROKE_WIDTH = 5.6;
const DEFAULT_NUMBER_SIZE = 26;
const DEFAULT_NUMBER_PATH_OFFSET = 0;
const DEFAULT_NUMBER_COLOR = "#3f454b";
const DEFAULT_ARROW_COLOR = "#ffffff";
const DEFAULT_JOIN_SPACING = { ...JOIN_SPACING } as const satisfies Required<JoinSpacingOptions>;
const DEFAULT_ANNOTATION_VISIBILITY: Record<FormationAnnotation["kind"], boolean> = {
  "directional-dash": false,
  "turning-point": true,
  "start-arrow": true,
  "draw-order-number": true,
  "midpoint-arrow": true
};
const START_ARROW_LENGTH_RATIO = 0.42;
const STRAIGHT_ARROW_LENGTH_RATIO = 0.36 / START_ARROW_LENGTH_RATIO;
const START_ARROW_MIN_LENGTH_RATIO = 0.18 / START_ARROW_LENGTH_RATIO;
const ARROWHEAD_WIDTH_RATIO = 22 / 26;
const ARROWHEAD_TIP_OVERHANG_RATIO = 11 / 26;
const WRITING_APP_URL_PARAM_KEYS = [
  "word",
  "tolerance",
  "strokeWidth",
  "gridlineStrokeWidth",
  "gridlineColor",
  "showBaselineGuide",
  "showDescenderGuide",
  "showXHeightGuide",
  "showAscenderGuide",
  "targetBendRate",
  "minSidebearingGap",
  "bendSearchMinSidebearingGap",
  "bendSearchMaxSidebearingGap",
  "exitHandleScale",
  "entryHandleScale",
  "includeInitialLeadIn",
  "includeFinalLeadOut",
  "directionalDashSpacing",
  "midpointDensity",
  "turnRadius",
  "uTurnLength",
  "arrowLength",
  "arrowHeadSize",
  "arrowStrokeWidth",
  "numberSize",
  "numberOffset",
  "directionalDash",
  "turns",
  "starts",
  "numbers",
  "midpoints",
  "offsetArrowLanes",
  "alwaysOffsetArrowLanes",
  "wordStrokeColor",
  "numberColor",
  "arrowColor"
] as const;

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

function renderToggleControl(
  id: string,
  label: string,
  checked: boolean,
  attrs = ""
): string {
  return `
    <label class="worksheet-app__check" for="${id}">
      <input
        id="${id}"
        type="checkbox"
        ${checked ? "checked" : ""}
        ${attrs}
      />
      <span>${label}</span>
    </label>
  `;
}

function renderColorControl(
  id: string,
  label: string,
  value: string,
  attrs = ""
): string {
  return `
    <label class="worksheet-app__field worksheet-app__field--inline" for="${id}">
      <span>${label}</span>
      <input
        class="worksheet-app__color"
        id="${id}"
        type="color"
        value="${value}"
        ${attrs}
      />
    </label>
  `;
}

function renderOptionsGroup(label: string, body: string, open = false): string {
  return `
    <details class="worksheet-app__details" ${open ? "open" : ""}>
      <summary>${label}</summary>
      <div class="worksheet-app__details-body">
        ${body}
      </div>
    </details>
  `;
}

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app element for writing app.");
}

app.innerHTML = `
  <div class="writing-app">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar">
          <div class="writing-app__title">
            <label class="writing-app__word-input-label" for="word-input">
              <span>Enter word</span>
              <input
                class="writing-app__word-input"
                id="word-input"
                type="text"
                value="zephyr"
                placeholder="zephyr"
                spellcheck="false"
                autocomplete="off"
              />
            </label>
          </div>
          <div class="writing-app__topbar-actions">
            <button class="writing-app__button" id="show-me-button" type="button">
              Animate
            </button>
            <details class="writing-app__settings writing-app__settings--options" id="settings-menu">
              <summary class="writing-app__button writing-app__button--secondary writing-app__button--summary">
                Options
              </summary>
              <div class="writing-app__settings-panel writing-app__settings-panel--options">
                ${renderOptionsGroup(
  "Tracing settings",
  `
      ${renderRangeControl({
    id: "tolerance-slider",
    label: "Tolerance",
    value: DEFAULT_TRACE_TOLERANCE,
    min: MIN_TRACE_TOLERANCE,
    max: MAX_TRACE_TOLERANCE,
    step: TRACE_TOLERANCE_STEP,
    valueId: "tolerance-value"
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
    `,
  true
)}
                ${renderOptionsGroup(
  "Gridline settings",
  `
      ${renderRangeControl({
    id: "gridline-stroke-width-slider",
    label: "Gridline thickness",
    value: DEFAULT_GRIDLINE_STROKE_WIDTH,
    min: 0.5,
    max: 8,
    step: 0.5,
    valueId: "gridline-stroke-width-value"
  })}
      ${renderColorControl(
    "gridline-color-picker",
    "Gridline colour",
    DEFAULT_GRIDLINE_COLOR
  )}
      <fieldset class="worksheet-app__checks" aria-label="Gridline visibility">
        ${renderToggleControl("show-baseline-guide", "Baseline", true)}
        ${renderToggleControl("show-descender-guide", "Descender", false)}
        ${renderToggleControl("show-x-height-guide", "X-height", true)}
        ${renderToggleControl("show-ascender-guide", "Ascender", false)}
      </fieldset>
    `
)}
                ${renderOptionsGroup(
  "Advanced settings",
  `
      ${renderRangeControl({
    id: "target-bend-rate-slider",
    label: "Target maximum bend rate",
    value: DEFAULT_JOIN_SPACING.targetBendRate,
    min: 0,
    max: 60,
    step: 1,
    valueId: "target-bend-rate-value"
  })}
      ${renderRangeControl({
    id: "min-sidebearing-gap-slider",
    label: "Minimum sidebearing gap",
    value: DEFAULT_JOIN_SPACING.minSidebearingGap,
    min: -300,
    max: 200,
    step: 5,
    valueId: "min-sidebearing-gap-value"
  })}
      ${renderRangeControl({
    id: "bend-search-min-sidebearing-gap-slider",
    label: "Search minimum sidebearing gap",
    value: DEFAULT_JOIN_SPACING.bendSearchMinSidebearingGap,
    min: -300,
    max: 200,
    step: 5,
    valueId: "bend-search-min-sidebearing-gap-value"
  })}
      ${renderRangeControl({
    id: "bend-search-max-sidebearing-gap-slider",
    label: "Search maximum sidebearing gap",
    value: DEFAULT_JOIN_SPACING.bendSearchMaxSidebearingGap,
    min: -100,
    max: 300,
    step: 5,
    valueId: "bend-search-max-sidebearing-gap-value"
  })}
      ${renderRangeControl({
    id: "exit-handle-scale-slider",
    label: "p0-p1 handle scale",
    value: DEFAULT_JOIN_SPACING.exitHandleScale,
    min: 0,
    max: 2,
    step: 0.05,
    valueId: "exit-handle-scale-value"
  })}
      ${renderRangeControl({
    id: "entry-handle-scale-slider",
    label: "p2-p3 handle scale",
    value: DEFAULT_JOIN_SPACING.entryHandleScale,
    min: 0,
    max: 2,
    step: 0.05,
    valueId: "entry-handle-scale-value"
  })}
      <fieldset class="worksheet-app__checks" aria-label="Advanced writing settings">
        ${renderToggleControl("include-initial-lead-in", "Initial lead-in", true)}
        ${renderToggleControl("include-final-lead-out", "Final lead-out", true)}
      </fieldset>
    `
)}
                ${renderOptionsGroup(
  "Top word annotations",
  `
      ${renderRangeControl({
    id: "directional-dash-spacing-slider",
    label: "Directional dash spacing",
    value: DEFAULT_DIRECTIONAL_DASH_SPACING,
    min: 80,
    max: 220,
    step: 4,
    valueId: "directional-dash-spacing-value"
  })}
      ${renderRangeControl({
    id: "midpoint-density-slider",
    label: "Midpoint density",
    value: DEFAULT_MIDPOINT_DENSITY,
    min: 120,
    max: 600,
    step: 20,
    valueId: "midpoint-density-value"
  })}
      ${renderRangeControl({
    id: "turn-radius-slider",
    label: "Turn radius",
    value: DEFAULT_TURN_RADIUS,
    min: 0,
    max: 48,
    step: 1,
    valueId: "turn-radius-value"
  })}
      ${renderRangeControl({
    id: "u-turn-length-slider",
    label: "U-turn length",
    value: DEFAULT_U_TURN_LENGTH,
    min: 0,
    max: 300,
    step: 1,
    valueId: "u-turn-length-value"
  })}
      ${renderRangeControl({
    id: "arrow-length-slider",
    label: "Other arrow length",
    value: DEFAULT_ARROW_LENGTH,
    min: 0,
    max: 300,
    step: 1,
    valueId: "arrow-length-value"
  })}
      ${renderRangeControl({
    id: "arrow-head-size-slider",
    label: "Arrow head size",
    value: DEFAULT_ARROW_HEAD_SIZE,
    min: 0,
    max: 64,
    step: 1,
    valueId: "arrow-head-size-value"
  })}
      ${renderRangeControl({
    id: "arrow-stroke-width-slider",
    label: "Arrow stroke width",
    value: DEFAULT_ARROW_STROKE_WIDTH,
    min: 1,
    max: 14,
    step: 0.5,
    valueId: "arrow-stroke-width-value"
  })}
      ${renderRangeControl({
    id: "number-size-slider",
    label: "Number size",
    value: DEFAULT_NUMBER_SIZE,
    min: 8,
    max: 72,
    step: 1,
    valueId: "number-size-value"
  })}
      ${renderRangeControl({
    id: "number-offset-slider",
    label: "Number offset",
    value: DEFAULT_NUMBER_PATH_OFFSET,
    min: -80,
    max: 80,
    step: 1,
    valueId: "number-offset-value"
  })}
      <fieldset class="worksheet-app__checks" aria-label="Top word annotations">
        ${renderToggleControl(
    "annotation-directional-dash",
    "Directional dash",
    DEFAULT_ANNOTATION_VISIBILITY["directional-dash"],
    'data-annotation-kind="directional-dash"'
  )}
        ${renderToggleControl(
    "annotation-turning-point",
    "Turns",
    DEFAULT_ANNOTATION_VISIBILITY["turning-point"],
    'data-annotation-kind="turning-point"'
  )}
        ${renderToggleControl(
    "annotation-start-arrow",
    "Starts",
    DEFAULT_ANNOTATION_VISIBILITY["start-arrow"],
    'data-annotation-kind="start-arrow"'
  )}
        ${renderToggleControl(
    "annotation-draw-order-number",
    "Numbers",
    DEFAULT_ANNOTATION_VISIBILITY["draw-order-number"],
    'data-annotation-kind="draw-order-number"'
  )}
        ${renderToggleControl(
    "annotation-midpoint-arrow",
    "Midpoints",
    DEFAULT_ANNOTATION_VISIBILITY["midpoint-arrow"],
    'data-annotation-kind="midpoint-arrow"'
  )}
        ${renderToggleControl("offset-arrow-lanes", "Offset lanes", true)}
        ${renderToggleControl("always-offset-arrow-lanes", "Always offset lanes", false)}
      </fieldset>
      ${renderColorControl("word-stroke-color-picker", "Word stroke colour", DEFAULT_WORD_STROKE_COLOR)}
      ${renderColorControl("number-color-picker", "Number colour", DEFAULT_NUMBER_COLOR)}
      ${renderColorControl("arrow-color-picker", "Arrow colour", DEFAULT_ARROW_COLOR)}
    `,
  true
)}
              </div>
            </details>
          </div>
        </header>

        <svg
          class="writing-app__svg"
          id="trace-svg"
          viewBox="0 0 1600 900"
          aria-label="Handwriting tracing area"
        ></svg>

        <div class="writing-app__overlay" id="success-overlay" hidden>
          <div class="writing-app__success-card">
            <p class="writing-app__success-eyebrow">Well done!</p>
            <button class="writing-app__button writing-app__button--next" id="next-word-button" type="button">
              Next word
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
`;

const wordInput = document.querySelector<HTMLInputElement>("#word-input");
const traceSvg = document.querySelector<SVGSVGElement>("#trace-svg");
const showMeButton = document.querySelector<HTMLButtonElement>("#show-me-button");
const successOverlay = document.querySelector<HTMLDivElement>("#success-overlay");
const nextWordButton = document.querySelector<HTMLButtonElement>("#next-word-button");
const toleranceSlider = document.querySelector<HTMLInputElement>("#tolerance-slider");
const toleranceValue = document.querySelector<HTMLSpanElement>("#tolerance-value");
const strokeWidthSlider = document.querySelector<HTMLInputElement>("#stroke-width-slider");
const strokeWidthValue = document.querySelector<HTMLSpanElement>("#stroke-width-value");
const gridlineStrokeWidthSlider = document.querySelector<HTMLInputElement>(
  "#gridline-stroke-width-slider"
);
const gridlineStrokeWidthValue = document.querySelector<HTMLSpanElement>(
  "#gridline-stroke-width-value"
);
const gridlineColorPicker = document.querySelector<HTMLInputElement>("#gridline-color-picker");
const showBaselineGuideToggle = document.querySelector<HTMLInputElement>("#show-baseline-guide");
const showDescenderGuideToggle = document.querySelector<HTMLInputElement>("#show-descender-guide");
const showXHeightGuideToggle = document.querySelector<HTMLInputElement>("#show-x-height-guide");
const showAscenderGuideToggle = document.querySelector<HTMLInputElement>("#show-ascender-guide");
const targetBendRateSlider = document.querySelector<HTMLInputElement>("#target-bend-rate-slider");
const targetBendRateValue = document.querySelector<HTMLSpanElement>("#target-bend-rate-value");
const minSidebearingGapSlider = document.querySelector<HTMLInputElement>("#min-sidebearing-gap-slider");
const minSidebearingGapValue = document.querySelector<HTMLSpanElement>("#min-sidebearing-gap-value");
const bendSearchMinSidebearingGapSlider = document.querySelector<HTMLInputElement>(
  "#bend-search-min-sidebearing-gap-slider"
);
const bendSearchMinSidebearingGapValue = document.querySelector<HTMLSpanElement>(
  "#bend-search-min-sidebearing-gap-value"
);
const bendSearchMaxSidebearingGapSlider = document.querySelector<HTMLInputElement>(
  "#bend-search-max-sidebearing-gap-slider"
);
const bendSearchMaxSidebearingGapValue = document.querySelector<HTMLSpanElement>(
  "#bend-search-max-sidebearing-gap-value"
);
const exitHandleScaleSlider = document.querySelector<HTMLInputElement>("#exit-handle-scale-slider");
const exitHandleScaleValue = document.querySelector<HTMLSpanElement>("#exit-handle-scale-value");
const entryHandleScaleSlider = document.querySelector<HTMLInputElement>("#entry-handle-scale-slider");
const entryHandleScaleValue = document.querySelector<HTMLSpanElement>("#entry-handle-scale-value");
const includeInitialLeadInToggle = document.querySelector<HTMLInputElement>("#include-initial-lead-in");
const includeFinalLeadOutToggle = document.querySelector<HTMLInputElement>("#include-final-lead-out");
const midpointDensitySlider = document.querySelector<HTMLInputElement>("#midpoint-density-slider");
const midpointDensityValue = document.querySelector<HTMLSpanElement>("#midpoint-density-value");
const directionalDashSpacingSlider = document.querySelector<HTMLInputElement>(
  "#directional-dash-spacing-slider"
);
const directionalDashSpacingValue = document.querySelector<HTMLSpanElement>(
  "#directional-dash-spacing-value"
);
const turnRadiusSlider = document.querySelector<HTMLInputElement>("#turn-radius-slider");
const turnRadiusValue = document.querySelector<HTMLSpanElement>("#turn-radius-value");
const uTurnLengthSlider = document.querySelector<HTMLInputElement>("#u-turn-length-slider");
const uTurnLengthValue = document.querySelector<HTMLSpanElement>("#u-turn-length-value");
const arrowLengthSlider = document.querySelector<HTMLInputElement>("#arrow-length-slider");
const arrowLengthValue = document.querySelector<HTMLSpanElement>("#arrow-length-value");
const arrowHeadSizeSlider = document.querySelector<HTMLInputElement>("#arrow-head-size-slider");
const arrowHeadSizeValue = document.querySelector<HTMLSpanElement>("#arrow-head-size-value");
const arrowStrokeWidthSlider = document.querySelector<HTMLInputElement>(
  "#arrow-stroke-width-slider"
);
const arrowStrokeWidthValue = document.querySelector<HTMLSpanElement>(
  "#arrow-stroke-width-value"
);
const numberSizeSlider = document.querySelector<HTMLInputElement>("#number-size-slider");
const numberSizeValue = document.querySelector<HTMLSpanElement>("#number-size-value");
const numberOffsetSlider = document.querySelector<HTMLInputElement>("#number-offset-slider");
const numberOffsetValue = document.querySelector<HTMLSpanElement>("#number-offset-value");
const offsetArrowLanesToggle = document.querySelector<HTMLInputElement>("#offset-arrow-lanes");
const alwaysOffsetArrowLanesToggle = document.querySelector<HTMLInputElement>(
  "#always-offset-arrow-lanes"
);
const wordStrokeColorPicker = document.querySelector<HTMLInputElement>("#word-stroke-color-picker");
const numberColorPicker = document.querySelector<HTMLInputElement>("#number-color-picker");
const arrowColorPicker = document.querySelector<HTMLInputElement>("#arrow-color-picker");
const annotationToggleEls = Array.from(
  document.querySelectorAll<HTMLInputElement>("[data-annotation-kind]")
);

if (
  !wordInput ||
  !traceSvg ||
  !showMeButton ||
  !successOverlay ||
  !nextWordButton ||
  !toleranceSlider ||
  !toleranceValue ||
  !strokeWidthSlider ||
  !strokeWidthValue ||
  !gridlineStrokeWidthSlider ||
  !gridlineStrokeWidthValue ||
  !gridlineColorPicker ||
  !showBaselineGuideToggle ||
  !showDescenderGuideToggle ||
  !showXHeightGuideToggle ||
  !showAscenderGuideToggle ||
  !targetBendRateSlider ||
  !targetBendRateValue ||
  !minSidebearingGapSlider ||
  !minSidebearingGapValue ||
  !bendSearchMinSidebearingGapSlider ||
  !bendSearchMinSidebearingGapValue ||
  !bendSearchMaxSidebearingGapSlider ||
  !bendSearchMaxSidebearingGapValue ||
  !exitHandleScaleSlider ||
  !exitHandleScaleValue ||
  !entryHandleScaleSlider ||
  !entryHandleScaleValue ||
  !includeInitialLeadInToggle ||
  !includeFinalLeadOutToggle ||
  !midpointDensitySlider ||
  !midpointDensityValue ||
  !directionalDashSpacingSlider ||
  !directionalDashSpacingValue ||
  !turnRadiusSlider ||
  !turnRadiusValue ||
  !uTurnLengthSlider ||
  !uTurnLengthValue ||
  !arrowLengthSlider ||
  !arrowLengthValue ||
  !arrowHeadSizeSlider ||
  !arrowHeadSizeValue ||
  !arrowStrokeWidthSlider ||
  !arrowStrokeWidthValue ||
  !numberSizeSlider ||
  !numberSizeValue ||
  !numberOffsetSlider ||
  !numberOffsetValue ||
  !offsetArrowLanesToggle ||
  !alwaysOffsetArrowLanesToggle ||
  !wordStrokeColorPicker ||
  !numberColorPicker ||
  !arrowColorPicker ||
  annotationToggleEls.length === 0
) {
  throw new Error("Missing elements for writing app.");
}

let currentWordIndex = -1;
let currentWord = "zephyr";
let currentPath: WritingPath | null = null;
let tracingSession: TracingSession | null = null;
let preparedTracingPath: PreparedTracingPath | null = null;
let activePointerId: number | null = null;
let traceRenderQueued = false;
let traceStrokeEls: SVGPathElement[] = [];
let traceStrokeLengths: number[] = [];
let traceCursorEl: SVGGElement | null = null;
let demoStrokeEls: SVGPathElement[] = [];
let demoStrokeLengths: number[] = [];
let demoNibEl: SVGCircleElement | null = null;
let demoAnimationFrameId: number | null = null;
let isDemoPlaying = false;
let currentTraceTolerance = DEFAULT_TRACE_TOLERANCE;
let currentStrokeWidth = DEFAULT_STROKE_WIDTH;
let currentGridlineStrokeWidth = DEFAULT_GRIDLINE_STROKE_WIDTH;
let currentGridlineColor = DEFAULT_GRIDLINE_COLOR;
let showBaselineGuide = true;
let showDescenderGuide = false;
let showXHeightGuide = true;
let showAscenderGuide = false;
let currentJoinSpacing: Required<JoinSpacingOptions> = { ...DEFAULT_JOIN_SPACING };
let includeInitialLeadIn = true;
let includeFinalLeadOut = true;
let currentMidpointDensity = DEFAULT_MIDPOINT_DENSITY;
let currentDirectionalDashSpacing = DEFAULT_DIRECTIONAL_DASH_SPACING;
let currentTurnRadius = DEFAULT_TURN_RADIUS;
let currentUTurnLength = DEFAULT_U_TURN_LENGTH;
let currentArrowLength = DEFAULT_ARROW_LENGTH;
let currentArrowHeadSize = DEFAULT_ARROW_HEAD_SIZE;
let currentArrowStrokeWidth = DEFAULT_ARROW_STROKE_WIDTH;
let currentNumberSize = DEFAULT_NUMBER_SIZE;
let currentNumberPathOffset = DEFAULT_NUMBER_PATH_OFFSET;
let shouldOffsetArrowLanes = true;
let shouldAlwaysOffsetArrowLanes = false;
let currentWordStrokeColor = DEFAULT_WORD_STROKE_COLOR;
let currentNumberColor = DEFAULT_NUMBER_COLOR;
let currentArrowColor = DEFAULT_ARROW_COLOR;
let annotationVisibility: Record<FormationAnnotation["kind"], boolean> = {
  ...DEFAULT_ANNOTATION_VISIBILITY
};

const TRACE_CURSOR_TURN_COMMIT_DISTANCE = 12;
const TRACE_CURSOR_TURN_LOOKAHEAD_DISTANCE = 2;
const ANNOTATION_COLLISION_SAMPLE_STEP = 4;
const ANNOTATION_STROKE_WIDTH = 6.5;
const ANNOTATION_STROKE_HALF_WIDTH = ANNOTATION_STROKE_WIDTH / 2;

type ArrowAnnotation = Extract<FormationAnnotation, { commands: AnnotationPathCommand[] }>;
type StraightArrowAnnotation = Extract<
  FormationAnnotation,
  { kind: "start-arrow" | "midpoint-arrow" }
>;
type TurningPointAnnotation = Extract<FormationAnnotation, { kind: "turning-point" }>;
type DrawOrderNumberAnnotation = Extract<FormationAnnotation, { kind: "draw-order-number" }>;
type PreparedPoseBias = "forward" | "backward" | "center";

type TurningPointRelocation = {
  annotation: TurningPointAnnotation;
  distanceShift: number;
  targetDistance: number;
  targetPose: {
    point: Point;
    tangent: Point;
  };
};

type AnnotationCollisionShape = {
  pathPoints: Point[];
  headPolygon?: Point[];
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
};

const buildSvgPoints = (points: Point[]): string =>
  points.map((point) => `${point.x} ${point.y}`).join(" ");

const escapeSvgText = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const setText = (element: HTMLElement, value: string) => {
  element.textContent = value;
};

const formatScale = (value: number): string => value.toFixed(2);

const syncLabels = () => {
  setText(toleranceValue, `${currentTraceTolerance}px`);
  setText(strokeWidthValue, `${currentStrokeWidth}px`);
  setText(gridlineStrokeWidthValue, `${currentGridlineStrokeWidth.toFixed(1)}px`);
  setText(targetBendRateValue, `${currentJoinSpacing.targetBendRate}`);
  setText(minSidebearingGapValue, `${currentJoinSpacing.minSidebearingGap}`);
  setText(
    bendSearchMinSidebearingGapValue,
    `${currentJoinSpacing.bendSearchMinSidebearingGap}`
  );
  setText(
    bendSearchMaxSidebearingGapValue,
    `${currentJoinSpacing.bendSearchMaxSidebearingGap}`
  );
  setText(exitHandleScaleValue, formatScale(currentJoinSpacing.exitHandleScale));
  setText(entryHandleScaleValue, formatScale(currentJoinSpacing.entryHandleScale));
  setText(directionalDashSpacingValue, `${currentDirectionalDashSpacing}px`);
  setText(midpointDensityValue, `1 per ${currentMidpointDensity}px`);
  setText(turnRadiusValue, `${currentTurnRadius}px`);
  setText(uTurnLengthValue, `${currentUTurnLength}px`);
  setText(arrowLengthValue, `${currentArrowLength}px`);
  setText(arrowHeadSizeValue, `${currentArrowHeadSize}px`);
  setText(arrowStrokeWidthValue, `${currentArrowStrokeWidth.toFixed(1)}px`);
  setText(numberSizeValue, `${currentNumberSize}px`);
  setText(numberOffsetValue, `${currentNumberPathOffset}px`);
};

const normalizeColor = (value: string): string | null =>
  /^#[0-9a-fA-F]{6}$/.test(value) ? value.toLowerCase() : null;

const normalizeWord = (word: string): string => word.trim().toLowerCase();

const getSliderValuePrecision = (input: HTMLInputElement): number => {
  const step = input.step;
  if (!step || step === "any") {
    return 0;
  }

  const decimals = step.split(".")[1];
  return decimals ? decimals.length : 0;
};

const normalizeSliderValue = (input: HTMLInputElement, value: number): number => {
  const min = input.min === "" ? Number.NEGATIVE_INFINITY : Number(input.min);
  const max = input.max === "" ? Number.POSITIVE_INFINITY : Number(input.max);
  const step = input.step === "" || input.step === "any" ? NaN : Number(input.step);
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

const parseColorSearchParam = (params: URLSearchParams, key: string): string | null =>
  normalizeColor(params.get(key) ?? "");

const syncSettingsControlsFromState = () => {
  wordInput.value = currentWord;
  currentTraceTolerance = syncSliderValue(toleranceSlider, currentTraceTolerance);
  currentStrokeWidth = syncSliderValue(strokeWidthSlider, currentStrokeWidth);
  currentGridlineStrokeWidth = syncSliderValue(
    gridlineStrokeWidthSlider,
    currentGridlineStrokeWidth
  );
  currentJoinSpacing = {
    targetBendRate: syncSliderValue(targetBendRateSlider, currentJoinSpacing.targetBendRate),
    minSidebearingGap: syncSliderValue(minSidebearingGapSlider, currentJoinSpacing.minSidebearingGap),
    bendSearchMinSidebearingGap: syncSliderValue(
      bendSearchMinSidebearingGapSlider,
      currentJoinSpacing.bendSearchMinSidebearingGap
    ),
    bendSearchMaxSidebearingGap: syncSliderValue(
      bendSearchMaxSidebearingGapSlider,
      currentJoinSpacing.bendSearchMaxSidebearingGap
    ),
    exitHandleScale: syncSliderValue(exitHandleScaleSlider, currentJoinSpacing.exitHandleScale),
    entryHandleScale: syncSliderValue(entryHandleScaleSlider, currentJoinSpacing.entryHandleScale)
  };
  currentDirectionalDashSpacing = syncSliderValue(
    directionalDashSpacingSlider,
    currentDirectionalDashSpacing
  );
  currentMidpointDensity = syncSliderValue(midpointDensitySlider, currentMidpointDensity);
  currentTurnRadius = syncSliderValue(turnRadiusSlider, currentTurnRadius);
  currentUTurnLength = syncSliderValue(uTurnLengthSlider, currentUTurnLength);
  currentArrowLength = syncSliderValue(arrowLengthSlider, currentArrowLength);
  currentArrowHeadSize = syncSliderValue(arrowHeadSizeSlider, currentArrowHeadSize);
  currentArrowStrokeWidth = syncSliderValue(arrowStrokeWidthSlider, currentArrowStrokeWidth);
  currentNumberSize = syncSliderValue(numberSizeSlider, currentNumberSize);
  currentNumberPathOffset = syncSliderValue(numberOffsetSlider, currentNumberPathOffset);

  showBaselineGuideToggle.checked = showBaselineGuide;
  showDescenderGuideToggle.checked = showDescenderGuide;
  showXHeightGuideToggle.checked = showXHeightGuide;
  showAscenderGuideToggle.checked = showAscenderGuide;
  includeInitialLeadInToggle.checked = includeInitialLeadIn;
  includeFinalLeadOutToggle.checked = includeFinalLeadOut;
  offsetArrowLanesToggle.checked = shouldOffsetArrowLanes;
  alwaysOffsetArrowLanesToggle.checked = shouldAlwaysOffsetArrowLanes;
  gridlineColorPicker.value = currentGridlineColor;
  wordStrokeColorPicker.value = currentWordStrokeColor;
  numberColorPicker.value = currentNumberColor;
  arrowColorPicker.value = currentArrowColor;
  annotationToggleEls.forEach((toggleEl) => {
    const annotationKind = toggleEl.dataset.annotationKind as FormationAnnotation["kind"] | undefined;
    if (!annotationKind) {
      return;
    }
    toggleEl.checked = annotationVisibility[annotationKind];
  });

  syncLabels();
};

const syncSettingsUrl = () => {
  const url = new URL(window.location.href);
  WRITING_APP_URL_PARAM_KEYS.forEach((key) => {
    url.searchParams.delete(key);
  });

  if (currentWord !== "zephyr") {
    url.searchParams.set("word", currentWord);
  }

  if (currentTraceTolerance !== DEFAULT_TRACE_TOLERANCE) {
    url.searchParams.set("tolerance", String(currentTraceTolerance));
  }
  if (currentStrokeWidth !== DEFAULT_STROKE_WIDTH) {
    url.searchParams.set("strokeWidth", String(currentStrokeWidth));
  }
  if (currentGridlineStrokeWidth !== DEFAULT_GRIDLINE_STROKE_WIDTH) {
    url.searchParams.set("gridlineStrokeWidth", String(currentGridlineStrokeWidth));
  }
  if (currentGridlineColor !== DEFAULT_GRIDLINE_COLOR) {
    url.searchParams.set("gridlineColor", currentGridlineColor);
  }
  if (showBaselineGuide !== true) {
    url.searchParams.set("showBaselineGuide", showBaselineGuide ? "1" : "0");
  }
  if (showDescenderGuide !== false) {
    url.searchParams.set("showDescenderGuide", showDescenderGuide ? "1" : "0");
  }
  if (showXHeightGuide !== true) {
    url.searchParams.set("showXHeightGuide", showXHeightGuide ? "1" : "0");
  }
  if (showAscenderGuide !== false) {
    url.searchParams.set("showAscenderGuide", showAscenderGuide ? "1" : "0");
  }
  if (currentJoinSpacing.targetBendRate !== DEFAULT_JOIN_SPACING.targetBendRate) {
    url.searchParams.set("targetBendRate", String(currentJoinSpacing.targetBendRate));
  }
  if (currentJoinSpacing.minSidebearingGap !== DEFAULT_JOIN_SPACING.minSidebearingGap) {
    url.searchParams.set("minSidebearingGap", String(currentJoinSpacing.minSidebearingGap));
  }
  if (
    currentJoinSpacing.bendSearchMinSidebearingGap !==
    DEFAULT_JOIN_SPACING.bendSearchMinSidebearingGap
  ) {
    url.searchParams.set(
      "bendSearchMinSidebearingGap",
      String(currentJoinSpacing.bendSearchMinSidebearingGap)
    );
  }
  if (
    currentJoinSpacing.bendSearchMaxSidebearingGap !==
    DEFAULT_JOIN_SPACING.bendSearchMaxSidebearingGap
  ) {
    url.searchParams.set(
      "bendSearchMaxSidebearingGap",
      String(currentJoinSpacing.bendSearchMaxSidebearingGap)
    );
  }
  if (currentJoinSpacing.exitHandleScale !== DEFAULT_JOIN_SPACING.exitHandleScale) {
    url.searchParams.set("exitHandleScale", String(currentJoinSpacing.exitHandleScale));
  }
  if (currentJoinSpacing.entryHandleScale !== DEFAULT_JOIN_SPACING.entryHandleScale) {
    url.searchParams.set("entryHandleScale", String(currentJoinSpacing.entryHandleScale));
  }
  if (includeInitialLeadIn !== true) {
    url.searchParams.set("includeInitialLeadIn", includeInitialLeadIn ? "1" : "0");
  }
  if (includeFinalLeadOut !== true) {
    url.searchParams.set("includeFinalLeadOut", includeFinalLeadOut ? "1" : "0");
  }
  if (currentDirectionalDashSpacing !== DEFAULT_DIRECTIONAL_DASH_SPACING) {
    url.searchParams.set("directionalDashSpacing", String(currentDirectionalDashSpacing));
  }
  if (currentMidpointDensity !== DEFAULT_MIDPOINT_DENSITY) {
    url.searchParams.set("midpointDensity", String(currentMidpointDensity));
  }
  if (currentTurnRadius !== DEFAULT_TURN_RADIUS) {
    url.searchParams.set("turnRadius", String(currentTurnRadius));
  }
  if (currentUTurnLength !== DEFAULT_U_TURN_LENGTH) {
    url.searchParams.set("uTurnLength", String(currentUTurnLength));
  }
  if (currentArrowLength !== DEFAULT_ARROW_LENGTH) {
    url.searchParams.set("arrowLength", String(currentArrowLength));
  }
  if (currentArrowHeadSize !== DEFAULT_ARROW_HEAD_SIZE) {
    url.searchParams.set("arrowHeadSize", String(currentArrowHeadSize));
  }
  if (currentArrowStrokeWidth !== DEFAULT_ARROW_STROKE_WIDTH) {
    url.searchParams.set("arrowStrokeWidth", String(currentArrowStrokeWidth));
  }
  if (currentNumberSize !== DEFAULT_NUMBER_SIZE) {
    url.searchParams.set("numberSize", String(currentNumberSize));
  }
  if (currentNumberPathOffset !== DEFAULT_NUMBER_PATH_OFFSET) {
    url.searchParams.set("numberOffset", String(currentNumberPathOffset));
  }
  if (annotationVisibility["directional-dash"] !== DEFAULT_ANNOTATION_VISIBILITY["directional-dash"]) {
    url.searchParams.set("directionalDash", annotationVisibility["directional-dash"] ? "1" : "0");
  }
  if (annotationVisibility["turning-point"] !== DEFAULT_ANNOTATION_VISIBILITY["turning-point"]) {
    url.searchParams.set("turns", annotationVisibility["turning-point"] ? "1" : "0");
  }
  if (annotationVisibility["start-arrow"] !== DEFAULT_ANNOTATION_VISIBILITY["start-arrow"]) {
    url.searchParams.set("starts", annotationVisibility["start-arrow"] ? "1" : "0");
  }
  if (
    annotationVisibility["draw-order-number"] !==
    DEFAULT_ANNOTATION_VISIBILITY["draw-order-number"]
  ) {
    url.searchParams.set("numbers", annotationVisibility["draw-order-number"] ? "1" : "0");
  }
  if (annotationVisibility["midpoint-arrow"] !== DEFAULT_ANNOTATION_VISIBILITY["midpoint-arrow"]) {
    url.searchParams.set("midpoints", annotationVisibility["midpoint-arrow"] ? "1" : "0");
  }
  if (shouldOffsetArrowLanes !== true) {
    url.searchParams.set("offsetArrowLanes", shouldOffsetArrowLanes ? "1" : "0");
  }
  if (shouldAlwaysOffsetArrowLanes !== false) {
    url.searchParams.set("alwaysOffsetArrowLanes", shouldAlwaysOffsetArrowLanes ? "1" : "0");
  }
  if (currentWordStrokeColor !== DEFAULT_WORD_STROKE_COLOR) {
    url.searchParams.set("wordStrokeColor", currentWordStrokeColor);
  }
  if (currentNumberColor !== DEFAULT_NUMBER_COLOR) {
    url.searchParams.set("numberColor", currentNumberColor);
  }
  if (currentArrowColor !== DEFAULT_ARROW_COLOR) {
    url.searchParams.set("arrowColor", currentArrowColor);
  }

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (nextUrl !== currentUrl) {
    window.history.replaceState(null, "", nextUrl);
  }
};

const applyUrlSettings = () => {
  const params = new URLSearchParams(window.location.search);
  const wordParam = params.get("word");

  if (wordParam !== null) {
    currentWord = normalizeWord(wordParam);
  }

  currentTraceTolerance =
    parseSliderSearchParam(params, "tolerance", toleranceSlider) ?? currentTraceTolerance;
  currentStrokeWidth =
    parseSliderSearchParam(params, "strokeWidth", strokeWidthSlider) ?? currentStrokeWidth;
  currentGridlineStrokeWidth =
    parseSliderSearchParam(params, "gridlineStrokeWidth", gridlineStrokeWidthSlider) ??
    currentGridlineStrokeWidth;
  currentGridlineColor =
    parseColorSearchParam(params, "gridlineColor") ?? currentGridlineColor;
  showBaselineGuide =
    parseBooleanSearchParam(params, "showBaselineGuide") ?? showBaselineGuide;
  showDescenderGuide =
    parseBooleanSearchParam(params, "showDescenderGuide") ?? showDescenderGuide;
  showXHeightGuide = parseBooleanSearchParam(params, "showXHeightGuide") ?? showXHeightGuide;
  showAscenderGuide =
    parseBooleanSearchParam(params, "showAscenderGuide") ?? showAscenderGuide;
  currentJoinSpacing = {
    targetBendRate:
      parseSliderSearchParam(params, "targetBendRate", targetBendRateSlider) ??
      currentJoinSpacing.targetBendRate,
    minSidebearingGap:
      parseSliderSearchParam(params, "minSidebearingGap", minSidebearingGapSlider) ??
      currentJoinSpacing.minSidebearingGap,
    bendSearchMinSidebearingGap:
      parseSliderSearchParam(
        params,
        "bendSearchMinSidebearingGap",
        bendSearchMinSidebearingGapSlider
      ) ?? currentJoinSpacing.bendSearchMinSidebearingGap,
    bendSearchMaxSidebearingGap:
      parseSliderSearchParam(
        params,
        "bendSearchMaxSidebearingGap",
        bendSearchMaxSidebearingGapSlider
      ) ?? currentJoinSpacing.bendSearchMaxSidebearingGap,
    exitHandleScale:
      parseSliderSearchParam(params, "exitHandleScale", exitHandleScaleSlider) ??
      currentJoinSpacing.exitHandleScale,
    entryHandleScale:
      parseSliderSearchParam(params, "entryHandleScale", entryHandleScaleSlider) ??
      currentJoinSpacing.entryHandleScale
  };
  includeInitialLeadIn =
    parseBooleanSearchParam(params, "includeInitialLeadIn") ?? includeInitialLeadIn;
  includeFinalLeadOut =
    parseBooleanSearchParam(params, "includeFinalLeadOut") ?? includeFinalLeadOut;
  currentDirectionalDashSpacing =
    parseSliderSearchParam(params, "directionalDashSpacing", directionalDashSpacingSlider) ??
    currentDirectionalDashSpacing;
  currentMidpointDensity =
    parseSliderSearchParam(params, "midpointDensity", midpointDensitySlider) ??
    currentMidpointDensity;
  currentTurnRadius =
    parseSliderSearchParam(params, "turnRadius", turnRadiusSlider) ?? currentTurnRadius;
  currentUTurnLength =
    parseSliderSearchParam(params, "uTurnLength", uTurnLengthSlider) ?? currentUTurnLength;
  currentArrowLength =
    parseSliderSearchParam(params, "arrowLength", arrowLengthSlider) ?? currentArrowLength;
  currentArrowHeadSize =
    parseSliderSearchParam(params, "arrowHeadSize", arrowHeadSizeSlider) ?? currentArrowHeadSize;
  currentArrowStrokeWidth =
    parseSliderSearchParam(params, "arrowStrokeWidth", arrowStrokeWidthSlider) ??
    currentArrowStrokeWidth;
  currentNumberSize =
    parseSliderSearchParam(params, "numberSize", numberSizeSlider) ?? currentNumberSize;
  currentNumberPathOffset =
    parseSliderSearchParam(params, "numberOffset", numberOffsetSlider) ??
    currentNumberPathOffset;
  annotationVisibility = {
    "directional-dash":
      parseBooleanSearchParam(params, "directionalDash") ??
      annotationVisibility["directional-dash"],
    "turning-point":
      parseBooleanSearchParam(params, "turns") ?? annotationVisibility["turning-point"],
    "start-arrow":
      parseBooleanSearchParam(params, "starts") ?? annotationVisibility["start-arrow"],
    "draw-order-number":
      parseBooleanSearchParam(params, "numbers") ?? annotationVisibility["draw-order-number"],
    "midpoint-arrow":
      parseBooleanSearchParam(params, "midpoints") ?? annotationVisibility["midpoint-arrow"]
  };
  shouldOffsetArrowLanes =
    parseBooleanSearchParam(params, "offsetArrowLanes") ?? shouldOffsetArrowLanes;
  shouldAlwaysOffsetArrowLanes =
    parseBooleanSearchParam(params, "alwaysOffsetArrowLanes") ?? shouldAlwaysOffsetArrowLanes;
  currentWordStrokeColor =
    parseColorSearchParam(params, "wordStrokeColor") ?? currentWordStrokeColor;
  currentNumberColor = parseColorSearchParam(params, "numberColor") ?? currentNumberColor;
  currentArrowColor = parseColorSearchParam(params, "arrowColor") ?? currentArrowColor;

  syncSettingsControlsFromState();
  syncSettingsUrl();
};

const getAnnotationClassName = (annotation: FormationAnnotation): string =>
  `writing-app__section-arrow writing-app__section-arrow--formation writing-app__section-arrow--${annotation.kind}`;

const getAnnotationHeads = (annotation: FormationAnnotation): AnnotationArrowHead[] =>
  [
    "head" in annotation ? annotation.head : undefined,
    "tailHead" in annotation ? annotation.tailHead : undefined
  ].filter((head): head is AnnotationArrowHead => head !== undefined);

const isStraightArrowAnnotation = (
  annotation: FormationAnnotation
): annotation is StraightArrowAnnotation =>
  annotation.kind === "start-arrow" || annotation.kind === "midpoint-arrow";

const isTurningPointAnnotation = (
  annotation: FormationAnnotation
): annotation is TurningPointAnnotation => annotation.kind === "turning-point";

const isDrawOrderNumberAnnotation = (
  annotation: FormationAnnotation
): annotation is DrawOrderNumberAnnotation => annotation.kind === "draw-order-number";

const getAnnotationPathDistance = (annotation: FormationAnnotation): number => {
  if ("distance" in annotation.source) {
    return annotation.source.distance;
  }

  return annotation.source.turnDistance;
};

const getTotalPreparedPathLength = (path: PreparedTracingPath): number =>
  path.strokes.reduce((sum, stroke) => sum + stroke.totalLength, 0);

const interpolatePreparedSamplePoint = (
  samples: PreparedTracingPath["strokes"][number]["samples"],
  distanceAlongStroke: number
): Point => {
  if (samples.length === 0) {
    return { x: 0, y: 0 };
  }

  for (let index = 1; index < samples.length; index += 1) {
    const previous = samples[index - 1];
    const current = samples[index];
    if (!previous || !current) {
      continue;
    }

    if (current.distanceAlongStroke >= distanceAlongStroke) {
      const span = current.distanceAlongStroke - previous.distanceAlongStroke;
      const ratio = span > 0 ? (distanceAlongStroke - previous.distanceAlongStroke) / span : 0;
      return {
        x: previous.x + (current.x - previous.x) * ratio,
        y: previous.y + (current.y - previous.y) * ratio
      };
    }
  }

  const last = samples[samples.length - 1];
  return last ? { x: last.x, y: last.y } : { x: 0, y: 0 };
};

const getPreparedPointAtOverallDistance = (
  path: PreparedTracingPath,
  targetDistance: number
): Point => {
  let remaining = targetDistance;

  for (let index = 0; index < path.strokes.length; index += 1) {
    const stroke = path.strokes[index];
    if (!stroke) {
      continue;
    }

    if (remaining <= stroke.totalLength || index === path.strokes.length - 1) {
      return interpolatePreparedSamplePoint(
        stroke.samples,
        Math.max(0, Math.min(remaining, stroke.totalLength))
      );
    }

    remaining -= stroke.totalLength;
  }

  return { x: 0, y: 0 };
};

const normalizeVector = (vector: Point): Point => {
  const length = Math.hypot(vector.x, vector.y);
  return length > 0 ? { x: vector.x / length, y: vector.y / length } : { x: 1, y: 0 };
};

const getPreparedPoseAtOverallDistance = (
  path: PreparedTracingPath,
  targetDistance: number,
  bias: PreparedPoseBias = "center"
): { point: Point; tangent: Point } => {
  const totalLength = getTotalPreparedPathLength(path);
  const clampedDistance = Math.max(0, Math.min(targetDistance, totalLength));
  const point = getPreparedPointAtOverallDistance(path, clampedDistance);
  const delta = Math.min(8, Math.max(2, totalLength / 200));

  let fromDistance = Math.max(0, clampedDistance - delta);
  let toDistance = Math.min(totalLength, clampedDistance + delta);

  if (bias === "forward") {
    fromDistance = clampedDistance;
  } else if (bias === "backward") {
    toDistance = clampedDistance;
  }

  if (Math.abs(toDistance - fromDistance) < 0.001) {
    if (clampedDistance <= delta) {
      toDistance = Math.min(totalLength, clampedDistance + delta);
    } else {
      fromDistance = Math.max(0, clampedDistance - delta);
    }
  }

  const fromPoint = getPreparedPointAtOverallDistance(path, fromDistance);
  const toPoint = getPreparedPointAtOverallDistance(path, toDistance);

  return {
    point,
    tangent: normalizeVector({
      x: toPoint.x - fromPoint.x,
      y: toPoint.y - fromPoint.y
    })
  };
};

const getPointDistance = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y);

const getSquaredPointDistance = (a: Point, b: Point): number =>
  (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);

const interpolatePoint = (start: Point, end: Point, progress: number): Point => ({
  x: start.x + (end.x - start.x) * progress,
  y: start.y + (end.y - start.y) * progress
});

const offsetPosePoint = (pose: { point: Point; tangent: Point }, lateralOffset: number): Point => {
  const normal = { x: -pose.tangent.y, y: pose.tangent.x };
  return {
    x: pose.point.x + normal.x * lateralOffset,
    y: pose.point.y + normal.y * lateralOffset
  };
};

const rotateVector = (vector: Point, angleRadians: number): Point => {
  const cos = Math.cos(angleRadians);
  const sin = Math.sin(angleRadians);
  return {
    x: vector.x * cos - vector.y * sin,
    y: vector.x * sin + vector.y * cos
  };
};

const transformPoint = (
  point: Point,
  sourceAnchor: Point,
  targetAnchor: Point,
  angleRadians: number
): Point => {
  const rotated = rotateVector(
    {
      x: point.x - sourceAnchor.x,
      y: point.y - sourceAnchor.y
    },
    angleRadians
  );

  return {
    x: targetAnchor.x + rotated.x,
    y: targetAnchor.y + rotated.y
  };
};

const getCubicPoint = (
  start: Point,
  cp1: Point,
  cp2: Point,
  end: Point,
  progress: number
): Point => {
  const inverse = 1 - progress;
  const inverseSquared = inverse * inverse;
  const progressSquared = progress * progress;

  return {
    x:
      inverseSquared * inverse * start.x +
      3 * inverseSquared * progress * cp1.x +
      3 * inverse * progressSquared * cp2.x +
      progressSquared * progress * end.x,
    y:
      inverseSquared * inverse * start.y +
      3 * inverseSquared * progress * cp1.y +
      3 * inverse * progressSquared * cp2.y +
      progressSquared * progress * end.y
  };
};

const pushCollisionPoint = (points: Point[], point: Point) => {
  const previous = points[points.length - 1];
  if (!previous || getPointDistance(previous, point) > 0.25) {
    points.push(point);
  }
};

const sampleLineSegment = (start: Point, end: Point): Point[] => {
  const length = getPointDistance(start, end);
  const segmentCount = Math.max(1, Math.ceil(length / ANNOTATION_COLLISION_SAMPLE_STEP));
  const points: Point[] = [];

  for (let index = 1; index <= segmentCount; index += 1) {
    points.push(interpolatePoint(start, end, index / segmentCount));
  }

  return points;
};

const sampleAnnotationCommands = (commands: AnnotationPathCommand[]): Point[] => {
  const points: Point[] = [];
  let currentPoint: Point | null = null;

  commands.forEach((command) => {
    if (command.type === "move") {
      currentPoint = command.to;
      pushCollisionPoint(points, command.to);
      return;
    }

    if (!currentPoint) {
      currentPoint = command.to;
      pushCollisionPoint(points, command.to);
      return;
    }

    if (command.type === "line") {
      sampleLineSegment(currentPoint, command.to).forEach((point) =>
        pushCollisionPoint(points, point)
      );
      currentPoint = command.to;
      return;
    }

    const controlPolygonLength =
      getPointDistance(currentPoint, command.cp1) +
      getPointDistance(command.cp1, command.cp2) +
      getPointDistance(command.cp2, command.to);
    const segmentCount = Math.max(
      3,
      Math.ceil(controlPolygonLength / ANNOTATION_COLLISION_SAMPLE_STEP)
    );

    for (let index = 1; index <= segmentCount; index += 1) {
      pushCollisionPoint(
        points,
        getCubicPoint(currentPoint, command.cp1, command.cp2, command.to, index / segmentCount)
      );
    }
    currentPoint = command.to;
  });

  return points;
};

const getAnnotationCollisionShape = (annotation: ArrowAnnotation): AnnotationCollisionShape => {
  const pathPoints = sampleAnnotationCommands(annotation.commands);
  const headPolygon = annotation.head?.polygon;
  const points = [...pathPoints, ...(headPolygon ?? [])];

  const bounds = points.reduce(
    (currentBounds, point) => ({
      minX: Math.min(currentBounds.minX, point.x),
      minY: Math.min(currentBounds.minY, point.y),
      maxX: Math.max(currentBounds.maxX, point.x),
      maxY: Math.max(currentBounds.maxY, point.y)
    }),
    {
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY
    }
  );

  return {
    pathPoints,
    ...(headPolygon ? { headPolygon } : {}),
    bounds
  };
};

const doBoundsOverlap = (
  a: AnnotationCollisionShape["bounds"],
  b: AnnotationCollisionShape["bounds"],
  padding: number
): boolean =>
  a.minX <= b.maxX + padding &&
  a.maxX + padding >= b.minX &&
  a.minY <= b.maxY + padding &&
  a.maxY + padding >= b.minY;

const getPointToSegmentDistance = (point: Point, start: Point, end: Point): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return getPointDistance(point, start);
  }

  const progress = Math.max(
    0,
    Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared)
  );
  return getPointDistance(point, {
    x: start.x + dx * progress,
    y: start.y + dy * progress
  });
};

const getPointToPolygonEdgeDistance = (point: Point, polygon: Point[]): number =>
  polygon.reduce((minDistance, start, index) => {
    const end = polygon[(index + 1) % polygon.length];
    if (!end) {
      return minDistance;
    }

    return Math.min(minDistance, getPointToSegmentDistance(point, start, end));
  }, Number.POSITIVE_INFINITY);

const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
  let inside = false;

  for (
    let index = 0, previousIndex = polygon.length - 1;
    index < polygon.length;
    previousIndex = index, index += 1
  ) {
    const current = polygon[index];
    const previous = polygon[previousIndex];
    if (!current || !previous) {
      continue;
    }

    const intersects =
      current.y > point.y !== previous.y > point.y &&
      point.x <
      ((previous.x - current.x) * (point.y - current.y)) / (previous.y - current.y) +
      current.x;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
};

const getOrientation = (a: Point, b: Point, c: Point): number =>
  (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);

const isPointOnSegment = (point: Point, start: Point, end: Point): boolean =>
  point.x <= Math.max(start.x, end.x) &&
  point.x >= Math.min(start.x, end.x) &&
  point.y <= Math.max(start.y, end.y) &&
  point.y >= Math.min(start.y, end.y);

const doSegmentsIntersect = (aStart: Point, aEnd: Point, bStart: Point, bEnd: Point): boolean => {
  const o1 = getOrientation(aStart, aEnd, bStart);
  const o2 = getOrientation(aStart, aEnd, bEnd);
  const o3 = getOrientation(bStart, bEnd, aStart);
  const o4 = getOrientation(bStart, bEnd, aEnd);

  if (o1 * o2 < 0 && o3 * o4 < 0) {
    return true;
  }

  return (
    (Math.abs(o1) < 0.001 && isPointOnSegment(bStart, aStart, aEnd)) ||
    (Math.abs(o2) < 0.001 && isPointOnSegment(bEnd, aStart, aEnd)) ||
    (Math.abs(o3) < 0.001 && isPointOnSegment(aStart, bStart, bEnd)) ||
    (Math.abs(o4) < 0.001 && isPointOnSegment(aEnd, bStart, bEnd))
  );
};

const doPolygonsOverlap = (a: Point[], b: Point[]): boolean => {
  if (a.length < 3 || b.length < 3) {
    return false;
  }

  const edgesIntersect = a.some((aStart, aIndex) => {
    const aEnd = a[(aIndex + 1) % a.length];
    return (
      !!aEnd &&
      b.some((bStart, bIndex) => {
        const bEnd = b[(bIndex + 1) % b.length];
        return !!bEnd && doSegmentsIntersect(aStart, aEnd, bStart, bEnd);
      })
    );
  });

  return (
    edgesIntersect ||
    isPointInPolygon(a[0] as Point, b) ||
    isPointInPolygon(b[0] as Point, a)
  );
};

const doPathStrokesOverlap = (aPoints: Point[], bPoints: Point[]): boolean => {
  const overlapDistanceSquared = ANNOTATION_STROKE_WIDTH * ANNOTATION_STROKE_WIDTH;

  return aPoints.some((aPoint) =>
    bPoints.some((bPoint) => getSquaredPointDistance(aPoint, bPoint) <= overlapDistanceSquared)
  );
};

const doesPathStrokeOverlapPolygon = (pathPoints: Point[], polygon: Point[]): boolean =>
  polygon.length >= 3 &&
  pathPoints.some(
    (point) =>
      isPointInPolygon(point, polygon) ||
      getPointToPolygonEdgeDistance(point, polygon) <= ANNOTATION_STROKE_HALF_WIDTH
  );

const doAnnotationShapesOverlap = (
  a: ArrowAnnotation,
  b: ArrowAnnotation,
  collisionShapeCache: Map<ArrowAnnotation, AnnotationCollisionShape>
): boolean => {
  const aShape = collisionShapeCache.get(a) ?? getAnnotationCollisionShape(a);
  const bShape = collisionShapeCache.get(b) ?? getAnnotationCollisionShape(b);
  collisionShapeCache.set(a, aShape);
  collisionShapeCache.set(b, bShape);

  if (
    (aShape.pathPoints.length === 0 && !aShape.headPolygon) ||
    (bShape.pathPoints.length === 0 && !bShape.headPolygon) ||
    !doBoundsOverlap(aShape.bounds, bShape.bounds, ANNOTATION_STROKE_WIDTH)
  ) {
    return false;
  }

  return (
    doPathStrokesOverlap(aShape.pathPoints, bShape.pathPoints) ||
    (aShape.headPolygon
      ? doesPathStrokeOverlapPolygon(bShape.pathPoints, aShape.headPolygon)
      : false) ||
    (bShape.headPolygon
      ? doesPathStrokeOverlapPolygon(aShape.pathPoints, bShape.headPolygon)
      : false) ||
    (aShape.headPolygon && bShape.headPolygon
      ? doPolygonsOverlap(aShape.headPolygon, bShape.headPolygon)
      : false)
  );
};

const getHowFarAwayFromBottomOrTop = (
  annotation: TurningPointAnnotation,
  path: PreparedTracingPath
): number => {
  const turnPoint = getPreparedPointAtOverallDistance(path, annotation.source.turnDistance);
  return Math.min(
    Math.abs(turnPoint.y - path.bounds.minY),
    Math.abs(path.bounds.maxY - turnPoint.y)
  );
};

const compareTurningPointPriority = (
  a: TurningPointAnnotation,
  b: TurningPointAnnotation,
  path: PreparedTracingPath
): number => {
  const priorityDifference =
    getHowFarAwayFromBottomOrTop(a, path) - getHowFarAwayFromBottomOrTop(b, path);
  if (Math.abs(priorityDifference) > 0.001) {
    return priorityDifference;
  }

  return a.source.turnDistance - b.source.turnDistance;
};

const transformAnnotationCommand = (
  command: AnnotationPathCommand,
  sourceAnchor: Point,
  targetAnchor: Point,
  angleRadians: number
): AnnotationPathCommand => {
  if (command.type === "move") {
    return {
      type: "move",
      to: transformPoint(command.to, sourceAnchor, targetAnchor, angleRadians)
    };
  }

  if (command.type === "line") {
    return {
      type: "line",
      to: transformPoint(command.to, sourceAnchor, targetAnchor, angleRadians)
    };
  }

  return {
    type: "cubic",
    cp1: transformPoint(command.cp1, sourceAnchor, targetAnchor, angleRadians),
    cp2: transformPoint(command.cp2, sourceAnchor, targetAnchor, angleRadians),
    to: transformPoint(command.to, sourceAnchor, targetAnchor, angleRadians)
  };
};

const relocateTurningPointAnnotation = (
  annotation: TurningPointAnnotation,
  path: PreparedTracingPath
): TurningPointRelocation => {
  const totalLength = getTotalPreparedPathLength(path);
  const sourcePose = getPreparedPoseAtOverallDistance(
    path,
    annotation.source.turnDistance,
    "forward"
  );
  const targetDistance = Math.max(
    annotation.source.turnDistance,
    Math.min(totalLength, annotation.source.endDistance)
  );
  const targetPose = getPreparedPoseAtOverallDistance(path, targetDistance, "backward");
  const sourceAnchor = sourcePose.point;
  const targetAnchor = targetPose.point;
  const angleRadians =
    Math.atan2(targetPose.tangent.y, targetPose.tangent.x) -
    Math.atan2(sourcePose.tangent.y, sourcePose.tangent.x);
  const distanceShift = targetDistance - annotation.source.turnDistance;

  return {
    annotation: {
      ...annotation,
      commands: annotation.commands.map((command) =>
        transformAnnotationCommand(command, sourceAnchor, targetAnchor, angleRadians)
      ),
      ...(annotation.head
        ? {
          head: {
            tip: transformPoint(
              annotation.head.tip,
              sourceAnchor,
              targetAnchor,
              angleRadians
            ),
            direction: normalizeVector(rotateVector(annotation.head.direction, angleRadians)),
            polygon: annotation.head.polygon.map((point) =>
              transformPoint(point, sourceAnchor, targetAnchor, angleRadians)
            )
          }
        }
        : {}),
      source: {
        ...annotation.source,
        startDistance: Math.min(totalLength, annotation.source.startDistance + distanceShift),
        turnDistance: targetDistance,
        endDistance: Math.min(totalLength, annotation.source.endDistance + distanceShift)
      }
    },
    distanceShift,
    targetDistance,
    targetPose
  };
};

const relocateDrawOrderNumberAnnotation = (
  annotation: DrawOrderNumberAnnotation,
  relocation: TurningPointRelocation,
  totalLength: number
): DrawOrderNumberAnnotation => ({
  ...annotation,
  point: relocation.targetPose.point,
  anchor: offsetPosePoint(relocation.targetPose, annotation.metrics.offset),
  direction: relocation.targetPose.tangent,
  source: {
    ...annotation.source,
    startDistance: Math.min(totalLength, annotation.source.startDistance + relocation.distanceShift),
    endDistance: Math.min(totalLength, annotation.source.endDistance + relocation.distanceShift),
    distance: relocation.targetDistance
  }
});

const relocateOverlappingTurningPointAnnotations = (
  annotations: FormationAnnotation[],
  path: PreparedTracingPath
): FormationAnnotation[] => {
  const turningPointAnnotations = annotations.filter(isTurningPointAnnotation);
  if (turningPointAnnotations.length < 2) {
    return annotations;
  }

  const collisionShapeCache = new Map<ArrowAnnotation, AnnotationCollisionShape>();
  const relocatedAnnotations = new Map<TurningPointAnnotation, TurningPointRelocation>();
  const prioritySortedTurningPoints = [...turningPointAnnotations].sort((a, b) =>
    compareTurningPointPriority(a, b, path)
  );
  const priorityAnnotations: TurningPointAnnotation[] = [];

  prioritySortedTurningPoints.forEach((annotation) => {
    const overlapsHigherPriorityAnnotation = priorityAnnotations.some((priorityAnnotation) =>
      doAnnotationShapesOverlap(annotation, priorityAnnotation, collisionShapeCache)
    );

    if (overlapsHigherPriorityAnnotation) {
      relocatedAnnotations.set(annotation, relocateTurningPointAnnotation(annotation, path));
      return;
    }

    priorityAnnotations.push(annotation);
  });

  if (relocatedAnnotations.size === 0) {
    return annotations;
  }

  const totalLength = getTotalPreparedPathLength(path);
  const relocatedAnnotationsBySectionIndex = new Map<number, TurningPointRelocation>();
  relocatedAnnotations.forEach((relocation, annotation) => {
    relocatedAnnotationsBySectionIndex.set(annotation.source.sectionIndex, relocation);
  });

  return annotations.map((annotation) => {
    if (isTurningPointAnnotation(annotation)) {
      return relocatedAnnotations.get(annotation)?.annotation ?? annotation;
    }

    if (isDrawOrderNumberAnnotation(annotation)) {
      const relocation = relocatedAnnotationsBySectionIndex.get(annotation.source.sectionIndex);
      return relocation
        ? relocateDrawOrderNumberAnnotation(annotation, relocation, totalLength)
        : annotation;
    }

    return annotation;
  });
};

const resolveVisibleFormationAnnotations = (
  annotations: FormationAnnotation[],
  path: PreparedTracingPath
): FormationAnnotation[] => {
  const visibleAnnotations = relocateOverlappingTurningPointAnnotations(
    annotations.filter((annotation) => annotationVisibility[annotation.kind]),
    path
  );
  const turningPointAnnotations = visibleAnnotations.filter(isTurningPointAnnotation);
  const straightArrowAnnotations = visibleAnnotations
    .filter(isStraightArrowAnnotation)
    .sort((a, b) => getAnnotationPathDistance(a) - getAnnotationPathDistance(b));
  const collisionShapeCache = new Map<ArrowAnnotation, AnnotationCollisionShape>();
  const keptStraightArrowAnnotations: StraightArrowAnnotation[] = [];
  const hiddenAnnotations = new Set<FormationAnnotation>();

  straightArrowAnnotations.forEach((annotation) => {
    const overlapsTurningPoint = turningPointAnnotations.some((turnAnnotation) =>
      doAnnotationShapesOverlap(annotation, turnAnnotation, collisionShapeCache)
    );

    if (overlapsTurningPoint) {
      hiddenAnnotations.add(annotation);
      return;
    }

    const overlapsEarlierStraightArrow = keptStraightArrowAnnotations.some((keptAnnotation) =>
      doAnnotationShapesOverlap(annotation, keptAnnotation, collisionShapeCache)
    );

    if (overlapsEarlierStraightArrow) {
      hiddenAnnotations.add(annotation);
      return;
    }

    keptStraightArrowAnnotations.push(annotation);
  });

  return visibleAnnotations.filter((annotation) => !hiddenAnnotations.has(annotation));
};

const getNumberRenderAnchor = (annotation: DrawOrderNumberAnnotation): Point => {
  const direction = normalizeVector(annotation.direction);
  return {
    x: annotation.anchor.x + direction.x * currentNumberPathOffset,
    y: annotation.anchor.y + direction.y * currentNumberPathOffset
  };
};

const renderAnnotationMarkup = (annotation: FormationAnnotation): string => {
  if (!annotationVisibility[annotation.kind]) {
    return "";
  }

  if (annotation.kind === "draw-order-number") {
    const numberAnchor = getNumberRenderAnchor(annotation);
    return `
      <g class="writing-app__annotation-number-badge">
        <text
          class="writing-app__annotation-number"
          x="${numberAnchor.x}"
          y="${numberAnchor.y}"
          fill="${currentNumberColor}"
          font-size="${currentNumberSize}"
          text-anchor="middle"
          dominant-baseline="central"
        >${escapeSvgText(annotation.text)}</text>
      </g>
    `;
  }

  return `
    <path
      class="${getAnnotationClassName(annotation)}"
      d="${annotationCommandsToSvgPathData(annotation.commands)}"
    ></path>
    ${getAnnotationHeads(annotation)
      .map(
        (head) =>
          `<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--formation writing-app__section-arrowhead--${annotation.kind}" points="${buildSvgPoints(head.polygon)}"></polygon>`
      )
      .join("")}
  `;
};

const normalizeGuideValue = (
  value: number,
  sourceGuides: LetterGuides,
  targetGuides: LetterGuides
): number => {
  const sourceDelta = sourceGuides.xHeight - sourceGuides.baseline;
  const targetDelta = targetGuides.xHeight - targetGuides.baseline;
  const scale = sourceDelta !== 0 ? targetDelta / sourceDelta : 1;
  const offset = targetGuides.baseline - sourceGuides.baseline * scale;
  return value * scale + offset;
};

const getWordGuideFromMetadata = (
  text: string,
  targetGuides: LetterGuides,
  kind: "ascender" | "descender"
): number | null => {
  let observedGuide = kind === "ascender" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  let previousExitVariant: keyof typeof cursiveEntryVariantByExitVariant | null = null;

  for (const rawChar of text) {
    if (rawChar.trim() === "") {
      previousExitVariant = null;
      continue;
    }

    const char = rawChar.toLowerCase();
    const entryVariant =
      previousExitVariant === null
        ? defaultCursiveEntryVariant
        : cursiveEntryVariantByExitVariant[previousExitVariant];
    const letter = getCursiveLetterVariant(char, entryVariant);
    if (!letter) {
      previousExitVariant = null;
      continue;
    }

    const sourceGuides = letter.guides;
    const guideValue = sourceGuides?.[kind];
    if (sourceGuides && typeof guideValue === "number") {
      const normalizedGuide = normalizeGuideValue(guideValue, sourceGuides, targetGuides);
      if (kind === "ascender") {
        observedGuide = Math.min(observedGuide, normalizedGuide);
      } else {
        observedGuide = Math.max(observedGuide, normalizedGuide);
      }
    }

    previousExitVariant = cursiveExitVariantByLetter[char] ?? "low";
  }

  return Number.isFinite(observedGuide) ? observedGuide : null;
};

const getGuideLineY = (
  path: WritingPath,
  offsetY: number,
  kind: "baseline" | "xHeight" | "ascender" | "descender"
): number => {
  const guides = path.guides;
  const halfStrokeWidth = currentStrokeWidth / 2;
  const guideHeight = Math.abs(guides.baseline - guides.xHeight);

  if (kind === "baseline") {
    return guides.baseline + offsetY + halfStrokeWidth;
  }

  if (kind === "xHeight") {
    return guides.xHeight + offsetY - halfStrokeWidth;
  }

  if (kind === "ascender") {
    const observedAscenderGuide = getWordGuideFromMetadata(currentWord, guides, "ascender");
    if (observedAscenderGuide !== null) {
      return observedAscenderGuide + offsetY - halfStrokeWidth;
    }

    const ascenderGuide =
      guides.ascender ?? guides.xHeight - Math.abs(guideHeight) * 0.63;
    return ascenderGuide + offsetY - halfStrokeWidth;
  }

  const observedDescenderGuide = getWordGuideFromMetadata(currentWord, guides, "descender");
  if (observedDescenderGuide !== null) {
    return observedDescenderGuide + offsetY + halfStrokeWidth;
  }

  const descenderGuide =
    guides.descender ?? guides.baseline + Math.abs(guideHeight) * 0.66;
  return descenderGuide + offsetY + halfStrokeWidth;
};

const renderGuideLines = (path: WritingPath, width: number, offsetY: number): string => {
  const guideStyle = `stroke: ${currentGridlineColor}; stroke-width: ${currentGridlineStrokeWidth};`;

  return `
    ${showBaselineGuide ? `
      <line
        class="writing-app__guide"
        x1="0"
        y1="${getGuideLineY(path, offsetY, "baseline")}"
        x2="${width}"
        y2="${getGuideLineY(path, offsetY, "baseline")}"
        style="${guideStyle}"
      ></line>
    ` : ""}
    ${showDescenderGuide ? `
      <line
        class="writing-app__guide"
        x1="0"
        y1="${getGuideLineY(path, offsetY, "descender")}"
        x2="${width}"
        y2="${getGuideLineY(path, offsetY, "descender")}"
        style="${guideStyle}"
      ></line>
    ` : ""}
    ${showXHeightGuide ? `
      <line
        class="writing-app__guide"
        x1="0"
        y1="${getGuideLineY(path, offsetY, "xHeight")}"
        x2="${width}"
        y2="${getGuideLineY(path, offsetY, "xHeight")}"
        style="${guideStyle}"
      ></line>
    ` : ""}
    ${showAscenderGuide ? `
      <line
        class="writing-app__guide"
        x1="0"
        y1="${getGuideLineY(path, offsetY, "ascender")}"
        x2="${width}"
        y2="${getGuideLineY(path, offsetY, "ascender")}"
        style="${guideStyle}"
      ></line>
    ` : ""}
  `;
};

const updateSuccessVisibility = (isVisible: boolean) => {
  successOverlay.hidden = !isVisible;
};

const stopDemoAnimation = () => {
  if (demoAnimationFrameId !== null) {
    cancelAnimationFrame(demoAnimationFrameId);
    demoAnimationFrameId = null;
  }

  isDemoPlaying = false;
  showMeButton.disabled = false;
  showMeButton.textContent = "Animate";

  demoStrokeEls.forEach((el, index) => {
    const length = demoStrokeLengths[index] ?? 0.001;
    el.style.strokeDasharray = `${length} ${length}`;
    el.style.strokeDashoffset = `${length}`;
  });

  if (demoNibEl) {
    demoNibEl.style.opacity = "0";
  }

  requestTraceRender();
};

const resetTraceProgress = () => {
  tracingSession?.reset();
  activePointerId = null;
  updateSuccessVisibility(false);

  traceStrokeEls.forEach((el, index) => {
    const length = traceStrokeLengths[index] ?? 0.001;
    el.style.strokeDasharray = `${length} ${length}`;
    el.style.strokeDashoffset = `${length}`;
  });

  requestTraceRender();
};

const requestTraceRender = () => {
  if (traceRenderQueued) {
    return;
  }

  traceRenderQueued = true;
  requestAnimationFrame(() => {
    traceRenderQueued = false;
    renderTraceFrame();
  });
};

const getOverallDistanceForState = (
  state: Pick<TracingState, "status" | "activeStrokeIndex" | "activeStrokeProgress">
): number => {
  if (!preparedTracingPath) {
    return 0;
  }

  if (state.status === "complete") {
    return preparedTracingPath.strokes.reduce((sum, stroke) => sum + stroke.totalLength, 0);
  }

  let total = 0;
  for (let index = 0; index < state.activeStrokeIndex; index += 1) {
    total += preparedTracingPath.strokes[index]?.totalLength ?? 0;
  }

  const activeStroke = preparedTracingPath.strokes[state.activeStrokeIndex];
  return total + (activeStroke?.totalLength ?? 0) * state.activeStrokeProgress;
};

const getCommittedCursorTangent = (state: TracingState) => {
  if (!preparedTracingPath) {
    return state.cursorTangent;
  }

  const overallDistance = getOverallDistanceForState(state);
  const activeTurnBoundary = [...preparedTracingPath.boundaries]
    .reverse()
    .find(
      (boundary) =>
        boundary.previousSegment !== boundary.nextSegment &&
        boundary.turnAngleDegrees >= 150 &&
        overallDistance >= boundary.overallDistance - TRACE_CURSOR_TURN_LOOKAHEAD_DISTANCE &&
        overallDistance - boundary.overallDistance < TRACE_CURSOR_TURN_COMMIT_DISTANCE
    );

  return activeTurnBoundary?.outgoingTangent ?? state.cursorTangent;
};

const renderTraceFrame = () => {
  if (!tracingSession || !traceCursorEl) {
    return;
  }

  const state = tracingSession.getState();
  const cursorTangent = getCommittedCursorTangent(state);
  const angle = Math.atan2(cursorTangent.y, cursorTangent.x) * (180 / Math.PI);

  traceCursorEl.setAttribute(
    "transform",
    `translate(${state.cursorPoint.x}, ${state.cursorPoint.y}) rotate(${angle})`
  );
  traceCursorEl.style.opacity = isDemoPlaying ? "0" : "1";

  const completed = new Set(state.completedStrokes);
  traceStrokeEls.forEach((el, index) => {
    const length = traceStrokeLengths[index] ?? 0;
    if (completed.has(index)) {
      el.style.strokeDashoffset = "0";
      return;
    }
    if (index === state.activeStrokeIndex) {
      const remaining = length * (1 - state.activeStrokeProgress);
      el.style.strokeDashoffset = `${Math.max(0, remaining)}`;
      return;
    }
    el.style.strokeDashoffset = `${length}`;
  });

  updateSuccessVisibility(state.status === "complete");
};

const playDemo = () => {
  if (!currentPath || isDemoPlaying) {
    return;
  }

  resetTraceProgress();
  stopDemoAnimation();

  const player = new AnimationPlayer(currentPath, {
    speed: 1.7,
    penUpSpeed: 2.1,
    deferredDelayMs: 150
  });

  isDemoPlaying = true;
  showMeButton.disabled = true;
  showMeButton.textContent = "Showing...";

  const startedAt = performance.now();

  const tick = (now: number) => {
    const elapsed = now - startedAt;
    const clampedElapsed = Math.min(elapsed, player.totalDuration);
    const frame = player.getFrame(clampedElapsed);
    const completed = new Set(frame.completedStrokes);

    traceStrokeEls.forEach((el, index) => {
      const length = traceStrokeLengths[index] ?? 0.001;
      if (completed.has(index)) {
        el.style.strokeDashoffset = "0";
        return;
      }
      if (index === frame.activeStrokeIndex) {
        const remaining = length * (1 - frame.activeStrokeProgress);
        el.style.strokeDashoffset = `${Math.max(0, remaining)}`;
        return;
      }
      el.style.strokeDashoffset = `${length}`;
    });

    if (demoNibEl) {
      demoNibEl.setAttribute("cx", frame.point.x.toFixed(2));
      demoNibEl.setAttribute("cy", frame.point.y.toFixed(2));
      demoNibEl.style.opacity = elapsed <= player.totalDuration + DEMO_PAUSE_MS ? "1" : "0";
    }

    if (elapsed < player.totalDuration + DEMO_PAUSE_MS) {
      demoAnimationFrameId = requestAnimationFrame(tick);
      return;
    }

    stopDemoAnimation();
    resetTraceProgress();
  };

  demoAnimationFrameId = requestAnimationFrame(tick);
  requestTraceRender();
};

const setupScene = (path: WritingPath, width: number, height: number, offsetY: number) => {
  const preparedPath = compileTracingPath(path);
  preparedTracingPath = preparedPath;
  tracingSession = new TracingSession(preparedPath, {
    startTolerance: currentTraceTolerance,
    hitTolerance: currentTraceTolerance
  });
  activePointerId = null;

  const drawableStrokes = path.strokes.filter((stroke) => stroke.type !== "lift");
  const backgroundPaths = drawableStrokes
    .map(
      (stroke) =>
        `<path class="writing-app__stroke-bg" d="${buildPathD(stroke.curves)}" style="stroke-width: ${currentStrokeWidth}; stroke: ${currentWordStrokeColor};"></path>`
    )
    .join("");
  const tracePaths = drawableStrokes
    .map(
      (stroke) =>
        `<path class="writing-app__stroke-trace" d="${buildPathD(stroke.curves)}" style="stroke-width: ${currentStrokeWidth};"></path>`
    )
    .join("");
  const demoPaths = drawableStrokes
    .map(
      (stroke) =>
        `<path class="writing-app__stroke-demo" d="${buildPathD(stroke.curves)}" style="stroke-width: ${currentStrokeWidth};"></path>`
    )
    .join("");
  const arrowLaneOffset = shouldOffsetArrowLanes ? currentTurnRadius : 0;
  const arrowLaneOffsetMode = shouldAlwaysOffsetArrowLanes ? "always" : "bidirectional-only";
  const annotations = compileFormationAnnotations(preparedPath, {
    directionalDashes: annotationVisibility["directional-dash"]
      ? {
        spacing: currentDirectionalDashSpacing,
        head: {
          length: currentArrowHeadSize,
          width: currentArrowHeadSize * ARROWHEAD_WIDTH_RATIO,
          tipExtension: currentArrowHeadSize * ARROWHEAD_TIP_OVERHANG_RATIO
        }
      }
      : false,
    turningPoints: annotationVisibility["turning-point"]
      ? {
        offset: currentTurnRadius,
        stemLength: currentUTurnLength * STRAIGHT_ARROW_LENGTH_RATIO,
        head: {
          length: currentArrowHeadSize,
          width: currentArrowHeadSize * ARROWHEAD_WIDTH_RATIO,
          tipExtension: currentArrowHeadSize * ARROWHEAD_TIP_OVERHANG_RATIO
        }
      }
      : false,
    startArrows: annotationVisibility["start-arrow"]
      ? {
        length: currentArrowLength,
        minLength: currentArrowLength * START_ARROW_MIN_LENGTH_RATIO,
        offset: arrowLaneOffset,
        offsetMode: arrowLaneOffsetMode,
        head: {
          length: currentArrowHeadSize,
          width: currentArrowHeadSize * ARROWHEAD_WIDTH_RATIO,
          tipExtension: currentArrowHeadSize * ARROWHEAD_TIP_OVERHANG_RATIO
        }
      }
      : false,
    drawOrderNumbers: annotationVisibility["draw-order-number"]
      ? {
        offset: 0
      }
      : false,
    midpointArrows: annotationVisibility["midpoint-arrow"]
      ? {
        density: currentMidpointDensity,
        length: currentArrowLength * STRAIGHT_ARROW_LENGTH_RATIO,
        offset: arrowLaneOffset,
        offsetMode: arrowLaneOffsetMode,
        head: {
          length: currentArrowHeadSize,
          width: currentArrowHeadSize * ARROWHEAD_WIDTH_RATIO,
          tipExtension: currentArrowHeadSize * ARROWHEAD_TIP_OVERHANG_RATIO
        }
      }
      : false
  });
  const visibleAnnotations = resolveVisibleFormationAnnotations(annotations, preparedPath);
  const annotationMarkup = [
    ...visibleAnnotations.filter((annotation) => annotation.kind !== "draw-order-number"),
    ...visibleAnnotations.filter((annotation) => annotation.kind === "draw-order-number")
  ]
    .map(renderAnnotationMarkup)
    .join("");

  traceSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  traceSvg.style.setProperty("--formation-arrow-color", currentArrowColor);
  traceSvg.style.setProperty("--formation-arrow-stroke-width", String(currentArrowStrokeWidth));
  traceSvg.innerHTML = `
    <rect class="writing-app__bg" x="0" y="0" width="${width}" height="${height}"></rect>
    ${renderGuideLines(path, width, offsetY)}
    ${backgroundPaths}
    ${tracePaths}
    ${annotationMarkup}
    ${demoPaths}
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
    <g class="writing-app__cursor" id="trace-cursor">
      <circle class="writing-app__cursor-bg" cx="0" cy="0" r="34"></circle>
      <polygon class="writing-app__cursor-arrow" points="18,0 -12,-14 -6,0 -12,14"></polygon>
    </g>
  `;

  traceStrokeEls = Array.from(
    traceSvg.querySelectorAll<SVGPathElement>(".writing-app__stroke-trace")
  );
  demoStrokeEls = Array.from(
    traceSvg.querySelectorAll<SVGPathElement>(".writing-app__stroke-demo")
  );
  traceCursorEl = traceSvg.querySelector<SVGGElement>("#trace-cursor");
  demoNibEl = traceSvg.querySelector<SVGCircleElement>("#demo-nib");

  traceStrokeLengths = traceStrokeEls.map((el) => {
    const length = el.getTotalLength();
    return Number.isFinite(length) && length > 0 ? length : 0.001;
  });
  demoStrokeLengths = demoStrokeEls.map((el) => {
    const length = el.getTotalLength();
    return Number.isFinite(length) && length > 0 ? length : 0.001;
  });

  traceStrokeEls.forEach((el, index) => {
    const length = traceStrokeLengths[index] ?? 0.001;
    el.style.strokeDasharray = `${length} ${length}`;
    el.style.strokeDashoffset = `${length}`;
  });
  demoStrokeEls.forEach((el, index) => {
    const length = demoStrokeLengths[index] ?? 0.001;
    el.style.strokeDasharray = `${length} ${length}`;
    el.style.strokeDashoffset = `${length}`;
  });

  if (demoNibEl) {
    demoNibEl.style.opacity = "0";
  }

  updateSuccessVisibility(false);
  requestTraceRender();
};

const clearScene = () => {
  stopDemoAnimation();
  currentPath = null;
  preparedTracingPath = null;
  tracingSession = null;
  activePointerId = null;
  traceStrokeEls = [];
  traceStrokeLengths = [];
  traceCursorEl = null;
  demoStrokeEls = [];
  demoStrokeLengths = [];
  demoNibEl = null;
  traceSvg.innerHTML = "";
  updateSuccessVisibility(false);
};

const renderWord = (word: string) => {
  stopDemoAnimation();
  currentWord = normalizeWord(word);
  wordInput.value = currentWord;
  syncSettingsUrl();

  if (currentWord.length === 0) {
    clearScene();
    return;
  }

  let layout: ReturnType<typeof buildShiftedWordLayout>;
  try {
    layout = buildShiftedWordLayout(currentWord, {
      joinSpacing: currentJoinSpacing,
      keepInitialLeadIn: includeInitialLeadIn,
      keepFinalLeadOut: includeFinalLeadOut
    });
  } catch {
    clearScene();
    return;
  }

  currentPath = layout.path;
  setupScene(layout.path, layout.width, layout.height, layout.offsetY);
};

const goToNextWord = () => {
  currentWordIndex = chooseNextWordIndex(currentWordIndex);
  const nextWord = WORDS[currentWordIndex] ?? WORDS[0];
  renderWord(nextWord);
};

const onPointerDown = (event: PointerEvent) => {
  if (isDemoPlaying || !tracingSession || activePointerId !== null) {
    return;
  }

  const started = tracingSession.beginAt(getPointerInSvg(traceSvg, event));
  if (!started) {
    return;
  }

  event.preventDefault();
  activePointerId = event.pointerId;
  traceSvg.setPointerCapture(event.pointerId);
  requestTraceRender();
};

const onPointerMove = (event: PointerEvent) => {
  if (isDemoPlaying || !tracingSession || event.pointerId !== activePointerId) {
    return;
  }

  event.preventDefault();
  tracingSession.update(getPointerInSvg(traceSvg, event));
  requestTraceRender();
};

const onPointerUp = (event: PointerEvent) => {
  if (!tracingSession || event.pointerId !== activePointerId) {
    return;
  }

  tracingSession.end();
  if (traceSvg.hasPointerCapture(event.pointerId)) {
    traceSvg.releasePointerCapture(event.pointerId);
  }
  activePointerId = null;
  requestTraceRender();
};

const onPointerCancel = (event: PointerEvent) => {
  if (event.pointerId !== activePointerId) {
    return;
  }

  tracingSession?.end();
  if (traceSvg.hasPointerCapture(event.pointerId)) {
    traceSvg.releasePointerCapture(event.pointerId);
  }
  activePointerId = null;
  requestTraceRender();
};

traceSvg.addEventListener("pointerdown", onPointerDown);
traceSvg.addEventListener("pointermove", onPointerMove);
traceSvg.addEventListener("pointerup", onPointerUp);
traceSvg.addEventListener("pointercancel", onPointerCancel);
showMeButton.addEventListener("click", playDemo);
nextWordButton.addEventListener("click", goToNextWord);
wordInput.addEventListener("input", () => {
  renderWord(wordInput.value);
});

const rerenderFromSettings = () => {
  syncLabels();
  syncSettingsUrl();
  renderWord(currentWord);
};

toleranceSlider.addEventListener("input", () => {
  currentTraceTolerance = Number(toleranceSlider.value);
  rerenderFromSettings();
});
strokeWidthSlider.addEventListener("input", () => {
  currentStrokeWidth = Number(strokeWidthSlider.value);
  rerenderFromSettings();
});
gridlineStrokeWidthSlider.addEventListener("input", () => {
  currentGridlineStrokeWidth = Number(gridlineStrokeWidthSlider.value);
  rerenderFromSettings();
});
gridlineColorPicker.addEventListener("input", () => {
  const nextColor = normalizeColor(gridlineColorPicker.value);
  if (!nextColor) {
    return;
  }

  currentGridlineColor = nextColor;
  rerenderFromSettings();
});
showBaselineGuideToggle.addEventListener("change", () => {
  showBaselineGuide = showBaselineGuideToggle.checked;
  rerenderFromSettings();
});
showDescenderGuideToggle.addEventListener("change", () => {
  showDescenderGuide = showDescenderGuideToggle.checked;
  rerenderFromSettings();
});
showXHeightGuideToggle.addEventListener("change", () => {
  showXHeightGuide = showXHeightGuideToggle.checked;
  rerenderFromSettings();
});
showAscenderGuideToggle.addEventListener("change", () => {
  showAscenderGuide = showAscenderGuideToggle.checked;
  rerenderFromSettings();
});
targetBendRateSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    targetBendRate: Number(targetBendRateSlider.value)
  };
  rerenderFromSettings();
});
minSidebearingGapSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    minSidebearingGap: Number(minSidebearingGapSlider.value)
  };
  rerenderFromSettings();
});
bendSearchMinSidebearingGapSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    bendSearchMinSidebearingGap: Number(bendSearchMinSidebearingGapSlider.value)
  };
  rerenderFromSettings();
});
bendSearchMaxSidebearingGapSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    bendSearchMaxSidebearingGap: Number(bendSearchMaxSidebearingGapSlider.value)
  };
  rerenderFromSettings();
});
exitHandleScaleSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    exitHandleScale: Number(exitHandleScaleSlider.value)
  };
  rerenderFromSettings();
});
entryHandleScaleSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    entryHandleScale: Number(entryHandleScaleSlider.value)
  };
  rerenderFromSettings();
});
includeInitialLeadInToggle.addEventListener("change", () => {
  includeInitialLeadIn = includeInitialLeadInToggle.checked;
  rerenderFromSettings();
});
includeFinalLeadOutToggle.addEventListener("change", () => {
  includeFinalLeadOut = includeFinalLeadOutToggle.checked;
  rerenderFromSettings();
});
midpointDensitySlider.addEventListener("input", () => {
  currentMidpointDensity = Number(midpointDensitySlider.value);
  rerenderFromSettings();
});
directionalDashSpacingSlider.addEventListener("input", () => {
  currentDirectionalDashSpacing = Number(directionalDashSpacingSlider.value);
  rerenderFromSettings();
});
turnRadiusSlider.addEventListener("input", () => {
  currentTurnRadius = Number(turnRadiusSlider.value);
  rerenderFromSettings();
});
uTurnLengthSlider.addEventListener("input", () => {
  currentUTurnLength = Number(uTurnLengthSlider.value);
  rerenderFromSettings();
});
arrowLengthSlider.addEventListener("input", () => {
  currentArrowLength = Number(arrowLengthSlider.value);
  rerenderFromSettings();
});
arrowHeadSizeSlider.addEventListener("input", () => {
  currentArrowHeadSize = Number(arrowHeadSizeSlider.value);
  rerenderFromSettings();
});
arrowStrokeWidthSlider.addEventListener("input", () => {
  currentArrowStrokeWidth = Number(arrowStrokeWidthSlider.value);
  rerenderFromSettings();
});
numberSizeSlider.addEventListener("input", () => {
  currentNumberSize = Number(numberSizeSlider.value);
  rerenderFromSettings();
});
numberOffsetSlider.addEventListener("input", () => {
  currentNumberPathOffset = Number(numberOffsetSlider.value);
  rerenderFromSettings();
});
offsetArrowLanesToggle.addEventListener("change", () => {
  shouldOffsetArrowLanes = offsetArrowLanesToggle.checked;
  rerenderFromSettings();
});
alwaysOffsetArrowLanesToggle.addEventListener("change", () => {
  shouldAlwaysOffsetArrowLanes = alwaysOffsetArrowLanesToggle.checked;
  rerenderFromSettings();
});
wordStrokeColorPicker.addEventListener("input", () => {
  const nextColor = normalizeColor(wordStrokeColorPicker.value);
  if (!nextColor) {
    return;
  }

  currentWordStrokeColor = nextColor;
  rerenderFromSettings();
});
numberColorPicker.addEventListener("input", () => {
  const nextColor = normalizeColor(numberColorPicker.value);
  if (!nextColor) {
    return;
  }

  currentNumberColor = nextColor;
  rerenderFromSettings();
});
arrowColorPicker.addEventListener("input", () => {
  const nextArrowColor = normalizeColor(arrowColorPicker.value);
  if (!nextArrowColor) {
    return;
  }

  currentArrowColor = nextArrowColor;
  rerenderFromSettings();
});
annotationToggleEls.forEach((toggleEl) => {
  toggleEl.addEventListener("change", () => {
    const annotationKind = toggleEl.dataset.annotationKind as FormationAnnotation["kind"] | undefined;
    if (!annotationKind) {
      return;
    }

    annotationVisibility = {
      ...annotationVisibility,
      [annotationKind]: toggleEl.checked
    };
    rerenderFromSettings();
  });
});

applyUrlSettings();
renderWord(currentWord);
