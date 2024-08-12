import './style.css'

import * as THREE from 'three';

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),

})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);


const geometry = new THREE.TorusGeometry(10,0.1,16,100);
const material = new THREE.MeshStandardMaterial({color: 0x000000});
const torus = new THREE.Mesh(geometry,material);

scene.add(torus);

const worldLight = new THREE.AmbientLight(0xffffff);
const pointLight = new THREE.PointLight(0xffffff, 10000, 100);
pointLight.position.set(20,20,20);

scene.add(pointLight)
scene.add(worldLight)


const controls = new OrbitControls(camera, renderer.domElement);


function addStar() {
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry,material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x,y,z);
  scene.add(star);
}

Array(500).fill().forEach(addStar)



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


function animate() {
  requestAnimationFrame(animate);
  

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene,camera);
}

animate()