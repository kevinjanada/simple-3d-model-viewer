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
    this.raycaster = null;
    this.renderer = null;
    this.orbitControls = null;
    this.mouse = null
    this.modelsDict = {}
    this.animate = this.animate.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.animationHandle = null

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

    this.camera = new THREE.PerspectiveCamera(70, this.containerWidth / this.containerHeight, 1, 500)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0)
    this.light = new THREE.DirectionalLight(0xffffff, 1)
    this.scene.add(this.light)
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.containerWidth, this.containerHeight)
    this.container.appendChild(this.renderer.domElement)
    this.orbitControls = initializeOrbitControls(this.camera, this.renderer)
    this.mouse = new THREE.Vector2()
    document.addEventListener('mousemove', this.trackMousePosition, false)
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }

  animate () {
    this.animationHandle = requestAnimationFrame(this.animate)
    this.render()
    this.orbitControls.update()
  }

  trackMousePosition(event) {
    event.preventDefault()
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = (event.clientY / window.innerHeight) * 2 - 1
  }

  centerCameraToObject(modelKey, offset) {
    offset = offset || -50;
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
    this.camera.far = cameraToFarEdge * 3;
    this.camera.updateProjectionMatrix();
    if ( this.orbitControls ) {
      // set camera to rotate around center of loaded object
      this.orbitControls.target = center;
      // prevent camera from zooming out far enough to create far plane cutoff
      this.orbitControls.maxDistance = cameraToFarEdge;
      this.orbitControls.saveState();
    } else {
      this.camera.lookAt( center )
    }
  }
  
  setDefaultRotation(modelKey) {
    var quaternion = new THREE.Quaternion()
    // Rotate on x axis, -90 degrees or -(pi/2) radian
    quaternion.setFromAxisAngle(new THREE.Vector3(1,0,0), (Math.PI / 2) * -1)
    this.modelsDict[modelKey].applyQuaternion(quaternion)
  }

  async loadFBX (modelPath, modelKey) {
    const model = await fbxModelLoader(modelPath)
    this.modelsDict[modelKey] = model
    this.setDefaultRotation(modelKey)
    this.centerCameraToObject(modelKey)
    this.scene.add(model)
  }
}

export default ModelViewer
