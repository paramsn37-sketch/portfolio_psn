/**
 * The void behind the poster. Loaded only when the poster is torn down.
 * With a model URL (a .glb) it shows the 3D battleship; until then it shows photos of the
 * real one floating over an endless grid, which you can orbit, zoom and click to focus.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type Photo = { src: string; alt: string };

export async function mountShip(canvas: HTMLCanvasElement, modelUrl?: string, photos: Photo[] = []) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 8, 34);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 100);
  // step further back on tall screens so the whole photo wall fits
  const homeZ = () => (canvas.clientWidth < canvas.clientHeight ? 12.5 : 8.5);

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
  scene.add(floor);

  scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x101010, 1.4));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(4, 6, 3);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xf5c84a, 1.1);
  rim.position.set(-5, 2, -4);
  scene.add(rim);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  const stopSpin = () => (controls.autoRotate = false);
  controls.addEventListener('start', stopSpin);

  const clickables: THREE.Mesh[] = [];
  let onClick: ((e: PointerEvent) => void) | null = null;

  if (modelUrl) {
    floor.position.y = -0.62;
    camera.position.set(5.2, 2.6, 5.6);
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const gltf = await new GLTFLoader().loadAsync(modelUrl);
    const model = gltf.scene;
    // centre it and scale it to about 4 units long, sitting on the grid
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    model.scale.setScalar(4 / Math.max(size.x, size.y, size.z));
    box.setFromObject(model);
    model.position.sub(box.getCenter(new THREE.Vector3()));
    model.position.y += box.getSize(new THREE.Vector3()).y / 2 - 0.6;
    scene.add(model);
    controls.minDistance = 2.2;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.target.set(0, 0.1, 0);
    controls.autoRotate = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotateSpeed = 0.8;
  } else {
    // photos of the real ship on a gentle curved wall, glowing softly
    floor.position.y = -2.6;
    camera.position.set(0, 0.4, homeZ());
    controls.target.set(0, 0.2, 0);
    controls.minDistance = 2;
    controls.maxDistance = 18;
    controls.minAzimuthAngle = -Math.PI / 3;
    controls.maxAzimuthAngle = Math.PI / 3;
    controls.minPolarAngle = Math.PI * 0.2;
    controls.maxPolarAngle = Math.PI * 0.62;
    const loader = new THREE.TextureLoader();
    const textures = await Promise.all(photos.map((p) => loader.loadAsync(p.src)));
    // layout slots: [x, y, height, yaw]
    const slots: [number, number, number, number][] = [
      [0, 2.0, 1.25, 0],
      [-1.5, 0.15, 2.0, 0.28],
      [1.5, 0.15, 2.0, -0.28],
      [0, -1.75, 1.15, 0],
    ];
    textures.forEach((t, i) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const [x, y, h, yaw] = slots[i % slots.length];
      const img = t.image as HTMLImageElement;
      let w = h * (img.width / img.height);
      let hh = h;
      if (w > 4.6) { w = 4.6; hh = w / (img.width / img.height); }
      const group = new THREE.Group();
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.16, hh + 0.16), new THREE.MeshBasicMaterial({ color: 0xffd28a, transparent: true, opacity: 0.18, toneMapped: false }));
      glow.position.z = -0.01;
      const photo = new THREE.Mesh(new THREE.PlaneGeometry(w, hh), new THREE.MeshBasicMaterial({ map: t, toneMapped: false }));
      group.add(glow, photo);
      group.position.set(x, y, -Math.abs(x) * 0.35);
      group.rotation.y = yaw;
      group.userData = { float: i * 1.3 };
      scene.add(group);
      clickables.push(photo);
    });

    // click a photo to fly to it; click empty space to step back
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let down = { x: 0, y: 0 };
    canvas.addEventListener('pointerdown', (e) => (down = { x: e.clientX, y: e.clientY }));
    onClick = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) return;
      const r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(clickables)[0];
      if (hit) {
        const p = new THREE.Vector3();
        hit.object.getWorldPosition(p);
        const n = new THREE.Vector3(0, 0, 1).applyQuaternion(hit.object.getWorldQuaternion(new THREE.Quaternion()));
        const geo = (hit.object as THREE.Mesh).geometry as THREE.PlaneGeometry;
        const fitDist = (geo.parameters.height / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.25 * Math.max(1, (geo.parameters.width / geo.parameters.height) / camera.aspect);
        goTo(p, p.clone().add(n.multiplyScalar(fitDist)));
      } else {
        goTo(new THREE.Vector3(0, 0.2, 0), new THREE.Vector3(0, 0.4, homeZ()));
      }
    };
    canvas.addEventListener('pointerup', onClick);
  }

  // smooth camera flights
  let flight: { t0: number; from: [THREE.Vector3, THREE.Vector3]; to: [THREE.Vector3, THREE.Vector3] } | null = null;
  const goTo = (target: THREE.Vector3, pos: THREE.Vector3) => {
    flight = { t0: performance.now(), from: [controls.target.clone(), camera.position.clone()], to: [target, pos] };
  };

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < h ? 62 : 40;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  let raf = 0;
  const clock = new THREE.Clock();
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tick = () => {
    const t = clock.getElapsedTime();
    if (!still) scene.children.forEach((o) => { if (o.userData.float !== undefined) o.position.y += Math.sin(t * 0.8 + o.userData.float) * 0.0009; });
    if (flight) {
      const k = Math.min(1, (performance.now() - flight.t0) / 900);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      controls.target.lerpVectors(flight.from[0], flight.to[0], e);
      camera.position.lerpVectors(flight.from[1], flight.to[1], e);
      if (k === 1) flight = null;
    }
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  tick();

  return {
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (onClick) canvas.removeEventListener('pointerup', onClick);
      controls.removeEventListener('start', stopSpin);
      controls.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => { x.map?.dispose(); x.dispose(); });
      });
      renderer.dispose();
    },
  };
}
