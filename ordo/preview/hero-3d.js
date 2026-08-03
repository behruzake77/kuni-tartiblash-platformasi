/**
 * Ordo Core Orb — Three.js hero scene
 * Glass core + metal rings + ambient particles + mouse parallax
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const reduced =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
  window.innerWidth < 640;

const mount = document.getElementById("orb-canvas");
const fallback = document.getElementById("orb-fallback");

if (!mount) {
  /* no-op */
} else if (reduced) {
  mount.style.display = "none";
  if (fallback) fallback.hidden = false;
} else {
  initOrb(mount, fallback);
}

function initOrb(el, fallbackEl) {
  let w = el.clientWidth || 440;
  let h = el.clientHeight || 440;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  el.appendChild(renderer.domElement);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 100);
  camera.position.set(0, 0.15, 4.6);

  // Lights
  scene.add(new THREE.AmbientLight(0x6b7cff, 0.35));

  const key = new THREE.DirectionalLight(0xffffff, 1.35);
  key.position.set(3.2, 4.2, 2.5);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x22d3ee, 0.85);
  rim.position.set(-3.5, -1.2, -2);
  scene.add(rim);

  const fill = new THREE.PointLight(0x8b5cf6, 18, 12, 2);
  fill.position.set(-1.4, 0.6, 2.2);
  scene.add(fill);

  const warm = new THREE.PointLight(0x3b82f6, 14, 10, 2);
  warm.position.set(1.8, -1.2, 1.5);
  scene.add(warm);

  const root = new THREE.Group();
  scene.add(root);

  // --- Glass core ---
  const coreGeo = new THREE.SphereGeometry(1.05, 96, 96);
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a2240,
    metalness: 0.15,
    roughness: 0.08,
    transmission: 0.72,
    thickness: 1.1,
    ior: 1.45,
    transparent: true,
    opacity: 0.95,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.2,
    attenuationColor: new THREE.Color(0x3b82f6),
    attenuationDistance: 2.5,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  root.add(core);

  // Inner emissive glow sphere
  const glowGeo = new THREE.SphereGeometry(0.52, 48, 48);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x6366f1,
    transparent: true,
    opacity: 0.55,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  root.add(glow);

  const glow2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.85,
    })
  );
  root.add(glow2);

  // Soft halo sprite-like shell
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(1.22, 48, 48),
    new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.07,
      side: THREE.BackSide,
      depthWrite: false,
    })
  );
  root.add(halo);

  // --- Orbital rings ---
  function makeRing(radius, tube, color, tiltX, tiltZ) {
    const geo = new THREE.TorusGeometry(radius, tube, 24, 160);
    const mat = new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.92,
      roughness: 0.28,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      emissive: color,
      emissiveIntensity: 0.12,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = tiltX;
    mesh.rotation.z = tiltZ;
    return mesh;
  }

  const ring1 = makeRing(1.55, 0.018, 0x3b82f6, Math.PI / 2.15, 0.25);
  const ring2 = makeRing(1.78, 0.012, 0x8b5cf6, Math.PI / 2.6, -0.55);
  const ring3 = makeRing(1.95, 0.008, 0x22d3ee, Math.PI / 1.85, 0.9);
  root.add(ring1, ring2, ring3);

  // Ring accent beads
  function bead(color, parent, angle) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 24, 24),
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.9,
        metalness: 0.4,
        roughness: 0.2,
      })
    );
    m.userData.angle = angle;
    m.userData.parent = parent;
    m.userData.radius = parent.geometry.parameters.radius;
    root.add(m);
    return m;
  }
  const beads = [
    bead(0x3b82f6, ring1, 0.2),
    bead(0x8b5cf6, ring2, 2.1),
    bead(0x22d3ee, ring3, 4.0),
  ];

  // --- Particles ---
  const COUNT = 480;
  const pGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(COUNT * 3);
  const phases = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const r = 2.1 + Math.random() * 2.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
    positions[i * 3 + 2] = r * Math.cos(phi);
    phases[i] = Math.random() * Math.PI * 2;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xb4c4ff,
    size: 0.018,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  // Mouse parallax
  const targetRot = { x: 0, y: 0 };
  const mouse = { x: 0, y: 0 };
  const onMove = (e) => {
    const rect = el.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    targetRot.y = mouse.x * 0.35;
    targetRot.x = mouse.y * 0.2;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  // Resize
  const ro = new ResizeObserver(() => {
    w = el.clientWidth;
    h = el.clientHeight || w;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  });
  ro.observe(el);

  // Pause when offscreen
  let visible = true;
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
    },
    { threshold: 0.05 }
  );
  io.observe(el);

  const clock = new THREE.Clock();
  let raf = 0;

  function placeBead(b, t) {
    const ring = b.userData.parent;
    const r = b.userData.radius;
    const a = b.userData.angle + t * 0.35;
    // Local torus XY plane, then apply ring world matrix
    const local = new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0);
    local.applyEuler(ring.rotation);
    b.position.copy(local);
  }

  function animate() {
    raf = requestAnimationFrame(animate);
    if (!visible) return;

    const t = clock.getElapsedTime();

    // Idle float + breathe
    root.position.y = Math.sin(t * 0.7) * 0.08;
    const breathe = 1 + Math.sin(t * 0.9) * 0.015;
    core.scale.setScalar(breathe);
    glow.scale.setScalar(1 + Math.sin(t * 1.4) * 0.06);
    glow2.scale.setScalar(1 + Math.sin(t * 1.8 + 1) * 0.1);
    glowMat.opacity = 0.45 + Math.sin(t * 1.2) * 0.12;

    // Slow spin
    core.rotation.y = t * 0.12;
    core.rotation.x = Math.sin(t * 0.2) * 0.08;
    ring1.rotation.z = 0.25 + t * 0.18;
    ring2.rotation.z = -0.55 - t * 0.12;
    ring3.rotation.z = 0.9 + t * 0.08;
    ring1.rotation.x = Math.PI / 2.15 + Math.sin(t * 0.3) * 0.05;
    ring2.rotation.x = Math.PI / 2.6 + Math.cos(t * 0.25) * 0.06;

    beads.forEach((b) => placeBead(b, t));

    // Parallax damp
    root.rotation.y += (targetRot.y - root.rotation.y) * 0.04;
    root.rotation.x += (targetRot.x - root.rotation.x) * 0.04;

    // Particles drift
    const pos = points.geometry.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      pos[i3 + 1] += Math.sin(t * 0.4 + phases[i]) * 0.00035;
      pos[i3] += Math.cos(t * 0.25 + phases[i]) * 0.0002;
    }
    points.geometry.attributes.position.needsUpdate = true;
    points.rotation.y = t * 0.03;

    renderer.render(scene, camera);
  }

  // Intro scale
  root.scale.setScalar(0.01);
  const introStart = performance.now();
  function intro() {
    const u = Math.min(1, (performance.now() - introStart) / 1100);
    // ease-out cubic
    const e = 1 - Math.pow(1 - u, 3);
    root.scale.setScalar(0.01 + e * 0.99);
    if (u < 1) requestAnimationFrame(intro);
  }
  intro();
  animate();

  if (fallbackEl) fallbackEl.hidden = true;

  // Cleanup hook
  window.__ordoOrbDispose = () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("pointermove", onMove);
    renderer.dispose();
    coreGeo.dispose();
    coreMat.dispose();
    pGeo.dispose();
    pMat.dispose();
  };
}
