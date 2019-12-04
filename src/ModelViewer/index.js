import * as THREE from 'three'
import fbxModelLoader from './fbxModelLoader'
import initializeOrbitControls from './initializeOrbitControls'
import ColorMenu from './ColorMenu'

function hexStringToInt(hexString) {
  return parseInt(hexString.replace(/^#/, ''), 16)
}

class ModelViewer {
  /**
   * @constructor
   * @param {domElement?} - if provided will use it to render scene, else will render to whole window
   */
  constructor(domElement) {
    this.canvas = null;
    this.canvasWidth = 0
    this.canvasHeight = 0
    this.camera = null;
    this.scene = null;
    this.light = null;
    this.pointLight = null;
    this.renderer = null;
    this.modelsDict = {}
    this.orbitControls = null;
    this.raycaster = null;
    this.mouseCanvasPosition = {x: 0, y: 0};
    this.mouseWindowPosition = {x: 0, y: 0};
    this.mouseDownTimer = null;
    // The object currently raycasted
    this.intersectedObject = null;
    // The object that was last raycasted when click event fired
    this.clickedObject = null;
    // To pause and start the animation
    this.animationHandle = null
    // Flag to check if modelviewer is currently animating
    this.isAnimating = false
    // Window Menu to show when mouse clicked at object
    this.colorMenu = null
    
    // Bind methods context to this
    this.animate = this.animate.bind(this)
    this.raycast = this.raycast.bind(this)
    this.markObject = this.markObject.bind(this)
    this.getCanvasRelativePosition = this.getCanvasRelativePosition.bind(this)
    this.setMouseCanvasPosition = this.setMouseCanvasPosition.bind(this)
    this.clearMouseCanvasPosition = this.clearMouseCanvasPosition.bind(this)
    this.setMouseWindowPosition = this.setMouseWindowPosition.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleShowMenu = this.handleShowMenu.bind(this)
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this)
    this.handleMouseEnterCanvas = this.handleMouseEnterCanvas.bind(this)
    this.handleMouseLeaveCanvas = this.handleMouseLeaveCanvas.bind(this)

    // Setup
    if(domElement) {
      // render to domElement
      this.canvas = domElement
      this.canvasWidth = domElement.offsetWidth - 16;
      this.canvasHeight = domElement.offsetHeight;
    } else {
      // render to body
      this.canvas = document.createElement('div')
      document.body.appendChild(this.canvas)
      this.canvasWidth = window.innerWidth - 20
      this.canvasHeight = window.innerHeight - 20
    }
    this.camera = new THREE.PerspectiveCamera(70, this.canvasWidth / this.canvasHeight, 1, 2000)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x787878)
    //this.light = new THREE.DirectionalLight(0xffffff, 0.5)
    //this.scene.add(this.light)
    this.pointLight = new THREE.PointLight(0xFFFFFF)
    this.pointLight.position.set(1,1,-2)
    this.scene.add(this.pointLight)
    // this.camera.add(this.pointLight)
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.canvasWidth, this.canvasHeight)
    this.canvas.appendChild(this.renderer.domElement)
    this.orbitControls = initializeOrbitControls(this.camera, this.renderer)
    this.orbitControls.addEventListener('change', () => {
      this.pointLight.position.copy(this.camera.position)
    })
    this.raycaster = new THREE.Raycaster()
    this.colorMenu = new ColorMenu(this.canvas, null, this.handleMenuItemClick)

    // Event Listeners
    document.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('mousemove', this.setMouseCanvasPosition)
    document.addEventListener('mousemove', this.setMouseWindowPosition)
    document.addEventListener('mouseout', this.clearMouseCanvasPosition)
    document.addEventListener('mouseleave', this.clearMouseCanvasPosition)
    this.canvas.addEventListener('mouseenter', this.handleMouseEnterCanvas) // TODO: Implement this
    this.canvas.addEventListener('mouseleave', this.handleMouseLeaveCanvas) // TODO: Implement this
  }

  render () {
    this.raycast()
    this.renderer.render(this.scene, this.camera)
  }

  animate () {
    this.animationHandle = requestAnimationFrame(this.animate)
    this.render()
    this.modelsDict['tanks'].x += 100
    this.orbitControls.update()
  }

  /**
   * Set the mouse position relative to the window position
   * @param {DOMEvent object} event 
   */
  setMouseWindowPosition(event) {
    event.preventDefault()
    this.mouseWindowPosition.x = event.clientX;
    this.mouseWindowPosition.y = event.clientY;
  }

  /**
   * Get the x and y of canvas element
   * @param {DOMEvent object} event 
   */
  getCanvasRelativePosition(event) {
    const rect = this.canvas.getBoundingClientRect()
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
  setMouseCanvasPosition(event) {
    const pos = this.getCanvasRelativePosition(event);
    this.mouseCanvasPosition.x = (pos.x / this.canvas.clientWidth ) *  2 - 1;
    this.mouseCanvasPosition.y = (pos.y / this.canvas.clientHeight) * -2 + 1;  // note we flip Y
  }

  /**
   * unlike the mouse which always has a position
   * if the user stops touching the screen we want
   * to stop raycasting. For now we just pick a value
   * unlikely to pick something
   */
  clearMouseCanvasPosition() {
    this.mouseCanvasPosition.x = -100000;
    this.mouseCanvasPosition.y = -100000;
  }

  /**
   * Cast ray from mouse position to detect closest object at mouse position
   */
  raycast() {
     // cast a ray through the frustum
    this.raycaster.setFromCamera(this.mouseCanvasPosition, this.camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(this.scene.children, true);
    if (intersectedObjects.length > 0) {
      // pick the first object. It's the closest one
      this.intersectedObject = intersectedObjects[0].object;
      // TODO: Add Outline Highlight to intersectedObject
    } else {
      // TODO: Remove Outline Highlight to intersectedObject
      this.intersectedObject = null;
    }
  }

  setClickedObject() {
    if(this.intersectedObject && !this.colorMenu.isMouseOnMenu(this.mouseWindowPosition)) {
      this.clickedObject = this.intersectedObject
    } else {
      if (!this.colorMenu.isMouseOnMenu(this.mouseWindowPosition)) {
        this.clickedObject = null
      }
    }
  }

  handleShowMenu() {
    if (this.intersectedObject) {
      this.colorMenu.show(this.mouseWindowPosition)
    } else {
      // FIXME: Maybe this if logic should be in ColorMenu class instead
      if (!this.colorMenu.isMouseOnMenu(this.mouseWindowPosition)) {
        this.colorMenu.hide()
      }
    }
  }

  handleMenuItemClick(val) {
    const hex = hexStringToInt(val.hex)
    this.markObject(hex)
  }

  markObject(color) {
    if (this.clickedObject) {
      this.clickedObject.material.emissive.setHex(color);
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

  setDefaultObjectMaterial(modelKey) {
    this.modelsDict[modelKey].traverse(child => {
      if (child.isMesh) {
        // switch the material here - you'll need to take the settings from the 
        //original material, or create your own new settings, something like:
        const oldMat = child.material;
        child.material = new THREE.MeshLambertMaterial({  
          color: 0xFFFFFF,
          map: oldMat.map,
          //etc
        });
      }
    })
  }

  async loadFBX (modelPath, modelKey) {
    const model = await fbxModelLoader(modelPath)
    this.modelsDict[modelKey] = model
    this.setDefaultObjectMaterial(modelKey)
    // this.setDefaultRotation(modelKey)
    this.centerCameraToObject(modelKey)
    this.scene.add(model)
  }

  handleMouseDown(event) {
    // Set timer start at mouse down
    this.mouseDownTimer = new Date()
  }

  handleMouseUp(event) {
    const timeElapsed = new Date() - this.mouseDownTimer
    if (timeElapsed < 200) { 
      // Mouse is clicked 
      this.handleClick(event)
    } else {
      // Mouse is held down
      this.colorMenu.hide()
    }
  }

  /**
   * Put methods that need to run on click event here
   * @param {DOMEvent object} event 
   */
  handleClick(event) {
    event.preventDefault()
    this.setClickedObject()
    this.handleShowMenu()
  }

  handleMouseEnterCanvas() {
    if (this.isAnimating === false) {
      requestAnimationFrame(this.animate)
      this.isAnimating = true
    }
  }

  handleMouseLeaveCanvas() { // FIXME: cancelAnimationFrame not working, maybe not getting the right ID in this.animationHandle
    this.isAnimating = false
    cancelAnimationFrame(this.animationHandle)
  }
}

export default ModelViewer
