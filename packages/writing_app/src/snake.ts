import "./style.css";
import {
  AnimationPlayer,
  TracingSession,
  analyzeTracingGroups,
  compileTracingPath,
  type Point,
  type PreparedTracingPath,
  type TracingGroup,
  type TracingSample,
  type TracingState,
  type WritingPath
} from "letterpaths";
import snakeBodySprite from "./assets/snake/body.png";
import snakeBackgroundImage from "./assets/snake/background.png";
import snakeHeadAltSprite from "./assets/snake/head_alt.png";
import snakeHeadSprite from "./assets/snake/head.png";
import snakeTailSprite from "./assets/snake/tail.png";
import {
  DEMO_PAUSE_MS,
  DEFAULT_TRACE_TOLERANCE,
  MAX_TRACE_TOLERANCE,
  MIN_TRACE_TOLERANCE,
  TRACE_TOLERANCE_STEP,
  WORDS,
  buildPathD,
  buildShiftedWordLayout,
  chooseNextWordIndex,
  getPointerInSvg
} from "./shared";

const FRUIT_EMOJIS = ["🍎", "🍐", "🍊", "🍓", "🍇", "🍒", "🍉", "🥝"] as const;
const DEFAULT_FRUIT_SIZE = 44;
const MIN_FRUIT_SIZE = 24;
const MAX_FRUIT_SIZE = 72;
const FRUIT_SIZE_STEP = 2;
const DEFAULT_FRUIT_SPACING = 220;
const MIN_FRUIT_SPACING = 100;
const MAX_FRUIT_SPACING = 420;
const FRUIT_SPACING_STEP = 10;
const SNAKE_SEGMENT_SPACING = 76;
const SNAKE_GROWTH_DISTANCE = 115;
const MAX_SNAKE_BODY_SEGMENTS = 34;
const SNAKE_EXIT_MARGIN = 260;
const SNAKE_EXIT_SPEED = 340;
const SNAKE_CHEW_MS = 220;
const HEAD_SIZE = {
  width: 97.5,
  height: 60,
  anchorX: 0.5,
  anchorY: 0.5,
  rotationOffset: -10
} as const;
const BODY_SIZE = {
  width: 106.25,
  height: 33.75,
  anchorX: 0.5,
  anchorY: 0.5,
  rotationOffset: 0
} as const;
const TAIL_SIZE = {
  width: 55,
  height: 33.75,
  anchorX: 0.5,
  anchorY: 0.5,
  rotationOffset: 0
} as const;

type FruitToken = {
  x: number;
  y: number;
  emoji: string;
  captured: boolean;
  groupIndex: number;
};

type WaypointMarker = {
  x: number;
  y: number;
};

type SnakePose = {
  x: number;
  y: number;
  angle: number;
  distance: number;
};

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app element for snake app.");
}

app.innerHTML = `
  <div class="writing-app writing-app--snake">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar writing-app__topbar--score">
          <div class="writing-app__title">
            <p class="writing-app__eyebrow">Feed the snake</p>
            <h1 class="writing-app__word" id="word-label"></h1>
          </div>
          <div class="writing-app__score-card" aria-live="polite">
            <span class="writing-app__score-label">Score</span>
            <span class="writing-app__score-value"><span id="score-value">0</span>/<span id="score-total">0</span></span>
          </div>
          <div class="writing-app__control-strip">
            <label class="writing-app__tolerance" for="tolerance-slider">
              <span class="writing-app__tolerance-label">
                Tolerance
                <span class="writing-app__tolerance-value" id="tolerance-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="tolerance-slider"
                type="range"
                min="${MIN_TRACE_TOLERANCE}"
                max="${MAX_TRACE_TOLERANCE}"
                step="${TRACE_TOLERANCE_STEP}"
                value="${DEFAULT_TRACE_TOLERANCE}"
              />
            </label>
            <label class="writing-app__tolerance" for="fruit-size-slider">
              <span class="writing-app__tolerance-label">
                Fruit size
                <span class="writing-app__tolerance-value" id="fruit-size-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="fruit-size-slider"
                type="range"
                min="${MIN_FRUIT_SIZE}"
                max="${MAX_FRUIT_SIZE}"
                step="${FRUIT_SIZE_STEP}"
                value="${DEFAULT_FRUIT_SIZE}"
              />
            </label>
            <label class="writing-app__tolerance" for="fruit-spacing-slider">
              <span class="writing-app__tolerance-label">
                Fruit spacing
                <span class="writing-app__tolerance-value" id="fruit-spacing-value"></span>
              </span>
              <input
                class="writing-app__tolerance-slider"
                id="fruit-spacing-slider"
                type="range"
                min="${MIN_FRUIT_SPACING}"
                max="${MAX_FRUIT_SPACING}"
                step="${FRUIT_SPACING_STEP}"
                value="${DEFAULT_FRUIT_SPACING}"
              />
            </label>
          </div>
          <button class="writing-app__button" id="show-me-button" type="button">
            Show me
          </button>
        </header>

        <svg
          class="writing-app__svg"
          id="trace-svg"
          viewBox="0 0 1600 900"
          aria-label="Handwriting snake tracing area"
        ></svg>

        <div class="writing-app__overlay" id="success-overlay" hidden>
          <div class="writing-app__success-card">
            <p class="writing-app__success-eyebrow">Snake fed!</p>
            <p class="writing-app__success-copy" id="score-summary"></p>
            <button class="writing-app__button writing-app__button--next" id="next-word-button" type="button">
              Next word
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
`;

app.style.setProperty("--snake-board-image", `url("${snakeBackgroundImage}")`);

const wordLabel = document.querySelector<HTMLHeadingElement>("#word-label");
const scoreValue = document.querySelector<HTMLSpanElement>("#score-value");
const scoreTotal = document.querySelector<HTMLSpanElement>("#score-total");
const scoreSummary = document.querySelector<HTMLParagraphElement>("#score-summary");
const traceSvg = document.querySelector<SVGSVGElement>("#trace-svg");
const showMeButton = document.querySelector<HTMLButtonElement>("#show-me-button");
const successOverlay = document.querySelector<HTMLDivElement>("#success-overlay");
const nextWordButton = document.querySelector<HTMLButtonElement>("#next-word-button");
const toleranceSlider = document.querySelector<HTMLInputElement>("#tolerance-slider");
const toleranceValue = document.querySelector<HTMLSpanElement>("#tolerance-value");
const fruitSizeSlider = document.querySelector<HTMLInputElement>("#fruit-size-slider");
const fruitSizeValue = document.querySelector<HTMLSpanElement>("#fruit-size-value");
const fruitSpacingSlider = document.querySelector<HTMLInputElement>("#fruit-spacing-slider");
const fruitSpacingValue = document.querySelector<HTMLSpanElement>("#fruit-spacing-value");

if (
  !wordLabel ||
  !scoreValue ||
  !scoreTotal ||
  !scoreSummary ||
  !traceSvg ||
  !showMeButton ||
  !successOverlay ||
  !nextWordButton ||
  !toleranceSlider ||
  !toleranceValue ||
  !fruitSizeSlider ||
  !fruitSizeValue ||
  !fruitSpacingSlider ||
  !fruitSpacingValue
) {
  throw new Error("Missing elements for snake app.");
}

let currentWordIndex = -1;
let currentPath: WritingPath | null = null;
let tracingSession: TracingSession | null = null;
let activePointerId: number | null = null;
let traceRenderQueued = false;
let traceStrokeEls: SVGPathElement[] = [];
let traceStrokeLengths: number[] = [];
let demoStrokeEls: SVGPathElement[] = [];
let demoStrokeLengths: number[] = [];
let demoNibEl: SVGCircleElement | null = null;
let demoAnimationFrameId: number | null = null;
let isDemoPlaying = false;
let currentTraceTolerance = DEFAULT_TRACE_TOLERANCE;
let currentFruitSize = DEFAULT_FRUIT_SIZE;
let currentFruitSpacing = DEFAULT_FRUIT_SPACING;
let fruits: FruitToken[] = [];
let fruitEls: SVGTextElement[] = [];
let tracingGroups: TracingGroup[] = [];
let waypointMarkers: WaypointMarker[] = [];
let currentWaypointIndex: number | null = null;
let visibleGroupCount = 1;
let waypointEl: SVGTextElement | null = null;
let score = 0;
let currentSceneWidth = 1600;
let currentSceneHeight = 900;
let currentPathLength = 0;
let snakeLayerEl: SVGGElement | null = null;
let snakeHeadEl: SVGGElement | null = null;
let snakeHeadImageEl: SVGImageElement | null = null;
let snakeBodyEls: SVGGElement[] = [];
let snakeTailEl: SVGGElement | null = null;
let snakeTrail: SnakePose[] = [];
let snakeHeadDistance = 0;
let snakeChewUntil = 0;
let snakeExitAnimationFrameId: number | null = null;
let isSnakeSlithering = false;
let isSnakeExitComplete = false;
let snakeExitBodyCount = 0;

const syncToleranceLabel = () => {
  toleranceValue.textContent = `${currentTraceTolerance}px`;
};

const syncFruitControlLabels = () => {
  fruitSizeValue.textContent = `${currentFruitSize}px`;
  fruitSpacingValue.textContent = `${currentFruitSpacing}px`;
};

const syncScoreDisplay = () => {
  const visibleFruitCount = fruits.filter((fruit) => fruit.groupIndex < visibleGroupCount).length;
  scoreValue.textContent = `${score}`;
  scoreTotal.textContent = `${visibleFruitCount}`;
  scoreSummary.textContent =
    visibleFruitCount === 0
      ? "No fruit on this round."
      : `The snake ate ${score} of ${visibleFruitCount} fruit.`;
};

const updateSuccessVisibility = (isVisible: boolean) => {
  successOverlay.hidden = !isVisible;
};

const normalizeVector = (vector: Point): Point => {
  const length = Math.hypot(vector.x, vector.y);
  if (length <= 0.001) {
    return { x: 1, y: 0 };
  }

  return {
    x: vector.x / length,
    y: vector.y / length
  };
};

const toAngle = (vector: Point): number => Math.atan2(vector.y, vector.x) * (180 / Math.PI);

const applyFruitFlight = (el: SVGTextElement, fruit: FruitToken) => {
  const centerX = currentSceneWidth / 2;
  const centerY = currentSceneHeight / 2;
  let directionX = fruit.x - centerX;
  let directionY = fruit.y - centerY;

  if (directionX === 0 && directionY === 0) {
    directionX = 0.35;
    directionY = -1;
  }

  const length = Math.hypot(directionX, directionY) || 1;
  const unitX = directionX / length;
  const unitY = directionY / length;
  const extraDistance = Math.max(currentSceneWidth, currentSceneHeight) * 0.8;
  const targetX = fruit.x + unitX * extraDistance;
  const targetY = fruit.y + unitY * extraDistance;
  const clampedTargetX = Math.min(currentSceneWidth + 160, Math.max(-160, targetX));
  const clampedTargetY = Math.min(currentSceneHeight + 160, Math.max(-160, targetY));

  el.style.setProperty("--fruit-fly-x", `${(clampedTargetX - fruit.x).toFixed(2)}px`);
  el.style.setProperty("--fruit-fly-y", `${(clampedTargetY - fruit.y).toFixed(2)}px`);
  el.style.setProperty("--fruit-fly-rotate", `${(unitX * 28).toFixed(2)}deg`);
};

const interpolateSamplePoint = (
  samples: TracingSample[],
  distanceAlongStroke: number
): Point => {
  if (samples.length === 0) {
    return { x: 0, y: 0 };
  }

  if (samples.length === 1 || distanceAlongStroke <= 0) {
    return { x: samples[0].x, y: samples[0].y };
  }

  for (let index = 1; index < samples.length; index += 1) {
    const previous = samples[index - 1];
    const current = samples[index];
    if (!previous || !current) {
      continue;
    }
    if (distanceAlongStroke > current.distanceAlongStroke) {
      continue;
    }

    const span = current.distanceAlongStroke - previous.distanceAlongStroke;
    const ratio = span > 0 ? (distanceAlongStroke - previous.distanceAlongStroke) / span : 0;
    return {
      x: previous.x + (current.x - previous.x) * ratio,
      y: previous.y + (current.y - previous.y) * ratio
    };
  }

  const last = samples[samples.length - 1];
  return last ? { x: last.x, y: last.y } : { x: 0, y: 0 };
};

const getPointAtOverallDistance = (
  preparedPath: PreparedTracingPath,
  targetDistance: number
): Point => {
  let remaining = targetDistance;

  for (let index = 0; index < preparedPath.strokes.length; index += 1) {
    const stroke = preparedPath.strokes[index];
    if (!stroke) {
      continue;
    }

    if (remaining <= stroke.totalLength || index === preparedPath.strokes.length - 1) {
      return interpolateSamplePoint(
        stroke.samples,
        Math.max(0, Math.min(remaining, stroke.totalLength))
      );
    }

    remaining -= stroke.totalLength;
  }

  return { x: 0, y: 0 };
};

const createFruitTokens = (
  preparedPath: PreparedTracingPath,
  groups: TracingGroup[]
): FruitToken[] => {
  return groups.flatMap((group, groupIndex) => {
    const groupLength = group.endDistance - group.startDistance;
    if (groupLength <= 0) {
      return [];
    }

    const count = Math.max(1, Math.round(groupLength / currentFruitSpacing));

    return Array.from({ length: count }, (_, index) => {
      const point = getPointAtOverallDistance(
        preparedPath,
        group.startDistance + (groupLength * (index + 1)) / (count + 1)
      );
      return {
        x: point.x,
        y: point.y,
        emoji: FRUIT_EMOJIS[(groupIndex + index) % FRUIT_EMOJIS.length] ?? FRUIT_EMOJIS[0],
        captured: false,
        groupIndex
      };
    });
  });
};

const resetFruitState = () => {
  score = 0;
  visibleGroupCount = tracingGroups.length > 0 ? 1 : 0;
  currentWaypointIndex = waypointMarkers.length > 0 ? 0 : null;
  fruits.forEach((fruit) => {
    fruit.captured = false;
  });
  fruitEls.forEach((el) => {
    el.style.transition = "none";
    el.classList.remove("writing-app__fruit--captured");
    el.style.removeProperty("--fruit-fly-x");
    el.style.removeProperty("--fruit-fly-y");
    el.style.removeProperty("--fruit-fly-rotate");
    const fruit = fruits[Number(el.dataset.fruitIndex)];
    el.classList.toggle(
      "writing-app__fruit--hidden",
      fruit ? fruit.groupIndex >= visibleGroupCount : true
    );
    void el.getBoundingClientRect();
    el.style.removeProperty("transition");
  });
  updateWaypointMarker();
  syncScoreDisplay();
};

const getCurrentBodyCount = () => {
  const maxByPath = Math.max(
    3,
    Math.min(MAX_SNAKE_BODY_SEGMENTS, Math.floor(currentPathLength / SNAKE_GROWTH_DISTANCE))
  );
  return Math.min(maxByPath, 1 + Math.floor(snakeHeadDistance / SNAKE_GROWTH_DISTANCE));
};

const setSpritePose = (
  groupEl: SVGGElement,
  imageEl: SVGImageElement,
  pose: SnakePose,
  width: number,
  height: number,
  anchorX: number,
  anchorY: number,
  rotationOffset: number
) => {
  imageEl.setAttribute("x", `${(-width * anchorX).toFixed(2)}`);
  imageEl.setAttribute("y", `${(-height * anchorY).toFixed(2)}`);
  imageEl.setAttribute("width", `${width}`);
  imageEl.setAttribute("height", `${height}`);
  groupEl.setAttribute(
    "transform",
    `translate(${pose.x.toFixed(2)} ${pose.y.toFixed(2)}) rotate(${(pose.angle + rotationOffset).toFixed(2)})`
  );
  groupEl.style.opacity = "1";
};

const sampleSnakePoseAtDistance = (targetDistance: number): SnakePose => {
  const firstPose = snakeTrail[0] ?? {
    x: 0,
    y: 0,
    angle: 0,
    distance: 0
  };

  if (snakeTrail.length <= 1 || targetDistance <= 0) {
    return {
      ...firstPose,
      distance: Math.max(0, targetDistance)
    };
  }

  for (let index = 1; index < snakeTrail.length; index += 1) {
    const previous = snakeTrail[index - 1];
    const current = snakeTrail[index];
    if (!previous || !current) {
      continue;
    }
    if (targetDistance > current.distance) {
      continue;
    }

    const span = current.distance - previous.distance;
    const ratio = span > 0 ? (targetDistance - previous.distance) / span : 0;
    const x = previous.x + (current.x - previous.x) * ratio;
    const y = previous.y + (current.y - previous.y) * ratio;
    return {
      x,
      y,
      angle: toAngle({ x: current.x - previous.x, y: current.y - previous.y }),
      distance: targetDistance
    };
  }

  const lastPose = snakeTrail[snakeTrail.length - 1] ?? firstPose;
  return {
    ...lastPose,
    distance: targetDistance
  };
};

const hideSnakeSprites = () => {
  snakeHeadEl?.style.setProperty("opacity", "0");
  snakeTailEl?.style.setProperty("opacity", "0");
  snakeBodyEls.forEach((el) => {
    el.style.opacity = "0";
  });
};

const renderSnake = (now = performance.now()) => {
  if (!snakeLayerEl || !snakeHeadEl || !snakeHeadImageEl || !snakeTailEl || snakeTrail.length === 0) {
    return;
  }

  if (isDemoPlaying || isSnakeExitComplete) {
    snakeLayerEl.style.opacity = "0";
    return;
  }

  snakeLayerEl.style.opacity = "1";
  const bodyCount = isSnakeSlithering ? snakeExitBodyCount : getCurrentBodyCount();
  const headPose = sampleSnakePoseAtDistance(snakeHeadDistance);
  snakeHeadImageEl.setAttribute("href", now < snakeChewUntil ? snakeHeadAltSprite : snakeHeadSprite);
  setSpritePose(
    snakeHeadEl,
    snakeHeadImageEl,
    headPose,
    HEAD_SIZE.width,
    HEAD_SIZE.height,
    HEAD_SIZE.anchorX,
    HEAD_SIZE.anchorY,
    HEAD_SIZE.rotationOffset
  );

  snakeBodyEls.forEach((el, index) => {
    if (index >= bodyCount) {
      el.style.opacity = "0";
      return;
    }

    const imageEl = el.querySelector<SVGImageElement>("image");
    if (!imageEl) {
      return;
    }

    const pose = sampleSnakePoseAtDistance(
      Math.max(0, snakeHeadDistance - (index + 1) * SNAKE_SEGMENT_SPACING)
    );
    setSpritePose(
      el,
      imageEl,
      pose,
      BODY_SIZE.width,
      BODY_SIZE.height,
      BODY_SIZE.anchorX,
      BODY_SIZE.anchorY,
      BODY_SIZE.rotationOffset
    );
  });

  const tailPose = sampleSnakePoseAtDistance(
    Math.max(0, snakeHeadDistance - (bodyCount + 1) * SNAKE_SEGMENT_SPACING)
  );
  const tailImageEl = snakeTailEl.querySelector<SVGImageElement>("image");
  if (!tailImageEl) {
    return;
  }
  setSpritePose(
    snakeTailEl,
    tailImageEl,
    tailPose,
    TAIL_SIZE.width,
    TAIL_SIZE.height,
    TAIL_SIZE.anchorX,
    TAIL_SIZE.anchorY,
    TAIL_SIZE.rotationOffset
  );
};

const resetSnakeTrail = (point: Point, tangent: Point) => {
  const direction = normalizeVector(tangent);
  snakeTrail = [
    {
      x: point.x,
      y: point.y,
      angle: toAngle(direction),
      distance: 0
    }
  ];
  snakeHeadDistance = 0;
  snakeChewUntil = 0;
  isSnakeExitComplete = false;
  isSnakeSlithering = false;
  snakeExitBodyCount = 0;
  if (snakeExitAnimationFrameId !== null) {
    cancelAnimationFrame(snakeExitAnimationFrameId);
    snakeExitAnimationFrameId = null;
  }
  renderSnake();
};

const appendSnakePose = (point: Point, tangent: Point) => {
  const direction = normalizeVector(tangent);
  const angle = toAngle(direction);
  const lastPose = snakeTrail[snakeTrail.length - 1];

  if (!lastPose) {
    resetSnakeTrail(point, direction);
    return;
  }

  const step = Math.hypot(point.x - lastPose.x, point.y - lastPose.y);
  if (step < 0.5) {
    snakeTrail[snakeTrail.length - 1] = {
      ...lastPose,
      x: point.x,
      y: point.y,
      angle
    };
    renderSnake();
    return;
  }

  snakeHeadDistance = lastPose.distance + step;
  snakeTrail.push({
    x: point.x,
    y: point.y,
    angle,
    distance: snakeHeadDistance
  });
  renderSnake();
};

const getExitTravelDistance = (startPoint: Point, direction: Point, bodyCount: number) => {
  const normalizedDirection = normalizeVector(direction);
  const candidates: number[] = [];

  if (normalizedDirection.x > 0.001) {
    candidates.push((currentSceneWidth + SNAKE_EXIT_MARGIN - startPoint.x) / normalizedDirection.x);
  } else if (normalizedDirection.x < -0.001) {
    candidates.push((-SNAKE_EXIT_MARGIN - startPoint.x) / normalizedDirection.x);
  }

  if (normalizedDirection.y > 0.001) {
    candidates.push((currentSceneHeight + SNAKE_EXIT_MARGIN - startPoint.y) / normalizedDirection.y);
  } else if (normalizedDirection.y < -0.001) {
    candidates.push((-SNAKE_EXIT_MARGIN - startPoint.y) / normalizedDirection.y);
  }

  const exitToEdge = candidates
    .filter((value) => Number.isFinite(value) && value > 0)
    .reduce((smallest, value) => Math.min(smallest, value), Number.POSITIVE_INFINITY);

  const baseExit = Number.isFinite(exitToEdge)
    ? exitToEdge
    : Math.max(currentSceneWidth, currentSceneHeight) + SNAKE_EXIT_MARGIN;

  return baseExit + (bodyCount + 2) * SNAKE_SEGMENT_SPACING + SNAKE_EXIT_MARGIN;
};

const startSnakeExit = (point: Point, tangent: Point) => {
  if (isSnakeSlithering || isSnakeExitComplete) {
    return;
  }

  const direction = normalizeVector(tangent);
  const exitStartTime = performance.now();
  snakeExitBodyCount = getCurrentBodyCount();
  const totalTravelDistance = getExitTravelDistance(point, direction, snakeExitBodyCount);
  isSnakeSlithering = true;
  updateSuccessVisibility(false);

  const tick = (now: number) => {
    const elapsedSeconds = Math.max(0, now - exitStartTime) / 1000;
    const travelled = Math.min(totalTravelDistance, elapsedSeconds * SNAKE_EXIT_SPEED);
    appendSnakePose(
      {
        x: point.x + direction.x * travelled,
        y: point.y + direction.y * travelled
      },
      direction
    );

    if (travelled >= totalTravelDistance) {
      isSnakeSlithering = false;
      isSnakeExitComplete = true;
      snakeExitAnimationFrameId = null;
      hideSnakeSprites();
      updateSuccessVisibility(true);
      return;
    }

    snakeExitAnimationFrameId = requestAnimationFrame(tick);
  };

  snakeExitAnimationFrameId = requestAnimationFrame(tick);
};

const captureFruitAtPoint = (point: Point) => {
  let changed = false;
  const captureRadius = Math.max(24, currentFruitSize * 0.55);

  fruits.forEach((fruit, index) => {
    if (fruit.captured || fruit.groupIndex >= visibleGroupCount) {
      return;
    }

    const distance = Math.hypot(point.x - fruit.x, point.y - fruit.y);
    if (distance > captureRadius) {
      return;
    }

    fruit.captured = true;
    score += 1;
    const fruitEl = fruitEls[index];
    if (fruitEl) {
      applyFruitFlight(fruitEl, fruit);
      fruitEl.classList.add("writing-app__fruit--captured");
    }
    changed = true;
  });

  if (changed) {
    snakeChewUntil = performance.now() + SNAKE_CHEW_MS;
    syncScoreDisplay();
    renderSnake();
  }
};

const updateWaypointMarker = () => {
  if (!waypointEl) {
    return;
  }

  const marker =
    currentWaypointIndex !== null ? waypointMarkers[currentWaypointIndex] : undefined;

  if (!marker) {
    waypointEl.classList.add("writing-app__boundary-star--hidden");
    return;
  }

  waypointEl.classList.remove("writing-app__boundary-star--hidden");
  waypointEl.setAttribute("x", `${marker.x}`);
  waypointEl.setAttribute("y", `${marker.y}`);
};

const unlockNextGroupIfReached = (point: Point) => {
  if (currentWaypointIndex === null) {
    return;
  }

  const marker = waypointMarkers[currentWaypointIndex];
  if (!marker) {
    currentWaypointIndex = null;
    updateWaypointMarker();
    return;
  }

  const distance = Math.hypot(point.x - marker.x, point.y - marker.y);
  const waypointRadius = Math.max(26, currentFruitSize * 0.6);
  if (distance > waypointRadius) {
    return;
  }

  visibleGroupCount = Math.min(visibleGroupCount + 1, tracingGroups.length);
  fruitEls.forEach((el) => {
    const fruit = fruits[Number(el.dataset.fruitIndex)];
    el.classList.toggle(
      "writing-app__fruit--hidden",
      fruit ? fruit.groupIndex >= visibleGroupCount : true
    );
  });

  currentWaypointIndex += 1;
  if (currentWaypointIndex >= waypointMarkers.length) {
    currentWaypointIndex = null;
  }

  updateWaypointMarker();
  syncScoreDisplay();
};

const syncSnakeToState = (state: TracingState) => {
  appendSnakePose(state.cursorPoint, state.cursorTangent);
  if (!isDemoPlaying) {
    captureFruitAtPoint(state.cursorPoint);
    unlockNextGroupIfReached(state.cursorPoint);
  }
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

  renderSnake();
  requestTraceRender();
};

const resetRoundProgress = () => {
  tracingSession?.reset();
  activePointerId = null;
  updateSuccessVisibility(false);
  isSnakeExitComplete = false;
  isSnakeSlithering = false;
  snakeExitBodyCount = 0;

  if (snakeExitAnimationFrameId !== null) {
    cancelAnimationFrame(snakeExitAnimationFrameId);
    snakeExitAnimationFrameId = null;
  }

  traceStrokeEls.forEach((el, index) => {
    const length = traceStrokeLengths[index] ?? 0.001;
    el.style.strokeDasharray = `${length} ${length}`;
    el.style.strokeDashoffset = `${length}`;
  });

  const state = tracingSession?.getState();
  if (state) {
    resetSnakeTrail(state.cursorPoint, state.cursorTangent);
  } else {
    hideSnakeSprites();
  }

  resetFruitState();
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
  if (!tracingSession) {
    return;
  }

  const state = tracingSession.getState();
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

  if (!isDemoPlaying && !isSnakeSlithering && !isSnakeExitComplete) {
    syncSnakeToState(state);
  } else {
    renderSnake();
  }

  if (state.status === "complete") {
    if (!isDemoPlaying && !isSnakeSlithering && !isSnakeExitComplete) {
      startSnakeExit(state.cursorPoint, state.cursorTangent);
    }
    updateSuccessVisibility(isSnakeExitComplete);
    return;
  }

  updateSuccessVisibility(false);
};

const playDemo = () => {
  if (!currentPath || isDemoPlaying) {
    return;
  }

  resetRoundProgress();
  stopDemoAnimation();

  const player = new AnimationPlayer(currentPath, {
    speed: 1.7,
    penUpSpeed: 2.1,
    deferredDelayMs: 150
  });

  isDemoPlaying = true;
  showMeButton.disabled = true;
  showMeButton.textContent = "Showing...";
  renderSnake();

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
    resetRoundProgress();
  };

  demoAnimationFrameId = requestAnimationFrame(tick);
  requestTraceRender();
};

const setupScene = (path: WritingPath, width: number, height: number, offsetY: number) => {
  currentSceneWidth = width;
  currentSceneHeight = height;
  const preparedPath = compileTracingPath(path);
  currentPathLength = preparedPath.strokes.reduce((total, stroke) => total + stroke.totalLength, 0);
  const groupAnalysis = analyzeTracingGroups(preparedPath);
  tracingGroups = groupAnalysis.groups;
  waypointMarkers = tracingGroups.slice(1).map((group) => ({
    x: group.startPoint.x,
    y: group.startPoint.y
  }));
  currentWaypointIndex = waypointMarkers.length > 0 ? 0 : null;
  visibleGroupCount = tracingGroups.length > 0 ? 1 : 0;

  tracingSession = new TracingSession(preparedPath, {
    startTolerance: currentTraceTolerance,
    hitTolerance: currentTraceTolerance
  });
  activePointerId = null;
  fruits = createFruitTokens(preparedPath, tracingGroups);

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
  const debugCurveMarkup = drawableStrokes
    .flatMap((stroke) =>
      stroke.curves.map(
        (curve) => `
          <path
            class="writing-app__debug-curve"
            d="M ${curve.p0.x} ${curve.p0.y} C ${curve.p1.x} ${curve.p1.y} ${curve.p2.x} ${curve.p2.y} ${curve.p3.x} ${curve.p3.y}"
          ></path>
        `
      )
    )
    .join("");
  const fruitMarkup = fruits
    .map(
      (fruit, index) => `
        <text
          class="writing-app__fruit"
          data-fruit-index="${index}"
          x="${fruit.x}"
          y="${fruit.y}"
          style="font-size: ${currentFruitSize}px"
          text-anchor="middle"
          dominant-baseline="middle"
        >${fruit.emoji}</text>
      `
    )
    .join("");
  const snakeBodyMarkup = Array.from({ length: MAX_SNAKE_BODY_SEGMENTS }, (_, index) => {
    return `
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${index}"
      >
        <image
          href="${snakeBodySprite}"
          preserveAspectRatio="none"
        ></image>
      </g>
    `;
  }).join("");

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
    ${debugCurveMarkup}
    ${tracePaths}
    ${demoPaths}
    <text
      class="writing-app__boundary-star"
      id="waypoint-star"
      x="0"
      y="0"
      text-anchor="middle"
      dominant-baseline="middle"
    >⭐</text>
    ${fruitMarkup}
    <g class="writing-app__snake" id="trace-snake">
      <g
        class="writing-app__snake-segment writing-app__snake-tail"
        id="snake-tail"
      >
        <image
          href="${snakeTailSprite}"
          preserveAspectRatio="none"
        ></image>
      </g>
      ${snakeBodyMarkup}
      <g
        class="writing-app__snake-segment writing-app__snake-head"
        id="snake-head"
      >
        <image
          id="snake-head-image"
          href="${snakeHeadSprite}"
          preserveAspectRatio="none"
        ></image>
      </g>
    </g>
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
  `;

  traceStrokeEls = Array.from(
    traceSvg.querySelectorAll<SVGPathElement>(".writing-app__stroke-trace")
  );
  demoStrokeEls = Array.from(
    traceSvg.querySelectorAll<SVGPathElement>(".writing-app__stroke-demo")
  );
  fruitEls = Array.from(traceSvg.querySelectorAll<SVGTextElement>(".writing-app__fruit"));
  waypointEl = traceSvg.querySelector<SVGTextElement>("#waypoint-star");
  snakeLayerEl = traceSvg.querySelector<SVGGElement>("#trace-snake");
  snakeHeadEl = traceSvg.querySelector<SVGGElement>("#snake-head");
  snakeHeadImageEl = traceSvg.querySelector<SVGImageElement>("#snake-head-image");
  snakeTailEl = traceSvg.querySelector<SVGGElement>("#snake-tail");
  snakeBodyEls = Array.from(traceSvg.querySelectorAll<SVGGElement>(".writing-app__snake-body"));
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

  const initialState = tracingSession.getState();
  resetSnakeTrail(initialState.cursorPoint, initialState.cursorTangent);
  resetFruitState();
  updateSuccessVisibility(false);
  requestTraceRender();
};

const renderWord = (word: string) => {
  stopDemoAnimation();
  wordLabel.textContent = word;

  const layout = buildShiftedWordLayout(word);
  currentPath = layout.path;
  setupScene(layout.path, layout.width, layout.height, layout.offsetY);
};

const goToNextWord = () => {
  currentWordIndex = chooseNextWordIndex(currentWordIndex);
  renderWord(WORDS[currentWordIndex] ?? WORDS[0]);
};

const onPointerDown = (event: PointerEvent) => {
  if (isDemoPlaying || !tracingSession || activePointerId !== null) {
    return;
  }

  const started = tracingSession.beginAt(getPointerInSvg(traceSvg, event));
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
  tracingSession.update(getPointerInSvg(traceSvg, event));
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
toleranceSlider.addEventListener("input", () => {
  currentTraceTolerance = Number(toleranceSlider.value);
  syncToleranceLabel();
  if (currentPath) {
    const layout = buildShiftedWordLayout(WORDS[currentWordIndex] ?? WORDS[0]);
    currentPath = layout.path;
    setupScene(layout.path, layout.width, layout.height, layout.offsetY);
  }
});
fruitSizeSlider.addEventListener("input", () => {
  currentFruitSize = Number(fruitSizeSlider.value);
  syncFruitControlLabels();
  if (currentPath) {
    const layout = buildShiftedWordLayout(WORDS[currentWordIndex] ?? WORDS[0]);
    currentPath = layout.path;
    setupScene(layout.path, layout.width, layout.height, layout.offsetY);
  }
});
fruitSpacingSlider.addEventListener("input", () => {
  currentFruitSpacing = Number(fruitSpacingSlider.value);
  syncFruitControlLabels();
  if (currentPath) {
    const layout = buildShiftedWordLayout(WORDS[currentWordIndex] ?? WORDS[0]);
    currentPath = layout.path;
    setupScene(layout.path, layout.width, layout.height, layout.offsetY);
  }
});

syncToleranceLabel();
syncFruitControlLabels();
goToNextWord();
