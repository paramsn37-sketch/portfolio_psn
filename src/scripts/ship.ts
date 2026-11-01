/**
 * The battleship in the void. Loaded only when the poster is pulled down.
 * With a model URL (a .glb) it shows that; otherwise it builds a stand-in battleship
 * out of simple shapes, with blinking deck lights like the real one.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export async function mountShip(canvas: HTMLCanvasElement, modelUrl?: string) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 7, 30);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 100);
  camera.position.set(5.2, 2.6, 5.6);

  // endless grid floor: a big plane with a repeating grid texture, fading into the fog
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const g2 = cv.getContext('2d')!;
  g2.fillStyle = '#000'; g2.fillRect(0, 0, 128, 128);
  g2.strokeStyle = '#4a4a4a'; g2.lineWidth = 2; g2.strokeRect(0, 0, 128, 128);
  g2.strokeStyle = '#242424'; g2.lineWidth = 1;
  g2.beginPath(); g2.moveTo(64, 0); g2.lineTo(64, 128); g2.moveTo(0, 64); g2.lineTo(128, 64); g2.stroke();
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(80, 80);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  tex.colorSpace = THREE.SRGBColorSpace;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.62;
  scene.add(floor);

  scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x101010, 1.4));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(4, 6, 3);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xf5c84a, 1.1);
  rim.position.set(-5, 2, -4);
  scene.add(rim);

  const lights: THREE.Mesh[] = [];
  let model: THREE.Object3D;
  if (modelUrl) {
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const gltf = await new GLTFLoader().loadAsync(modelUrl);
    model = gltf.scene;
    // centre it and scale it to about 4 units long, sitting on the grid
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const s = 4 / Math.max(size.x, size.y, size.z);
    model.scale.setScalar(s);
    box.setFromObject(model);
    const c = box.getCenter(new THREE.Vector3());
    model.position.sub(c);
    model.position.y += box.getSize(new THREE.Vector3()).y / 2 - 0.6;
  } else {
    model = buildStandIn(lights);
  }
  scene.add(model);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 2.2;
  controls.maxDistance = 14;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.target.set(0, 0.1, 0);
  controls.autoRotate = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  controls.autoRotateSpeed = 0.8;
  const stopSpin = () => (controls.autoRotate = false);
  controls.addEventListener('start', stopSpin);

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // pull back on narrow screens so the whole ship fits
    camera.fov = w < h ? 55 : 38;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  let raf = 0;
  const clock = new THREE.Clock();
  const tick = () => {
    const t = clock.getElapsedTime();
    lights.forEach((m, i) => {
      (m.material as THREE.MeshBasicMaterial).color.setHex(Math.sin(t * 3 + i * 1.7) > 0.2 ? 0xffd27a : 0x3a2a10);
    });
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  tick();

  return {
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.removeEventListener('start', stopSpin);
      controls.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
      });
      renderer.dispose();
    },
  };
}

/**
 * A stand-in for Param's battleship, modelled on his photos: long slim grey hull with a
 * maroon bottom and "030" on the bow, brown deck with a helipad at the stern, white rope
 * railings, dark angular turrets with triple light-grey barrels (copper bands, star caps),
 * a stacked black-and-silver superstructure, and warm lights. About 4.4 units long.
 */
function buildStandIn(lights: THREE.Mesh[]) {
  const ship = new THREE.Group();
  const M = (color: number, rough = 0.6, metal = 0.25) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
  const hullGrey = M(0xb4b6b8, 0.55, 0.2);
  const maroon = M(0x7a3530, 0.7, 0.1);
  const boot = M(0x232426, 0.6, 0.2);
  const dark = M(0x3b3f45, 0.5, 0.35);
  const black = M(0x1b1c1f, 0.45, 0.3);
  const silver = M(0xa3a9af, 0.4, 0.55);
  const light = M(0xcfd3d7, 0.45, 0.3);
  const barrelM = M(0xbcc6ce, 0.4, 0.3);
  const copper = M(0xb5683a, 0.35, 0.7);
  const rope = M(0xf1ece0, 0.9, 0);
  const red = M(0xa8302a, 0.5, 0.1);

  const L = 4.4, B = 0.26; // length, half beam
  // hull plan: sharp bow at +x, rounded stern at -x
  const outline = (half: number, len: number) => {
    const sh = new THREE.Shape();
    sh.moveTo(len / 2, 0);
    sh.bezierCurveTo(len * 0.36, half * 0.7, len * 0.22, half, len * 0.05, half);
    sh.lineTo(-len * 0.4, half);
    sh.bezierCurveTo(-len * 0.49, half, -len / 2, half * 0.6, -len / 2, 0);
    sh.bezierCurveTo(-len / 2, -half * 0.6, -len * 0.49, -half, -len * 0.4, -half);
    sh.lineTo(len * 0.05, -half);
    sh.bezierCurveTo(len * 0.22, -half, len * 0.36, -half * 0.7, len / 2, 0);
    return sh;
  };
  const slab = (half: number, len: number, h: number, mat: THREE.Material | THREE.Material[], y: number) => {
    const g = new THREE.ExtrudeGeometry(outline(half, len), { depth: h, bevelEnabled: false, curveSegments: 24 });
    g.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(g, mat);
    m.position.y = y;
    ship.add(m);
    return m;
  };
  slab(B * 0.86, L * 0.95, 0.16, maroon, -0.62);
  slab(B * 0.93, L * 0.975, 0.03, boot, -0.47);
  slab(B, L, 0.4, hullGrey, -0.44);

  // deck: brown planking with a black stripe and a helipad at the stern
  const dc = document.createElement('canvas');
  dc.width = 2048; dc.height = 256;
  const d = dc.getContext('2d')!;
  d.fillStyle = '#6e4a1f'; d.fillRect(0, 0, 2048, 256);
  d.globalAlpha = 0.08; d.fillStyle = '#000';
  for (let x = 0; x < 2048; x += 22) d.fillRect(x, 0, 1, 256);
  d.globalAlpha = 1;
  d.fillStyle = '#151515'; d.fillRect(250, 0, 14, 256);
  const hx = 120, hy = 128;
  d.lineWidth = 9; d.strokeStyle = '#f4d21c';
  for (let k = 0; k < 4; k++) { d.beginPath(); d.arc(hx, hy, 76, k * Math.PI / 2 + 0.15, (k + 1) * Math.PI / 2 - 0.15); d.stroke(); }
  d.lineWidth = 5; d.strokeStyle = '#f5f5f0'; d.beginPath(); d.arc(hx, hy, 60, 0, Math.PI * 2); d.stroke();
  d.lineWidth = 9; d.beginPath(); d.moveTo(hx - 26, hy - 30); d.lineTo(hx - 26, hy + 30); d.moveTo(hx + 26, hy - 30); d.lineTo(hx + 26, hy + 30); d.moveTo(hx - 26, hy); d.lineTo(hx + 26, hy); d.stroke();
  const deckTex = new THREE.CanvasTexture(dc);
  deckTex.colorSpace = THREE.SRGBColorSpace;
  const deckGeo = new THREE.ShapeGeometry(outline(B * 0.985, L * 0.99), 24);
  // map plan coords to the texture: u along length, v across the beam
  const pos = deckGeo.attributes.position as THREE.BufferAttribute;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) + L / 2) / L;
    uv[i * 2 + 1] = (pos.getY(i) + B) / (2 * B);
  }
  deckGeo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  deckGeo.rotateX(-Math.PI / 2);
  const deck = new THREE.Mesh(deckGeo, new THREE.MeshStandardMaterial({ map: deckTex, roughness: 0.8 }));
  deck.position.y = -0.035;
  ship.add(deck);

  // "030" on both sides of the bow
  const nc = document.createElement('canvas');
  nc.width = 256; nc.height = 128;
  const n = nc.getContext('2d')!;
  n.fillStyle = '#f2f2ee'; n.font = 'bold 96px "Big Shoulders Display", Arial Narrow, sans-serif'; n.textAlign = 'center'; n.textBaseline = 'middle';
  n.strokeStyle = '#3a3c3f'; n.lineWidth = 6; n.strokeText('030', 128, 68); n.fillText('030', 128, 68);
  const numTex = new THREE.CanvasTexture(nc);
  numTex.colorSpace = THREE.SRGBColorSpace;
  for (const side of [1, -1]) {
    const num = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.18), new THREE.MeshStandardMaterial({ map: numTex, transparent: true, roughness: 0.6 }));
    num.position.set(1.62, -0.2, side * (B * 0.79 + 0.004));
    num.rotation.y = side > 0 ? 0.2 : Math.PI - 0.2;
    ship.add(num);
  }

  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z = 0, parent: THREE.Object3D = ship) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  const box = (w: number, h: number, dd: number, x: number, y: number, mat: THREE.Material, z = 0) => add(new THREE.BoxGeometry(w, h, dd), mat, x, y + h / 2, z);

  // superstructure: stacked black and silver blocks
  box(1.9, 0.12, 0.36, -0.05, -0.03, dark);
  box(1.6, 0.1, 0.3, -0.02, 0.09, light);
  box(1.3, 0.12, 0.34, 0.0, 0.19, black);
  box(0.9, 0.1, 0.26, -0.05, 0.31, silver);
  box(0.34, 0.07, 0.4, 0.1, 0.25, dark);       // bridge wings
  // forward tower with radar
  box(0.28, 0.28, 0.22, 0.38, 0.41, dark);
  box(0.2, 0.14, 0.18, 0.38, 0.69, black);
  add(new THREE.CylinderGeometry(0.012, 0.016, 0.42, 8), dark, 0.38, 1.04);
  const dish = add(new THREE.CylinderGeometry(0.06, 0.02, 0.025, 16, 1, true), silver, 0.38, 1.18);
  dish.rotation.z = Math.PI / 2.4;
  add(new THREE.BoxGeometry(0.02, 0.02, 0.22), dark, 0.38, 1.1);
  // funnels with black mesh domes
  for (const fx of [0.02, -0.5]) {
    add(new THREE.CylinderGeometry(0.085, 0.1, 0.34, 20), dark, fx, 0.54);
    add(new THREE.SphereGeometry(0.084, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), black, fx, 0.71);
  }
  // aft tower and mast
  box(0.24, 0.24, 0.2, -0.28, 0.41, silver);
  add(new THREE.CylinderGeometry(0.01, 0.014, 0.5, 8), dark, -0.28, 0.9);
  add(new THREE.BoxGeometry(0.015, 0.015, 0.18), dark, -0.28, 1.0);
  // lattice-ish side gantries
  for (const z of [0.2, -0.2]) box(1.0, 0.03, 0.04, -0.05, 0.29, light, z);

  // main turrets: dark angular housings, triple barrels with copper bands and star caps
  const housing = (() => {
    const p = new THREE.Shape();
    p.moveTo(-0.17, 0); p.lineTo(0.12, 0); p.lineTo(0.2, 0.06); p.lineTo(0.18, 0.11); p.lineTo(-0.17, 0.11); p.lineTo(-0.17, 0);
    const g = new THREE.ExtrudeGeometry(p, { depth: 0.24, bevelEnabled: false });
    g.translate(0, 0, -0.12);
    return g;
  })();
  const turret = (x: number, y: number, facing: 1 | -1) => {
    const t = new THREE.Group();
    add(new THREE.CylinderGeometry(0.12, 0.13, 0.08, 24), black, 0, 0.04, 0, t);
    const h = add(housing, dark, 0, 0.08, 0, t);
    for (let k = 0; k < 4; k++) add(new THREE.BoxGeometry(0.005, 0.1, 0.03), M(0x2a4766), -0.05 + k * 0.05, 0.14, 0.121, t);
    for (const z of [-0.07, 0, 0.07]) {
      const g = new THREE.Group();
      add(new THREE.CylinderGeometry(0.016, 0.016, 0.06, 12), copper, 0, 0.03, 0, g);
      add(new THREE.CylinderGeometry(0.013, 0.015, 0.46, 12), barrelM, 0, 0.29, 0, g);
      add(new THREE.CylinderGeometry(0.0145, 0.0145, 0.012, 12), M(0x2a1c10), 0, 0.523, 0, g);
      add(new THREE.CircleGeometry(0.009, 5), new THREE.MeshBasicMaterial({ color: 0xf2c230 }), 0, 0.53, 0, g).rotation.x = -Math.PI / 2;
      g.rotation.z = -Math.PI / 2 + 0.08;
      g.position.set(0.16, 0.14, z);
      t.add(g);
    }
    h.castShadow = true;
    t.position.set(x, y, 0);
    if (facing < 0) t.rotation.y = Math.PI;
    ship.add(t);
  };
  turret(1.25, -0.035, 1);
  box(0.36, 0.1, 0.3, 0.92, -0.035, dark);
  turret(0.92, 0.065, 1);
  turret(-1.15, -0.035, -1);
  box(0.36, 0.1, 0.3, -0.84, -0.035, dark);
  turret(-0.84, 0.065, -1);

  // secondary guns along the sides: white twin barrels with red tips
  for (const x of [0.6, 0.15, -0.35]) {
    for (const side of [1, -1]) {
      const g = new THREE.Group();
      add(new THREE.BoxGeometry(0.08, 0.05, 0.07), dark, 0, 0.025, 0, g);
      for (const dz of [-0.016, 0.016]) {
        const b = add(new THREE.CylinderGeometry(0.008, 0.008, 0.14, 8), light, 0, 0.04, dz, g);
        b.rotation.x = Math.PI / 2; b.position.z += 0.07;
        add(new THREE.SphereGeometry(0.009, 8, 6), red, 0, 0.04, dz + 0.14, g);
      }
      g.position.set(x, -0.03, side * 0.19);
      if (side < 0) g.rotation.y = Math.PI;
      ship.add(g);
    }
  }
  // a single gun mount on the bow and stern like the photos
  for (const [x, f] of [[1.85, 1], [-1.95, -1]] as const) {
    const g = new THREE.Group();
    add(new THREE.BoxGeometry(0.1, 0.05, 0.08), silver, 0, 0.025, 0, g);
    const b = add(new THREE.CylinderGeometry(0.014, 0.014, 0.16, 10), light, 0.08, 0.06, 0, g);
    b.rotation.z = -Math.PI / 2;
    add(new THREE.SphereGeometry(0.016, 10, 8), red, 0.16, 0.06, 0, g);
    g.position.set(x, -0.035, 0);
    if (f < 0) g.rotation.y = Math.PI;
    ship.add(g);
  }

  // white rope railing on posts along the deck edge
  const edge: THREE.Vector3[] = [];
  const pts = outline(B * 0.94, L * 0.97).getSpacedPoints(110);
  pts.forEach((p) => edge.push(new THREE.Vector3(p.x, 0, -p.y)));
  const post = new THREE.CylinderGeometry(0.006, 0.006, 0.06, 6);
  const cap = new THREE.SphereGeometry(0.011, 8, 6);
  edge.forEach((p, i) => {
    if (i % 2) return;
    add(post, silver, p.x, -0.005, p.z);
    add(cap, silver, p.x, 0.028, p.z);
  });
  for (const hgt of [0.008, 0.026]) {
    const curve = new THREE.CatmullRomCurve3(edge.map((p) => p.clone().setY(hgt)), true);
    add(new THREE.TubeGeometry(curve, 300, 0.0035, 5, true), rope, 0, 0);
  }

  // warm lights, wired in like the real one
  const bulb = new THREE.SphereGeometry(0.018, 10, 10);
  const spots: [number, number, number][] = [
    [0.38, 1.26, 0], [0.38, 0.84, 0.1], [0.38, 0.84, -0.1], [-0.28, 1.16, 0],
    [0.5, 0.31, 0.17], [0.5, 0.31, -0.17], [-0.4, 0.31, 0.17], [-0.4, 0.31, -0.17],
    [0.2, 0.42, 0.14], [-0.3, 0.42, -0.14], [2.12, 0.02, 0], [-2.15, 0.02, 0],
  ];
  spots.forEach(([x, y, z]) => {
    const m = add(bulb, new THREE.MeshBasicMaterial({ color: 0xffd27a }), x, y, z);
    lights.push(m);
  });
  const glow = new THREE.PointLight(0xffc860, 1.4, 2.6);
  glow.position.set(0.1, 0.7, 0);
  ship.add(glow);

  return ship;
}
