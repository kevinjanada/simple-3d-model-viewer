import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const initializeOrbitControls = (camera, renderer) => {
  const controls = new OrbitControls(camera, renderer.domElement)
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
  return controls
}

export default initializeOrbitControls