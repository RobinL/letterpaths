import "./style.css";
import {
  AnimationPlayer,
  CubicBezier,
  TracingSession,
  buildHandwritingPath,
  compileTracingPath,
  lettersByVariantId,
  type WritingPath
} from "letterpaths";

const WORDS = ["sam", "pat", "mat", "pit", "sit", "pad"] as const;
const TARGET_GUIDES = {
  xHeight: 320,
  baseline: 700
} as const;
const JOIN_SPACING = {
  verticalDistanceWeight: 0.43,
  angleChangeWeight: 2.3,
  kerningScale: 1,
  minSidebearingGap: 55
} as const;
const DEMO_PAUSE_MS = 500;

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

if (!wordLabel || !traceSvg || !showMeButton || !successOverlay || !nextWordButton) {
  throw new Error("Missing elements for writing app.");
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

const chooseNextWordIndex = (previousIndex: number): number => {
  if (WORDS.length <= 1) {
    return 0;
  }

  let nextIndex = previousIndex;
  while (nextIndex === previousIndex) {
    nextIndex = Math.floor(Math.random() * WORDS.length);
  }
  return nextIndex;
};

const buildPathD = (curves: CubicBezier[]): string => {
  if (curves.length === 0) {
    return "";
  }

  const [first] = curves;
  let d = `M ${first.p0.x} ${first.p0.y}`;

  curves.forEach((curve) => {
    d += ` C ${curve.p1.x} ${curve.p1.y} ${curve.p2.x} ${curve.p2.y} ${curve.p3.x} ${curve.p3.y}`;
  });

  return d;
};

const shiftWritingPath = (path: WritingPath, dx: number, dy: number): WritingPath => ({
  ...path,
  strokes: path.strokes.map((stroke) => ({
    ...stroke,
    curves: stroke.curves.map(
      (curve) =>
        new CubicBezier(
          { x: curve.p0.x + dx, y: curve.p0.y + dy },
          { x: curve.p1.x + dx, y: curve.p1.y + dy },
          { x: curve.p2.x + dx, y: curve.p2.y + dy },
          { x: curve.p3.x + dx, y: curve.p3.y + dy }
        )
    )
  })),
  bounds: {
    minX: path.bounds.minX + dx,
    maxX: path.bounds.maxX + dx,
    minY: path.bounds.minY + dy,
    maxY: path.bounds.maxY + dy
  }
});

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
  tracingSession = new TracingSession(preparedPath);
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

  const writingPath = buildHandwritingPath(word, {
    style: "cursive",
    targetGuides: TARGET_GUIDES,
    joinSpacing: JOIN_SPACING,
    letters: lettersByVariantId
  });

  if (writingPath.strokes.length === 0) {
    throw new Error(`No drawable strokes found for "${word}".`);
  }

  const paddingX = 180;
  const paddingY = 150;
  const width = Math.ceil(writingPath.bounds.maxX - writingPath.bounds.minX + paddingX * 2);
  const height = Math.ceil(writingPath.bounds.maxY - writingPath.bounds.minY + paddingY * 2);
  const offsetX = paddingX - writingPath.bounds.minX;
  const offsetY = paddingY - writingPath.bounds.minY;
  const shiftedPath = shiftWritingPath(writingPath, offsetX, offsetY);

  currentPath = shiftedPath;
  setupScene(shiftedPath, width, height, offsetY);
};

const goToNextWord = () => {
  currentWordIndex = chooseNextWordIndex(currentWordIndex);
  renderWord(WORDS[currentWordIndex] ?? WORDS[0]);
};

const getPointerInSvg = (event: PointerEvent): { x: number; y: number } => {
  const ctm = traceSvg.getScreenCTM();
  if (ctm) {
    const point = traceSvg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(ctm.inverse());
    return { x: transformed.x, y: transformed.y };
  }

  const rect = traceSvg.getBoundingClientRect();
  const viewBox = traceSvg.viewBox.baseVal;
  const scaleX = viewBox.width / rect.width;
  const scaleY = viewBox.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX + viewBox.x,
    y: (event.clientY - rect.top) * scaleY + viewBox.y
  };
};

const onPointerDown = (event: PointerEvent) => {
  if (isDemoPlaying || !tracingSession || activePointerId !== null) {
    return;
  }

  const started = tracingSession.beginAt(getPointerInSvg(event));
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
  tracingSession.update(getPointerInSvg(event));
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

goToNextWord();
