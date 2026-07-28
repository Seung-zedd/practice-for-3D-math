import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// axis of X = red, axis of Y = green, axis of Z = blue
export function initScene() {
  const scene = new THREE.Scene();

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

  scene.add(new THREE.AxesHelper(5));
  scene.add(new THREE.GridHelper(10, 10));

  return { scene, camera, renderer, controls };
}
