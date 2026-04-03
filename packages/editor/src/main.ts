import "./demo.css";
import {
  AnimationPlayer,
  CubicBezier,
  defaultJoinSpacingOptions,
  joinCursiveWord,
  lettersByVariantId,
  type JoinSpacingOptions,
  type WritingPath
} from "letterpaths";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app element for editor demo.");
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
  <div class="demo-page">
    <header class="demo-header">
      <div class="demo-header__title">
        <h1>Letterpaths handwriting demo</h1>
        <p>Type a lowercase cursive word to see the library join and animate it.</p>
      </div>
    </header>
    <section class="demo-join">
      <div class="demo-join__controls">
        <label class="demo-join__field">
          Text to join
          <input
            class="demo-join__input"
            id="word-input"
            type="text"
            value="${DEFAULT_TEXT}"
            spellcheck="false"
            autocomplete="off"
          />
        </label>
        <div class="demo-join__slider-grid">
          ${joinControlDefinitions
            .map(
              (control) => `
                <label class="demo-join__field demo-join__field--range">
                  ${control.label}
                  <div class="demo-join__range-row">
                    <input
                      class="demo-join__range"
                      id="${control.key}"
                      type="range"
                      min="${control.min}"
                      max="${control.max}"
                      step="${control.step}"
                      value="${control.value}"
                    />
                    <span class="demo-join__range-value" id="${control.key}-value">${control.value}</span>
                  </div>
                </label>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="demo-join__canvases">
        <div class="demo-join__canvas">
          <div class="demo-join__canvas-title">Animated</div>
          <svg class="demo-join__svg" id="join-svg" viewBox="0 0 1600 1000"></svg>
        </div>
        <div class="demo-join__canvas">
          <div class="demo-join__canvas-title">Segments</div>
          <svg class="demo-join__svg" id="join-svg-static" viewBox="0 0 1600 1000"></svg>
        </div>
      </div>
    </section>
  </div>
`;

const input = document.querySelector<HTMLInputElement>("#word-input");
const joinSvg = document.querySelector<SVGSVGElement>("#join-svg");
const joinStaticSvg = document.querySelector<SVGSVGElement>("#join-svg-static");
let animationFrameId: number | null = null;

if (!input || !joinSvg || !joinStaticSvg) {
  throw new Error("Missing input or svg elements for editor demo.");
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
  throw new Error("Missing join spacing controls for editor demo.");
}

const stopAnimation = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

const renderEmpty = (svg: SVGSVGElement, message: string) => {
  svg.innerHTML = `
    <rect class="demo-join__bg" x="0" y="0" width="1600" height="1000"></rect>
    <text class="demo-join__empty" x="800" y="520" text-anchor="middle">
      ${message}
    </text>
  `;
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

const buildPathD = (curves: CubicBezier[]): string => {
  if (curves.length === 0) {
    return "";
  }
  const [first, ...rest] = curves;
  let d = `M ${first.p0.x} ${first.p0.y} `;
  [first, ...rest].forEach((curve) => {
    d += `C ${curve.p1.x} ${curve.p1.y} ${curve.p2.x} ${curve.p2.y} ${curve.p3.x} ${curve.p3.y} `;
  });
  return d.trim();
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

const buildStaticMarkup = (
  path: WritingPath,
  width: number,
  height: number,
  offsetY: number
): string => {
  const joinColor = "#d13c3c";
  const segmentColors: Record<string, string> = {
    "lead-in": "#64b5f6",
    entry: "#1e88e5",
    body: "#26a69a",
    ascender: "#1565c0",
    descender: "#00897b",
    exit: "#2e7d32",
    "lead-out": "#66bb6a",
    dot: "#4dd0e1"
  };
  const fallbackPalette = ["#1e88e5", "#26a69a", "#1565c0", "#2e7d32", "#64b5f6", "#66bb6a"];
  let fallbackIndex = 0;

  const paths = path.strokes
    .flatMap((stroke) =>
      stroke.curves.map((curve, index) => {
        const segment = stroke.curveSegments?.[index];
        const d = `M ${curve.p0.x} ${curve.p0.y} C ${curve.p1.x} ${curve.p1.y} ${curve.p2.x} ${curve.p2.y} ${curve.p3.x} ${curve.p3.y}`;
        if (segment === "join") {
          return `<path class="demo-join__path-static" d="${d}" stroke="${joinColor}" stroke-opacity="0.9" stroke-width="44"></path>`;
        }
        const color =
          (segment ? segmentColors[segment] : undefined) ??
          fallbackPalette[fallbackIndex % fallbackPalette.length] ??
          fallbackPalette[0];
        fallbackIndex += 1;
        return `<path class="demo-join__path-static" d="${d}" stroke="${color}" stroke-opacity="0.8" stroke-width="46"></path>`;
      })
    )
    .join("");

  return `
    <rect class="demo-join__bg" x="0" y="0" width="${width}" height="${height}"></rect>
    <line
      class="demo-guide demo-guide--xheight"
      x1="0"
      y1="${path.guides.xHeight + offsetY}"
      x2="${width}"
      y2="${path.guides.xHeight + offsetY}"
    ></line>
    <line
      class="demo-guide demo-guide--baseline"
      x1="0"
      y1="${path.guides.baseline + offsetY}"
      x2="${width}"
      y2="${path.guides.baseline + offsetY}"
    ></line>
    ${paths}
  `;
};

const render = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    renderEmpty(joinSvg, "Enter a word to render joined cursive.");
    renderEmpty(joinStaticSvg, "Enter a word to render joined cursive.");
    stopAnimation();
    return;
  }

  const joinSpacing = readJoinSpacing();
  const writingPath = joinCursiveWord(trimmed, { targetGuides, joinSpacing, letters });

  if (writingPath.strokes.length === 0) {
    renderEmpty(joinSvg, "No drawable points.");
    renderEmpty(joinStaticSvg, "No drawable points.");
    stopAnimation();
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
  const shiftedPath = shiftWritingPath(writingPath, offsetX, offsetY);

  joinSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  joinStaticSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  joinSvg.innerHTML = `
    <rect class="demo-join__bg" x="0" y="0" width="${width}" height="${height}"></rect>
    <line
      class="demo-guide demo-guide--xheight"
      x1="0"
      y1="${shiftedPath.guides.xHeight + offsetY}"
      x2="${width}"
      y2="${shiftedPath.guides.xHeight + offsetY}"
    ></line>
    <line
      class="demo-guide demo-guide--baseline"
      x1="0"
      y1="${shiftedPath.guides.baseline + offsetY}"
      x2="${width}"
      y2="${shiftedPath.guides.baseline + offsetY}"
    ></line>
    ${shiftedPath.strokes
      .map((stroke, index) => {
        const d = buildPathD(stroke.curves);
        return `<path class="demo-join__path" data-stroke="${index}" d="${d}"></path>`;
      })
      .join("")}
    <circle class="demo-join__nib" cx="0" cy="0" r="12"></circle>
  `;
  joinStaticSvg.innerHTML = buildStaticMarkup(shiftedPath, width, height, offsetY);

  const strokeEls = Array.from(
    joinSvg.querySelectorAll<SVGPathElement>(".demo-join__path")
  );
  const nibEl = joinSvg.querySelector<SVGCircleElement>(".demo-join__nib");
  if (!nibEl) {
    stopAnimation();
    return;
  }

  const strokeLengths = strokeEls.map((el) => {
    const length = el.getTotalLength();
    return Number.isFinite(length) && length > 0 ? length : 0.001;
  });

  strokeEls.forEach((el, index) => {
    const length = Math.max(strokeLengths[index] ?? 0, 0.001);
    el.style.strokeDasharray = `${length} ${length}`;
    el.style.strokeDashoffset = `${length}`;
  });

  const player = new AnimationPlayer(shiftedPath, {
    speed: 1.8,
    penUpSpeed: 2.2,
    deferredDelayMs: 160
  });
  const pauseMs = 700;
  const start = performance.now();

  const tick = (now: number) => {
    const elapsed = now - start;
    const cycle = player.totalDuration + pauseMs;
    const cycleOffset = elapsed % cycle;
    const time = Math.min(cycleOffset, player.totalDuration);
    const frame = player.getFrame(time);

    nibEl.setAttribute("cx", frame.point.x.toFixed(2));
    nibEl.setAttribute("cy", frame.point.y.toFixed(2));

    const completed = new Set(frame.completedStrokes);
    strokeEls.forEach((el, index) => {
      const length = Math.max(strokeLengths[index] ?? 0, 0.001);
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

    animationFrameId = requestAnimationFrame(tick);
  };

  stopAnimation();
  animationFrameId = requestAnimationFrame(tick);
};

input.addEventListener("input", () => render(input.value));
joinControlDefinitions.forEach((control) => {
  joinSpacingInputs[control.key]?.addEventListener("input", () => {
    syncJoinSpacingLabels();
    render(input.value);
  });
});

syncJoinSpacingLabels();
render(input.value);
