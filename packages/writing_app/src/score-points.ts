import "./style.css";
import {
  AnimationPlayer,
  TracingSession,
  compileTracingPath,
  type Point,
  type PreparedTracingPath,
  type PreparedStroke,
  type TracingSample,
  type WritingPath
} from "letterpaths";
import {
  DEMO_PAUSE_MS,
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

const FRUIT_EMOJIS = ["🍎", "🍐", "🍊", "🍓", "🍇", "🍒", "🍉", "🥝"] as const;
const DEFAULT_FRUIT_SIZE = 44;
const MIN_FRUIT_SIZE = 24;
const MAX_FRUIT_SIZE = 72;
const FRUIT_SIZE_STEP = 2;
const DEFAULT_FRUIT_SPACING = 220;
const MIN_FRUIT_SPACING = 100;
const MAX_FRUIT_SPACING = 420;
const FRUIT_SPACING_STEP = 10;

type FruitToken = {
  x: number;
  y: number;
  emoji: string;
  captured: boolean;
};

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app element for score points app.");
}

app.innerHTML = `
  <div class="writing-app">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar writing-app__topbar--score">
          <div class="writing-app__title">
            <p class="writing-app__eyebrow">Collect the fruit</p>
            <h1 class="writing-app__word" id="word-label"></h1>
          </div>
          <div class="writing-app__score-card" aria-live="polite">
            <span class="writing-app__score-label">Score</span>
            <span class="writing-app__score-value"><span id="score-value">0</span>/<span id="score-total">0</span></span>
          </div>
          <div class="writing-app__control-strip">
            <label class="writing-app__tolerance" for="tolerance-slider">
              <span class="writing-app__tolerance-label">
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
                value="${DEFAULT_TRACE_TOLERANCE}"
              />
            </label>
            <label class="writing-app__tolerance" for="fruit-size-slider">
              <span class="writing-app__tolerance-label">
                Fruit size
                <span class="writing-app__tolerance-value" id="fruit-size-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="fruit-size-slider"
                type="range"
                min="${MIN_FRUIT_SIZE}"
                max="${MAX_FRUIT_SIZE}"
                step="${FRUIT_SIZE_STEP}"
                value="${DEFAULT_FRUIT_SIZE}"
              />
            </label>
            <label class="writing-app__tolerance" for="fruit-spacing-slider">
              <span class="writing-app__tolerance-label">
                Fruit spacing
                <span class="writing-app__tolerance-value" id="fruit-spacing-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="fruit-spacing-slider"
                type="range"
                min="${MIN_FRUIT_SPACING}"
                max="${MAX_FRUIT_SPACING}"
                step="${FRUIT_SPACING_STEP}"
                value="${DEFAULT_FRUIT_SPACING}"
              />
            </label>
          </div>
          <button class="writing-app__button" id="show-me-button" type="button">
            Show me
          </button>
        </header>

        <svg
          class="writing-app__svg"
          id="trace-svg"
          viewBox="0 0 1600 900"
          aria-label="Handwriting fruit collection area"
        ></svg>

        <div class="writing-app__overlay" id="success-overlay" hidden>
          <div class="writing-app__success-card">
            <p class="writing-app__success-eyebrow">Round complete!</p>
            <p class="writing-app__success-copy" id="score-summary"></p>
            <button class="writing-app__button writing-app__button--next" id="next-word-button" type="button">
              Next word
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
`;

const wordLabel = document.querySelector<HTMLHeadingElement>("#word-label");
const scoreValue = document.querySelector<HTMLSpanElement>("#score-value");
const scoreTotal = document.querySelector<HTMLSpanElement>("#score-total");
const scoreSummary = document.querySelector<HTMLParagraphElement>("#score-summary");
const traceSvg = document.querySelector<SVGSVGElement>("#trace-svg");
const showMeButton = document.querySelector<HTMLButtonElement>("#show-me-button");
const successOverlay = document.querySelector<HTMLDivElement>("#success-overlay");
const nextWordButton = document.querySelector<HTMLButtonElement>("#next-word-button");
const toleranceSlider = document.querySelector<HTMLInputElement>("#tolerance-slider");
const toleranceValue = document.querySelector<HTMLSpanElement>("#tolerance-value");
const fruitSizeSlider = document.querySelector<HTMLInputElement>("#fruit-size-slider");
const fruitSizeValue = document.querySelector<HTMLSpanElement>("#fruit-size-value");
const fruitSpacingSlider = document.querySelector<HTMLInputElement>("#fruit-spacing-slider");
const fruitSpacingValue = document.querySelector<HTMLSpanElement>("#fruit-spacing-value");

if (
  !wordLabel ||
  !scoreValue ||
  !scoreTotal ||
  !scoreSummary ||
  !traceSvg ||
  !showMeButton ||
  !successOverlay ||
  !nextWordButton ||
  !toleranceSlider ||
  !toleranceValue ||
  !fruitSizeSlider ||
  !fruitSizeValue ||
  !fruitSpacingSlider ||
  !fruitSpacingValue
) {
  throw new Error("Missing elements for score points app.");
}

let currentWordIndex = -1;
let currentPath: WritingPath | null = null;
let tracingSession: TracingSession | null = null;
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
let currentFruitSize = DEFAULT_FRUIT_SIZE;
let currentFruitSpacing = DEFAULT_FRUIT_SPACING;
let fruits: FruitToken[] = [];
let fruitEls: SVGTextElement[] = [];
let score = 0;

const syncToleranceLabel = () => {
  toleranceValue.textContent = `${currentTraceTolerance}px`;
};

const syncFruitControlLabels = () => {
  fruitSizeValue.textContent = `${currentFruitSize}px`;
  fruitSpacingValue.textContent = `${currentFruitSpacing}px`;
};

const syncScoreDisplay = () => {
  scoreValue.textContent = `${score}`;
  scoreTotal.textContent = `${fruits.length}`;
  scoreSummary.textContent =
    fruits.length === 0
      ? "No fruit on this round."
      : `You collected ${score} of ${fruits.length} fruit.`;
};

const updateSuccessVisibility = (isVisible: boolean) => {
  successOverlay.hidden = !isVisible;
};

const interpolateSamplePoint = (
  samples: TracingSample[],
  distanceAlongStroke: number
): Point => {
  if (samples.length === 0) {
    return { x: 0, y: 0 };
  }

  if (samples.length === 1 || distanceAlongStroke <= 0) {
    return { x: samples[0].x, y: samples[0].y };
  }

  for (let index = 1; index < samples.length; index += 1) {
    const previous = samples[index - 1];
    const current = samples[index];
    if (!previous || !current) {
      continue;
    }
    if (distanceAlongStroke > current.distanceAlongStroke) {
      continue;
    }

    const span = current.distanceAlongStroke - previous.distanceAlongStroke;
    const ratio = span > 0 ? (distanceAlongStroke - previous.distanceAlongStroke) / span : 0;
    return {
      x: previous.x + (current.x - previous.x) * ratio,
      y: previous.y + (current.y - previous.y) * ratio
    };
  }

  const last = samples[samples.length - 1];
  return last ? { x: last.x, y: last.y } : { x: 0, y: 0 };
};

const getPointAtOverallDistance = (
  preparedPath: PreparedTracingPath,
  targetDistance: number
): Point => {
  let remaining = targetDistance;

  for (let index = 0; index < preparedPath.strokes.length; index += 1) {
    const stroke = preparedPath.strokes[index];
    if (!stroke) {
      continue;
    }

    if (remaining <= stroke.totalLength || index === preparedPath.strokes.length - 1) {
      return interpolateSamplePoint(
        stroke.samples,
        Math.max(0, Math.min(remaining, stroke.totalLength))
      );
    }

    remaining -= stroke.totalLength;
  }

  return { x: 0, y: 0 };
};

const createFruitTokens = (preparedPath: PreparedTracingPath): FruitToken[] => {
  const totalLength = preparedPath.strokes.reduce(
    (sum, stroke) => sum + stroke.totalLength,
    0
  );
  if (totalLength <= 0) {
    return [];
  }

  const count = Math.max(1, Math.round(totalLength / currentFruitSpacing));

  return Array.from({ length: count }, (_, index) => {
    const point = getPointAtOverallDistance(
      preparedPath,
      (totalLength * (index + 1)) / (count + 1)
    );
    return {
      x: point.x,
      y: point.y,
      emoji: FRUIT_EMOJIS[index % FRUIT_EMOJIS.length] ?? FRUIT_EMOJIS[0],
      captured: false
    };
  });
};

const resetFruitState = () => {
  score = 0;
  fruits.forEach((fruit) => {
    fruit.captured = false;
  });
  fruitEls.forEach((el) => {
    el.classList.remove("writing-app__fruit--captured");
  });
  syncScoreDisplay();
};

const captureFruitAtPoint = (point: Point) => {
  let changed = false;
  const captureRadius = Math.max(24, currentFruitSize * 0.55);

  fruits.forEach((fruit, index) => {
    if (fruit.captured) {
      return;
    }

    const distance = Math.hypot(point.x - fruit.x, point.y - fruit.y);
    if (distance > captureRadius) {
      return;
    }

    fruit.captured = true;
    score += 1;
    fruitEls[index]?.classList.add("writing-app__fruit--captured");
    changed = true;
  });

  if (changed) {
    syncScoreDisplay();
  }
};

const stopDemoAnimation = () => {
  if (demoAnimationFrameId !== null) {
    cancelAnimationFrame(demoAnimationFrameId);
    demoAnimationFrameId = null;
  }

  isDemoPlaying = false;
  showMeButton.disabled = false;
  showMeButton.textContent = "Show me";

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

const resetRoundProgress = () => {
  tracingSession?.reset();
  activePointerId = null;
  updateSuccessVisibility(false);

  traceStrokeEls.forEach((el, index) => {
    const length = traceStrokeLengths[index] ?? 0.001;
    el.style.strokeDasharray = `${length} ${length}`;
    el.style.strokeDashoffset = `${length}`;
  });

  resetFruitState();
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

const renderTraceFrame = () => {
  if (!tracingSession || !traceCursorEl) {
    return;
  }

  const state = tracingSession.getState();
  const angle = Math.atan2(state.cursorTangent.y, state.cursorTangent.x) * (180 / Math.PI);

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

  if (!isDemoPlaying) {
    captureFruitAtPoint(state.cursorPoint);
  }

  updateSuccessVisibility(state.status === "complete");
};

const playDemo = () => {
  if (!currentPath || isDemoPlaying) {
    return;
  }

  resetRoundProgress();
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

    demoStrokeEls.forEach((el, index) => {
      const length = demoStrokeLengths[index] ?? 0.001;
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
    resetRoundProgress();
  };

  demoAnimationFrameId = requestAnimationFrame(tick);
  requestTraceRender();
};

const setupScene = (path: WritingPath, width: number, height: number, offsetY: number) => {
  const preparedPath = compileTracingPath(path);
  tracingSession = new TracingSession(preparedPath, {
    startTolerance: currentTraceTolerance,
    hitTolerance: currentTraceTolerance
  });
  activePointerId = null;
  fruits = createFruitTokens(preparedPath);

  const drawableStrokes = path.strokes.filter((stroke) => stroke.type !== "lift");
  const backgroundPaths = drawableStrokes
    .map((stroke) => `<path class="writing-app__stroke-bg" d="${buildPathD(stroke.curves)}"></path>`)
    .join("");
  const tracePaths = drawableStrokes
    .map((stroke) => `<path class="writing-app__stroke-trace" d="${buildPathD(stroke.curves)}"></path>`)
    .join("");
  const demoPaths = drawableStrokes
    .map((stroke) => `<path class="writing-app__stroke-demo" d="${buildPathD(stroke.curves)}"></path>`)
    .join("");
  const fruitMarkup = fruits
    .map(
      (fruit, index) => `
        <text
          class="writing-app__fruit"
          data-fruit-index="${index}"
          x="${fruit.x}"
          y="${fruit.y}"
          style="font-size: ${currentFruitSize}px"
          text-anchor="middle"
          dominant-baseline="middle"
        >${fruit.emoji}</text>
      `
    )
    .join("");

  traceSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  traceSvg.innerHTML = `
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
    ${backgroundPaths}
    ${fruitMarkup}
    ${tracePaths}
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
  fruitEls = Array.from(traceSvg.querySelectorAll<SVGTextElement>(".writing-app__fruit"));
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

  resetFruitState();
  updateSuccessVisibility(false);
  requestTraceRender();
};

const renderWord = (word: string) => {
  stopDemoAnimation();
  wordLabel.textContent = word;

  const layout = buildShiftedWordLayout(word);
  currentPath = layout.path;
  setupScene(layout.path, layout.width, layout.height, layout.offsetY);
};

const goToNextWord = () => {
  currentWordIndex = chooseNextWordIndex(currentWordIndex);
  renderWord(WORDS[currentWordIndex] ?? WORDS[0]);
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
toleranceSlider.addEventListener("input", () => {
  currentTraceTolerance = Number(toleranceSlider.value);
  syncToleranceLabel();

  if (currentWordIndex >= 0) {
    renderWord(WORDS[currentWordIndex] ?? WORDS[0]);
  }
});
fruitSizeSlider.addEventListener("input", () => {
  currentFruitSize = Number(fruitSizeSlider.value);
  syncFruitControlLabels();

  if (currentWordIndex >= 0) {
    renderWord(WORDS[currentWordIndex] ?? WORDS[0]);
  }
});
fruitSpacingSlider.addEventListener("input", () => {
  currentFruitSpacing = Number(fruitSpacingSlider.value);
  syncFruitControlLabels();

  if (currentWordIndex >= 0) {
    renderWord(WORDS[currentWordIndex] ?? WORDS[0]);
  }
});

syncToleranceLabel();
syncFruitControlLabels();
syncScoreDisplay();
goToNextWord();
