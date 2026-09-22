import * as THREE from "three";

const COLORS = {
  original: 0xffffff,
  linear: 0xf59e0b,
  translation: 0x22d3ee,
  affine: 0xf43f5e,
  mappedOrigin: 0xa78bfa,
};

export function createAffineTransformation() {
  // linearMatrix ↔ A: +90° rotation about the Z axis.
  const linearMatrix = new THREE.Matrix4().set(
    0, -1, 0, 0,
    1, 0, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  );

  // translationVector ↔ a. It is added separately because this exercise is
  // about phi(x) = Ax + a, before homogeneous coordinates are introduced.
  const translationVector = new THREE.Vector3(2, 1, 0);
  return { linearMatrix, translationVector };
}

export function calculateAffineMapping(
  originalVector = new THREE.Vector3(1, 0, 0),
) {
  const { linearMatrix, translationVector } = createAffineTransformation();

  // linearResult ↔ Ax
  const linearResult = originalVector.clone().applyMatrix4(linearMatrix);

  // affineResult ↔ phi(x) = Ax + a
  const affineResult = linearResult.clone().add(translationVector);

  // phi(0) = A0 + a = a: affine mappings do not have to preserve the origin.
  const mappedOrigin = new THREE.Vector3(0, 0, 0)
    .applyMatrix4(linearMatrix)
    .add(translationVector);

  return {
    originalVector,
    linearResult,
    translationVector,
    affineResult,
    mappedOrigin,
  };
}

function createArrow(start, end, color, zOffset = 0) {
  const origin = start.clone().setZ(start.z + zOffset);
  const target = end.clone().setZ(end.z + zOffset);
  const displacement = target.sub(origin);

  return new THREE.ArrowHelper(
    displacement.clone().normalize(),
    origin,
    displacement.length(),
    color,
    0.2,
    0.11,
  );
}

function createPoint(position, color, radius = 0.09) {
  const point = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 20, 20),
    new THREE.MeshBasicMaterial({ color }),
  );
  point.position.copy(position);
  return point;
}

function createPanel() {
  const panel = document.createElement("aside");
  panel.style.cssText = [
    "position:fixed",
    "top:16px",
    "left:16px",
    "z-index:10",
    "max-width:390px",
    "padding:14px 16px",
    "border:1px solid #475569",
    "border-radius:10px",
    "background:rgba(15,23,42,0.9)",
    "color:#e2e8f0",
    "font:14px/1.55 ui-monospace,Consolas,monospace",
  ].join(";");
  panel.innerHTML = `
    <strong>Affine mapping: φ(x) = Ax + a</strong><br>
    <span style="color:#ffffff">white: x = (1, 0)</span><br>
    <span style="color:#f59e0b">orange: Ax = (0, 1)</span><br>
    <span style="color:#22d3ee">cyan: +a = +(2, 1)</span><br>
    <span style="color:#f43f5e">red point: φ(x) = (2, 2)</span><br>
    <span style="color:#a78bfa">purple: φ(0) = a = (2, 1)</span><br>
    <br>
    Linear: 0 → 0<br>
    Affine: 0 → a, so the origin is not preserved
  `;
  document.body.appendChild(panel);
}

export function createAffineVisualization(scene) {
  const origin = new THREE.Vector3(0, 0, 0);
  const result = calculateAffineMapping();
  const group = new THREE.Group();

  // x and Ax are vectors based at the origin.
  group.add(createArrow(origin, result.originalVector, COLORS.original));
  group.add(createArrow(origin, result.linearResult, COLORS.linear, 0.03));

  // Translation is a displacement from Ax to Ax + a, not another vector
  // based at the origin.
  group.add(
    createArrow(
      result.linearResult,
      result.affineResult,
      COLORS.translation,
      0.06,
    ),
  );

  // The mapped origin makes phi(0) = a visible.
  group.add(createArrow(origin, result.mappedOrigin, COLORS.mappedOrigin, 0.09));
  group.add(createPoint(result.affineResult, COLORS.affine));
  group.add(createPoint(result.mappedOrigin, COLORS.mappedOrigin, 0.075));

  scene.add(group);
  createPanel();
  return () => {};
}
