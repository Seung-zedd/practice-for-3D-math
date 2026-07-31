import * as THREE from 'three';

export function linearDependence(c1, c2, c3) {
    const e1 = new THREE.Vector3(1, 0, 0);
    const e2 = new THREE.Vector3(0, 1, 0);
    const e3 = new THREE.Vector3(2, 0, 0);

    return new THREE.Vector3()
    .add(e1.clone().multiplyScalar(c1))
    .add(e2.clone().multiplyScalar(c2))
    .add(e3.clone().multiplyScalar(c3));
}