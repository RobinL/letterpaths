import "./demo.css"
import "./join-stats.css"
import {
  buildHandwritingPath,
  CubicBezier,
  defaultJoinSpacingOptions,
  lettersByVariantId,
  type JoinMetric,
  type WritingPath
} from "letterpaths"

const app = document.querySelector<HTMLDivElement>("#app")

if (!app) {
  throw new Error("Missing #app element for join stats.")
}

const DEFAULT_TEXT = "cursive"
const targetGuides = {
  xHeight: 360,
  baseline: 720
}
const letters = lettersByVariantId

type JoinControlKey = keyof typeof defaultJoinSpacingOptions

const joinControlDefinitions = [
  {
    key: "sidebearingGapAdjustment",
    label: "Letter spacing adjustment",
    min: -120,
    max: 120,
    step: 5,
    value: defaultJoinSpacingOptions.sidebearingGapAdjustment
  }
] as const satisfies ReadonlyArray<{
  key: JoinControlKey
  label: string
  min: number
  max: number
  step: number
  value: number
}>

type LetterSlot = {
  index: number
  char: string
  leftX: number
  rightX: number
  selectPairIndex: number
  previousPairIndex?: number
  nextPairIndex?: number
}

type RenderState = {
  path: WritingPath
  shiftedPath: WritingPath
  metrics: JoinMetric[]
  slots: LetterSlot[]
  width: number
  height: number
  offsetX: number
  offsetY: number
}

app.innerHTML = `
  <main class="join-stats">
    <header class="join-stats__header">
      <div>
        <h1>Join stats</h1>
        <p>Inspect hard-coded spacing for adjacent cursive letters.</p>
      </div>
    </header>

    <section class="join-stats__topbar">
      <form class="join-stats__form" id="join-stats-form">
        <label class="join-stats__field">
          Text to join
          <input
            class="join-stats__input"
            id="join-stats-word"
            type="text"
            value="${DEFAULT_TEXT}"
            spellcheck="false"
            autocomplete="off"
          />
        </label>
        <button class="join-stats__button" type="submit">Join</button>
      </form>
    </section>

    <section class="join-stats__controls">
      <div class="join-stats__controls-title">
        <h2>Join spacing controls</h2>
        <span>Changes re-run the cursive joiner</span>
      </div>
      <div class="join-stats__slider-grid">
        ${joinControlDefinitions
          .map(
            (control) => `
              <label class="join-stats__field">
                ${control.label}
                <div class="join-stats__range-row">
                  <input
                    class="join-stats__range"
                    id="join-stats-${control.key}"
                    type="range"
                    min="${control.min}"
                    max="${control.max}"
                    step="${control.step}"
                    value="${control.value}"
                  />
                  <span class="join-stats__range-value" id="join-stats-${control.key}-value">
                    ${control.value}
                  </span>
                </div>
              </label>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="join-stats__layout">
      <article class="join-stats__panel">
        <div class="join-stats__panel-title">
          <h2>Segments</h2>
          <span id="join-stats-selection-label">Click a letter to select a join</span>
        </div>
        <svg class="join-stats__svg" id="join-stats-word-svg" viewBox="0 0 1600 900"></svg>
      </article>

      <article class="join-stats__panel">
        <div class="join-stats__panel-title">
          <h2>Detailed calculations</h2>
          <span id="join-stats-pair-label">No pair selected</span>
        </div>
        <div class="join-stats__metrics" id="join-stats-metrics"></div>
      </article>

      <article class="join-stats__panel">
        <div class="join-stats__panel-title">
          <h2>Calculation visual</h2>
          <span>Hard-coded gap, adjustment and actual placement</span>
        </div>
        <svg
          class="join-stats__svg join-stats__svg--calculation"
          id="join-stats-calculation-svg"
          viewBox="0 0 1200 800"
        ></svg>
      </article>
    </section>
  </main>
`

const form = document.querySelector<HTMLFormElement>("#join-stats-form")
const input = document.querySelector<HTMLInputElement>("#join-stats-word")
const wordSvg = document.querySelector<SVGSVGElement>("#join-stats-word-svg")
const calculationSvg = document.querySelector<SVGSVGElement>("#join-stats-calculation-svg")
const metricsEl = document.querySelector<HTMLDivElement>("#join-stats-metrics")
const selectionLabel = document.querySelector<HTMLSpanElement>("#join-stats-selection-label")
const pairLabel = document.querySelector<HTMLSpanElement>("#join-stats-pair-label")

if (!form || !input || !wordSvg || !calculationSvg || !metricsEl || !selectionLabel || !pairLabel) {
  throw new Error("Missing elements for join stats.")
}

const joinSpacingInputs = Object.fromEntries(
  joinControlDefinitions.map((control) => [
    control.key,
    document.querySelector<HTMLInputElement>(`#join-stats-${control.key}`)
  ])
) as Record<JoinControlKey, HTMLInputElement | null>

const joinSpacingValues = Object.fromEntries(
  joinControlDefinitions.map((control) => [
    control.key,
    document.querySelector<HTMLSpanElement>(`#join-stats-${control.key}-value`)
  ])
) as Record<JoinControlKey, HTMLSpanElement | null>

if (
  Object.values(joinSpacingInputs).some((inputEl) => !inputEl) ||
  Object.values(joinSpacingValues).some((valueEl) => !valueEl)
) {
  throw new Error("Missing join spacing controls for join stats.")
}

let selectedPairIndex = 0
let currentMetricCount = 0

const metricXKeys = [
  "previousExitX",
  "previousRightSidebearingX",
  "actualNextLeftSidebearingX",
  "nextEntryX"
] as const satisfies ReadonlyArray<keyof JoinMetric>

const escapeHtml = (value: string): string =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

const formatNumber = (value: number, digits = 2): string => {
  if (!Number.isFinite(value)) {
    return "0"
  }
  const resolvedDigits = Math.abs(value) >= 100 ? Math.min(digits, 1) : digits
  return value.toFixed(resolvedDigits)
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const formulaNumber = (
  value: string,
  className: string,
  title: string
): string => `<span class="join-stats__formula-token ${className}" title="${escapeHtml(title)}">${escapeHtml(value)}</span>`

const formulaTerm = (
  label: string,
  className: string,
  title: string
): string => `<span class="join-stats__formula-term ${className}" title="${escapeHtml(title)}">${escapeHtml(label)}</span>`

const readJoinSpacing = () => ({
  sidebearingGapAdjustment: Number(
    joinSpacingInputs.sidebearingGapAdjustment?.value ?? 0
  )
})

const syncJoinSpacingLabels = () => {
  joinControlDefinitions.forEach((control) => {
    const inputEl = joinSpacingInputs[control.key]
    const valueEl = joinSpacingValues[control.key]
    if (!inputEl || !valueEl) {
      return
    }
    valueEl.textContent = Number(inputEl.value).toFixed(0)
  })
}

const buildPathD = (curves: CubicBezier[]): string => {
  if (curves.length === 0) {
    return ""
  }
  const [first, ...rest] = curves
  let d = `M ${first.p0.x} ${first.p0.y} `
  ;[first, ...rest].forEach((curve) => {
    d += `C ${curve.p1.x} ${curve.p1.y} ${curve.p2.x} ${curve.p2.y} ${curve.p3.x} ${curve.p3.y} `
  })
  return d.trim()
}

const buildCurveD = (curve: CubicBezier): string =>
  `M ${curve.p0.x} ${curve.p0.y} C ${curve.p1.x} ${curve.p1.y} ${curve.p2.x} ${curve.p2.y} ${curve.p3.x} ${curve.p3.y}`

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
})

const shiftMetricX = (metric: JoinMetric, dx: number): JoinMetric => {
  const shifted = { ...metric }
  metricXKeys.forEach((key) => {
    shifted[key] = metric[key] + dx
  })
  return shifted
}

const getJoinCurves = (path: WritingPath): CubicBezier[] => {
  const curves: CubicBezier[] = []
  path.strokes.forEach((stroke) => {
    stroke.curves.forEach((curve, index) => {
      if (stroke.curveSegments?.[index] === "join") {
        curves.push(curve)
      }
    })
  })
  return curves
}

const getSegmentColor = (segment: string | undefined, fallbackIndex: number): string => {
  const segmentColors: Record<string, string> = {
    "lead-in": "#5f9ed1",
    entry: "#2b6fa7",
    body: "#188977",
    ascender: "#315a9d",
    descender: "#0d7f8c",
    exit: "#4f8f38",
    "lead-out": "#7cae4f",
    dot: "#4d9fb2"
  }
  const fallbackPalette = ["#2b6fa7", "#188977", "#315a9d", "#4f8f38", "#5f9ed1", "#7cae4f"]
  return segment ? (segmentColors[segment] ?? fallbackPalette[fallbackIndex % fallbackPalette.length]!) : fallbackPalette[fallbackIndex % fallbackPalette.length]!
}

const buildSegmentPaths = (path: WritingPath): string => {
  let fallbackIndex = 0
  let joinIndex = 0
  return path.strokes
    .flatMap((stroke) =>
      stroke.curves.map((curve, index) => {
        const segment = stroke.curveSegments?.[index]
        const d = buildCurveD(curve)
        if (segment === "join") {
          const isSelected = joinIndex === selectedPairIndex
          joinIndex += 1
          return `<path class="join-stats__segment-path join-stats__segment-path--join ${
            isSelected ? "join-stats__segment-path--selected-join" : ""
          }" d="${d}"></path>`
        }
        const color = getSegmentColor(segment, fallbackIndex)
        fallbackIndex += 1
        return `<path class="join-stats__segment-path" d="${d}" stroke="${color}" stroke-opacity="0.74" stroke-width="42"></path>`
      })
    )
    .join("")
}

const buildSelectedJoinAnchors = (path: WritingPath): string => {
  const joinCurve = getJoinCurves(path)[selectedPairIndex]
  if (!joinCurve) {
    return ""
  }

  const points = [
    { label: "p0", point: joinCurve.p0, type: "end" },
    { label: "p1", point: joinCurve.p1, type: "control" },
    { label: "p2", point: joinCurve.p2, type: "control" },
    { label: "p3", point: joinCurve.p3, type: "end" }
  ]

  return `
    <g class="join-stats__anchor-overlay" aria-label="Selected join Bezier anchors">
      <line class="join-stats__anchor-handle" x1="${joinCurve.p0.x}" y1="${joinCurve.p0.y}" x2="${joinCurve.p1.x}" y2="${joinCurve.p1.y}"></line>
      <line class="join-stats__anchor-handle" x1="${joinCurve.p3.x}" y1="${joinCurve.p3.y}" x2="${joinCurve.p2.x}" y2="${joinCurve.p2.y}"></line>
      ${points
        .map(
          ({ label, point, type }) => `
            <g>
              <circle
                class="join-stats__anchor-point join-stats__anchor-point--${type}"
                cx="${point.x}"
                cy="${point.y}"
                r="${type === "control" ? 10 : 12}"
              ></circle>
              <text class="join-stats__anchor-label" x="${point.x + 14}" y="${point.y - 12}">${label}</text>
            </g>
          `
        )
        .join("")}
    </g>
  `
}

const buildLetterSlots = (
  path: WritingPath,
  metrics: JoinMetric[],
  offsetX: number
): LetterSlot[] => {
  const slots: LetterSlot[] = []
  if (metrics.length === 0) {
    return slots
  }

  metrics.forEach((metric, index) => {
    const previousMetric = metrics[index - 1]
    const nextMetric = metrics[index + 1]
    const startsSequence = !previousMetric || previousMetric.nextChar !== metric.previousChar

    if (startsSequence) {
      const leftX =
        index === 0
          ? Math.min(path.bounds.minX, 0)
          : Math.min(metric.previousExitX - 180, metric.previousRightSidebearingX - 260)
      slots.push({
        index: slots.length,
        char: metric.previousChar,
        leftX: leftX + offsetX,
        rightX: metric.previousRightSidebearingX + offsetX,
        selectPairIndex: index,
        nextPairIndex: index
      })
    }

    const continuesSequence = nextMetric?.previousChar === metric.nextChar
    const previousSlot = slots[slots.length - 1]
    const fallbackAdvance = previousSlot
      ? Math.max(130, previousSlot.rightX - previousSlot.leftX)
      : 260
    const nextRightX = continuesSequence
      ? nextMetric.previousRightSidebearingX
      : Math.max(path.bounds.maxX, metric.actualNextLeftSidebearingX + fallbackAdvance)

    slots.push({
      index: slots.length,
      char: metric.nextChar,
      leftX: metric.actualNextLeftSidebearingX + offsetX,
      rightX: nextRightX + offsetX,
      selectPairIndex: continuesSequence ? index + 1 : index,
      previousPairIndex: index,
      nextPairIndex: continuesSequence ? index + 1 : undefined
    })
  })

  return slots
}

const isSlotSelected = (slot: LetterSlot): boolean =>
  slot.previousPairIndex === selectedPairIndex || slot.nextPairIndex === selectedPairIndex

const buildLetterOverlays = (slots: LetterSlot[], height: number): string =>
  slots
    .map((slot) => {
      const x = Math.min(slot.leftX, slot.rightX)
      const width = Math.max(48, Math.abs(slot.rightX - slot.leftX))
      const center = x + width / 2
      return `
        <g
          class="join-stats__letter-zone ${isSlotSelected(slot) ? "join-stats__letter-zone--selected" : ""}"
          data-pair-index="${slot.selectPairIndex}"
        >
          <rect x="${x}" y="20" width="${width}" height="${height - 40}" rx="8"></rect>
          <text x="${center}" y="58" text-anchor="middle">${escapeHtml(slot.char)}</text>
        </g>
      `
    })
    .join("")

const renderEmptySvg = (svg: SVGSVGElement, message: string) => {
  svg.setAttribute("viewBox", "0 0 1200 520")
  svg.innerHTML = `
    <rect class="join-stats__bg" x="0" y="0" width="1200" height="520"></rect>
    <text class="join-stats__empty" x="600" y="270" text-anchor="middle">${escapeHtml(message)}</text>
  `
}

const createRenderState = (value: string): RenderState | null => {
  const text = value.trim().toLowerCase()
  if (!text) {
    return null
  }

  const path = buildHandwritingPath(text, {
    style: "cursive",
    targetGuides,
    joinSpacing: readJoinSpacing(),
    letters
  })

  if (path.strokes.length === 0) {
    return null
  }

  const padding = 120
  const width = Math.max(1000, Math.ceil(path.bounds.maxX - path.bounds.minX + padding * 2))
  const height = Math.max(740, Math.ceil(path.bounds.maxY - path.bounds.minY + padding * 2))
  const offsetX = padding - path.bounds.minX
  const offsetY = padding - path.bounds.minY
  const shiftedPath = shiftWritingPath(path, offsetX, offsetY)
  const metrics = path.joinMetrics ?? []
  const slots = buildLetterSlots(path, metrics, offsetX)

  return {
    path,
    shiftedPath,
    metrics,
    slots,
    width,
    height,
    offsetX,
    offsetY
  }
}

const renderWordPanel = (state: RenderState) => {
  wordSvg.setAttribute("viewBox", `0 0 ${state.width} ${state.height}`)
  wordSvg.innerHTML = `
    <rect class="join-stats__bg" x="0" y="0" width="${state.width}" height="${state.height}"></rect>
    <line
      class="demo-guide demo-guide--xheight"
      x1="0"
      y1="${state.path.guides.xHeight + state.offsetY}"
      x2="${state.width}"
      y2="${state.path.guides.xHeight + state.offsetY}"
    ></line>
    <line
      class="demo-guide demo-guide--baseline"
      x1="0"
      y1="${state.path.guides.baseline + state.offsetY}"
      x2="${state.width}"
      y2="${state.path.guides.baseline + state.offsetY}"
    ></line>
    ${buildSegmentPaths(state.shiftedPath)}
    ${buildLetterOverlays(state.slots, state.height)}
    ${buildSelectedJoinAnchors(state.shiftedPath)}
  `
}

const buildContextPaths = (path: WritingPath): string =>
  path.strokes
    .map((stroke) => {
      const d = buildPathD(stroke.curves)
      return d ? `<path class="join-stats__context-path" d="${d}"></path>` : ""
    })
    .join("")

const renderCalculationPanel = (state: RenderState) => {
  const metric = state.metrics[selectedPairIndex]
  const joinCurve = getJoinCurves(state.shiftedPath)[selectedPairIndex]
  if (!metric || !joinCurve) {
    renderEmptySvg(calculationSvg, "Select a joinable pair to inspect the hard-coded spacing.")
    return
  }

  const shiftedMetric = shiftMetricX(metric, state.offsetX)
  const selectedSlots = state.slots.filter(isSlotSelected)
  const selectedMinX = Math.min(
    ...selectedSlots.map((slot) => slot.leftX),
    joinCurve.p0.x
  )
  const selectedMaxX = Math.max(
    ...selectedSlots.map((slot) => slot.rightX),
    joinCurve.p3.x
  )
  const guideYValues = [
    state.path.guides.xHeight + state.offsetY,
    state.path.guides.baseline + state.offsetY
  ]
  const xValues = [
    selectedMinX,
    selectedMaxX,
    joinCurve.p0.x,
    joinCurve.p1.x,
    joinCurve.p2.x,
    joinCurve.p3.x,
    shiftedMetric.previousRightSidebearingX,
    shiftedMetric.actualNextLeftSidebearingX,
    shiftedMetric.nextEntryX
  ]
  const yValues = [
    joinCurve.p0.y,
    joinCurve.p1.y,
    joinCurve.p2.y,
    joinCurve.p3.y,
    ...guideYValues
  ]
  const minX = Math.min(...xValues) - 140
  const maxX = Math.max(...xValues) + 140
  const minY = Math.min(...yValues) - 120
  const maxY = Math.max(...yValues) + 130
  const width = Math.max(500, maxX - minX)
  const height = Math.max(440, maxY - minY)
  const topLabelY = minY + 34
  const sidebearingTop = minY + 58
  const sidebearingBottom = maxY - 72
  const appliedGapY = Math.max(joinCurve.p0.y, joinCurve.p3.y) + 68

  calculationSvg.setAttribute("viewBox", `${minX} ${minY} ${width} ${height}`)
  calculationSvg.innerHTML = `
    <defs>
      <marker id="join-stats-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
        <path d="M 0 0 L 8 4 L 0 8 z" fill="#1f2724"></path>
      </marker>
    </defs>
    <rect class="join-stats__bg" x="${minX}" y="${minY}" width="${width}" height="${height}"></rect>
    <line class="demo-guide demo-guide--xheight" x1="${minX}" y1="${guideYValues[0]}" x2="${maxX}" y2="${guideYValues[0]}"></line>
    <line class="demo-guide demo-guide--baseline" x1="${minX}" y1="${guideYValues[1]}" x2="${maxX}" y2="${guideYValues[1]}"></line>
    ${buildContextPaths(state.shiftedPath)}

    <line class="join-stats__calc-line join-stats__calc-line--previous" x1="${shiftedMetric.previousRightSidebearingX}" y1="${sidebearingTop}" x2="${shiftedMetric.previousRightSidebearingX}" y2="${sidebearingBottom}"></line>
    <line class="join-stats__calc-line join-stats__calc-line--actual" x1="${shiftedMetric.actualNextLeftSidebearingX}" y1="${sidebearingTop}" x2="${shiftedMetric.actualNextLeftSidebearingX}" y2="${sidebearingBottom}"></line>
    <line class="join-stats__calc-line join-stats__calc-line--entry" x1="${shiftedMetric.nextEntryX}" y1="${sidebearingTop}" x2="${shiftedMetric.nextEntryX}" y2="${sidebearingBottom}"></line>

    <text class="join-stats__label" x="${shiftedMetric.previousRightSidebearingX}" y="${topLabelY}" text-anchor="middle">prev right</text>
    <text class="join-stats__label" x="${shiftedMetric.actualNextLeftSidebearingX}" y="${topLabelY + 36}" text-anchor="middle">actual left</text>
    <text class="join-stats__label" x="${shiftedMetric.nextEntryX}" y="${topLabelY + 72}" text-anchor="middle">next entry</text>

    <path class="join-stats__calc-join" d="${buildCurveD(joinCurve)}"></path>
    <line class="join-stats__calc-handle" x1="${joinCurve.p0.x}" y1="${joinCurve.p0.y}" x2="${joinCurve.p1.x}" y2="${joinCurve.p1.y}"></line>
    <line class="join-stats__calc-handle" x1="${joinCurve.p3.x}" y1="${joinCurve.p3.y}" x2="${joinCurve.p2.x}" y2="${joinCurve.p2.y}"></line>
    <circle class="join-stats__calc-point" cx="${joinCurve.p0.x}" cy="${joinCurve.p0.y}" r="10"></circle>
    <circle class="join-stats__calc-point" cx="${joinCurve.p3.x}" cy="${joinCurve.p3.y}" r="10"></circle>
    <text class="join-stats__label" x="${joinCurve.p0.x - 16}" y="${joinCurve.p0.y - 24}" text-anchor="end">exit</text>
    <text class="join-stats__label" x="${joinCurve.p3.x + 16}" y="${joinCurve.p3.y - 24}">entry</text>

    <line class="join-stats__measure" x1="${joinCurve.p0.x}" y1="${appliedGapY}" x2="${joinCurve.p3.x}" y2="${appliedGapY}"></line>
    <text class="join-stats__label" x="${(joinCurve.p0.x + joinCurve.p3.x) / 2}" y="${appliedGapY + 32}" text-anchor="middle">
      applied gap ${formatNumber(metric.appliedGap)}
    </text>
  `
}

const metricRow = (label: string, value: string): string => `
  <div class="join-stats__metric-row">
    <div class="join-stats__metric-label">${escapeHtml(label)}</div>
    <div class="join-stats__metric-value">${escapeHtml(value)}</div>
  </div>
`

const formulaLine = (label: string, symbolic: string, numeric: string): string => `
  <div class="join-stats__formula-line">
    <div class="join-stats__formula-label">${escapeHtml(label)}</div>
    <div class="join-stats__formula-expression">${symbolic}</div>
    <div class="join-stats__formula-expression">${numeric}</div>
  </div>
`

const renderEmptyMetricsPanel = (message: string) => {
  metricsEl.innerHTML = `
    <div class="join-stats__formula">
      ${escapeHtml(message)}
    </div>
  `
  pairLabel.textContent = "No pair selected"
}

const renderMetricsPanel = (state: RenderState) => {
  const metric = state.metrics[selectedPairIndex]
  if (!metric) {
    renderEmptyMetricsPanel("Enter at least two joinable cursive letters.")
    return
  }

  const spacing = readJoinSpacing()
  const actualLeft = formatNumber(metric.actualNextLeftSidebearingX)
  const actualSidebearingGap = formatNumber(metric.renderedSidebearingGap)
  const baseGap = formatNumber(metric.baseSidebearingGap)
  const adjustment = formatNumber(spacing.sidebearingGapAdjustment)
  const previousRight = formatNumber(metric.previousRightSidebearingX)

  pairLabel.textContent = `${metric.pair} pair ${selectedPairIndex + 1} of ${state.metrics.length}`
  metricsEl.innerHTML = `
    <div class="join-stats__formula">
      ${formulaLine(
        "final gap",
        "hard-coded sidebearing gap + adjustment",
        `${formulaNumber(baseGap, "join-stats__formula-token--actual", "hard-coded sidebearing gap")} + ${formulaNumber(adjustment, "join-stats__formula-token--computed-gap", "user spacing adjustment")} = ${formulaNumber(actualSidebearingGap, "join-stats__formula-token--actual", "actual sidebearing gap")}`
      )}
      ${formulaLine(
        "actual left",
        "previous right sidebearing x + final gap",
        `${formulaNumber(previousRight, "join-stats__formula-token--raw-target", "previous right sidebearing x")} + ${formulaNumber(actualSidebearingGap, "join-stats__formula-token--actual", "actual sidebearing gap")} = ${formulaNumber(actualLeft, "join-stats__formula-token--actual", "actual next left sidebearing x")}`
      )}
    </div>
    <div class="join-stats__metric-grid">
      ${metricRow("Pair", metric.pair)}
      ${metricRow("Kerning source", metric.kerningSource)}
      ${metricRow("Hard-coded sidebearing gap", baseGap)}
      ${metricRow("Spacing adjustment", adjustment)}
      ${metricRow("Rendered sidebearing gap", actualSidebearingGap)}
      ${metricRow("p0-p1 handle scale", formatNumber(metric.exitHandleScale))}
      ${metricRow("p2-p3 handle scale", formatNumber(metric.entryHandleScale))}
      ${metricRow("Previous exit to right sidebearing", formatNumber(metric.previousExitToRightSidebearing))}
      ${metricRow("Next entry from left sidebearing", formatNumber(metric.nextEntryFromLeftSidebearing))}
      ${metricRow("Actual left sidebearing x", formatNumber(metric.actualNextLeftSidebearingX))}
      ${metricRow("Applied exit-to-entry gap", formatNumber(metric.appliedGap))}
    </div>
  `
}

const render = (resetSelection = false) => {
  syncJoinSpacingLabels()
  const state = createRenderState(input.value)

  if (!state) {
    currentMetricCount = 0
    renderEmptySvg(wordSvg, "Enter text to render.")
    renderEmptySvg(calculationSvg, "No join calculation available.")
    renderEmptyMetricsPanel("Enter at least two joinable cursive letters.")
    selectionLabel.textContent = "Click a letter to select a join"
    return
  }

  currentMetricCount = state.metrics.length
  if (resetSelection) {
    selectedPairIndex = 0
  }
  selectedPairIndex = currentMetricCount > 0 ? clamp(selectedPairIndex, 0, currentMetricCount - 1) : 0

  renderWordPanel(state)
  renderCalculationPanel(state)
  renderMetricsPanel(state)

  selectionLabel.textContent =
    currentMetricCount > 0
      ? `Selected ${state.metrics[selectedPairIndex]?.pair ?? ""} (${selectedPairIndex + 1} of ${currentMetricCount})`
      : "Enter at least two joinable letters"
}

form.addEventListener("submit", (event) => {
  event.preventDefault()
  render(true)
})

wordSvg.addEventListener("click", (event) => {
  if (currentMetricCount === 0) {
    return
  }
  const target = event.target
  if (!(target instanceof Element)) {
    return
  }
  const slotEl = target.closest<SVGGElement>("[data-pair-index]")
  if (!slotEl) {
    return
  }
  selectedPairIndex = clamp(Number(slotEl.dataset.pairIndex ?? 0), 0, currentMetricCount - 1)
  render()
})

joinControlDefinitions.forEach((control) => {
  joinSpacingInputs[control.key]?.addEventListener("input", () => render())
})

syncJoinSpacingLabels()
render(true)
