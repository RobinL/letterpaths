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

const defaultEditorJoinSpacing = {
  targetBendRate: 11.6,
  minSidebearingGap: -500,
  maxSidebearingGap: 500,
  bendSearchMinSidebearingGap: -30,
  bendSearchMaxSidebearingGap: 80,
  exitHandleScale: 1,
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
    const sidebearingGap =
      typeof rawValue === "number"
        ? rawValue
        : rawValue && typeof rawValue === "object" && "sidebearingGap" in rawValue
          ? Number((rawValue as { sidebearingGap: unknown }).sidebearingGap)
          : Number.NaN
    if (!Number.isFinite(sidebearingGap)) {
      return
    }
    normalized[pair] = {
      sidebearingGap: roundGap(clamp(sidebearingGap, kerningGapMin, kerningGapMax))
    }
  })
  return Object.fromEntries(
    Object.entries(normalized).sort(([first], [second]) => first.localeCompare(second))
  )
}

const buildKerningSettings = (): CursiveKerningSettings => ({
  schemaVersion: 1,
  description:
    "Sparse hard-coded cursive pair kerning overrides. Each lowercase two-letter key stores the sidebearing gap to use before placing the second letter. Missing pairs fall back to the join spacing algorithm.",
  units: "letterpath sidebearing gap",
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
      <span class="kerning-card__value">${snapshot.source === "override" ? "set" : "auto"}</span>
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
      <h2>${selectedPair.toUpperCase()}</h2>
      <span class="kerning-editor__badge ${snapshot.source === "override" ? "kerning-editor__badge--override" : ""}">
        ${snapshot.source === "override" ? "override" : "algorithm"}
      </span>
    </div>
    ${buildPairSvg(selectedPair, "kerning-editor__preview")}
    <div class="kerning-editor__selected-actions">
      <label class="kerning-editor__field">
        Sidebearing gap
        <input id="kerning-selected-gap" type="number" min="${kerningGapMin}" max="${kerningGapMax}" step="0.1" value="${formatGap(snapshot.gap)}" />
      </label>
      <button class="kerning-editor__button" id="kerning-reset-selected" type="button" ${override ? "" : "disabled"}>Reset</button>
    </div>
    <div class="kerning-editor__metrics">
      ${metricRow("Rendered gap", formatGap(snapshot.gap))}
      ${metricRow("Algorithm gap", formatGap(computeAlgorithmGap(selectedPair)))}
      ${metricRow("Source", snapshot.source)}
      ${snapshot.metric?.searchedBendRate === undefined ? "" : metricRow("Selected bend", `${snapshot.metric.searchedBendRate.toFixed(2)} deg/0.1t`)}
    </div>
  `

  selectedEl.querySelector<HTMLInputElement>("#kerning-selected-gap")?.addEventListener("input", (event) => {
    const target = event.currentTarget as HTMLInputElement
    setPairOverride(selectedPair, Number(target.value), true)
  })
  selectedEl.querySelector<HTMLButtonElement>("#kerning-reset-selected")?.addEventListener("click", () => {
    clearPairOverride(selectedPair)
  })
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

function setPairOverride(pair: string, rawGap: number, fromInput = false) {
  if (!Number.isFinite(rawGap)) {
    return
  }
  const sidebearingGap = roundGap(clamp(rawGap, kerningGapMin, kerningGapMax))
  kerningPairs = {
    ...kerningPairs,
    [pair]: { sidebearingGap }
  }
  hasUnsavedChanges = true
  renderPairCard(pair)
  if (!fromInput || pair !== selectedPair) {
    renderSelectedPair()
  }
  syncMeta()
  statusEl.textContent = `${pair.toUpperCase()} set to ${formatGap(sidebearingGap)}.`
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
    syncMeta()
    statusEl.textContent = `Saved ${editableFileName}.`
  } catch (error) {
    statusEl.textContent = "Failed to save kerning JSON."
  }
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
  setPairOverride(activeDrag.pair, nextGap)
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
  setPairOverride(pair, computePairSnapshot(pair).gap + direction * step)
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
