import "./demo.css"
import {
  buildHandwritingPath,
  CubicBezier,
  lettersByVariantId,
  listAvailableLetters,
  type HandwritingStyle,
  type WritingPath
} from "letterpaths"

type GalleryStyle = Extract<HandwritingStyle, "print" | "pre-cursive">

const app = document.querySelector<HTMLDivElement>("#app")

if (!app) {
  throw new Error("Missing #app element for letter gallery.")
}

const targetGuides = {
  xHeight: 220,
  baseline: 460
}

const defaultStyle: GalleryStyle = "pre-cursive"

const styleOptions = [
  { value: "pre-cursive", label: "Pre-cursive" },
  { value: "print", label: "Print" }
] as const satisfies ReadonlyArray<{ value: GalleryStyle; label: string }>

const letters = Array.from(
  new Set(
    listAvailableLetters()
      .map((letter) => letter.glyph.char.toLowerCase())
      .filter((char) => char.length === 1)
  )
).sort()

const galleryPadding = {
  x: 52,
  y: 44
}

type GalleryViewport = {
  width: number
  height: number
  offsetX: number
  offsetY: number
}

app.innerHTML = `
  <div class="demo-page demo-page--gallery">
    <header class="demo-header">
      <div class="demo-header__title">
        <h1>Letter gallery</h1>
        <p>Each lowercase letter rendered on its own card with a switch between pre-cursive and print.</p>
      </div>
    </header>

    <section class="demo-gallery">
      <div class="demo-gallery__toolbar">
        <div class="demo-gallery__toolbar-copy">
          <div class="demo-gallery__meta">${letters.length} lowercase letters</div>
        </div>

        <div class="demo-join__field">
          Letter style
          <div class="demo-join__segmented" role="radiogroup" aria-label="Letter style">
            ${styleOptions
              .map(
                (option) => `
                  <label class="demo-join__segmented-option">
                    <input
                      class="demo-join__segmented-input"
                      type="radio"
                      name="gallery-style"
                      value="${option.value}"
                      ${option.value === defaultStyle ? "checked" : ""}
                    />
                    <span class="demo-join__segmented-label">${option.label}</span>
                  </label>
                `
              )
              .join("")}
          </div>
        </div>
      </div>

      <div class="demo-gallery__grid" id="gallery-grid"></div>
    </section>
  </div>
`

const galleryGrid = document.querySelector<HTMLDivElement>("#gallery-grid")
const styleInputs = Array.from(
  document.querySelectorAll<HTMLInputElement>('input[name="gallery-style"]')
)

if (!galleryGrid || styleInputs.length === 0) {
  throw new Error("Missing controls for letter gallery.")
}

const readStyle = (): GalleryStyle =>
  (styleInputs.find((input) => input.checked)?.value as GalleryStyle | undefined) ?? defaultStyle

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

const createGalleryViewport = (): GalleryViewport => {
  let minX = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  styleOptions.forEach(({ value: style }) => {
    letters.forEach((char) => {
      const writingPath = buildHandwritingPath(char, {
        style,
        targetGuides,
        letters: lettersByVariantId
      })

      if (writingPath.strokes.length === 0) {
        return
      }

      minX = Math.min(minX, writingPath.bounds.minX)
      maxX = Math.max(maxX, writingPath.bounds.maxX)
      minY = Math.min(minY, writingPath.bounds.minY, writingPath.guides.xHeight)
      maxY = Math.max(maxY, writingPath.bounds.maxY, writingPath.guides.baseline)
    })
  })

  if (!Number.isFinite(minX) || !Number.isFinite(maxX) || !Number.isFinite(minY) || !Number.isFinite(maxY)) {
    return {
      width: 240,
      height: 220,
      offsetX: 0,
      offsetY: 0
    }
  }

  return {
    width: Math.ceil(maxX - minX + galleryPadding.x * 2),
    height: Math.ceil(maxY - minY + galleryPadding.y * 2),
    offsetX: galleryPadding.x - minX,
    offsetY: galleryPadding.y - minY
  }
}

const galleryViewport = createGalleryViewport()

const renderLetterSvg = (char: string, style: GalleryStyle): string => {
  const writingPath = buildHandwritingPath(char, {
    style,
    targetGuides,
    letters: lettersByVariantId
  })

  if (writingPath.strokes.length === 0) {
    return `
      <svg class="demo-gallery__svg" viewBox="0 0 240 220" aria-hidden="true">
        <rect class="demo-gallery__bg" x="0" y="0" width="240" height="220"></rect>
        <text class="demo-gallery__empty" x="120" y="116" text-anchor="middle">No path</text>
      </svg>
    `
  }

  const shiftedPath = shiftWritingPath(
    writingPath,
    galleryViewport.offsetX,
    galleryViewport.offsetY
  )
  const strokeWidth = Math.max(16, Math.round((targetGuides.baseline - targetGuides.xHeight) * 0.1))

  return `
    <svg
      class="demo-gallery__svg"
      viewBox="0 0 ${galleryViewport.width} ${galleryViewport.height}"
      aria-hidden="true"
      style="--gallery-stroke-width: ${strokeWidth}px"
    >
      <rect
        class="demo-gallery__bg"
        x="0"
        y="0"
        width="${galleryViewport.width}"
        height="${galleryViewport.height}"
      ></rect>
      <line
        class="demo-guide demo-guide--xheight"
        x1="0"
        y1="${writingPath.guides.xHeight + galleryViewport.offsetY}"
        x2="${galleryViewport.width}"
        y2="${writingPath.guides.xHeight + galleryViewport.offsetY}"
      ></line>
      <line
        class="demo-guide demo-guide--baseline"
        x1="0"
        y1="${writingPath.guides.baseline + galleryViewport.offsetY}"
        x2="${galleryViewport.width}"
        y2="${writingPath.guides.baseline + galleryViewport.offsetY}"
      ></line>
      ${shiftedPath.strokes
        .map((stroke) => `<path class="demo-gallery__path" d="${buildPathD(stroke.curves)}"></path>`)
        .join("")}
    </svg>
  `
}

const renderGallery = () => {
  const style = readStyle()
  galleryGrid.innerHTML = letters
    .map(
      (char) => `
        <article class="demo-gallery__card">
          <div class="demo-gallery__card-head">
            <span class="demo-gallery__letter">${char}</span>
            <span class="demo-gallery__style">${style}</span>
          </div>
          ${renderLetterSvg(char, style)}
        </article>
      `
    )
    .join("")
}

styleInputs.forEach((input) => {
  input.addEventListener("change", renderGallery)
})

renderGallery()
