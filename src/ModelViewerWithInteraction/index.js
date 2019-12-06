import * as THREE from 'three'
import { Interaction } from 'three.interaction'
import fbxModelLoader from './fbxModelLoader'
import initializeOrbitControls from './initializeOrbitControls'
import MousePositionManager from './MousePositionManager'

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
    this.mousePositionManager = null;
    this.isAnimating = false;
    this.raycaster = null;
    // The point of intersection of the raycast
    this.intersected = null;
    // To pause and start the animation
    this.animationID = null
    // Flag to check if modelviewer is currently animating
    this.isAnimating = false

    this.animate = this.animate.bind(this)
    this.drawLineAtPoint = this.drawLineAtPoint.bind(this)
    this.raycast = this.raycast.bind(this)

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
    this.raycaster = new THREE.Raycaster()
    this.interactionManager = new Interaction(this.renderer, this.scene, this.camera)
    this.mousePositionManager = new MousePositionManager(this.canvas)

    /**
     * Setup untuk method drawLineOnPoint()
     * Untuk cari point titik di model
     */
    this.mousePositionManager.on('mousemove', this.raycast)
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
    offset = offset || 0;
    const boundingBox = new THREE.Box3()
    const object = model
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
  setDefaultRotation(model) {
    var quaternion = new THREE.Quaternion()
    // Rotate on x axis, -90 degrees or -(pi/2) radian
    quaternion.setFromAxisAngle(new THREE.Vector3(1,0,0), (Math.PI / 2) * -1)
    model.applyQuaternion(quaternion)
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
      console.log('clicked object')
      const { data, intersects } = event
      // This is the clicked object
      const { target } = data
      // This is the point where the cursor is at the object face
      const intersectPoint = this.getPointCoordinate(intersects[0])
      console.log(`This is the object:`, target)
      console.log(`This is the cursor coordinate: `, intersectPoint)
      // TODO: Save intersect Point to database
    })
  }

  async loadFBX (modelPath) {
    const model = await fbxModelLoader(modelPath)
    this.setDefaultRotation(model)
    this.setDefaultObjectMaterial(model)
    this.scene.add(model)
    this.setObjectInteraction(model)
    return model
  }

  /**
   * Cast ray from mouse position to detect closest object at mouse position
   */
  raycast() {
    const { mouseCanvasPosition } = this.mousePositionManager.getPosition()
    // cast a ray through the frustum
    this.raycaster.setFromCamera(mouseCanvasPosition, this.camera);
   // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(this.scene.children, true);
    if (intersectedObjects.length > 0) {
      // pick the first object. It's the closest one
      this.intersected = intersectedObjects[0]
      this.drawLineAtPoint(this.intersected)
    } else {
      this.intersectedObject = null;
    }
  }

  /**
   * Draw a line from face of object, to indicate cursor raycasted point on object
   * @param {object} intersect - The intersect from raycast()
   */
  drawLineAtPoint (intersect) {
    const point = intersect.point
    this.mouseHelper.position.copy( point );
    this.intersection.point.copy( point );
    var n = intersect.face.normal.clone();
    n.transformDirection( intersect.object.matrixWorld );
    n.multiplyScalar(2);
    n.add(point);
    this.intersection.normal.copy( intersect.face.normal );
    this.mouseHelper.lookAt( n );
    var positions = this.line.geometry.attributes.position;
    positions.setXYZ( 0, point.x, point.y, point.z );
    positions.setXYZ( 1, n.x, n.y, n.z );
    positions.needsUpdate = true;
    this.intersection.intersects = true;
  }

  getPointCoordinate (intersect) {
    return intersect.point
  }
}

export default ModelViewer
