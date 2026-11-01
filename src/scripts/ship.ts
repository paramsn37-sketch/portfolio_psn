/**
 * The void behind the poster. Loaded only when the poster is torn down.
 * Loads the 3D battleship (.glb) over an endless grid; orbit and zoom it.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export async function mountShip(canvas: HTMLCanvasElement, modelUrl: string) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 8, 34);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 100);

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


  {
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
  }

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
        const mat = m.material as THREE.MeshBasicMaterial | THREE.MeshBasicMaterial[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => { x.map?.dispose(); x.dispose(); });
      });
      renderer.dispose();
    },
  };
}
