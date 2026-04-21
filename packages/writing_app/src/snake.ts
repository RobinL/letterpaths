import "./style.css";
import {
  AnimationPlayer,
  TracingSession,
  analyzeTracingGroups,
  analyzeTracingSections,
  annotationCommandsToSvgPathData,
  compileFormationAnnotations,
  compileTracingPath,
  type AnimationFrame,
  type AnnotationArrowHead,
  type FormationAnnotation,
  type JoinSpacingOptions,
  type Point,
  type PreparedTracingPath,
  type PreparedStroke,
  type TracingGroup,
  type TracingSample,
  type TracingSection,
  type TracingState,
  type WritingPath
} from "letterpaths";
import eagleFlySprite from "./assets/snake/eagle_fly.png";
import eagleStandSprite from "./assets/snake/eagle_stand.png";
import chompSound from "./assets/snake/chomp.mp3";
import classicSnakeBodySprite from "./assets/snake/skins/classic/body.png";
import classicSnakeBodyBulgeSprite from "./assets/snake/skins/classic/body_bulge.png";
import classicSnakeBackgroundImage from "./assets/snake/skins/classic/background.png";
import classicSnakeFacingCameraAngrySprite from "./assets/snake/skins/classic/snake_facing_camera_angry.png";
import classicSnakeFacingCameraHappySprite from "./assets/snake/skins/classic/snake_facing_camera_happy.png";
import classicSnakeHeadAltSprite from "./assets/snake/skins/classic/head_alt.png";
import classicSnakeHeadSprite from "./assets/snake/skins/classic/head.png";
import classicSnakeTailSprite from "./assets/snake/skins/classic/tail.png";
import sandMoving1Sound from "./assets/snake/sand_moving_1.mp3";
import sandMoving2Sound from "./assets/snake/sand_moving_2.mp3";
import sandMoving3Sound from "./assets/snake/sand_moving_3.mp3";
import sandMoving4Sound from "./assets/snake/sand_moving_4.mp3";
import themeParkBackgroundImage from "./assets/snake/skins/theme-park/theme_park_bg.png";
import themeParkCarriageOneSprite from "./assets/snake/skins/theme-park/carriage_1.png";
import themeParkCarriageOneUpsideDownSprite from "./assets/snake/skins/theme-park/carriage_1_upside_down.png";
import themeParkCarriageTwoSprite from "./assets/snake/skins/theme-park/carriage_2.png";
import themeParkCarriageTwoUpsideDownSprite from "./assets/snake/skins/theme-park/carriage_2_upside_down.png";
import themeParkFrontSprite from "./assets/snake/skins/theme-park/front.png";
import themeParkFrontUpsideDownSprite from "./assets/snake/skins/theme-park/front_upside_down.png";
import themeParkRearSprite from "./assets/snake/skins/theme-park/rear.png";
import themeParkRearUpsideDownSprite from "./assets/snake/skins/theme-park/rear_upside_down.png";
import themeParkScreamSound from "./assets/snake/skins/theme-park/audio/rollercoaster_scream.mp3";
import themeParkTrackOneSound from "./assets/snake/skins/theme-park/audio/rollercoaster_track_1.mp3";
import themeParkTrackTwoSound from "./assets/snake/skins/theme-park/audio/rollercoaster_track_2.mp3";
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
const DEFAULT_SNAKE_SKIN_ID: SnakeSkinId = "classic";
const DEFAULT_ANIMATION_SPEED_MULTIPLIER = 0.7;
const SNAKE_SEGMENT_SPACING = 76;
const SNAKE_GROWTH_DISTANCE = 115;
const BULGE_BODY_SPRITE_CHANCE = 0.25;
const SNAKE_CHOMP_SOUND_VOLUME = 0.3;
const SNAKE_MOVE_SOUND_VOLUME = 0.12;
const SNAKE_MOVE_SOUND_CHANCE = 0.42;
const MAX_SNAKE_BODY_SEGMENTS = 10;
const SNAKE_CHEW_MS = 220;
const SNAKE_RETRACTION_SPEED = 700;
const SNAKE_RETRACTION_HIDE_GAP = 6;
const CLASSIC_DEFERRED_SEGMENT_SPACING = 44;
const THEME_PARK_DEFERRED_SEGMENT_SPACING = 56;
const CLASSIC_HEAD_SIZE = {
  width: 97.5,
  height: 60,
  anchorX: 0.5,
  anchorY: 0.5,
  rotationOffset: -10
} as const;
const CLASSIC_BODY_SIZE = {
  width: 106.25,
  height: 33.75,
  anchorX: 0.5,
  anchorY: 0.5,
  rotationOffset: 0
} as const;
const CLASSIC_BODY_BULGE_SIZE = {
  ...CLASSIC_BODY_SIZE,
  height: CLASSIC_BODY_SIZE.height * ((209 / 431) / (160 / 435))
} as const;
const CLASSIC_TAIL_SIZE = {
  width: 55,
  height: 33.75,
  anchorX: 0.5,
  anchorY: 0.5,
  rotationOffset: 0
} as const;
const CLASSIC_DOT_TARGET_SIZE = {
  width: 69,
  height: 49,
  anchorX: 0.5,
  anchorY: 0.62,
  rotationOffset: 0
} as const;
const THEME_PARK_FRONT_SIZE = {
  width: 94,
  height: 76.5,
  anchorX: 0.5,
  anchorY: 0.54,
  rotationOffset: 0
} as const;
const THEME_PARK_FRONT_UPSIDE_DOWN_SIZE = {
  ...THEME_PARK_FRONT_SIZE,
  height: 79.3
} as const;
const THEME_PARK_CARRIAGE_SIZE = {
  width: 100,
  height: 82.8,
  anchorX: 0.5,
  anchorY: 0.54,
  rotationOffset: 0
} as const;
const THEME_PARK_CARRIAGE_ONE_UPSIDE_DOWN_SIZE = {
  ...THEME_PARK_CARRIAGE_SIZE,
  height: 87.9
} as const;
const THEME_PARK_CARRIAGE_TWO_UPSIDE_DOWN_SIZE = {
  ...THEME_PARK_CARRIAGE_SIZE,
  height: 87.7
} as const;
const THEME_PARK_BACK_SIZE = {
  width: 92,
  height: 76.5,
  anchorX: 0.5,
  anchorY: 0.54,
  rotationOffset: 0
} as const;
const THEME_PARK_REAR_UPSIDE_DOWN_SIZE = {
  ...THEME_PARK_BACK_SIZE,
  height: 79.9
} as const;
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
const EAGLE_STAND_SIZE = {
  width: 128,
  height: 141,
  anchorX: 0.5,
  anchorY: 1
} as const;
const CLASSIC_SNAKE_MOVE_SOUND_SOURCES = [
  sandMoving1Sound,
  sandMoving2Sound,
  sandMoving3Sound,
  sandMoving4Sound
] as const;
const THEME_PARK_MOVE_SOUND_SOURCES = [
  themeParkTrackOneSound,
  themeParkTrackTwoSound
] as const;
const SECTION_ARROWHEAD_LENGTH = 26;
const SECTION_ARROWHEAD_WIDTH = 22;
const SECTION_ARROWHEAD_TIP_OVERHANG = 11;
const SNAKE_MIDPOINT_ARROW_DENSITY = 250;
const SECTION_ANNOTATION_DISTANCE_EPSILON = 0.5;
const SNAKE_TURN_COMMIT_DISTANCE = 12;
const SNAKE_TURN_LOOKAHEAD_DISTANCE = 2;
const DEFAULT_SNAKE_JOIN_SPACING = {
  targetBendRate: 16,
  minSidebearingGap: 80,
  bendSearchMinSidebearingGap: -30,
  bendSearchMaxSidebearingGap: 240,
  exitHandleScale: 0.75,
  entryHandleScale: 0.75
} as const satisfies Required<JoinSpacingOptions>;
const SNAKE_URL_PARAM_KEYS = [
  "skin",
  "theme",
  "tolerance",
  "animationSpeed",
  "turnRadius",
  "offsetArrowLanes",
  "targetBendRate",
  "minSidebearingGap",
  "bendSearchMinSidebearingGap",
  "bendSearchMaxSidebearingGap",
  "exitHandleScale",
  "entryHandleScale",
  "includeInitialLeadIn",
  "includeFinalLeadOut"
] as const;

type FruitToken = {
  x: number;
  y: number;
  pathDistance: number;
  emoji: string;
  captured: boolean;
  sectionIndex: number;
};

type SnakePose = {
  x: number;
  y: number;
  angle: number;
  distance: number;
  visible: boolean;
};

type SnakeLayerParts = {
  layerEl: SVGGElement;
  headEl: SVGGElement;
  headImageEl: SVGImageElement;
  bodyEls: SVGGElement[];
  tailEl: SVGGElement;
};

type RetiringSnake = {
  parts: SnakeLayerParts;
  trail: SnakePose[];
  headDistance: number;
  headAngle: number;
  bodyCount: number;
  segmentSpacing: number;
  retractionDistance: number;
  retractionTarget: number;
  showTail: boolean;
  animationFrameId: number | null;
};

type DotTargetPhase = "hidden" | "waiting" | "eagle_in" | "eagle_stand" | "eagle_out";

type SpriteMetrics = {
  width: number;
  height: number;
  anchorX: number;
  anchorY: number;
  rotationOffset: number;
};

type SpriteAsset = {
  href: string;
  metrics: SpriteMetrics;
  upsideDown?: SpriteAsset;
};

type BodySprite = SpriteAsset & {
  id: string;
};

type SnakeSkinId = "classic" | "themePark";

type SnakeSkin = {
  id: SnakeSkinId;
  boardImage: string;
  boardOverlay: string;
  instruction: string;
  successEyebrow: string;
  successCopy: string;
  soundEffects: {
    chompSrc: string;
    chompVolume: number;
    moveSrcs: readonly string[];
    moveVolume: number;
    moveChance: number;
  };
  segmentSpacing: number;
  deferredSegmentSpacing: number;
  head: {
    href: string;
    chewHref: string;
    metrics: SpriteMetrics;
    upsideDown?: SpriteAsset;
  };
  bodySprites: readonly BodySprite[];
  tail: SpriteAsset;
  dotTarget: {
    happyHref: string;
    angryHref: string;
    metrics: SpriteMetrics;
  };
};

const SNAKE_SKINS = {
  classic: {
    id: "classic",
    boardImage: classicSnakeBackgroundImage,
    boardOverlay: "linear-gradient(180deg, rgba(255, 252, 244, 0.72), rgba(255, 248, 235, 0.86))",
    instruction: "Drag the snake around the letters.",
    successEyebrow: "Snake fed!",
    successCopy: "All the fruit is collected.",
    soundEffects: {
      chompSrc: chompSound,
      chompVolume: SNAKE_CHOMP_SOUND_VOLUME,
      moveSrcs: CLASSIC_SNAKE_MOVE_SOUND_SOURCES,
      moveVolume: SNAKE_MOVE_SOUND_VOLUME,
      moveChance: SNAKE_MOVE_SOUND_CHANCE
    },
    segmentSpacing: SNAKE_SEGMENT_SPACING,
    deferredSegmentSpacing: CLASSIC_DEFERRED_SEGMENT_SPACING,
    head: {
      href: classicSnakeHeadSprite,
      chewHref: classicSnakeHeadAltSprite,
      metrics: CLASSIC_HEAD_SIZE
    },
    bodySprites: [
      {
        id: "body",
        href: classicSnakeBodySprite,
        metrics: CLASSIC_BODY_SIZE
      },
      {
        id: "body-bulge",
        href: classicSnakeBodyBulgeSprite,
        metrics: CLASSIC_BODY_BULGE_SIZE
      }
    ],
    tail: {
      href: classicSnakeTailSprite,
      metrics: CLASSIC_TAIL_SIZE
    },
    dotTarget: {
      happyHref: classicSnakeFacingCameraHappySprite,
      angryHref: classicSnakeFacingCameraAngrySprite,
      metrics: CLASSIC_DOT_TARGET_SIZE
    }
  },
  themePark: {
    id: "themePark",
    boardImage: themeParkBackgroundImage,
    boardOverlay: "linear-gradient(180deg, rgba(255, 255, 255, 0.64), rgba(255, 249, 230, 0.78))",
    instruction: "Drag the rollercoaster around the letters.",
    successEyebrow: "Ride complete!",
    successCopy: "All the fruit is collected.",
    soundEffects: {
      chompSrc: themeParkScreamSound,
      chompVolume: 0.2,
      moveSrcs: THEME_PARK_MOVE_SOUND_SOURCES,
      moveVolume: 0.1,
      moveChance: 0.36
    },
    segmentSpacing: 106,
    deferredSegmentSpacing: THEME_PARK_DEFERRED_SEGMENT_SPACING,
    head: {
      href: themeParkFrontSprite,
      chewHref: themeParkFrontSprite,
      metrics: THEME_PARK_FRONT_SIZE,
      upsideDown: {
        href: themeParkFrontUpsideDownSprite,
        metrics: THEME_PARK_FRONT_UPSIDE_DOWN_SIZE
      }
    },
    bodySprites: [
      {
        id: "carriage-1",
        href: themeParkCarriageOneSprite,
        metrics: THEME_PARK_CARRIAGE_SIZE,
        upsideDown: {
          href: themeParkCarriageOneUpsideDownSprite,
          metrics: THEME_PARK_CARRIAGE_ONE_UPSIDE_DOWN_SIZE
        }
      },
      {
        id: "carriage-2",
        href: themeParkCarriageTwoSprite,
        metrics: THEME_PARK_CARRIAGE_SIZE,
        upsideDown: {
          href: themeParkCarriageTwoUpsideDownSprite,
          metrics: THEME_PARK_CARRIAGE_TWO_UPSIDE_DOWN_SIZE
        }
      }
    ],
    tail: {
      href: themeParkRearSprite,
      metrics: THEME_PARK_BACK_SIZE,
      upsideDown: {
        href: themeParkRearUpsideDownSprite,
        metrics: THEME_PARK_REAR_UPSIDE_DOWN_SIZE
      }
    },
    dotTarget: {
      happyHref: themeParkFrontSprite,
      angryHref: themeParkFrontSprite,
      metrics: THEME_PARK_FRONT_SIZE
    }
  }
} as const satisfies Record<SnakeSkinId, SnakeSkin>;

let currentSnakeSkinId: SnakeSkinId = DEFAULT_SNAKE_SKIN_ID;

const getActiveSnakeSkin = (): SnakeSkin => SNAKE_SKINS[currentSnakeSkinId];

const getActiveSnakeSegmentSpacing = () => getActiveSnakeSkin().segmentSpacing;

const getActiveDeferredSnakeSegmentSpacing = (state: Pick<TracingState, "activeStrokeIndex">) => {
  const strokeLength = preparedTracingPath?.strokes[state.activeStrokeIndex]?.totalLength ?? 0;
  const maxSpacingForTail = strokeLength > 0 ? strokeLength / 3 : Number.POSITIVE_INFINITY;
  return Math.max(
    1,
    Math.min(getActiveSnakeSkin().deferredSegmentSpacing, maxSpacingForTail)
  );
};

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
            <p class="writing-app__eyebrow" id="snake-instruction">Drag the snake around the letters.</p>
            <h1 class="writing-app__word" id="word-label"></h1>
          </div>
          <div class="writing-app__topbar-actions">
            <button class="writing-app__button" id="show-me-button" type="button">
              Animate
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
                <label class="writing-app__settings-field" for="turn-radius-slider">
                  <span class="writing-app__settings-label">
                    Turn radius
                    <span class="writing-app__tolerance-value" id="turn-radius-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="turn-radius-slider"
                    type="range"
                    min="0"
                    max="48"
                    step="1"
                    value="13"
                  />
                </label>
                <label class="writing-app__settings-field" for="animation-speed-slider">
                  <span class="writing-app__settings-label">
                    Animation speed
                    <span class="writing-app__tolerance-value" id="animation-speed-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="animation-speed-slider"
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.05"
                    value="${DEFAULT_ANIMATION_SPEED_MULTIPLIER}"
                  />
                </label>
                <label class="writing-app__settings-toggle" for="offset-arrow-lanes">
                  <input
                    id="offset-arrow-lanes"
                    type="checkbox"
                  />
                  <span>Offset lanes</span>
                </label>
                <label class="writing-app__settings-toggle" for="theme-park-toggle">
                  <input
                    id="theme-park-toggle"
                    type="checkbox"
                  />
                  <span>Theme park</span>
                </label>
                <label class="writing-app__settings-field" for="target-bend-rate-slider">
                  <span class="writing-app__settings-label">
                    Target maximum bend rate
                    <span class="writing-app__tolerance-value" id="target-bend-rate-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="target-bend-rate-slider"
                    type="range"
                    min="0"
                    max="60"
                    step="1"
                    value="${DEFAULT_SNAKE_JOIN_SPACING.targetBendRate}"
                  />
                </label>
                <label class="writing-app__settings-field" for="min-sidebearing-gap-slider">
                  <span class="writing-app__settings-label">
                    Minimum sidebearing gap
                    <span class="writing-app__tolerance-value" id="min-sidebearing-gap-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="min-sidebearing-gap-slider"
                    type="range"
                    min="-300"
                    max="200"
                    step="5"
                    value="${DEFAULT_SNAKE_JOIN_SPACING.minSidebearingGap}"
                  />
                </label>
                <label class="writing-app__settings-field" for="bend-search-min-sidebearing-gap-slider">
                  <span class="writing-app__settings-label">
                    Search minimum sidebearing gap
                    <span class="writing-app__tolerance-value" id="bend-search-min-sidebearing-gap-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="bend-search-min-sidebearing-gap-slider"
                    type="range"
                    min="-300"
                    max="200"
                    step="5"
                    value="${DEFAULT_SNAKE_JOIN_SPACING.bendSearchMinSidebearingGap}"
                  />
                </label>
                <label class="writing-app__settings-field" for="bend-search-max-sidebearing-gap-slider">
                  <span class="writing-app__settings-label">
                    Search maximum sidebearing gap
                    <span class="writing-app__tolerance-value" id="bend-search-max-sidebearing-gap-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="bend-search-max-sidebearing-gap-slider"
                    type="range"
                    min="-100"
                    max="300"
                    step="5"
                    value="${DEFAULT_SNAKE_JOIN_SPACING.bendSearchMaxSidebearingGap}"
                  />
                </label>
                <label class="writing-app__settings-field" for="exit-handle-scale-slider">
                  <span class="writing-app__settings-label">
                    p0-p1 handle scale
                    <span class="writing-app__tolerance-value" id="exit-handle-scale-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="exit-handle-scale-slider"
                    type="range"
                    min="0"
                    max="2"
                    step="0.05"
                    value="${DEFAULT_SNAKE_JOIN_SPACING.exitHandleScale}"
                  />
                </label>
                <label class="writing-app__settings-field" for="entry-handle-scale-slider">
                  <span class="writing-app__settings-label">
                    p2-p3 handle scale
                    <span class="writing-app__tolerance-value" id="entry-handle-scale-value"></span>
                  </span>
                  <input
                    class="writing-app__tolerance-slider"
                    id="entry-handle-scale-slider"
                    type="range"
                    min="0"
                    max="2"
                    step="0.05"
                    value="${DEFAULT_SNAKE_JOIN_SPACING.entryHandleScale}"
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
            <p class="writing-app__success-eyebrow" id="success-eyebrow">Snake fed!</p>
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

const wordLabel = document.querySelector<HTMLHeadingElement>("#word-label");
const snakeInstruction = document.querySelector<HTMLParagraphElement>("#snake-instruction");
const successEyebrow = document.querySelector<HTMLParagraphElement>("#success-eyebrow");
const scoreSummary = document.querySelector<HTMLParagraphElement>("#score-summary");
const traceSvg = document.querySelector<SVGSVGElement>("#trace-svg");
const showMeButton = document.querySelector<HTMLButtonElement>("#show-me-button");
const settingsMenu = document.querySelector<HTMLDetailsElement>("#settings-menu");
const toleranceSlider = document.querySelector<HTMLInputElement>("#tolerance-slider");
const toleranceValue = document.querySelector<HTMLSpanElement>("#tolerance-value");
const turnRadiusSlider = document.querySelector<HTMLInputElement>("#turn-radius-slider");
const turnRadiusValue = document.querySelector<HTMLSpanElement>("#turn-radius-value");
const animationSpeedSlider = document.querySelector<HTMLInputElement>("#animation-speed-slider");
const animationSpeedValue = document.querySelector<HTMLSpanElement>("#animation-speed-value");
const offsetArrowLanesInput = document.querySelector<HTMLInputElement>("#offset-arrow-lanes");
const themeParkToggle = document.querySelector<HTMLInputElement>("#theme-park-toggle");
const targetBendRateSlider = document.querySelector<HTMLInputElement>("#target-bend-rate-slider");
const targetBendRateValue = document.querySelector<HTMLSpanElement>("#target-bend-rate-value");
const minSidebearingGapSlider = document.querySelector<HTMLInputElement>("#min-sidebearing-gap-slider");
const minSidebearingGapValue = document.querySelector<HTMLSpanElement>("#min-sidebearing-gap-value");
const bendSearchMinSidebearingGapSlider = document.querySelector<HTMLInputElement>(
  "#bend-search-min-sidebearing-gap-slider"
);
const bendSearchMinSidebearingGapValue = document.querySelector<HTMLSpanElement>(
  "#bend-search-min-sidebearing-gap-value"
);
const bendSearchMaxSidebearingGapSlider = document.querySelector<HTMLInputElement>(
  "#bend-search-max-sidebearing-gap-slider"
);
const bendSearchMaxSidebearingGapValue = document.querySelector<HTMLSpanElement>(
  "#bend-search-max-sidebearing-gap-value"
);
const exitHandleScaleSlider = document.querySelector<HTMLInputElement>("#exit-handle-scale-slider");
const exitHandleScaleValue = document.querySelector<HTMLSpanElement>("#exit-handle-scale-value");
const entryHandleScaleSlider = document.querySelector<HTMLInputElement>("#entry-handle-scale-slider");
const entryHandleScaleValue = document.querySelector<HTMLSpanElement>("#entry-handle-scale-value");
const includeInitialLeadInInput = document.querySelector<HTMLInputElement>("#include-initial-lead-in");
const includeFinalLeadOutInput = document.querySelector<HTMLInputElement>("#include-final-lead-out");
const successOverlay = document.querySelector<HTMLDivElement>("#success-overlay");
const customWordForm = document.querySelector<HTMLFormElement>("#custom-word-form");
const customWordInput = document.querySelector<HTMLInputElement>("#custom-word-input");
const customWordError = document.querySelector<HTMLParagraphElement>("#custom-word-error");
const nextWordButton = document.querySelector<HTMLButtonElement>("#next-word-button");
if (
  !wordLabel ||
  !snakeInstruction ||
  !successEyebrow ||
  !scoreSummary ||
  !traceSvg ||
  !showMeButton ||
  !settingsMenu ||
  !toleranceSlider ||
  !toleranceValue ||
  !turnRadiusSlider ||
  !turnRadiusValue ||
  !animationSpeedSlider ||
  !animationSpeedValue ||
  !offsetArrowLanesInput ||
  !themeParkToggle ||
  !targetBendRateSlider ||
  !targetBendRateValue ||
  !minSidebearingGapSlider ||
  !minSidebearingGapValue ||
  !bendSearchMinSidebearingGapSlider ||
  !bendSearchMinSidebearingGapValue ||
  !bendSearchMaxSidebearingGapSlider ||
  !bendSearchMaxSidebearingGapValue ||
  !exitHandleScaleSlider ||
  !exitHandleScaleValue ||
  !entryHandleScaleSlider ||
  !entryHandleScaleValue ||
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

const getSliderValuePrecision = (input: HTMLInputElement): number => {
  if (input.step === "any" || input.step.length === 0) {
    return 0;
  }

  const [, fractional = ""] = input.step.split(".");
  return fractional.length;
};

const normalizeSliderValue = (input: HTMLInputElement, value: number): number => {
  const min = Number(input.min);
  const max = Number(input.max);
  const step = input.step === "any" ? Number.NaN : Number(input.step);
  const base = Number.isFinite(min) ? min : 0;
  let nextValue = value;

  if (Number.isFinite(min)) {
    nextValue = Math.max(min, nextValue);
  }
  if (Number.isFinite(max)) {
    nextValue = Math.min(max, nextValue);
  }
  if (Number.isFinite(step) && step > 0) {
    nextValue = base + Math.round((nextValue - base) / step) * step;
  }
  if (Number.isFinite(min)) {
    nextValue = Math.max(min, nextValue);
  }
  if (Number.isFinite(max)) {
    nextValue = Math.min(max, nextValue);
  }

  return Number(nextValue.toFixed(getSliderValuePrecision(input)));
};

const syncSliderValue = (input: HTMLInputElement, value: number): number => {
  const normalizedValue = normalizeSliderValue(input, value);
  input.value = normalizedValue.toFixed(getSliderValuePrecision(input));
  return normalizedValue;
};

const parseBooleanSearchParam = (params: URLSearchParams, key: string): boolean | null => {
  const rawValue = params.get(key);
  if (rawValue === null) {
    return null;
  }

  const normalizedValue = rawValue.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalizedValue)) {
    return true;
  }
  if (["0", "false", "no", "off"].includes(normalizedValue)) {
    return false;
  }

  return null;
};

const parseSliderSearchParam = (
  params: URLSearchParams,
  key: string,
  input: HTMLInputElement
): number | null => {
  const rawValue = params.get(key);
  if (rawValue === null) {
    return null;
  }

  const parsedValue = Number(rawValue);
  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  return normalizeSliderValue(input, parsedValue);
};

const parseSnakeSkinSearchParam = (params: URLSearchParams): SnakeSkinId | null => {
  const rawValue = params.get("skin") ?? params.get("theme");
  if (rawValue === null) {
    return null;
  }

  const normalizedValue = rawValue.trim().toLowerCase();
  if (normalizedValue === "classic") {
    return "classic";
  }
  if (["themepark", "theme-park", "theme_park"].includes(normalizedValue)) {
    return "themePark";
  }

  return null;
};

const syncSettingsUrl = () => {
  const url = new URL(window.location.href);
  SNAKE_URL_PARAM_KEYS.forEach((key) => {
    url.searchParams.delete(key);
  });

  if (currentSnakeSkinId !== DEFAULT_SNAKE_SKIN_ID) {
    url.searchParams.set("skin", currentSnakeSkinId === "themePark" ? "theme-park" : "classic");
  }
  if (currentTraceTolerance !== DEFAULT_SNAKE_TRACE_TOLERANCE) {
    url.searchParams.set("tolerance", String(currentTraceTolerance));
  }
  if (currentAnimationSpeedMultiplier !== DEFAULT_ANIMATION_SPEED_MULTIPLIER) {
    url.searchParams.set("animationSpeed", String(currentAnimationSpeedMultiplier));
  }
  if (currentTurnRadius !== 13) {
    url.searchParams.set("turnRadius", String(currentTurnRadius));
  }
  if (shouldOffsetArrowLanes !== true) {
    url.searchParams.set("offsetArrowLanes", shouldOffsetArrowLanes ? "1" : "0");
  }
  if (currentJoinSpacing.targetBendRate !== DEFAULT_SNAKE_JOIN_SPACING.targetBendRate) {
    url.searchParams.set("targetBendRate", String(currentJoinSpacing.targetBendRate));
  }
  if (currentJoinSpacing.minSidebearingGap !== DEFAULT_SNAKE_JOIN_SPACING.minSidebearingGap) {
    url.searchParams.set("minSidebearingGap", String(currentJoinSpacing.minSidebearingGap));
  }
  if (
    currentJoinSpacing.bendSearchMinSidebearingGap !==
    DEFAULT_SNAKE_JOIN_SPACING.bendSearchMinSidebearingGap
  ) {
    url.searchParams.set(
      "bendSearchMinSidebearingGap",
      String(currentJoinSpacing.bendSearchMinSidebearingGap)
    );
  }
  if (
    currentJoinSpacing.bendSearchMaxSidebearingGap !==
    DEFAULT_SNAKE_JOIN_SPACING.bendSearchMaxSidebearingGap
  ) {
    url.searchParams.set(
      "bendSearchMaxSidebearingGap",
      String(currentJoinSpacing.bendSearchMaxSidebearingGap)
    );
  }
  if (currentJoinSpacing.exitHandleScale !== DEFAULT_SNAKE_JOIN_SPACING.exitHandleScale) {
    url.searchParams.set("exitHandleScale", String(currentJoinSpacing.exitHandleScale));
  }
  if (currentJoinSpacing.entryHandleScale !== DEFAULT_SNAKE_JOIN_SPACING.entryHandleScale) {
    url.searchParams.set("entryHandleScale", String(currentJoinSpacing.entryHandleScale));
  }
  if (includeInitialLeadIn !== true) {
    url.searchParams.set("includeInitialLeadIn", includeInitialLeadIn ? "1" : "0");
  }
  if (includeFinalLeadOut !== true) {
    url.searchParams.set("includeFinalLeadOut", includeFinalLeadOut ? "1" : "0");
  }

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (nextUrl !== currentUrl) {
    window.history.replaceState(null, "", nextUrl);
  }
};

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
let sectionAnnotationEl: SVGGElement | null = null;
let renderedSectionAnnotationSectionIndex: number | null = null;
let demoAnimationFrameId: number | null = null;
let isDemoPlaying = false;
let isDemoShortDeferredSnake = false;
let currentTraceTolerance = DEFAULT_SNAKE_TRACE_TOLERANCE;
let currentAnimationSpeedMultiplier = DEFAULT_ANIMATION_SPEED_MULTIPLIER;
let currentTurnRadius = 13;
let shouldOffsetArrowLanes = false;
let currentJoinSpacing: Required<JoinSpacingOptions> = { ...DEFAULT_SNAKE_JOIN_SPACING };
let includeInitialLeadIn = true;
let includeFinalLeadOut = true;
let fruits: FruitToken[] = [];
let fruitEls: SVGTextElement[] = [];
let tracingGroups: TracingGroup[] = [];
let tracingSections: TracingSection[] = [];
let visibleSectionCount = 1;
let waypointEl: SVGTextElement | null = null;
let currentSceneWidth = 1600;
let currentPathLength = 0;
let preparedTracingPath: PreparedTracingPath | null = null;
let drawablePathStrokes: WritingPath["strokes"] = [];
let snakeLayerEl: SVGGElement | null = null;
let snakeHeadEl: SVGGElement | null = null;
let snakeHeadImageEl: SVGImageElement | null = null;
let snakeBodyEls: SVGGElement[] = [];
let snakeTailEl: SVGGElement | null = null;
let dotSnakeEl: SVGGElement | null = null;
let dotSnakeImageEl: SVGImageElement | null = null;
let eagleEl: SVGGElement | null = null;
let eagleImageEl: SVGImageElement | null = null;
let snakeTrail: SnakePose[] = [];
let snakeHeadDistance = 0;
let snakeGrowthDistance = 0;
let snakeHeadAngle = 0;
let snakeChewUntil = 0;
let retiringSnakes: RetiringSnake[] = [];
let isCompletionRetractionPending = false;
let dotTargetAnimationFrameId: number | null = null;
let dotTargetPhase: DotTargetPhase = "hidden";
let dotTargetStrokeIndex: number | null = null;
let dotTargetPoint: Point | null = null;
let dotTargetPhaseStartedAt = 0;
let queuedRestartAllowsContinuousDrag = false;
let isAwaitingSegmentRestart = false;
let snakeChompSoundPlayer: HTMLAudioElement | null = null;
let snakeChompSoundSkinId: SnakeSkinId | null = null;
let activeSnakeChompSounds: HTMLAudioElement[] = [];
let snakeChompSoundWarmed = false;
let snakeMoveSoundPlayers: HTMLAudioElement[] | null = null;
let snakeMoveSoundSkinId: SnakeSkinId | null = null;
let activeSnakeMoveSounds: HTMLAudioElement[] = [];
let snakeMoveSoundsWarmed = false;
let snakeMoveSoundSectionIndex = -1;
let nextSnakeMoveSoundDistance = Number.POSITIVE_INFINITY;

const syncToleranceLabel = () => {
  toleranceValue.textContent = `${currentTraceTolerance}px`;
};

const syncTurnRadiusLabel = () => {
  turnRadiusValue.textContent = `${currentTurnRadius}px`;
};

const syncAnimationSpeedLabel = () => {
  animationSpeedValue.textContent = `${currentAnimationSpeedMultiplier.toFixed(2)}x`;
};

const syncJoinSpacingLabels = () => {
  targetBendRateValue.textContent = `${currentJoinSpacing.targetBendRate}`;
  minSidebearingGapValue.textContent = `${currentJoinSpacing.minSidebearingGap}`;
  bendSearchMinSidebearingGapValue.textContent = `${currentJoinSpacing.bendSearchMinSidebearingGap}`;
  bendSearchMaxSidebearingGapValue.textContent = `${currentJoinSpacing.bendSearchMaxSidebearingGap}`;
  exitHandleScaleValue.textContent = currentJoinSpacing.exitHandleScale.toFixed(2);
  entryHandleScaleValue.textContent = currentJoinSpacing.entryHandleScale.toFixed(2);
};

const syncSettingsControlsFromState = () => {
  currentTraceTolerance = syncSliderValue(toleranceSlider, currentTraceTolerance);
  currentAnimationSpeedMultiplier = syncSliderValue(
    animationSpeedSlider,
    currentAnimationSpeedMultiplier
  );
  currentTurnRadius = syncSliderValue(turnRadiusSlider, currentTurnRadius);
  shouldOffsetArrowLanes = Boolean(shouldOffsetArrowLanes);
  offsetArrowLanesInput.checked = shouldOffsetArrowLanes;
  currentJoinSpacing = {
    targetBendRate: syncSliderValue(targetBendRateSlider, currentJoinSpacing.targetBendRate),
    minSidebearingGap: syncSliderValue(minSidebearingGapSlider, currentJoinSpacing.minSidebearingGap),
    bendSearchMinSidebearingGap: syncSliderValue(
      bendSearchMinSidebearingGapSlider,
      currentJoinSpacing.bendSearchMinSidebearingGap
    ),
    bendSearchMaxSidebearingGap: syncSliderValue(
      bendSearchMaxSidebearingGapSlider,
      currentJoinSpacing.bendSearchMaxSidebearingGap
    ),
    exitHandleScale: syncSliderValue(exitHandleScaleSlider, currentJoinSpacing.exitHandleScale),
    entryHandleScale: syncSliderValue(entryHandleScaleSlider, currentJoinSpacing.entryHandleScale)
  };
  includeInitialLeadInInput.checked = includeInitialLeadIn;
  includeFinalLeadOutInput.checked = includeFinalLeadOut;
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

const applyUrlSettings = () => {
  const params = new URLSearchParams(window.location.search);

  currentSnakeSkinId = parseSnakeSkinSearchParam(params) ?? currentSnakeSkinId;
  currentTraceTolerance =
    parseSliderSearchParam(params, "tolerance", toleranceSlider) ?? currentTraceTolerance;
  currentAnimationSpeedMultiplier =
    parseSliderSearchParam(params, "animationSpeed", animationSpeedSlider) ??
    currentAnimationSpeedMultiplier;
  currentTurnRadius =
    parseSliderSearchParam(params, "turnRadius", turnRadiusSlider) ?? currentTurnRadius;
  shouldOffsetArrowLanes =
    parseBooleanSearchParam(params, "offsetArrowLanes") ?? shouldOffsetArrowLanes;
  currentJoinSpacing = {
    targetBendRate:
      parseSliderSearchParam(params, "targetBendRate", targetBendRateSlider) ??
      currentJoinSpacing.targetBendRate,
    minSidebearingGap:
      parseSliderSearchParam(params, "minSidebearingGap", minSidebearingGapSlider) ??
      currentJoinSpacing.minSidebearingGap,
    bendSearchMinSidebearingGap:
      parseSliderSearchParam(
        params,
        "bendSearchMinSidebearingGap",
        bendSearchMinSidebearingGapSlider
      ) ?? currentJoinSpacing.bendSearchMinSidebearingGap,
    bendSearchMaxSidebearingGap:
      parseSliderSearchParam(
        params,
        "bendSearchMaxSidebearingGap",
        bendSearchMaxSidebearingGapSlider
      ) ?? currentJoinSpacing.bendSearchMaxSidebearingGap,
    exitHandleScale:
      parseSliderSearchParam(params, "exitHandleScale", exitHandleScaleSlider) ??
      currentJoinSpacing.exitHandleScale,
    entryHandleScale:
      parseSliderSearchParam(params, "entryHandleScale", entryHandleScaleSlider) ??
      currentJoinSpacing.entryHandleScale
  };
  includeInitialLeadIn =
    parseBooleanSearchParam(params, "includeInitialLeadIn") ?? includeInitialLeadIn;
  includeFinalLeadOut =
    parseBooleanSearchParam(params, "includeFinalLeadOut") ?? includeFinalLeadOut;

  syncSettingsControlsFromState();
  syncToleranceLabel();
  syncAnimationSpeedLabel();
  syncTurnRadiusLabel();
  syncJoinSpacingLabels();
  syncSnakeSkinPresentation();
  syncSettingsUrl();
};

const syncNextWordButtonLabel = () => {
  nextWordButton.textContent =
    nextUrlWordIndex < urlWordSequence.length ? "Next queued word" : "Next random word";
};

const syncSnakeSkinPresentation = () => {
  const skin = getActiveSnakeSkin();
  app.style.setProperty("--snake-board-image", `url("${skin.boardImage}")`);
  app.style.setProperty("--snake-board-overlay", skin.boardOverlay);
  snakeInstruction.textContent = skin.instruction;
  successEyebrow.textContent = skin.successEyebrow;
  themeParkToggle.checked = skin.id === "themePark";
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

const getActiveSnakeSoundEffects = () => getActiveSnakeSkin().soundEffects;

const ensureSnakeMoveSoundPlayers = () => {
  const skin = getActiveSnakeSkin();
  const soundEffects = skin.soundEffects;
  if (snakeMoveSoundPlayers && snakeMoveSoundSkinId === skin.id) {
    return snakeMoveSoundPlayers;
  }

  snakeMoveSoundPlayers = soundEffects.moveSrcs.map((src) => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = soundEffects.moveVolume;
    return audio;
  });
  snakeMoveSoundSkinId = skin.id;
  snakeMoveSoundsWarmed = false;
  return snakeMoveSoundPlayers;
};

const ensureSnakeChompSoundPlayer = () => {
  const skin = getActiveSnakeSkin();
  const soundEffects = skin.soundEffects;
  if (snakeChompSoundPlayer && snakeChompSoundSkinId === skin.id) {
    return snakeChompSoundPlayer;
  }

  snakeChompSoundPlayer = new Audio(soundEffects.chompSrc);
  snakeChompSoundPlayer.preload = "auto";
  snakeChompSoundPlayer.volume = soundEffects.chompVolume;
  snakeChompSoundSkinId = skin.id;
  snakeChompSoundWarmed = false;
  return snakeChompSoundPlayer;
};

const warmSnakeChompSound = () => {
  const player = ensureSnakeChompSoundPlayer();
  if (snakeChompSoundWarmed) {
    return;
  }

  player.load();
  snakeChompSoundWarmed = true;
};

const warmSnakeMoveSounds = () => {
  const players = ensureSnakeMoveSoundPlayers();
  if (snakeMoveSoundsWarmed) {
    return;
  }

  players.forEach((audio) => {
    audio.load();
  });
  snakeMoveSoundsWarmed = true;
};

const playSnakeChompSound = () => {
  const soundEffects = getActiveSnakeSoundEffects();
  const template = ensureSnakeChompSoundPlayer();
  const src = template.currentSrc || template.src;
  if (!src) {
    return;
  }

  const player = new Audio(src);
  player.preload = "auto";
  player.currentTime = 0;
  player.volume = soundEffects.chompVolume;
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
  const soundEffects = getActiveSnakeSoundEffects();
  const players = ensureSnakeMoveSoundPlayers();
  const template = players[Math.floor(Math.random() * players.length)];
  const src = template?.currentSrc || template?.src;
  if (!src) {
    return;
  }

  const player = new Audio(src);
  player.preload = "auto";
  player.currentTime = 0;
  player.volume = soundEffects.moveVolume;
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
  const sectionIndex = visibleSectionCount > 0 ? visibleSectionCount - 1 : -1;
  const section = sectionIndex >= 0 ? tracingSections[sectionIndex] : null;

  snakeMoveSoundSectionIndex = sectionIndex;
  nextSnakeMoveSoundDistance = section
    ? section.startDistance + getActiveSnakeSegmentSpacing()
    : Number.POSITIVE_INFINITY;
};

const maybePlaySnakeMoveSound = (
  state: Pick<TracingState, "status" | "activeStrokeIndex" | "activeStrokeProgress" | "isPenDown">
) => {
  if (!state.isPenDown || isDemoPlaying || isAwaitingSegmentRestart) {
    return;
  }

  const sectionIndex = visibleSectionCount > 0 ? visibleSectionCount - 1 : -1;
  const section = sectionIndex >= 0 ? tracingSections[sectionIndex] : null;
  if (!section) {
    nextSnakeMoveSoundDistance = Number.POSITIVE_INFINITY;
    snakeMoveSoundSectionIndex = sectionIndex;
    return;
  }

  if (sectionIndex !== snakeMoveSoundSectionIndex) {
    resetSnakeMoveSoundProgress();
  }

  const overallDistance = getOverallDistanceForState(state);
  let shouldPlay = false;
  while (
    overallDistance >= nextSnakeMoveSoundDistance &&
    nextSnakeMoveSoundDistance <= section.endDistance
  ) {
    if (Math.random() < getActiveSnakeSoundEffects().moveChance) {
      shouldPlay = true;
    }
    nextSnakeMoveSoundDistance += getActiveSnakeSegmentSpacing();
  }

  if (shouldPlay) {
    playRandomSnakeMoveSound();
  }
};

const syncFruitDisplay = () => {
  const hideFruit = isDemoPlaying;

  fruitEls.forEach((el) => {
    const fruit = fruits[Number(el.dataset.fruitIndex)];
    const shouldHide =
      hideFruit || !fruit || fruit.captured || fruit.sectionIndex >= visibleSectionCount;
    el.classList.toggle("writing-app__fruit--captured", Boolean(fruit?.captured));
    el.classList.toggle("writing-app__fruit--hidden", shouldHide);
  });
  scoreSummary.textContent =
    fruits.length === 0 ? "Nice tracing." : getActiveSnakeSkin().successCopy;
};

const updateSuccessVisibility = (isVisible: boolean) => {
  successOverlay.hidden = !isVisible;
};

const maybeShowCompletionSuccess = () => {
  const state = tracingSession?.getState();
  if (state?.status !== "complete" || !isCompletionRetractionPending) {
    return;
  }

  if (retiringSnakes.length > 0) {
    updateSuccessVisibility(false);
    return;
  }

  updateSuccessVisibility(true);
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

const normalizeAngleDegrees = (angle: number): number => ((angle % 360) + 360) % 360;

const isUpsideDownAngle = (angle: number): boolean => {
  const normalizedAngle = normalizeAngleDegrees(angle);
  return normalizedAngle > 90 && normalizedAngle < 270;
};

const resolveSpriteAssetForPose = (asset: SpriteAsset, poseAngle: number): SpriteAsset => {
  if (!asset.upsideDown || !isUpsideDownAngle(poseAngle + asset.metrics.rotationOffset)) {
    return asset;
  }

  return asset.upsideDown;
};

const getSnakeLayerParts = (layerEl: SVGGElement): SnakeLayerParts | null => {
  const headEl = layerEl.querySelector<SVGGElement>(".writing-app__snake-head");
  const headImageEl = headEl?.querySelector<SVGImageElement>("image") ?? null;
  const tailEl = layerEl.querySelector<SVGGElement>(".writing-app__snake-tail");
  const bodyEls = Array.from(layerEl.querySelectorAll<SVGGElement>(".writing-app__snake-body")).sort(
    (a, b) => Number(a.dataset.snakeBodyIndex) - Number(b.dataset.snakeBodyIndex)
  );

  if (!headEl || !headImageEl || !tailEl) {
    return null;
  }

  return {
    layerEl,
    headEl,
    headImageEl,
    bodyEls,
    tailEl
  };
};

const getActiveSnakeLayerParts = (): SnakeLayerParts | null => {
  if (!snakeLayerEl || !snakeHeadEl || !snakeHeadImageEl || !snakeTailEl) {
    return null;
  }

  return {
    layerEl: snakeLayerEl,
    headEl: snakeHeadEl,
    headImageEl: snakeHeadImageEl,
    bodyEls: snakeBodyEls,
    tailEl: snakeTailEl
  };
};

const stripElementIds = (rootEl: Element) => {
  rootEl.removeAttribute("id");
  rootEl.querySelectorAll("[id]").forEach((el) => {
    el.removeAttribute("id");
  });
};

const clearSegmentRestartState = () => {
  queuedRestartAllowsContinuousDrag = false;
  isAwaitingSegmentRestart = false;
};

const maybeResumeContinuousDrag = () => {
  if (
    !isAwaitingSegmentRestart ||
    !queuedRestartAllowsContinuousDrag ||
    activePointerId === null ||
    !activePointerPosition ||
    !tracingSession
  ) {
    return false;
  }

  const resumeState = tracingSession.getState();
  const started =
    resumeState.status === "tracing" || tracingSession.beginAt(resumeState.cursorPoint);
  if (!started) {
    return false;
  }

  clearSegmentRestartState();
  tracingSession.update(activePointerPosition);
  requestTraceRender();
  return true;
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

const getOverallDistanceForDemoFrame = (frame: AnimationFrame): number => {
  const preparedPath = preparedTracingPath;
  if (!preparedPath) {
    return 0;
  }

  if (frame.isPenDown && frame.activeStrokeIndex >= 0) {
    return getOverallDistanceForState({
      status: "tracing",
      activeStrokeIndex: frame.activeStrokeIndex,
      activeStrokeProgress: frame.activeStrokeProgress
    });
  }

  return frame.completedStrokes.reduce(
    (total, strokeIndex) => total + (preparedPath.strokes[strokeIndex]?.totalLength ?? 0),
    0
  );
};

const getCommittedSnakeTangent = (state: TracingState): Point => {
  if (!preparedTracingPath) {
    return state.cursorTangent;
  }

  const overallDistance = getOverallDistanceForState(state);
  const activeTurnBoundary = [...preparedTracingPath.boundaries]
    .reverse()
    .find(
      (boundary) =>
        boundary.previousSegment !== boundary.nextSegment &&
        boundary.turnAngleDegrees >= 150 &&
        overallDistance >= boundary.overallDistance - SNAKE_TURN_LOOKAHEAD_DISTANCE &&
        overallDistance - boundary.overallDistance < SNAKE_TURN_COMMIT_DISTANCE
    );

  return activeTurnBoundary?.outgoingTangent ?? state.cursorTangent;
};

const isDeferredStrokeActive = (state: Pick<TracingState, "activeStrokeIndex">): boolean =>
  getActiveDrawableStroke(state)?.deferred === true;

const isSectionDeferred = (section: TracingSection): boolean =>
  drawablePathStrokes[section.strokeIndex]?.deferred === true;

const getCurrentTracingSection = (): TracingSection | null => {
  const sectionIndex = visibleSectionCount > 0 ? visibleSectionCount - 1 : -1;
  return sectionIndex >= 0 ? tracingSections[sectionIndex] ?? null : null;
};

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

  const skin = getActiveSnakeSkin();
  const snakeBasePoint = getDotSnakeBasePoint(dotTargetPoint);
  const standPoint = getEagleStandPoint(dotTargetPoint);

  if (dotTargetPhase === "waiting") {
    return {
      snakePoint: snakeBasePoint,
      snakeHref: skin.dotTarget.happyHref,
      snakeWobble: true
    };
  }

  if (dotTargetPhase === "eagle_in") {
    const progress = Math.max(0, Math.min(1, (now - dotTargetPhaseStartedAt) / EAGLE_FLY_MS));
    const eased = 1 - (1 - progress) * (1 - progress);
    return {
      snakePoint: snakeBasePoint,
      snakeHref: skin.dotTarget.happyHref,
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
      snakeHref: skin.dotTarget.happyHref,
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
    snakeHref: skin.dotTarget.angryHref,
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
    maybePauseAtTracingSectionBoundary(nextState);
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

  const dotTargetMetrics = getActiveSnakeSkin().dotTarget.metrics;
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
    dotTargetMetrics.width,
    dotTargetMetrics.height,
    dotTargetMetrics.anchorX,
    dotTargetMetrics.anchorY,
    dotTargetMetrics.rotationOffset
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
    const dotTargetMetrics = getActiveSnakeSkin().dotTarget.metrics;
    const hitRadius =
      Math.max(dotTargetMetrics.width, dotTargetMetrics.height) * DOT_TARGET_HIT_RADIUS_MULTIPLIER;
    return Math.hypot(point.x - scene.snakePoint.x, point.y - scene.snakePoint.y) <= hitRadius;
  }

  const hitRadius = Math.max(34, getActiveSnakeSkin().head.metrics.width * 0.52);
  return Math.hypot(point.x - deferredHead.point.x, point.y - deferredHead.point.y) <= hitRadius;
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

const buildTracingSectionPathD = (
  preparedPath: PreparedTracingPath,
  section: TracingSection,
  strokes: WritingPath["strokes"]
): string => {
  const preparedStroke = preparedPath.strokes[section.strokeIndex];
  const drawableStroke = strokes[section.strokeIndex];

  if (preparedStroke?.isDot && drawableStroke) {
    return buildPathD(drawableStroke.curves);
  }

  return buildPathDFromOverallDistanceRange(
    preparedPath,
    section.startDistance,
    section.endDistance
  );
};

const buildSvgPoints = (points: Point[]): string =>
  points.map((point) => `${point.x} ${point.y}`).join(" ");

const getSectionAnnotationClassName = (annotation: FormationAnnotation): string =>
  `writing-app__section-arrow writing-app__section-arrow--white writing-app__section-arrow--${annotation.kind}`;

const getSectionAnnotationHeads = (annotation: FormationAnnotation): AnnotationArrowHead[] =>
  ["head" in annotation ? annotation.head : undefined, "tailHead" in annotation ? annotation.tailHead : undefined].filter(
    (head): head is AnnotationArrowHead => head !== undefined
  );

const renderSectionAnnotationMarkup = (annotation: FormationAnnotation): string => {
  if (annotation.kind === "draw-order-number") {
    return "";
  }

  return `
    <path
      class="${getSectionAnnotationClassName(annotation)}"
      d="${annotationCommandsToSvgPathData(annotation.commands)}"
    ></path>
    ${getSectionAnnotationHeads(annotation)
      .map(
        (head) =>
          `<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--white writing-app__section-arrowhead--${annotation.kind}" points="${buildSvgPoints(head.polygon)}"></polygon>`
      )
      .join("")}
  `;
};

const syncCurrentSectionAnnotations = () => {
  if (!sectionAnnotationEl || !preparedTracingPath || !currentPath) {
    return;
  }

  const currentSection = getCurrentTracingSection();
  if (!currentSection) {
    renderedSectionAnnotationSectionIndex = null;
    sectionAnnotationEl.innerHTML = "";
    return;
  }

  if (renderedSectionAnnotationSectionIndex === currentSection.index) {
    return;
  }

  const sectionArrowLength = Math.abs(currentPath.guides.baseline - currentPath.guides.xHeight) / 3;
  const arrowLaneOffset = shouldOffsetArrowLanes ? currentTurnRadius : 0;
  const annotations = compileFormationAnnotations(preparedTracingPath, {
    sections: [currentSection],
    drawOrderNumbers: false,
    startArrows: {
      length: sectionArrowLength * 0.42,
      minLength: sectionArrowLength * 0.18,
      offset: arrowLaneOffset,
      head: {
        length: SECTION_ARROWHEAD_LENGTH,
        width: SECTION_ARROWHEAD_WIDTH,
        tipExtension: SECTION_ARROWHEAD_TIP_OVERHANG
      }
    },
    midpointArrows: {
      density: SNAKE_MIDPOINT_ARROW_DENSITY,
      length: sectionArrowLength * 0.36,
      offset: arrowLaneOffset,
      head: {
        length: SECTION_ARROWHEAD_LENGTH,
        width: SECTION_ARROWHEAD_WIDTH,
        tipExtension: SECTION_ARROWHEAD_TIP_OVERHANG
      }
    },
    turningPoints: {
      offset: currentTurnRadius,
      stemLength: sectionArrowLength * 0.36,
      head: {
        length: SECTION_ARROWHEAD_LENGTH,
        width: SECTION_ARROWHEAD_WIDTH,
        tipExtension: SECTION_ARROWHEAD_TIP_OVERHANG
      },
      groups: tracingGroups
    }
  }).filter(
    (annotation) =>
      annotation.kind !== "turning-point" ||
      Math.abs(annotation.source.turnDistance - currentSection.endDistance) <=
      SECTION_ANNOTATION_DISTANCE_EPSILON
  );

  sectionAnnotationEl.innerHTML = annotations.map(renderSectionAnnotationMarkup).join("");
  renderedSectionAnnotationSectionIndex = currentSection.index;
};

const syncNextSectionHighlight = () => {
  if (!nextSectionEl || !preparedTracingPath) {
    return;
  }

  const currentSection = getCurrentTracingSection();
  if (!currentSection) {
    nextSectionEl.setAttribute("d", "");
    nextSectionEl.style.opacity = "0";
    return;
  }

  nextSectionEl.setAttribute(
    "d",
    buildTracingSectionPathD(preparedTracingPath, currentSection, drawablePathStrokes)
  );
  nextSectionEl.style.opacity = "1";
};

const advanceToNextTracingSection = () => {
  visibleSectionCount = Math.min(visibleSectionCount + 1, tracingSections.length);
  updateWaypointMarker();
  syncFruitDisplay();
  syncCurrentSectionAnnotations();
  resetSnakeMoveSoundProgress();
};

const getTracingSectionBoundaryTolerance = (
  currentSection: TracingSection,
  nextSection: TracingSection
) => {
  const sectionLength = currentSection.endDistance - currentSection.startDistance;
  return nextSection.startReason === "stroke-start"
    ? 0.1
    : Math.min(8, Math.max(0.1, sectionLength * 0.25));
};

const transitionSnakeToNextTracingSection = (
  currentSection: TracingSection,
  nextSection: TracingSection,
  options: { preserveGrowth?: boolean } = {}
) => {
  const currentSectionDeferred = isSectionDeferred(currentSection);
  const currentSectionIsDot =
    preparedTracingPath?.strokes[currentSection.strokeIndex]?.isDot === true;
  const nextSectionIsDot =
    preparedTracingPath?.strokes[nextSection.strokeIndex]?.isDot === true;

  if (!currentSectionDeferred || !currentSectionIsDot) {
    appendSnakePose(currentSection.endPoint, currentSection.endTangent, true);
    retireActiveSnake();
  }

  advanceToNextTracingSection();
  resetSnakeTrail(nextSection.startPoint, nextSection.startTangent, !nextSectionIsDot, {
    preserveGrowth: options.preserveGrowth
  });

  return {
    nextSectionDeferred: isSectionDeferred(nextSection),
    nextSectionIsDot
  };
};

const maybePauseAtTracingSectionBoundary = (state: TracingState): boolean => {
  if (isDemoPlaying || isAwaitingSegmentRestart || tracingSections.length <= visibleSectionCount) {
    return false;
  }

  const currentSection = getCurrentTracingSection();
  const nextSection = tracingSections[visibleSectionCount];
  if (!currentSection || !nextSection) {
    return false;
  }

  const overallDistance = getOverallDistanceForState(state);
  const boundaryTolerance = getTracingSectionBoundaryTolerance(currentSection, nextSection);
  if (overallDistance < currentSection.endDistance - boundaryTolerance) {
    return false;
  }
  tracingSession?.end();
  const { nextSectionDeferred } = transitionSnakeToNextTracingSection(currentSection, nextSection, {
    preserveGrowth: true
  });

  if (nextSectionDeferred) {
    clearSegmentRestartState();
    requestTraceRender();
    return true;
  }

  isAwaitingSegmentRestart = true;
  queuedRestartAllowsContinuousDrag = nextSection.startReason === "retrace-turn";
  maybeResumeContinuousDrag();
  requestTraceRender();
  return true;
};

const createFruitTokens = (
  _preparedPath: PreparedTracingPath,
  sections: TracingSection[]
): FruitToken[] => {
  return sections.slice(0, -1).map((section) => ({
    x: section.endPoint.x,
    y: section.endPoint.y,
    pathDistance: section.endDistance,
    emoji: FRUIT_EMOJI,
    captured: false,
    sectionIndex: section.index
  }));
};

const resetFruitState = () => {
  visibleSectionCount = tracingSections.length > 0 ? 1 : 0;
  renderedSectionAnnotationSectionIndex = null;
  syncCurrentSectionAnnotations();
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
  return getBodyCountForGrowth(snakeGrowthDistance);
};

const getBodyCountForGrowth = (growthDistance: number) => {
  const maxByPath = Math.max(
    3,
    Math.min(MAX_SNAKE_BODY_SEGMENTS, Math.floor(currentPathLength / SNAKE_GROWTH_DISTANCE))
  );
  return Math.min(maxByPath, 1 + Math.floor(growthDistance / SNAKE_GROWTH_DISTANCE));
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

const sampleSnakePoseAtDistanceFromTrail = (
  trail: SnakePose[],
  targetDistance: number,
  getAngleOverride: (targetDistance: number) => number | null = () => null
): SnakePose => {
  const firstPose = trail[0] ?? {
    x: 0,
    y: 0,
    angle: 0,
    distance: 0,
    visible: true
  };

  if (targetDistance < 0) {
    const radians = (firstPose.angle * Math.PI) / 180;
    return {
      ...firstPose,
      x: firstPose.x + Math.cos(radians) * targetDistance,
      y: firstPose.y + Math.sin(radians) * targetDistance,
      distance: targetDistance
    };
  }

  if (trail.length <= 1 || targetDistance <= 0) {
    return {
      ...firstPose,
      distance: Math.max(0, targetDistance)
    };
  }

  for (let index = 1; index < trail.length; index += 1) {
    const previous = trail[index - 1];
    const current = trail[index];
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
    const angleOverride = getAngleOverride(targetDistance);
    return {
      x,
      y,
      angle:
        angleOverride ??
        toAngle({ x: current.x - previous.x, y: current.y - previous.y }),
      distance: targetDistance,
      visible: current.visible
    };
  }

  const lastPose = trail[trail.length - 1] ?? firstPose;
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

const renderSnakeLayer = (
  parts: SnakeLayerParts,
  model: {
    trail: SnakePose[];
    headDistance: number;
    headAngle: number;
    bodyCount: number;
    segmentSpacing?: number;
    retractionDistance: number;
    chewUntil?: number;
    getAngleOverride?: (targetDistance: number) => number | null;
    showTail?: boolean;
  },
  now = performance.now()
) => {
  if (model.trail.length === 0) {
    parts.layerEl.style.opacity = "0";
    return;
  }

  parts.layerEl.style.opacity = "1";
  const skin = getActiveSnakeSkin();
  const segmentSpacing = model.segmentSpacing ?? skin.segmentSpacing;
  const segmentVisibility = getVisibleSnakeSegments(
    model.headDistance,
    model.bodyCount,
    segmentSpacing
  );
  const bodyCount = segmentVisibility.bodyCount;
  const getRetractingTargetDistance = (gapFromHead: number) =>
    model.headDistance + model.retractionDistance - gapFromHead;
  const getRenderableTargetDistance = (targetDistance: number) =>
    Math.max(0, Math.min(model.headDistance, targetDistance));
  const isInsideRetractionEndpoint = (targetDistance: number) =>
    model.retractionDistance > 0 &&
    targetDistance >= model.headDistance - SNAKE_RETRACTION_HIDE_GAP;
  const headPose = sampleSnakePoseAtDistanceFromTrail(
    model.trail,
    Math.min(model.headDistance, getRetractingTargetDistance(0)),
    model.getAngleOverride
  );
  const headAsset = resolveSpriteAssetForPose(skin.head, model.headAngle);
  parts.headImageEl.setAttribute(
    "href",
    now < (model.chewUntil ?? 0) && headAsset === skin.head ? skin.head.chewHref : headAsset.href
  );
  setSpritePose(
    parts.headEl,
    parts.headImageEl,
    {
      ...headPose,
      angle: model.headAngle,
      visible: !isInsideRetractionEndpoint(getRetractingTargetDistance(0))
    },
    headAsset.metrics.width,
    headAsset.metrics.height,
    headAsset.metrics.anchorX,
    headAsset.metrics.anchorY,
    headAsset.metrics.rotationOffset
  );

  parts.bodyEls.forEach((el, index) => {
    if (index >= bodyCount) {
      el.style.opacity = "0";
      return;
    }

    const imageEl = el.querySelector<SVGImageElement>("image");
    if (!imageEl) {
      return;
    }

    const gapFromHead = (index + 1) * segmentSpacing;
    const targetDistance = getRetractingTargetDistance(gapFromHead);
    if (isInsideRetractionEndpoint(targetDistance)) {
      el.style.opacity = "0";
      return;
    }

    const pose = sampleSnakePoseAtDistanceFromTrail(
      model.trail,
      getRenderableTargetDistance(targetDistance),
      model.getAngleOverride
    );
    const bodySprite =
      skin.bodySprites.find((sprite) => sprite.id === el.dataset.snakeBodyVariant) ??
      skin.bodySprites[0] ??
      SNAKE_SKINS.classic.bodySprites[0];
    const bodyAsset = resolveSpriteAssetForPose(bodySprite, pose.angle);
    imageEl.setAttribute("href", bodyAsset.href);
    setSpritePose(
      el,
      imageEl,
      pose,
      bodyAsset.metrics.width,
      bodyAsset.metrics.height,
      bodyAsset.metrics.anchorX,
      bodyAsset.metrics.anchorY,
      bodyAsset.metrics.rotationOffset
    );
  });

  const tailImageEl = parts.tailEl.querySelector<SVGImageElement>("image");
  if (!tailImageEl) {
    return;
  }
  if (model.showTail === false) {
    parts.tailEl.style.opacity = "0";
    return;
  }
  const tailGapFromHead = (bodyCount + 1) * segmentSpacing;
  const tailTargetDistance = getRetractingTargetDistance(tailGapFromHead);
  if (
    !segmentVisibility.showTail ||
    isInsideRetractionEndpoint(tailTargetDistance)
  ) {
    parts.tailEl.style.opacity = "0";
    return;
  }
  const tailPose = sampleSnakePoseAtDistanceFromTrail(
    model.trail,
    getRenderableTargetDistance(tailTargetDistance),
    model.getAngleOverride
  );
  const tailAsset = resolveSpriteAssetForPose(skin.tail, tailPose.angle);
  tailImageEl.setAttribute("href", tailAsset.href);
  setSpritePose(
    parts.tailEl,
    tailImageEl,
    tailPose,
    tailAsset.metrics.width,
    tailAsset.metrics.height,
    tailAsset.metrics.anchorX,
    tailAsset.metrics.anchorY,
    tailAsset.metrics.rotationOffset
  );
};

const renderSnake = (now = performance.now()) => {
  const parts = getActiveSnakeLayerParts();
  if (!parts) {
    return;
  }

  const state = tracingSession?.getState();
  const isDotSnakeOnly =
    (dotTargetPhase !== "hidden" &&
      state !== undefined &&
      dotTargetStrokeIndex === state.activeStrokeIndex) ||
    (state !== undefined && getActivePreparedStroke(state)?.isDot === true);
  if (isDotSnakeOnly) {
    hideSnakeSprites();
    return;
  }

  const isShortDeferredSnake =
    isDemoShortDeferredSnake ||
    state !== undefined &&
    isDeferredStrokeActive(state) &&
    getActivePreparedStroke(state)?.isDot !== true;
  const segmentSpacing =
    isShortDeferredSnake && state !== undefined
      ? getActiveDeferredSnakeSegmentSpacing(state)
      : getActiveSnakeSegmentSpacing();
  renderSnakeLayer(
    parts,
    {
      trail: snakeTrail,
      headDistance: snakeHeadDistance,
      headAngle: snakeHeadAngle,
      bodyCount: isShortDeferredSnake ? 1 : getCurrentBodyCount(),
      segmentSpacing,
      retractionDistance: 0,
      chewUntil: snakeChewUntil,
      showTail: true
    },
    now
  );
};

const removeRetiringSnake = (snake: RetiringSnake) => {
  if (snake.animationFrameId !== null) {
    cancelAnimationFrame(snake.animationFrameId);
    snake.animationFrameId = null;
  }
  snake.parts.layerEl.remove();
  retiringSnakes = retiringSnakes.filter((candidate) => candidate !== snake);
  maybeShowCompletionSuccess();
};

const renderRetiringSnake = (snake: RetiringSnake) => {
  renderSnakeLayer(snake.parts, {
    trail: snake.trail,
    headDistance: snake.headDistance,
    headAngle: snake.headAngle,
    bodyCount: snake.bodyCount,
    segmentSpacing: snake.segmentSpacing,
    retractionDistance: snake.retractionDistance,
    showTail: snake.showTail
  });
};

const getActiveSnakeRetractionDurationMs = (options: { isShortDeferredSnake?: boolean } = {}) => {
  const bodyCount = options.isShortDeferredSnake ? 1 : getCurrentBodyCount();
  const segmentSpacing = options.isShortDeferredSnake
    ? getActiveDeferredSnakeSegmentSpacing({
      activeStrokeIndex: tracingSession?.getState().activeStrokeIndex ?? 0
    })
    : getActiveSnakeSegmentSpacing();
  const availableBodyCount = getVisibleSnakeSegments(
    snakeHeadDistance,
    bodyCount,
    segmentSpacing
  ).bodyCount;
  const retractionDistance = (availableBodyCount + 1) * segmentSpacing;
  return (retractionDistance / SNAKE_RETRACTION_SPEED) * 1000;
};

const animateRetiringSnake = (snake: RetiringSnake) => {
  let previousTimestamp: number | null = null;

  const tick = (timestamp: number) => {
    if (!retiringSnakes.includes(snake)) {
      return;
    }

    if (previousTimestamp === null) {
      previousTimestamp = timestamp;
      snake.animationFrameId = requestAnimationFrame(tick);
      return;
    }

    const elapsedSeconds = Math.max(0, timestamp - previousTimestamp) / 1000;
    previousTimestamp = timestamp;
    const maxStep = elapsedSeconds * SNAKE_RETRACTION_SPEED;
    const delta = snake.retractionTarget - snake.retractionDistance;

    if (Math.abs(delta) <= maxStep) {
      snake.retractionDistance = snake.retractionTarget;
      renderRetiringSnake(snake);
      removeRetiringSnake(snake);
      return;
    }

    snake.retractionDistance += Math.sign(delta) * maxStep;
    renderRetiringSnake(snake);
    snake.animationFrameId = requestAnimationFrame(tick);
  };

  snake.animationFrameId = requestAnimationFrame(tick);
};

const retireActiveSnake = () => {
  const parentEl = snakeLayerEl?.parentElement;
  if (!snakeLayerEl || !parentEl || snakeTrail.length === 0) {
    return;
  }

  const clonedLayer = snakeLayerEl.cloneNode(true) as SVGGElement;
  stripElementIds(clonedLayer);
  clonedLayer.classList.add("writing-app__snake--retiring");
  parentEl.insertBefore(clonedLayer, snakeLayerEl);
  const parts = getSnakeLayerParts(clonedLayer);
  if (!parts) {
    clonedLayer.remove();
    return;
  }

  const state = tracingSession?.getState();
  const isShortDeferredSnake =
    state !== undefined &&
    isDeferredStrokeActive(state) &&
    getActivePreparedStroke(state)?.isDot !== true;
  const bodyCount = isShortDeferredSnake ? 1 : getCurrentBodyCount();
  const segmentSpacing = isShortDeferredSnake
    ? getActiveDeferredSnakeSegmentSpacing(state)
    : getActiveSnakeSegmentSpacing();
  const availableBodyCount = getVisibleSnakeSegments(
    snakeHeadDistance,
    bodyCount,
    segmentSpacing
  ).bodyCount;
  const retiringSnake: RetiringSnake = {
    parts,
    trail: snakeTrail.map((pose) => ({ ...pose })),
    headDistance: snakeHeadDistance,
    headAngle: snakeHeadAngle,
    bodyCount,
    segmentSpacing,
    retractionDistance: 0,
    retractionTarget: (availableBodyCount + 1) * segmentSpacing,
    showTail: true,
    animationFrameId: null
  };

  retiringSnakes.push(retiringSnake);
  renderRetiringSnake(retiringSnake);
  animateRetiringSnake(retiringSnake);
};

const clearRetiringSnakes = () => {
  retiringSnakes.forEach((snake) => {
    if (snake.animationFrameId !== null) {
      cancelAnimationFrame(snake.animationFrameId);
      snake.animationFrameId = null;
    }
    snake.parts.layerEl.remove();
  });
  retiringSnakes = [];
};

const resetSnakeTrail = (
  point: Point,
  tangent: Point,
  visible = true,
  options: { preserveGrowth?: boolean } = {}
) => {
  const direction = normalizeVector(tangent);
  const nextGrowthDistance = options.preserveGrowth ? snakeGrowthDistance : 0;
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
  snakeGrowthDistance = nextGrowthDistance;
  snakeChewUntil = 0;
  queuedRestartAllowsContinuousDrag = false;
  isAwaitingSegmentRestart = false;
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
  snakeGrowthDistance += step;
  snakeTrail.push({
    x: point.x,
    y: point.y,
    angle,
    distance: snakeHeadDistance,
    visible
  });
  renderSnake();
};

const captureFruitThroughDistance = (overallDistance: number) => {
  let changed = false;

  fruits.forEach((fruit, index) => {
    if (fruit.captured || fruit.sectionIndex >= visibleSectionCount) {
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

  const marker = getCurrentTracingSection();

  if (!marker || isSectionDeferred(marker)) {
    waypointEl.classList.add("writing-app__boundary-star--hidden");
    return;
  }

  waypointEl.classList.remove("writing-app__boundary-star--hidden");
  waypointEl.setAttribute("x", `${marker.endPoint.x}`);
  waypointEl.setAttribute("y", `${marker.endPoint.y}`);
};

const syncSnakeToState = (state: TracingState) => {
  if (!isDemoPlaying) {
    captureFruitThroughDistance(getOverallDistanceForState(state));
  }

  if (!isDemoPlaying && maybePauseAtTracingSectionBoundary(state)) {
    return;
  }

  if (isDeferredStrokeActive(state) && getActivePreparedStroke(state)?.isDot === true) {
    renderSnake();
    return;
  }

  appendSnakePose(state.cursorPoint, getCommittedSnakeTangent(state), true);

  if (!isDemoPlaying && state.isPenDown) {
    maybePlaySnakeMoveSound(state);
  }
};

const stopDemoAnimation = () => {
  if (demoAnimationFrameId !== null) {
    cancelAnimationFrame(demoAnimationFrameId);
    demoAnimationFrameId = null;
  }

  isDemoPlaying = false;
  isDemoShortDeferredSnake = false;
  showMeButton.disabled = false;
  showMeButton.textContent = "Animate";

  syncFruitDisplay();
  renderSnake();
  requestTraceRender();
};

const resetRoundProgress = () => {
  tracingSession?.reset();
  activePointerId = null;
  activePointerPosition = null;
  isCompletionRetractionPending = false;
  updateSuccessVisibility(false);
  isDemoShortDeferredSnake = false;
  hideDotTarget();
  clearRetiringSnakes();

  traceStrokeEls.forEach((el, index) => {
    const length = traceStrokeLengths[index] ?? 0.001;
    el.style.strokeDasharray = `${length} ${length}`;
    el.style.strokeDashoffset = `${length}`;
  });

  queuedRestartAllowsContinuousDrag = false;
  isAwaitingSegmentRestart = false;
  const state = tracingSession?.getState();
  if (state) {
    resetSnakeTrail(state.cursorPoint, state.cursorTangent, true);
  } else {
    hideSnakeSprites();
  }
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
  syncDotTargetToState(state);
  renderDotTarget();
  syncNextSectionHighlight();
  syncCurrentSectionAnnotations();
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

  if (state.status === "complete") {
    if (!isCompletionRetractionPending) {
      isCompletionRetractionPending = true;
      appendSnakePose(state.cursorPoint, state.cursorTangent, true);
      retireActiveSnake();
    }
    hideSnakeSprites();
    maybeShowCompletionSuccess();
    return;
  }

  if (!isDemoPlaying && !isAwaitingSegmentRestart) {
    syncSnakeToState(state);
  } else {
    renderSnake();
  }

  isCompletionRetractionPending = false;
  updateSuccessVisibility(false);
};

const getDemoFrameTangent = (frame: AnimationFrame, fallback: Point): Point => {
  const speed = Math.hypot(frame.velocity.x, frame.velocity.y);
  if (speed <= 0.001) {
    return fallback;
  }

  return normalizeVector(frame.velocity);
};

const renderDemoTraceFrame = (frame: AnimationFrame) => {
  const completed = new Set(frame.completedStrokes);

  traceStrokeEls.forEach((el, index) => {
    const length = traceStrokeLengths[index] ?? 0.001;
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
};

const renderDemoDeferredFrame = (frame: AnimationFrame, tangent: Point) => {
  const activeStroke = drawablePathStrokes[frame.activeStrokeIndex];
  const activePreparedStroke = preparedTracingPath?.strokes[frame.activeStrokeIndex];

  if (!activeStroke?.deferred || frame.activeStrokeIndex < 0 || !frame.isPenDown) {
    isDemoShortDeferredSnake = false;
    hideDotTarget();
    return false;
  }

  if (activePreparedStroke?.isDot) {
    isDemoShortDeferredSnake = false;
    dotTargetStrokeIndex = frame.activeStrokeIndex;
    dotTargetPoint = frame.point;
    dotTargetPhase = "waiting";
    renderDotTarget();
    return true;
  }

  hideDotTarget();
  isDemoShortDeferredSnake = true;

  return false;
};

const maybeAdvanceDemoAtTracingSectionBoundary = (frame: AnimationFrame) => {
  let advanced = false;
  const overallDistance = getOverallDistanceForDemoFrame(frame);

  while (tracingSections.length > visibleSectionCount) {
    const currentSection = getCurrentTracingSection();
    const nextSection = tracingSections[visibleSectionCount];
    if (!currentSection || !nextSection) {
      break;
    }

    const boundaryTolerance = getTracingSectionBoundaryTolerance(currentSection, nextSection);
    if (overallDistance < currentSection.endDistance - boundaryTolerance) {
      break;
    }

    transitionSnakeToNextTracingSection(currentSection, nextSection, {
      preserveGrowth: true
    });
    advanced = true;
  }

  return advanced;
};

const playDemo = () => {
  if (!currentPath || isDemoPlaying) {
    return;
  }

  resetRoundProgress();
  stopDemoAnimation();

  const player = new AnimationPlayer(currentPath, {
    speed: 1.7 * currentAnimationSpeedMultiplier,
    penUpSpeed: 2.1 * currentAnimationSpeedMultiplier,
    deferredDelayMs: 150
  });

  isDemoPlaying = true;
  showMeButton.disabled = true;
  showMeButton.textContent = "Animating...";
  syncFruitDisplay();
  renderSnake();

  const startedAt = performance.now();
  let lastDemoTangent = tracingSession?.getState().cursorTangent ?? { x: 1, y: 0 };
  let demoRetractionStarted = false;
  let demoEndAt = player.totalDuration + DEMO_PAUSE_MS;

  const tick = (now: number) => {
    const elapsed = now - startedAt;
    const clampedElapsed = Math.min(elapsed, player.totalDuration);
    const frame = player.getFrame(clampedElapsed);
    const demoTangent = getDemoFrameTangent(frame, lastDemoTangent);
    maybeAdvanceDemoAtTracingSectionBoundary(frame);
    const isDeferredFrame = renderDemoDeferredFrame(frame, demoTangent);

    renderDemoTraceFrame(frame);
    if (frame.isPenDown && !isDeferredFrame) {
      appendSnakePose(frame.point, demoTangent, true);
      lastDemoTangent = demoTangent;
    } else {
      renderSnake();
    }

    if (!demoRetractionStarted && elapsed >= player.totalDuration) {
      demoRetractionStarted = true;
      demoEndAt =
        player.totalDuration +
        Math.max(
          DEMO_PAUSE_MS,
          getActiveSnakeRetractionDurationMs({
            isShortDeferredSnake: isDemoShortDeferredSnake
          })
        );
      hideDotTarget();
      retireActiveSnake();
      hideSnakeSprites();
    }

    if (elapsed < demoEndAt || retiringSnakes.length > 0) {
      demoAnimationFrameId = requestAnimationFrame(tick);
      return;
    }

    demoAnimationFrameId = null;
    hideDotTarget();
    isDemoPlaying = false;
    showMeButton.disabled = false;
    showMeButton.textContent = "Animate";
    syncFruitDisplay();
    resetRoundProgress();
  };

  demoAnimationFrameId = requestAnimationFrame(tick);
  requestTraceRender();
};

const chooseBodySpriteForSegment = (skin: SnakeSkin): BodySprite => {
  const primary = skin.bodySprites[0] ?? SNAKE_SKINS.classic.bodySprites[0];
  const alternate = skin.bodySprites[1];
  if (skin.id === "themePark" && skin.bodySprites.length > 1) {
    return skin.bodySprites[Math.floor(Math.random() * skin.bodySprites.length)] ?? primary;
  }

  if (!alternate || Math.random() >= BULGE_BODY_SPRITE_CHANCE) {
    return primary;
  }

  return alternate;
};

const setupScene = (path: WritingPath, width: number, height: number, offsetY: number) => {
  clearRetiringSnakes();
  currentSceneWidth = width;
  const skin = getActiveSnakeSkin();
  const preparedPath = compileTracingPath(path);
  preparedTracingPath = preparedPath;
  drawablePathStrokes = path.strokes.filter((stroke) => stroke.type !== "lift");
  currentPathLength = preparedPath.strokes.reduce((total, stroke) => total + stroke.totalLength, 0);
  const groupAnalysis = analyzeTracingGroups(preparedPath);
  tracingGroups = groupAnalysis.groups;
  tracingSections = analyzeTracingSections(preparedPath, { groups: tracingGroups }).sections;
  visibleSectionCount = tracingSections.length > 0 ? 1 : 0;

  tracingSession = new TracingSession(preparedPath, {
    startTolerance: currentTraceTolerance,
    hitTolerance: currentTraceTolerance
  });
  activePointerId = null;
  fruits = createFruitTokens(preparedPath, tracingSections);

  const drawableStrokes = drawablePathStrokes;
  const backgroundPaths = tracingSections
    .map(
      (section) =>
        `<path class="writing-app__stroke-bg" d="${buildTracingSectionPathD(
          preparedPath,
          section,
          drawableStrokes
        )}"></path>`
    )
    .join("");
  const tracePaths = drawableStrokes
    .map((stroke) => `<path class="writing-app__stroke-trace" d="${buildPathD(stroke.curves)}"></path>`)
    .join("");
  const snakeBodyMarkup = Array.from({ length: MAX_SNAKE_BODY_SEGMENTS }, (_, index) => {
    const bodyIndex = MAX_SNAKE_BODY_SEGMENTS - 1 - index;
    const bodySprite = chooseBodySpriteForSegment(skin);
    return `
      <g
        class="writing-app__snake-segment writing-app__snake-body"
        data-snake-body-index="${bodyIndex}"
        data-snake-body-variant="${bodySprite.id}"
      >
        <image
          href="${bodySprite.href}"
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
    <path class="writing-app__stroke-next" id="next-section-stroke" d=""></path>
    ${tracePaths}
    <g class="writing-app__section-annotations" id="section-annotations"></g>
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
          href="${skin.tail.href}"
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
          href="${skin.head.href}"
          preserveAspectRatio="none"
        ></image>
      </g>
    </g>
    <g class="writing-app__dot-snake" id="dot-snake">
      <image
        id="dot-snake-image"
        href="${skin.dotTarget.happyHref}"
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
  `;

  traceStrokeEls = Array.from(
    traceSvg.querySelectorAll<SVGPathElement>(".writing-app__stroke-trace")
  );
  nextSectionEl = traceSvg.querySelector<SVGPathElement>("#next-section-stroke");
  sectionAnnotationEl = traceSvg.querySelector<SVGGElement>("#section-annotations");
  renderedSectionAnnotationSectionIndex = null;
  fruitEls = Array.from(traceSvg.querySelectorAll<SVGTextElement>(".writing-app__fruit"));
  waypointEl = traceSvg.querySelector<SVGTextElement>("#waypoint-star");
  snakeLayerEl = traceSvg.querySelector<SVGGElement>("#trace-snake");
  snakeHeadEl = traceSvg.querySelector<SVGGElement>("#snake-head");
  snakeHeadImageEl = traceSvg.querySelector<SVGImageElement>("#snake-head-image");
  snakeTailEl = traceSvg.querySelector<SVGGElement>("#snake-tail");
  snakeBodyEls = Array.from(traceSvg.querySelectorAll<SVGGElement>(".writing-app__snake-body")).sort(
    (a, b) => Number(a.dataset.snakeBodyIndex) - Number(b.dataset.snakeBodyIndex)
  );
  dotSnakeEl = traceSvg.querySelector<SVGGElement>("#dot-snake");
  dotSnakeImageEl = traceSvg.querySelector<SVGImageElement>("#dot-snake-image");
  eagleEl = traceSvg.querySelector<SVGGElement>("#dot-eagle");
  eagleImageEl = traceSvg.querySelector<SVGImageElement>("#dot-eagle-image");

  traceStrokeLengths = traceStrokeEls.map((el) => {
    const length = el.getTotalLength();
    return Number.isFinite(length) && length > 0 ? length : 0.001;
  });

  traceStrokeEls.forEach((el, index) => {
    const length = traceStrokeLengths[index] ?? 0.001;
    el.style.strokeDasharray = `${length} ${length}`;
    el.style.strokeDashoffset = `${length}`;
  });

  syncNextSectionHighlight();
  const initialState = tracingSession.getState();
  resetSnakeTrail(initialState.cursorPoint, initialState.cursorTangent);
  hideDotTarget();
  resetFruitState();
  resetSnakeMoveSoundProgress();
  isCompletionRetractionPending = false;
  updateSuccessVisibility(false);
  requestTraceRender();
};

const renderWord = (word: string, wordIndex = -1) => {
  stopDemoAnimation();

  const layout = buildShiftedWordLayout(word, {
    joinSpacing: currentJoinSpacing,
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
  const shouldRestartSnakeEmergence = isAwaitingSegmentRestart;

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
  activePointerId = event.pointerId;
  activePointerPosition = pointer;
  warmSnakeChompSound();
  warmSnakeMoveSounds();
  if (shouldRestartSnakeEmergence) {
    clearSegmentRestartState();
  } else if (!shouldRestartSnakeEmergence) {
    isAwaitingSegmentRestart = false;
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
  syncSettingsUrl();
  rerenderCurrentWord();
});
animationSpeedSlider.addEventListener("input", () => {
  currentAnimationSpeedMultiplier = Number(animationSpeedSlider.value);
  syncAnimationSpeedLabel();
  syncSettingsUrl();
});
turnRadiusSlider.addEventListener("input", () => {
  currentTurnRadius = Number(turnRadiusSlider.value);
  syncTurnRadiusLabel();
  syncSettingsUrl();
  renderedSectionAnnotationSectionIndex = null;
  syncCurrentSectionAnnotations();
});
offsetArrowLanesInput.addEventListener("change", () => {
  shouldOffsetArrowLanes = offsetArrowLanesInput.checked;
  syncSettingsUrl();
  renderedSectionAnnotationSectionIndex = null;
  syncCurrentSectionAnnotations();
});
themeParkToggle.addEventListener("change", () => {
  currentSnakeSkinId = themeParkToggle.checked ? "themePark" : "classic";
  syncSnakeSkinPresentation();
  syncSettingsUrl();
  rerenderCurrentWord();
});
targetBendRateSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    targetBendRate: Number(targetBendRateSlider.value)
  };
  syncJoinSpacingLabels();
  syncSettingsUrl();
  rerenderCurrentWord();
});
minSidebearingGapSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    minSidebearingGap: Number(minSidebearingGapSlider.value)
  };
  syncJoinSpacingLabels();
  syncSettingsUrl();
  rerenderCurrentWord();
});
bendSearchMinSidebearingGapSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    bendSearchMinSidebearingGap: Number(bendSearchMinSidebearingGapSlider.value)
  };
  syncJoinSpacingLabels();
  syncSettingsUrl();
  rerenderCurrentWord();
});
bendSearchMaxSidebearingGapSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    bendSearchMaxSidebearingGap: Number(bendSearchMaxSidebearingGapSlider.value)
  };
  syncJoinSpacingLabels();
  syncSettingsUrl();
  rerenderCurrentWord();
});
exitHandleScaleSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    exitHandleScale: Number(exitHandleScaleSlider.value)
  };
  syncJoinSpacingLabels();
  syncSettingsUrl();
  rerenderCurrentWord();
});
entryHandleScaleSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    entryHandleScale: Number(entryHandleScaleSlider.value)
  };
  syncJoinSpacingLabels();
  syncSettingsUrl();
  rerenderCurrentWord();
});
includeInitialLeadInInput.addEventListener("change", () => {
  includeInitialLeadIn = includeInitialLeadInInput.checked;
  syncSettingsUrl();
  rerenderCurrentWord();
});
includeFinalLeadOutInput.addEventListener("change", () => {
  includeFinalLeadOut = includeFinalLeadOutInput.checked;
  syncSettingsUrl();
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
applyUrlSettings();
syncNextWordButtonLabel();
goToNextWord();
