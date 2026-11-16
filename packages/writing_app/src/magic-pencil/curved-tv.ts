import * as THREE from "three";
import { FullScreenQuad } from "three/addons/postprocessing/Pass.js";

// A separate glass and cabinet pass inspired by the rounded face and recessed
// bezel of the Panasonic CT-10R10R, and the geometry and reflection controls
// documented by MAME. The cabinet displays the decoded VHS signal.
const cabinetFragment = /* glsl */ `
  uniform sampler2D signal;
  uniform vec4 cabinet;
  uniform vec2 raster;
  uniform vec2 viewport;
  varying vec2 screenUv;

  float roundedBox(vec2 p, vec2 size, float radius) {
    vec2 q = abs(p) - size + radius;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
  }

  float coverage(float d) {
    float pixel = max(fwidth(d), 0.0001);
    return 1.0 - smoothstep(-pixel, pixel, d);
  }

  // Scanline reconstruction and phosphor mask inspired by CRT Royale:
  // https://docs.libretro.com/shader/crt_royale/
  vec3 phosphor(vec2 uv) {
    return pow(texture2D(signal, uv).rgb, vec3(2.35));
  }

  vec3 beam(vec3 light, float offset, float pixelVariance) {
    // Overlapping beams soften neighbouring lines. Folding the output pixel's
    // footprint into the beam width approximates averaging light over it.
    vec3 width = mix(vec3(0.34), vec3(0.58), sqrt(light));
    vec3 sigma = sqrt(width * width + pixelVariance);
    vec3 distanceFromBeam = offset / sigma;
    return light * exp(-0.5 * distanceFromBeam * distanceFromBeam) * (0.39894 / sigma);
  }

  vec3 glassPicture(vec2 p, vec2 glassSize) {
    // The back surface bows away toward the edges. Trace its apparent
    // position from the front, then use the glass normal for reflections.
    float radius2 = dot(p * vec2(0.77, 0.58), p * vec2(0.77, 0.58));
    vec2 uv = 0.5 + p * (0.449 + 0.043 * radius2 + 0.014 * p.yx * p.yx);
    float line = uv.y * raster.y - 0.5;
    float row = floor(line);
    float fraction = line - row;
    vec2 center = vec2(uv.x, (row + 0.5) / raster.y);
    vec2 dy = vec2(0.0, 1.0 / raster.y);
    float footprint = fwidth(line);
    float sampledWidth = min(footprint, 1.25);
    float pixelVariance = sampledWidth * sampledWidth / 12.0;
    vec3 scanned = beam(phosphor(center - dy), fraction + 1.0, pixelVariance)
      + beam(phosphor(center), fraction, pixelVariance)
      + beam(phosphor(center + dy), fraction - 1.0, pixelVariance)
      + beam(phosphor(center + 2.0 * dy), fraction - 2.0, pixelVariance);
    // At small sizes the display cannot resolve individual TV lines.
    float resolve = 1.0 - smoothstep(0.70, 1.45, footprint);
    vec2 deflection = vec2(p.x * p.y * 0.0013, p.y * 0.0010);
    vec3 soft = vec3(phosphor(uv - deflection).r, phosphor(uv).g, phosphor(uv + deflection).b);
    vec3 light = mix(soft, scanned, resolve * 0.88);

    // Light scattered in the glass adds a halo around the bright lamp
    // and lettering. The staggered RGB slots sit on the screen plane.
    vec2 spread = vec2(3.1, 2.4) / raster;
    vec3 halo = phosphor(uv + spread) + phosphor(uv - spread)
      + phosphor(uv + vec2(spread.x, -spread.y)) + phosphor(uv + vec2(-spread.x, spread.y));
    light += halo * 0.055;
    float faceWidth = glassSize.x * viewport.x * 2.0;
    float triad = max(3.0, faceWidth / 315.0);
    float slotHeight = triad * 1.5;
    vec2 glassPixels = (p + 1.0) * glassSize * viewport;
    float stagger = mod(floor(glassPixels.y / slotHeight), 2.0) * 0.5;
    float slot = fract(glassPixels.x / triad + stagger);
    vec3 mask = 1.0 + 0.12 * cos(6.2831853 * (slot - vec3(0.167, 0.5, 0.833)));
    mask *= 0.98 + 0.02 * sin(3.14159265 * fract(glassPixels.y / slotHeight));
    light *= mix(vec3(1.0), mask, smoothstep(850.0, 1450.0, faceWidth));

    vec3 normal = normalize(vec3(0.43 * p.x, 0.47 * p.y, 1.0));
    vec3 reflected = reflect(vec3(0.0, 0.0, -1.0), normal);
    float ambient = 0.0017 + 0.0019 * max(dot(normal, normalize(vec3(-0.7, 1.0, 0.7))), 0.0);
    vec2 window = reflected.xy - vec2(-0.44, 0.54);
    window.x += window.y * 0.33;
    float pane = exp(-4.8 * dot(window * vec2(1.6, 3.5), window * vec2(1.6, 3.5)));
    float sheen = 1.0 - clamp(normal.z, 0.0, 1.0);
    vec3 glass = vec3(0.70, 0.82, 0.86) * (ambient + 0.011 * pane + 0.012 * sheen);

    return light * (1.0 - 0.26 * radius2) + glass;
  }

  void main() {
    vec2 p = (screenUv - cabinet.xy) / cabinet.zw;
    float body = roundedBox(p, vec2(1.0), 0.084);
    float bodyAlpha = coverage(body);
    vec3 backdrop = vec3(0.006, 0.0064, 0.0068) * exp(-dot(p * vec2(0.65, 0.88), p * vec2(0.65, 0.88)));
    if (bodyAlpha <= 0.0) {
      gl_FragColor = vec4(backdrop, 1.0);
      #include <colorspace_fragment>
      return;
    }

    float topLight = smoothstep(-1.0, 1.0, p.y);
    vec3 plastic = vec3(0.018, 0.019, 0.021) * (0.77 + 0.60 * topLight);
    float edgeLight = exp(-abs(body + 0.011) * 130.0) * (0.22 + 0.78 * topLight);
    plastic += edgeLight * vec3(0.038, 0.041, 0.046);

    vec2 screenScale = vec2(0.923, 0.862);
    vec2 glassPoint = (p - vec2(0.0, 0.055)) / screenScale;
    vec2 bowed = glassPoint * (1.0 + vec2(0.10, 0.084) * glassPoint.yx * glassPoint.yx);
    float glassEdge = roundedBox(bowed, vec2(1.0), 0.17);
    float glassAlpha = coverage(glassEdge);
    float recess = exp(-max(glassEdge, 0.0) * 62.0);
    plastic *= 1.0 - 0.81 * recess;
    plastic += vec3(0.020, 0.022, 0.025) * exp(-abs(glassEdge - 0.032) * 105.0)
      * (0.61 - 0.25 * glassPoint.y);
    vec3 glass = glassPicture(glassPoint, cabinet.zw * screenScale);
    glass += vec3(0.018, 0.023, 0.027) * exp(-abs(glassEdge + 0.009) * 102.0)
      * (0.48 + 0.35 * glassPoint.y - 0.16 * glassPoint.x);

    vec2 led = (p - vec2(0.858, -0.902)) * vec2(1.32, 1.0);
    plastic += vec3(0.009, 0.080, 0.032) * exp(-4400.0 * dot(led, led));
    gl_FragColor = vec4(mix(backdrop, mix(plastic, glass, glassAlpha), bodyAlpha), 1.0);
    #include <colorspace_fragment>
  }
`;

export function createTvCabinet(renderer: THREE.WebGLRenderer, raster: THREE.Vector2) {
  const glass = new THREE.ShaderMaterial({
    uniforms: {
      signal: { value: null },
      cabinet: { value: new THREE.Vector4() },
      raster: { value: raster },
      viewport: { value: new THREE.Vector2() },
    },
    vertexShader: /* glsl */ `
      varying vec2 screenUv;
      void main() {
        screenUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: cabinetFragment,
    depthTest: false,
    depthWrite: false,
  });
  const quad = new FullScreenQuad(glass);

  return {
    resize(width: number, height: number, controlsTop: number) {
      const availableHeight = Math.max(1, controlsTop - 32);
      const cabinetWidth = Math.min(width * 0.94, availableHeight * 1.25);
      const cabinetHeight = cabinetWidth / 1.25;
      renderer.getDrawingBufferSize(glass.uniforms.viewport.value);
      glass.uniforms.cabinet.value.set(
        0.5, 1 - (controlsTop / 2) / height,
        cabinetWidth / (2 * width), cabinetHeight / (2 * height),
      );
    },
    render(signal: THREE.Texture) {
      glass.uniforms.signal.value = signal;
      renderer.setRenderTarget(null);
      quad.render(renderer);
    },
  };
}
