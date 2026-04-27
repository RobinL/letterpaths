import "./style.css";
import {
  compileTracingPath,
  type Point,
  type PreparedTracingPath,
  type WritingPath
} from "letterpaths";
import {
  DEFAULT_TRACE_TOLERANCE,
  MAX_TRACE_TOLERANCE,
  MIN_TRACE_TOLERANCE,
  TRACE_TOLERANCE_STEP,
  WORDS,
  buildPathD,
  buildShiftedWordLayout,
  chooseNextWordIndex,
  getPointerInSvg
} from "./shared";

const DEFAULT_WORD = "zephyr";
const FREEHAND_SAMPLE_RATE = 28;
const DEFAULT_TOLERANCE = DEFAULT_TRACE_TOLERANCE;
const TOLERANCE_GATE_DEPTH = 12;
const URL_PARAM_KEYS = ["word", "tolerance"] as const;

type Checkpoint = Point & {
  tangent: Point;
  strokeIndex: number;
  sampleIndex: number;
  completed: boolean;
  error: number | null;
};

type DrawnStroke = {
  points: Point[];
  pathEl: SVGPathElement;
};

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app element for freehand tracing app.");
}

app.innerHTML = `
  <div class="writing-app writing-app--freehand">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar writing-app__topbar--freehand">
          <div class="writing-app__title">
            <p class="writing-app__eyebrow">Freehand tracing</p>
            <label class="writing-app__word-input-label" for="word-input">
              <span>Enter word</span>
              <input
                class="writing-app__word-input"
                id="word-input"
                type="text"
                value="${DEFAULT_WORD}"
                placeholder="${DEFAULT_WORD}"
                spellcheck="false"
                autocomplete="off"
              />
            </label>
          </div>
          <div class="writing-app__score-card" aria-live="polite">
            <span class="writing-app__score-label">Score</span>
            <span class="writing-app__score-value" id="score-value">--</span>
          </div>
          <div class="writing-app__score-card" aria-live="polite">
            <span class="writing-app__score-label">Progress</span>
            <span class="writing-app__score-value" id="progress-value">0%</span>
          </div>
          <div class="writing-app__topbar-actions">
            <button class="writing-app__button writing-app__button--secondary" id="reset-button" type="button">
              Reset
            </button>
            <details class="writing-app__settings" id="settings-menu">
              <summary
                class="writing-app__icon-button"
                id="settings-button"
                aria-label="Settings"
                title="Settings"
              >⚙</summary>
              <div class="writing-app__settings-panel">
                <label class="writing-app__settings-field" for="tolerance-slider">
                  <span class="writing-app__settings-label">
                    Tolerance
                    <span class="writing-app__tolerance-value" id="tolerance-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="tolerance-slider"
                    type="range"
                    min="${MIN_TRACE_TOLERANCE}"
                    max="${MAX_TRACE_TOLERANCE}"
                    step="${TRACE_TOLERANCE_STEP}"
                    value="${DEFAULT_TOLERANCE}"
                  />
                </label>
              </div>
            </details>
          </div>
        </header>

        <svg
          class="writing-app__svg"
          id="freehand-svg"
          viewBox="0 0 1600 900"
          aria-label="Handwriting freehand tracing area"
        ></svg>

        <div class="writing-app__overlay" id="success-overlay" hidden>
          <div class="writing-app__success-card">
            <p class="writing-app__success-eyebrow">Trace complete</p>
            <p class="writing-app__success-copy" id="score-summary"></p>
            <div class="writing-app__success-actions">
              <button
                class="writing-app__button writing-app__button--secondary"
                id="try-again-button"
                type="button"
              >
                Try again
              </button>
              <button
                class="writing-app__button writing-app__button--next"
                id="next-word-button"
                type="button"
              >
                Next word
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
`;

const wordInput = document.querySelector<HTMLInputElement>("#word-input");
const scoreValue = document.querySelector<HTMLSpanElement>("#score-value");
const progressValue = document.querySelector<HTMLSpanElement>("#progress-value");
const toleranceSlider = document.querySelector<HTMLInputElement>("#tolerance-slider");
const toleranceValue = document.querySelector<HTMLSpanElement>("#tolerance-value");
const resetButton = document.querySelector<HTMLButtonElement>("#reset-button");
const freehandSvg = document.querySelector<SVGSVGElement>("#freehand-svg");
const successOverlay = document.querySelector<HTMLDivElement>("#success-overlay");
const scoreSummary = document.querySelector<HTMLParagraphElement>("#score-summary");
const tryAgainButton = document.querySelector<HTMLButtonElement>("#try-again-button");
const nextWordButton = document.querySelector<HTMLButtonElement>("#next-word-button");

if (
  !wordInput ||
  !scoreValue ||
  !progressValue ||
  !toleranceSlider ||
  !toleranceValue ||
  !resetButton ||
  !freehandSvg ||
  !successOverlay ||
  !scoreSummary ||
  !tryAgainButton ||
  !nextWordButton
) {
  throw new Error("Missing elements for freehand tracing app.");
}

let currentWordIndex = -1;
let currentWord = DEFAULT_WORD;
let currentTolerance = DEFAULT_TOLERANCE;
let currentPath: WritingPath | null = null;
let preparedTracingPath: PreparedTracingPath | null = null;
let checkpoints: Checkpoint[] = [];
let checkpointEls: SVGCircleElement[] = [];
let completedDotLayerEl: SVGGElement | null = null;
let remainingDotLayerEl: SVGGElement | null = null;
let toleranceGateEl: SVGRectElement | null = null;
let completedPathEl: SVGPathElement | null = null;
let userInkLayerEl: SVGGElement | null = null;
let activePointerId: number | null = null;
let activeStroke: DrawnStroke | null = null;
let lastPointerPoint: Point | null = null;
let completedCheckpointCount = 0;
let recordedErrors: number[] = [];

const normalizeWordInput = (word: string): string => word.trim().replace(/\s+/g, " ").toLowerCase();

const getSliderValuePrecision = (input: HTMLInputElement): number => {
  if (input.step === "any" || input.step.length === 0) {
    return 0;
  }

  const [, fractional = ""] = input.step.split(".");
  return fractional.length;
};

const normalizeSliderValue = (input: HTMLInputElement, value: number): number => {
  const min = Number(input.min);
  const max = Number(input.max);
  const step = input.step === "any" ? Number.NaN : Number(input.step);
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

const syncToleranceLabel = () => {
  toleranceValue.textContent = `${currentTolerance}px`;
};

const syncSettingsUrl = () => {
  const url = new URL(window.location.href);
  URL_PARAM_KEYS.forEach((key) => {
    url.searchParams.delete(key);
  });

  if (currentWord !== DEFAULT_WORD) {
    url.searchParams.set("word", currentWord);
  }
  if (currentTolerance !== DEFAULT_TOLERANCE) {
    url.searchParams.set("tolerance", String(currentTolerance));
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
  const toleranceParam = params.get("tolerance");

  if (wordParam !== null) {
    currentWord = normalizeWordInput(wordParam);
  }
  if (toleranceParam !== null) {
    const parsedTolerance = Number(toleranceParam);
    if (Number.isFinite(parsedTolerance)) {
      currentTolerance = normalizeSliderValue(toleranceSlider, parsedTolerance);
    }
  }

  wordInput.value = currentWord;
  toleranceSlider.value = String(currentTolerance);
  syncToleranceLabel();
  syncSettingsUrl();
};

const createCheckpoints = (preparedPath: PreparedTracingPath): Checkpoint[] =>
  preparedPath.strokes.flatMap((stroke, strokeIndex) =>
    stroke.samples.map((sample, sampleIndex) => ({
      x: sample.x,
      y: sample.y,
      tangent: sample.tangent,
      strokeIndex,
      sampleIndex,
      completed: false,
      error: null
    }))
  );

const pointsToPolylinePathD = (points: readonly Point[]): string => {
  if (points.length === 0) {
    return "";
  }

  const [first, ...rest] = points;
  return `M ${first.x} ${first.y}${rest.map((point) => ` L ${point.x} ${point.y}`).join("")}`;
};

const getCompletedCheckpointPathD = (): string => {
  const completedPoints = checkpoints.slice(0, completedCheckpointCount);
  let d = "";
  let previousStrokeIndex: number | null = null;

  completedPoints.forEach((checkpoint) => {
    if (checkpoint.strokeIndex !== previousStrokeIndex) {
      d += ` M ${checkpoint.x} ${checkpoint.y}`;
      previousStrokeIndex = checkpoint.strokeIndex;
      return;
    }

    d += ` L ${checkpoint.x} ${checkpoint.y}`;
  });

  return d.trim();
};

const getScore = (): number | null => {
  if (recordedErrors.length === 0) {
    return null;
  }

  const averageError =
    recordedErrors.reduce((total, error) => total + error, 0) / recordedErrors.length;
  if (averageError <= 0.5) {
    return 100;
  }
  const normalizedError = Math.min(1, averageError / currentTolerance);
  return Math.max(0, Math.round((1 - normalizedError) * 100));
};

const getPerpendicularVector = (vector: Point): Point => ({
  x: -vector.y,
  y: vector.x
});

const getDot = (a: Point, b: Point): number => a.x * b.x + a.y * b.y;

const subtractPoints = (a: Point, b: Point): Point => ({
  x: a.x - b.x,
  y: a.y - b.y
});

const interpolatePoints = (a: Point, b: Point, t: number): Point => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t
});

const getCheckpointGateHit = (
  checkpoint: Checkpoint,
  segmentStart: Point,
  segmentEnd: Point
): { distance: number; isHit: boolean } => {
  const normal = getPerpendicularVector(checkpoint.tangent);
  const startOffset = subtractPoints(segmentStart, checkpoint);
  const endOffset = subtractPoints(segmentEnd, checkpoint);
  const startAlong = getDot(startOffset, checkpoint.tangent);
  const endAlong = getDot(endOffset, checkpoint.tangent);

  if (Math.hypot(segmentEnd.x - segmentStart.x, segmentEnd.y - segmentStart.y) <= 0.001) {
    const lateralDistance = Math.abs(getDot(startOffset, normal));
    return {
      distance: lateralDistance,
      isHit: Math.abs(startAlong) <= TOLERANCE_GATE_DEPTH && lateralDistance <= currentTolerance
    };
  }

  const crossesGate =
    (startAlong <= TOLERANCE_GATE_DEPTH && endAlong >= -TOLERANCE_GATE_DEPTH) ||
    (endAlong <= TOLERANCE_GATE_DEPTH && startAlong >= -TOLERANCE_GATE_DEPTH);
  if (!crossesGate) {
    return {
      distance: Number.POSITIVE_INFINITY,
      isHit: false
    };
  }

  const alongDelta = endAlong - startAlong;
  const crossingT =
    Math.abs(alongDelta) <= 0.001
      ? 0
      : Math.max(0, Math.min(1, (0 - startAlong) / alongDelta));
  const crossingPoint = interpolatePoints(segmentStart, segmentEnd, crossingT);
  const lateralDistance = Math.abs(getDot(subtractPoints(crossingPoint, checkpoint), normal));
  return {
    distance: lateralDistance,
    isHit: lateralDistance <= currentTolerance
  };
};

const updateSuccessVisibility = (isVisible: boolean) => {
  successOverlay.hidden = !isVisible;
};

const syncProgressDisplay = () => {
  const progress =
    checkpoints.length === 0 ? 0 : Math.round((completedCheckpointCount / checkpoints.length) * 100);
  const score = getScore();
  progressValue.textContent = `${progress}%`;
  scoreValue.textContent = score === null ? "--" : `${score}`;

  completedPathEl?.setAttribute("d", getCompletedCheckpointPathD());
  checkpointEls.forEach((el, index) => {
    const checkpoint = checkpoints[index];
    const isCompleted = index < completedCheckpointCount;
    const isCurrent = index === completedCheckpointCount;

    el.classList.toggle("writing-app__freehand-dot--done", isCompleted);
    el.classList.toggle("writing-app__freehand-dot--current", isCurrent);
    if (isCompleted && el.parentElement !== completedDotLayerEl) {
      completedDotLayerEl?.append(el);
    } else if (!isCompleted && el.parentElement !== remainingDotLayerEl) {
      remainingDotLayerEl?.append(el);
    }
    if (checkpoint) {
      el.setAttribute("r", isCurrent ? "9" : "5.5");
    }
  });

  const currentCheckpoint = checkpoints[completedCheckpointCount];
  if (toleranceGateEl && currentCheckpoint) {
    const angle =
      Math.atan2(currentCheckpoint.tangent.y, currentCheckpoint.tangent.x) * (180 / Math.PI);
    toleranceGateEl.style.display = "";
    toleranceGateEl.setAttribute("x", String(-TOLERANCE_GATE_DEPTH));
    toleranceGateEl.setAttribute("y", String(-currentTolerance));
    toleranceGateEl.setAttribute("width", String(TOLERANCE_GATE_DEPTH * 2));
    toleranceGateEl.setAttribute("height", String(currentTolerance * 2));
    toleranceGateEl.setAttribute(
      "transform",
      `translate(${currentCheckpoint.x} ${currentCheckpoint.y}) rotate(${angle})`
    );
  } else if (toleranceGateEl) {
    toleranceGateEl.style.display = "none";
  }

  if (completedCheckpointCount >= checkpoints.length && checkpoints.length > 0) {
    const finalScore = getScore() ?? 0;
    const averageError =
      recordedErrors.reduce((total, error) => total + error, 0) / Math.max(1, recordedErrors.length);
    scoreSummary.textContent = `Score ${finalScore}. Average distance from the checkpoints: ${Math.round(
      averageError
    )}px.`;
    updateSuccessVisibility(true);
  }
};

const resetRoundProgress = () => {
  activePointerId = null;
  activeStroke = null;
  lastPointerPoint = null;
  completedCheckpointCount = 0;
  recordedErrors = [];
  checkpoints = checkpoints.map((checkpoint) => ({
    ...checkpoint,
    completed: false,
    error: null
  }));
  userInkLayerEl?.replaceChildren();
  updateSuccessVisibility(false);
  syncProgressDisplay();
};

const createSvgPath = (className: string): SVGPathElement => {
  const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathEl.setAttribute("class", className);
  pathEl.setAttribute("d", "");
  return pathEl;
};

const setupScene = (path: WritingPath, width: number, height: number, offsetY: number) => {
  preparedTracingPath = compileTracingPath(path, { sampleRate: FREEHAND_SAMPLE_RATE });
  checkpoints = createCheckpoints(preparedTracingPath);
  const guidePaths = path.strokes
    .filter((stroke) => stroke.type !== "lift")
    .map(
      (stroke) =>
        `<path class="writing-app__freehand-guide" d="${buildPathD(stroke.curves)}"></path>`
    )
    .join("");
  const dotMarkup = checkpoints
    .map(
      (checkpoint, index) => `
        <circle
          class="writing-app__freehand-dot"
          data-checkpoint-index="${index}"
          data-stroke-index="${checkpoint.strokeIndex}"
          data-sample-index="${checkpoint.sampleIndex}"
          cx="${checkpoint.x}"
          cy="${checkpoint.y}"
          r="5.5"
        ></circle>
      `
    )
    .join("");

  freehandSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  freehandSvg.innerHTML = `
    <rect class="writing-app__bg" x="0" y="0" width="${width}" height="${height}"></rect>
    <line
      class="writing-app__guide writing-app__guide--midline"
      x1="0"
      y1="${path.guides.xHeight + offsetY}"
      x2="${width}"
      y2="${path.guides.xHeight + offsetY}"
    ></line>
    <line
      class="writing-app__guide writing-app__guide--baseline"
      x1="0"
      y1="${path.guides.baseline + offsetY}"
      x2="${width}"
      y2="${path.guides.baseline + offsetY}"
    ></line>
    <g class="writing-app__freehand-word">${guidePaths}</g>
    <path class="writing-app__freehand-completed" id="completed-checkpoint-path" d=""></path>
    <g class="writing-app__freehand-completed-dots" id="completed-dots"></g>
    <rect class="writing-app__freehand-tolerance" id="tolerance-gate"></rect>
    <g class="writing-app__freehand-ink" id="user-ink"></g>
    <g class="writing-app__freehand-remaining-dots" id="remaining-dots">${dotMarkup}</g>
  `;

  checkpointEls = Array.from(
    freehandSvg.querySelectorAll<SVGCircleElement>(".writing-app__freehand-dot")
  );
  completedDotLayerEl = freehandSvg.querySelector<SVGGElement>("#completed-dots");
  remainingDotLayerEl = freehandSvg.querySelector<SVGGElement>("#remaining-dots");
  toleranceGateEl = freehandSvg.querySelector<SVGRectElement>("#tolerance-gate");
  completedPathEl = freehandSvg.querySelector<SVGPathElement>("#completed-checkpoint-path");
  userInkLayerEl = freehandSvg.querySelector<SVGGElement>("#user-ink");

  resetRoundProgress();
};

const renderWord = (word: string, wordIndex = -1) => {
  currentWord = normalizeWordInput(word);
  currentWordIndex = wordIndex;
  wordInput.value = currentWord;
  syncSettingsUrl();

  if (currentWord.length === 0) {
    currentPath = null;
    preparedTracingPath = null;
    checkpoints = [];
    checkpointEls = [];
    completedDotLayerEl = null;
    remainingDotLayerEl = null;
    toleranceGateEl = null;
    completedPathEl = null;
    userInkLayerEl = null;
    freehandSvg.innerHTML = "";
    syncProgressDisplay();
    updateSuccessVisibility(false);
    return;
  }

  try {
    const layout = buildShiftedWordLayout(currentWord);
    currentPath = layout.path;
    setupScene(layout.path, layout.width, layout.height, layout.offsetY);
  } catch {
    currentPath = null;
    preparedTracingPath = null;
    checkpoints = [];
    checkpointEls = [];
    completedDotLayerEl = null;
    remainingDotLayerEl = null;
    toleranceGateEl = null;
    completedPathEl = null;
    userInkLayerEl = null;
    freehandSvg.innerHTML = "";
    syncProgressDisplay();
    updateSuccessVisibility(false);
  }
};

const advanceCheckpointsAlongSegment = (segmentStart: Point, segmentEnd: Point) => {
  const isTap = Math.hypot(segmentEnd.x - segmentStart.x, segmentEnd.y - segmentStart.y) <= 0.001;
  let checkpoint = checkpoints[completedCheckpointCount];

  while (checkpoint) {
    const hit = getCheckpointGateHit(checkpoint, segmentStart, segmentEnd);
    if (!hit.isHit) {
      break;
    }

    checkpoint.completed = true;
    checkpoint.error = hit.distance;
    recordedErrors.push(hit.distance);
    completedCheckpointCount += 1;
    if (isTap) {
      break;
    }
    checkpoint = checkpoints[completedCheckpointCount];
  }

  syncProgressDisplay();
};

const beginStroke = (point: Point) => {
  if (!userInkLayerEl) {
    return;
  }

  const pathEl = createSvgPath("writing-app__freehand-user-stroke");
  userInkLayerEl.append(pathEl);
  activeStroke = {
    points: [point],
    pathEl
  };
  pathEl.setAttribute("d", pointsToPolylinePathD(activeStroke.points));
};

const appendStrokePoint = (point: Point) => {
  if (!activeStroke) {
    return;
  }

  const previous = activeStroke.points[activeStroke.points.length - 1];
  if (previous && Math.hypot(point.x - previous.x, point.y - previous.y) < 2) {
    return;
  }

  activeStroke.points.push(point);
  activeStroke.pathEl.setAttribute("d", pointsToPolylinePathD(activeStroke.points));
};

const onPointerDown = (event: PointerEvent) => {
  if (!currentPath || activePointerId !== null || completedCheckpointCount >= checkpoints.length) {
    return;
  }

  event.preventDefault();
  const point = getPointerInSvg(freehandSvg, event);
  activePointerId = event.pointerId;
  lastPointerPoint = point;
  beginStroke(point);
  advanceCheckpointsAlongSegment(point, point);
  freehandSvg.setPointerCapture(event.pointerId);
};

const onPointerMove = (event: PointerEvent) => {
  if (event.pointerId !== activePointerId) {
    return;
  }

  event.preventDefault();
  const point = getPointerInSvg(freehandSvg, event);
  const previousPoint = lastPointerPoint ?? point;
  appendStrokePoint(point);
  advanceCheckpointsAlongSegment(previousPoint, point);
  lastPointerPoint = point;
};

const endActiveStroke = (event: PointerEvent) => {
  if (event.pointerId !== activePointerId) {
    return;
  }

  if (freehandSvg.hasPointerCapture(event.pointerId)) {
    freehandSvg.releasePointerCapture(event.pointerId);
  }
  activePointerId = null;
  activeStroke = null;
  lastPointerPoint = null;
};

const goToNextWord = () => {
  const nextWordIndex = chooseNextWordIndex(currentWordIndex);
  renderWord(WORDS[nextWordIndex] ?? WORDS[0], nextWordIndex);
};

freehandSvg.addEventListener("pointerdown", onPointerDown);
freehandSvg.addEventListener("pointermove", onPointerMove);
freehandSvg.addEventListener("pointerup", endActiveStroke);
freehandSvg.addEventListener("pointercancel", endActiveStroke);

wordInput.addEventListener("change", () => {
  renderWord(wordInput.value);
});
wordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    wordInput.blur();
    renderWord(wordInput.value);
  }
});
toleranceSlider.addEventListener("input", () => {
  currentTolerance = normalizeSliderValue(toleranceSlider, Number(toleranceSlider.value));
  syncToleranceLabel();
  syncSettingsUrl();
  syncProgressDisplay();
});
resetButton.addEventListener("click", resetRoundProgress);
tryAgainButton.addEventListener("click", resetRoundProgress);
nextWordButton.addEventListener("click", goToNextWord);

applyUrlSettings();
renderWord(currentWord);
