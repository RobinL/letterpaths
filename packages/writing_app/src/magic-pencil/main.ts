import * as THREE from "three";
import { lettersByVariantId } from "letterpaths";
import { createPencil } from "./prop";
import { createVhsTv } from "./tv";
import { buildWritingTimeline, type WritingStep } from "./writing-timeline";
import "./style.css";

const stage = document.querySelector<HTMLElement>("#stage")!;
const form = document.querySelector<HTMLFormElement>("#form")!;
const input = document.querySelector<HTMLInputElement>("#words")!;
const idleStatus = document.querySelector<HTMLElement>("#idle-status")!;
const message = document.querySelector<HTMLElement>("#message")!;
const displayModes = document.querySelector<HTMLFieldSetElement>("#display-modes")!;
const vhsOption = displayModes.querySelector<HTMLInputElement>('[value="vhs"]')!;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
camera.position.z = 500;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
stage.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffecd7, 0x6f230e, 0.65));
// A warm studio spot and a low amber bounce stay fixed while the prop turns.
const key = new THREE.SpotLight(0xffefd2, 0, 0, Math.PI / 3, 0.42);
const bounce = new THREE.PointLight(0xff5623, 0);
scene.add(key, key.target, bounce);
let vhsTv: ReturnType<typeof createVhsTv> | undefined;

const paper = document.createElement("canvas");
const ctx = paper.getContext("2d")!;
const texture = new THREE.CanvasTexture(paper);
texture.colorSpace = THREE.SRGBColorSpace;
const surface = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
);
scene.add(surface);
const pencil = createPencil(scene);

const supported = new Set(Object.values(lettersByVariantId).map(letter => letter.glyph.char));
let width = 1;
let height = 1;
let frameHeight = 1;
let pencilSize = 1;
let steps: WritingStep[] = [];
let total = 0;
let elapsed = 0;
let lastTime = 0;
let activeText = "";
let lampLevel = 0;
let heading = -2.09;
let pitch = 0.29;
let twist = 0.4;

function layout(value: string) {
  ({ steps, total } = buildWritingTimeline(value, width, height, frameHeight, pencilSize));
}

function clearWriting() {
  ctx.clearRect(0, 0, width, height);
  texture.needsUpdate = true;
}

function drawIdleScreen() {
  const frameTop = Math.min((height - frameHeight) * 0.16, 45);
  const frameCenter = (height - frameHeight) / 2 - frameTop;
  pencil.pose(-pencilSize * 0.38, frameCenter + pencilSize * 0.22, 2, pencilSize, -2.42, 0.18, 0.4, 0);

  const prompt = idleStatus.textContent ?? "";
  const size = frameHeight * 0.052;
  const y = frameTop + frameHeight * 0.32;
  ctx.save();
  ctx.font = `bold ${size}px "Courier New", monospace`;
  ctx.textBaseline = "middle";
  const textWidth = ctx.measureText(prompt).width;
  const cursorGap = size * 0.42;
  const cursorWidth = size * 0.44;
  const left = (width - textWidth - cursorGap - cursorWidth) / 2;
  ctx.fillStyle = "#8cf3a2";
  ctx.shadowColor = "#43ff6c";
  ctx.shadowBlur = size * 0.25;
  ctx.fillText(prompt, left, y);
  ctx.fillRect(left + textWidth + cursorGap, y - size * 0.33, cursorWidth, size * 0.66);
  ctx.restore();
  texture.needsUpdate = true;
}

function write(text: string) {
  const value = text.trim().replace(/\s+/g, " ");
  if (!value || [...value].some(char => char !== " " && !supported.has(char))) {
    message.textContent = value ? "Please use letters and spaces." : "Type a word or name to begin.";
    return false;
  }
  if (value.length > input.maxLength) {
    message.textContent = `Enter up to ${input.maxLength} characters.`;
    return false;
  }
  message.textContent = "";
  idleStatus.hidden = true;
  activeText = value;
  input.value = value;
  layout(value);
  clearWriting();
  elapsed = 0;
  lampLevel = 0;
  return true;
}

function resize() {
  width = stage.clientWidth;
  height = stage.clientHeight;
  frameHeight = Math.min(height, width * 0.75);
  pencilSize = frameHeight * 0.30;
  key.position.set(-0.56 * frameHeight, 0.64 * frameHeight, 0.86 * frameHeight);
  key.target.position.set(0, 0.20 * frameHeight, 0);
  key.intensity = 3.6 * frameHeight ** 2;
  bounce.position.set(0.05 * frameHeight, -0.47 * frameHeight, 0.19 * frameHeight);
  bounce.intensity = 0.38 * frameHeight ** 2;
  renderer.setSize(width, height);
  resizeDisplay();
  camera.left = -width / 2;
  camera.right = width / 2;
  camera.top = height / 2;
  camera.bottom = -height / 2;
  camera.updateProjectionMatrix();
  paper.width = width;
  paper.height = height;
  surface.scale.set(width, height, 1);

  clearWriting();
  if (activeText) {
    const progress = total ? elapsed / total : 0;
    layout(activeText);
    elapsed = progress * total;
    if (elapsed) draw(0, elapsed);
  } else {
    drawIdleScreen();
  }
}

function resizeDisplay() {
  if (vhsOption.checked) {
    vhsTv ??= createVhsTv(renderer, scene, camera);
    vhsTv.resize(width, height, frameHeight, form.offsetTop);
  }
}

function draw(from: number, to: number) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const weight = Math.max(1.1, frameHeight * 0.0049);
  let changed = false;
  for (const step of steps) {
    if (step.start >= to) break;
    if (step.travel || step.end <= from) continue;
    const start = Math.max(0, (from - step.start) / (step.end - step.start));
    const end = Math.min(1, (to - step.start) / (step.end - step.start));
    const first = step.curve.getPointAtLength(start * step.length);
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);
    const samples = Math.max(1, Math.ceil((end - start) * step.length / 1.4));
    for (let i = 1; i <= samples; i++) {
      const t = THREE.MathUtils.lerp(start, end, i / samples);
      const point = step.curve.getPointAtLength(t * step.length);
      ctx.lineTo(point.x, point.y);
    }
    ctx.strokeStyle = "#dedbd2";
    ctx.lineWidth = weight;
    ctx.shadowColor = "rgba(240,224,195,.42)";
    ctx.shadowBlur = Math.max(1, weight * 0.62);
    if (step.length > 0.05) {
      ctx.stroke();
    } else {
      ctx.fillStyle = ctx.strokeStyle;
      ctx.arc(first.x, first.y, weight / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    changed = true;
  }
  if (changed) texture.needsUpdate = true;
}

function advancePencil(delta: number) {
  const last = elapsed;
  elapsed = Math.min(total, elapsed + delta);
  if (elapsed > last) draw(last, elapsed);

  const step = steps.find(candidate => elapsed < candidate.end) ?? steps.at(-1);
  if (!step) return;
  const t = (elapsed - step.start) / (step.end - step.start);
  const parameter = step.travel ? t : step.curve.getTAtLength(t * step.length);
  const point = step.curve.getPointAt(parameter);
  const tangent = step.curve.getTangentAt(parameter);
  const direction = Math.atan2(tangent.y, tangent.x);
  const lift = step.travel ? Math.sin(Math.PI * t) : 0;
  const settle = 1 - Math.exp(-delta * 6);
  heading = THREE.MathUtils.lerp(heading, -2.10 - 0.32 * lift + 0.10 * Math.sin(direction), settle);
  pitch = THREE.MathUtils.lerp(pitch, 0.31 - 0.41 * lift + 0.10 * Math.cos(direction), settle);
  twist = THREE.MathUtils.lerp(twist, 0.4 + 0.21 * lift + 0.13 * Math.sin(direction), settle);
  const lampTarget = step.travel ? 0 : 1;
  const lampRate = lampTarget > lampLevel ? 6 : 16;
  lampLevel += (lampTarget - lampLevel) * (1 - Math.exp(-lampRate * delta));

  pencil.pose(
    point.x - width / 2,
    height / 2 - point.y - pencilSize * 0.09 * lift,
    2 + pencilSize * 0.24 * lift,
    pencilSize,
    heading,
    pitch,
    twist,
    lampLevel,
  );
}

function animate(time: number) {
  requestAnimationFrame(animate);
  const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
  lastTime = time;
  advancePencil(delta);
  if (vhsOption.checked && vhsTv) vhsTv.render(time);
  else renderer.render(scene, camera);
}

displayModes.addEventListener("change", resizeDisplay);
form.addEventListener("submit", event => {
  event.preventDefault();
  if (!write(input.value)) return;
  const url = new URL(window.location.href);
  url.searchParams.set("text", activeText);
  window.history.replaceState(window.history.state, "", url);
  input.blur();
});
window.addEventListener("resize", resize);
resize();
const sharedText = new URLSearchParams(window.location.search).get("text");
if (sharedText?.trim()) {
  input.value = sharedText;
  write(sharedText);
}
requestAnimationFrame(animate);
