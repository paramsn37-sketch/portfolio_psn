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

/** A simple battleship, about 4 units long, built from primitives. */
function buildStandIn(lights: THREE.Mesh[]) {
  const ship = new THREE.Group();
  const grey = new THREE.MeshStandardMaterial({ color: 0x8a9399, metalness: 0.35, roughness: 0.55 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x4e565c, metalness: 0.4, roughness: 0.5 });
  const red = new THREE.MeshStandardMaterial({ color: 0x7e2a22, roughness: 0.7 });
  const deck = new THREE.MeshStandardMaterial({ color: 0x9c8a6a, roughness: 0.85 });
  const black = new THREE.MeshStandardMaterial({ color: 0x1d1f21, roughness: 0.6 });

  // hull outline seen from above: pointed bow at +x, rounded stern at -x
  const outline = (half: number, len: number) => {
    const s = new THREE.Shape();
    s.moveTo(len / 2, 0);
    s.quadraticCurveTo(len * 0.3, half, len * 0.1, half);
    s.lineTo(-len * 0.38, half);
    s.quadraticCurveTo(-len / 2, half * 0.9, -len / 2, 0);
    s.quadraticCurveTo(-len / 2, -half * 0.9, -len * 0.38, -half);
    s.lineTo(len * 0.1, -half);
    s.quadraticCurveTo(len * 0.3, -half, len / 2, 0);
    return s;
  };
  const slab = (half: number, len: number, h: number, mat: THREE.Material, y: number) => {
    const g = new THREE.ExtrudeGeometry(outline(half, len), { depth: h, bevelEnabled: false, curveSegments: 16 });
    g.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(g, mat);
    m.position.y = y;
    ship.add(m);
    return m;
  };
  slab(0.3, 3.7, 0.28, red, -0.6);      // below the waterline
  slab(0.36, 4.0, 0.42, grey, -0.32);   // main hull
  slab(0.345, 3.9, 0.02, deck, 0.1);    // wooden deck

  const box = (w: number, h: number, d: number, x: number, y: number, mat = grey) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y + h / 2, 0);
    ship.add(m);
    return m;
  };
  // superstructure, stepped
  box(1.2, 0.22, 0.42, 0.05, 0.12);
  box(0.8, 0.2, 0.34, 0.2, 0.34);
  box(0.42, 0.22, 0.26, 0.32, 0.54, dark);
  box(0.24, 0.12, 0.3, 0.38, 0.76);     // bridge
  // funnel
  const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.5, 20), grey);
  funnel.position.set(-0.18, 0.6, 0);
  funnel.rotation.z = 0.12;
  ship.add(funnel);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.05, 20), black);
  cap.position.set(-0.21, 0.86, 0);
  cap.rotation.z = 0.12;
  ship.add(cap);
  // mast
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.025, 0.9, 8), dark);
  mast.position.set(0.42, 1.25, 0);
  ship.add(mast);
  const yard = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.4, 6), dark);
  yard.rotation.x = Math.PI / 2;
  yard.position.set(0.42, 1.45, 0);
  ship.add(yard);

  // gun turrets: two forward, one aft
  const turret = (x: number, y: number, facing: 1 | -1) => {
    const t = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.14, 24), grey);
    t.add(base);
    const hood = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.24), dark);
    hood.position.set(0.02 * facing, 0.1, 0);
    t.add(hood);
    for (const z of [-0.06, 0.06]) {
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.5, 10), dark);
      barrel.rotation.z = -Math.PI / 2 * facing;
      barrel.position.set(0.36 * facing, 0.1, z);
      t.add(barrel);
    }
    t.position.set(x, y + 0.07, 0);
    ship.add(t);
  };
  turret(1.15, 0.12, 1);
  turret(0.82, 0.24, 1);
  box(0.36, 0.12, 0.3, 0.82, 0.12);     // raised barbette for the second turret
  turret(-1.05, 0.12, -1);

  // railings: thin posts along the deck edge
  const post = new THREE.CylinderGeometry(0.005, 0.005, 0.06, 4);
  for (let x = -1.6; x <= 1.5; x += 0.12) {
    const halfAt = x > 0.4 ? 0.34 * (1 - (x - 0.4) / 1.65) : 0.33;
    for (const side of [-1, 1]) {
      const p = new THREE.Mesh(post, dark);
      p.position.set(x, 0.15, side * halfAt);
      ship.add(p);
    }
  }

  // deck lights (he wired real ones into the model)
  const bulb = new THREE.SphereGeometry(0.022, 10, 10);
  const spots: [number, number, number][] = [
    [0.42, 1.7, 0], [0.38, 0.9, 0.16], [0.38, 0.9, -0.16], [-0.2, 0.92, 0], [1.9, 0.14, 0], [-1.9, 0.14, 0],
    [0.6, 0.36, 0.22], [0.6, 0.36, -0.22], [-0.5, 0.36, 0.22], [-0.5, 0.36, -0.22],
  ];
  spots.forEach(([x, y, z]) => {
    const m = new THREE.Mesh(bulb, new THREE.MeshBasicMaterial({ color: 0xffd27a }));
    m.position.set(x, y, z);
    ship.add(m);
    lights.push(m);
  });
  const glow = new THREE.PointLight(0xffc860, 1.2, 3);
  glow.position.set(0.3, 1.1, 0);
  ship.add(glow);

  return ship;
}
