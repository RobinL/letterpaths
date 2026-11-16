import * as THREE from "three";
import { FullScreenQuad } from "three/addons/postprocessing/Pass.js";
import { createTvCabinet } from "./curved-tv";

// 625-line PAL has 576 active picture lines. These digital samples represent
// a 4:3 picture with non-square pixels; the tube pass controls the display size.
const SAMPLES = 720;
const ACTIVE_LINES = 576;
const FIELD_MS = 20;

const fullscreenVertex = /* glsl */ `
  varying vec2 screenUv;
  void main() {
    screenUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// PAL System I bandwidth, phase alternation and delay line:
// https://www.bbceng.info/Technical%20Reviews/World-tv-standards/World%20Analogue%20Television%20Standards%20and%20Waveforms.html
const vhsFragment = /* glsl */ `
  uniform sampler2D picture;
  uniform sampler2D previousField;
  uniform vec2 raster;
  uniform float field;
  uniform float fillBoth;
  varying vec2 screenUv;

  uniform float tapeTime;
  uniform float tapeMotion;

  float noiseAt(vec2 cell) {
    vec3 p = fract(vec3(cell.xyx) * 0.1031);
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
  }

  // Tape time-base variation, and the less stable lines at the point where the
  // playback heads switch. Only the tape signal moves, not the TV glass.
  // https://www.canada.ca/en/conservation-institute/services/conservation-preservation-publications/technical-bulletins/digitization-vhs-video-tapes.html
  float headSwitch(float y) {
    float edge = 0.027 + 0.003 * sin(tapeTime * 3.2);
    return 1.0 - smoothstep(edge, edge + 0.009, y);
  }

  float tapeSkew(float y, float row) {
    float ripple = 0.22 * sin(31.0 * y + tapeTime * 3.2) + 0.12 * sin(82.0 * y - tapeTime * 3.7);
    return tapeMotion * (ripple + headSwitch(y) * (0.85 + 0.70 * sin(row * 1.3 + tapeTime * 18.0)));
  }

  float dropout(vec2 uv, float row) {
    // Short, isolated streaks from brief losses of tape contact.
    float cycle = floor(tapeTime / 1.7);
    float age = mod(tapeTime, 1.7);
    float shift = noiseAt(vec2(cycle, 43.0));
    float line = floor((0.07 + shift * 0.86) * raster.y);
    float start = noiseAt(vec2(cycle, 12.0)) * 0.86;
    float band = 1.0 - smoothstep(0.5, 1.5, abs(row - line));
    float streak = smoothstep(start - 0.015, start, uv.x)
      * (1.0 - smoothstep(start + 0.05, start + 0.11, uv.x));
    return tapeMotion * band * streak * (1.0 - smoothstep(0.018, 0.09, age));
  }

  vec3 video(vec2 uv) {
    return pow(clamp(texture2D(picture, uv).rgb, 0.0, 1.0), vec3(0.45));
  }

  float palY(vec3 rgb) {
    return dot(rgb, vec3(0.299, 0.587, 0.114));
  }

  vec2 uvChroma(vec3 rgb) {
    return (rgb.br - palY(rgb)) * vec2(0.492, 0.877);
  }

  vec2 filteredChroma(vec2 uv, vec3 center) {
    vec2 dx = vec2(2.15 / raster.x, 0.0);
    return 0.25 * uvChroma(center)
      + 0.25 * uvChroma(video(uv - 2.2 * dx))
      + 0.25 * uvChroma(video(uv + 2.2 * dx))
      + 0.125 * uvChroma(video(uv - 5.0 * dx))
      + 0.125 * uvChroma(video(uv + 5.0 * dx));
  }

  void main() {
    float row = floor(screenUv.y * raster.y);
    vec2 dx = vec2(1.0 / raster.x, 0.0);
    vec2 source = screenUv;
    source.x += tapeSkew(source.y, row) / raster.x;
    vec3 center = video(source);
    float y = palY(center);
    float neighbours = (palY(video(source - dx)) + palY(video(source + dx))) * 0.5;
    float luma = mix(y, neighbours, 0.44);
    float wider = (palY(video(source - 2.7 * dx)) + palY(video(source + 2.7 * dx))) * 0.5;
    luma = mix(luma, wider, 0.28);
    bool heldLine = fillBoth < 0.5 && mod(row + field, 2.0) > 0.5;
    vec3 held = vec3(0.0);
    float refresh = 1.0;
    if (heldLine) {
      held = texture2D(previousField, screenUv).rgb;
      // Keep the previous field in still parts of the picture. On moving
      // edges, reduce its contribution to avoid a visible comb of old lines.
      float change = max(abs(luma - palY(held)), 0.55 * length(uvChroma(center) - uvChroma(held)));
      refresh = 0.91 * smoothstep(0.028, 0.16, change);
      if (refresh == 0.0) {
        gl_FragColor = vec4(held, 1.0);
        return;
      }
    }

    // Colour has much less bandwidth than luma. Model the decoder's
    // one-line average in baseband and leave a little carrier breakthrough
    // on high-contrast edges, where composite decoding is imperfect.
    vec2 delayed = source + vec2(0.0, 1.0 / raster.y);
    // The lower-bandwidth colour signal lags behind the steadier brightness
    // signal. A longer, weaker tail is easiest to see on the orange barrel.
    float colourDrift = 1.15 * sin(source.y * 17.0 + tapeTime * 1.9);
    vec2 delay = (5.2 + colourDrift) * dx;
    vec2 chroma = mix(filteredChroma(source - delay, video(source - delay)),
      filteredChroma(delayed - delay, video(delayed - delay)), 0.45);
    chroma = mix(chroma, uvChroma(video(source - 17.0 * dx)), 0.21);

    // Simulate colour phase and gain errors separately from image position.
    float bandPhase = 0.11 + 0.22 * sin(source.y * 24.0 + tapeTime * 1.65)
      + 0.08 * sin(source.y * 149.0 - tapeTime * 2.4);
    float c = cos(bandPhase);
    float s = sin(bandPhase);
    float chromaGain = 0.91 + 0.13 * sin(source.y * 49.0 - tapeTime * 2.0);
    chroma = chromaGain * vec2(c * chroma.x - s * chroma.y, s * chroma.x + c * chroma.y);

    // Bright white edges can leak into the colour channel as faint rainbows.
    float bleedPhase = dot(screenUv * raster, vec2(0.24, 0.26)) + tapeTime * 4.1;
    chroma += 0.19 * (y - wider) * vec2(sin(bleedPhase), cos(bleedPhase));
    float phase = 6.2831853 * (230.0 * screenUv.x + row * 0.75 + field * 0.25);
    float lineSign = 1.0 - 2.0 * mod(row, 2.0);
    luma += (chroma.x * sin(phase) + lineSign * chroma.y * cos(phase)) * 0.045;
    chroma += (y - neighbours) * vec2(sin(phase), lineSign * cos(phase)) * 0.06;

    float tapeField = floor(tapeTime * 50.0 + 0.5);
    float noiseCell = screenUv.x * 285.0 + noiseAt(vec2(row, tapeField)) * 5.0;
    vec2 grainCell = vec2(floor(noiseCell), row + tapeField * 7.0);
    float grain = mix(noiseAt(grainCell), noiseAt(grainCell + vec2(1.0, 0.0)), fract(noiseCell));
    float lineNoise = noiseAt(vec2(row, tapeField + 2.0));
    float head = headSwitch(screenUv.y) * tapeMotion;
    luma += 0.032 + (grain - 0.45) * (0.075 + head * 0.21) + (lineNoise - 0.5) * (0.012 + head * 0.08);
    float loss = dropout(screenUv, row);
    luma += loss * (0.12 + 0.09 * grain);
    chroma = mix(chroma, vec2(0.045, 0.060), loss * 0.76);

    vec3 decoded = luma + vec3(1.140 * chroma.y, -0.395 * chroma.x - 0.581 * chroma.y, 2.032 * chroma.x);
    gl_FragColor = vec4(mix(held, clamp(decoded, 0.0, 1.0), refresh), 1.0);
  }
`;

export function createVhsTv(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.OrthographicCamera) {
  const capture = new THREE.OrthographicCamera(-1, 1, 1, -1, camera.near, camera.far);
  capture.position.copy(camera.position);
  // Linear sampling averages four scene pixels for each PAL sample, smoothing
  // the nib, writing and flare before they reach the standard-definition raster.
  const picture = new THREE.WebGLRenderTarget(SAMPLES * 2, ACTIVE_LINES * 2, {
    type: renderer.extensions.has("EXT_color_buffer_float") ? THREE.HalfFloatType : THREE.UnsignedByteType,
    magFilter: THREE.LinearFilter,
    minFilter: THREE.LinearFilter,
  });
  let signal = new THREE.WebGLRenderTarget(SAMPLES, ACTIVE_LINES, { depthBuffer: false });
  let previous = signal.clone();

  const raster = new THREE.Vector2(SAMPLES, ACTIVE_LINES);
  const decoder = new THREE.ShaderMaterial({
    uniforms: {
      picture: { value: picture.texture },
      previousField: { value: previous.texture },
      raster: { value: raster },
      field: { value: 0 },
      fillBoth: { value: 1 },
      tapeTime: { value: 0 },
      tapeMotion: { value: 1 },
    },
    vertexShader: fullscreenVertex,
    fragmentShader: vhsFragment,
    depthTest: false,
    depthWrite: false,
  });
  const quad = new FullScreenQuad(decoder);
  const cabinet = createTvCabinet(renderer, raster);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let lastField = -Infinity;

  return {
    resize(width: number, height: number, frameHeight: number, controlsTop: number) {
      const frameWidth = frameHeight * 4 / 3;
      const top = Math.min((height - frameHeight) * 0.16, 45);
      capture.left = -frameWidth / 2;
      capture.right = frameWidth / 2;
      capture.top = height / 2 - top;
      capture.bottom = capture.top - frameHeight;
      capture.updateProjectionMatrix();

      cabinet.resize(width, height, controlsTop);
      lastField = -Infinity;
    },
    render(time: number) {
      const field = Math.floor(time / FIELD_MS);
      if (field !== lastField) {
        renderer.setRenderTarget(picture);
        renderer.render(scene, capture);
        renderer.setRenderTarget(signal);
        const still = reduceMotion.matches;
        decoder.uniforms.field.value = field % 8;
        // Rebuild both fields after a resize or a missed field rather than
        // weaving a stale silhouette into the moving pencil.
        decoder.uniforms.fillBoth.value = +(field - lastField > 1 || still);
        decoder.uniforms.previousField.value = previous.texture;
        decoder.uniforms.tapeTime.value = still ? 0 : (field % 30_000) * FIELD_MS / 1000;
        decoder.uniforms.tapeMotion.value = still ? 0 : 1;
        quad.render(renderer);
        [previous, signal] = [signal, previous];
        lastField = field;
      }
      cabinet.render(previous.texture);
    },
  };
}
