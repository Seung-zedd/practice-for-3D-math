import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Keep w until the perspective divide; Vector3.applyMatrix4 divides implicitly.
export function tracePoint(point, model, view, projection, width, height) {
  const world = point.clone().applyMatrix4(model);
  const camera = world.clone().applyMatrix4(view);
  const clip = camera.clone().applyMatrix4(projection);
  const ndc = Math.abs(clip.w) > 1e-8
    ? new THREE.Vector3(clip.x, clip.y, clip.z).divideScalar(clip.w) : null;
  const visible = clip.w > 0 && ['x', 'y', 'z'].every(axis => Math.abs(clip[axis]) <= clip.w);
  const screen = ndc ? { x: (ndc.x + 1) * width / 2, y: (1 - ndc.y) * height / 2 } : null;
  return { world, camera, clip, ndc, screen, visible };
}

export function startMvpExercise() {
  const style = document.createElement('style');
  style.textContent = `body{margin:0;overflow:auto;background:#101827;color:#e2e8f0;font:14px/1.5 system-ui}*{box-sizing:border-box}.mvp{padding:20px;max-width:1500px;margin:auto}.mvp h1{font-size:24px;margin:0 0 4px}.mvp p{color:#aebed2}.views{display:grid;grid-template-columns:1fr 1fr;gap:16px}.view{position:relative;aspect-ratio:4/3;min-width:0;border:1px solid #334155;border-radius:12px;overflow:hidden}.view canvas{display:block;width:100%;height:100%}.caption{position:absolute;top:10px;left:12px;background:#101827dd;padding:4px 8px;pointer-events:none}.marker{position:absolute;width:16px;height:16px;border:2px solid #fff;border-radius:50%;transform:translate(-50%,-50%);pointer-events:none}.settings{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0}.setting{background:#1e293b;padding:10px;border-radius:8px}.setting label{display:flex;justify-content:space-between}.setting input{width:100%}button{background:#334155;color:white;border:0;border-radius:6px;padding:8px 14px;cursor:pointer}table{width:100%;border-collapse:collapse;background:#182337}td,th{text-align:left;padding:10px;border-bottom:1px solid #334155}td:last-child{font-family:monospace}#status{color:#facc15}details{margin-top:12px}pre{overflow:auto;font-size:13px}@media(max-width:700px){.views{grid-template-columns:1fr}.settings{grid-template-columns:1fr 1fr}.mvp{padding:12px}td,th{padding:6px;font-size:12px}}`;
  document.head.append(style);
  const root = document.createElement('main');
  root.className = 'mvp';
  root.innerHTML = `<h1>2.10 · MVP 통합 실습</h1><p>노란 점 하나를 끝까지 따라가자. 물체의 로컬 점은 (1, 1, 0, 1). 축: X 빨강 · Y 초록 · Z 파랑.</p><div class="views"><div class="view" id="world-view"><span class="caption">월드 관찰 화면 · 드래그로 둘러보기</span></div><div class="view" id="camera-view"><span class="caption">학습 카메라의 화면 · 흰 원은 계산한 화면 위치</span><span class="marker"></span></div></div><div class="settings"></div><button id="reset">처음 배치로</button><p id="status"></p><table><thead><tr><th>단계</th><th>계산</th><th>좌표</th></tr></thead><tbody></tbody></table><details><summary>현재 M · V · P 행렬 펼치기</summary><pre id="matrices"></pre></details><p>평행이동 → 카메라 기준으로 읽기 → 투영 준비 → w′로 나누기 → 화면 좌표. 화면 좌표는 CSS 픽셀 기준이며 W, H는 화면 경계야.</p>`;
  document.body.append(root);
  const settings = [
    ['modelX', '물체 X 평행이동', -3, 3, 0, .1],
    ['modelZ', '물체 Z 평행이동', -10, 2, -4, .1],
    ['modelYaw', '물체 Y축 회전 (°)', -180, 180, 0, 1],
    ['cameraX', '카메라 X 위치', -3, 3, 0, .1],
    ['cameraYaw', '카메라 Y축 회전 (°)', -90, 90, 0, 1],
    ['fov', '카메라 세로 시야각 (°)', 30, 100, 90, 1],
  ];
  const values = {};
  for (const [key, label, min, max, value, step] of settings) {
    values[key] = value;
    const box = document.createElement('div'); box.className = 'setting';
    box.innerHTML = `<label for="${key}">${label}<output>${value}</output></label><input id="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">`;
    box.querySelector('input').addEventListener('input', event => {
      values[key] = Number(event.target.value); box.querySelector('output').value = event.target.value;
    });
    root.querySelector('.settings').append(box);
  }
  root.querySelector('#reset').onclick = () => {
    for (const [key, , , , value] of settings) {
      values[key] = value; root.querySelector(`#${key}`).value = value;
      root.querySelector(`#${key}`).previousElementSibling.querySelector('output').value = value;
    }
  };
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#101827');
  scene.add(new THREE.GridHelper(20, 20), new THREE.AxesHelper(3));
  const model = new THREE.Group(); scene.add(model);
  model.add(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ color: '#38bdf8', wireframe: true })));
  const dot = new THREE.Mesh(new THREE.SphereGeometry(.08), new THREE.MeshBasicMaterial({color:'#facc15'}));
  dot.position.set(1,1,0); model.add(dot);
  model.add(new THREE.AxesHelper(1.5));
  const learningCamera = new THREE.PerspectiveCamera(90, 4/3, .1, 20);
  scene.add(learningCamera);
  const helper = new THREE.CameraHelper(learningCamera); scene.add(helper);
  const observer = new THREE.PerspectiveCamera(55,4/3,.1,100);
  observer.position.set(8,6,9);
  const worldBox = root.querySelector('#world-view');
  const cameraBox = root.querySelector('#camera-view');
  const makeRenderer = box => {
    const renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)); box.append(renderer.domElement); return renderer;
  };
  const worldRenderer = makeRenderer(worldBox), cameraRenderer = makeRenderer(cameraBox);
  const controls = new OrbitControls(observer, worldRenderer.domElement);
  controls.target.set(0,0,-3); controls.enableDamping = true;
  const local = new THREE.Vector4(1,1,0,1);
  const fmt = v => v ? `(${[v.x,v.y,v.z,...(v.w === undefined ? [] : [v.w])].map(n=>n.toFixed(3)).join(', ')})` : '나눗셈 불가';
  const matrixText = (name, m) => `${name}\n${[0,1,2,3].map(row=>[0,1,2,3].map(col=>m.elements[col*4+row].toFixed(3).padStart(8)).join(' ')).join('\n')}`;
  let previousText = '';
  function animate() {
    requestAnimationFrame(animate);
    for (const [box, renderer, camera] of [[worldBox,worldRenderer,observer],[cameraBox,cameraRenderer,learningCamera]]) {
      const width = box.clientWidth, height = box.clientHeight;
      if (renderer.domElement.width !== Math.floor(width*renderer.getPixelRatio()) || renderer.domElement.height !== Math.floor(height*renderer.getPixelRatio())) renderer.setSize(width,height,false);
      camera.aspect = width/height; camera.updateProjectionMatrix();
    }
    model.position.set(values.modelX,0,values.modelZ);
    model.rotation.y = THREE.MathUtils.degToRad(values.modelYaw);
    learningCamera.position.set(values.cameraX,0,0);
    learningCamera.rotation.set(0,THREE.MathUtils.degToRad(values.cameraYaw),0);
    learningCamera.fov = values.fov; learningCamera.updateProjectionMatrix();
    scene.updateMatrixWorld(true); helper.update(); controls.update();
    const trace = tracePoint(local,model.matrixWorld,learningCamera.matrixWorldInverse,learningCamera.projectionMatrix,cameraBox.clientWidth,cameraBox.clientHeight);
    const rows = [
      ['로컬','시작점',fmt(local)], ['월드','M × p',fmt(trace.world)],
      ['카메라','V × p_world (V = C⁻¹)',fmt(trace.camera)],
      ['클립','P × p_camera',fmt(trace.clip)],
      ['NDC','(x′, y′, z′) / w′',fmt(trace.ndc)],
      ['화면','((x_NDC+1)W/2, (1−y_NDC)H/2)',trace.screen ? `(${trace.screen.x.toFixed(1)}, ${trace.screen.y.toFixed(1)})` : '정의되지 않음'],
    ];
    const text = rows.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join('')}</tr>`).join('');
    if (text !== previousText) {root.querySelector('tbody').innerHTML = text; previousText = text;}
    root.querySelector('#status').textContent = `앞쪽 깊이 d = −z_camera = ${(-trace.camera.z).toFixed(3)} · w′ = ${trace.clip.w.toFixed(3)} · ${trace.visible ? '점이 화면 안에 있어' : trace.clip.w <= 0 ? '점이 카메라 뒤 또는 카메라 위치에 있어' : '점이 시야각 또는 near/far 범위 밖에 있어'}`;
    const marker = root.querySelector('.marker'); marker.hidden = !trace.visible;
    if (trace.visible) {marker.style.left = `${trace.screen.x}px`; marker.style.top = `${trace.screen.y}px`;}
    root.querySelector('#matrices').textContent = [matrixText('M',model.matrixWorld),matrixText('V',learningCamera.matrixWorldInverse),matrixText('P',learningCamera.projectionMatrix)].join('\n\n');
    worldRenderer.render(scene,observer);
    helper.visible = false; cameraRenderer.render(scene,learningCamera); helper.visible = true;
  }
  animate();
}
