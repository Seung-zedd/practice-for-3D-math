# practice-for-3D-math
This repository has been used for the understanding of Mathematics for Machine Learning as followed below Table of Contents with typing the code per chapter.

> “I wanted JARVIS🤖. Unfortunately, I had to learn linear algebra first.”

<br>

📢Note that the below Table of Contents will be modified anytime when each Three.js module is added since i'm a newbie of both Three.js and MML as well.

## 📚Table of Contents

> **A 12-week journey from linear algebra to WebXR — learning each concept twice: once through MML, and once again by making it visible with Three.js.**

### Week 0 — ✅ Linear Systems *(MML 2.1–2.3)*

- Gaussian elimination, REF/RREF, inverse matrices, and the Minus-1 Trick
- General solutions as a particular solution plus the null space
- **Checkpoint:** Understand how linear systems describe the degrees of freedom available in a 3D scene

### Weeks 1–2 — ✅ Vector Spaces and Bases *(MML 2.4–2.6)*

- Vector spaces, subspaces, linear independence, bases, and dimension
- Manipulate a cube with `Vector3`, `add()`, and `multiplyScalar()`
- **XR connection:** Independent basis vectors form a valid coordinate frame; dependent vectors collapse geometry and break surface normals
- **Build:** A scene where vector operations become visible spatial movement

### Weeks 3–4 — ✅ Linear Mappings and Affine Spaces *(MML 2.7–2.8)*

- Linear mappings, transformation matrices, change of basis, and affine spaces
- Construct translation, rotation, and scaling matrices by hand with `Matrix4`
- Explore matrix composition directly: **SR ≠ RS**
- **XR connection:** Affine space provides the mathematical bridge from linear transformations to translation in 3D space
- **Build:** An interactive transformation-matrix visualization

### Weeks 5–6 — ☑️Homogeneous Coordinates and the MVP Pipeline

- Move beyond MML into the Three.js rendering pipeline
- Understand why 3D graphics uses 4×4 matrices and what the `w` component represents
- Deconstruct the `PerspectiveCamera` projection matrix
- **Build:** A scene that reveals each stage of **Model → View → Projection**

### Weeks 7–9 — Analytic Geometry *(MML Chapter 3)*

- Inner products, norms, distances, angles, orthogonality, and projections
- Use `Raycaster` for object selection and calculate surface normals and angles
- **XR connection:** The mathematical core of spatial queries, pointing, collision reasoning, lighting, and interaction
- **Build:** A raycasting-based spatial interaction scene

### Weeks 10–11 — From Euler Angles to Quaternions

- Examine the limits of Euler angles and reproduce gimbal lock
- Learn quaternion rotation and smooth interpolation with `Quaternion.slerp()`
- **XR connection:** Stable orientation tracking for cameras, controllers, and spatial objects
- **Build:** An interactive Euler-angle vs. quaternion comparison

### Week 12 — Enter WebXR

- Enable `renderer.xr` across the scenes built throughout the roadmap
- Test headset viewpoints and spatial interaction with the WebXR Emulator
- **Final Build:** Three WebXR scenes that turn the mathematical foundations into an immersive experience

---

### Beyond the Roadmap

`Linear Algebra → 3D Geometry → Three.js → WebXR → Spatial Interaction → Digital Twins → Physical AI`

This roadmap is not a deadline. The objective is to keep the chain unbroken: study the mathematics, render it, interact with it, and eventually bring it into XR.
  
