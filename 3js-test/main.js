// Required Imports
import './style.css'
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as gsap from "gsap";

// Create base objects needed for rendering
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
})

// Configure Renderer and render blanks screen
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
renderer.render(scene, camera);

// Generates torus with material and adds to scene
const geometry = new THREE.TorusGeometry(10,0.1,16,100);
const material = new THREE.MeshStandardMaterial({color: 0x000000});
const torus = new THREE.Mesh(geometry,material);
scene.add(torus);

// Creates required lighting
const worldLight = new THREE.AmbientLight(0xffffff);
const pointLight = new THREE.PointLight(0xffffff, 10000, 100);
pointLight.position.set(20,20,20);
scene.add(pointLight)
scene.add(worldLight)

// Object needed for orbital controls
const controls = new OrbitControls(camera, renderer.domElement);

// Calls star function to fill area with spheres
Array(500).fill().forEach(addStar)

// Loads a cube texture and applies it to the background.
const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  "public/xpos.png",
  "public/xneg.png",
  "public/ypos.png",
  "public/yneg.png",
  "public/zpos.png",
  "public/zneg.png",
]);
scene.background = texture;

// Creates a moon with appropriate textures then adds to scene
const moonTexture = new THREE.TextureLoader().load("public/moon.jpg");
const moonNormalTexture = new THREE.TextureLoader().load("public/normal.jpg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: moonNormalTexture,
  })
);
scene.add(moon);

// Function used to create a star that is randomly placed. Called at the start of the script. 
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry,material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x,y,z);
  scene.add(star);
}

// Main Loop, used for animating and updating controls.
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();
  renderer.render(scene,camera);
}

// Centers the camera to the moon object. Animates the whole thing. 
function centerAnimation() {
  // Rotates camera towards moon.
  gsap.gsap.to(controls.target, {
    x: moon.position.x,
    y: moon.position.y,
    z: moon.position.z,
    duration: 2,
    ease: "power3.inOut",
  })
  // Moves camera towards moon, offset by 30.
  gsap.gsap.to(camera.position, {
    x: 0,
    y: 0,
    z: 30,
    duration: 5,
    ease: "power3.inOut",
  }, "-=2");
}

// Creates a listener then calles centerAnimation when key is pressed.
addEventListener("keydown", onkeydown);
function onkeydown(event){
  if(event.key === "e" || event.key === "E") {
    console.log("e")
    centerAnimation()
  }
}

// Calls the main loop
animate()