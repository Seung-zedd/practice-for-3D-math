import * as THREE from "three";

const COLORS = {
  original: 0xffffff,
  rotationFirst: 0xf59e0b,
  scalingFirst: 0xa78bfa,
  rotationThenScaling: 0x22d3ee,
  scalingThenRotation: 0xf43f5e,
};

export function createTransformationMatrices(uniformScaling = false) {
  // rotationMatrix ↔ R: +90° rotation about the Z axis.
  const rotationMatrix = new THREE.Matrix4().set(
    0, -1, 0, 0,
    1, 0, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  );

  const yScale = uniformScaling ? 2 : 3;

  // scalingMatrix ↔ S: diag(2, 3, 1), or 2I when the toggle is enabled.
  const scalingMatrix = new THREE.Matrix4().set(
    2, 0, 0, 0,
    0, yScale, 0, 0,
    0, 0, uniformScaling ? 2 : 1, 0,
    0, 0, 0, 1,
  );

  // compositeSR ↔ SR, compositeRS ↔ RS.
  const compositeSR = new THREE.Matrix4().multiplyMatrices(
    scalingMatrix,
    rotationMatrix,
  );
  const compositeRS = new THREE.Matrix4().multiplyMatrices(
    rotationMatrix,
    scalingMatrix,
  );

  return { rotationMatrix, scalingMatrix, compositeSR, compositeRS };
}

export function calculateComposition(uniformScaling = false) {
  const originalVector = new THREE.Vector3(1, 0, 0);
  const { rotationMatrix, scalingMatrix, compositeSR, compositeRS } =
    createTransformationMatrices(uniformScaling);

  // Rv and Sv are the intermediate vectors of the two sequences.
  const rotationFirst = originalVector.clone().applyMatrix4(rotationMatrix);
  const scalingFirst = originalVector.clone().applyMatrix4(scalingMatrix);

  // SRv and RSv are obtained by applying each transformation in sequence.
  const rotationThenScaling = rotationFirst.clone().applyMatrix4(scalingMatrix);
  const scalingThenRotation = scalingFirst.clone().applyMatrix4(rotationMatrix);

  // Applying each composite matrix once must match the sequential results.
  const compositeSRResult = originalVector.clone().applyMatrix4(compositeSR);
  const compositeRSResult = originalVector.clone().applyMatrix4(compositeRS);

  return {
    originalVector,
    rotationFirst,
    scalingFirst,
    rotationThenScaling,
    scalingThenRotation,
    compositeSRResult,
    compositeRSResult,
  };
}

function createArrow(vector, color, zOffset) {
  const origin = new THREE.Vector3(0, 0, zOffset);
  const displayedVector = vector.clone().setZ(zOffset);

  return new THREE.ArrowHelper(
    displayedVector.clone().sub(origin).normalize(),
    origin,
    vector.length(),
    color,
    0.2,
    0.11,
  );
}

function createPanel() {
  const panel = document.createElement("aside");
  panel.style.cssText = [
    "position:fixed",
    "top:16px",
    "left:16px",
    "z-index:10",
    "padding:14px 16px",
    "border:1px solid #475569",
    "border-radius:10px",
    "background:rgba(15,23,42,0.88)",
    "color:#e2e8f0",
    "font:14px/1.55 ui-monospace,Consolas,monospace",
  ].join(";");
  document.body.appendChild(panel);
  return panel;
}

export function createCompositionVisualization(scene) {
  const arrows = new THREE.Group();
  scene.add(arrows);

  const panel = createPanel();
  let uniformScaling = false;

  function renderComparison() {
    arrows.clear();
    const result = calculateComposition(uniformScaling);

    // Small Z offsets only prevent overlapping arrows from flickering; every
    // mathematical vector still has z = 0 and lies in the XY plane.
    arrows.add(createArrow(result.originalVector, COLORS.original, 0));
    arrows.add(createArrow(result.rotationFirst, COLORS.rotationFirst, 0.03));
    arrows.add(createArrow(result.scalingFirst, COLORS.scalingFirst, 0.06));
    arrows.add(
      createArrow(result.rotationThenScaling, COLORS.rotationThenScaling, 0.09),
    );
    arrows.add(
      createArrow(result.scalingThenRotation, COLORS.scalingThenRotation, 0.12),
    );

    const sr = result.rotationThenScaling.toArray().join(", ");
    const rs = result.scalingThenRotation.toArray().join(", ");
    const relation = result.rotationThenScaling.equals(result.scalingThenRotation)
      ? "SRv = RSv"
      : "SRv ≠ RSv";

    panel.innerHTML = `
      <strong>Transformation composition</strong><br>
      <span style="color:#ffffff">white: v = (1, 0, 0)</span><br>
      <span style="color:#f59e0b">orange: Rv = (0, 1, 0)</span><br>
      <span style="color:#a78bfa">purple: Sv = (2, 0, 0)</span><br>
      <span style="color:#22d3ee">cyan: SRv = (${sr})</span><br>
      <span style="color:#f43f5e">red: RSv = (${rs})</span><br>
      <strong>${relation}</strong><br>
      <button id="scaling-mode" style="margin-top:8px;padding:5px 8px;cursor:pointer">
        ${uniformScaling ? "Use non-uniform S" : "Compare uniform S = 2I"}
      </button>
    `;

    panel.querySelector("#scaling-mode").addEventListener("click", () => {
      uniformScaling = !uniformScaling;
      renderComparison();
    });
  }

  renderComparison();
  return () => {};
}
