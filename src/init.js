import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// axis of X = red, axis of Y = green, axis of Z = blue
export function initScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111827);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(3, 3, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  scene.add(new THREE.AxesHelper(5));

  // GridHelper is created on the XZ plane. Rotate only the reference grid so
  // the plane being observed in this exercise is the XY plane (z = 0).
  const xyGrid = new THREE.GridHelper(10, 10, 0x64748b, 0x334155);
  xyGrid.rotation.x = Math.PI / 2;
  scene.add(xyGrid);

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", handleResize);

  return { scene, camera, renderer, controls };
}
