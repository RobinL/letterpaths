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
const MAX_PARTICLES = 5200;
const MAX_ROCKETS = 34;
const MAX_WAYPOINTS = 18;
const HARD_CLEAR_ALPHA = 1;
const TRAIL_CLEAR_ALPHA = 0.24;
const TWO_PI = Math.PI * 2;

type CanvasPoint = Point;

type Waypoint = {
    distance: number;
    point: Point;
    triggered: boolean;
    isFinale: boolean;
    element: SVGGElement | null;
};

type Scene = {
    path: WritingPath;
    preparedPath: PreparedTracingPath;
    totalLength: number;
    durationMs: number;
    startedAt: number;
    width: number;
    height: number;
    offsetY: number;
    waypoints: Waypoint[];
    completed: boolean;
};

type ParticleKind = "fuse" | "rocket" | "shell" | "crackle";

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
    trail: CanvasPoint[];
};

type PendingLaunch = {
    origin: CanvasPoint;
    target: CanvasPoint;
    delayMs: number;
    hue: number;
    power: number;
    isFinale: boolean;
};

type Star = {
    x: number;
    y: number;
    radius: number;
    phase: number;
    speed: number;
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
      <p class="fireworks-app__status" id="fireworks-status" aria-live="polite" hidden></p>
    </main>
  </div>
`;

const wordInput = document.querySelector<HTMLInputElement>("#fireworks-word-input");
const replayButton = document.querySelector<HTMLButtonElement>("#fireworks-replay-button");
const fireworksSvg = document.querySelector<SVGSVGElement>("#fireworks-svg");
const fireworksCanvas = document.querySelector<HTMLCanvasElement>("#fireworks-canvas");
const statusEl = document.querySelector<HTMLParagraphElement>("#fireworks-status");

if (!wordInput || !replayButton || !fireworksSvg || !fireworksCanvas || !statusEl) {
    throw new Error("Missing elements for fireworks tracing app.");
}

const fireworksContext = fireworksCanvas.getContext("2d", { alpha: true });

if (!fireworksContext) {
    throw new Error("Could not create fireworks canvas context.");
}

let currentWord = DEFAULT_WORD;
let currentScene: Scene | null = null;
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
let stars: Star[] = [];
let needsHardCanvasClear = true;

const clamp = (value: number, min: number, max: number): number =>
    Math.min(max, Math.max(min, value));

const randomBetween = (min: number, max: number): number =>
    min + Math.random() * (max - min);

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
    needsHardCanvasClear = true;
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

const spawnFuseSparks = (point: CanvasPoint, tangent: Point, deltaSeconds: number) => {
    const normal = { x: -tangent.y, y: tangent.x };
    const sparkCount = Math.max(1, Math.floor(randomBetween(60, 130) * deltaSeconds));

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

const queueWaypointFireworks = (origin: CanvasPoint, isFinale: boolean) => {
    const launchCount = isFinale ? 8 : Math.random() < 0.42 ? 2 : 1;

    for (let launchIndex = 0; launchIndex < launchCount; launchIndex += 1) {
        pendingLaunches.push({
            origin: { ...origin },
            target: createRocketTarget(origin, isFinale),
            delayMs: isFinale ? launchIndex * randomBetween(80, 150) : launchIndex * randomBetween(90, 170),
            hue: randomBetween(0, 360),
            power: isFinale ? randomBetween(1.1, 1.55) : randomBetween(0.78, 1.15),
            isFinale
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

const explodeRocket = (rocket: Rocket) => {
    const shellCount = Math.floor((rocket.isFinale ? 210 : 116) * rocket.power);
    const ringOffset = randomBetween(0, TWO_PI);

    for (let particleIndex = 0; particleIndex < shellCount; particleIndex += 1) {
        const ringRatio = particleIndex / shellCount;
        const angle = ringRatio * TWO_PI + ringOffset + randomBetween(-0.035, 0.035);
        const ringSpeed = randomBetween(80, rocket.isFinale ? 345 : 255) * rocket.power;
        const secondaryRing = particleIndex % 5 === 0 ? 0.58 : 1;
        pushParticle({
            x: rocket.x,
            y: rocket.y,
            vx: Math.cos(angle) * ringSpeed * secondaryRing,
            vy: Math.sin(angle) * ringSpeed * secondaryRing,
            age: 0,
            life: randomBetween(1.0, rocket.isFinale ? 2.45 : 1.9),
            size: randomBetween(1.2, rocket.isFinale ? 4.9 : 3.8),
            hue: rocket.hue + randomBetween(-34, 34),
            saturation: randomBetween(82, 100),
            lightness: randomBetween(54, 76),
            gravity: randomBetween(62, 118),
            drag: randomBetween(0.965, 0.985),
            kind: "shell"
        });
    }

    const crackleCount = Math.floor((rocket.isFinale ? 70 : 28) * rocket.power);
    for (let crackleIndex = 0; crackleIndex < crackleCount; crackleIndex += 1) {
        const angle = randomBetween(0, TWO_PI);
        const speed = randomBetween(120, rocket.isFinale ? 420 : 320) * rocket.power;
        pushParticle({
            x: rocket.x,
            y: rocket.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            age: 0,
            life: randomBetween(0.42, 1.2),
            size: randomBetween(0.8, 2.4),
            hue: randomBetween(42, 58),
            saturation: randomBetween(20, 55),
            lightness: randomBetween(78, 96),
            gravity: randomBetween(90, 150),
            drag: randomBetween(0.94, 0.975),
            kind: "crackle"
        });
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
        const lifeRatio = clamp(particle.age / particle.life, 0, 1);
        const alpha = (1 - lifeRatio) ** (particle.kind === "fuse" ? 1.1 : 1.55);
        const tailScale = particle.kind === "shell" || particle.kind === "crackle" ? 0.046 : 0.028;
        const strokeAlpha = alpha * (particle.kind === "fuse" ? 0.88 : 0.62);

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
    const burnedPathD = buildPathDFromOverallDistanceRange(scene.preparedPath, 0, traveledDistance);

    burnedPathEl?.setAttribute("d", burnedPathD);
    burnedGlowPathEl?.setAttribute("d", burnedPathD);

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
    drawBackdrop(now);
    updatePendingLaunches(deltaSeconds);
    updateRockets(deltaSeconds);
    updateParticles(deltaSeconds);

    fireworksContext.globalCompositeOperation = "lighter";
    drawRockets();
    drawParticles();
    needsHardCanvasClear = false;
};

const tick = (now: number) => {
    resizeCanvas();
    const deltaSeconds = Math.min(0.05, Math.max(0.001, (now - lastFrameAt) / 1000));
    lastFrameAt = now;

    updateFuse(now, deltaSeconds);
    renderCanvasFrame(now, deltaSeconds);
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
      <radialGradient id="fireworks-ember-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#fff8b8"></stop>
        <stop offset="0.36" stop-color="#ffb229"></stop>
        <stop offset="1" stop-color="#ff3b1f" stop-opacity="0"></stop>
      </radialGradient>
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
    <path class="fireworks-app__burned-glow" id="fireworks-burned-glow" d=""></path>
    <path class="fireworks-app__burned-path" id="fireworks-burned-path" d=""></path>
    <g class="fireworks-app__waypoints">${waypointMarkup}</g>
    <g class="fireworks-app__ember" id="fireworks-ember" opacity="0">
      <circle class="fireworks-app__ember-aura" r="58"></circle>
      <ellipse class="fireworks-app__ember-flame" cx="-8" cy="0" rx="30" ry="17"></ellipse>
      <circle class="fireworks-app__ember-core" r="10"></circle>
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
        const waypoints = buildWaypoints(preparedPath);
        const scene: Scene = {
            path,
            preparedPath,
            totalLength,
            durationMs: clamp((totalLength / FUSE_SPEED) * 1000, MIN_FUSE_DURATION_MS, MAX_FUSE_DURATION_MS),
            startedAt: performance.now(),
            width: layout.width,
            height: layout.height + FIREWORK_SKY_HEIGHT,
            offsetY: layout.offsetY + FIREWORK_SKY_HEIGHT,
            waypoints,
            completed: false
        };

        currentScene = scene;
        fireworksSvg.setAttribute("viewBox", `0 0 ${scene.width} ${scene.height}`);
        fireworksSvg.innerHTML = buildFuseMarkup(scene);
        burnedPathEl = fireworksSvg.querySelector<SVGPathElement>("#fireworks-burned-path");
        burnedGlowPathEl = fireworksSvg.querySelector<SVGPathElement>("#fireworks-burned-glow");
        emberEl = fireworksSvg.querySelector<SVGGElement>("#fireworks-ember");
        assignWaypointElements(scene);
        setStatus(null);
    } catch {
        currentScene = null;
        fireworksSvg.innerHTML = "";
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