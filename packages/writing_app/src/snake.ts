import "./style.css";
import {
  AnimationPlayer,
  TracingSession,
  analyzeTracingGroups,
  compileTracingPath,
  type Point,
  type PreparedTracingPath,
  type PreparedStroke,
  type TracingGroup,
  type TracingSample,
  type TracingState,
  type WritingPath
} from "letterpaths";
import snakeBodySprite from "./assets/snake/body.png";
import snakeBodyBulgeSprite from "./assets/snake/body_bulge.png";
import snakeBackgroundImage from "./assets/snake/background.png";
import eagleFlySprite from "./assets/snake/eagle_fly.png";
import eagleStandSprite from "./assets/snake/eagle_stand.png";
import snakeHeadAltSprite from "./assets/snake/head_alt.png";
import chompSound from "./assets/snake/chomp.mp3";
import sandMoving1Sound from "./assets/snake/sand_moving_1.mp3";
import sandMoving2Sound from "./assets/snake/sand_moving_2.mp3";
import sandMoving3Sound from "./assets/snake/sand_moving_3.mp3";
import sandMoving4Sound from "./assets/snake/sand_moving_4.mp3";
import snakeFacingCameraAngrySprite from "./assets/snake/snake_facing_camera_angry.png";
import snakeFacingCameraHappySprite from "./assets/snake/snake_facing_camera_happy.png";
import snakeHeadSprite from "./assets/snake/head.png";
import snakeTailSprite from "./assets/snake/tail.png";
import {
  DEMO_PAUSE_MS,
  MAX_TRACE_TOLERANCE,
  MIN_TRACE_TOLERANCE,
  TRACE_TOLERANCE_STEP,
  WORDS,
  buildPathD,
  buildShiftedWordLayout,
  chooseNextWordIndex,
  getPointerInSvg
} from "./shared";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const ANALYTICS_MEASUREMENT_ID = "G-94373ZKHEE";
const ANALYTICS_DISABLED_HOSTS = new Set(["localhost", "127.0.0.1"]);

const initializeAnalytics = () => {
  if (ANALYTICS_DISABLED_HOSTS.has(window.location.hostname)) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", ANALYTICS_MEASUREMENT_ID);

  const analyticsScript = document.createElement("script");
  analyticsScript.async = true;
  analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_MEASUREMENT_ID}`;
  document.head.append(analyticsScript);
};

const registerSnakeServiceWorker = () => {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) {
    return;
  }

  const scope = `${import.meta.env.BASE_URL}snake/`;
  void navigator.serviceWorker.register(`${scope}sw.js`, { scope }).catch((error: unknown) => {
    console.error("Failed to register snake service worker.", error);
  });
};

const FRUIT_EMOJI = "🍎";
const DEFAULT_SNAKE_TRACE_TOLERANCE = 150;
const SHOW_ME_SPEED_MULTIPLIER = 0.75;
const SNAKE_SEGMENT_SPACING = 76;
const SNAKE_GROWTH_DISTANCE = 115;
const BULGE_BODY_SPRITE_CHANCE = 0.25;
const SNAKE_CHOMP_SOUND_VOLUME = 0.3;
const SNAKE_MOVE_SOUND_VOLUME = 0.12;
const SNAKE_MOVE_SOUND_CHANCE = 0.42;
const MAX_SNAKE_BODY_SEGMENTS = 10;
const SNAKE_EXIT_MARGIN = 260;
const SNAKE_EXIT_SPEED = 510;
const SNAKE_CHEW_MS = 220;
const SNAKE_RETRACTION_SPEED = 700;
const SNAKE_RETRACTION_HIDE_GAP = 6;
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
const BODY_BULGE_SIZE = {
  ...BODY_SIZE,
  height: BODY_SIZE.height * ((209 / 431) / (160 / 435))
} as const;
const TAIL_SIZE = {
  width: 55,
  height: 33.75,
  anchorX: 0.5,
  anchorY: 0.5,
  rotationOffset: 0
} as const;
const DEFERRED_SNAKE_SCALE = 0.78;
const DEFERRED_SNAKE_SEGMENT_SPACING = 44;
const EAGLE_FLY_MS = 700;
const EAGLE_STAND_MS = 260;
const EAGLE_FLY_AWAY_MS = 800;
const EAGLE_DOT_OFFSET_Y = 18;
const DOT_TARGET_HIT_RADIUS_MULTIPLIER = 0.72;
const EAGLE_FLY_SIZE = {
  width: 200,
  height: 106,
  anchorX: 0.5,
  anchorY: 1
} as const;
const DOT_SNAKE_SIZE = {
  width: 69,
  height: 49,
  anchorX: 0.5,
  anchorY: 0.62
} as const;
const EAGLE_STAND_SIZE = {
  width: 128,
  height: 141,
  anchorX: 0.5,
  anchorY: 1
} as const;
const SNAKE_MOVE_SOUND_SOURCES = [
  sandMoving1Sound,
  sandMoving2Sound,
  sandMoving3Sound,
  sandMoving4Sound
] as const;

type FruitToken = {
  x: number;
  y: number;
  pathDistance: number;
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
  visible: boolean;
};

type DeferredSnakeHead = {
  strokeIndex: number;
  point: Point;
  tangent: Point;
  angle: number;
};

type DeferredSnakeExitHead = DeferredSnakeHead & {
  travelDistance: number;
};

type DotTargetPhase = "hidden" | "waiting" | "eagle_in" | "eagle_stand" | "eagle_out";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app element for snake app.");
}

initializeAnalytics();
registerSnakeServiceWorker();

app.innerHTML = `
  <div class="writing-app writing-app--snake">
    <main class="writing-app__stage">
      <section class="writing-app__board">
        <header class="writing-app__topbar">
          <div class="writing-app__title">
            <p class="writing-app__eyebrow">Drag the snake around the letters.</p>
            <h1 class="writing-app__word" id="word-label"></h1>
          </div>
          <div class="writing-app__topbar-actions">
            <button class="writing-app__button" id="show-me-button" type="button">
              Demo
            </button>
            <details class="writing-app__settings" id="settings-menu">
              <summary
                class="writing-app__icon-button"
                id="settings-button"
                aria-label="Settings"
                title="Settings"
              >⚙</summary>
              <div class="writing-app__settings-panel">
                <label class="writing-app__settings-field" for="tolerance-slider">
                  <span class="writing-app__settings-label">
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
                    value="${DEFAULT_SNAKE_TRACE_TOLERANCE}"
                  />
                </label>
                <label class="writing-app__settings-toggle" for="include-initial-lead-in">
                  <input
                    id="include-initial-lead-in"
                    type="checkbox"
                    checked
                  />
                  <span>Initial lead-in</span>
                </label>
                <label class="writing-app__settings-toggle" for="include-final-lead-out">
                  <input
                    id="include-final-lead-out"
                    type="checkbox"
                    checked
                  />
                  <span>Final lead-out</span>
                </label>
              </div>
            </details>
          </div>
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
            <form class="writing-app__success-form" id="custom-word-form" autocomplete="off">
              <label class="writing-app__success-label" for="custom-word-input">Custom word</label>
              <input
                class="writing-app__success-input"
                id="custom-word-input"
                type="search"
                autocomplete="off"
                autocapitalize="off"
                autocorrect="off"
                inputmode="search"
                enterkeyhint="search"
                spellcheck="false"
                placeholder="Type a word"
              />
              <p class="writing-app__success-error" id="custom-word-error" hidden></p>
              <div class="writing-app__success-actions">
                <button class="writing-app__button" type="submit">Play custom word</button>
                <button
                  class="writing-app__button writing-app__button--secondary writing-app__button--next"
                  id="next-word-button"
                  type="button"
                >
                  Next random word
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  </div>
`;

app.style.setProperty("--snake-board-image", `url("${snakeBackgroundImage}")`);

const wordLabel = document.querySelector<HTMLHeadingElement>("#word-label");
const scoreSummary = document.querySelector<HTMLParagraphElement>("#score-summary");
const traceSvg = document.querySelector<SVGSVGElement>("#trace-svg");
const showMeButton = document.querySelector<HTMLButtonElement>("#show-me-button");
const settingsMenu = document.querySelector<HTMLDetailsElement>("#settings-menu");
const toleranceSlider = document.querySelector<HTMLInputElement>("#tolerance-slider");
const toleranceValue = document.querySelector<HTMLSpanElement>("#tolerance-value");
const includeInitialLeadInInput = document.querySelector<HTMLInputElement>("#include-initial-lead-in");
const includeFinalLeadOutInput = document.querySelector<HTMLInputElement>("#include-final-lead-out");
const successOverlay = document.querySelector<HTMLDivElement>("#success-overlay");
const customWordForm = document.querySelector<HTMLFormElement>("#custom-word-form");
const customWordInput = document.querySelector<HTMLInputElement>("#custom-word-input");
const customWordError = document.querySelector<HTMLParagraphElement>("#custom-word-error");
const nextWordButton = document.querySelector<HTMLButtonElement>("#next-word-button");
if (
  !wordLabel ||
  !scoreSummary ||
  !traceSvg ||
  !showMeButton ||
  !settingsMenu ||
  !toleranceSlider ||
  !toleranceValue ||
  !includeInitialLeadInInput ||
  !includeFinalLeadOutInput ||
  !successOverlay ||
  !customWordForm ||
  !customWordInput ||
  !customWordError ||
  !nextWordButton
) {
  throw new Error("Missing elements for snake app.");
}

let currentWordIndex = -1;
let currentWord = "";
let customWordPrefillMode: "current" | "nextQueued" = "current";
let currentPath: WritingPath | null = null;
let tracingSession: TracingSession | null = null;
let activePointerId: number | null = null;
let activePointerPosition: Point | null = null;
let traceRenderQueued = false;
let traceStrokeEls: SVGPathElement[] = [];
let traceStrokeLengths: number[] = [];
let nextSectionEl: SVGPathElement | null = null;
let demoStrokeEls: SVGPathElement[] = [];
let demoStrokeLengths: number[] = [];
let demoNibEl: SVGCircleElement | null = null;
let demoAnimationFrameId: number | null = null;
let isDemoPlaying = false;
let currentTraceTolerance = DEFAULT_SNAKE_TRACE_TOLERANCE;
let includeInitialLeadIn = true;
let includeFinalLeadOut = true;
let fruits: FruitToken[] = [];
let fruitEls: SVGTextElement[] = [];
let tracingGroups: TracingGroup[] = [];
let waypointMarkers: WaypointMarker[] = [];
let currentWaypointIndex: number | null = null;
let visibleGroupCount = 1;
let waypointEl: SVGTextElement | null = null;
let currentSceneWidth = 1600;
let currentSceneHeight = 900;
let currentPathLength = 0;
let preparedTracingPath: PreparedTracingPath | null = null;
let drawablePathStrokes: WritingPath["strokes"] = [];
let snakeLayerEl: SVGGElement | null = null;
let snakeHeadEl: SVGGElement | null = null;
let snakeHeadImageEl: SVGImageElement | null = null;
let snakeBodyEls: SVGGElement[] = [];
let snakeTailEl: SVGGElement | null = null;
let deferredHeadEl: SVGGElement | null = null;
let deferredTrailHeadEls = new Map<number, SVGGElement>();
let dotSnakeEl: SVGGElement | null = null;
let dotSnakeImageEl: SVGImageElement | null = null;
let eagleEl: SVGGElement | null = null;
let eagleImageEl: SVGImageElement | null = null;
let snakeTrail: SnakePose[] = [];
let snakeHeadDistance = 0;
let snakeHeadAngle = 0;
let parkedBoundaryDistance: number | null = null;
let snakeChewUntil = 0;
let snakeRetractionDistance = 0;
let snakeRetractionTarget = 0;
let snakeRetractionAnimationFrameId: number | null = null;
let snakeUnretractStartHeadDistance: number | null = null;
let snakeUnretractStartRetraction = 0;
let snakeExitAnimationFrameId: number | null = null;
let dotTargetAnimationFrameId: number | null = null;
let isSnakeSlithering = false;
let isSnakeExitComplete = false;
let snakeExitBodyCount = 0;
let completedDeferredHeads: DeferredSnakeHead[] = [];
let completedDeferredHeadIndices = new Set<number>();
let deferredExitHeads: DeferredSnakeExitHead[] = [];
let dotTargetPhase: DotTargetPhase = "hidden";
let dotTargetStrokeIndex: number | null = null;
let dotTargetPoint: Point | null = null;
let dotTargetPhaseStartedAt = 0;
let queuedTurnTangent: Point | null = null;
let isAwaitingSegmentRestart = false;
let snakeChompSoundPlayer: HTMLAudioElement | null = null;
let activeSnakeChompSounds: HTMLAudioElement[] = [];
let snakeChompSoundWarmed = false;
let snakeMoveSoundPlayers: HTMLAudioElement[] | null = null;
let activeSnakeMoveSounds: HTMLAudioElement[] = [];
let snakeMoveSoundsWarmed = false;
let snakeMoveSoundGroupIndex = -1;
let nextSnakeMoveSoundDistance = Number.POSITIVE_INFINITY;

const syncToleranceLabel = () => {
  toleranceValue.textContent = `${currentTraceTolerance}px`;
};

const rerenderCurrentWord = () => {
  if (!currentWord) {
    return;
  }
  renderWord(currentWord, currentWordIndex);
};

const clearCustomWordError = () => {
  customWordError.hidden = true;
  customWordError.textContent = "";
};

const setCustomWordError = (message: string) => {
  customWordError.hidden = false;
  customWordError.textContent = message;
};

const normalizeWordInput = (word: string): string => word.trim().replace(/\s+/g, " ").toLowerCase();

const getUrlWordSequence = (): string[] => {
  const params = new URLSearchParams(window.location.search);

  return Array.from(params.entries())
    .flatMap(([key, value]) => {
      if (key !== "word" && key !== "words") {
        return [];
      }
      return value.split(",");
    })
    .map(normalizeWordInput)
    .filter((word) => word.length > 0);
};

const urlWordSequence = getUrlWordSequence();
let nextUrlWordIndex = 0;

const syncNextWordButtonLabel = () => {
  nextWordButton.textContent =
    nextUrlWordIndex < urlWordSequence.length ? "Next queued word" : "Next random word";
};

const getCustomWordPrefillValue = (currentWordValue: string): string => {
  if (customWordPrefillMode === "nextQueued") {
    return urlWordSequence[nextUrlWordIndex] ?? currentWordValue;
  }

  return currentWordValue;
};

const getNextUrlWord = (): string | null => {
  if (nextUrlWordIndex >= urlWordSequence.length) {
    return null;
  }

  const nextWord = urlWordSequence[nextUrlWordIndex];
  nextUrlWordIndex += 1;
  return nextWord ?? null;
};

const ensureSnakeMoveSoundPlayers = () => {
  if (snakeMoveSoundPlayers) {
    return snakeMoveSoundPlayers;
  }

  snakeMoveSoundPlayers = SNAKE_MOVE_SOUND_SOURCES.map((src) => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = SNAKE_MOVE_SOUND_VOLUME;
    return audio;
  });
  return snakeMoveSoundPlayers;
};

const ensureSnakeChompSoundPlayer = () => {
  if (snakeChompSoundPlayer) {
    return snakeChompSoundPlayer;
  }

  snakeChompSoundPlayer = new Audio(chompSound);
  snakeChompSoundPlayer.preload = "auto";
  snakeChompSoundPlayer.volume = SNAKE_CHOMP_SOUND_VOLUME;
  return snakeChompSoundPlayer;
};

const warmSnakeChompSound = () => {
  if (snakeChompSoundWarmed) {
    return;
  }

  ensureSnakeChompSoundPlayer().load();
  snakeChompSoundWarmed = true;
};

const warmSnakeMoveSounds = () => {
  if (snakeMoveSoundsWarmed) {
    return;
  }

  ensureSnakeMoveSoundPlayers().forEach((audio) => {
    audio.load();
  });
  snakeMoveSoundsWarmed = true;
};

const playSnakeChompSound = () => {
  const template = ensureSnakeChompSoundPlayer();
  const src = template.currentSrc || template.src;
  if (!src) {
    return;
  }

  const player = new Audio(src);
  player.preload = "auto";
  player.currentTime = 0;
  player.volume = SNAKE_CHOMP_SOUND_VOLUME;
  activeSnakeChompSounds.push(player);
  player.addEventListener("ended", () => {
    activeSnakeChompSounds = activeSnakeChompSounds.filter((audio) => audio !== player);
  });
  player.addEventListener("error", () => {
    activeSnakeChompSounds = activeSnakeChompSounds.filter((audio) => audio !== player);
  });
  void player.play().catch(() => { });
};

const playRandomSnakeMoveSound = () => {
  const players = ensureSnakeMoveSoundPlayers();
  const template = players[Math.floor(Math.random() * players.length)];
  const src = template?.currentSrc || template?.src;
  if (!src) {
    return;
  }

  const player = new Audio(src);
  player.preload = "auto";
  player.currentTime = 0;
  player.volume = SNAKE_MOVE_SOUND_VOLUME;
  activeSnakeMoveSounds.push(player);
  player.addEventListener("ended", () => {
    activeSnakeMoveSounds = activeSnakeMoveSounds.filter((audio) => audio !== player);
  });
  player.addEventListener("error", () => {
    activeSnakeMoveSounds = activeSnakeMoveSounds.filter((audio) => audio !== player);
  });
  void player.play().catch(() => { });
};

const resetSnakeMoveSoundProgress = () => {
  const groupIndex = visibleGroupCount > 0 ? visibleGroupCount - 1 : -1;
  const group = groupIndex >= 0 ? tracingGroups[groupIndex] : null;

  snakeMoveSoundGroupIndex = groupIndex;
  nextSnakeMoveSoundDistance = group
    ? group.startDistance + SNAKE_SEGMENT_SPACING
    : Number.POSITIVE_INFINITY;
};

const maybePlaySnakeMoveSound = (
  state: Pick<TracingState, "status" | "activeStrokeIndex" | "activeStrokeProgress" | "isPenDown">
) => {
  if (!state.isPenDown || isDemoPlaying || isSnakeSlithering || isSnakeExitComplete || isAwaitingSegmentRestart) {
    return;
  }

  const groupIndex = visibleGroupCount > 0 ? visibleGroupCount - 1 : -1;
  const group = groupIndex >= 0 ? tracingGroups[groupIndex] : null;
  if (!group) {
    nextSnakeMoveSoundDistance = Number.POSITIVE_INFINITY;
    snakeMoveSoundGroupIndex = groupIndex;
    return;
  }

  if (groupIndex !== snakeMoveSoundGroupIndex) {
    resetSnakeMoveSoundProgress();
  }

  const overallDistance = getOverallDistanceForState(state);
  let shouldPlay = false;
  while (
    overallDistance >= nextSnakeMoveSoundDistance &&
    nextSnakeMoveSoundDistance <= group.endDistance
  ) {
    if (Math.random() < SNAKE_MOVE_SOUND_CHANCE) {
      shouldPlay = true;
    }
    nextSnakeMoveSoundDistance += SNAKE_SEGMENT_SPACING;
  }

  if (shouldPlay) {
    playRandomSnakeMoveSound();
  }
};

const syncFruitDisplay = () => {
  const hideFruit = isDemoPlaying;

  fruitEls.forEach((el) => {
    const fruit = fruits[Number(el.dataset.fruitIndex)];
    const shouldHide = hideFruit || !fruit || fruit.captured || fruit.groupIndex >= visibleGroupCount;
    el.classList.toggle("writing-app__fruit--captured", Boolean(fruit?.captured));
    el.classList.toggle("writing-app__fruit--hidden", shouldHide);
  });
  scoreSummary.textContent = fruits.length === 0 ? "Nice tracing." : "All the fruit is collected.";
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

const pointFromAngle = (angle: number): Point => {
  const radians = (angle * Math.PI) / 180;
  return {
    x: Math.cos(radians),
    y: Math.sin(radians)
  };
};

const cancelSnakeRetractionAnimation = () => {
  if (snakeRetractionAnimationFrameId !== null) {
    cancelAnimationFrame(snakeRetractionAnimationFrameId);
    snakeRetractionAnimationFrameId = null;
  }
};

const animateSnakeRetraction = () => {
  cancelSnakeRetractionAnimation();

  if (Math.abs(snakeRetractionDistance - snakeRetractionTarget) < 0.5) {
    snakeRetractionDistance = snakeRetractionTarget;
    renderSnake();
    return;
  }

  let previousTimestamp: number | null = null;

  const tick = (timestamp: number) => {
    if (previousTimestamp === null) {
      previousTimestamp = timestamp;
      snakeRetractionAnimationFrameId = requestAnimationFrame(tick);
      return;
    }

    const elapsedSeconds = Math.max(0, timestamp - previousTimestamp) / 1000;
    previousTimestamp = timestamp;
    const maxStep = elapsedSeconds * SNAKE_RETRACTION_SPEED;
    const delta = snakeRetractionTarget - snakeRetractionDistance;

    if (Math.abs(delta) <= maxStep) {
      snakeRetractionDistance = snakeRetractionTarget;
      snakeRetractionAnimationFrameId = null;
      renderSnake();
      maybeResumeContinuousDrag();
      return;
    }

    snakeRetractionDistance += Math.sign(delta) * maxStep;
    renderSnake();
    snakeRetractionAnimationFrameId = requestAnimationFrame(tick);
  };

  snakeRetractionAnimationFrameId = requestAnimationFrame(tick);
};

const setSnakeRetractionTarget = (target: number) => {
  const clampedTarget = Math.max(0, target);
  if (Math.abs(clampedTarget - snakeRetractionTarget) < 0.5) {
    return;
  }

  snakeRetractionTarget = clampedTarget;
  animateSnakeRetraction();
};

const beginSnakeUnretractFromCurrentState = () => {
  cancelSnakeRetractionAnimation();
  snakeRetractionTarget = snakeRetractionDistance;
  snakeUnretractStartHeadDistance = snakeHeadDistance;
  snakeUnretractStartRetraction = snakeRetractionDistance;
};

const maybeResumeContinuousDrag = () => {
  if (
    !isAwaitingSegmentRestart ||
    activePointerId === null ||
    !activePointerPosition ||
    !tracingSession ||
    snakeRetractionDistance > 0.5
  ) {
    return false;
  }

  const resumeState = tracingSession.getState();
  const started = tracingSession.beginAt(resumeState.cursorPoint);
  if (!started) {
    return false;
  }

  isAwaitingSegmentRestart = false;
  snakeUnretractStartHeadDistance = snakeHeadDistance;
  snakeUnretractStartRetraction = snakeRetractionDistance;

  tracingSession.update(activePointerPosition);
  requestTraceRender();
  return true;
};

const syncSnakeUnretractionFromMovement = () => {
  if (snakeUnretractStartHeadDistance === null) {
    return;
  }

  const travelledSinceRestart = Math.max(0, snakeHeadDistance - snakeUnretractStartHeadDistance);
  const nextRetraction = Math.max(0, snakeUnretractStartRetraction - travelledSinceRestart);
  if (Math.abs(nextRetraction - snakeRetractionDistance) < 0.5) {
    if (nextRetraction <= 0.5) {
      snakeRetractionDistance = 0;
      snakeRetractionTarget = 0;
      snakeUnretractStartHeadDistance = null;
      snakeUnretractStartRetraction = 0;
    }
    return;
  }

  snakeRetractionDistance = nextRetraction;
  snakeRetractionTarget = nextRetraction;
  if (nextRetraction <= 0.5) {
    snakeRetractionDistance = 0;
    snakeRetractionTarget = 0;
    snakeUnretractStartHeadDistance = null;
    snakeUnretractStartRetraction = 0;
  }
};

const getActivePreparedStroke = (state: Pick<TracingState, "activeStrokeIndex">): PreparedStroke | null => {
  return preparedTracingPath?.strokes[state.activeStrokeIndex] ?? null;
};

const getActiveDrawableStroke = (
  state: Pick<TracingState, "activeStrokeIndex">
): WritingPath["strokes"][number] | null => {
  return drawablePathStrokes[state.activeStrokeIndex] ?? null;
};

const getActiveStrokeTravelDistance = (state: Pick<TracingState, "activeStrokeIndex" | "activeStrokeProgress">): number => {
  const stroke = preparedTracingPath?.strokes[state.activeStrokeIndex];
  return (stroke?.totalLength ?? 0) * state.activeStrokeProgress;
};

const getOverallDistanceForState = (
  state: Pick<TracingState, "status" | "activeStrokeIndex" | "activeStrokeProgress">
): number => {
  if (!preparedTracingPath) {
    return 0;
  }

  if (state.status === "complete") {
    return currentPathLength;
  }

  let total = 0;
  for (let index = 0; index < state.activeStrokeIndex; index += 1) {
    total += preparedTracingPath.strokes[index]?.totalLength ?? 0;
  }

  return total + getActiveStrokeTravelDistance(state);
};

const isDeferredStrokeActive = (state: Pick<TracingState, "activeStrokeIndex">): boolean =>
  getActiveDrawableStroke(state)?.deferred === true;

const getVisibleSnakeSegments = (
  travelledDistance: number,
  maxBodyCount: number,
  segmentSpacing: number
): { bodyCount: number; showTail: boolean } => {
  const maxVisibleBodiesByLength = Math.max(0, Math.floor(travelledDistance / segmentSpacing));
  const bodyCount = Math.min(maxBodyCount, maxVisibleBodiesByLength);
  return {
    bodyCount,
    showTail: travelledDistance >= (bodyCount + 1) * segmentSpacing
  };
};

const getStrokeTerminalPose = (strokeIndex: number): { point: Point; tangent: Point } | null => {
  const stroke = preparedTracingPath?.strokes[strokeIndex];
  const sample = stroke?.samples[stroke.samples.length - 1];
  if (!sample) {
    return null;
  }

  return {
    point: { x: sample.x, y: sample.y },
    tangent: sample.tangent
  };
};

const getParkedSnakePose = (
  state: Pick<TracingState, "activeStrokeIndex">
): { point: Point; tangent: Point } | null => {
  for (let index = state.activeStrokeIndex - 1; index >= 0; index -= 1) {
    const stroke = drawablePathStrokes[index];
    if (!stroke || stroke.deferred) {
      continue;
    }

    return getStrokeTerminalPose(index);
  }

  return null;
};

const getSnakeExitPose = (state: TracingState): { point: Point; tangent: Point } => {
  if (isDeferredStrokeActive(state)) {
    const parkedPose = getParkedSnakePose(state);
    if (parkedPose) {
      return parkedPose;
    }
  }

  const lastPose = [...snakeTrail].reverse().find((pose) => pose.visible);
  if (lastPose) {
    return {
      point: { x: lastPose.x, y: lastPose.y },
      tangent: pointFromAngle(lastPose.angle)
    };
  }

  return {
    point: state.cursorPoint,
    tangent: state.cursorTangent
  };
};

const getDeferredHeadState = (
  state: TracingState
): { strokeIndex: number; point: Point; tangent: Point; isDot: boolean } | null => {
  if (
    isDemoPlaying ||
    state.status === "complete" ||
    !isDeferredStrokeActive(state)
  ) {
    return null;
  }

  return {
    strokeIndex: state.activeStrokeIndex,
    point: state.cursorPoint,
    tangent: state.cursorTangent,
    isDot: getActivePreparedStroke(state)?.isDot === true
  };
};

const isDotStrokeAnimating = (
  strokeIndex: number,
  state: Pick<TracingState, "activeStrokeIndex">
): boolean =>
  strokeIndex === state.activeStrokeIndex &&
  strokeIndex === dotTargetStrokeIndex &&
  getActivePreparedStroke(state)?.isDot === true &&
  dotTargetPhase !== "hidden" &&
  dotTargetPhase !== "waiting";

const renderDeferredHead = (state: TracingState) => {
  if (!deferredHeadEl) {
    return;
  }

  const deferredHead = getDeferredHeadState(state);
  if (!deferredHead) {
    deferredHeadEl.style.opacity = "0";
    return;
  }

  if (deferredHead.isDot) {
    deferredHeadEl.style.opacity = "0";
    return;
  }

  renderDeferredSnake(
    deferredHeadEl,
    {
      point: deferredHead.point,
      tangent: deferredHead.tangent,
      angle: toAngle(deferredHead.tangent)
    },
    {
      isDot: false,
      headHref: snakeHeadSprite,
      travelledDistance: getActiveStrokeTravelDistance(state)
    }
  );
};

const renderDeferredSnake = (
  rootEl: SVGGElement,
  pose: { point: Point; tangent: Point; angle: number },
  options: { isDot: boolean; headHref?: string; travelledDistance?: number } = { isDot: false }
) => {
  const headGroupEl = rootEl.querySelector<SVGGElement>("[data-deferred-part='head']");
  const bodyGroupEl = rootEl.querySelector<SVGGElement>("[data-deferred-part='body']");
  const tailGroupEl = rootEl.querySelector<SVGGElement>("[data-deferred-part='tail']");
  const headImageEl = headGroupEl?.querySelector<SVGImageElement>("image");
  const bodyImageEl = bodyGroupEl?.querySelector<SVGImageElement>("image");
  const tailImageEl = tailGroupEl?.querySelector<SVGImageElement>("image");

  if (!headGroupEl || !headImageEl) {
    return;
  }

  rootEl.style.opacity = "1";
  headImageEl.setAttribute("href", options.headHref ?? snakeHeadSprite);
  setSpritePose(
    headGroupEl,
    headImageEl,
    {
      x: pose.point.x,
      y: pose.point.y,
      angle: pose.angle,
      distance: 0,
      visible: true
    },
    HEAD_SIZE.width * DEFERRED_SNAKE_SCALE,
    HEAD_SIZE.height * DEFERRED_SNAKE_SCALE,
    HEAD_SIZE.anchorX,
    HEAD_SIZE.anchorY,
    HEAD_SIZE.rotationOffset
  );

  if (options.isDot) {
    if (bodyGroupEl) {
      bodyGroupEl.style.opacity = "0";
    }
    if (tailGroupEl) {
      tailGroupEl.style.opacity = "0";
    }
    return;
  }

  const segmentVisibility = getVisibleSnakeSegments(
    options.travelledDistance ?? Number.POSITIVE_INFINITY,
    1,
    DEFERRED_SNAKE_SEGMENT_SPACING
  );
  if (segmentVisibility.bodyCount === 0) {
    if (bodyGroupEl) {
      bodyGroupEl.style.opacity = "0";
    }
    if (tailGroupEl) {
      tailGroupEl.style.opacity = "0";
    }
    return;
  }

  const bodyPoint = {
    x: pose.point.x - pose.tangent.x * DEFERRED_SNAKE_SEGMENT_SPACING,
    y: pose.point.y - pose.tangent.y * DEFERRED_SNAKE_SEGMENT_SPACING
  };
  const tailPoint = {
    x: pose.point.x - pose.tangent.x * DEFERRED_SNAKE_SEGMENT_SPACING * 2,
    y: pose.point.y - pose.tangent.y * DEFERRED_SNAKE_SEGMENT_SPACING * 2
  };

  if (bodyGroupEl && bodyImageEl) {
    setSpritePose(
      bodyGroupEl,
      bodyImageEl,
      {
        x: bodyPoint.x,
        y: bodyPoint.y,
        angle: pose.angle,
        distance: 0,
        visible: true
      },
      BODY_SIZE.width * DEFERRED_SNAKE_SCALE,
      BODY_SIZE.height * DEFERRED_SNAKE_SCALE,
      BODY_SIZE.anchorX,
      BODY_SIZE.anchorY,
      BODY_SIZE.rotationOffset
    );
  }

  if (tailGroupEl && tailImageEl && segmentVisibility.showTail) {
    setSpritePose(
      tailGroupEl,
      tailImageEl,
      {
        x: tailPoint.x,
        y: tailPoint.y,
        angle: pose.angle,
        distance: 0,
        visible: true
      },
      TAIL_SIZE.width * DEFERRED_SNAKE_SCALE,
      TAIL_SIZE.height * DEFERRED_SNAKE_SCALE,
      TAIL_SIZE.anchorX,
      TAIL_SIZE.anchorY,
      TAIL_SIZE.rotationOffset
    );
  } else if (tailGroupEl) {
    tailGroupEl.style.opacity = "0";
  }
};

const createDeferredSnakeMarkup = (attributes: string): string => `
  <g ${attributes}>
    <g class="writing-app__deferred-head-part" data-deferred-part="tail">
      <image href="${snakeTailSprite}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="body">
      <image href="${snakeBodySprite}" preserveAspectRatio="none"></image>
    </g>
    <g class="writing-app__deferred-head-part" data-deferred-part="head">
      <image href="${snakeHeadSprite}" preserveAspectRatio="none"></image>
    </g>
  </g>
`;

const hideDotTarget = () => {
  if (dotTargetAnimationFrameId !== null) {
    cancelAnimationFrame(dotTargetAnimationFrameId);
    dotTargetAnimationFrameId = null;
  }

  dotTargetPhase = "hidden";
  dotTargetStrokeIndex = null;
  dotTargetPoint = null;
  if (dotSnakeEl) {
    dotSnakeEl.style.opacity = "0";
    dotSnakeEl.classList.remove("writing-app__dot-snake--waiting");
  }
  if (eagleEl) {
    eagleEl.style.opacity = "0";
  }
};

const getEagleStandPoint = (point: Point): Point => ({
  x: point.x,
  y: point.y - EAGLE_DOT_OFFSET_Y
});

const getDotSnakeBasePoint = (point: Point): Point => ({
  x: point.x,
  y: point.y + 8
});

const getDotTargetScene = (
  now = performance.now()
): {
  snakePoint: Point;
  snakeHref: string;
  snakeWobble: boolean;
  eaglePoint?: Point;
  eagleHref?: string;
  eagleWidth?: number;
  eagleHeight?: number;
} | null => {
  if (dotTargetPhase === "hidden" || !dotTargetPoint) {
    return null;
  }

  const snakeBasePoint = getDotSnakeBasePoint(dotTargetPoint);
  const standPoint = getEagleStandPoint(dotTargetPoint);

  if (dotTargetPhase === "waiting") {
    return {
      snakePoint: snakeBasePoint,
      snakeHref: snakeFacingCameraHappySprite,
      snakeWobble: true
    };
  }

  if (dotTargetPhase === "eagle_in") {
    const progress = Math.max(0, Math.min(1, (now - dotTargetPhaseStartedAt) / EAGLE_FLY_MS));
    const eased = 1 - (1 - progress) * (1 - progress);
    return {
      snakePoint: snakeBasePoint,
      snakeHref: snakeFacingCameraHappySprite,
      snakeWobble: false,
      eaglePoint: {
        x: standPoint.x,
        y: -EAGLE_FLY_SIZE.height + (standPoint.y + EAGLE_FLY_SIZE.height) * eased
      },
      eagleHref: eagleFlySprite,
      eagleWidth: EAGLE_FLY_SIZE.width,
      eagleHeight: EAGLE_FLY_SIZE.height
    };
  }

  if (dotTargetPhase === "eagle_stand") {
    return {
      snakePoint: snakeBasePoint,
      snakeHref: snakeFacingCameraHappySprite,
      snakeWobble: false,
      eaglePoint: standPoint,
      eagleHref: eagleStandSprite,
      eagleWidth: EAGLE_STAND_SIZE.width,
      eagleHeight: EAGLE_STAND_SIZE.height
    };
  }

  const progress = Math.max(0, Math.min(1, (now - dotTargetPhaseStartedAt) / EAGLE_FLY_AWAY_MS));
  const eased = 1 - (1 - progress) * (1 - progress);
  const eaglePoint = {
    x: standPoint.x + (currentSceneWidth + EAGLE_FLY_SIZE.width - standPoint.x) * eased,
    y: standPoint.y + (-EAGLE_FLY_SIZE.height - standPoint.y) * eased
  };
  return {
    snakePoint: {
      x: eaglePoint.x,
      y: eaglePoint.y + EAGLE_FLY_SIZE.height * 0.6
    },
    snakeHref: snakeFacingCameraAngrySprite,
    snakeWobble: false,
    eaglePoint,
    eagleHref: eagleFlySprite,
    eagleWidth: EAGLE_FLY_SIZE.width,
    eagleHeight: EAGLE_FLY_SIZE.height
  };
};

const completeActiveDotStroke = () => {
  const state = tracingSession?.getState();
  if (!tracingSession || !state) {
    return;
  }

  if (
    dotTargetStrokeIndex !== null &&
    state.activeStrokeIndex === dotTargetStrokeIndex &&
    getActivePreparedStroke(state)?.isDot
  ) {
    tracingSession.beginAt(state.cursorPoint);
    const nextState = tracingSession.getState();
    captureFruitThroughDistance(getOverallDistanceForState(nextState));
    maybePauseAtTracingGroupBoundary(nextState);
  }
};

const finishDotPickup = () => {
  completeActiveDotStroke();

  hideDotTarget();
  requestTraceRender();
};

const tickDotTargetAnimation = (now: number) => {
  dotTargetAnimationFrameId = null;
  if (dotTargetPhase === "hidden" || dotTargetPhase === "waiting") {
    return;
  }

  if (dotTargetPhase === "eagle_in" && now - dotTargetPhaseStartedAt >= EAGLE_FLY_MS) {
    dotTargetPhase = "eagle_stand";
    dotTargetPhaseStartedAt = now;
  } else if (dotTargetPhase === "eagle_stand" && now - dotTargetPhaseStartedAt >= EAGLE_STAND_MS) {
    dotTargetPhase = "eagle_out";
    dotTargetPhaseStartedAt = now;
  } else if (dotTargetPhase === "eagle_out" && now - dotTargetPhaseStartedAt >= EAGLE_FLY_AWAY_MS) {
    finishDotPickup();
    return;
  }

  requestTraceRender();
  dotTargetAnimationFrameId = requestAnimationFrame(tickDotTargetAnimation);
};

const startDotPickupAnimation = () => {
  if (dotTargetPhase !== "waiting") {
    return;
  }

  completeActiveDotStroke();
  dotTargetPhase = "eagle_in";
  dotTargetPhaseStartedAt = performance.now();
  if (dotTargetAnimationFrameId !== null) {
    cancelAnimationFrame(dotTargetAnimationFrameId);
  }
  dotTargetAnimationFrameId = requestAnimationFrame(tickDotTargetAnimation);
  requestTraceRender();
};

const syncDotTargetToState = (state: TracingState) => {
  const deferredHead = getDeferredHeadState(state);
  if (!deferredHead?.isDot) {
    if (dotTargetPhase !== "hidden" && dotTargetPhase !== "waiting") {
      return;
    }
    hideDotTarget();
    return;
  }

  if (dotTargetStrokeIndex !== deferredHead.strokeIndex) {
    hideDotTarget();
    dotTargetStrokeIndex = deferredHead.strokeIndex;
    dotTargetPoint = deferredHead.point;
    dotTargetPhase = "waiting";
  } else if (dotTargetPhase === "waiting") {
    dotTargetPoint = deferredHead.point;
  }
};

const renderDotTarget = (now = performance.now()) => {
  if (!dotSnakeEl || !dotSnakeImageEl || !eagleEl || !eagleImageEl) {
    return;
  }

  const scene = getDotTargetScene(now);
  if (!scene) {
    dotSnakeEl.style.opacity = "0";
    dotSnakeEl.classList.remove("writing-app__dot-snake--waiting");
    eagleEl.style.opacity = "0";
    return;
  }

  dotSnakeEl.style.opacity = "1";
  dotSnakeEl.classList.toggle("writing-app__dot-snake--waiting", scene.snakeWobble);
  dotSnakeImageEl.setAttribute("href", scene.snakeHref);
  setSpritePose(
    dotSnakeEl,
    dotSnakeImageEl,
    {
      x: scene.snakePoint.x,
      y: scene.snakePoint.y,
      angle: 0,
      distance: 0,
      visible: true
    },
    DOT_SNAKE_SIZE.width,
    DOT_SNAKE_SIZE.height,
    DOT_SNAKE_SIZE.anchorX,
    DOT_SNAKE_SIZE.anchorY,
    0
  );

  if (!scene.eaglePoint || !scene.eagleHref || !scene.eagleWidth || !scene.eagleHeight) {
    eagleEl.style.opacity = "0";
    return;
  }

  eagleImageEl.setAttribute("href", scene.eagleHref);
  setSpritePose(
    eagleEl,
    eagleImageEl,
    {
      x: scene.eaglePoint.x,
      y: scene.eaglePoint.y,
      angle: 0,
      distance: 0,
      visible: true
    },
    scene.eagleWidth,
    scene.eagleHeight,
    EAGLE_STAND_SIZE.anchorX,
    EAGLE_STAND_SIZE.anchorY,
    0
  );
};

const isPointerOnDeferredTarget = (point: Point, state: TracingState): boolean => {
  const deferredHead = getDeferredHeadState(state);
  if (!deferredHead) {
    return false;
  }

  if (deferredHead.isDot) {
    if (dotTargetPhase !== "waiting") {
      return false;
    }
    const scene = getDotTargetScene();
    if (!scene) {
      return false;
    }
    const hitRadius =
      Math.max(DOT_SNAKE_SIZE.width, DOT_SNAKE_SIZE.height) * DOT_TARGET_HIT_RADIUS_MULTIPLIER;
    return Math.hypot(point.x - scene.snakePoint.x, point.y - scene.snakePoint.y) <= hitRadius;
  }

  const hitRadius = Math.max(34, HEAD_SIZE.width * 0.52);
  return Math.hypot(point.x - deferredHead.point.x, point.y - deferredHead.point.y) <= hitRadius;
};

const registerCompletedDeferredHeads = (state: TracingState) => {
  state.completedStrokes.forEach((strokeIndex) => {
    if (completedDeferredHeadIndices.has(strokeIndex)) {
      return;
    }

    completedDeferredHeadIndices.add(strokeIndex);
    const drawableStroke = drawablePathStrokes[strokeIndex];
    const preparedStroke = preparedTracingPath?.strokes[strokeIndex];
    if (!drawableStroke?.deferred || preparedStroke?.isDot) {
      return;
    }

    const terminalPose = getStrokeTerminalPose(strokeIndex);
    if (!terminalPose) {
      return;
    }

    completedDeferredHeads.push({
      strokeIndex,
      point: terminalPose.point,
      tangent: terminalPose.tangent,
      angle: toAngle(terminalPose.tangent)
    });
  });
};

const renderCompletedDeferredHeads = () => {
  deferredTrailHeadEls.forEach((el, strokeIndex) => {
    const head = completedDeferredHeads.find((item) => item.strokeIndex === strokeIndex);
    if (!head) {
      el.style.opacity = "0";
      return;
    }

    renderDeferredSnake(el, {
      point: head.point,
      tangent: head.tangent,
      angle: head.angle
    });
  });
};

const hideCompletedDeferredHeads = () => {
  deferredTrailHeadEls.forEach((el) => {
    el.style.opacity = "0";
  });
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

const buildPathDFromOverallDistanceRange = (
  preparedPath: PreparedTracingPath,
  startDistance: number,
  endDistance: number
): string => {
  if (endDistance <= startDistance) {
    return "";
  }

  const commands: string[] = [];
  let strokeOffset = 0;

  preparedPath.strokes.forEach((stroke) => {
    const strokeStart = strokeOffset;
    const strokeEnd = strokeOffset + stroke.totalLength;
    strokeOffset = strokeEnd;

    if (endDistance < strokeStart || startDistance > strokeEnd) {
      return;
    }

    const localStart = Math.max(0, startDistance - strokeStart);
    const localEnd = Math.min(stroke.totalLength, endDistance - strokeStart);
    if (localEnd < localStart || stroke.samples.length === 0) {
      return;
    }

    const points: Point[] = [
      interpolateSamplePoint(stroke.samples, localStart),
      ...stroke.samples
        .filter(
          (sample) =>
            sample.distanceAlongStroke > localStart && sample.distanceAlongStroke < localEnd
        )
        .map((sample) => ({ x: sample.x, y: sample.y })),
      interpolateSamplePoint(stroke.samples, localEnd)
    ];

    const dedupedPoints = points.filter((point, index) => {
      const previous = points[index - 1];
      return !previous || Math.hypot(point.x - previous.x, point.y - previous.y) > 0.01;
    });

    if (dedupedPoints.length === 0) {
      return;
    }

    const [firstPoint, ...remainingPoints] = dedupedPoints;
    commands.push(`M ${firstPoint.x} ${firstPoint.y}`);
    remainingPoints.forEach((point) => {
      commands.push(`L ${point.x} ${point.y}`);
    });
  });

  return commands.join(" ");
};

type PoseAtDistanceBias = "forward" | "backward" | "center";
type OffsetPathSample = {
  distance: number;
  point: Point;
};

const getPoseAtOverallDistance = (
  preparedPath: PreparedTracingPath,
  targetDistance: number,
  bias: PoseAtDistanceBias = "center"
): { point: Point; tangent: Point } => {
  const totalLength = preparedPath.strokes.reduce((sum, stroke) => sum + stroke.totalLength, 0);
  const clampedDistance = Math.max(0, Math.min(targetDistance, totalLength));
  const point = getPointAtOverallDistance(preparedPath, clampedDistance);
  const delta = Math.min(8, Math.max(2, totalLength / 200));

  let fromDistance = Math.max(0, clampedDistance - delta);
  let toDistance = Math.min(totalLength, clampedDistance + delta);

  if (bias === "forward") {
    fromDistance = clampedDistance;
  } else if (bias === "backward") {
    toDistance = clampedDistance;
  }

  if (Math.abs(toDistance - fromDistance) < 0.001) {
    if (clampedDistance <= delta) {
      toDistance = Math.min(totalLength, clampedDistance + delta);
    } else {
      fromDistance = Math.max(0, clampedDistance - delta);
    }
  }

  const fromPoint = getPointAtOverallDistance(preparedPath, fromDistance);
  const toPoint = getPointAtOverallDistance(preparedPath, toDistance);

  return {
    point,
    tangent: normalizeVector({
      x: toPoint.x - fromPoint.x,
      y: toPoint.y - fromPoint.y
    })
  };
};

const offsetPosePoint = (pose: { point: Point; tangent: Point }, lateralOffset: number): Point => {
  const normal = { x: -pose.tangent.y, y: pose.tangent.x };
  return {
    x: pose.point.x + normal.x * lateralOffset,
    y: pose.point.y + normal.y * lateralOffset
  };
};

const buildOffsetPathSamplesFromOverallDistanceRange = (
  preparedPath: PreparedTracingPath,
  startDistance: number,
  endDistance: number,
  lateralOffset: number
): OffsetPathSample[] => {
  if (endDistance <= startDistance) {
    return [];
  }

  const distances = [startDistance];
  let strokeOffset = 0;

  preparedPath.strokes.forEach((stroke) => {
    const strokeStart = strokeOffset;
    const strokeEnd = strokeOffset + stroke.totalLength;
    strokeOffset = strokeEnd;

    if (endDistance < strokeStart || startDistance > strokeEnd) {
      return;
    }

    stroke.samples.forEach((sample) => {
      const overallDistance = strokeStart + sample.distanceAlongStroke;
      if (overallDistance > startDistance && overallDistance < endDistance) {
        distances.push(overallDistance);
      }
    });
  });

  distances.push(endDistance);

  return distances
    .map((distance, index) => {
      const bias =
        index === 0 ? "forward" : index === distances.length - 1 ? "backward" : "center";
      return {
        distance,
        point: offsetPosePoint(getPoseAtOverallDistance(preparedPath, distance, bias), lateralOffset)
      };
    })
    .filter((sample, index, samples) => {
      const previous = samples[index - 1];
      return (
        !previous ||
        Math.hypot(sample.point.x - previous.point.x, sample.point.y - previous.point.y) > 0.01
      );
    });
};

const appendPolylineCommands = (commands: string[], points: Point[], moveToFirst = false) => {
  if (points.length === 0) {
    return;
  }

  const [firstPoint, ...remainingPoints] = points;
  commands.push(`${moveToFirst ? "M" : "L"} ${firstPoint.x} ${firstPoint.y}`);
  remainingPoints.forEach((point) => {
    commands.push(`L ${point.x} ${point.y}`);
  });
};

const buildRoundCapArcPath = (
  turnPoint: Point,
  startPoint: Point,
  endPoint: Point,
  radius: number
): string => {
  const startRadius = normalizeVector({
    x: startPoint.x - turnPoint.x,
    y: startPoint.y - turnPoint.y
  });
  const endRadius = normalizeVector({
    x: endPoint.x - turnPoint.x,
    y: endPoint.y - turnPoint.y
  });
  const startAngle = Math.atan2(startRadius.y, startRadius.x);
  const endAngle = Math.atan2(endRadius.y, endRadius.x);
  const clockwiseAngle = (endAngle - startAngle + Math.PI * 2) % (Math.PI * 2);
  const sweepFlag = clockwiseAngle <= Math.PI ? 0 : 1;

  return `A ${radius} ${radius} 0 0 ${sweepFlag} ${endPoint.x} ${endPoint.y}`;
};

const syncNextSectionHighlight = () => {
  if (!nextSectionEl || !preparedTracingPath) {
    return;
  }

  const currentGroup = tracingGroups[visibleGroupCount - 1];
  if (!currentGroup) {
    nextSectionEl.setAttribute("d", "");
    nextSectionEl.style.opacity = "0";
    return;
  }

  nextSectionEl.setAttribute(
    "d",
    buildPathDFromOverallDistanceRange(
      preparedTracingPath,
      currentGroup.startDistance,
      currentGroup.endDistance
    )
  );
  nextSectionEl.style.opacity = "1";
};

const getGroupStartTangent = (groupIndex: number): Point | null => {
  const group = tracingGroups[groupIndex];
  if (!group || !preparedTracingPath) {
    return null;
  }

  const sampleDistance = Math.min(group.endDistance, group.startDistance + 24);
  const samplePoint = getPointAtOverallDistance(preparedTracingPath, sampleDistance);
  const tangent = normalizeVector({
    x: samplePoint.x - group.startPoint.x,
    y: samplePoint.y - group.startPoint.y
  });

  if (Math.hypot(tangent.x, tangent.y) > 0.001) {
    return tangent;
  }

  return normalizeVector({
    x: group.endPoint.x - group.startPoint.x,
    y: group.endPoint.y - group.startPoint.y
  });
};

const advanceToNextTracingGroup = () => {
  visibleGroupCount = Math.min(visibleGroupCount + 1, tracingGroups.length);
  currentWaypointIndex = visibleGroupCount - 1 < waypointMarkers.length ? visibleGroupCount - 1 : null;
  updateWaypointMarker();
  syncFruitDisplay();
  resetSnakeMoveSoundProgress();
};

const maybePauseAtTracingGroupBoundary = (state: TracingState): boolean => {
  if (
    isDemoPlaying ||
    isSnakeSlithering ||
    isSnakeExitComplete ||
    isAwaitingSegmentRestart ||
    tracingGroups.length <= visibleGroupCount
  ) {
    return false;
  }

  const currentGroupIndex = visibleGroupCount - 1;
  const currentGroup = tracingGroups[currentGroupIndex];
  if (!currentGroup) {
    return false;
  }

  const overallDistance = getOverallDistanceForState(state);
  if (overallDistance < currentGroup.endDistance - 8) {
    return false;
  }

  isAwaitingSegmentRestart = true;
  snakeUnretractStartHeadDistance = null;
  snakeUnretractStartRetraction = 0;
  parkedBoundaryDistance = currentGroup.endDistance;
  queuedTurnTangent = getGroupStartTangent(currentGroupIndex + 1);
  if (queuedTurnTangent) {
    snakeHeadAngle = toAngle(queuedTurnTangent);
    appendSnakePose(currentGroup.endPoint, queuedTurnTangent, true);
  }

  advanceToNextTracingGroup();
  tracingSession?.end();
  syncSnakeRetractionToState();
  requestTraceRender();
  return true;
};

const createFruitTokens = (
  _preparedPath: PreparedTracingPath,
  groups: TracingGroup[]
): FruitToken[] => {
  return groups.slice(0, -1).map((group, groupIndex) => ({
    x: group.endPoint.x,
    y: group.endPoint.y,
    pathDistance: group.endDistance,
    emoji: FRUIT_EMOJI,
    captured: false,
    groupIndex
  }));
};

const resetFruitState = () => {
  visibleGroupCount = tracingGroups.length > 0 ? 1 : 0;
  currentWaypointIndex = waypointMarkers.length > 0 ? 0 : null;
  fruits.forEach((fruit) => {
    fruit.captured = false;
  });
  fruitEls.forEach((el) => {
    el.style.transition = "none";
    el.classList.remove("writing-app__fruit--captured");
    el.classList.remove("writing-app__fruit--hidden");
    void el.getBoundingClientRect();
    el.style.removeProperty("transition");
  });
  updateWaypointMarker();
  syncFruitDisplay();
};

const getCurrentBodyCount = () => {
  const maxByPath = Math.max(
    3,
    Math.min(MAX_SNAKE_BODY_SEGMENTS, Math.floor(currentPathLength / SNAKE_GROWTH_DISTANCE))
  );
  return Math.min(maxByPath, 1 + Math.floor(snakeHeadDistance / SNAKE_GROWTH_DISTANCE));
};

const syncSnakeRetractionToState = () => {
  if (isDemoPlaying || isSnakeSlithering || isSnakeExitComplete) {
    snakeUnretractStartHeadDistance = null;
    snakeUnretractStartRetraction = 0;
    return;
  }

  if (!isAwaitingSegmentRestart) {
    return;
  }

  const availableBodyCount = getVisibleSnakeSegments(
    snakeHeadDistance,
    getCurrentBodyCount(),
    SNAKE_SEGMENT_SPACING
  ).bodyCount;

  setSnakeRetractionTarget((availableBodyCount + 1) * SNAKE_SEGMENT_SPACING);
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
  groupEl.style.opacity = pose.visible ? "1" : "0";
};

const sampleSnakePoseAtDistance = (targetDistance: number): SnakePose => {
  const firstPose = snakeTrail[0] ?? {
    x: 0,
    y: 0,
    angle: 0,
    distance: 0,
    visible: true
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
      distance: targetDistance,
      visible: current.visible
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
  const availableBodyCount = isSnakeSlithering ? snakeExitBodyCount : getCurrentBodyCount();
  const retractionDistance = isSnakeSlithering ? 0 : snakeRetractionDistance;
  const segmentVisibility = getVisibleSnakeSegments(
    snakeHeadDistance,
    availableBodyCount,
    SNAKE_SEGMENT_SPACING
  );
  const bodyCount = segmentVisibility.bodyCount;
  const headPose = sampleSnakePoseAtDistance(snakeHeadDistance);
  snakeHeadImageEl.setAttribute("href", now < snakeChewUntil ? snakeHeadAltSprite : snakeHeadSprite);
  setSpritePose(
    snakeHeadEl,
    snakeHeadImageEl,
    {
      ...headPose,
      angle: snakeHeadAngle
    },
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

    const gapFromHead = Math.max(0, (index + 1) * SNAKE_SEGMENT_SPACING - retractionDistance);
    if (gapFromHead <= SNAKE_RETRACTION_HIDE_GAP) {
      el.style.opacity = "0";
      return;
    }

    const pose = sampleSnakePoseAtDistance(Math.max(0, snakeHeadDistance - gapFromHead));
    const bodySize =
      imageEl.getAttribute("href") === snakeBodyBulgeSprite ? BODY_BULGE_SIZE : BODY_SIZE;
    setSpritePose(
      el,
      imageEl,
      pose,
      bodySize.width,
      bodySize.height,
      bodySize.anchorX,
      bodySize.anchorY,
      bodySize.rotationOffset
    );
  });

  const tailImageEl = snakeTailEl.querySelector<SVGImageElement>("image");
  if (!tailImageEl) {
    return;
  }
  const tailGapFromHead = Math.max(0, (bodyCount + 1) * SNAKE_SEGMENT_SPACING - retractionDistance);
  if (!segmentVisibility.showTail || tailGapFromHead <= SNAKE_RETRACTION_HIDE_GAP) {
    snakeTailEl.style.opacity = "0";
    return;
  }
  const tailPose = sampleSnakePoseAtDistance(Math.max(0, snakeHeadDistance - tailGapFromHead));
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

const resetSnakeTrail = (point: Point, tangent: Point, visible = true) => {
  const direction = normalizeVector(tangent);
  snakeHeadAngle = toAngle(direction);
  snakeTrail = [
    {
      x: point.x,
      y: point.y,
      angle: snakeHeadAngle,
      distance: 0,
      visible
    }
  ];
  snakeHeadDistance = 0;
  snakeChewUntil = 0;
  snakeRetractionDistance = 0;
  snakeRetractionTarget = 0;
  snakeUnretractStartHeadDistance = null;
  snakeUnretractStartRetraction = 0;
  parkedBoundaryDistance = null;
  queuedTurnTangent = null;
  isAwaitingSegmentRestart = false;
  isSnakeExitComplete = false;
  isSnakeSlithering = false;
  snakeExitBodyCount = 0;
  cancelSnakeRetractionAnimation();
  if (snakeExitAnimationFrameId !== null) {
    cancelAnimationFrame(snakeExitAnimationFrameId);
    snakeExitAnimationFrameId = null;
  }
  renderSnake();
};

const appendSnakePose = (point: Point, tangent: Point, visible: boolean) => {
  const direction = normalizeVector(tangent);
  const angle = toAngle(direction);
  snakeHeadAngle = angle;
  const lastPose = snakeTrail[snakeTrail.length - 1];

  if (!lastPose) {
    resetSnakeTrail(point, direction, visible);
    return;
  }

  const step = Math.hypot(point.x - lastPose.x, point.y - lastPose.y);
  if (step < 0.5) {
    if (lastPose.visible === visible) {
      snakeTrail[snakeTrail.length - 1] = {
        ...lastPose,
        x: point.x,
        y: point.y,
        angle
      };
    } else {
      snakeTrail.push({
        x: point.x,
        y: point.y,
        angle,
        distance: lastPose.distance + 0.001,
        visible
      });
      snakeHeadDistance = lastPose.distance + 0.001;
    }
    renderSnake();
    return;
  }

  snakeHeadDistance = lastPose.distance + step;
  snakeTrail.push({
    x: point.x,
    y: point.y,
    angle,
    distance: snakeHeadDistance,
    visible
  });
  syncSnakeUnretractionFromMovement();
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

  cancelSnakeRetractionAnimation();
  snakeRetractionDistance = 0;
  snakeRetractionTarget = 0;
  snakeUnretractStartHeadDistance = null;
  snakeUnretractStartRetraction = 0;
  parkedBoundaryDistance = null;
  queuedTurnTangent = null;
  isAwaitingSegmentRestart = false;
  const direction = normalizeVector(tangent);
  const exitStartTime = performance.now();
  snakeExitBodyCount = getCurrentBodyCount();
  const totalTravelDistance = getExitTravelDistance(point, direction, snakeExitBodyCount);
  deferredExitHeads = completedDeferredHeads.map((head) => ({
    ...head,
    travelDistance: getExitTravelDistance(head.point, head.tangent, 0)
  }));
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
      direction,
      true
    );

    deferredExitHeads.forEach((head) => {
      const el = deferredTrailHeadEls.get(head.strokeIndex);
      if (!el) {
        return;
      }

      const headTravelled = Math.min(head.travelDistance, elapsedSeconds * SNAKE_EXIT_SPEED);
      renderDeferredSnake(el, {
        point: {
          x: head.point.x + head.tangent.x * headTravelled,
          y: head.point.y + head.tangent.y * headTravelled
        },
        tangent: head.tangent,
        angle: head.angle
      });
    });

    const deferredHeadsDone = deferredExitHeads.every(
      (head) => elapsedSeconds * SNAKE_EXIT_SPEED >= head.travelDistance
    );
    if (travelled >= totalTravelDistance && deferredHeadsDone) {
      isSnakeSlithering = false;
      isSnakeExitComplete = true;
      snakeExitAnimationFrameId = null;
      hideSnakeSprites();
      hideCompletedDeferredHeads();
      updateSuccessVisibility(true);
      return;
    }

    snakeExitAnimationFrameId = requestAnimationFrame(tick);
  };

  snakeExitAnimationFrameId = requestAnimationFrame(tick);
};

const captureFruitThroughDistance = (overallDistance: number) => {
  let changed = false;

  fruits.forEach((fruit, index) => {
    if (fruit.captured || fruit.groupIndex >= visibleGroupCount) {
      return;
    }

    if (overallDistance + 0.5 < fruit.pathDistance) {
      return;
    }

    fruit.captured = true;
    const fruitEl = fruitEls[index];
    if (fruitEl) {
      fruitEl.classList.add("writing-app__fruit--captured");
    }
    changed = true;
  });

  if (changed) {
    snakeChewUntil = performance.now() + SNAKE_CHEW_MS;
    playSnakeChompSound();
    syncFruitDisplay();
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

const syncSnakeToState = (state: TracingState) => {
  if (parkedBoundaryDistance !== null) {
    const overallDistance = getOverallDistanceForState(state);
    if (overallDistance + 0.5 < parkedBoundaryDistance) {
      renderSnake();
      return;
    }
    parkedBoundaryDistance = null;
  }

  const shouldUseQueuedTurn = queuedTurnTangent !== null && (isAwaitingSegmentRestart || state.isPenDown);
  const headTangent = shouldUseQueuedTurn && queuedTurnTangent ? queuedTurnTangent : state.cursorTangent;

  if (isDeferredStrokeActive(state)) {
    const parkedPose = getParkedSnakePose(state);
    const lastPose = snakeTrail[snakeTrail.length - 1];
    if (
      parkedPose &&
      (!lastPose || Math.hypot(lastPose.x - parkedPose.point.x, lastPose.y - parkedPose.point.y) > 0.5)
    ) {
      appendSnakePose(parkedPose.point, parkedPose.tangent, true);
    }
  } else {
    appendSnakePose(state.cursorPoint, headTangent, true);
  }

  // Keep the queued turn active until the restarted segment has been written into the trail.
  if (queuedTurnTangent && state.isPenDown && !isAwaitingSegmentRestart) {
    queuedTurnTangent = null;
  }

  if (!isDemoPlaying) {
    captureFruitThroughDistance(getOverallDistanceForState(state));
  }

  if (!isDemoPlaying && state.isPenDown) {
    maybePlaySnakeMoveSound(state);
    if (maybePauseAtTracingGroupBoundary(state)) {
      return;
    }
  }
};

const stopDemoAnimation = () => {
  if (demoAnimationFrameId !== null) {
    cancelAnimationFrame(demoAnimationFrameId);
    demoAnimationFrameId = null;
  }

  isDemoPlaying = false;
  showMeButton.disabled = false;
  showMeButton.textContent = "Demo";

  demoStrokeEls.forEach((el, index) => {
    const length = demoStrokeLengths[index] ?? 0.001;
    el.style.strokeDasharray = `${length} ${length}`;
    el.style.strokeDashoffset = `${length}`;
  });

  if (demoNibEl) {
    demoNibEl.style.opacity = "0";
  }

  syncFruitDisplay();
  renderSnake();
  requestTraceRender();
};

const resetRoundProgress = () => {
  tracingSession?.reset();
  activePointerId = null;
  activePointerPosition = null;
  updateSuccessVisibility(false);
  isSnakeExitComplete = false;
  isSnakeSlithering = false;
  snakeExitBodyCount = 0;
  completedDeferredHeads = [];
  completedDeferredHeadIndices = new Set<number>();
  deferredExitHeads = [];
  hideDotTarget();

  if (snakeExitAnimationFrameId !== null) {
    cancelAnimationFrame(snakeExitAnimationFrameId);
    snakeExitAnimationFrameId = null;
  }

  traceStrokeEls.forEach((el, index) => {
    const length = traceStrokeLengths[index] ?? 0.001;
    el.style.strokeDasharray = `${length} ${length}`;
    el.style.strokeDashoffset = `${length}`;
  });

  cancelSnakeRetractionAnimation();
  snakeRetractionDistance = 0;
  snakeRetractionTarget = 0;
  snakeUnretractStartHeadDistance = null;
  snakeUnretractStartRetraction = 0;
  parkedBoundaryDistance = null;
  queuedTurnTangent = null;
  isAwaitingSegmentRestart = false;
  const state = tracingSession?.getState();
  if (state) {
    resetSnakeTrail(state.cursorPoint, state.cursorTangent, true);
  } else {
    hideSnakeSprites();
  }
  hideCompletedDeferredHeads();

  resetFruitState();
  resetSnakeMoveSoundProgress();
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
  syncSnakeRetractionToState();
  registerCompletedDeferredHeads(state);
  syncDotTargetToState(state);
  renderDotTarget();
  renderDeferredHead(state);
  renderCompletedDeferredHeads();
  syncNextSectionHighlight();
  const completed = new Set(state.completedStrokes);

  traceStrokeEls.forEach((el, index) => {
    const length = traceStrokeLengths[index] ?? 0;
    if (completed.has(index) || isDotStrokeAnimating(index, state)) {
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

  if (!isDemoPlaying && !isSnakeSlithering && !isSnakeExitComplete && !isAwaitingSegmentRestart) {
    syncSnakeToState(state);
  } else {
    renderSnake();
  }

  if (state.status === "complete") {
    if (!isDemoPlaying && !isSnakeSlithering && !isSnakeExitComplete) {
      const exitPose = getSnakeExitPose(state);
      startSnakeExit(exitPose.point, exitPose.tangent);
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
    speed: 1.7 * SHOW_ME_SPEED_MULTIPLIER,
    penUpSpeed: 2.1 * SHOW_ME_SPEED_MULTIPLIER,
    deferredDelayMs: 150
  });

  isDemoPlaying = true;
  showMeButton.disabled = true;
  showMeButton.textContent = "Demo...";
  syncFruitDisplay();
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
  preparedTracingPath = preparedPath;
  drawablePathStrokes = path.strokes.filter((stroke) => stroke.type !== "lift");
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

  const drawableStrokes = drawablePathStrokes;
  const sectionArrowLength = Math.abs(path.guides.baseline - path.guides.xHeight) / 3;
  const backgroundPaths = tracingGroups
    .map(
      (group) =>
        `<path class="writing-app__stroke-bg" d="${buildPathDFromOverallDistanceRange(preparedPath, group.startDistance, group.endDistance)}"></path>`
    )
    .join("");
  const sectionArrowMarkup = tracingGroups
    .map((group, index) => {
      if (group.kind !== "retrace" || index === 0) {
        return "";
      }

      const previousGroup = tracingGroups[index - 1];
      if (!previousGroup) {
        return "";
      }

      const laneOffset = Math.min(sectionArrowLength * 0.24, 13);
      const stemLength = sectionArrowLength * 0.72;
      const incomingSamples = buildOffsetPathSamplesFromOverallDistanceRange(
        preparedPath,
        Math.max(previousGroup.startDistance, previousGroup.endDistance - stemLength),
        previousGroup.endDistance,
        laneOffset
      );
      const outgoingSamples = buildOffsetPathSamplesFromOverallDistanceRange(
        preparedPath,
        group.startDistance,
        Math.min(group.endDistance, group.startDistance + stemLength),
        laneOffset
      );

      if (incomingSamples.length === 0 || outgoingSamples.length === 0) {
        return "";
      }

      const incomingEndPose = getPoseAtOverallDistance(
        preparedPath,
        previousGroup.endDistance,
        "backward"
      );
      const outgoingStartPose = getPoseAtOverallDistance(
        preparedPath,
        group.startDistance,
        "forward"
      );
      const arcStart = offsetPosePoint(incomingEndPose, laneOffset);
      const arcEnd = offsetPosePoint(outgoingStartPose, laneOffset);
      const incomingPoints = incomingSamples.map((sample) => sample.point);
      const outgoingPoints = outgoingSamples.map((sample) => sample.point);
      incomingPoints[incomingPoints.length - 1] = arcStart;
      outgoingPoints[0] = arcEnd;
      const arcPath = buildRoundCapArcPath(
        group.startPoint,
        arcStart,
        arcEnd,
        laneOffset
      );
      const commands: string[] = [];
      appendPolylineCommands(commands, incomingPoints, true);
      commands.push(arcPath);
      appendPolylineCommands(commands, outgoingPoints.slice(1));
      const d = commands.join(" ");

      return `<path class="writing-app__section-arrow" d="${d}" marker-end="url(#section-arrowhead)"></path>`;
    })
    .join("");
  const tracePaths = drawableStrokes
    .map((stroke) => `<path class="writing-app__stroke-trace" d="${buildPathD(stroke.curves)}"></path>`)
    .join("");
  const demoPaths = drawableStrokes
    .map((stroke) => `<path class="writing-app__stroke-demo" d="${buildPathD(stroke.curves)}"></path>`)
    .join("");
  const snakeBodyMarkup = Array.from({ length: MAX_SNAKE_BODY_SEGMENTS }, (_, index) => {
    const bodyIndex = MAX_SNAKE_BODY_SEGMENTS - 1 - index;
    const bodySpriteHref =
      Math.random() < BULGE_BODY_SPRITE_CHANCE ? snakeBodyBulgeSprite : snakeBodySprite;
    return `
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${bodyIndex}"
      >
        <image
          href="${bodySpriteHref}"
          preserveAspectRatio="none"
        ></image>
      </g>
    `;
  }).join("");
  const deferredTrailHeadMarkup = drawableStrokes
    .map((stroke, index) => (stroke.deferred ? index : null))
    .filter((index): index is number => index !== null)
    .map(
      (strokeIndex) =>
        createDeferredSnakeMarkup(
          `class="writing-app__deferred-head writing-app__deferred-head--trail" data-deferred-trail-index="${strokeIndex}"`
        )
    )
    .join("");

  traceSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  traceSvg.innerHTML = `
    <defs>
      <marker
        class="writing-app__section-arrowhead"
        id="section-arrowhead"
        viewBox="0 0 12 10"
        markerWidth="4"
        markerHeight="2.8"
        refX="6.2"
        refY="5"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M 0 0 L 8.8 5 L 0 10 z"></path>
      </marker>
    </defs>
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
    ${tracePaths}
    <path class="writing-app__stroke-next" id="next-section-stroke" d=""></path>
    ${sectionArrowMarkup}
    ${demoPaths}
    <text
      class="writing-app__boundary-star"
      id="waypoint-star"
      x="0"
      y="0"
      text-anchor="middle"
      dominant-baseline="middle"
    >🍎</text>
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
    <g class="writing-app__deferred-heads" id="deferred-trail-heads">
      ${deferredTrailHeadMarkup}
    </g>
    ${createDeferredSnakeMarkup('class="writing-app__deferred-head" id="deferred-head"')}
    <g class="writing-app__dot-snake" id="dot-snake">
      <image
        id="dot-snake-image"
        href="${snakeFacingCameraHappySprite}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <g class="writing-app__eagle" id="dot-eagle">
      <image
        id="dot-eagle-image"
        href="${eagleFlySprite}"
        preserveAspectRatio="none"
      ></image>
    </g>
    <circle class="writing-app__nib" id="demo-nib" cx="0" cy="0" r="15"></circle>
  `;

  traceStrokeEls = Array.from(
    traceSvg.querySelectorAll<SVGPathElement>(".writing-app__stroke-trace")
  );
  nextSectionEl = traceSvg.querySelector<SVGPathElement>("#next-section-stroke");
  demoStrokeEls = Array.from(
    traceSvg.querySelectorAll<SVGPathElement>(".writing-app__stroke-demo")
  );
  fruitEls = Array.from(traceSvg.querySelectorAll<SVGTextElement>(".writing-app__fruit"));
  waypointEl = traceSvg.querySelector<SVGTextElement>("#waypoint-star");
  snakeLayerEl = traceSvg.querySelector<SVGGElement>("#trace-snake");
  snakeHeadEl = traceSvg.querySelector<SVGGElement>("#snake-head");
  snakeHeadImageEl = traceSvg.querySelector<SVGImageElement>("#snake-head-image");
  snakeTailEl = traceSvg.querySelector<SVGGElement>("#snake-tail");
  snakeBodyEls = Array.from(traceSvg.querySelectorAll<SVGGElement>(".writing-app__snake-body")).sort(
    (a, b) => Number(a.dataset.snakeBodyIndex) - Number(b.dataset.snakeBodyIndex)
  );
  deferredHeadEl = traceSvg.querySelector<SVGGElement>("#deferred-head");
  deferredTrailHeadEls = new Map(
    Array.from(
      traceSvg.querySelectorAll<SVGGElement>("[data-deferred-trail-index]")
    ).map((el) => [Number(el.dataset.deferredTrailIndex), el])
  );
  dotSnakeEl = traceSvg.querySelector<SVGGElement>("#dot-snake");
  dotSnakeImageEl = traceSvg.querySelector<SVGImageElement>("#dot-snake-image");
  eagleEl = traceSvg.querySelector<SVGGElement>("#dot-eagle");
  eagleImageEl = traceSvg.querySelector<SVGImageElement>("#dot-eagle-image");
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

  syncNextSectionHighlight();
  const initialState = tracingSession.getState();
  resetSnakeTrail(initialState.cursorPoint, initialState.cursorTangent);
  completedDeferredHeads = [];
  completedDeferredHeadIndices = new Set<number>();
  deferredExitHeads = [];
  hideDotTarget();
  hideCompletedDeferredHeads();
  resetFruitState();
  resetSnakeMoveSoundProgress();
  updateSuccessVisibility(false);
  requestTraceRender();
};

const renderWord = (word: string, wordIndex = -1) => {
  stopDemoAnimation();

  const layout = buildShiftedWordLayout(word, {
    keepInitialLeadIn: includeInitialLeadIn,
    keepFinalLeadOut: includeFinalLeadOut
  });
  currentWord = word;
  currentWordIndex = wordIndex;
  wordLabel.textContent = word;
  customWordInput.value = getCustomWordPrefillValue(word);
  currentPath = layout.path;
  setupScene(layout.path, layout.width, layout.height, layout.offsetY);
};

const loadWord = (word: string, wordIndex = -1): boolean => {
  const normalizedWord = normalizeWordInput(word);

  if (!normalizedWord) {
    setCustomWordError("Type a word first.");
    return false;
  }

  try {
    renderWord(normalizedWord, wordIndex);
    clearCustomWordError();
    return true;
  } catch {
    setCustomWordError("Couldn't build that word. Try letters supported by the cursive set.");
    return false;
  }
};

const goToNextWord = () => {
  let nextUrlWord = getNextUrlWord();
  while (nextUrlWord) {
    customWordPrefillMode = "nextQueued";
    if (loadWord(nextUrlWord)) {
      syncNextWordButtonLabel();
      return;
    }
    nextUrlWord = getNextUrlWord();
  }

  customWordPrefillMode = "current";
  const nextWordIndex = chooseNextWordIndex(currentWordIndex);
  void loadWord(WORDS[nextWordIndex] ?? WORDS[0], nextWordIndex);
  syncNextWordButtonLabel();
};

const onPointerDown = (event: PointerEvent) => {
  if (isDemoPlaying || !tracingSession || activePointerId !== null) {
    return;
  }

  const pointer = getPointerInSvg(traceSvg, event);
  const state = tracingSession.getState();
  const activePreparedStroke = getActivePreparedStroke(state);

  if (isDeferredStrokeActive(state) && !isPointerOnDeferredTarget(pointer, state)) {
    return;
  }

  if (isDeferredStrokeActive(state) && activePreparedStroke?.isDot) {
    event.preventDefault();
    startDotPickupAnimation();
    return;
  }

  const started = tracingSession.beginAt(pointer);
  if (!started) {
    return;
  }

  event.preventDefault();
  isAwaitingSegmentRestart = false;
  activePointerId = event.pointerId;
  activePointerPosition = pointer;
  warmSnakeChompSound();
  warmSnakeMoveSounds();
  if (snakeRetractionDistance > 0.5) {
    beginSnakeUnretractFromCurrentState();
  }
  traceSvg.setPointerCapture(event.pointerId);
  requestTraceRender();
};

const onPointerMove = (event: PointerEvent) => {
  if (isDemoPlaying || !tracingSession || event.pointerId !== activePointerId) {
    return;
  }

  event.preventDefault();
  activePointerPosition = getPointerInSvg(traceSvg, event);
  if (isAwaitingSegmentRestart) {
    maybeResumeContinuousDrag();
    requestTraceRender();
    return;
  }
  tracingSession.update(activePointerPosition);
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
  activePointerPosition = null;
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
  activePointerPosition = null;
  requestTraceRender();
};

traceSvg.addEventListener("pointerdown", onPointerDown);
traceSvg.addEventListener("pointermove", onPointerMove);
traceSvg.addEventListener("pointerup", onPointerUp);
traceSvg.addEventListener("pointercancel", onPointerCancel);
showMeButton.addEventListener("click", playDemo);
toleranceSlider.addEventListener("input", () => {
  currentTraceTolerance = Number(toleranceSlider.value);
  syncToleranceLabel();
  rerenderCurrentWord();
});
includeInitialLeadInInput.addEventListener("change", () => {
  includeInitialLeadIn = includeInitialLeadInInput.checked;
  rerenderCurrentWord();
});
includeFinalLeadOutInput.addEventListener("change", () => {
  includeFinalLeadOut = includeFinalLeadOutInput.checked;
  rerenderCurrentWord();
});
customWordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  customWordPrefillMode = "current";
  void loadWord(customWordInput.value);
});
nextWordButton.addEventListener("click", goToNextWord);
customWordInput.addEventListener("input", () => {
  if (!customWordError.hidden) {
    clearCustomWordError();
  }
});
document.addEventListener("pointerdown", (event) => {
  if (!settingsMenu.open) {
    return;
  }
  const target = event.target;
  if (target instanceof Node && settingsMenu.contains(target)) {
    return;
  }
  settingsMenu.open = false;
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    settingsMenu.open = false;
  }
});
syncToleranceLabel();
syncNextWordButtonLabel();
goToNextWord();
