import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import fbxModelLoader from './ModelViewer/fbxModelLoader'
import testFBXModel from './models/test.fbx'

/* This model is too big. out of memory error
 **/
//import eqp1Model from './models/EQP-1.fbx'


let container
let camera, scene, light, raycaster, renderer, controls
let axesHelper
let mouse
let INTERSECTED

function init() {
  // Create the container
  container = document.createElement('div')
  document.body.appendChild(container)
  // create the camera
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000)
  // create the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0)
  // create the light
  light = new THREE.DirectionalLight(0xffffff, 1)
  // add light to scene
  scene.add(light)
  // create the renderer
  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  // add renderer to container
  container.appendChild(renderer.domElement)
  // create camera controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true;   //damping 
  controls.dampingFactor = 0.25;   //damping inertia
  controls.enableZoom = true;      //Zooming
  controls.maxPolarAngle = Math.PI / 2; // Limit angle of visibility
  controls.keys = {
    LEFT: 37, //left arrow
    UP: 38, // up arrow
    RIGHT: 39, // right arrow
    BOTTOM: 40 // down arrow
  };
  // create raycaster
  raycaster = new THREE.Raycaster()
  // create mouse to keep track of mouse pointer
  mouse = new THREE.Vector2()
  document.addEventListener('mousemove', onMouseMove, false)
  // Visualize Axes
  axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper)
}

// Handle document mousemove event
function onMouseMove(event) {
  event.preventDefault()
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = (event.clientY / window.innerHeight) * 2 - 1
}

function centerCameraToObject(object) {
  const bb = new THREE.Box3()
  bb.setFromObject(object)
  bb.center(controls.target)
}

function setDefaultRotation(model) {
  var quaternion = new THREE.Quaternion()
  // Rotate on x axis, -90 degrees or -(pi/2) radian
  quaternion.setFromAxisAngle(new THREE.Vector3(1,0,0), (Math.PI / 2) * -1)
  model.applyQuaternion(quaternion)
  return model
}

function render() {
  renderer.render(scene, camera)
}

function animate() {
  requestAnimationFrame(animate)
  render()
  controls.update();
}


const main = async () => {
  init()
  const model = await fbxModelLoader(testFBXModel)
  console.log(model)
  scene.add(setDefaultRotation(model))
  centerCameraToObject(model)
  //centerCameraToObject(axesHelper)
  animate()
}

main()
