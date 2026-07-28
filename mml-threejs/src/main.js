import * as THREE from "three";
import { initScene } from "./init.js";
import { linearCombination } from "./Vector_spaces_and_Basis/linearCombination.js";

const { scene, camera, renderer, controls } = initScene();

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x44aa88, wireframe: true }),
);
scene.add(cube);

const target = linearCombination(2, 1, 1.5);
cube.position.copy(target);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();