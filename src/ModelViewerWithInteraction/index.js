import * as THREE from 'three'
import { Interaction } from 'three.interaction'
import fbxModelLoader from './fbxModelLoader'
import initializeOrbitControls from './initializeOrbitControls'
//import ColorMenu from './ColorMenu'

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
    this.renderer = null;
    this.orbitControls = null;
    this.interactionManager = null;
    this.isAnimating = false;

    this.animate = this.animate.bind(this)
    this.handleMouseEnterCanvas = this.handleMouseEnterCanvas.bind(this)
    this.handleMouseLeaveCanvas = this.handleMouseLeaveCanvas.bind(this)

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
    this.camera = new THREE.PerspectiveCamera(70, this.canvasWidth / this.canvasHeight, 1, 500)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x787878)
    this.light = new THREE.HemisphereLight(0xffffff, 0x080820, 0.7)
    this.scene.add(this.light)
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.canvasWidth, this.canvasHeight)
    this.canvas.appendChild(this.renderer.domElement)
    this.orbitControls = initializeOrbitControls(this.camera, this.renderer)
    this.interactionManager = new Interaction(this.renderer, this.scene, this.camera)

    // Event Listeners
    this.canvas.addEventListener('mouseenter', this.handleMouseEnterCanvas) // TODO: Implement this
    this.canvas.addEventListener('mouseleave', this.handleMouseLeaveCanvas) // TODO: Implement this
  }

  render () {
    this.renderer.render(this.scene, this.camera)
    this.orbitControls.update()
    this.setLightToFollowCamera()
  }

  animate () {
    this.isAnimating = true
    this.animationID = requestAnimationFrame(this.animate)
    this.render()
  }

  setLightToFollowCamera() {
    this.light.position.copy(this.camera.position)
  }

  centerCameraToObject(model, offset) {
    offset = offset || 5;
    const boundingBox = new THREE.Box3()
    const object = model
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
    this.camera.far = cameraToFarEdge * 10;
    this.camera.updateProjectionMatrix();
    if ( this.orbitControls ) {
      // set camera to rotate around center of loaded object
      this.orbitControls.target = center;
      // prevent camera from zooming out far enough to create far plane cutoff
      this.orbitControls.maxDistance = cameraToFarEdge * 10;
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

  setDefaultObjectMaterial(object) {
    object.traverse(child => {
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

  setObjectInteraction (object) {
    object.cursor = 'pointer'
    object.on('click', event => {
      console.log(event)
    })
  }

  async loadFBX (modelPath) {
    const model = await fbxModelLoader(modelPath)
    this.setDefaultObjectMaterial(model)
    this.scene.add(model)
    this.setObjectInteraction(model)
    return model
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
