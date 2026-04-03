import "./trace_demo.css";
import {
  CubicBezier,
  defaultJoinSpacingOptions,
  joinCursiveWord,
  compileTracingPath,
  TracingSession,
  lettersByVariantId,
  type JoinSpacingOptions,
  type WritingPath
} from "letterpaths";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app element for trace demo.");
}

const DEFAULT_TEXT = "abcdefgh";
const targetGuides = {
  xHeight: 360,
  baseline: 720
};

const joinControlDefinitions = [
  {
    key: "verticalDistanceWeight",
    label: "Vertical distance influence",
    min: -1,
    max: 1,
    step: 0.01,
    value: defaultJoinSpacingOptions.verticalDistanceWeight
  },
  {
    key: "angleDifferenceWeight",
    label: "Bend demand influence",
    min: -5,
    max: 5,
    step: 0.05,
    value: defaultJoinSpacingOptions.angleDifferenceWeight
  },
  {
    key: "bendReversalWeight",
    label: "Reverse bend influence",
    min: -5,
    max: 5,
    step: 0.05,
    value: defaultJoinSpacingOptions.bendReversalWeight
  },
  {
    key: "kerningScale",
    label: "Kerning scale",
    min: -5,
    max: 5,
    step: 0.05,
    value: defaultJoinSpacingOptions.kerningScale
  },
  {
    key: "minSidebearingGap",
    label: "Minimum sidebearing gap",
    min: -500,
    max: 500,
    step: 5,
    value: defaultJoinSpacingOptions.minSidebearingGap
  }
] as const satisfies ReadonlyArray<{
  key: keyof Required<JoinSpacingOptions>;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
}>;

const letters = lettersByVariantId;

app.innerHTML = `
  <div class="trace-page">
    <header class="trace-header">
      <div class="trace-header__title">
        <h1>Letterpaths Tracing Demo</h1>
        <p>Drag the arrow along the path to trace the word.</p>
      </div>
    </header>
    <section class="trace-main">
      <div class="trace-controls">
        <label class="trace-field">
          Word to trace
          <input
            class="trace-input"
            id="word-input"
            type="text"
            value="${DEFAULT_TEXT}"
            spellcheck="false"
            autocomplete="off"
          />
        </label>
        <div class="trace-slider-grid">
          ${joinControlDefinitions
            .map(
              (control) => `
                <label class="trace-field trace-field--range">
                  ${control.label}
                  <div class="trace-range-row">
                    <input
                      class="trace-range"
                      id="${control.key}"
                      type="range"
                      min="${control.min}"
                      max="${control.max}"
                      step="${control.step}"
                      value="${control.value}"
                    />
                    <span class="trace-range-value" id="${control.key}-value">${control.value}</span>
                  </div>
                </label>
              `
            )
            .join("")}
        </div>
        <button class="trace-button" id="reset-button">Reset</button>
      </div>
      <div class="trace-canvas-container">
        <svg class="trace-svg" id="trace-svg" viewBox="0 0 1600 1000"></svg>
        <div class="trace-complete-message" id="complete-message">Well done!</div>
      </div>
    </section>
  </div>
`;

const input = document.querySelector<HTMLInputElement>("#word-input");
const resetButton = document.querySelector<HTMLButtonElement>("#reset-button");
const traceSvg = document.querySelector<SVGSVGElement>("#trace-svg");
const completeMessage = document.querySelector<HTMLDivElement>("#complete-message");

if (!input || !resetButton || !traceSvg || !completeMessage) {
  throw new Error("Missing elements for trace demo.");
}

const joinSpacingInputs = Object.fromEntries(
  joinControlDefinitions.map((control) => [
    control.key,
    document.querySelector<HTMLInputElement>(`#${control.key}`)
  ])
) as Record<keyof Required<JoinSpacingOptions>, HTMLInputElement | null>;

const joinSpacingValues = Object.fromEntries(
  joinControlDefinitions.map((control) => [
    control.key,
    document.querySelector<HTMLSpanElement>(`#${control.key}-value`)
  ])
) as Record<keyof Required<JoinSpacingOptions>, HTMLSpanElement | null>;

if (
  Object.values(joinSpacingInputs).some((inputEl) => !inputEl) ||
  Object.values(joinSpacingValues).some((valueEl) => !valueEl)
) {
  throw new Error("Missing join spacing controls for trace demo.");
}

// State
let session: TracingSession | null = null;
let shiftedPath: WritingPath | null = null;
let activePointerId: number | null = null;
let rafId = 0;

// Retained DOM element references
let strokeBgEls: SVGPathElement[] = [];
let strokeTraceEls: SVGPathElement[] = [];
let cursorEl: SVGGElement | null = null;
let strokeLengths: number[] = [];

const buildPathD = (curves: CubicBezier[]): string => {
  if (curves.length === 0) return "";
  const [first, ...rest] = curves;
  let d = `M ${first.p0.x} ${first.p0.y} `;
  [first, ...rest].forEach((curve) => {
    d += `C ${curve.p1.x} ${curve.p1.y} ${curve.p2.x} ${curve.p2.y} ${curve.p3.x} ${curve.p3.y} `;
  });
  return d.trim();
};

const readJoinSpacing = (): Required<JoinSpacingOptions> => ({
  verticalDistanceWeight: Number(joinSpacingInputs.verticalDistanceWeight?.value ?? 0),
  angleDifferenceWeight: Number(joinSpacingInputs.angleDifferenceWeight?.value ?? 0),
  bendReversalWeight: Number(joinSpacingInputs.bendReversalWeight?.value ?? 0),
  kerningScale: Number(joinSpacingInputs.kerningScale?.value ?? 0),
  minSidebearingGap: Number(joinSpacingInputs.minSidebearingGap?.value ?? 0)
});

const syncJoinSpacingLabels = () => {
  joinControlDefinitions.forEach((control) => {
    const inputEl = joinSpacingInputs[control.key];
    const valueEl = joinSpacingValues[control.key];
    if (!inputEl || !valueEl) {
      return;
    }
    valueEl.textContent =
      control.key === "minSidebearingGap"
        ? Number(inputEl.value).toFixed(0)
        : Number(inputEl.value).toFixed(2);
  });
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

const requestRender = () => {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    renderFrame();
  });
};

const renderFrame = () => {
  if (!session || !cursorEl) return;

  const state = session.getState();

  console.log("[TraceDemo.renderFrame]", {
    status: state.status,
    activeStrokeIndex: state.activeStrokeIndex,
    activeStrokeProgress: state.activeStrokeProgress,
    cursorPoint: state.cursorPoint,
    completedStrokes: state.completedStrokes
  });

  // Update cursor position and rotation
  const angle = Math.atan2(state.cursorTangent.y, state.cursorTangent.x) * (180 / Math.PI);
  cursorEl.setAttribute(
    "transform",
    `translate(${state.cursorPoint.x}, ${state.cursorPoint.y}) rotate(${angle})`
  );

  // Update stroke visuals
  const completed = new Set(state.completedStrokes);
  strokeBgEls.forEach((el, index) => {
    const length = strokeLengths[index] ?? 0;
    const traceEl = strokeTraceEls[index];
    if (!traceEl) return;

    if (completed.has(index)) {
      // Fully traced - show blue
      traceEl.style.strokeDashoffset = "0";
    } else if (index === state.activeStrokeIndex) {
      // Currently tracing
      const remaining = length * (1 - state.activeStrokeProgress);
      traceEl.style.strokeDashoffset = `${Math.max(0, remaining)}`;
    } else {
      // Not yet traced
      traceEl.style.strokeDashoffset = `${length}`;
    }
  });

  // Show completion message
  if (state.status === "complete") {
    completeMessage.classList.add("visible");
  } else {
    completeMessage.classList.remove("visible");
  }
};

const renderEmpty = (message: string) => {
  traceSvg.innerHTML = `
    <rect class="trace-bg" x="0" y="0" width="1600" height="1000"></rect>
    <text class="trace-empty" x="800" y="520" text-anchor="middle">
      ${message}
    </text>
  `;
  strokeBgEls = [];
  strokeTraceEls = [];
  cursorEl = null;
  strokeLengths = [];
  session = null;
  shiftedPath = null;
  completeMessage.classList.remove("visible");
};

const setupTracing = (text: string) => {
  console.log("[TraceDemo.setupTracing] Called with text:", text);

  const trimmed = text.trim().toLowerCase();
  if (!trimmed) {
    renderEmpty("Enter a word to trace.");
    return;
  }

  const joinSpacing = readJoinSpacing();
  const writingPath = joinCursiveWord(trimmed, { targetGuides, joinSpacing, letters });
  console.log("[TraceDemo.setupTracing] WritingPath created", {
    strokeCount: writingPath.strokes.length,
    bounds: writingPath.bounds
  });

  if (writingPath.strokes.length === 0) {
    renderEmpty("No drawable paths.");
    return;
  }

  const padding = 120;
  const width = Math.max(
    1000,
    Math.ceil(writingPath.bounds.maxX - writingPath.bounds.minX + padding * 2)
  );
  const height = Math.max(
    900,
    Math.ceil(writingPath.bounds.maxY - writingPath.bounds.minY + padding * 2)
  );
  const offsetX = padding - writingPath.bounds.minX;
  const offsetY = padding - writingPath.bounds.minY;
  console.log("[TraceDemo.setupTracing] Coordinate info", {
    originalBounds: writingPath.bounds,
    padding,
    width,
    height,
    offsetX,
    offsetY
  });
  shiftedPath = shiftWritingPath(writingPath, offsetX, offsetY);

  // Compile for tracing
  console.log("[TraceDemo.setupTracing] Compiling path for tracing");
  const preparedPath = compileTracingPath(shiftedPath);
  console.log("[TraceDemo.setupTracing] Prepared path compiled", {
    strokeCount: preparedPath.strokes.length,
    strokes: preparedPath.strokes.map((s, i) => ({
      index: i,
      sampleCount: s.samples.length,
      totalLength: s.totalLength,
      isDot: s.isDot
    }))
  });

  session = new TracingSession(preparedPath);
  const initialState = session.getState();
  console.log("[TraceDemo.setupTracing] TracingSession created", {
    initialCursorX: initialState.cursorPoint.x,
    initialCursorY: initialState.cursorPoint.y,
    firstStrokeSampleCount: preparedPath.strokes[0]?.samples.length,
    firstSample: preparedPath.strokes[0]?.samples[0]
  });

  traceSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  // Build SVG structure
  const bgPaths = shiftedPath.strokes
    .filter((s) => s.type !== "lift")
    .map((stroke, index) => {
      const d = buildPathD(stroke.curves);
      return `<path class="trace-stroke-bg" data-stroke="${index}" d="${d}"></path>`;
    })
    .join("");

  const tracePaths = shiftedPath.strokes
    .filter((s) => s.type !== "lift")
    .map((stroke, index) => {
      const d = buildPathD(stroke.curves);
      return `<path class="trace-stroke-trace" data-stroke="${index}" d="${d}"></path>`;
    })
    .join("");

  traceSvg.innerHTML = `
    <rect class="trace-bg" x="0" y="0" width="${width}" height="${height}"></rect>
    <line
      class="trace-guide trace-guide--xheight"
      x1="0"
      y1="${shiftedPath.guides.xHeight + offsetY}"
      x2="${width}"
      y2="${shiftedPath.guides.xHeight + offsetY}"
    ></line>
    <line
      class="trace-guide trace-guide--baseline"
      x1="0"
      y1="${shiftedPath.guides.baseline + offsetY}"
      x2="${width}"
      y2="${shiftedPath.guides.baseline + offsetY}"
    ></line>
    ${bgPaths}
    ${tracePaths}
    <g class="trace-cursor" id="trace-cursor">
      <circle class="trace-cursor__bg" cx="0" cy="0" r="36"></circle>
      <polygon class="trace-cursor__arrow" points="18,0 -12,-14 -6,0 -12,14"></polygon>
    </g>
  `;

  // Store references
  strokeBgEls = Array.from(traceSvg.querySelectorAll<SVGPathElement>(".trace-stroke-bg"));
  strokeTraceEls = Array.from(traceSvg.querySelectorAll<SVGPathElement>(".trace-stroke-trace"));
  cursorEl = traceSvg.querySelector<SVGGElement>("#trace-cursor");

  // Calculate and set stroke lengths
  strokeLengths = strokeTraceEls.map((el) => {
    const length = el.getTotalLength();
    return Number.isFinite(length) && length > 0 ? length : 0.001;
  });

  strokeTraceEls.forEach((el, index) => {
    const length = strokeLengths[index] ?? 0.001;
    el.style.strokeDasharray = `${length} ${length}`;
    el.style.strokeDashoffset = `${length}`;
  });

  completeMessage.classList.remove("visible");
  requestRender();
};

// Convert pointer event to SVG coordinates using the SVG's transformation matrix
// This correctly handles preserveAspectRatio and any other transformations
const getPointerInSvg = (e: PointerEvent): { x: number; y: number } => {
  const ctm = traceSvg.getScreenCTM();
  if (ctm) {
    const point = traceSvg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const transformed = point.matrixTransform(ctm.inverse());
    return { x: transformed.x, y: transformed.y };
  }
  // Fallback to manual calculation (doesn't handle preserveAspectRatio properly)
  const rect = traceSvg.getBoundingClientRect();
  const viewBox = traceSvg.viewBox.baseVal;
  const scaleX = viewBox.width / rect.width;
  const scaleY = viewBox.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX + viewBox.x,
    y: (e.clientY - rect.top) * scaleY + viewBox.y
  };
};

// Pointer event handlers
const onPointerDown = (e: PointerEvent) => {
  console.log("[TraceDemo.onPointerDown] Event", {
    pointerId: e.pointerId,
    activePointerId,
    hasSession: !!session,
    clientX: e.clientX,
    clientY: e.clientY
  });

  if (!session) {
    console.log("[TraceDemo.onPointerDown] IGNORED: No session");
    return;
  }

  if (activePointerId !== null) {
    console.log("[TraceDemo.onPointerDown] IGNORED: Already tracking pointer", {
      activePointerId
    });
    return;
  }

  const point = getPointerInSvg(e);
  console.log("[TraceDemo.onPointerDown] SVG point", point);

  const started = session.beginAt(point);
  console.log("[TraceDemo.onPointerDown] BeginAt result", { started });

  if (started) {
    activePointerId = e.pointerId;
    traceSvg.setPointerCapture(e.pointerId);
    console.log("[TraceDemo.onPointerDown] Capture set", {
      pointerId: e.pointerId
    });
    requestRender();
  }
};

const onPointerMove = (e: PointerEvent) => {
  if (!session) return;

  if (e.pointerId !== activePointerId) {
    // Don't log every move event that's not active
    return;
  }

  const point = getPointerInSvg(e);
  session.update(point);
  requestRender();
};

const onPointerUp = (e: PointerEvent) => {
  console.log("[TraceDemo.onPointerUp] Event", {
    pointerId: e.pointerId,
    activePointerId,
    hasSession: !!session
  });

  if (!session) {
    console.log("[TraceDemo.onPointerUp] IGNORED: No session");
    return;
  }

  if (e.pointerId !== activePointerId) {
    console.log("[TraceDemo.onPointerUp] IGNORED: Not active pointer", {
      eventPointerId: e.pointerId,
      activePointerId
    });
    return;
  }

  session.end();
  activePointerId = null;
  traceSvg.releasePointerCapture(e.pointerId);
  console.log("[TraceDemo.onPointerUp] Pointer released", {
    pointerId: e.pointerId
  });
  requestRender();
};

const onPointerCancel = (e: PointerEvent) => {
  console.log("[TraceDemo.onPointerCancel] Event", {
    pointerId: e.pointerId,
    activePointerId
  });

  if (e.pointerId === activePointerId) {
    session?.end();
    activePointerId = null;
    console.log("[TraceDemo.onPointerCancel] Pointer cancelled and cleared");
    requestRender();
  }
};

// Event listeners
traceSvg.addEventListener("pointerdown", onPointerDown);
traceSvg.addEventListener("pointermove", onPointerMove);
traceSvg.addEventListener("pointerup", onPointerUp);
traceSvg.addEventListener("pointercancel", onPointerCancel);

input.addEventListener("input", () => setupTracing(input.value));
joinControlDefinitions.forEach((control) => {
  joinSpacingInputs[control.key]?.addEventListener("input", () => {
    syncJoinSpacingLabels();
    setupTracing(input.value);
  });
});

resetButton.addEventListener("click", () => {
  if (session) {
    session.reset();
    // Reset stroke dash offsets
    strokeTraceEls.forEach((el, index) => {
      const length = strokeLengths[index] ?? 0.001;
      el.style.strokeDashoffset = `${length}`;
    });
    completeMessage.classList.remove("visible");
    requestRender();
  }
});

// Initial render
syncJoinSpacingLabels();
setupTracing(input.value);
