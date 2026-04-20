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
const SHOW_ME_SPEED_MULTIPLIER = 0.7;
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
const DEFAULT_SNAKE_JOIN_SPACING = {
  targetBendRate: 16,
  minSidebearingGap: 80,
  bendSearchMinSidebearingGap: -30,
  bendSearchMaxSidebearingGap: 240,
  exitHandleScale: 0.75,
  entryHandleScale: 0.75
} as const satisfies Required<JoinSpacingOptions>;

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
  retractionDistance: number;
  retractionTarget: number;
  animationFrameId: number | null;
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
  deferredScale: number;
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
    deferredScale: 0.78,
    deferredSegmentSpacing: 44,
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
    deferredScale: 0.78,
    deferredSegmentSpacing: 56,
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

let currentSnakeSkinId: SnakeSkinId = "classic";

const getActiveSnakeSkin = (): SnakeSkin => SNAKE_SKINS[currentSnakeSkinId];

const getActiveSnakeSegmentSpacing = () => getActiveSnakeSkin().segmentSpacing;

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
                <label class="writing-app__settings-toggle" for="offset-arrow-lanes">
                  <input
                    id="offset-arrow-lanes"
                    type="checkbox"
                    checked
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
let currentTraceTolerance = DEFAULT_SNAKE_TRACE_TOLERANCE;
let currentTurnRadius = 13;
let shouldOffsetArrowLanes = true;
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
let snakeGrowthDistance = 0;
let snakeHeadAngle = 0;
let snakeChewUntil = 0;
let retiringSnakes: RetiringSnake[] = [];
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

const syncJoinSpacingLabels = () => {
  targetBendRateValue.textContent = `${currentJoinSpacing.targetBendRate}`;
  minSidebearingGapValue.textContent = `${currentJoinSpacing.minSidebearingGap}`;
  bendSearchMinSidebearingGapValue.textContent = `${currentJoinSpacing.bendSearchMinSidebearingGap}`;
  bendSearchMaxSidebearingGapValue.textContent = `${currentJoinSpacing.bendSearchMaxSidebearingGap}`;
  exitHandleScaleValue.textContent = currentJoinSpacing.exitHandleScale.toFixed(2);
  entryHandleScaleValue.textContent = currentJoinSpacing.entryHandleScale.toFixed(2);
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
  if (!state.isPenDown || isDemoPlaying || isSnakeSlithering || isSnakeExitComplete || isAwaitingSegmentRestart) {
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

const pointFromAngle = (angle: number): Point => {
  const radians = (angle * Math.PI) / 180;
  return {
    x: Math.cos(radians),
    y: Math.sin(radians)
  };
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

  const skin = getActiveSnakeSkin();
  const bodySprite = skin.bodySprites[0] ?? SNAKE_SKINS.classic.bodySprites[0];
  const deferredScale = skin.deferredScale;
  const deferredSegmentSpacing = skin.deferredSegmentSpacing;
  const headAsset =
    options.headHref === undefined
      ? resolveSpriteAssetForPose(skin.head, pose.angle)
      : { href: options.headHref, metrics: skin.head.metrics };

  rootEl.style.opacity = "1";
  headImageEl.setAttribute("href", headAsset.href);
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
    headAsset.metrics.width * deferredScale,
    headAsset.metrics.height * deferredScale,
    headAsset.metrics.anchorX,
    headAsset.metrics.anchorY,
    headAsset.metrics.rotationOffset
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
    deferredSegmentSpacing
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
    x: pose.point.x - pose.tangent.x * deferredSegmentSpacing,
    y: pose.point.y - pose.tangent.y * deferredSegmentSpacing
  };
  const tailPoint = {
    x: pose.point.x - pose.tangent.x * deferredSegmentSpacing * 2,
    y: pose.point.y - pose.tangent.y * deferredSegmentSpacing * 2
  };

  if (bodyGroupEl && bodyImageEl) {
    const bodyAsset = resolveSpriteAssetForPose(bodySprite, pose.angle);
    bodyImageEl.setAttribute("href", bodyAsset.href);
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
      bodyAsset.metrics.width * deferredScale,
      bodyAsset.metrics.height * deferredScale,
      bodyAsset.metrics.anchorX,
      bodyAsset.metrics.anchorY,
      bodyAsset.metrics.rotationOffset
    );
  }

  if (tailGroupEl && tailImageEl && segmentVisibility.showTail) {
    const tailAsset = resolveSpriteAssetForPose(skin.tail, pose.angle);
    tailImageEl.setAttribute("href", tailAsset.href);
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
      tailAsset.metrics.width * deferredScale,
      tailAsset.metrics.height * deferredScale,
      tailAsset.metrics.anchorX,
      tailAsset.metrics.anchorY,
      tailAsset.metrics.rotationOffset
    );
  } else if (tailGroupEl) {
    tailGroupEl.style.opacity = "0";
  }
};

const createDeferredSnakeMarkup = (attributes: string): string => {
  const skin = getActiveSnakeSkin();
  const bodySprite = skin.bodySprites[0] ?? SNAKE_SKINS.classic.bodySprites[0];
  return `
    <g ${attributes}>
      <g class="writing-app__deferred-head-part" data-deferred-part="tail">
        <image href="${skin.tail.href}" preserveAspectRatio="none"></image>
      </g>
      <g class="writing-app__deferred-head-part" data-deferred-part="body">
        <image href="${bodySprite.href}" preserveAspectRatio="none"></image>
      </g>
      <g class="writing-app__deferred-head-part" data-deferred-part="head">
        <image href="${skin.head.href}" preserveAspectRatio="none"></image>
      </g>
    </g>
  `;
};

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

const renderSectionAnnotationMarkup = (annotation: FormationAnnotation): string => {
  if (annotation.kind === "draw-order-number") {
    return "";
  }

  return `
    <path
      class="${getSectionAnnotationClassName(annotation)}"
      d="${annotationCommandsToSvgPathData(annotation.commands)}"
    ></path>
    ${annotation.head
      ? `<polygon class="writing-app__section-arrowhead writing-app__section-arrowhead--white writing-app__section-arrowhead--${annotation.kind}" points="${buildSvgPoints(annotation.head.polygon)}"></polygon>`
      : ""
    }
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

const maybePauseAtTracingSectionBoundary = (state: TracingState): boolean => {
  if (
    isDemoPlaying ||
    isSnakeSlithering ||
    isSnakeExitComplete ||
    isAwaitingSegmentRestart ||
    tracingSections.length <= visibleSectionCount
  ) {
    return false;
  }

  const currentSection = getCurrentTracingSection();
  const nextSection = tracingSections[visibleSectionCount];
  if (!currentSection || !nextSection) {
    return false;
  }

  const overallDistance = getOverallDistanceForState(state);
  const sectionLength = currentSection.endDistance - currentSection.startDistance;
  const boundaryTolerance =
    nextSection.startReason === "stroke-start"
      ? 0.1
      : Math.min(8, Math.max(0.1, sectionLength * 0.25));
  if (overallDistance < currentSection.endDistance - boundaryTolerance) {
    return false;
  }

  const currentSectionDeferred = isSectionDeferred(currentSection);
  const nextSectionDeferred = isSectionDeferred(nextSection);

  if (!currentSectionDeferred) {
    appendSnakePose(currentSection.endPoint, currentSection.endTangent, true);
    retireActiveSnake();
  }

  advanceToNextTracingSection();
  tracingSession?.end();
  resetSnakeTrail(nextSection.startPoint, nextSection.startTangent, !nextSectionDeferred, {
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
    retractionDistance: number;
    chewUntil?: number;
    getAngleOverride?: (targetDistance: number) => number | null;
  },
  now = performance.now()
) => {
  if (model.trail.length === 0) {
    parts.layerEl.style.opacity = "0";
    return;
  }

  parts.layerEl.style.opacity = "1";
  const skin = getActiveSnakeSkin();
  const segmentSpacing = skin.segmentSpacing;
  const segmentVisibility = getVisibleSnakeSegments(
    model.headDistance,
    model.bodyCount,
    segmentSpacing
  );
  const bodyCount = segmentVisibility.bodyCount;
  const getRetractingTargetDistance = (gapFromHead: number) =>
    model.headDistance + model.retractionDistance - gapFromHead;
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
      Math.max(0, Math.min(model.headDistance, targetDistance)),
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
  const tailGapFromHead = (bodyCount + 1) * segmentSpacing;
  const tailTargetDistance = getRetractingTargetDistance(tailGapFromHead);
  if (!segmentVisibility.showTail || isInsideRetractionEndpoint(tailTargetDistance)) {
    parts.tailEl.style.opacity = "0";
    return;
  }
  const tailPose = sampleSnakePoseAtDistanceFromTrail(
    model.trail,
    Math.max(0, Math.min(model.headDistance, tailTargetDistance)),
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

  if (isSnakeExitComplete) {
    parts.layerEl.style.opacity = "0";
    return;
  }

  renderSnakeLayer(
    parts,
    {
      trail: snakeTrail,
      headDistance: snakeHeadDistance,
      headAngle: snakeHeadAngle,
      bodyCount: isSnakeSlithering ? snakeExitBodyCount : getCurrentBodyCount(),
      retractionDistance: 0,
      chewUntil: snakeChewUntil
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
};

const renderRetiringSnake = (snake: RetiringSnake) => {
  renderSnakeLayer(snake.parts, {
    trail: snake.trail,
    headDistance: snake.headDistance,
    headAngle: snake.headAngle,
    bodyCount: snake.bodyCount,
    retractionDistance: snake.retractionDistance
  });
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

  const bodyCount = getCurrentBodyCount();
  const availableBodyCount = getVisibleSnakeSegments(
    snakeHeadDistance,
    bodyCount,
    getActiveSnakeSegmentSpacing()
  ).bodyCount;
  const retiringSnake: RetiringSnake = {
    parts,
    trail: snakeTrail.map((pose) => ({ ...pose })),
    headDistance: snakeHeadDistance,
    headAngle: snakeHeadAngle,
    bodyCount,
    retractionDistance: 0,
    retractionTarget: (availableBodyCount + 1) * getActiveSnakeSegmentSpacing(),
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
  isSnakeExitComplete = false;
  isSnakeSlithering = false;
  snakeExitBodyCount = 0;
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

  return baseExit + (bodyCount + 2) * getActiveSnakeSegmentSpacing() + SNAKE_EXIT_MARGIN;
};

const startSnakeExit = (
  point: Point,
  tangent: Point,
  options: { showSuccess?: boolean; onComplete?: () => void } = {}
) => {
  if (isSnakeSlithering || isSnakeExitComplete) {
    return;
  }

  queuedRestartAllowsContinuousDrag = false;
  isAwaitingSegmentRestart = false;
  const direction = normalizeVector(tangent);
  if (!snakeTrail.some((pose) => pose.visible)) {
    resetSnakeTrail(point, direction, true, { preserveGrowth: true });
  }
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
      clearRetiringSnakes();
      hideSnakeSprites();
      hideCompletedDeferredHeads();
      updateSuccessVisibility(options.showSuccess ?? true);
      options.onComplete?.();
      return;
    }

    snakeExitAnimationFrameId = requestAnimationFrame(tick);
  };

  snakeExitAnimationFrameId = requestAnimationFrame(tick);
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

  const marker = tracingSections[visibleSectionCount];

  if (!marker || isSectionDeferred(marker)) {
    waypointEl.classList.add("writing-app__boundary-star--hidden");
    return;
  }

  waypointEl.classList.remove("writing-app__boundary-star--hidden");
  waypointEl.setAttribute("x", `${marker.startPoint.x}`);
  waypointEl.setAttribute("y", `${marker.startPoint.y}`);
};

const syncSnakeToState = (state: TracingState) => {
  if (!isDemoPlaying) {
    captureFruitThroughDistance(getOverallDistanceForState(state));
  }

  if (!isDemoPlaying && maybePauseAtTracingSectionBoundary(state)) {
    return;
  }

  if (isDeferredStrokeActive(state)) {
    renderSnake();
    return;
  }

  appendSnakePose(state.cursorPoint, state.cursorTangent, true);

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
  showMeButton.disabled = false;
  showMeButton.textContent = "Demo";

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
  clearRetiringSnakes();

  if (snakeExitAnimationFrameId !== null) {
    cancelAnimationFrame(snakeExitAnimationFrameId);
    snakeExitAnimationFrameId = null;
  }

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
  registerCompletedDeferredHeads(state);
  syncDotTargetToState(state);
  renderDotTarget();
  renderDeferredHead(state);
  renderCompletedDeferredHeads();
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

const registerDemoCompletedDeferredHeads = (completedStrokes: number[]) => {
  completedStrokes.forEach((strokeIndex) => {
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

const renderDemoDeferredFrame = (frame: AnimationFrame, tangent: Point) => {
  const activeStroke = drawablePathStrokes[frame.activeStrokeIndex];
  const activePreparedStroke = preparedTracingPath?.strokes[frame.activeStrokeIndex];

  if (!activeStroke?.deferred || frame.activeStrokeIndex < 0 || !frame.isPenDown) {
    if (deferredHeadEl) {
      deferredHeadEl.style.opacity = "0";
    }
    hideDotTarget();
    return false;
  }

  if (activePreparedStroke?.isDot) {
    if (deferredHeadEl) {
      deferredHeadEl.style.opacity = "0";
    }
    dotTargetStrokeIndex = frame.activeStrokeIndex;
    dotTargetPoint = frame.point;
    dotTargetPhase = "waiting";
    renderDotTarget();
    return true;
  }

  hideDotTarget();
  if (deferredHeadEl) {
    renderDeferredSnake(
      deferredHeadEl,
      {
        point: frame.point,
        tangent,
        angle: toAngle(tangent)
      },
      {
        isDot: false,
        travelledDistance: (activePreparedStroke?.totalLength ?? 0) * frame.activeStrokeProgress
      }
    );
  }

  return true;
};

const getCurrentSnakeExitPose = (fallbackPoint: Point, fallbackTangent: Point): { point: Point; tangent: Point } => {
  const lastPose = [...snakeTrail].reverse().find((pose) => pose.visible);
  if (!lastPose) {
    return {
      point: fallbackPoint,
      tangent: fallbackTangent
    };
  }

  return {
    point: { x: lastPose.x, y: lastPose.y },
    tangent: pointFromAngle(lastPose.angle)
  };
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
  let lastDemoTangent = tracingSession?.getState().cursorTangent ?? { x: 1, y: 0 };

  const tick = (now: number) => {
    const elapsed = now - startedAt;
    const clampedElapsed = Math.min(elapsed, player.totalDuration);
    const frame = player.getFrame(clampedElapsed);
    const demoTangent = getDemoFrameTangent(frame, lastDemoTangent);
    const isDeferredFrame = renderDemoDeferredFrame(frame, demoTangent);

    renderDemoTraceFrame(frame);
    registerDemoCompletedDeferredHeads(frame.completedStrokes);
    renderCompletedDeferredHeads();
    if (frame.isPenDown && !isDeferredFrame) {
      appendSnakePose(frame.point, demoTangent, true);
      lastDemoTangent = demoTangent;
    } else {
      renderSnake();
    }

    if (elapsed < player.totalDuration + DEMO_PAUSE_MS) {
      demoAnimationFrameId = requestAnimationFrame(tick);
      return;
    }

    demoAnimationFrameId = null;
    hideDotTarget();
    if (deferredHeadEl) {
      deferredHeadEl.style.opacity = "0";
    }
    const exitPose = getCurrentSnakeExitPose(frame.point, demoTangent);
    startSnakeExit(exitPose.point, exitPose.tangent, {
      showSuccess: false,
      onComplete: () => {
        isDemoPlaying = false;
        showMeButton.disabled = false;
        showMeButton.textContent = "Demo";
        syncFruitDisplay();
        resetRoundProgress();
      }
    });
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
  currentSceneHeight = height;
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
    <g class="writing-app__deferred-heads" id="deferred-trail-heads">
      ${deferredTrailHeadMarkup}
    </g>
    ${createDeferredSnakeMarkup('class="writing-app__deferred-head" id="deferred-head"')}
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
  rerenderCurrentWord();
});
turnRadiusSlider.addEventListener("input", () => {
  currentTurnRadius = Number(turnRadiusSlider.value);
  syncTurnRadiusLabel();
  renderedSectionAnnotationSectionIndex = null;
  syncCurrentSectionAnnotations();
});
offsetArrowLanesInput.addEventListener("change", () => {
  shouldOffsetArrowLanes = offsetArrowLanesInput.checked;
  renderedSectionAnnotationSectionIndex = null;
  syncCurrentSectionAnnotations();
});
themeParkToggle.addEventListener("change", () => {
  currentSnakeSkinId = themeParkToggle.checked ? "themePark" : "classic";
  syncSnakeSkinPresentation();
  rerenderCurrentWord();
});
targetBendRateSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    targetBendRate: Number(targetBendRateSlider.value)
  };
  syncJoinSpacingLabels();
  rerenderCurrentWord();
});
minSidebearingGapSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    minSidebearingGap: Number(minSidebearingGapSlider.value)
  };
  syncJoinSpacingLabels();
  rerenderCurrentWord();
});
bendSearchMinSidebearingGapSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    bendSearchMinSidebearingGap: Number(bendSearchMinSidebearingGapSlider.value)
  };
  syncJoinSpacingLabels();
  rerenderCurrentWord();
});
bendSearchMaxSidebearingGapSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    bendSearchMaxSidebearingGap: Number(bendSearchMaxSidebearingGapSlider.value)
  };
  syncJoinSpacingLabels();
  rerenderCurrentWord();
});
exitHandleScaleSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    exitHandleScale: Number(exitHandleScaleSlider.value)
  };
  syncJoinSpacingLabels();
  rerenderCurrentWord();
});
entryHandleScaleSlider.addEventListener("input", () => {
  currentJoinSpacing = {
    ...currentJoinSpacing,
    entryHandleScale: Number(entryHandleScaleSlider.value)
  };
  syncJoinSpacingLabels();
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
syncTurnRadiusLabel();
syncJoinSpacingLabels();
syncNextWordButtonLabel();
syncSnakeSkinPresentation();
goToNextWord();
