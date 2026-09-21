import * as THREE from "three";

const VECTOR_LENGTH = 2;

/**
 * Computes v' = R(theta)v by embedding the learned 3x3 Z-axis rotation
 * matrix in a Three.js Matrix4. No object's rotation API is used here.
 */
export function rotateVector(originalVector, theta) {
  // rotationMatrix ↔ R(theta)
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);
  const rotationMatrix = new THREE.Matrix4().set(
    cosTheta,
    -sinTheta,
    0,
    0,
    sinTheta,
    cosTheta,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
  );

  // applyMatrix4 ↔ matrix-vector multiplication R(theta)v
  // rotatedVector ↔ v'
  return originalVector.clone().applyMatrix4(rotationMatrix);
}

export function createRotationVisualization(scene) {
  // originalVector ↔ v = (2, 0, 0)
  const originalVector = new THREE.Vector3(VECTOR_LENGTH, 0, 0);
  const origin = new THREE.Vector3(0, 0, 0);

  const originalArrow = new THREE.ArrowHelper(
    originalVector.clone().normalize(),
    origin,
    originalVector.length(),
    0xf59e0b,
    0.22,
    0.12,
  );
  scene.add(originalArrow);

  const rotatedArrow = new THREE.ArrowHelper(
    originalVector.clone().normalize(),
    origin,
    originalVector.length(),
    0x22d3ee,
    0.22,
    0.12,
  );
  scene.add(rotatedArrow);

  const orbit = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 128 }, (_, index) => {
        const angle = (index / 128) * Math.PI * 2;
        return new THREE.Vector3(
          VECTOR_LENGTH * Math.cos(angle),
          VECTOR_LENGTH * Math.sin(angle),
          0,
        );
      }),
    ),
    new THREE.LineBasicMaterial({ color: 0x475569 }),
  );
  scene.add(orbit);

  const endpoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee }),
  );
  scene.add(endpoint);

  return function update(elapsedSeconds) {
    // animation ↔ continuously observe R(theta)v as theta changes.
    const theta = elapsedSeconds * 0.7;
    const rotatedVector = rotateVector(originalVector, theta);

    rotatedArrow.setDirection(rotatedVector.clone().normalize());
    rotatedArrow.setLength(rotatedVector.length(), 0.22, 0.12);
    endpoint.position.copy(rotatedVector);
  };
}
