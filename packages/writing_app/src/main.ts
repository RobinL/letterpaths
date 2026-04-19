import "./style.css";
import {
  AnimationPlayer,
  TracingSession,
  compileFormationArrows,
  compileTracingPath,
  formationArrowCommandsToSvgPathData,
  type Point,
  type PreparedTracingPath,
  type TracingState,
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
            <p class="writing-app__eyebrow">Trace this word</p>
            <h1 class="writing-app__word" id="word-label"></h1>
          </div>
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
          <button class="writing-app__button" id="show-me-button" type="button">
            Show me
          </button>
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

const wordLabel = document.querySelector<HTMLHeadingElement>("#word-label");
const traceSvg = document.querySelector<SVGSVGElement>("#trace-svg");
const showMeButton = document.querySelector<HTMLButtonElement>("#show-me-button");
const successOverlay = document.querySelector<HTMLDivElement>("#success-overlay");
const nextWordButton = document.querySelector<HTMLButtonElement>("#next-word-button");
const toleranceSlider = document.querySelector<HTMLInputElement>("#tolerance-slider");
const toleranceValue = document.querySelector<HTMLSpanElement>("#tolerance-value");

if (
  !wordLabel ||
  !traceSvg ||
  !showMeButton ||
  !successOverlay ||
  !nextWordButton ||
  !toleranceSlider ||
  !toleranceValue
) {
  throw new Error("Missing elements for writing app.");
}

let currentWordIndex = -1;
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

const TRACE_CURSOR_TURN_COMMIT_DISTANCE = 12;
const TRACE_CURSOR_TURN_LOOKAHEAD_DISTANCE = 2;
const SECTION_ARROWHEAD_LENGTH = 26;
const SECTION_ARROWHEAD_WIDTH = 22;
const SECTION_ARROWHEAD_TIP_OVERHANG = 11;

const buildSvgPoints = (points: Point[]): string =>
  points.map((point) => `${point.x} ${point.y}`).join(" ");

const syncToleranceLabel = () => {
  toleranceValue.textContent = `${currentTraceTolerance}px`;
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
    .map((stroke) => `<path class="writing-app__stroke-bg" d="${buildPathD(stroke.curves)}"></path>`)
    .join("");
  const tracePaths = drawableStrokes
    .map((stroke) => `<path class="writing-app__stroke-trace" d="${buildPathD(stroke.curves)}"></path>`)
    .join("");
  const demoPaths = drawableStrokes
    .map((stroke) => `<path class="writing-app__stroke-demo" d="${buildPathD(stroke.curves)}"></path>`)
    .join("");
  const sectionArrowLength = Math.abs(path.guides.baseline - path.guides.xHeight) / 3;
  const sectionArrowMarkup = compileFormationArrows(preparedPath, {
    retraceTurns: {
      offset: Math.min(sectionArrowLength * 0.24, 13),
      stemLength: sectionArrowLength * 0.36,
      head: {
        length: SECTION_ARROWHEAD_LENGTH,
        width: SECTION_ARROWHEAD_WIDTH,
        tipExtension: SECTION_ARROWHEAD_TIP_OVERHANG
      }
    }
  })
    .map(
      (arrow) => `
        <path
          class="writing-app__section-arrow writing-app__section-arrow--white"
          d="${formationArrowCommandsToSvgPathData(arrow.commands)}"
        ></path>
        ${arrow.head
          ? `<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--white" points="${buildSvgPoints(arrow.head.polygon)}"></polygon>`
          : ""
        }
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
    ${tracePaths}
    ${sectionArrowMarkup}
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

syncToleranceLabel();
goToNextWord();
