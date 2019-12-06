import * as THREE from 'three'
import fbxModelLoader from './fbxModelLoader'
import initializeOrbitControls from './initializeOrbitControls'

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
    // The point of intersection of the raycast
    this.intersected = null;
    // The object currently raycasted
    this.intersectedObject = null;
    // The object that was last raycasted when click event fired
    this.clickedObject = null;
    // To pause and start the animation
    this.animationID = null
    // Flag to check if modelviewer is currently animating
    this.isAnimating = false

    
    // Bind methods context to this
    this.animate = this.animate.bind(this)
    this.raycast = this.raycast.bind(this)
    this.setDefaultObjectMaterial = this.setDefaultObjectMaterial.bind(this)
    this.getCanvasRelativePosition = this.getCanvasRelativePosition.bind(this)
    this.setMouseCanvasPosition = this.setMouseCanvasPosition.bind(this)
    this.clearMouseCanvasPosition = this.clearMouseCanvasPosition.bind(this)
    this.setMouseWindowPosition = this.setMouseWindowPosition.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnterCanvas = this.handleMouseEnterCanvas.bind(this)
    this.handleMouseLeaveCanvas = this.handleMouseLeaveCanvas.bind(this)
    this.drawLineAtPoint = this.drawLineAtPoint.bind(this)
    this.getPointCoordinateOnObject = this.getPointCoordinateOnObject.bind(this)

    /* ==========================
     * Setup
     * =========================*/
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
    this.camera = new THREE.PerspectiveCamera(120, this.canvasWidth / this.canvasHeight, 0.1, 1000)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x787878)
    this.light = new THREE.HemisphereLight(0xffffff, 0x080820, 0.7)
    this.scene.add(this.light)
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.canvasWidth, this.canvasHeight)
    this.canvas.appendChild(this.renderer.domElement)
    this.orbitControls = initializeOrbitControls(this.camera, this.renderer)
    this.raycaster = new THREE.Raycaster()


    /**
     * Setup untuk method drawLineOnPoint()
     * Untuk cari point titik di model
     */
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );
    this.mouseHelper = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 10), new THREE.MeshNormalMaterial());
    this.mouseHelper.visible = false;
    this.scene.add( this.mouseHelper );
    this.line = new THREE.Line( this.geometry, new THREE.LineBasicMaterial() );
    this.line.frustumCulled = false; // This need to be set to true, otherwise, line wont appear on certain angles
    this.scene.add(this.line)
    this.position = new THREE.Vector3();
    this.intersection = {
      intersects: false,
      point: new THREE.Vector3(),
      normal: new THREE.Vector3()
    };
    // ------------------------------------------------
    

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
    this.orbitControls.update()
    this.setLightToFollowCamera()
    this.renderer.render(this.scene, this.camera)
  }

  animate () {
    this.isAnimating = true
    this.animationID = requestAnimationFrame(this.animate)
    this.render()
  }

  setLightToFollowCamera() {
    this.light.position.copy(this.camera.position)
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
    this.mouseCanvasPosition.x = (pos.x / this.canvas.clientWidth ) *  2 - 1 + 0.012;
    this.mouseCanvasPosition.y = (pos.y / this.canvas.clientHeight) * -2 + 1;  // note we flip Y
    this.raycast()
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
      this.intersected = intersectedObjects[0]
      this.drawLineAtPoint(this.intersected)
    } else {
      this.intersectedObject = null;
    }
  }

  drawLineAtPoint (intersect) {
    const point = intersect.point
    this.mouseHelper.position.copy( point );
    this.intersection.point.copy( point );
    var n = intersect.face.normal.clone();
    n.transformDirection( this.intersectedObject.matrixWorld );
    n.multiplyScalar(2);
    n.add(point);
    this.intersection.normal.copy( intersect.face.normal );
    this.mouseHelper.lookAt( n );
    var positions = this.line.geometry.attributes.position;
    positions.setXYZ( 0, point.x, point.y, point.z );
    positions.setXYZ( 1, n.x, n.y, n.z );
    positions.needsUpdate = true;
    this.intersection.intersects = true;
    // TODO: Save point to database
  }

  /**
   * If Mouse raycast is currently intersecting object,
   * return the point coordinate of intersection
   */
  getPointCoordinateOnObject() {
    if (this.intersectedObject) {
      console.log(this.intersected.point)
      return this.intersected.point
    }
  }

  centerCameraToObject(modelKey, offset) {
    offset = offset || 0;
    const boundingBox = new THREE.Box3()
    const object = this.modelsDict[modelKey]
    boundingBox.setFromObject(object)
    const center = boundingBox.getCenter()
    const size = boundingBox.getSize()
    this.camera.position.z = center.z
    this.camera.position.x = center.x + size.x + offset
    this.camera.position.y = center.y + size.y + offset
    this.camera.far = this.camera.far + 100
    this.camera.updateProjectionMatrix();
    if (this.orbitControls) {
      // set camera to rotate around center of loaded object
      this.orbitControls.target = center;
      this.orbitControls.saveState();
    } else {
      this.camera.lookAt(center)
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
    console.log(model)
    this.modelsDict[modelKey] = model
    this.setDefaultObjectMaterial(modelKey)
    this.setDefaultRotation(modelKey)
    this.scene.add(model)
  }

  handleMouseDown(event) {
    event.preventDefault()
    // Set timer start at mouse down
    this.mouseDownTimer = new Date()
  }

  handleMouseUp(event) {
    event.preventDefault()
    const timeElapsed = new Date() - this.mouseDownTimer
    if (timeElapsed < 200) { 
      // Mouse is clicked 
      this.handleClick(event)
    } else {
      // Mouse is held down
    }
  }

  /**
   * Put methods that need to run on click event here
   * @param {DOMEvent object} event 
   */
  handleClick(event) {
    event.preventDefault()
    this.getPointCoordinateOnObject()
  }

  handleMouseEnterCanvas() {
    if (this.isAnimating === false) {
      this.animationID = requestAnimationFrame(this.animate)
      this.isAnimating = true
    }
  }

  handleMouseLeaveCanvas() { // FIXME: cancelAnimationFrame not working, maybe not getting the right ID in this.animationID
    this.isAnimating = false
    cancelAnimationFrame(this.animationID)
  }
}

export default ModelViewer
