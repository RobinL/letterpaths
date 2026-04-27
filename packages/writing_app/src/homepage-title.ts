import { AnimationPlayer, type AnimationFrame, type Point, type WritingPath } from "letterpaths";
import { buildPathD, buildShiftedHandwritingLayout, JOIN_SPACING } from "./shared";

const TITLE_WORD = "letterpaths";
const LOOP_PAUSE_MS = 900;

type RenderedStroke = {
  el: SVGPathElement;
  length: number;
};

const getStrokeLength = (stroke: WritingPath["strokes"][number]): number => {
  const length = stroke.curves.reduce((sum, curve) => sum + curve.length(), 0);
  return Number.isFinite(length) && length > 0 ? length : 0.001;
};

const getFrameAngle = (frame: AnimationFrame, fallbackAngle: number): number => {
  const speed = Math.hypot(frame.velocity.x, frame.velocity.y);
  if (speed <= 0.001) {
    return fallbackAngle;
  }

  return Math.atan2(frame.velocity.y, frame.velocity.x) * (180 / Math.PI);
};

const setPenPose = (penEl: SVGGElement, point: Point, angle: number, opacity = 1) => {
  penEl.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle})`);
  penEl.style.opacity = String(opacity);
};

const renderTraceFrame = (strokes: RenderedStroke[], frame: AnimationFrame) => {
  const completed = new Set(frame.completedStrokes);

  strokes.forEach(({ el, length }, index) => {
    if (completed.has(index)) {
      el.style.strokeDashoffset = "0";
      return;
    }

    if (index === frame.activeStrokeIndex) {
      el.style.strokeDashoffset = `${Math.max(0, length * (1 - frame.activeStrokeProgress))}`;
      return;
    }

    el.style.strokeDashoffset = `${length}`;
  });
};

const renderCompleteFrame = (strokes: RenderedStroke[], penEl: SVGGElement) => {
  strokes.forEach(({ el }) => {
    el.style.strokeDashoffset = "0";
  });
  penEl.style.opacity = "0";
};

const initializeHomepageTitle = () => {
  const titleEl = document.querySelector<HTMLElement>("[data-letterpaths-title]");
  const svg = document.querySelector<SVGSVGElement>("[data-letterpaths-title-svg]");
  if (!titleEl || !svg) {
    return;
  }

  const layout = buildShiftedHandwritingLayout(TITLE_WORD, {
    style: "cursive",
    joinSpacing: JOIN_SPACING,
    keepInitialLeadIn: true,
    keepFinalLeadOut: true
  });
  const drawableStrokes = layout.path.strokes.filter((stroke) => stroke.type !== "lift");
  const backgroundPaths = drawableStrokes
    .map(
      (stroke) =>
        `<path class="brand-title__stroke brand-title__stroke--bg" d="${buildPathD(stroke.curves)}"></path>`
    )
    .join("");
  const tracePaths = drawableStrokes
    .map(
      (stroke) =>
        `<path class="brand-title__stroke brand-title__stroke--trace" d="${buildPathD(stroke.curves)}"></path>`
    )
    .join("");

  svg.setAttribute("viewBox", `0 0 ${layout.width} ${layout.height}`);
  svg.innerHTML = `
    <line
      class="brand-title__guide brand-title__guide--midline"
      x1="0"
      y1="${layout.path.guides.xHeight + layout.offsetY}"
      x2="${layout.width}"
      y2="${layout.path.guides.xHeight + layout.offsetY}"
    ></line>
    <line
      class="brand-title__guide brand-title__guide--baseline"
      x1="0"
      y1="${layout.path.guides.baseline + layout.offsetY}"
      x2="${layout.width}"
      y2="${layout.path.guides.baseline + layout.offsetY}"
    ></line>
    ${backgroundPaths}
    ${tracePaths}
    <g class="brand-title__pen" data-letterpaths-title-pen>
      <circle class="brand-title__pen-bg" cx="0" cy="0" r="38"></circle>
      <polygon class="brand-title__pen-arrow" points="18,0 -12,-14 -6,0 -12,14"></polygon>
    </g>
  `;

  const traceEls = Array.from(svg.querySelectorAll<SVGPathElement>(".brand-title__stroke--trace"));
  const renderedStrokes = traceEls.map((el, index) => {
    const length = getStrokeLength(drawableStrokes[index] ?? drawableStrokes[0]);
    el.style.strokeDasharray = `${length} ${length}`;
    el.style.strokeDashoffset = `${length}`;
    return { el, length };
  });
  const penEl = svg.querySelector<SVGGElement>("[data-letterpaths-title-pen]");
  if (!penEl) {
    return;
  }

  titleEl.classList.add("brand-title--ready");

  const player = new AnimationPlayer(layout.path, {
    speed: 2.15,
    penUpSpeed: 2.8,
    deferredDelayMs: 120
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    renderCompleteFrame(renderedStrokes, penEl);
    return;
  }

  let startedAt = performance.now();
  let lastAngle = 0;

  const tick = (now: number) => {
    const cycleDuration = player.totalDuration + LOOP_PAUSE_MS;
    const elapsed = (now - startedAt) % cycleDuration;

    if (now - startedAt >= cycleDuration) {
      startedAt = now - elapsed;
    }

    if (elapsed >= player.totalDuration) {
      renderCompleteFrame(renderedStrokes, penEl);
      requestAnimationFrame(tick);
      return;
    }

    const frame = player.getFrame(elapsed);
    lastAngle = getFrameAngle(frame, lastAngle);
    renderTraceFrame(renderedStrokes, frame);
    setPenPose(penEl, frame.point, lastAngle, 1);
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

initializeHomepageTitle();
