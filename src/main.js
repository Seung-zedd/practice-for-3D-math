import * as THREE from "three";
import { initScene } from "./init.js";
import { linearCombination } from "./Vector_spaces_and_Basis/linearCombination.js";
import { linearDependence } from "./Vector_spaces_and_Basis/linearIndependence.js";
import { scatterPoints } from "./Vector_spaces_and_Basis/scatterPoints.js";
import { createRotationVisualization } from "./Linear_mapping_and_Matrix/rotationMatrix.js";
import { createCompositionVisualization } from "./Linear_mapping_and_Matrix/transformationComposition.js";
import { createAffineVisualization } from "./Linear_mapping_and_Matrix/affineMapping.js";
import { createHomogeneousVisualization } from "./Linear_mapping_and_Matrix/homogeneousMatrix4.js";

const { scene, camera, renderer, controls } = initScene();

// main.js is the exercise selector. The latest affine-mapping exercise is the
// default; previous exercises remain available through the query parameter.
const exercise =
  new URLSearchParams(window.location.search).get("exercise") ?? "homogeneous";

let updateExercise = () => {};

if (exercise === "vector-spaces") {
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x44aa88, wireframe: true }),
  );
  scene.add(cube);

  // 독립: 3D 전체를 채우는 큐브 형태
  scatterPoints(scene, linearCombination, 0x44aa88);

  // 종속: e3 = 2*e1 이라 xy평면(z=0)에만 뭉개짐
  scatterPoints(scene, linearDependence, 0xff4444);
} else if (exercise === "composition") {
  updateExercise = createCompositionVisualization(scene);
} else if (exercise === "affine") {
  updateExercise = createAffineVisualization(scene);
} else if (exercise === "homogeneous") {
  updateExercise = createHomogeneousVisualization(scene);
} else {
  updateExercise = createRotationVisualization(scene);
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  updateExercise(clock.getElapsedTime());
  controls.update();
  renderer.render(scene, camera);
}
animate();
