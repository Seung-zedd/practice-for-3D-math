import * as THREE from "three";

// Column vectors: (x, y, z, w). The last column is translation.
export const transform = new THREE.Matrix4().set(
  0, -1, 0, 2,
  1,  0, 0, 1,
  0,  0, 1, 0,
  0,  0, 0, 1,
);

export function calculateHomogeneous() {
  const point = new THREE.Vector4(1, 0, 0, 1);
  const direction = new THREE.Vector4(1, 0, 0, 0);
  return {
    point,
    direction,
    mappedPoint: point.clone().applyMatrix4(transform),
    mappedDirection: direction.clone().applyMatrix4(transform),
  };
}

function arrow(from, to, color) {
  const delta = to.clone().sub(from);
  return new THREE.ArrowHelper(delta.clone().normalize(), from, delta.length(), color, 0.18, 0.1);
}

function dot(position, color) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.095, 16, 16),
    new THREE.MeshBasicMaterial({ color }),
  );
  mesh.position.copy(position);
  return mesh;
}

export function createHomogeneousVisualization(scene) {
  const { point, direction, mappedPoint, mappedDirection } = calculateHomogeneous();
  const origin = new THREE.Vector3();
  const p = new THREE.Vector3(point.x, point.y, point.z);
  const p2 = new THREE.Vector3(mappedPoint.x, mappedPoint.y, mappedPoint.z);
  const d = new THREE.Vector3(direction.x, direction.y, direction.z);
  const d2 = new THREE.Vector3(mappedDirection.x, mappedDirection.y, mappedDirection.z);

  scene.add(dot(p, 0xffffff), dot(p2, 0xfb7185));
  scene.add(arrow(origin, d, 0x94a3b8));
  // Draw the transformed direction at the transformed point: its base is arbitrary.
  scene.add(arrow(p2, p2.clone().add(d2), 0x22d3ee));

  const panel = document.createElement("aside");
  panel.style.cssText = "position:fixed;top:16px;left:16px;z-index:10;max-width:440px;padding:14px 16px;border:1px solid #475569;border-radius:10px;background:rgba(15,23,42,.92);color:#e2e8f0;font:14px/1.6 ui-monospace,Consolas,monospace";
  panel.innerHTML = `
    <strong>§2.9.4 Matrix4: point vs direction</strong><br>
    M = translation(2,1,0) × rotationZ(90°)<br><br>
    <span style="color:#fff">● Point (1,0,0,1)</span><br>
    <span style="color:#fb7185">● M × point = (${mappedPoint.toArray()})</span><br>
    <span style="color:#94a3b8">→ Direction (1,0,0,0)</span><br>
    <span style="color:#22d3ee">→ M × direction = (${mappedDirection.toArray()})</span><br><br>
    Both rotate; only the point gets translation.<br>
    For w=0, do not divide by w: this is a direction, not a position.
  `;
  document.body.appendChild(panel);
  return () => {};
}
