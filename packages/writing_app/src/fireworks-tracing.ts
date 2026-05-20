import "./style.css";
import {
    analyzeTracingGroups,
    analyzeTracingSections,
    compileTracingPath,
    type Point,
    type PreparedTracingPath,
    type PreparedStroke,
    type TracingSample,
    type WritingPath
} from "letterpaths";
import {
    buildPathD,
    buildShiftedWordLayout,
    shiftWritingPath
} from "./shared";

const DEFAULT_WORD = "spark";
const FIREWORK_SKY_HEIGHT = 650;
const FUSE_SAMPLE_RATE = 5;
const FUSE_SPEED = 430;
const MIN_FUSE_DURATION_MS = 5600;
const MAX_FUSE_DURATION_MS = 19000;
const MAX_PARTICLES = 4200;
const MAX_ROCKETS = 34;
const MAX_WAYPOINTS = 18;
const HARD_CLEAR_ALPHA = 1;
const TRAIL_CLEAR_ALPHA = 0.24;
const HOT_BURN_DISTANCE = 150;
const COOLING_BURN_DISTANCE = 620;
const FINAL_COOL_MS = 2800;
const SMOULDER_SAMPLE_SPACING = 46;
const SMOULDER_MAX_SAMPLES = 84;
const PERF_REPORT_INTERVAL_MS = 500;
const SVG_PATH_UPDATE_INTERVAL_MS = 34;
const SVG_PATH_UPDATE_DISTANCE = 12;
const TWO_PI = Math.PI * 2;

type CanvasPoint = Point;

type Waypoint = {
    distance: number;
    point: Point;
    triggered: boolean;
    isFinale: boolean;
    element: SVGGElement | null;
};

type SmoulderSample = {
    distance: number;
    x: number;
    y: number;
    tangentX: number;
    tangentY: number;
    normalX: number;
    normalY: number;
    emberNoise: number;
    pocketNoise: number;
};

type SmoulderSampleCache = {
    width: number;
    height: number;
    devicePixelRatio: number;
    samples: SmoulderSample[];
};

type Scene = {
    path: WritingPath;
    preparedPath: PreparedTracingPath;
    totalLength: number;
    durationMs: number;
    startedAt: number;
    fullPathD: string;
    width: number;
    height: number;
    offsetY: number;
    waypoints: Waypoint[];
    completed: boolean;
    smoulderSampleCache: SmoulderSampleCache | null;
    lastSvgPathUpdateAt: number;
    lastSvgPathDistance: number;
    lastSvgPathCoolProgress: number;
};

type ParticleKind = "fuse" | "ember" | "rocket" | "shell" | "crackle" | "smoke" | "willow" | "strobe";
type FireworkPattern = "peony" | "ring" | "willow" | "palm" | "strobe" | "chrysanthemum";

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    age: number;
    life: number;
    size: number;
    hue: number;
    saturation: number;
    lightness: number;
    gravity: number;
    drag: number;
    kind: ParticleKind;
};

type Rocket = {
    start: CanvasPoint;
    target: CanvasPoint;
    x: number;
    y: number;
    ageMs: number;
    durationMs: number;
    hue: number;
    power: number;
    isFinale: boolean;
    pattern: FireworkPattern;
    trail: CanvasPoint[];
};

type PendingLaunch = {
    origin: CanvasPoint;
    target: CanvasPoint;
    delayMs: number;
    hue: number;
    power: number;
    isFinale: boolean;
    pattern: FireworkPattern;
};

type Flash = {
    x: number;
    y: number;
    age: number;
    life: number;
    radius: number;
    hue: number;
    alpha: number;
};

type Star = {
    x: number;
    y: number;
    radius: number;
    phase: number;
    speed: number;
};

type PerfSection = "updateFuse" | "backdrop" | "updates" | "smoke" | "smoulder" | "effects" | "particles";

type PerfStats = {
    frames: number;
    lastReportAt: number;
    totalFrameMs: number;
    maxFrameMs: number;
    droppedFrames: number;
    sections: Record<PerfSection, number>;
    smoulderSamples: number;
};

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
    throw new Error("Missing #app element for fireworks tracing app.");
}

app.innerHTML = `
  <div class="fireworks-app">
    <main class="fireworks-app__stage">
      <canvas
        class="fireworks-app__canvas"
        id="fireworks-canvas"
        aria-hidden="true"
      ></canvas>
      <svg
        class="fireworks-app__svg"
        id="fireworks-svg"
        viewBox="0 0 1600 1200"
        aria-label="Firework fuse handwriting path"
      ></svg>
      <header class="fireworks-app__topbar">
        <label class="fireworks-app__word-field" for="fireworks-word-input">
          <span>Word</span>
          <input
            class="fireworks-app__word-input"
            id="fireworks-word-input"
            type="text"
            value="${DEFAULT_WORD}"
            placeholder="${DEFAULT_WORD}"
            spellcheck="false"
            autocomplete="off"
          />
        </label>
        <button class="fireworks-app__replay-button" id="fireworks-replay-button" type="button">
          Replay
        </button>
      </header>
            <output class="fireworks-app__perf" id="fireworks-perf" aria-live="off"></output>
      <p class="fireworks-app__status" id="fireworks-status" aria-live="polite" hidden></p>
    </main>
  </div>
`;

const wordInput = document.querySelector<HTMLInputElement>("#fireworks-word-input");
const replayButton = document.querySelector<HTMLButtonElement>("#fireworks-replay-button");
const fireworksSvg = document.querySelector<SVGSVGElement>("#fireworks-svg");
const fireworksCanvas = document.querySelector<HTMLCanvasElement>("#fireworks-canvas");
const statusEl = document.querySelector<HTMLParagraphElement>("#fireworks-status");
const perfEl = document.querySelector<HTMLOutputElement>("#fireworks-perf");

if (!wordInput || !replayButton || !fireworksSvg || !fireworksCanvas || !statusEl || !perfEl) {
    throw new Error("Missing elements for fireworks tracing app.");
}

const fireworksContext = fireworksCanvas.getContext("2d", { alpha: true });

if (!fireworksContext) {
    throw new Error("Could not create fireworks canvas context.");
}

let currentWord = DEFAULT_WORD;
let currentScene: Scene | null = null;
let spentFusePathEl: SVGPathElement | null = null;
let coolingFusePathEl: SVGPathElement | null = null;
let smoulderFusePathEl: SVGPathElement | null = null;
let burnedPathEl: SVGPathElement | null = null;
let burnedGlowPathEl: SVGPathElement | null = null;
let emberEl: SVGGElement | null = null;
let animationFrameId: number | null = null;
let lastFrameAt = performance.now();
let inputDebounceId: number | null = null;
let canvasCssWidth = 1;
let canvasCssHeight = 1;
let canvasDevicePixelRatio = 1;
let particles: Particle[] = [];
let rockets: Rocket[] = [];
let pendingLaunches: PendingLaunch[] = [];
let flashes: Flash[] = [];
let stars: Star[] = [];
let needsHardCanvasClear = true;
let smoulderQuality = 1;
let perfStats: PerfStats = {
    frames: 0,
    lastReportAt: performance.now(),
    totalFrameMs: 0,
    maxFrameMs: 0,
    droppedFrames: 0,
    sections: {
        updateFuse: 0,
        backdrop: 0,
        updates: 0,
        smoke: 0,
        smoulder: 0,
        effects: 0,
        particles: 0
    },
    smoulderSamples: 0
};

const clamp = (value: number, min: number, max: number): number =>
    Math.min(max, Math.max(min, value));

const randomBetween = (min: number, max: number): number =>
    min + Math.random() * (max - min);

const createPerfSections = (): Record<PerfSection, number> => ({
    updateFuse: 0,
    backdrop: 0,
    updates: 0,
    smoke: 0,
    smoulder: 0,
    effects: 0,
    particles: 0
});

const recordPerfSection = (section: PerfSection, startedAt: number) => {
    perfStats.sections[section] += performance.now() - startedAt;
};

const updatePerfPanel = (now: number, frameMs: number) => {
    perfStats.frames += 1;
    perfStats.totalFrameMs += frameMs;
    perfStats.maxFrameMs = Math.max(perfStats.maxFrameMs, frameMs);
    if (frameMs > 24) {
        perfStats.droppedFrames += 1;
    }

    if (now - perfStats.lastReportAt < PERF_REPORT_INTERVAL_MS) {
        return;
    }

    const windowSeconds = Math.max((now - perfStats.lastReportAt) / 1000, 0.001);
    const averageFrameMs = perfStats.totalFrameMs / Math.max(perfStats.frames, 1);
    const averageSectionMs = (section: PerfSection) =>
        perfStats.sections[section] / Math.max(perfStats.frames, 1);
    const averageSmoulderMs = averageSectionMs("smoulder");
    const smokeParticles = particles.filter((particle) => particle.kind === "smoke").length;

    if (averageFrameMs > 22 || averageSmoulderMs > 5) {
        smoulderQuality = Math.max(0.5, smoulderQuality - 0.12);
    } else if (averageFrameMs < 15.5 && averageSmoulderMs < 2.6) {
        smoulderQuality = Math.min(1, smoulderQuality + 0.04);
    }

    perfEl.textContent = [
        `${Math.round(perfStats.frames / windowSeconds)} fps`,
        `frame ${averageFrameMs.toFixed(1)}ms max ${perfStats.maxFrameMs.toFixed(1)}ms drops ${perfStats.droppedFrames}`,
        `fuse ${averageSectionMs("updateFuse").toFixed(1)}ms smoke ${averageSectionMs("smoke").toFixed(1)}ms smoulder ${averageSmoulderMs.toFixed(1)}ms`,
        `effects ${averageSectionMs("effects").toFixed(1)}ms particles ${averageSectionMs("particles").toFixed(1)}ms`,
        `objects ${particles.length} smoke ${smokeParticles} rockets ${rockets.length} smoulder ${perfStats.smoulderSamples}`,
        `quality ${Math.round(smoulderQuality * 100)}%`
    ].join("\n");

    perfStats = {
        frames: 0,
        lastReportAt: now,
        totalFrameMs: 0,
        maxFrameMs: 0,
        droppedFrames: 0,
        sections: createPerfSections(),
        smoulderSamples: perfStats.smoulderSamples
    };
};

const noiseUnit = (seed: number): number => {
    const noise = Math.sin(seed * 12.9898) * 43758.5453123;
    return noise - Math.floor(noise);
};

const normalizeWordInput = (word: string): string =>
    word.trim().replace(/\s+/g, " ").toLowerCase();

const normalizeVector = (vector: Point): Point => {
    const length = Math.hypot(vector.x, vector.y);
    if (length <= 0.0001) {
        return { x: 1, y: 0 };
    }

    return {
        x: vector.x / length,
        y: vector.y / length
    };
};

const interpolatePoints = (startPoint: Point, endPoint: Point, ratio: number): Point => ({
    x: startPoint.x + (endPoint.x - startPoint.x) * ratio,
    y: startPoint.y + (endPoint.y - startPoint.y) * ratio
});

const setStatus = (message: string | null) => {
    if (!message) {
        statusEl.hidden = true;
        statusEl.textContent = "";
        return;
    }

    statusEl.hidden = false;
    statusEl.textContent = message;
};

const syncWordUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("word");

    if (currentWord !== DEFAULT_WORD && currentWord.length > 0) {
        url.searchParams.set("word", currentWord);
    }

    const nextUrl = `${url.pathname}${url.search}${url.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl !== currentUrl) {
        window.history.replaceState(null, "", nextUrl);
    }
};

const applyUrlSettings = () => {
    const params = new URLSearchParams(window.location.search);
    const wordParam = params.get("word");
    if (wordParam !== null) {
        currentWord = normalizeWordInput(wordParam);
    }
    wordInput.value = currentWord;
};

const interpolateSamplePose = (
    samples: TracingSample[],
    distanceAlongStroke: number
): { point: Point; tangent: Point } => {
    if (samples.length === 0) {
        return {
            point: { x: 0, y: 0 },
            tangent: { x: 1, y: 0 }
        };
    }

    const firstSample = samples[0];
    if (samples.length === 1 || distanceAlongStroke <= 0 || !firstSample) {
        return {
            point: firstSample ? { x: firstSample.x, y: firstSample.y } : { x: 0, y: 0 },
            tangent: firstSample?.tangent ?? { x: 1, y: 0 }
        };
    }

    for (let sampleIndex = 1; sampleIndex < samples.length; sampleIndex += 1) {
        const previousSample = samples[sampleIndex - 1];
        const currentSample = samples[sampleIndex];
        if (!previousSample || !currentSample) {
            continue;
        }
        if (distanceAlongStroke > currentSample.distanceAlongStroke) {
            continue;
        }

        const span = currentSample.distanceAlongStroke - previousSample.distanceAlongStroke;
        const ratio = span > 0 ? (distanceAlongStroke - previousSample.distanceAlongStroke) / span : 0;
        return {
            point: interpolatePoints(previousSample, currentSample, ratio),
            tangent: normalizeVector({
                x: previousSample.tangent.x + (currentSample.tangent.x - previousSample.tangent.x) * ratio,
                y: previousSample.tangent.y + (currentSample.tangent.y - previousSample.tangent.y) * ratio
            })
        };
    }

    const lastSample = samples[samples.length - 1];
    return {
        point: lastSample ? { x: lastSample.x, y: lastSample.y } : { x: 0, y: 0 },
        tangent: lastSample?.tangent ?? { x: 1, y: 0 }
    };
};

const getPoseAtOverallDistance = (
    preparedPath: PreparedTracingPath,
    targetDistance: number
): { point: Point; tangent: Point; stroke: PreparedStroke | null } => {
    let remainingDistance = targetDistance;

    for (let strokeIndex = 0; strokeIndex < preparedPath.strokes.length; strokeIndex += 1) {
        const stroke = preparedPath.strokes[strokeIndex];
        if (!stroke) {
            continue;
        }

        const isLastStroke = strokeIndex === preparedPath.strokes.length - 1;
        if (remainingDistance <= stroke.totalLength || isLastStroke) {
            const pose = interpolateSamplePose(
                stroke.samples,
                clamp(remainingDistance, 0, Math.max(stroke.totalLength, 0))
            );
            return { ...pose, stroke };
        }

        remainingDistance -= stroke.totalLength;
    }

    return {
        point: { x: 0, y: 0 },
        tangent: { x: 1, y: 0 },
        stroke: null
    };
};

const buildPathDFromOverallDistanceRange = (
    preparedPath: PreparedTracingPath,
    startDistance: number,
    endDistance: number
): string => {
    if (endDistance < startDistance) {
        return "";
    }

    const commands: string[] = [];
    let strokeOffset = 0;

    preparedPath.strokes.forEach((stroke) => {
        const strokeStart = strokeOffset;
        const strokeEnd = strokeOffset + stroke.totalLength;
        strokeOffset = strokeEnd;

        if (endDistance < strokeStart || startDistance > strokeEnd || stroke.samples.length === 0) {
            return;
        }

        if (stroke.totalLength <= 0.001) {
            const dotSample = stroke.samples[0];
            if (dotSample && endDistance >= strokeStart) {
                commands.push(`M ${dotSample.x - 0.1} ${dotSample.y} L ${dotSample.x + 0.1} ${dotSample.y}`);
            }
            return;
        }

        const localStart = Math.max(0, startDistance - strokeStart);
        const localEnd = Math.min(stroke.totalLength, endDistance - strokeStart);
        if (localEnd < localStart) {
            return;
        }

        const startPose = interpolateSamplePose(stroke.samples, localStart);
        const endPose = interpolateSamplePose(stroke.samples, localEnd);
        const points: Point[] = [
            startPose.point,
            ...stroke.samples
                .filter(
                    (sample) =>
                        sample.distanceAlongStroke > localStart && sample.distanceAlongStroke < localEnd
                )
                .map((sample) => ({ x: sample.x, y: sample.y })),
            endPose.point
        ];

        const dedupedPoints = points.filter((point, pointIndex) => {
            const previousPoint = points[pointIndex - 1];
            return !previousPoint || Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y) > 0.01;
        });

        if (dedupedPoints.length === 0) {
            return;
        }

        const firstPoint = dedupedPoints[0];
        if (!firstPoint) {
            return;
        }
        commands.push(`M ${firstPoint.x} ${firstPoint.y}`);
        dedupedPoints.slice(1).forEach((point) => {
            commands.push(`L ${point.x} ${point.y}`);
        });
    });

    return commands.join(" ");
};

const getTotalPathLength = (preparedPath: PreparedTracingPath): number =>
    preparedPath.strokes.reduce((total, stroke) => total + stroke.totalLength, 0);

const pruneWaypoints = (waypoints: Waypoint[]): Waypoint[] => {
    if (waypoints.length <= MAX_WAYPOINTS) {
        return waypoints;
    }

    const lastWaypoint = waypoints[waypoints.length - 1];
    const stride = (waypoints.length - 1) / (MAX_WAYPOINTS - 1);
    const pruned = Array.from({ length: MAX_WAYPOINTS - 1 }, (_unused, waypointIndex) => {
        const sourceIndex = Math.round(waypointIndex * stride);
        return waypoints[sourceIndex];
    }).filter((waypoint): waypoint is Waypoint => Boolean(waypoint));

    if (lastWaypoint && pruned[pruned.length - 1] !== lastWaypoint) {
        pruned.push(lastWaypoint);
    }

    return pruned.slice(0, MAX_WAYPOINTS).map((waypoint, waypointIndex, allWaypoints) => ({
        ...waypoint,
        isFinale: waypointIndex === allWaypoints.length - 1
    }));
};

const buildWaypoints = (preparedPath: PreparedTracingPath): Waypoint[] => {
    const totalLength = getTotalPathLength(preparedPath);
    const groupAnalysis = analyzeTracingGroups(preparedPath);
    const sectionAnalysis = analyzeTracingSections(preparedPath, { groups: groupAnalysis.groups });
    const sectionWaypoints = sectionAnalysis.sections.map((section, sectionIndex, sections) => ({
        distance: clamp(section.endDistance, 0, totalLength),
        point: section.endPoint,
        triggered: false,
        isFinale: sectionIndex === sections.length - 1,
        element: null
    }));

    const uniqueWaypoints: Waypoint[] = [];
    sectionWaypoints.forEach((waypoint) => {
        const previousWaypoint = uniqueWaypoints[uniqueWaypoints.length - 1];
        if (!previousWaypoint || Math.abs(previousWaypoint.distance - waypoint.distance) > 38) {
            uniqueWaypoints.push(waypoint);
            return;
        }

        if (waypoint.isFinale) {
            uniqueWaypoints[uniqueWaypoints.length - 1] = waypoint;
        }
    });

    if (uniqueWaypoints.length === 0) {
        uniqueWaypoints.push({
            distance: totalLength,
            point: getPoseAtOverallDistance(preparedPath, totalLength).point,
            triggered: false,
            isFinale: true,
            element: null
        });
    }

    return pruneWaypoints(uniqueWaypoints).map((waypoint, waypointIndex, waypointsForScene) => ({
        ...waypoint,
        isFinale: waypointIndex === waypointsForScene.length - 1
    }));
};

const svgPointToCanvas = (point: Point): CanvasPoint | null => {
    const matrix = fireworksSvg.getScreenCTM();
    if (!matrix) {
        return null;
    }

    const screenPoint = new DOMPoint(point.x, point.y).matrixTransform(matrix);
    const canvasRect = fireworksCanvas.getBoundingClientRect();
    return {
        x: screenPoint.x - canvasRect.left,
        y: screenPoint.y - canvasRect.top
    };
};

const svgPoseToCanvas = (point: Point, tangent: Point): { point: CanvasPoint; tangent: Point } | null => {
    const canvasPoint = svgPointToCanvas(point);
    const canvasTangentPoint = svgPointToCanvas({
        x: point.x + tangent.x * 18,
        y: point.y + tangent.y * 18
    });

    if (!canvasPoint || !canvasTangentPoint) {
        return null;
    }

    return {
        point: canvasPoint,
        tangent: normalizeVector({
            x: canvasTangentPoint.x - canvasPoint.x,
            y: canvasTangentPoint.y - canvasPoint.y
        })
    };
};

const createStars = (width: number, height: number): Star[] => {
    const starCount = clamp(Math.floor((width * height) / 8200), 70, 240);
    return Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.74,
        radius: randomBetween(0.45, 1.7),
        phase: randomBetween(0, TWO_PI),
        speed: randomBetween(0.0006, 0.0018)
    }));
};

const resizeCanvas = () => {
    const rect = fireworksCanvas.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.floor(rect.width));
    const nextHeight = Math.max(1, Math.floor(rect.height));
    const nextDevicePixelRatio = Math.min(window.devicePixelRatio || 1, 2.5);
    const nextCanvasWidth = Math.floor(nextWidth * nextDevicePixelRatio);
    const nextCanvasHeight = Math.floor(nextHeight * nextDevicePixelRatio);

    if (
        fireworksCanvas.width === nextCanvasWidth &&
        fireworksCanvas.height === nextCanvasHeight &&
        canvasDevicePixelRatio === nextDevicePixelRatio
    ) {
        return;
    }

    canvasCssWidth = nextWidth;
    canvasCssHeight = nextHeight;
    canvasDevicePixelRatio = nextDevicePixelRatio;
    fireworksCanvas.width = nextCanvasWidth;
    fireworksCanvas.height = nextCanvasHeight;
    fireworksContext.setTransform(
        canvasDevicePixelRatio,
        0,
        0,
        canvasDevicePixelRatio,
        0,
        0
    );
    stars = createStars(canvasCssWidth, canvasCssHeight);
    if (currentScene) {
        currentScene.smoulderSampleCache = null;
    }
    needsHardCanvasClear = true;
};

const getSmoulderSampleCache = (scene: Scene): SmoulderSampleCache | null => {
    const cachedSamples = scene.smoulderSampleCache;
    if (
        cachedSamples &&
        cachedSamples.width === canvasCssWidth &&
        cachedSamples.height === canvasCssHeight &&
        cachedSamples.devicePixelRatio === canvasDevicePixelRatio
    ) {
        return cachedSamples;
    }

    const matrix = fireworksSvg.getScreenCTM();
    if (!matrix) {
        return null;
    }

    const canvasRect = fireworksCanvas.getBoundingClientRect();
    const projectPoint = (point: Point): CanvasPoint => {
        const screenPoint = new DOMPoint(point.x, point.y).matrixTransform(matrix);
        return {
            x: screenPoint.x - canvasRect.left,
            y: screenPoint.y - canvasRect.top
        };
    };
    const sampleCount = Math.min(
        SMOULDER_MAX_SAMPLES,
        Math.max(8, Math.floor(scene.totalLength / SMOULDER_SAMPLE_SPACING))
    );
    const stepDistance = scene.totalLength / sampleCount;
    const samples: SmoulderSample[] = [];

    for (let sampleIndex = 0; sampleIndex <= sampleCount; sampleIndex += 1) {
        const distance = Math.min(scene.totalLength, sampleIndex * stepDistance);
        const pose = getPoseAtOverallDistance(scene.preparedPath, distance);
        const canvasPoint = projectPoint(pose.point);
        const tangentPoint = projectPoint({
            x: pose.point.x + pose.tangent.x * 18,
            y: pose.point.y + pose.tangent.y * 18
        });
        const tangent = normalizeVector({
            x: tangentPoint.x - canvasPoint.x,
            y: tangentPoint.y - canvasPoint.y
        });
        const seed = distance * 0.071 + sampleIndex * 8.37;
        samples.push({
            distance,
            x: canvasPoint.x,
            y: canvasPoint.y,
            tangentX: tangent.x,
            tangentY: tangent.y,
            normalX: -tangent.y,
            normalY: tangent.x,
            emberNoise: noiseUnit(seed),
            pocketNoise: noiseUnit(seed + 91.7)
        });
    }

    scene.smoulderSampleCache = {
        width: canvasCssWidth,
        height: canvasCssHeight,
        devicePixelRatio: canvasDevicePixelRatio,
        samples
    };
    return scene.smoulderSampleCache;
};

const drawBackdrop = (now: number) => {
    fireworksContext.globalCompositeOperation = "source-over";
    fireworksContext.fillStyle = needsHardCanvasClear
        ? `rgba(4, 7, 21, ${HARD_CLEAR_ALPHA})`
        : `rgba(4, 7, 21, ${TRAIL_CLEAR_ALPHA})`;
    fireworksContext.fillRect(0, 0, canvasCssWidth, canvasCssHeight);

    const horizonGradient = fireworksContext.createLinearGradient(0, 0, 0, canvasCssHeight);
    horizonGradient.addColorStop(0, "rgba(12, 20, 54, 0.38)");
    horizonGradient.addColorStop(0.46, "rgba(4, 7, 21, 0.08)");
    horizonGradient.addColorStop(1, "rgba(19, 11, 33, 0.42)");
    fireworksContext.fillStyle = horizonGradient;
    fireworksContext.fillRect(0, 0, canvasCssWidth, canvasCssHeight);

    fireworksContext.globalCompositeOperation = "lighter";
    stars.forEach((star) => {
        const twinkle = 0.45 + Math.sin(now * star.speed + star.phase) * 0.32;
        fireworksContext.fillStyle = `rgba(225, 239, 255, ${clamp(twinkle, 0.12, 0.8)})`;
        fireworksContext.beginPath();
        fireworksContext.arc(star.x, star.y, star.radius, 0, TWO_PI);
        fireworksContext.fill();
    });
};

const pushParticle = (particle: Particle) => {
    particles.push(particle);
    if (particles.length > MAX_PARTICLES) {
        particles.splice(0, particles.length - MAX_PARTICLES);
    }
};

const pushFlash = (flash: Flash) => {
    flashes.push(flash);
    if (flashes.length > 24) {
        flashes.splice(0, flashes.length - 24);
    }
};

const spawnBurstParticle = (
    point: CanvasPoint,
    angle: number,
    speed: number,
    options: {
        hue: number;
        saturation?: [number, number];
        lightness?: [number, number];
        life?: [number, number];
        size?: [number, number];
        gravity?: [number, number];
        drag?: [number, number];
        kind?: ParticleKind;
    }
) => {
    const saturation = options.saturation ?? [82, 100];
    const lightness = options.lightness ?? [54, 76];
    const life = options.life ?? [1.0, 1.9];
    const size = options.size ?? [1.2, 3.8];
    const gravity = options.gravity ?? [62, 118];
    const drag = options.drag ?? [0.965, 0.985];

    pushParticle({
        x: point.x,
        y: point.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        age: 0,
        life: randomBetween(life[0], life[1]),
        size: randomBetween(size[0], size[1]),
        hue: options.hue,
        saturation: randomBetween(saturation[0], saturation[1]),
        lightness: randomBetween(lightness[0], lightness[1]),
        gravity: randomBetween(gravity[0], gravity[1]),
        drag: randomBetween(drag[0], drag[1]),
        kind: options.kind ?? "shell"
    });
};

const spawnFuseSparks = (point: CanvasPoint, tangent: Point, deltaSeconds: number) => {
    const normal = { x: -tangent.y, y: tangent.x };
    const sparkCount = Math.max(2, Math.floor(randomBetween(95, 190) * deltaSeconds));

    for (let sparkIndex = 0; sparkIndex < sparkCount; sparkIndex += 1) {
        const sideVelocity = randomBetween(-190, 190);
        const backwardVelocity = randomBetween(80, 260);
        const liftVelocity = randomBetween(-220, -30);
        pushParticle({
            x: point.x + randomBetween(-4, 4),
            y: point.y + randomBetween(-4, 4),
            vx: -tangent.x * backwardVelocity + normal.x * sideVelocity,
            vy: -tangent.y * backwardVelocity + normal.y * sideVelocity + liftVelocity,
            age: 0,
            life: randomBetween(0.32, 0.82),
            size: randomBetween(1.1, 3.6),
            hue: randomBetween(26, 52),
            saturation: randomBetween(90, 100),
            lightness: randomBetween(54, 72),
            gravity: randomBetween(260, 430),
            drag: randomBetween(0.88, 0.94),
            kind: "fuse"
        });
    }

    if (Math.random() < deltaSeconds * 22) {
        pushParticle({
            x: point.x - tangent.x * randomBetween(8, 28) + randomBetween(-4, 4),
            y: point.y - tangent.y * randomBetween(8, 28) + randomBetween(-4, 4),
            vx: -tangent.x * randomBetween(12, 46) + normal.x * randomBetween(-38, 38),
            vy: -tangent.y * randomBetween(12, 46) + normal.y * randomBetween(-38, 38) - randomBetween(12, 52),
            age: 0,
            life: randomBetween(0.8, 1.45),
            size: randomBetween(2.5, 6.2),
            hue: randomBetween(8, 34),
            saturation: randomBetween(86, 100),
            lightness: randomBetween(42, 68),
            gravity: randomBetween(40, 95),
            drag: randomBetween(0.94, 0.98),
            kind: "ember"
        });
    }
};

const spawnFuseSmoke = (point: CanvasPoint, tangent: Point, deltaSeconds: number) => {
    const normal = { x: -tangent.y, y: tangent.x };
    const smokeChance = Math.min(0.94, deltaSeconds * 56);

    if (Math.random() >= smokeChance) {
        return;
    }

    const smokePalette = [194, 212, 284, 318, 24, 46] as const;
    const smokeCount = Math.random() < 0.42 ? 3 : Math.random() < 0.74 ? 2 : 1;
    for (let smokeIndex = 0; smokeIndex < smokeCount; smokeIndex += 1) {
        const hue = smokePalette[Math.floor(Math.random() * smokePalette.length)] ?? 212;
        pushParticle({
            x: point.x - tangent.x * randomBetween(6, 44) + normal.x * randomBetween(-24, 24),
            y: point.y - tangent.y * randomBetween(6, 44) + normal.y * randomBetween(-18, 18),
            vx: -tangent.x * randomBetween(14, 64) + normal.x * randomBetween(-34, 34),
            vy: -randomBetween(28, 92),
            age: 0,
            life: randomBetween(1.45, 3.15),
            size: randomBetween(14, 34),
            hue: hue + randomBetween(-10, 10),
            saturation: randomBetween(28, 62),
            lightness: randomBetween(56, 76),
            gravity: randomBetween(-20, 4),
            drag: randomBetween(0.965, 0.989),
            kind: "smoke"
        });
    }
};

const spawnIgnitionBurst = (point: CanvasPoint, isFinale: boolean) => {
    const sparkCount = isFinale ? 130 : 58;

    for (let sparkIndex = 0; sparkIndex < sparkCount; sparkIndex += 1) {
        const angle = randomBetween(-Math.PI, 0);
        const speed = randomBetween(isFinale ? 120 : 70, isFinale ? 430 : 260);
        pushParticle({
            x: point.x,
            y: point.y,
            vx: Math.cos(angle) * speed + randomBetween(-70, 70),
            vy: Math.sin(angle) * speed + randomBetween(-80, 70),
            age: 0,
            life: randomBetween(0.42, isFinale ? 1.15 : 0.82),
            size: randomBetween(1.4, isFinale ? 6 : 4),
            hue: randomBetween(18, 58),
            saturation: 100,
            lightness: randomBetween(55, 76),
            gravity: randomBetween(180, 360),
            drag: randomBetween(0.9, 0.96),
            kind: "fuse"
        });
    }
};

const createRocketTarget = (origin: CanvasPoint, isFinale: boolean): CanvasPoint => {
    const spread = isFinale
        ? Math.min(360, canvasCssWidth * 0.34)
        : Math.min(190, canvasCssWidth * 0.24);
    const maxTargetX = Math.max(52, canvasCssWidth - 52);
    const targetX = clamp(origin.x + randomBetween(-spread, spread), 52, maxTargetX);
    const lift = randomBetween(isFinale ? 330 : 220, isFinale ? 590 : 410);
    const upperBand = Math.max(58, canvasCssHeight * (isFinale ? 0.46 : 0.52));
    const targetY = clamp(origin.y - lift, 42, upperBand);

    return { x: targetX, y: targetY };
};

const FIREWORK_PATTERNS: FireworkPattern[] = [
    "peony",
    "ring",
    "willow",
    "palm",
    "strobe",
    "chrysanthemum"
];

const chooseFireworkPattern = (launchIndex: number, isFinale: boolean): FireworkPattern => {
    if (isFinale) {
        return FIREWORK_PATTERNS[launchIndex % FIREWORK_PATTERNS.length] ?? "peony";
    }

    return FIREWORK_PATTERNS[Math.floor(Math.random() * FIREWORK_PATTERNS.length)] ?? "peony";
};

const queueWaypointFireworks = (origin: CanvasPoint, isFinale: boolean) => {
    const launchCount = isFinale ? 11 : Math.random() < 0.54 ? 2 : 1;

    for (let launchIndex = 0; launchIndex < launchCount; launchIndex += 1) {
        pendingLaunches.push({
            origin: { ...origin },
            target: createRocketTarget(origin, isFinale),
            delayMs: isFinale ? launchIndex * randomBetween(80, 150) : launchIndex * randomBetween(90, 170),
            hue: randomBetween(0, 360),
            power: isFinale ? randomBetween(1.1, 1.55) : randomBetween(0.78, 1.15),
            isFinale,
            pattern: chooseFireworkPattern(launchIndex, isFinale)
        });
    }
};

const launchRocket = (launch: PendingLaunch) => {
    if (rockets.length >= MAX_ROCKETS) {
        rockets.shift();
    }

    rockets.push({
        start: launch.origin,
        target: launch.target,
        x: launch.origin.x,
        y: launch.origin.y,
        ageMs: 0,
        durationMs: randomBetween(520, 760),
        hue: launch.hue,
        power: launch.power,
        isFinale: launch.isFinale,
        pattern: launch.pattern,
        trail: [{ ...launch.origin }]
    });
};

const updatePendingLaunches = (deltaSeconds: number) => {
    const readyLaunches: PendingLaunch[] = [];
    pendingLaunches = pendingLaunches.filter((launch) => {
        launch.delayMs -= deltaSeconds * 1000;
        if (launch.delayMs <= 0) {
            readyLaunches.push(launch);
            return false;
        }
        return true;
    });
    readyLaunches.forEach(launchRocket);
};

const spawnRocketTrail = (rocket: Rocket) => {
    const trailCount = Math.random() < 0.62 ? 2 : 1;

    for (let trailIndex = 0; trailIndex < trailCount; trailIndex += 1) {
        pushParticle({
            x: rocket.x + randomBetween(-2.5, 2.5),
            y: rocket.y + randomBetween(-2.5, 2.5),
            vx: randomBetween(-38, 38),
            vy: randomBetween(35, 115),
            age: 0,
            life: randomBetween(0.34, 0.68),
            size: randomBetween(1, 2.8),
            hue: rocket.hue + randomBetween(-18, 18),
            saturation: 100,
            lightness: randomBetween(62, 82),
            gravity: 130,
            drag: 0.92,
            kind: "rocket"
        });
    }
};

const explodePeony = (rocket: Rocket) => {
    const shellCount = Math.floor((rocket.isFinale ? 210 : 116) * rocket.power);
    const ringOffset = randomBetween(0, TWO_PI);

    for (let particleIndex = 0; particleIndex < shellCount; particleIndex += 1) {
        const angle = (particleIndex / shellCount) * TWO_PI + ringOffset + randomBetween(-0.035, 0.035);
        const speed = randomBetween(80, rocket.isFinale ? 345 : 255) * rocket.power;
        const secondaryRing = particleIndex % 5 === 0 ? 0.58 : 1;
        spawnBurstParticle({ x: rocket.x, y: rocket.y }, angle, speed * secondaryRing, {
            hue: rocket.hue + randomBetween(-34, 34),
            life: [1.0, rocket.isFinale ? 2.45 : 1.9],
            size: [1.2, rocket.isFinale ? 4.9 : 3.8]
        });
    }
};

const explodeRing = (rocket: Rocket) => {
    const shellCount = Math.floor((rocket.isFinale ? 180 : 96) * rocket.power);
    const ringOffset = randomBetween(0, TWO_PI);
    const point = { x: rocket.x, y: rocket.y };

    for (let particleIndex = 0; particleIndex < shellCount; particleIndex += 1) {
        const angle = (particleIndex / shellCount) * TWO_PI + ringOffset;
        const speed = randomBetween(170, rocket.isFinale ? 315 : 255) * rocket.power;
        spawnBurstParticle(point, angle + randomBetween(-0.015, 0.015), speed, {
            hue: rocket.hue + randomBetween(-18, 18),
            life: [1.05, 1.9],
            size: [1.0, 3.4],
            gravity: [34, 78],
            drag: [0.972, 0.988]
        });
    }

    for (let particleIndex = 0; particleIndex < shellCount * 0.44; particleIndex += 1) {
        const angle = (particleIndex / (shellCount * 0.44)) * TWO_PI - ringOffset;
        spawnBurstParticle(point, angle, randomBetween(82, 128) * rocket.power, {
            hue: rocket.hue + 150 + randomBetween(-16, 16),
            life: [0.9, 1.45],
            size: [0.8, 2.5],
            gravity: [32, 72],
            drag: [0.972, 0.988]
        });
    }
};

const explodeWillow = (rocket: Rocket) => {
    const shellCount = Math.floor((rocket.isFinale ? 170 : 92) * rocket.power);
    const point = { x: rocket.x, y: rocket.y };

    for (let particleIndex = 0; particleIndex < shellCount; particleIndex += 1) {
        const angle = randomBetween(-Math.PI * 0.96, -Math.PI * 0.04);
        const speed = randomBetween(92, rocket.isFinale ? 285 : 218) * rocket.power;
        spawnBurstParticle(point, angle, speed, {
            hue: randomBetween(38, 54),
            saturation: [58, 88],
            lightness: [56, 82],
            life: [1.7, rocket.isFinale ? 3.3 : 2.55],
            size: [1.0, rocket.isFinale ? 4.4 : 3.4],
            gravity: [148, 228],
            drag: [0.982, 0.994],
            kind: "willow"
        });
    }
};

const explodePalm = (rocket: Rocket) => {
    const armCount = rocket.isFinale ? 9 : 7;
    const point = { x: rocket.x, y: rocket.y };

    for (let armIndex = 0; armIndex < armCount; armIndex += 1) {
        const armAngle = -Math.PI + (armIndex / (armCount - 1)) * Math.PI + randomBetween(-0.08, 0.08);
        const armParticles = Math.floor((rocket.isFinale ? 26 : 18) * rocket.power);
        for (let particleIndex = 0; particleIndex < armParticles; particleIndex += 1) {
            const speed = randomBetween(80, 275) * rocket.power * (0.65 + particleIndex / armParticles);
            spawnBurstParticle(point, armAngle + randomBetween(-0.07, 0.07), speed, {
                hue: randomBetween(24, 48),
                saturation: [84, 100],
                lightness: [54, 78],
                life: [1.1, 2.25],
                size: [1.0, 3.8],
                gravity: [96, 170],
                drag: [0.966, 0.986],
                kind: particleIndex % 3 === 0 ? "crackle" : "shell"
            });
        }
    }
};

const explodeStrobe = (rocket: Rocket) => {
    const shellCount = Math.floor((rocket.isFinale ? 190 : 110) * rocket.power);
    const point = { x: rocket.x, y: rocket.y };

    for (let particleIndex = 0; particleIndex < shellCount; particleIndex += 1) {
        const angle = randomBetween(0, TWO_PI);
        const speed = randomBetween(74, rocket.isFinale ? 320 : 240) * rocket.power;
        spawnBurstParticle(point, angle, speed, {
            hue: particleIndex % 2 === 0 ? rocket.hue : rocket.hue + 190,
            saturation: [40, 100],
            lightness: [70, 96],
            life: [0.8, 1.8],
            size: [0.8, 3.2],
            gravity: [34, 95],
            drag: [0.95, 0.982],
            kind: "strobe"
        });
    }
};

const explodeChrysanthemum = (rocket: Rocket) => {
    explodePeony(rocket);
    const crackleCount = Math.floor((rocket.isFinale ? 120 : 54) * rocket.power);
    const point = { x: rocket.x, y: rocket.y };

    for (let crackleIndex = 0; crackleIndex < crackleCount; crackleIndex += 1) {
        const angle = randomBetween(0, TWO_PI);
        const speed = randomBetween(120, rocket.isFinale ? 460 : 340) * rocket.power;
        spawnBurstParticle(point, angle, speed, {
            hue: randomBetween(42, 58),
            saturation: [20, 55],
            lightness: [78, 96],
            life: [0.42, 1.2],
            size: [0.8, 2.4],
            gravity: [90, 150],
            drag: [0.94, 0.975],
            kind: "crackle"
        });
    }
};

const explodeRocket = (rocket: Rocket) => {
    pushFlash({
        x: rocket.x,
        y: rocket.y,
        age: 0,
        life: rocket.isFinale ? 0.5 : 0.34,
        radius: randomBetween(120, rocket.isFinale ? 280 : 190) * rocket.power,
        hue: rocket.hue,
        alpha: rocket.isFinale ? 0.58 : 0.42
    });

    if (rocket.pattern === "ring") {
        explodeRing(rocket);
    } else if (rocket.pattern === "willow") {
        explodeWillow(rocket);
    } else if (rocket.pattern === "palm") {
        explodePalm(rocket);
    } else if (rocket.pattern === "strobe") {
        explodeStrobe(rocket);
    } else if (rocket.pattern === "chrysanthemum") {
        explodeChrysanthemum(rocket);
    } else {
        explodePeony(rocket);
    }
};

const updateRockets = (deltaSeconds: number) => {
    const activeRockets: Rocket[] = [];

    rockets.forEach((rocket) => {
        rocket.ageMs += deltaSeconds * 1000;
        const progress = clamp(rocket.ageMs / rocket.durationMs, 0, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        const arc = Math.sin(progress * Math.PI) * randomBetween(18, 42);

        rocket.x = rocket.start.x + (rocket.target.x - rocket.start.x) * easedProgress;
        rocket.y = rocket.start.y + (rocket.target.y - rocket.start.y) * easedProgress - arc;
        rocket.trail.push({ x: rocket.x, y: rocket.y });
        if (rocket.trail.length > 13) {
            rocket.trail.shift();
        }
        spawnRocketTrail(rocket);

        if (progress >= 1) {
            explodeRocket(rocket);
            return;
        }

        activeRockets.push(rocket);
    });

    rockets = activeRockets;
};

const updateParticles = (deltaSeconds: number) => {
    const liveParticles: Particle[] = [];

    particles.forEach((particle) => {
        particle.age += deltaSeconds;
        if (particle.age >= particle.life) {
            return;
        }

        const dragAmount = particle.drag ** (deltaSeconds * 60);
        particle.vx *= dragAmount;
        particle.vy = particle.vy * dragAmount + particle.gravity * deltaSeconds;
        particle.x += particle.vx * deltaSeconds;
        particle.y += particle.vy * deltaSeconds;
        liveParticles.push(particle);
    });

    particles = liveParticles;
};

const updateFlashes = (deltaSeconds: number) => {
    flashes = flashes.filter((flash) => {
        flash.age += deltaSeconds;
        return flash.age < flash.life;
    });
};

const drawRockets = () => {
    fireworksContext.lineCap = "round";
    rockets.forEach((rocket) => {
        for (let pointIndex = 1; pointIndex < rocket.trail.length; pointIndex += 1) {
            const previousPoint = rocket.trail[pointIndex - 1];
            const point = rocket.trail[pointIndex];
            if (!previousPoint || !point) {
                continue;
            }

            const alpha = pointIndex / rocket.trail.length;
            fireworksContext.strokeStyle = `hsla(${rocket.hue}, 100%, 68%, ${alpha * 0.55})`;
            fireworksContext.lineWidth = 1 + alpha * 3.2;
            fireworksContext.beginPath();
            fireworksContext.moveTo(previousPoint.x, previousPoint.y);
            fireworksContext.lineTo(point.x, point.y);
            fireworksContext.stroke();
        }

        fireworksContext.fillStyle = `hsla(${rocket.hue}, 100%, 78%, 0.95)`;
        fireworksContext.beginPath();
        fireworksContext.arc(rocket.x, rocket.y, 3.8 * rocket.power, 0, TWO_PI);
        fireworksContext.fill();
    });
};

const drawParticles = () => {
    fireworksContext.lineCap = "round";

    particles.forEach((particle) => {
        if (particle.kind === "smoke") {
            return;
        }

        const lifeRatio = clamp(particle.age / particle.life, 0, 1);
        const strobeAlpha = particle.kind === "strobe"
            ? Math.max(0.12, Math.sin(particle.age * 58 + particle.x * 0.13) > 0 ? 1 : 0.18)
            : 1;
        const alpha = ((1 - lifeRatio) ** (particle.kind === "fuse" || particle.kind === "ember" ? 1.1 : 1.55)) * strobeAlpha;
        const tailScale = particle.kind === "shell" || particle.kind === "crackle" || particle.kind === "willow" || particle.kind === "strobe" ? 0.046 : 0.028;
        const strokeAlpha = alpha * (particle.kind === "fuse" || particle.kind === "ember" ? 0.88 : 0.62);

        fireworksContext.strokeStyle = `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, ${strokeAlpha})`;
        fireworksContext.lineWidth = Math.max(0.8, particle.size * (1 - lifeRatio * 0.35));
        fireworksContext.beginPath();
        fireworksContext.moveTo(particle.x, particle.y);
        fireworksContext.lineTo(
            particle.x - particle.vx * tailScale,
            particle.y - particle.vy * tailScale
        );
        fireworksContext.stroke();

        if (particle.size < 1.1 || alpha < 0.05) {
            return;
        }

        fireworksContext.fillStyle = `hsla(${particle.hue}, ${particle.saturation}%, ${Math.min(
            96,
            particle.lightness + 12
        )}%, ${alpha})`;
        fireworksContext.beginPath();
        fireworksContext.arc(particle.x, particle.y, particle.size * (1 - lifeRatio * 0.55), 0, TWO_PI);
        fireworksContext.fill();
    });
};

const drawSmoulderingFuse = (now: number) => {
    const scene = currentScene;
    perfStats.smoulderSamples = 0;
    if (!scene) {
        return;
    }

    const smoulderSampleCache = getSmoulderSampleCache(scene);
    if (!smoulderSampleCache) {
        return;
    }

    const elapsedMs = now - scene.startedAt;
    const progress = clamp(elapsedMs / scene.durationMs, 0, 1);
    const traveledDistance = scene.totalLength * progress;
    const finalCoolProgress = progress >= 1
        ? clamp((elapsedMs - scene.durationMs) / FINAL_COOL_MS, 0, 1)
        : 0;
    const smoulderEndDistance = progress >= 1 && finalCoolProgress >= 1
        ? scene.totalLength
        : Math.max(0, traveledDistance - HOT_BURN_DISTANCE * 0.36);

    if (smoulderEndDistance <= 1) {
        return;
    }
    const drawStride = smoulderQuality > 0.85 ? 1 : smoulderQuality > 0.62 ? 2 : 3;
    let renderedSampleCount = 0;

    fireworksContext.save();
    fireworksContext.globalCompositeOperation = "lighter";
    fireworksContext.filter = "none";
    fireworksContext.lineCap = "round";

    for (let sampleIndex = 0; sampleIndex < smoulderSampleCache.samples.length; sampleIndex += 1) {
        const sample = smoulderSampleCache.samples[sampleIndex];
        if (!sample || sample.distance > smoulderEndDistance) {
            break;
        }

        const charAge = clamp((traveledDistance - sample.distance) / Math.max(COOLING_BURN_DISTANCE, 1), 0, 1);
        const recentHeat = 1 - charAge;
        if (drawStride > 1 && sampleIndex % drawStride !== 0 && recentHeat < 0.78) {
            continue;
        }

        const shimmer = 0.52 + Math.sin(now * 0.0064 + sample.distance * 0.035 + sample.emberNoise * TWO_PI) * 0.48;
        const residualHeat = progress >= 1 ? 0.24 + (1 - finalCoolProgress) * 0.14 : 0.08;
        const intensity = clamp(
            (residualHeat + recentHeat * 0.58 + Math.max(0, sample.pocketNoise - 0.46) * 0.62)
            * (0.72 + shimmer * 0.42),
            0,
            1
        );

        if (intensity < 0.15 && sample.emberNoise < 0.72) {
            continue;
        }

        renderedSampleCount += 1;
        const lateralJitter = (sample.emberNoise - 0.5) * (20 + recentHeat * 16);
        const emberX = sample.x + sample.normalX * lateralJitter + sample.tangentX * (sample.pocketNoise - 0.5) * 10;
        const emberY = sample.y + sample.normalY * lateralJitter + sample.tangentY * (sample.pocketNoise - 0.5) * 10;
        const radius = (8 + sample.emberNoise * 16 + recentHeat * 19) * (0.82 + shimmer * 0.22);
        const hue = 16 + sample.pocketNoise * 32 + recentHeat * 6;
        const alpha = intensity * (0.2 + sample.pocketNoise * 0.36);
        const glowGradient = fireworksContext.createRadialGradient(emberX, emberY, 0, emberX, emberY, radius);
        glowGradient.addColorStop(0, `hsla(${hue + 28}, 100%, 88%, ${alpha * 0.92})`);
        glowGradient.addColorStop(0.22, `hsla(${hue + 8}, 100%, 62%, ${alpha * 0.72})`);
        glowGradient.addColorStop(0.58, `hsla(${hue - 8}, 96%, 38%, ${alpha * 0.28})`);
        glowGradient.addColorStop(1, `hsla(${hue - 14}, 88%, 18%, 0)`);
        fireworksContext.fillStyle = glowGradient;
        fireworksContext.beginPath();
        fireworksContext.arc(emberX, emberY, radius, 0, TWO_PI);
        fireworksContext.fill();

        if (sample.pocketNoise < 0.42 && recentHeat < 0.22) {
            continue;
        }

        const veinLength = 13 + recentHeat * 30 + sample.emberNoise * 18;
        const veinAlpha = clamp(alpha * (0.7 + recentHeat * 0.5), 0, 0.72);
        fireworksContext.strokeStyle = `hsla(${hue + 12}, 100%, ${66 + recentHeat * 16}%, ${veinAlpha})`;
        fireworksContext.lineWidth = 1.1 + recentHeat * 2.5 + sample.pocketNoise * 1.8;
        fireworksContext.beginPath();
        fireworksContext.moveTo(
            emberX - sample.tangentX * veinLength * 0.52,
            emberY - sample.tangentY * veinLength * 0.52
        );
        fireworksContext.lineTo(
            emberX + sample.tangentX * veinLength * 0.48,
            emberY + sample.tangentY * veinLength * 0.48
        );
        fireworksContext.stroke();
    }

    perfStats.smoulderSamples = renderedSampleCount;
    fireworksContext.restore();
};

const drawSmokeParticles = () => {
    fireworksContext.save();
    fireworksContext.globalCompositeOperation = "source-over";
    fireworksContext.filter = "none";
    const smokeDrawStride = particles.length > 3200 ? 2 : 1;
    let smokeIndex = 0;

    particles.forEach((particle) => {
        if (particle.kind !== "smoke") {
            return;
        }

        smokeIndex += 1;
        if (smokeDrawStride > 1 && smokeIndex % smokeDrawStride !== 0) {
            return;
        }

        const lifeRatio = clamp(particle.age / particle.life, 0, 1);
        const alpha = 0.18 * (1 - lifeRatio) ** 1.8;
        const radius = particle.size * (1.2 + lifeRatio * 1.9);
        const gradient = fireworksContext.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            radius
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness + 8}%, ${alpha * 1.35})`);
        gradient.addColorStop(0.48, `hsla(${particle.hue + 18}, ${Math.max(18, particle.saturation - 12)}%, ${particle.lightness}%, ${alpha * 0.72})`);
        gradient.addColorStop(1, `hsla(${particle.hue + 36}, ${Math.max(10, particle.saturation - 22)}%, ${particle.lightness - 8}%, 0)`);
        fireworksContext.fillStyle = gradient;
        fireworksContext.beginPath();
        fireworksContext.arc(particle.x, particle.y, radius, 0, TWO_PI);
        fireworksContext.fill();
    });

    fireworksContext.restore();
};

const drawFlashes = () => {
    flashes.forEach((flash) => {
        const lifeRatio = clamp(flash.age / flash.life, 0, 1);
        const radius = flash.radius * (0.35 + lifeRatio * 0.82);
        const alpha = flash.alpha * (1 - lifeRatio) ** 1.8;
        const gradient = fireworksContext.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, radius);
        gradient.addColorStop(0, `hsla(${flash.hue}, 100%, 88%, ${alpha})`);
        gradient.addColorStop(0.28, `hsla(${flash.hue}, 100%, 64%, ${alpha * 0.42})`);
        gradient.addColorStop(1, `hsla(${flash.hue}, 100%, 52%, 0)`);
        fireworksContext.fillStyle = gradient;
        fireworksContext.beginPath();
        fireworksContext.arc(flash.x, flash.y, radius, 0, TWO_PI);
        fireworksContext.fill();
    });
};

const triggerWaypoint = (waypoint: Waypoint) => {
    if (waypoint.triggered) {
        return;
    }

    waypoint.triggered = true;
    waypoint.element?.classList.add("fireworks-app__waypoint--spent");

    const origin = svgPointToCanvas(waypoint.point);
    if (!origin) {
        return;
    }

    spawnIgnitionBurst(origin, waypoint.isFinale);
    queueWaypointFireworks(origin, waypoint.isFinale);
};

const updateFuse = (now: number, deltaSeconds: number) => {
    const scene = currentScene;
    if (!scene) {
        return;
    }

    const elapsedMs = now - scene.startedAt;
    const progress = clamp(elapsedMs / scene.durationMs, 0, 1);
    const traveledDistance = scene.totalLength * progress;
    const pose = getPoseAtOverallDistance(scene.preparedPath, traveledDistance);
    const finalCoolProgress = progress >= 1
        ? clamp((elapsedMs - scene.durationMs) / FINAL_COOL_MS, 0, 1)
        : 0;
    const shouldUpdateSvgPaths =
        now - scene.lastSvgPathUpdateAt >= SVG_PATH_UPDATE_INTERVAL_MS ||
        Math.abs(traveledDistance - scene.lastSvgPathDistance) >= SVG_PATH_UPDATE_DISTANCE ||
        Math.abs(finalCoolProgress - scene.lastSvgPathCoolProgress) >= 0.018 ||
        (progress >= 1 && finalCoolProgress >= 1 && scene.lastSvgPathCoolProgress < 1);

    if (shouldUpdateSvgPaths) {
        const hotDistance = HOT_BURN_DISTANCE * (1 - finalCoolProgress);
        const coolingDistance = COOLING_BURN_DISTANCE * (1 - finalCoolProgress);
        const spentEndDistance = Math.max(0, traveledDistance - hotDistance - coolingDistance);
        const coolingStartDistance = spentEndDistance;
        const coolingEndDistance = Math.max(spentEndDistance, traveledDistance - hotDistance);
        const hotStartDistance = coolingEndDistance;
        const hotEndDistance = traveledDistance;
        const spentPathD = progress >= 1 && finalCoolProgress >= 1
            ? scene.fullPathD
            : buildPathDFromOverallDistanceRange(scene.preparedPath, 0, spentEndDistance);
        const coolingPathD = finalCoolProgress >= 1
            ? ""
            : buildPathDFromOverallDistanceRange(
                scene.preparedPath,
                coolingStartDistance,
                coolingEndDistance
            );
        const burnedPathD = buildPathDFromOverallDistanceRange(
            scene.preparedPath,
            hotStartDistance,
            hotEndDistance
        );

        spentFusePathEl?.setAttribute("d", spentPathD);
        coolingFusePathEl?.setAttribute("d", coolingPathD);
        smoulderFusePathEl?.setAttribute("d", spentPathD);
        burnedPathEl?.setAttribute("d", burnedPathD);
        burnedGlowPathEl?.setAttribute("d", burnedPathD);
        scene.lastSvgPathUpdateAt = now;
        scene.lastSvgPathDistance = traveledDistance;
        scene.lastSvgPathCoolProgress = finalCoolProgress;
    }

    const angle = Math.atan2(pose.tangent.y, pose.tangent.x) * (180 / Math.PI);
    emberEl?.setAttribute(
        "transform",
        `translate(${pose.point.x.toFixed(2)} ${pose.point.y.toFixed(2)}) rotate(${angle.toFixed(2)})`
    );
    if (emberEl) {
        emberEl.style.opacity = progress >= 1 ? "0" : "1";
    }

    const canvasPose = svgPoseToCanvas(pose.point, pose.tangent);
    if (canvasPose && progress < 1) {
        spawnFuseSparks(canvasPose.point, canvasPose.tangent, deltaSeconds);
        spawnFuseSmoke(canvasPose.point, canvasPose.tangent, deltaSeconds);
    }

    scene.waypoints.forEach((waypoint) => {
        if (traveledDistance + 0.5 >= waypoint.distance) {
            triggerWaypoint(waypoint);
        }
    });

    if (progress >= 1 && !scene.completed) {
        scene.completed = true;
    }
};

const renderCanvasFrame = (now: number, deltaSeconds: number) => {
    let sectionStartedAt = performance.now();
    drawBackdrop(now);
    recordPerfSection("backdrop", sectionStartedAt);

    sectionStartedAt = performance.now();
    updatePendingLaunches(deltaSeconds);
    updateRockets(deltaSeconds);
    updateParticles(deltaSeconds);
    updateFlashes(deltaSeconds);
    recordPerfSection("updates", sectionStartedAt);

    sectionStartedAt = performance.now();
    drawSmokeParticles();
    recordPerfSection("smoke", sectionStartedAt);

    sectionStartedAt = performance.now();
    drawSmoulderingFuse(now);
    recordPerfSection("smoulder", sectionStartedAt);

    sectionStartedAt = performance.now();
    fireworksContext.globalCompositeOperation = "lighter";
    drawFlashes();
    drawRockets();
    recordPerfSection("effects", sectionStartedAt);

    sectionStartedAt = performance.now();
    drawParticles();
    recordPerfSection("particles", sectionStartedAt);
    needsHardCanvasClear = false;
};

const tick = (now: number) => {
    const frameStartedAt = performance.now();
    resizeCanvas();
    const deltaSeconds = Math.min(0.05, Math.max(0.001, (now - lastFrameAt) / 1000));
    lastFrameAt = now;

    const updateFuseStartedAt = performance.now();
    updateFuse(now, deltaSeconds);
    recordPerfSection("updateFuse", updateFuseStartedAt);
    renderCanvasFrame(now, deltaSeconds);
    updatePerfPanel(now, performance.now() - frameStartedAt);
    animationFrameId = requestAnimationFrame(tick);
};

const buildFuseMarkup = (scene: Scene): string => {
    const strokePaths = scene.path.strokes
        .filter((stroke) => stroke.type !== "lift")
        .map((stroke) => buildPathD(stroke.curves))
        .filter((pathD) => pathD.length > 0);
    const fusePaths = strokePaths
        .map(
            (pathD) => `
        <path class="fireworks-app__fuse-shadow" d="${pathD}"></path>
        <path class="fireworks-app__fuse-core" d="${pathD}"></path>
        <path class="fireworks-app__fuse-braid fireworks-app__fuse-braid--warm" d="${pathD}"></path>
        <path class="fireworks-app__fuse-braid fireworks-app__fuse-braid--cool" d="${pathD}"></path>
                <path class="fireworks-app__fuse-thread fireworks-app__fuse-thread--fine" d="${pathD}"></path>
      `
        )
        .join("");
    const waypointMarkup = scene.waypoints
        .map(
            (waypoint, waypointIndex) => `
        <g
          class="fireworks-app__waypoint${waypoint.isFinale ? " fireworks-app__waypoint--finale" : ""}"
          data-waypoint-index="${waypointIndex}"
          transform="translate(${waypoint.point.x} ${waypoint.point.y})"
        >
          <circle class="fireworks-app__waypoint-halo" r="45"></circle>
          <circle class="fireworks-app__waypoint-ring" r="20"></circle>
          <circle class="fireworks-app__waypoint-core" r="7"></circle>
        </g>
      `
        )
        .join("");

    return `
    <defs>
      <filter id="fireworks-fuse-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="9" result="blur"></feGaussianBlur>
        <feColorMatrix
          in="blur"
          type="matrix"
          values="1 0 0 0 0.9 0 0.62 0 0 0.22 0 0 0.18 0 0.02 0 0 0 0.92 0"
          result="warmBlur"
        ></feColorMatrix>
        <feMerge>
          <feMergeNode in="warmBlur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
            <filter id="fireworks-rope-texture" x="-12%" y="-12%" width="124%" height="124%">
                <feTurbulence type="fractalNoise" baseFrequency="0.8 0.18" numOctaves="3" seed="8" result="ropeNoise"></feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="ropeNoise" scale="2.1" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
            </filter>
            <filter id="fireworks-smoulder-glow" x="-55%" y="-55%" width="210%" height="210%" color-interpolation-filters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency="0.036 0.22" numOctaves="3" seed="14" result="smoulderNoise"></feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="smoulderNoise" scale="4.8" result="warpedSmoulder"></feDisplacementMap>
                <feGaussianBlur in="warpedSmoulder" stdDeviation="7.2" result="wideSmoulder"></feGaussianBlur>
                <feColorMatrix
                    in="wideSmoulder"
                    type="matrix"
                    values="1.5 0 0 0 0.42 0 0.44 0 0 0.06 0 0 0.08 0 0 0 0 0 0.78 0"
                    result="emberGlow"
                ></feColorMatrix>
                <feGaussianBlur in="warpedSmoulder" stdDeviation="1.6" result="hotFlecks"></feGaussianBlur>
                <feMerge>
                    <feMergeNode in="emberGlow"></feMergeNode>
                    <feMergeNode in="hotFlecks"></feMergeNode>
                    <feMergeNode in="warpedSmoulder"></feMergeNode>
                    <feMergeNode in="SourceGraphic"></feMergeNode>
                </feMerge>
            </filter>
            <filter id="fireworks-ember-head" x="-80%" y="-80%" width="260%" height="260%" color-interpolation-filters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency="0.92 1.42" numOctaves="2" seed="27" result="emberHeadNoise"></feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="emberHeadNoise" scale="3.6" result="warpedEmberHead"></feDisplacementMap>
                <feGaussianBlur in="warpedEmberHead" stdDeviation="6.8" result="emberHeadBloom"></feGaussianBlur>
                <feColorMatrix
                    in="emberHeadBloom"
                    type="matrix"
                    values="1.22 0 0 0 0.35 0 0.52 0 0 0.08 0 0 0.1 0 0.02 0 0 0 0.82 0"
                    result="emberHeadGlow"
                ></feColorMatrix>
                <feMerge>
                    <feMergeNode in="emberHeadGlow"></feMergeNode>
                    <feMergeNode in="warpedEmberHead"></feMergeNode>
                    <feMergeNode in="SourceGraphic"></feMergeNode>
                </feMerge>
            </filter>
      <radialGradient id="fireworks-ember-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#fff8b8"></stop>
        <stop offset="0.36" stop-color="#ffb229"></stop>
        <stop offset="1" stop-color="#ff3b1f" stop-opacity="0"></stop>
      </radialGradient>
            <radialGradient id="fireworks-coal-gradient" cx="42%" cy="45%" r="65%">
                <stop offset="0" stop-color="#fff4b7"></stop>
                <stop offset="0.22" stop-color="#ff9f21"></stop>
                <stop offset="0.55" stop-color="#8e1c0f"></stop>
                <stop offset="1" stop-color="#140705"></stop>
            </radialGradient>
            <radialGradient id="fireworks-flame-gradient" cx="58%" cy="50%" r="72%">
                <stop offset="0" stop-color="#fffbe0"></stop>
                <stop offset="0.28" stop-color="#ffd55c"></stop>
                <stop offset="0.58" stop-color="#ff571f"></stop>
                <stop offset="1" stop-color="#ff1f5d" stop-opacity="0"></stop>
            </radialGradient>
            <linearGradient id="fireworks-smoulder-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#ff4b24" stop-opacity="0.16"></stop>
                <stop offset="0.28" stop-color="#ffb43e" stop-opacity="0.86"></stop>
                <stop offset="0.52" stop-color="#ff2c8a" stop-opacity="0.34"></stop>
                <stop offset="0.72" stop-color="#f9f1df" stop-opacity="0.62"></stop>
                <stop offset="1" stop-color="#ff5a22" stop-opacity="0.18"></stop>
            </linearGradient>
      <linearGradient id="fireworks-burn-gradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#3c2315"></stop>
        <stop offset="0.68" stop-color="#f06920"></stop>
        <stop offset="0.86" stop-color="#ffd86b"></stop>
        <stop offset="1" stop-color="#fff7cf"></stop>
      </linearGradient>
    </defs>
    <rect class="fireworks-app__svg-shade" x="0" y="0" width="100%" height="100%"></rect>
    <g class="fireworks-app__guides">
      <line
        class="fireworks-app__guide fireworks-app__guide--xheight"
        x1="0"
        y1="${scene.path.guides.xHeight + scene.offsetY}"
        x2="${scene.width}"
        y2="${scene.path.guides.xHeight + scene.offsetY}"
      ></line>
      <line
        class="fireworks-app__guide fireworks-app__guide--baseline"
        x1="0"
        y1="${scene.path.guides.baseline + scene.offsetY}"
        x2="${scene.width}"
        y2="${scene.path.guides.baseline + scene.offsetY}"
      ></line>
    </g>
    <g class="fireworks-app__fuse-layer">${fusePaths}</g>
    <path class="fireworks-app__spent-fuse" id="fireworks-spent-fuse" d=""></path>
    <path class="fireworks-app__cooling-fuse" id="fireworks-cooling-fuse" d=""></path>
    <path class="fireworks-app__smoulder-fuse" id="fireworks-smoulder-fuse" d=""></path>
    <path class="fireworks-app__burned-glow" id="fireworks-burned-glow" d=""></path>
    <path class="fireworks-app__burned-path" id="fireworks-burned-path" d=""></path>
    <g class="fireworks-app__waypoints">${waypointMarkup}</g>
    <g class="fireworks-app__ember" id="fireworks-ember" opacity="0">
            <circle class="fireworks-app__ember-heat" r="76"></circle>
      <circle class="fireworks-app__ember-aura" r="58"></circle>
            <ellipse class="fireworks-app__ember-coal" cx="-14" cy="2" rx="28" ry="16"></ellipse>
            <ellipse class="fireworks-app__ember-flame" cx="-4" cy="0" rx="34" ry="18"></ellipse>
            <ellipse class="fireworks-app__ember-flame-core" cx="5" cy="0" rx="14" ry="8"></ellipse>
            <circle class="fireworks-app__ember-core" r="7"></circle>
    </g>
  `;
};

const assignWaypointElements = (scene: Scene) => {
    scene.waypoints.forEach((waypoint, waypointIndex) => {
        waypoint.element = fireworksSvg.querySelector<SVGGElement>(
            `[data-waypoint-index="${waypointIndex}"]`
        );
    });
};

const resetVisualEffects = () => {
    particles = [];
    rockets = [];
    pendingLaunches = [];
    flashes = [];
    needsHardCanvasClear = true;
};

const renderWord = (word: string) => {
    currentWord = normalizeWordInput(word);
    wordInput.value = currentWord;
    syncWordUrl();
    resetVisualEffects();

    if (currentWord.length === 0) {
        currentScene = null;
        fireworksSvg.innerHTML = "";
        spentFusePathEl = null;
        coolingFusePathEl = null;
        smoulderFusePathEl = null;
        burnedPathEl = null;
        burnedGlowPathEl = null;
        emberEl = null;
        setStatus("Enter a word.");
        return;
    }

    try {
        const layout = buildShiftedWordLayout(currentWord, {
            keepInitialLeadIn: true,
            keepFinalLeadOut: true
        });
        const path = shiftWritingPath(layout.path, 0, FIREWORK_SKY_HEIGHT);
        const preparedPath = compileTracingPath(path, { sampleRate: FUSE_SAMPLE_RATE });
        const totalLength = Math.max(1, getTotalPathLength(preparedPath));
        const fullPathD = buildPathDFromOverallDistanceRange(preparedPath, 0, totalLength);
        const waypoints = buildWaypoints(preparedPath);
        const scene: Scene = {
            path,
            preparedPath,
            totalLength,
            durationMs: clamp((totalLength / FUSE_SPEED) * 1000, MIN_FUSE_DURATION_MS, MAX_FUSE_DURATION_MS),
            startedAt: performance.now(),
            fullPathD,
            width: layout.width,
            height: layout.height + FIREWORK_SKY_HEIGHT,
            offsetY: layout.offsetY + FIREWORK_SKY_HEIGHT,
            waypoints,
            completed: false,
            smoulderSampleCache: null,
            lastSvgPathUpdateAt: 0,
            lastSvgPathDistance: -Infinity,
            lastSvgPathCoolProgress: -Infinity
        };

        currentScene = scene;
        fireworksSvg.setAttribute("viewBox", `0 0 ${scene.width} ${scene.height}`);
        fireworksSvg.innerHTML = buildFuseMarkup(scene);
        spentFusePathEl = fireworksSvg.querySelector<SVGPathElement>("#fireworks-spent-fuse");
        coolingFusePathEl = fireworksSvg.querySelector<SVGPathElement>("#fireworks-cooling-fuse");
        smoulderFusePathEl = fireworksSvg.querySelector<SVGPathElement>("#fireworks-smoulder-fuse");
        burnedPathEl = fireworksSvg.querySelector<SVGPathElement>("#fireworks-burned-path");
        burnedGlowPathEl = fireworksSvg.querySelector<SVGPathElement>("#fireworks-burned-glow");
        emberEl = fireworksSvg.querySelector<SVGGElement>("#fireworks-ember");
        assignWaypointElements(scene);
        setStatus(null);
    } catch {
        currentScene = null;
        fireworksSvg.innerHTML = "";
        spentFusePathEl = null;
        coolingFusePathEl = null;
        smoulderFusePathEl = null;
        burnedPathEl = null;
        burnedGlowPathEl = null;
        emberEl = null;
        setStatus("Try a word using supported letters.");
    }
};

const scheduleWordRender = () => {
    if (inputDebounceId !== null) {
        window.clearTimeout(inputDebounceId);
    }

    inputDebounceId = window.setTimeout(() => {
        inputDebounceId = null;
        renderWord(wordInput.value);
    }, 260);
};

wordInput.addEventListener("input", scheduleWordRender);
wordInput.addEventListener("change", () => {
    if (inputDebounceId !== null) {
        window.clearTimeout(inputDebounceId);
        inputDebounceId = null;
    }
    renderWord(wordInput.value);
});
wordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (inputDebounceId !== null) {
            window.clearTimeout(inputDebounceId);
            inputDebounceId = null;
        }
        wordInput.blur();
        renderWord(wordInput.value);
    }
});
replayButton.addEventListener("click", () => {
    renderWord(wordInput.value);
});
window.addEventListener("popstate", () => {
    applyUrlSettings();
    renderWord(currentWord);
});
window.addEventListener("resize", () => {
    needsHardCanvasClear = true;
});
document.addEventListener("visibilitychange", () => {
    lastFrameAt = performance.now();
});

applyUrlSettings();
renderWord(currentWord);

if (animationFrameId === null) {
    animationFrameId = requestAnimationFrame(tick);
}