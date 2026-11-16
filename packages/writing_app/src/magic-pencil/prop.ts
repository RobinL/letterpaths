import * as THREE from "three";

const Y = new THREE.Vector3(0, 1, 0);
const X = new THREE.Vector3(1, 0, 0);
const Z = new THREE.Vector3(0, 0, 1);
const lampCenter = new THREE.Vector3(0, 0.994, 0);

type Ring = readonly [distanceFromNib: number, radius: number];
type Finish = THREE.MeshPhysicalMaterialParameters;

function hexagon(distance: number, radius: number) {
  const corners = Array.from({ length: 6 }, (_, i) => {
    const angle = i * Math.PI / 3;
    return new THREE.Vector3(Math.cos(angle) * radius, distance, Math.sin(angle) * radius);
  });
  return corners.flatMap((corner, i) => {
    const next = corners[(i + 1) % 6];
    return [corner.clone().lerp(next, 0.035), next.clone().lerp(corner, 0.035)];
  });
}

// Each pair of adjacent rings forms six broad faces and six narrow bevels.
function shell(rings: readonly Ring[], finish: Finish) {
  const positions: number[] = [];
  for (let i = 1; i < rings.length; i++) {
    const start = hexagon(...rings[i - 1]);
    const end = hexagon(...rings[i]);
    for (let j = 0; j < start.length; j++) {
      const next = (j + 1) % start.length;
      for (const vertex of [start[j], end[j], end[next], start[j], end[next], start[next]]) {
        positions.push(vertex.x, vertex.y, vertex.z);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial(finish));
}

function flareTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 768;
  const ctx = canvas.getContext("2d")!;
  ctx.translate(384, 384);

  // The three axes come from the camera's star filter and stay aligned with the screen.
  for (const [angle, length, breadth] of [
    [Math.PI / 2 - 0.02, 375, 5],
    [-0.52, 337, 4],
    [0.55, 214, 4],
  ]) {
    ctx.save();
    ctx.rotate(angle);
    const ray = ctx.createLinearGradient(-length, 0, length, 0);
    ray.addColorStop(0, "rgba(233,231,214,0)");
    ray.addColorStop(0.19, "rgba(233,231,214,.31)");
    ray.addColorStop(0.4, "rgba(255,119,40,.27)");
    ray.addColorStop(0.48, "rgba(255,235,172,.76)");
    ray.addColorStop(0.5, "rgba(255,255,246,1)");
    ray.addColorStop(0.52, "rgba(255,231,174,.76)");
    ray.addColorStop(0.61, "rgba(240,164,110,.33)");
    ray.addColorStop(0.82, "rgba(233,231,214,.31)");
    ray.addColorStop(1, "rgba(233,231,214,0)");
    ctx.fillStyle = ray;
    ctx.beginPath();
    ctx.moveTo(-length, 0);
    ctx.quadraticCurveTo(-length * 0.28, -breadth * 0.35, 0, -breadth);
    ctx.quadraticCurveTo(length * 0.28, -breadth * 0.35, length, 0);
    ctx.quadraticCurveTo(length * 0.28, breadth * 0.35, 0, breadth);
    ctx.quadraticCurveTo(-length * 0.28, breadth * 0.35, -length, 0);
    ctx.fill();
    ctx.restore();
  }

  const bloom = ctx.createRadialGradient(0, 0, 0, 0, 0, 56);
  bloom.addColorStop(0, "rgba(255,255,244,1)");
  bloom.addColorStop(0.15, "rgba(255,255,230,1)");
  bloom.addColorStop(0.24, "rgba(255,236,147,.85)");
  bloom.addColorStop(0.44, "rgba(255,125,34,.36)");
  bloom.addColorStop(1, "rgba(255,87,20,0)");
  ctx.fillStyle = bloom;
  ctx.fillRect(-56, -56, 112, 112);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createPencil(scene: THREE.Scene) {
  const prop = new THREE.Group();
  scene.add(prop);
  const enamel = { color: 0xff7803, roughness: 0.46, clearcoat: 0.42, clearcoatRoughness: 0.28 };
  const groove = { color: 0xaf2e05, roughness: 0.58 };
  const cap = { color: 0x312115, roughness: 0.52 };
  prop.add(
    // A pinhead of pale material sits at the contact point. The gold shoulder
    // merges into the orange facets before the main barrel reaches full width.
    shell([[0, 0], [0, 0.007], [0.006, 0.018], [0.019, 0.031]], { color: 0xd8c8a1, roughness: 0.46 }),
    shell([[0.019, 0.031], [0.042, 0.061], [0.076, 0.091]], { color: 0xc49339, roughness: 0.57 }),
    shell([[0.076, 0.091], [0.119, 0.121], [0.166, 0.133], [0.767, 0.133]], enamel),
    shell([[0.767, 0.133], [0.775, 0.13], [0.785, 0.133]], groove),
    shell([[0.785, 0.133], [0.797, 0.133]], enamel),
    shell([[0.797, 0.133], [0.806, 0.13], [0.815, 0.133]], groove),
    shell([[0.815, 0.133], [0.979, 0.133], [0.99, 0.126]], enamel),
    shell([[0.99, 0.126], [0.99, 0.041]], cap),
  );

  const socket = new THREE.Mesh(
    new THREE.TorusGeometry(0.039, 0.007, 10, 24),
    new THREE.MeshStandardMaterial({ color: 0x65513b, metalness: 0.55, roughness: 0.42 }),
  );
  socket.rotation.x = Math.PI / 2;
  socket.position.y = 0.991;
  prop.add(socket);
  const filament = new THREE.MeshStandardMaterial({ color: 0x302315, emissive: 0xffbc53, emissiveIntensity: 0 });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.033, 20, 12), filament);
  bulb.scale.y = 0.43;
  bulb.position.copy(lampCenter);
  prop.add(bulb);

  // Put the light just beyond the lens so it lights the rim and falls away
  // quickly across the cap. The flare is the separate response of the camera.
  const bulbLight = new THREE.PointLight(0xffbc55, 0);
  bulbLight.position.set(0, 1.027, 0.014);
  prop.add(bulbLight);

  const flare = new THREE.Sprite(new THREE.SpriteMaterial({
    map: flareTexture(),
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
    transparent: true,
  }));
  scene.add(flare);
  const tilt = new THREE.Quaternion();
  const roll = new THREE.Quaternion();
  return {
    pose(x: number, y: number, lift: number, size: number, heading: number, pitch: number, twist: number, lamp: number) {
      prop.position.set(x, y, lift);
      prop.scale.setScalar(size);
      prop.quaternion.setFromAxisAngle(Z, heading)
        .multiply(tilt.setFromAxisAngle(X, pitch))
        .multiply(roll.setFromAxisAngle(Y, twist));
      flare.position.copy(lampCenter);
      prop.localToWorld(flare.position);
      flare.scale.setScalar(size * (1.75 + 0.57 * lamp));
      flare.material.opacity = lamp;
      flare.visible = lamp > 0.005;
      filament.emissiveIntensity = lamp * 5;
      bulbLight.intensity = lamp * size * size * 0.014;
    },
  };
}
