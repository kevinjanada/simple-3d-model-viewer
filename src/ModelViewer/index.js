import * as THREE from 'three'
import fbxModelLoader from './fbxModelLoader'
import initializeOrbitControls from './initializeOrbitControls'

class ModelViewer {
  /**
   * @constructor
   * @param {domElement?} - if provided will use it to render scene, else will render to whole window
   */
  constructor(domElement) {
    this.container = null;
    this.containerWidth = 0
    this.containerHeight = 0
    this.camera = null;
    this.scene = null;
    this.light = null;
    this.renderer = null;
    this.modelsDict = {}
    this.orbitControls = null;
    this.raycaster = null;
    this.mousePosition = {x: 0, y: 0};
    // The object currently raycasted
    this.intersectedObject = null;
    // To pause and start the animation
    this.animationHandle = null
    
    // Bind methods context to this
    this.animate = this.animate.bind(this)
    this.raycast = this.raycast.bind(this)
    this.markObject = this.markObject.bind(this)
    this.getContainerRelativePosition = this.getContainerRelativePosition.bind(this)
    this.setMousePosition = this.setMousePosition.bind(this)
    this.clearMousePosition = this.clearMousePosition.bind(this)

    // Setup
    if(domElement) {
      // render to domElement
      this.container = domElement
      this.containerWidth = domElement.offsetWidth - 16;
      this.containerHeight = domElement.offsetHeight;
    } else {
      // render to body
      this.container = document.createElement('div')
      document.body.appendChild(this.container)
      this.containerWidth = window.innerWidth - 20
      this.containerHeight = window.innerHeight - 20
    }
    this.camera = new THREE.PerspectiveCamera(70, this.containerWidth / this.containerHeight, 1, 2000)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0)
    this.light = new THREE.DirectionalLight(0xffffff, 1)
    this.scene.add(this.light)
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.containerWidth, this.containerHeight)
    this.container.appendChild(this.renderer.domElement)
    this.orbitControls = initializeOrbitControls(this.camera, this.renderer)
    this.raycaster = new THREE.Raycaster()

    // Event Listeners
    document.addEventListener('click', this.markObject)
    document.addEventListener('mousemove', this.setMousePosition)
    document.addEventListener('mouseout', this.clearMousePosition)
    document.addEventListener('mouseleave', this.clearMousePosition)
    this.container.addEventListener('mouseenter', this.onMouseEnterCanvas) // TODO: Implement this
    this.container.addEventListener('mouseleave', this.onMouseLeaveCanvas) // TODO: Implement this
  }

  render () {
    this.raycast()
    this.renderer.render(this.scene, this.camera)
  }

  animate () {
    this.animationHandle = requestAnimationFrame(this.animate)
    this.render()
    this.orbitControls.update()
  }

  /**
   * Get the x and y of canvas element
   * @param {DOMEvent object} event 
   */
  getContainerRelativePosition(event) {
    const rect = this.container.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }

  /**
   * Set the mouse position relative to the canvas / container of renderer
   * @param {DOMEvent object} event 
   * this.mousePosition.x == -1 <= x <= 1 
   * this.mousePosition.y == -1 <= y <= 1
   */
  setMousePosition(event) {
    const pos = this.getContainerRelativePosition(event);
    this.mousePosition.x = (pos.x / this.container.clientWidth ) *  2 - 1;
    this.mousePosition.y = (pos.y / this.container.clientHeight) * -2 + 1;  // note we flip Y
  }

  /**
   * unlike the mouse which always has a position
   * if the user stops touching the screen we want
   * to stop raycasting. For now we just pick a value
   * unlikely to pick something
   */
  clearMousePosition() {
    this.mousePosition.x = -100000;
    this.mousePosition.y = -100000;
  }

  /**
   * Cast ray from mouse position to detect closest object at mouse position
   */
  raycast() {
     // cast a ray through the frustum
    this.raycaster.setFromCamera(this.mousePosition, this.camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(this.scene.children, true);
    if (intersectedObjects.length > 0) {
      // pick the first object. It's the closest one
      this.intersectedObject = intersectedObjects[0].object;
      // save its color
      // this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
      // set its emissive color to flashing red/yellow
      // this.pickedObject.material.emissive.setHex(0xFF0000);
    } else {
      this.intersectedObject = null;
    }
  }

  markObject() {
    if (this.intersectedObject) {
      this.intersectedObject.material.emissive.setHex(0xFF0000);
    }
  }

  centerCameraToObject(modelKey, offset) {
    offset = offset || 5;
    const boundingBox = new THREE.Box3()
    const object = this.modelsDict[modelKey]
    boundingBox.setFromObject(object)
    const center = boundingBox.getCenter()
    const size = boundingBox.getSize()
    
    // get the max side of the bounding box (fits to width OR height as needed )
    const maxDim = Math.max( size.x, size.y, size.z );
    const fov = this.camera.fov * ( Math.PI / 180 );
    let cameraZ = Math.abs( maxDim / 4 * Math.tan( fov * 2 ) );
    cameraZ *= offset; // zoom out a little so that objects don't fill the screen
    this.camera.position.z = center.z + cameraZ
    const minZ = boundingBox.min.z;
    const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;
    this.camera.far = cameraToFarEdge * 5;
    this.camera.updateProjectionMatrix();
    if ( this.orbitControls ) {
      // set camera to rotate around center of loaded object
      this.orbitControls.target = center;
      // prevent camera from zooming out far enough to create far plane cutoff
      this.orbitControls.maxDistance = cameraToFarEdge * 2;
      this.orbitControls.saveState();
    } else {
      this.camera.lookAt( center )
    }
  }
  
  /** 
   * @function setDefaultRotation -- Rotate 90 degrees on x axis. Perlu kalau export fbx langsung dari navisworks
   * @param {modelKey} string -- The key that was passed in to loadFBX method when loading the model 
  */
  setDefaultRotation(modelKey) {
    var quaternion = new THREE.Quaternion()
    // Rotate on x axis, -90 degrees or -(pi/2) radian
    quaternion.setFromAxisAngle(new THREE.Vector3(1,0,0), (Math.PI / 2) * -1)
    this.modelsDict[modelKey].applyQuaternion(quaternion)
  }

  async loadFBX (modelPath, modelKey) {
    const model = await fbxModelLoader(modelPath)
    this.modelsDict[modelKey] = model
    // this.setDefaultRotation(modelKey)
    this.centerCameraToObject(modelKey)
    this.scene.add(model)
  }
}

export default ModelViewer
