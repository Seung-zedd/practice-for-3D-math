import * as THREE from "three";

export function scatterPoints(scene, combineFn, color) {
  const geometry = new THREE.SphereGeometry(0.08);
  const material = new THREE.MeshBasicMaterial({ color });

  for (let c1 = -2; c1 <= 2; c1++) {
    for (let c2 = -2; c2 <= 2; c2++) {
      for (let c3 = -2; c3 <= 2; c3++) {
        const point = combineFn(c1, c2, c3);
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(point);
        scene.add(sphere);
      }
    }
  }
}
