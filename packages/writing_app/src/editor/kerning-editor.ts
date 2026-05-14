import "./demo.css"
import "./kerning-editor.css"
import {
  buildHandwritingPath,
  defaultCursiveKerningSettings,
  lettersByVariantId,
  type CursiveKerningPairs,
  type CursiveKerningSettings,
  type JoinMetric,
  type JoinSpacingOptions,
  type WritingPath
} from "letterpaths"

type EditablePermissionState = "granted" | "denied" | "prompt"

type EditableFileHandle = {
  kind?: "file"
  name: string
  getFile(): Promise<File>
  createWritable(): Promise<{
    write(data: string): Promise<void>
    truncate(size: number): Promise<void>
    close(): Promise<void>
  }>
  queryPermission?(descriptor: { mode: "read" | "readwrite" }): Promise<EditablePermissionState>
  requestPermission?(descriptor: { mode: "read" | "readwrite" }): Promise<EditablePermissionState>
}

type FilePickerWindow = Window &
  typeof globalThis & {
    showOpenFilePicker?: (options: {
      id?: string
      multiple?: boolean
      types?: Array<{
        description: string
        accept: Record<string, string[]>
      }>
    }) => Promise<EditableFileHandle[]>
    showSaveFilePicker?: (options: {
      id?: string
      suggestedName?: string
      types?: Array<{
        description: string
        accept: Record<string, string[]>
      }>
    }) => Promise<EditableFileHandle>
  }

type JoinControlKey = keyof Required<JoinSpacingOptions>

type PairSnapshot = {
  path: WritingPath
  metric: JoinMetric | null
  gap: number
  exitHandleScale: number
  entryHandleScale: number
  source: "algorithm" | "override"
  viewBox: string
  minX: number
  maxX: number
  baselineY: number
  xHeightY: number
}

type DragState = {
  pair: string
  startClientX: number
  startGap: number
  unitsPerPx: number
}

const app = document.querySelector<HTMLDivElement>("#app")

if (!app) {
  throw new Error("Missing #app element for kerning editor.")
}

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")
const pairs = alphabet.flatMap((previous) => alphabet.map((next) => `${previous}${next}`))
const targetGuides = {
  xHeight: 360,
  baseline: 720
}
const letters = lettersByVariantId
const kerningGapMin = -500
const kerningGapMax = 500
const handleScaleMin = 0
const handleScaleMax = 2
const kerningHandleDbName = "letterpaths-kerning-editor-handles"
const kerningHandleStoreName = "handles"
const kerningHandleDbVersion = 1
const kerningFileHandleKey = "cursive-kerning-json"

const defaultEditorJoinSpacing = {
  targetBendRate: 7,
  minSidebearingGap: -135,
  maxSidebearingGap: 500,
  bendSearchMinSidebearingGap: 189,
  bendSearchMaxSidebearingGap: 80,
  exitHandleScale: 0.7,
  entryHandleScale: 1
} as const satisfies Required<JoinSpacingOptions>

const joinControlDefinitions = [
  {
    key: "targetBendRate",
    label: "Target maximum bend rate",
    min: 0,
    max: 30,
    step: 0.1,
    value: defaultEditorJoinSpacing.targetBendRate
  },
  {
    key: "minSidebearingGap",
    label: "Minimum sidebearing gap",
    min: -500,
    max: 500,
    step: 5,
    value: defaultEditorJoinSpacing.minSidebearingGap
  },
  {
    key: "maxSidebearingGap",
    label: "Maximum sidebearing gap",
    min: -500,
    max: 500,
    step: 5,
    value: defaultEditorJoinSpacing.maxSidebearingGap
  },
  {
    key: "bendSearchMinSidebearingGap",
    label: "Search minimum sidebearing gap",
    min: -300,
    max: 200,
    step: 1,
    value: defaultEditorJoinSpacing.bendSearchMinSidebearingGap
  },
  {
    key: "bendSearchMaxSidebearingGap",
    label: "Search maximum sidebearing gap",
    min: -120,
    max: 240,
    step: 1,
    value: defaultEditorJoinSpacing.bendSearchMaxSidebearingGap
  },
  {
    key: "exitHandleScale",
    label: "p0-p1 handle scale",
    min: 0,
    max: 2,
    step: 0.05,
    value: defaultEditorJoinSpacing.exitHandleScale
  },
  {
    key: "entryHandleScale",
    label: "p2-p3 handle scale",
    min: 0,
    max: 2,
    step: 0.05,
    value: defaultEditorJoinSpacing.entryHandleScale
  }
] as const satisfies ReadonlyArray<{
  key: JoinControlKey
  label: string
  min: number
  max: number
  step: number
  value: number
}>

const escapeHtml = (value: string): string =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const roundGap = (value: number): number => Math.round(value * 10) / 10

const roundScale = (value: number): number => Math.round(value * 100) / 100

const formatGap = (value: number): string => value.toFixed(1)

const formatScale = (value: number): string => value.toFixed(2)

const formatControlValue = (key: JoinControlKey, value: number): string =>
  key === "targetBendRate"
    ? value.toFixed(1)
    : key === "exitHandleScale" || key === "entryHandleScale"
      ? formatScale(value)
      : value.toFixed(0)

const buildCurveD = (curve: WritingPath["strokes"][number]["curves"][number]): string =>
  `M ${curve.p0.x} ${curve.p0.y} C ${curve.p1.x} ${curve.p1.y} ${curve.p2.x} ${curve.p2.y} ${curve.p3.x} ${curve.p3.y}`

const normalizeKerningPairs = (value: unknown): CursiveKerningPairs => {
  if (!value || typeof value !== "object") {
    return {}
  }
  const rawPairs =
    "pairs" in value && value.pairs && typeof value.pairs === "object"
      ? value.pairs
      : value
  const normalized: CursiveKerningPairs = {}
  Object.entries(rawPairs as Record<string, unknown>).forEach(([rawPair, rawValue]) => {
    const pair = rawPair.toLowerCase()
    if (!/^[a-z]{2}$/.test(pair)) {
      return
    }
    const rawObject =
      rawValue && typeof rawValue === "object"
        ? (rawValue as {
            sidebearingGap?: unknown
            exitHandleScale?: unknown
            entryHandleScale?: unknown
          })
        : null
    const sidebearingGap =
      typeof rawValue === "number"
        ? rawValue
        : rawObject && "sidebearingGap" in rawObject
          ? Number(rawObject.sidebearingGap)
          : Number.NaN
    const exitHandleScale =
      rawObject && "exitHandleScale" in rawObject
        ? Number(rawObject.exitHandleScale)
        : Number.NaN
    const entryHandleScale =
      rawObject && "entryHandleScale" in rawObject
        ? Number(rawObject.entryHandleScale)
        : Number.NaN
    const normalizedPair = {
      ...(Number.isFinite(sidebearingGap)
        ? {
            sidebearingGap: roundGap(clamp(sidebearingGap, kerningGapMin, kerningGapMax))
          }
        : {}),
      ...(Number.isFinite(exitHandleScale)
        ? {
            exitHandleScale: roundScale(
              clamp(exitHandleScale, handleScaleMin, handleScaleMax)
            )
          }
        : {}),
      ...(Number.isFinite(entryHandleScale)
        ? {
            entryHandleScale: roundScale(
              clamp(entryHandleScale, handleScaleMin, handleScaleMax)
            )
          }
        : {})
    }
    if (Object.keys(normalizedPair).length === 0) {
      return
    }
    normalized[pair] = normalizedPair
  })
  return Object.fromEntries(
    Object.entries(normalized).sort(([first], [second]) => first.localeCompare(second))
  )
}

const buildKerningSettings = (): CursiveKerningSettings => ({
  schemaVersion: 1,
  description:
    "Sparse hard-coded cursive pair kerning overrides. Each lowercase two-letter key can store sidebearingGap, exitHandleScale, and entryHandleScale. Missing values fall back to the join spacing algorithm/global controls.",
  units: "letterpath sidebearing gap and Bezier handle scale",
  pairs: Object.fromEntries(
    Object.entries(kerningPairs).sort(([first], [second]) => first.localeCompare(second))
  )
})

let joinSpacing: Required<JoinSpacingOptions> = { ...defaultEditorJoinSpacing }
let kerningPairs: CursiveKerningPairs = normalizeKerningPairs(defaultCursiveKerningSettings)
let selectedPair = "aa"
let activeDrag: DragState | null = null
let editableFileHandle: EditableFileHandle | null = null
let editableFileName = "packages/letterpaths/src/data/cursive-kerning.json"
let hasUnsavedChanges = false
let filterMode: "all" | "override" | "algorithm" = "all"
let searchQuery = ""

app.innerHTML = `
  <main class="kerning-editor">
    <header class="kerning-editor__header">
      <div>
        <h1>Cursive kerning editor</h1>
        <p>Edit default pair spacing for joined lowercase letters.</p>
      </div>
      <div class="kerning-editor__meta" id="kerning-editor-meta"></div>
    </header>

    <section class="kerning-editor__toolbar">
      <button class="kerning-editor__button" id="kerning-open" type="button">Open kerning JSON</button>
      <button class="kerning-editor__button kerning-editor__button--primary" id="kerning-save" type="button">Save</button>
      <button class="kerning-editor__button" id="kerning-download" type="button">Download JSON</button>
      <input id="kerning-load-input" type="file" accept="application/json,.json" hidden />
      <label class="kerning-editor__field">
        Filter
        <select id="kerning-filter">
          <option value="all">All pairs</option>
          <option value="override">Overrides</option>
          <option value="algorithm">Algorithm fallback</option>
        </select>
      </label>
      <label class="kerning-editor__field">
        Search
        <input id="kerning-search" type="search" placeholder="aa" autocomplete="off" />
      </label>
      <div class="kerning-editor__status" id="kerning-status"></div>
    </section>

    <section class="kerning-editor__settings">
      <div class="kerning-editor__settings-title">
        <h2>Join spacing controls</h2>
        <span class="kerning-editor__status">Changes re-run the cursive joiner</span>
      </div>
      <div class="kerning-editor__slider-grid">
        ${joinControlDefinitions
          .map(
            (control) => `
              <label class="kerning-editor__field">
                ${control.label}
                <div class="kerning-editor__range-row">
                  <input
                    class="kerning-editor__range"
                    id="kerning-${control.key}"
                    type="range"
                    min="${control.min}"
                    max="${control.max}"
                    step="${control.step}"
                    value="${control.value}"
                  />
                  <span class="kerning-editor__range-value" id="kerning-${control.key}-value">
                    ${formatControlValue(control.key, control.value)}
                  </span>
                </div>
              </label>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="kerning-editor__workspace">
      <aside class="kerning-editor__selected" id="kerning-selected"></aside>
      <section class="kerning-editor__grid-shell">
        <div class="kerning-editor__grid-header">
          <h2>Pairs</h2>
          <span class="kerning-editor__status" id="kerning-grid-count"></span>
        </div>
        <div class="kerning-editor__grid" id="kerning-grid"></div>
      </section>
    </section>
  </main>
`

const metaEl = document.querySelector<HTMLDivElement>("#kerning-editor-meta")!
const statusEl = document.querySelector<HTMLDivElement>("#kerning-status")!
const openButton = document.querySelector<HTMLButtonElement>("#kerning-open")!
const saveButton = document.querySelector<HTMLButtonElement>("#kerning-save")!
const downloadButton = document.querySelector<HTMLButtonElement>("#kerning-download")!
const loadInput = document.querySelector<HTMLInputElement>("#kerning-load-input")!
const filterSelect = document.querySelector<HTMLSelectElement>("#kerning-filter")!
const searchInput = document.querySelector<HTMLInputElement>("#kerning-search")!
const selectedEl = document.querySelector<HTMLElement>("#kerning-selected")!
const gridEl = document.querySelector<HTMLDivElement>("#kerning-grid")!
const gridCountEl = document.querySelector<HTMLSpanElement>("#kerning-grid-count")!

if (
  !metaEl ||
  !statusEl ||
  !openButton ||
  !saveButton ||
  !downloadButton ||
  !loadInput ||
  !filterSelect ||
  !searchInput ||
  !selectedEl ||
  !gridEl ||
  !gridCountEl
) {
  throw new Error("Missing elements for kerning editor.")
}

const joinSpacingInputs = Object.fromEntries(
  joinControlDefinitions.map((control) => [
    control.key,
    document.querySelector<HTMLInputElement>(`#kerning-${control.key}`)
  ])
) as Record<JoinControlKey, HTMLInputElement | null>

const joinSpacingValues = Object.fromEntries(
  joinControlDefinitions.map((control) => [
    control.key,
    document.querySelector<HTMLSpanElement>(`#kerning-${control.key}-value`)
  ])
) as Record<JoinControlKey, HTMLSpanElement | null>

if (
  Object.values(joinSpacingInputs).some((inputEl) => !inputEl) ||
  Object.values(joinSpacingValues).some((valueEl) => !valueEl)
) {
  throw new Error("Missing join spacing controls for kerning editor.")
}

function computePairSnapshot(pair: string): PairSnapshot {
  const override = kerningPairs[pair]
  const path = buildHandwritingPath(pair, {
    style: "cursive",
    targetGuides,
    joinSpacing,
    joinKerning: override ? { [pair]: override } : {},
    letters
  })
  const metric = path.joinMetrics?.[0] ?? null
  const gap = metric?.renderedSidebearingGap ?? override?.sidebearingGap ?? 0
  const exitHandleScale =
    metric?.kerningOverrideExitHandleScale ??
    override?.exitHandleScale ??
    joinSpacing.exitHandleScale
  const entryHandleScale =
    metric?.kerningOverrideEntryHandleScale ??
    override?.entryHandleScale ??
    joinSpacing.entryHandleScale
  const paddingX = 120
  const paddingY = 110
  const minX = path.bounds.minX - paddingX
  const maxX = path.bounds.maxX + paddingX
  const minY = Math.min(path.bounds.minY, targetGuides.xHeight) - paddingY
  const maxY = Math.max(path.bounds.maxY, targetGuides.baseline) + paddingY
  return {
    path,
    metric,
    gap,
    exitHandleScale,
    entryHandleScale,
    source: override ? "override" : "algorithm",
    viewBox: `${minX} ${minY} ${Math.max(420, maxX - minX)} ${Math.max(420, maxY - minY)}`,
    minX,
    maxX,
    baselineY: targetGuides.baseline,
    xHeightY: targetGuides.xHeight
  }
}

function buildPathMarkup(snapshot: PairSnapshot): string {
  const paths = snapshot.path.strokes
    .flatMap((stroke) =>
      stroke.curves.map((curve, index) => {
        const isJoin = stroke.curveSegments?.[index] === "join"
        return `<path class="kerning-svg__stroke ${isJoin ? "kerning-svg__stroke--join" : ""}" d="${buildCurveD(curve)}"></path>`
      })
    )
    .join("")
  const sidebearingX = snapshot.metric?.actualNextLeftSidebearingX
  return `
    <line class="kerning-svg__guide kerning-svg__guide--xheight" x1="${snapshot.minX}" y1="${snapshot.xHeightY}" x2="${snapshot.maxX}" y2="${snapshot.xHeightY}"></line>
    <line class="kerning-svg__guide kerning-svg__guide--baseline" x1="${snapshot.minX}" y1="${snapshot.baselineY}" x2="${snapshot.maxX}" y2="${snapshot.baselineY}"></line>
    ${sidebearingX === undefined ? "" : `<line class="kerning-svg__sidebearing" x1="${sidebearingX}" y1="${snapshot.xHeightY - 190}" x2="${sidebearingX}" y2="${snapshot.baselineY + 90}"></line>`}
    ${paths}
  `
}

function buildPairSvg(pair: string, className: string): string {
  const snapshot = computePairSnapshot(pair)
  return `
    <svg class="${className}" viewBox="${snapshot.viewBox}" aria-hidden="true">
      ${buildPathMarkup(snapshot)}
    </svg>
  `
}

function buildCardContent(pair: string): string {
  const snapshot = computePairSnapshot(pair)
  return `
    <div class="kerning-card__header">
      <span class="kerning-card__pair">${pair.toUpperCase()}</span>
      <span class="kerning-card__source ${snapshot.source === "override" ? "kerning-card__source--override" : ""}" title="${snapshot.source}"></span>
    </div>
    <svg class="kerning-card__svg" viewBox="${snapshot.viewBox}" aria-hidden="true">
      ${buildPathMarkup(snapshot)}
    </svg>
    <div class="kerning-card__footer">
      <span class="kerning-card__value">${formatGap(snapshot.gap)}</span>
      <span class="kerning-card__value">${snapshot.source === "override" ? `h ${formatScale(snapshot.exitHandleScale)}/${formatScale(snapshot.entryHandleScale)}` : "auto"}</span>
    </div>
  `
}

function pairMatchesFilter(pair: string): boolean {
  const hasOverride = Boolean(kerningPairs[pair])
  if (filterMode === "override" && !hasOverride) {
    return false
  }
  if (filterMode === "algorithm" && hasOverride) {
    return false
  }
  return !searchQuery || pair.includes(searchQuery)
}

function renderGrid() {
  const visiblePairs = pairs.filter(pairMatchesFilter)
  gridEl.innerHTML = visiblePairs
    .map(
      (pair) => `
        <article
          class="kerning-card ${pair === selectedPair ? "kerning-card--selected" : ""}"
          data-pair="${pair}"
          tabindex="0"
          aria-label="${pair.toUpperCase()} kerning pair"
        >
          ${buildCardContent(pair)}
        </article>
      `
    )
    .join("")
  gridCountEl.textContent = `${visiblePairs.length} shown`
}

function renderPairCard(pair: string) {
  const card = gridEl.querySelector<HTMLElement>(`[data-pair="${pair}"]`)
  if (!card) {
    return
  }
  card.classList.toggle("kerning-card--selected", pair === selectedPair)
  card.innerHTML = buildCardContent(pair)
}

function renderSelectedPair() {
  const snapshot = computePairSnapshot(selectedPair)
  const override = kerningPairs[selectedPair]
  selectedEl.innerHTML = `
    <div class="kerning-editor__selected-top">
      <h2 id="kerning-selected-title">${selectedPair.toUpperCase()}</h2>
      <span
        class="kerning-editor__badge ${snapshot.source === "override" ? "kerning-editor__badge--override" : ""}"
        id="kerning-selected-badge"
      >
        ${snapshot.source === "override" ? "override" : "algorithm"}
      </span>
    </div>
    <div id="kerning-selected-preview-wrap">
      ${buildPairSvg(selectedPair, "kerning-editor__preview")}
    </div>
    <div class="kerning-editor__selected-actions">
      <label class="kerning-editor__field">
        Sidebearing gap
        <input id="kerning-selected-gap" type="number" min="${kerningGapMin}" max="${kerningGapMax}" step="0.1" value="${formatGap(snapshot.gap)}" />
      </label>
      <label class="kerning-editor__field">
        p0-p1 handle scale
        <input id="kerning-selected-exit-handle" type="number" min="${handleScaleMin}" max="${handleScaleMax}" step="0.05" value="${formatScale(snapshot.exitHandleScale)}" />
      </label>
      <label class="kerning-editor__field">
        p2-p3 handle scale
        <input id="kerning-selected-entry-handle" type="number" min="${handleScaleMin}" max="${handleScaleMax}" step="0.05" value="${formatScale(snapshot.entryHandleScale)}" />
      </label>
      <button class="kerning-editor__button" id="kerning-reset-selected" type="button" ${override ? "" : "disabled"}>Reset</button>
    </div>
    <div class="kerning-editor__metrics" id="kerning-selected-metrics">
      ${buildSelectedMetrics(snapshot)}
    </div>
  `

  selectedEl.querySelector<HTMLInputElement>("#kerning-selected-gap")?.addEventListener("input", (event) => {
    const target = event.currentTarget as HTMLInputElement
    setPairSidebearingGap(selectedPair, Number(target.value), true)
  })
  selectedEl.querySelector<HTMLInputElement>("#kerning-selected-exit-handle")?.addEventListener("input", (event) => {
    const target = event.currentTarget as HTMLInputElement
    setPairHandleScale(selectedPair, "exitHandleScale", Number(target.value), true)
  })
  selectedEl.querySelector<HTMLInputElement>("#kerning-selected-entry-handle")?.addEventListener("input", (event) => {
    const target = event.currentTarget as HTMLInputElement
    setPairHandleScale(selectedPair, "entryHandleScale", Number(target.value), true)
  })
  selectedEl.querySelector<HTMLButtonElement>("#kerning-reset-selected")?.addEventListener("click", () => {
    clearPairOverride(selectedPair)
  })
  selectedEl.querySelector<HTMLElement>("#kerning-selected-preview-wrap")?.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return
    }
    event.preventDefault()
    beginDrag(selectedPair, event, event.currentTarget as HTMLElement)
  })
}

function buildSelectedMetrics(snapshot: PairSnapshot): string {
  return `
    ${metricRow("Rendered gap", formatGap(snapshot.gap))}
    ${metricRow("Algorithm gap", formatGap(computeAlgorithmGap(selectedPair)))}
    ${metricRow("p0-p1 handle scale", formatScale(snapshot.exitHandleScale))}
    ${metricRow("p2-p3 handle scale", formatScale(snapshot.entryHandleScale))}
    ${metricRow("Source", snapshot.source)}
    ${snapshot.metric?.searchedBendRate === undefined ? "" : metricRow("Selected bend", `${snapshot.metric.searchedBendRate.toFixed(2)} deg/0.1t`)}
  `
}

function updateSelectedPairReadout(syncInputs = false) {
  const snapshot = computePairSnapshot(selectedPair)
  const override = kerningPairs[selectedPair]
  const titleEl = selectedEl.querySelector<HTMLHeadingElement>("#kerning-selected-title")
  const badgeEl = selectedEl.querySelector<HTMLSpanElement>("#kerning-selected-badge")
  const previewWrapEl = selectedEl.querySelector<HTMLElement>("#kerning-selected-preview-wrap")
  const metricsEl = selectedEl.querySelector<HTMLDivElement>("#kerning-selected-metrics")
  const resetButton = selectedEl.querySelector<HTMLButtonElement>("#kerning-reset-selected")

  if (titleEl) {
    titleEl.textContent = selectedPair.toUpperCase()
  }
  if (badgeEl) {
    badgeEl.textContent = snapshot.source === "override" ? "override" : "algorithm"
    badgeEl.classList.toggle("kerning-editor__badge--override", snapshot.source === "override")
  }
  if (previewWrapEl) {
    previewWrapEl.innerHTML = buildPairSvg(selectedPair, "kerning-editor__preview")
  }
  if (metricsEl) {
    metricsEl.innerHTML = buildSelectedMetrics(snapshot)
  }
  if (resetButton) {
    resetButton.disabled = !override
  }
  if (syncInputs) {
    const gapInput = selectedEl.querySelector<HTMLInputElement>("#kerning-selected-gap")
    const exitHandleInput = selectedEl.querySelector<HTMLInputElement>("#kerning-selected-exit-handle")
    const entryHandleInput = selectedEl.querySelector<HTMLInputElement>("#kerning-selected-entry-handle")
    if (gapInput) {
      gapInput.value = formatGap(snapshot.gap)
    }
    if (exitHandleInput) {
      exitHandleInput.value = formatScale(snapshot.exitHandleScale)
    }
    if (entryHandleInput) {
      entryHandleInput.value = formatScale(snapshot.entryHandleScale)
    }
  }
}

function metricRow(label: string, value: string): string {
  return `
    <div class="kerning-editor__metric">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `
}

function computeAlgorithmGap(pair: string): number {
  const path = buildHandwritingPath(pair, {
    style: "cursive",
    targetGuides,
    joinSpacing,
    joinKerning: {},
    letters
  })
  return path.joinMetrics?.[0]?.renderedSidebearingGap ?? 0
}

function syncJoinSpacingFromInputs() {
  joinControlDefinitions.forEach((control) => {
    const input = joinSpacingInputs[control.key]
    const value = joinSpacingValues[control.key]
    if (!input || !value) {
      return
    }
    joinSpacing = {
      ...joinSpacing,
      [control.key]: Number(input.value)
    }
    value.textContent = formatControlValue(control.key, Number(input.value))
  })
}

function syncMeta() {
  const overrideCount = Object.keys(kerningPairs).length
  const dirtyText = hasUnsavedChanges ? "unsaved" : "saved"
  metaEl.textContent = `${overrideCount} / ${pairs.length} pairs set | ${dirtyText} | ${editableFileName}`
}

function renderAll() {
  syncJoinSpacingFromInputs()
  renderSelectedPair()
  renderGrid()
  syncMeta()
}

function selectPair(pair: string) {
  const previousPair = selectedPair
  selectedPair = pair
  renderPairCard(previousPair)
  renderPairCard(selectedPair)
  renderSelectedPair()
}

function setPairSidebearingGap(pair: string, rawGap: number, fromInput = false) {
  if (!Number.isFinite(rawGap)) {
    return
  }
  const sidebearingGap = roundGap(clamp(rawGap, kerningGapMin, kerningGapMax))
  kerningPairs = {
    ...kerningPairs,
    [pair]: {
      ...kerningPairs[pair],
      sidebearingGap
    }
  }
  hasUnsavedChanges = true
  renderPairCard(pair)
  if (pair === selectedPair) {
    if (fromInput) {
      updateSelectedPairReadout(false)
    } else {
      updateSelectedPairReadout(true)
    }
  } else if (!fromInput) {
    renderSelectedPair()
  }
  syncMeta()
  statusEl.textContent = `${pair.toUpperCase()} set to ${formatGap(sidebearingGap)}.`
}

function setPairHandleScale(
  pair: string,
  key: "exitHandleScale" | "entryHandleScale",
  rawScale: number,
  fromInput = false
) {
  if (!Number.isFinite(rawScale)) {
    return
  }
  const scale = roundScale(clamp(rawScale, handleScaleMin, handleScaleMax))
  kerningPairs = {
    ...kerningPairs,
    [pair]: {
      ...kerningPairs[pair],
      [key]: scale
    }
  }
  hasUnsavedChanges = true
  renderPairCard(pair)
  if (pair === selectedPair) {
    if (fromInput) {
      updateSelectedPairReadout(false)
    } else {
      updateSelectedPairReadout(true)
    }
  } else if (!fromInput) {
    renderSelectedPair()
  }
  syncMeta()
  statusEl.textContent = `${pair.toUpperCase()} ${key} set to ${formatScale(scale)}.`
}

function clearPairOverride(pair: string) {
  if (!kerningPairs[pair]) {
    return
  }
  const nextPairs = { ...kerningPairs }
  delete nextPairs[pair]
  kerningPairs = nextPairs
  hasUnsavedChanges = true
  renderPairCard(pair)
  renderSelectedPair()
  syncMeta()
  statusEl.textContent = `${pair.toUpperCase()} reset to algorithm fallback.`
}

function beginDrag(pair: string, event: PointerEvent, card: HTMLElement) {
  const snapshot = computePairSnapshot(pair)
  const svg = card.querySelector<SVGSVGElement>("svg")
  const rect = svg?.getBoundingClientRect()
  const viewBoxWidth = svg?.viewBox.baseVal.width ?? 600
  activeDrag = {
    pair,
    startClientX: event.clientX,
    startGap: snapshot.gap,
    unitsPerPx: rect && rect.width > 0 ? viewBoxWidth / rect.width : 3
  }
  document.body.classList.add("kerning-editor--dragging")
  selectPair(pair)
}

function finishDrag() {
  if (!activeDrag) {
    return
  }
  activeDrag = null
  document.body.classList.remove("kerning-editor--dragging")
}

function loadSettingsFromText(text: string, sourceName: string) {
  const payload = JSON.parse(text) as unknown
  kerningPairs = normalizeKerningPairs(payload)
  editableFileName = sourceName
  hasUnsavedChanges = false
  filterMode = "all"
  filterSelect.value = "all"
  statusEl.textContent = `Loaded ${sourceName}.`
  renderAll()
}

async function openKerningFile() {
  const pickerWindow = window as FilePickerWindow
  if (!pickerWindow.showOpenFilePicker) {
    loadInput.click()
    return
  }
  try {
    const [handle] = await pickerWindow.showOpenFilePicker({
      id: "letterpaths-cursive-kerning",
      multiple: false,
      types: [
        {
          description: "Kerning JSON",
          accept: { "application/json": [".json"] }
        }
      ]
    })
    if (!handle) {
      return
    }
    editableFileHandle = handle
    const file = await handle.getFile()
    loadSettingsFromText(await file.text(), handle.name)
    await persistKerningFileHandle(handle)
  } catch (error) {
    statusEl.textContent = "Open cancelled."
  }
}

async function ensureWritePermission(handle: EditableFileHandle): Promise<boolean> {
  const descriptor = { mode: "readwrite" as const }
  try {
    const current = await handle.queryPermission?.(descriptor)
    if (current === "granted") {
      return true
    }
    const next = await handle.requestPermission?.(descriptor)
    return next === "granted"
  } catch (error) {
    return false
  }
}

async function saveKerningFile() {
  const pickerWindow = window as FilePickerWindow
  if (!editableFileHandle) {
    if (!pickerWindow.showSaveFilePicker) {
      statusEl.textContent = "Open a writable kerning JSON file before saving."
      return
    }
    try {
      editableFileHandle = await pickerWindow.showSaveFilePicker({
        id: "letterpaths-cursive-kerning",
        suggestedName: "cursive-kerning.json",
        types: [
          {
            description: "Kerning JSON",
            accept: { "application/json": [".json"] }
          }
        ]
      })
      editableFileName = editableFileHandle.name
      await persistKerningFileHandle(editableFileHandle)
    } catch (error) {
      statusEl.textContent = "Save cancelled."
      return
    }
  }

  const hasPermission = await ensureWritePermission(editableFileHandle)
  if (!hasPermission) {
    statusEl.textContent = "Write permission was not granted."
    return
  }

  const data = `${JSON.stringify(buildKerningSettings(), null, 2)}\n`
  try {
    const writable = await editableFileHandle.createWritable()
    await writable.write(data)
    await writable.truncate(data.length)
    await writable.close()
    const savedFile = await editableFileHandle.getFile()
    const savedText = await savedFile.text()
    if (savedText !== data) {
      statusEl.textContent = "Save verification failed."
      return
    }
    hasUnsavedChanges = false
    editableFileName = editableFileHandle.name
    await persistKerningFileHandle(editableFileHandle)
    syncMeta()
    statusEl.textContent = `Saved ${editableFileName}.`
  } catch (error) {
    statusEl.textContent = "Failed to save kerning JSON."
  }
}

async function restorePersistedKerningFileHandle() {
  const handle = await getPersistedKerningFileHandle()
  if (!handle) {
    return
  }

  const permission = await queryKerningFilePermission(handle, "read")
  if (permission !== "granted") {
    statusEl.textContent = `Remembered ${handle.name}; open it once to restore editable access.`
    return
  }

  try {
    const file = await handle.getFile()
    editableFileHandle = handle
    loadSettingsFromText(await file.text(), handle.name)
    statusEl.textContent = `Restored editable ${handle.name}.`
  } catch (error) {
    editableFileHandle = null
    statusEl.textContent = "Remembered kerning file could not be restored."
  }
}

async function queryKerningFilePermission(
  handle: EditableFileHandle,
  mode: "read" | "readwrite"
) {
  try {
    return (await handle.queryPermission?.({ mode })) ?? "prompt"
  } catch (error) {
    return "prompt"
  }
}

async function persistKerningFileHandle(handle: EditableFileHandle) {
  try {
    const db = await openKerningHandleDb()
    await putKerningFileHandle(db, handle)
    db.close()
    return true
  } catch (error) {
    statusEl.textContent =
      "Opened kerning file; reload restore is unavailable in this browser."
    return false
  }
}

async function getPersistedKerningFileHandle() {
  try {
    const db = await openKerningHandleDb()
    const handle = await readKerningFileHandle(db)
    db.close()
    return handle
  } catch (error) {
    return null
  }
}

function openKerningHandleDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(kerningHandleDbName, kerningHandleDbVersion)
    request.addEventListener("upgradeneeded", () => {
      const db = request.result
      if (!db.objectStoreNames.contains(kerningHandleStoreName)) {
        db.createObjectStore(kerningHandleStoreName)
      }
    })
    request.addEventListener("success", () => resolve(request.result))
    request.addEventListener("error", () => reject(request.error))
  })
}

function putKerningFileHandle(db: IDBDatabase, handle: EditableFileHandle) {
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(kerningHandleStoreName, "readwrite")
    const store = transaction.objectStore(kerningHandleStoreName)
    store.put(
      {
        handle,
        name: handle.name,
        updatedAt: Date.now()
      },
      kerningFileHandleKey
    )
    transaction.addEventListener("complete", () => resolve())
    transaction.addEventListener("error", () => reject(transaction.error))
    transaction.addEventListener("abort", () => reject(transaction.error))
  })
}

function readKerningFileHandle(db: IDBDatabase) {
  return new Promise<EditableFileHandle | null>((resolve, reject) => {
    const transaction = db.transaction(kerningHandleStoreName, "readonly")
    const store = transaction.objectStore(kerningHandleStoreName)
    const request = store.get(kerningFileHandleKey)
    request.addEventListener("success", () => {
      const value = request.result as { handle?: EditableFileHandle } | undefined
      resolve(value?.handle ?? null)
    })
    request.addEventListener("error", () => reject(request.error))
  })
}

function downloadKerningFile() {
  const data = `${JSON.stringify(buildKerningSettings(), null, 2)}\n`
  const blob = new Blob([data], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = "cursive-kerning.json"
  anchor.click()
  URL.revokeObjectURL(url)
}

gridEl.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) {
    return
  }
  const card = (event.target as Element | null)?.closest<HTMLElement>("[data-pair]")
  if (!card) {
    return
  }
  event.preventDefault()
  beginDrag(card.dataset.pair ?? selectedPair, event, card)
})

window.addEventListener("pointermove", (event) => {
  if (!activeDrag) {
    return
  }
  const nextGap =
    activeDrag.startGap + (event.clientX - activeDrag.startClientX) * activeDrag.unitsPerPx
  setPairSidebearingGap(activeDrag.pair, nextGap)
})

window.addEventListener("pointerup", finishDrag)
window.addEventListener("pointercancel", finishDrag)

gridEl.addEventListener("keydown", (event) => {
  const card = (event.target as Element | null)?.closest<HTMLElement>("[data-pair]")
  if (!card) {
    return
  }
  const pair = card.dataset.pair ?? selectedPair
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault()
    selectPair(pair)
    return
  }
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
    return
  }
  event.preventDefault()
  const direction = event.key === "ArrowRight" ? 1 : -1
  const step = event.shiftKey ? 5 : 1
  setPairSidebearingGap(pair, computePairSnapshot(pair).gap + direction * step)
})

openButton.addEventListener("click", () => {
  void openKerningFile()
})

saveButton.addEventListener("click", () => {
  void saveKerningFile()
})

downloadButton.addEventListener("click", downloadKerningFile)

loadInput.addEventListener("change", async () => {
  const file = loadInput.files?.[0]
  if (!file) {
    return
  }
  editableFileHandle = null
  loadSettingsFromText(await file.text(), file.name)
  loadInput.value = ""
})

filterSelect.addEventListener("change", () => {
  filterMode = filterSelect.value as typeof filterMode
  renderGrid()
})

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.trim().toLowerCase()
  renderGrid()
})

joinControlDefinitions.forEach((control) => {
  joinSpacingInputs[control.key]?.addEventListener("input", () => {
    syncJoinSpacingFromInputs()
    renderSelectedPair()
    renderGrid()
  })
})

renderAll()
statusEl.textContent = "Loaded built-in kerning settings."
void restorePersistedKerningFileHandle()
