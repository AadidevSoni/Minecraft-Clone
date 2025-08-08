import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import {World} from "./world";

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor(0x80a0e0);
document.body.appendChild(renderer.domElement);

//Camera
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,2000);
camera.position.set(-32,16,-32);
//camera.lookAt(0,0,0);

//Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(16,0,16); //Middle of world
controls.update();

//Scene
const scene = new THREE.Scene();
const world = new World();
world.generate();
scene.add(world);

//Lighting
function setupLights() {
  const light1 = new THREE.DirectionalLight();
  light1.position.set(1,1,1);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight();
  light2.position.set(-1,1,-0.5);
  scene.add(light2);

  const ambient = new THREE.AmbientLight();
  ambient.intensity = 0.1;
  scene.add(ambient);
}

//Render loop
function animate() {
  requestAnimationFrame(animate);
  /*
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  */
  renderer.render(scene,camera);
}

//Responsiveness
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
})

setupLights();
animate();