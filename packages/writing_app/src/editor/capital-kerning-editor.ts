import "./demo.css"
import "./kerning-editor.css"
import "./capital-kerning-editor.css"
import { bigramFrequencyOrder } from "./bigram-frequency"
import {
  buildHandwritingPath,
  defaultCapitalToLowercaseKerningSettings,
  lettersByVariantId,
  type CapitalKerningMetric,
  type CapitalToLowercaseKerningPair,
  type CapitalToLowercaseKerningPairs,
  type CapitalToLowercaseKerningSettings,
  type WritingPath
} from "letterpaths"

type LeadInMode = "withLeadIn" | "withoutLeadIn"
type ReviewFilter = "all" | "reviewed" | "unreviewed"

type EditableFileHandle = {
  name: string
  getFile(): Promise<File>
  createWritable(): Promise<{
    write(data: string): Promise<void>
    close(): Promise<void>
  }>
}

type FilePickerWindow = Window &
  typeof globalThis & {
    showOpenFilePicker?: (options: object) => Promise<EditableFileHandle[]>
    showSaveFilePicker?: (options: object) => Promise<EditableFileHandle>
  }

type PairSnapshot = {
  path: WritingPath
  metric: CapitalKerningMetric | null
  viewBox: string
  minX: number
  maxX: number
}

type DragState = {
  pair: string
  startX: number
  startGap: number
  unitsPerPixel: number
}

const app = document.querySelector<HTMLDivElement>("#app")
if (!app) throw new Error("Missing #app element for capital kerning editor.")

const targetGuides = { xHeight: 360, baseline: 720 }
const pairOrder = bigramFrequencyOrder.map(
  (pair) => `${pair[0]?.toUpperCase()}${pair[1]}`
)
const pairRank = new Map(pairOrder.map((pair, index) => [pair, index]))
const gapMin = -400
const gapMax = 500
const defaultGap = 40
const roundGap = (value: number) => Math.round(value * 10) / 10
const clampGap = (value: number) => Math.min(gapMax, Math.max(gapMin, value))
const formatGap = (value: number) => value.toFixed(1)
const escapeHtml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

let pairs = normalizePairs(defaultCapitalToLowercaseKerningSettings)
let selectedPair = pairOrder[0] ?? "Th"
let leadInMode: LeadInMode = "withLeadIn"
let reviewFilter: ReviewFilter = "all"
let searchQuery = ""
let editableFileHandle: EditableFileHandle | null = null
let editableFileName = "packages/letterpaths/src/data/capital-to-lowercase-kerning.json"
let dirty = false
let activeDrag: DragState | null = null

app.innerHTML = `
  <main class="kerning-editor capital-kerning-editor">
    <header class="kerning-editor__header">
      <div>
        <h1>Capital kerning editor</h1>
        <p>Adjust the visible gap from each print capital to the following cursive lowercase letter. New or missing pairs start at a ${defaultGap}-unit gap.</p>
      </div>
      <div class="kerning-editor__meta" id="capital-meta"></div>
    </header>

    <section class="kerning-editor__toolbar">
      <button class="kerning-editor__button" id="capital-open" type="button">Open kerning JSON</button>
      <button class="kerning-editor__button kerning-editor__button--primary" id="capital-save" type="button">Save</button>
      <button class="kerning-editor__button" id="capital-download" type="button">Download JSON</button>
      <input id="capital-load-input" type="file" accept="application/json,.json" hidden />
      <label class="kerning-editor__field">
        Lowercase form
        <select id="capital-mode">
          <option value="withLeadIn">With lead-in</option>
          <option value="withoutLeadIn">Without lead-in</option>
        </select>
      </label>
      <label class="kerning-editor__field">
        Review status
        <select id="capital-filter">
          <option value="all">All pairs</option>
          <option value="unreviewed">Unreviewed</option>
          <option value="reviewed">Reviewed</option>
        </select>
      </label>
      <label class="kerning-editor__field">
        Search
        <input id="capital-search" type="search" placeholder="Th" autocomplete="off" />
      </label>
      <span class="kerning-editor__status" id="capital-status"></span>
    </section>

    <section class="kerning-editor__workspace">
      <aside class="kerning-editor__selected" id="capital-selected"></aside>
      <section class="kerning-editor__grid-shell">
        <div class="kerning-editor__grid-header">
          <h2>Pairs in English frequency order</h2>
          <span class="kerning-editor__status" id="capital-count"></span>
        </div>
        <div class="kerning-editor__pair-grid capital-kerning-editor__grid" id="capital-grid"></div>
      </section>
    </section>
  </main>
`

const metaEl = document.querySelector<HTMLDivElement>("#capital-meta")!
const statusEl = document.querySelector<HTMLSpanElement>("#capital-status")!
const selectedEl = document.querySelector<HTMLElement>("#capital-selected")!
const gridEl = document.querySelector<HTMLDivElement>("#capital-grid")!
const countEl = document.querySelector<HTMLSpanElement>("#capital-count")!
const modeSelect = document.querySelector<HTMLSelectElement>("#capital-mode")!
const filterSelect = document.querySelector<HTMLSelectElement>("#capital-filter")!
const searchInput = document.querySelector<HTMLInputElement>("#capital-search")!
const loadInput = document.querySelector<HTMLInputElement>("#capital-load-input")!

function normalizePairs(value: unknown): CapitalToLowercaseKerningPairs {
  const source =
    value && typeof value === "object" && "pairs" in value
      ? (value as { pairs?: unknown }).pairs
      : value
  const raw = source && typeof source === "object" ? source : {}
  const normalized: CapitalToLowercaseKerningPairs = {}
  for (const pair of pairOrder) {
    const candidate = (raw as Record<string, unknown>)[pair]
    const record = candidate && typeof candidate === "object"
      ? candidate as Record<string, unknown>
      : {}
    normalized[pair] = {
      withLeadIn: normalizeGap(record.withLeadIn),
      withoutLeadIn: normalizeGap(record.withoutLeadIn),
      reviewed: record.reviewed === true
    }
  }
  return normalized
}

function normalizeGap(value: unknown): number {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? roundGap(clampGap(numeric)) : defaultGap
}

function buildSettings(): CapitalToLowercaseKerningSettings {
  return {
    schemaVersion: 1,
    description:
      "Manual visible-gap kerning between a print capital and the following cursive lowercase letter. Each pair stores separate values for lowercase forms with and without an initial lead-in.",
    units: "letterpath visible curve gap",
    pairs: Object.fromEntries(
      Object.entries(pairs).sort(([first], [second]) => first.localeCompare(second))
    )
  }
}

function computeSnapshot(pair: string, mode = leadInMode): PairSnapshot {
  const pairValue = pairs[pair] ?? { withLeadIn: 0, withoutLeadIn: 0 }
  const path = buildHandwritingPath(pair, {
    style: "cursive",
    targetGuides,
    keepInitialLeadIn: mode === "withLeadIn",
    capitalKerning: { [pair]: pairValue },
    letters: lettersByVariantId
  })
  const paddingX = 100
  const paddingY = 90
  const minX = path.bounds.minX - paddingX
  const maxX = path.bounds.maxX + paddingX
  const minY = Math.min(path.bounds.minY, targetGuides.xHeight) - paddingY
  const maxY = Math.max(path.bounds.maxY, targetGuides.baseline) + paddingY
  return {
    path,
    metric: path.capitalKerningMetrics?.[0] ?? null,
    viewBox: `${minX} ${minY} ${Math.max(420, maxX - minX)} ${Math.max(420, maxY - minY)}`,
    minX,
    maxX
  }
}

function curveD(curve: WritingPath["strokes"][number]["curves"][number]) {
  return `M ${curve.p0.x} ${curve.p0.y} C ${curve.p1.x} ${curve.p1.y} ${curve.p2.x} ${curve.p2.y} ${curve.p3.x} ${curve.p3.y}`
}

function pairSvg(pair: string, className: string, mode = leadInMode): string {
  const snapshot = computeSnapshot(pair, mode)
  const paths = snapshot.path.strokes
    .flatMap((stroke) => stroke.curves.map((curve) =>
      `<path class="kerning-svg__stroke" d="${curveD(curve)}"></path>`
    ))
    .join("")
  const boundary = snapshot.metric?.previousVisibleRightX
  return `
    <svg class="${className}" viewBox="${snapshot.viewBox}" preserveAspectRatio="xMidYMid meet" aria-label="${escapeHtml(pair)} preview">
      <line class="kerning-svg__guide kerning-svg__guide--xheight" x1="${snapshot.minX}" y1="${targetGuides.xHeight}" x2="${snapshot.maxX}" y2="${targetGuides.xHeight}"></line>
      <line class="kerning-svg__guide kerning-svg__guide--baseline" x1="${snapshot.minX}" y1="${targetGuides.baseline}" x2="${snapshot.maxX}" y2="${targetGuides.baseline}"></line>
      ${boundary === undefined ? "" : `<line class="kerning-svg__sidebearing" x1="${boundary}" y1="${targetGuides.xHeight - 180}" x2="${boundary}" y2="${targetGuides.baseline + 80}"></line>`}
      ${paths}
    </svg>
  `
}

function visiblePairs(): string[] {
  const query = searchQuery.trim().toLowerCase()
  return pairOrder.filter((pair) => {
    if (query && !pair.toLowerCase().includes(query)) return false
    if (reviewFilter === "reviewed" && !pairs[pair]?.reviewed) return false
    if (reviewFilter === "unreviewed" && pairs[pair]?.reviewed) return false
    return true
  })
}

function renderSelected() {
  const value = pairs[selectedPair]!
  const rank = (pairRank.get(selectedPair) ?? 0) + 1
  selectedEl.innerHTML = `
    <div class="kerning-editor__selected-top">
      <div>
        <h2>${escapeHtml(selectedPair)}</h2>
        <span class="capital-kerning-editor__rank">frequency rank ${rank} / ${pairOrder.length}</span>
      </div>
      <span class="kerning-editor__badge ${value.reviewed ? "kerning-editor__badge--override" : ""}">${value.reviewed ? "reviewed" : "unreviewed"}</span>
    </div>
    <div id="capital-preview-wrap">${pairSvg(selectedPair, "kerning-editor__preview")}</div>
    <label class="kerning-editor__field capital-kerning-editor__gap-field">
      Visible gap (${leadInMode === "withLeadIn" ? "with lead-in" : "without lead-in"})
      <input id="capital-gap" type="number" min="${gapMin}" max="${gapMax}" step="1" value="${formatGap(value[leadInMode])}" />
    </label>
    <div class="capital-kerning-editor__comparison">
      <button type="button" data-mode="withLeadIn" class="capital-kerning-editor__comparison-card ${leadInMode === "withLeadIn" ? "is-active" : ""}">
        <span>With lead-in · ${formatGap(value.withLeadIn)}</span>
        ${pairSvg(selectedPair, "capital-kerning-editor__comparison-svg", "withLeadIn")}
      </button>
      <button type="button" data-mode="withoutLeadIn" class="capital-kerning-editor__comparison-card ${leadInMode === "withoutLeadIn" ? "is-active" : ""}">
        <span>Without lead-in · ${formatGap(value.withoutLeadIn)}</span>
        ${pairSvg(selectedPair, "capital-kerning-editor__comparison-svg", "withoutLeadIn")}
      </button>
    </div>
    <div class="capital-kerning-editor__nav">
      <button class="kerning-editor__button" id="capital-previous" type="button">Previous</button>
      <button class="kerning-editor__button kerning-editor__button--primary" id="capital-review-next" type="button">${value.reviewed ? "Reviewed · next" : "Mark reviewed · next"}</button>
      <button class="kerning-editor__button" id="capital-next" type="button">Next</button>
    </div>
    <p class="capital-kerning-editor__hint">Drag the large preview horizontally to adjust the active gap. Use ←/→ to move through pairs.</p>
  `

  selectedEl.querySelector<HTMLInputElement>("#capital-gap")?.addEventListener("input", (event) => {
    setGap(selectedPair, Number((event.currentTarget as HTMLInputElement).value))
  })
  selectedEl.querySelector<HTMLInputElement>("#capital-gap")?.addEventListener("change", () => {
    renderSelected()
    renderGrid()
  })
  selectedEl.querySelector<HTMLElement>("#capital-preview-wrap")?.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return
    event.preventDefault()
    beginDrag(event, event.currentTarget as HTMLElement)
  })
  selectedEl.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode as LeadInMode))
  })
  selectedEl.querySelector<HTMLButtonElement>("#capital-previous")?.addEventListener("click", () => moveSelection(-1))
  selectedEl.querySelector<HTMLButtonElement>("#capital-next")?.addEventListener("click", () => moveSelection(1))
  selectedEl.querySelector<HTMLButtonElement>("#capital-review-next")?.addEventListener("click", reviewAndNext)
}

function renderGrid() {
  const visible = visiblePairs()
  countEl.textContent = `${visible.length} shown`
  gridEl.innerHTML = visible.map((pair) => {
    const value = pairs[pair]!
    return `
      <button class="kerning-card capital-kerning-card ${pair === selectedPair ? "kerning-card--selected" : ""}" data-pair="${pair}" type="button">
        <span class="kerning-card__header">
          <span class="kerning-card__pair">${pair}</span>
          <span class="kerning-card__tools">
            <span class="capital-kerning-editor__rank">#${(pairRank.get(pair) ?? 0) + 1}</span>
            <span class="kerning-card__source ${value.reviewed ? "kerning-card__source--override" : ""}"></span>
          </span>
        </span>
        ${pairSvg(pair, "kerning-card__svg")}
        <span class="kerning-card__footer">
          <span class="kerning-card__value">${formatGap(value[leadInMode])}</span>
          <span class="kerning-card__value">${value.reviewed ? "reviewed" : "todo"}</span>
        </span>
      </button>
    `
  }).join("")
  gridEl.querySelectorAll<HTMLButtonElement>("[data-pair]").forEach((button) => {
    button.addEventListener("click", () => selectPair(button.dataset.pair ?? selectedPair))
  })
}

function syncMeta() {
  const reviewed = Object.values(pairs).filter((pair) => pair.reviewed).length
  metaEl.textContent = `${reviewed} / ${pairOrder.length} reviewed · ${dirty ? "unsaved" : "saved"} · ${editableFileName}`
}

function renderAll() {
  renderSelected()
  renderGrid()
  syncMeta()
}

function setGap(pair: string, rawValue: number, fromDrag = false) {
  if (!Number.isFinite(rawValue)) return
  pairs = {
    ...pairs,
    [pair]: { ...pairs[pair]!, [leadInMode]: roundGap(clampGap(rawValue)) }
  }
  dirty = true
  if (fromDrag) {
    renderSelected()
  } else {
    const preview = selectedEl.querySelector<HTMLElement>("#capital-preview-wrap")
    if (preview) preview.innerHTML = pairSvg(pair, "kerning-editor__preview")
  }
  syncMeta()
  if (!fromDrag) statusEl.textContent = `${pair} ${leadInMode === "withLeadIn" ? "with" : "without"} lead-in set to ${formatGap(pairs[pair]![leadInMode])}.`
}

function setMode(mode: LeadInMode) {
  leadInMode = mode
  modeSelect.value = mode
  renderAll()
}

function selectPair(pair: string) {
  selectedPair = pair
  renderSelected()
  renderGrid()
}

function moveSelection(delta: number) {
  const visible = visiblePairs()
  if (visible.length === 0) return
  const current = Math.max(0, visible.indexOf(selectedPair))
  selectedPair = visible[(current + delta + visible.length) % visible.length]!
  renderSelected()
  renderGrid()
}

function reviewAndNext() {
  pairs = { ...pairs, [selectedPair]: { ...pairs[selectedPair]!, reviewed: true } }
  dirty = true
  moveSelection(1)
  syncMeta()
}

function beginDrag(event: PointerEvent, wrapper: HTMLElement) {
  const svg = wrapper.querySelector<SVGSVGElement>("svg")
  const rect = svg?.getBoundingClientRect()
  const width = svg?.viewBox.baseVal.width ?? 600
  activeDrag = {
    pair: selectedPair,
    startX: event.clientX,
    startGap: pairs[selectedPair]![leadInMode],
    unitsPerPixel: rect && rect.width > 0 ? width / rect.width : 3
  }
  document.body.classList.add("kerning-editor--dragging")
}

function finishDrag() {
  if (activeDrag) renderGrid()
  activeDrag = null
  document.body.classList.remove("kerning-editor--dragging")
}

async function openFile() {
  const pickerWindow = window as FilePickerWindow
  try {
    if (pickerWindow.showOpenFilePicker) {
      const [handle] = await pickerWindow.showOpenFilePicker({
        multiple: false,
        types: [{ description: "Kerning JSON", accept: { "application/json": [".json"] } }]
      })
      if (!handle) return
      editableFileHandle = handle
      loadText(await (await handle.getFile()).text(), handle.name)
    } else {
      loadInput.click()
    }
  } catch {
    statusEl.textContent = "Open cancelled."
  }
}

function loadText(text: string, name: string) {
  pairs = normalizePairs(JSON.parse(text))
  editableFileName = name
  dirty = false
  statusEl.textContent = `Loaded ${name}.`
  renderAll()
}

async function saveFile() {
  const pickerWindow = window as FilePickerWindow
  try {
    if (!editableFileHandle && pickerWindow.showSaveFilePicker) {
      editableFileHandle = await pickerWindow.showSaveFilePicker({
        suggestedName: "capital-to-lowercase-kerning.json",
        types: [{ description: "Kerning JSON", accept: { "application/json": [".json"] } }]
      })
    }
    if (!editableFileHandle) {
      downloadFile()
      return
    }
    const writable = await editableFileHandle.createWritable()
    await writable.write(`${JSON.stringify(buildSettings(), null, 2)}\n`)
    await writable.close()
    editableFileName = editableFileHandle.name
    dirty = false
    statusEl.textContent = `Saved ${editableFileName}.`
    syncMeta()
  } catch {
    statusEl.textContent = "Save cancelled or unavailable."
  }
}

function downloadFile() {
  const blob = new Blob([`${JSON.stringify(buildSettings(), null, 2)}\n`], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = "capital-to-lowercase-kerning.json"
  anchor.click()
  URL.revokeObjectURL(url)
  statusEl.textContent = "Downloaded capital-to-lowercase-kerning.json."
}

document.querySelector<HTMLButtonElement>("#capital-open")?.addEventListener("click", openFile)
document.querySelector<HTMLButtonElement>("#capital-save")?.addEventListener("click", saveFile)
document.querySelector<HTMLButtonElement>("#capital-download")?.addEventListener("click", downloadFile)
modeSelect.addEventListener("change", () => setMode(modeSelect.value as LeadInMode))
filterSelect.addEventListener("change", () => {
  reviewFilter = filterSelect.value as ReviewFilter
  renderGrid()
})
searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value
  renderGrid()
})
loadInput.addEventListener("change", async () => {
  const file = loadInput.files?.[0]
  if (file) loadText(await file.text(), file.name)
  loadInput.value = ""
})
window.addEventListener("pointermove", (event) => {
  if (!activeDrag) return
  setGap(
    activeDrag.pair,
    activeDrag.startGap + (event.clientX - activeDrag.startX) * activeDrag.unitsPerPixel,
    true
  )
})
window.addEventListener("pointerup", finishDrag)
window.addEventListener("pointercancel", finishDrag)
window.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return
  if (event.key === "ArrowLeft") moveSelection(-1)
  if (event.key === "ArrowRight") moveSelection(1)
})
window.addEventListener("beforeunload", (event) => {
  if (!dirty) return
  event.preventDefault()
})

renderAll()
