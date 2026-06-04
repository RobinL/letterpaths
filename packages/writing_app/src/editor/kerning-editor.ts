import "./demo.css"
import "./kerning-editor.css"
import { bigramFrequencyRank } from "./bigram-frequency"
import {
  buildHandwritingPath,
  defaultCursiveKerningSettings,
  lettersByVariantId,
  type CursiveKerningPairs,
  type CursiveKerningSettings,
  type JoinMetric,
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

type PairSnapshot = {
  path: WritingPath
  metric: JoinMetric | null
  gap: number
  exitHandleScale: number
  entryHandleScale: number
  source: "default" | "override"
  viewBox: string
  minX: number
  maxX: number
  baselineY: number
  xHeightY: number
}

type DragState = {
  pair: string
  startClientX: number
  startClientY: number
  startGap: number
  startExitHandleScale: number
  startEntryHandleScale: number
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
const handleScaleDragStepPerPx = 0.005
const kerningHandleDbName = "letterpaths-kerning-editor-handles"
const kerningHandleStoreName = "handles"
const kerningHandleDbVersion = 1
const kerningFileHandleKey = "cursive-kerning-json"

const escapeHtml = (value: string): string =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const roundGap = (value: number): number => Math.round(value * 10) / 10

const roundScale = (value: number): number => Math.round(value * 100) / 100

const formatGap = (value: number): string => value.toFixed(1)

const formatScale = (value: number): string => value.toFixed(2)

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
    "Hard-coded cursive pair kerning. Each lowercase two-letter key can store sidebearingGap, exitHandleScale, and entryHandleScale.",
  units: "letterpath sidebearing gap and Bezier handle scale",
  pairs: Object.fromEntries(
    Object.entries(kerningPairs).sort(([first], [second]) => first.localeCompare(second))
  )
})

let kerningPairs: CursiveKerningPairs = normalizeKerningPairs(defaultCursiveKerningSettings)
let selectedPair = "aa"
let activeDrag: DragState | null = null
let editableFileHandle: EditableFileHandle | null = null
let editableFileName = "packages/letterpaths/src/data/cursive-kerning.json"
let hasUnsavedChanges = false
let filterMode: "all" | "override" | "default" = "all"
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
          <option value="default">Built-in defaults</option>
        </select>
      </label>
      <label class="kerning-editor__field">
        Search
        <input id="kerning-search" type="search" placeholder="aa" autocomplete="off" />
      </label>
      <div class="kerning-editor__status" id="kerning-status"></div>
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

function computePairSnapshot(pair: string): PairSnapshot {
  const override = kerningPairs[pair]
  const path = buildHandwritingPath(pair, {
    style: "cursive",
    targetGuides,
    joinKerning: override ? { [pair]: override } : {},
    letters
  })
  const metric = path.joinMetrics?.[0] ?? null
  const gap = metric?.renderedSidebearingGap ?? override?.sidebearingGap ?? 0
  const exitHandleScale = metric?.exitHandleScale ?? override?.exitHandleScale ?? 1
  const entryHandleScale = metric?.entryHandleScale ?? override?.entryHandleScale ?? 1
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
    source: override ? "override" : "default",
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
      <div class="kerning-card__tools">
        <span class="kerning-card__source ${snapshot.source === "override" ? "kerning-card__source--override" : ""}" title="${snapshot.source}"></span>
        <button
          class="kerning-card__save"
          type="button"
          data-pair-save="${pair}"
          title="Save this pair"
          aria-label="Save ${pair.toUpperCase()} kerning pair"
        >
          Save
        </button>
      </div>
    </div>
    <svg class="kerning-card__svg" viewBox="${snapshot.viewBox}" aria-hidden="true">
      ${buildPathMarkup(snapshot)}
    </svg>
    <div class="kerning-card__footer">
      <span class="kerning-card__value">${formatGap(snapshot.gap)}</span>
      <span class="kerning-card__value">${snapshot.source === "override" ? `h ${formatScale(snapshot.exitHandleScale)}/${formatScale(snapshot.entryHandleScale)}` : "default"}</span>
    </div>
  `
}

function pairMatchesFilter(pair: string): boolean {
  const hasOverride = Boolean(kerningPairs[pair])
  if (filterMode === "override" && !hasOverride) {
    return false
  }
  if (filterMode === "default" && hasOverride) {
    return false
  }
  return !searchQuery || pair.includes(searchQuery)
}

function buildPairCard(pair: string): string {
  return `
    <article
      class="kerning-card ${pair === selectedPair ? "kerning-card--selected" : ""}"
      data-pair="${pair}"
      tabindex="0"
      aria-label="${pair.toUpperCase()} kerning pair"
    >
      ${buildCardContent(pair)}
    </article>
  `
}

function buildPairSection(title: string, sectionPairs: string[]): string {
  return `
    <section class="kerning-editor__pair-section" aria-label="${title} pairs">
      <div class="kerning-editor__pair-section-header">
        <h3>${title}</h3>
        <span class="kerning-editor__status">${sectionPairs.length}</span>
      </div>
      ${
        sectionPairs.length === 0
          ? `<p class="kerning-editor__empty">No pairs here.</p>`
          : `<div class="kerning-editor__pair-grid">${sectionPairs.map(buildPairCard).join("")}</div>`
      }
    </section>
  `
}

function comparePairsByFrequency(first: string, second: string): number {
  const firstRank = bigramFrequencyRank.get(first) ?? Number.MAX_SAFE_INTEGER
  const secondRank = bigramFrequencyRank.get(second) ?? Number.MAX_SAFE_INTEGER
  return firstRank - secondRank || first.localeCompare(second)
}

function renderGrid() {
  const visiblePairs = pairs.filter(pairMatchesFilter)
  const todoPairs = visiblePairs
    .filter((pair) => !kerningPairs[pair])
    .sort(comparePairsByFrequency)
  const donePairs = visiblePairs.filter((pair) => kerningPairs[pair])
  gridEl.innerHTML = [
    filterMode === "override" ? "" : buildPairSection("To do", todoPairs),
    filterMode === "default" ? "" : buildPairSection("Done", donePairs)
  ].join("")
  gridCountEl.textContent =
    filterMode === "all"
      ? `${todoPairs.length} to do, ${donePairs.length} done`
      : `${visiblePairs.length} shown`
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
        ${snapshot.source === "override" ? "override" : "default"}
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
    ${snapshot.metric ? metricRow("Base sidebearing gap", formatGap(snapshot.metric.baseSidebearingGap)) : ""}
    ${metricRow("p0-p1 handle scale", formatScale(snapshot.exitHandleScale))}
    ${metricRow("p2-p3 handle scale", formatScale(snapshot.entryHandleScale))}
    ${metricRow("Source", snapshot.source)}
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
    badgeEl.textContent = snapshot.source === "override" ? "override" : "default"
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

function syncMeta() {
  const overrideCount = Object.keys(kerningPairs).length
  const dirtyText = hasUnsavedChanges ? "unsaved" : "saved"
  metaEl.textContent = `${overrideCount} / ${pairs.length} pairs set | ${dirtyText} | ${editableFileName}`
}

function renderAll() {
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
  const hadOverride = Boolean(kerningPairs[pair])
  const sidebearingGap = roundGap(clamp(rawGap, kerningGapMin, kerningGapMax))
  kerningPairs = {
    ...kerningPairs,
    [pair]: {
      ...kerningPairs[pair],
      sidebearingGap
    }
  }
  hasUnsavedChanges = true
  if (hadOverride) {
    renderPairCard(pair)
  } else {
    renderGrid()
  }
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
  const hadOverride = Boolean(kerningPairs[pair])
  const scale = roundScale(clamp(rawScale, handleScaleMin, handleScaleMax))
  kerningPairs = {
    ...kerningPairs,
    [pair]: {
      ...kerningPairs[pair],
      [key]: scale
    }
  }
  hasUnsavedChanges = true
  if (hadOverride) {
    renderPairCard(pair)
  } else {
    renderGrid()
  }
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

function savePairAsOverride(pair: string) {
  const snapshot = computePairSnapshot(pair)
  kerningPairs = {
    ...kerningPairs,
    [pair]: {
      sidebearingGap: roundGap(clamp(snapshot.gap, kerningGapMin, kerningGapMax)),
      exitHandleScale: roundScale(
        clamp(snapshot.exitHandleScale, handleScaleMin, handleScaleMax)
      ),
      entryHandleScale: roundScale(
        clamp(snapshot.entryHandleScale, handleScaleMin, handleScaleMax)
      )
    }
  }
  hasUnsavedChanges = true
  renderGrid()
  if (pair === selectedPair) {
    renderSelectedPair()
  }
  syncMeta()
  statusEl.textContent = `${pair.toUpperCase()} saved as an override.`
}

function clearPairOverride(pair: string) {
  if (!kerningPairs[pair]) {
    return
  }
  const nextPairs = { ...kerningPairs }
  delete nextPairs[pair]
  kerningPairs = nextPairs
  hasUnsavedChanges = true
  renderGrid()
  renderSelectedPair()
  syncMeta()
  statusEl.textContent = `${pair.toUpperCase()} reset to built-in default.`
}

function beginDrag(pair: string, event: PointerEvent, card: HTMLElement) {
  const snapshot = computePairSnapshot(pair)
  const svg = card.querySelector<SVGSVGElement>("svg")
  const rect = svg?.getBoundingClientRect()
  const viewBoxWidth = svg?.viewBox.baseVal.width ?? 600
  activeDrag = {
    pair,
    startClientX: event.clientX,
    startClientY: event.clientY,
    startGap: snapshot.gap,
    startExitHandleScale: snapshot.exitHandleScale,
    startEntryHandleScale: snapshot.entryHandleScale,
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
  if ((event.target as Element | null)?.closest("[data-pair-save]")) {
    return
  }
  const card = (event.target as Element | null)?.closest<HTMLElement>("[data-pair]")
  if (!card) {
    return
  }
  event.preventDefault()
  beginDrag(card.dataset.pair ?? selectedPair, event, card)
})

gridEl.addEventListener("click", (event) => {
  const button = (event.target as Element | null)?.closest<HTMLButtonElement>(
    "[data-pair-save]"
  )
  if (!button) {
    return
  }
  event.preventDefault()
  event.stopPropagation()
  savePairAsOverride(button.dataset.pairSave ?? selectedPair)
})

window.addEventListener("pointermove", (event) => {
  if (!activeDrag) {
    return
  }
  const nextHandleScaleDelta =
    (activeDrag.startClientY - event.clientY) * handleScaleDragStepPerPx
  if (event.shiftKey) {
    const nextEntryHandleScale =
      activeDrag.startEntryHandleScale +
      (event.clientX - activeDrag.startClientX) * handleScaleDragStepPerPx
    setPairHandleScale(
      activeDrag.pair,
      "exitHandleScale",
      activeDrag.startExitHandleScale + nextHandleScaleDelta
    )
    setPairHandleScale(
      activeDrag.pair,
      "entryHandleScale",
      nextEntryHandleScale
    )
    return
  }

  const nextGap =
    activeDrag.startGap + (event.clientX - activeDrag.startClientX) * activeDrag.unitsPerPx
  setPairSidebearingGap(activeDrag.pair, nextGap)
  setPairHandleScale(
    activeDrag.pair,
    "exitHandleScale",
    activeDrag.startExitHandleScale + nextHandleScaleDelta
  )
})

window.addEventListener("pointerup", finishDrag)
window.addEventListener("pointercancel", finishDrag)

function isEditableKeyboardTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
}

window.addEventListener("keydown", (event) => {
  if (
    event.key.toLowerCase() !== "s" ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    isEditableKeyboardTarget(event.target)
  ) {
    return
  }
  event.preventDefault()
  void saveKerningFile()
})

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

renderAll()
statusEl.textContent = "Loaded built-in kerning settings."
void restorePersistedKerningFileHandle()
