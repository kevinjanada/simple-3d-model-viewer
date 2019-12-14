import * as THREE from 'three'
import fbxModelLoader from './fbxModelLoader'
import initializeOrbitControls from './initializeOrbitControls'
import MouseInteractionManager from './MouseInteractionManager'

class ModelViewer {
  /**
   * @constructor
   * @param {domElement?} - if provided will use it to render scene, else will render to whole window
   */
  constructor(domElement, config) {
    this.editMode = config && config.editMode || false
    this.canvas = null;
    this.canvasWidth = 0
    this.canvasHeight = 0
    this.camera = null;
    this.scene = null;
    this.light = null;
    this.renderer = null;
    this.orbitControls = null;
    // this.interactionManager = null;
    this.mouseInteractionManager = null;
    this.isAnimating = false;
    this.raycaster = null;
    // The point of intersection of the raycast
    // this.intersected = null;
    // Point of intersections of raycast
    this.intersects = null
    // To pause and start the animation
    this.animationID = null
    // Flag to check if modelviewer is currently animating
    this.isAnimating = false
    // Sphere Currently Being Edited
    this.tempSphere = null
    // Dictionary of saved Spheres made during editing
    this.savedSpheres = {}
    // Attached Object to mouse (for dragging)
    this.objectAttachedToMouse = null

    this.animate = this.animate.bind(this)
    this.cleanUp = this.cleanUp.bind(this)
    this.drawLineAtPoint = this.drawLineAtPoint.bind(this)
    this.raycast = this.raycast.bind(this)
    this.clickObject = this.clickObject.bind(this)
    this.centerCameraToObject = this.centerCameraToObject.bind(this)
    this.setDefaultObjectMaterial = this.setDefaultObjectMaterial.bind(this)
    this.centerCameraToObject = this.centerCameraToObject.bind(this)
    this.setObjectInteraction = this.setObjectInteraction.bind(this)
    this.getPointCoordinate = this.getPointCoordinate.bind(this)
    this.drawSphereAtPoint = this.drawSphereAtPoint.bind(this)
    this.removeSphereAtPoint = this.removeSphereAtPoint.bind(this)
    this.removeTempSphere = this.removeTempSphere.bind(this)
    this.saveSphere = this.saveSphere.bind(this)
    this.dragSphere = this.dragSphere.bind(this)
    this.dragFinished = this.dragFinished.bind(this)
    this.setObjectColor = this.setObjectColor.bind(this)
    /** 
     * FIXME: Method sementara untuk demo
     * */ 
    this.drawPointsForDemo = this.drawPointsForDemo.bind(this)
    /** */
    this.checkForPoint = this.checkForPoint.bind(this)

    // Setup Callback Handlers -- Register callback function from outside
    this.onClickHandler = () => null
    this.onClickHandler = this.onClickHandler.bind(this)
    this.hoverOnPointHandler = () => null
    this.hoverOnPointHandler = this.hoverOnPointHandler.bind(this)
    this.onDragHandler = () => null
    this.onDragHandler = this.onDragHandler.bind(this)

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
    this.camera = new THREE.PerspectiveCamera(70, this.canvasWidth / this.canvasHeight, 0.1, 2000)
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
    this.mouseInteractionManager = new MouseInteractionManager(this.canvas)
    this.mouseInteractionManager.on('click', this.clickObject)
    this.mouseInteractionManager.on('drag', this.dragSphere)
    this.mouseInteractionManager.on('drag-finished', this.dragFinished)

    /**
     * Setup untuk method drawLineOnPoint()
     * Untuk cari point titik di model
     */
    this.mouseInteractionManager.on('mousemove', this.raycast)
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

  cleanUp() {
    cancelAnimationFrame(this.animationID)
    // dispose geometries and materials in scene
    // Do not console log geometry or material, it will not be disposed if you do
    this.scene.traverse(o => {
      if (o.geometry) {
          o.geometry.dispose()
      }
      if (o.material) {
        if (o.material.length) {
          for (let i = 0; i < o.material.length; ++i) {
            o.material[i].dispose()
          }
        }
        else {
          o.material.dispose()
        }
      }
    })

    this.scene = null
    this.camera = null
    this.renderer && this.renderer.renderLists.dispose()
    this.renderer = null
  }

  // TODO: Light masi belum bekerja dgn benar
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

  setObjectColor(object, color) {
    object.traverse(child => {
      if (child.isMesh) {
        const oldMat = child.material;
        child.material = new THREE.MeshLambertMaterial({  
          color: color,
          map: oldMat.map,
        });
      }
    })
  }

  // FIXME: Interaksi pake library three.interaction blom bisa jalan di VUE
  setObjectInteraction (object) {
    object.cursor = 'pointer'
    object.on('click', event => {
      const { data, intersects } = event
      // This is the clicked object
      const { target } = data
      // This is the point where the cursor is at the object face
      const intersectPoint = this.getPointCoordinate(intersects[0])
      // TODO: Save intersect Point to database
    })
  }

  // FIXME: Di VUE blom tau caranya untuk Load pake ini, Harus return Promise
  async loadFBX (modelPath) {
    const model = await fbxModelLoader(modelPath)
    this.setDefaultRotation(model)
    this.setDefaultObjectMaterial(model)
    this.scene.add(model)
    return model
    // this.setObjectInteraction(model)
    // return model
  }

  /**
   * Load Model, return promise. Harus pake ini di vue kalo panggil di mounted
   * @param {string} modelPath 
   */
  loadFBXAsync (modelPath) {
    return new Promise(async resolve => {
      const model = await fbxModelLoader(modelPath)
      this.setDefaultObjectMaterial(model)
      this.setDefaultRotation(model)
      this.centerCameraToObject(model)
      // FIXME: Sementara untuk keperluan demo
      // if (!this.editMode) {
        // this.drawPointsForDemo()
      // }
      // console.log(model)
      var temp = null
      for(const m of model.children){
        if(m.children.length>0 && m.type =='Group' ){
          temp = m
          console.log(m)
          
        }
      }
      this.scene.add(model)
      
      // FIXME: setObjectInteraction pake library three.interaction ga bisa jalan di vue
      // this.setObjectInteraction(model)
      resolve(model)
    })
  }

  /**
   * FIXME: Method sementara untuk keperluan demo
   * @param {object} object -- the 3d model
   * @param {numOfPoints} -- number of points to generate
   */
  drawPointsForDemo() {
    const hardCodedPoints = [
      {x: 228.7259877897261, y: 10.762937614481856, z: -687.7108254211855},
      {x: 226.08609945057285, y: 5.159249171867932, z: -684.5062248457348},
      {x:231.91229764762193, y:5.213839642100014, z:-684.7721739114014},
      {x:232.6792618787187, y:5.182987704558555, z:-689.7544837256687},
      {x:227.99408817643825, y:5.2607342080942034, z:-692.0127420566406}
    ]
    hardCodedPoints.forEach(p => {
      this.drawSphereAtPoint(p)
    })
  }

  /**
   * Cast ray from mouse position to detect closest object at mouse position
   */
  raycast() {
    const { mouseCanvasPosition } = this.mouseInteractionManager.getPosition()
    // cast a ray through the frustum
    this.raycaster.setFromCamera(mouseCanvasPosition, this.camera);
   // get the list of objects the ray intersected
    this.intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if (this.intersects.length > 0) {
      // pick the first object. It's the closest one
      this.drawLineAtPoint(this.intersects[0])
      this.checkForPoint(this.intersects[0])
    }
  }

  getParent(obj){
    // console.log(obj.name)
    var res = [obj.name]
    if(obj.parent){
      var a = this.getParent(obj.parent)
      for(var e of a){
        res.push(e)
      }
    }
    return res;
  }

  dragSphere() {
    if (this.intersectedPoint && this.objectAttachedToMouse === null) {
      this.objectAttachedToMouse = this.intersectedPoint
    }

    if (this.objectAttachedToMouse) {
      console.log('dragging a sphere')
      if (this.intersects[1]) {
        const { x, y, z } = this.intersects[1].point
        this.orbitControls.enabled = false
        // Object that the sphere is attached to
        this.objectAttachedToMouse.object.position.setX(x)
        this.objectAttachedToMouse.object.position.setY(y)
        this.objectAttachedToMouse.object.position.setZ(z)
        this.objectAttachedToMouse.object.updateMatrix()
        this.objectAttachedToMouse.object.geometry.computeBoundingSphere()
        this.camera.updateProjectionMatrix()
        this.orbitControls.update()
      }
    }
  }

  dragFinished() {
    this.orbitControls.enabled = true
    this.objectAttachedToMouse = null
    console.log(this.objectAttachedToMouse)
  }

  checkForPoint(intersect) {
    if (intersect && intersect.object.geometry instanceof THREE.SphereGeometry) {
      console.log('Found a point!')
      const { mouseWindowPosition } = this.mouseInteractionManager.getPosition()
      const data = { intersect, mouseWindowPosition }
      this.hoverOnPointHandler(data)
      this.intersectedPoint = intersect
    } else {
      this.hoverOnPointHandler(false)
      this.intersectedPoint = null
    }
  }

  /**
   * What to do when object is clicked
   */
  clickObject() {
    if (this.intersects.length > 0) {
      const pointCoordinate = this.getPointCoordinate(this.intersects[0])
      console.log(pointCoordinate)
      if (this.editMode) {
        if (!this.intersectedPoint) {
          this.drawSphereAtPoint(pointCoordinate)
        }
      }

      // onClickHandler dikasih informasi posisi mouse, dan objek
      const parameters = {
        intersected: this.intersects[0],
        pointCoordinate,
        mouseCanvasPosition: this.mouseInteractionManager.getPosition().mouseCanvasPosition,
        mouseWindowPosition: this.mouseInteractionManager.getPosition().mouseWindowPosition,
        hierarchy: this.getParent(this.intersects[0].object)
      }
      this.onClickHandler(parameters)
    } else {
      this.onClickHandler(false)
      this.removeTempSphere()
    }
  }

  // FIXME: Gambar titik di objek, masi ada bug, titik nya kerender cuma kalo distance camera ke objek sekitar 2 - 3. 
  // kalo jauh, titik nya ga ke render
  drawSphereAtPoint(pointCoordinate) {
    console.log(pointCoordinate)
    var geometry = new THREE.SphereGeometry(pointCoordinate.r ? pointCoordinate.r : 0.2)
    var material = new THREE.MeshBasicMaterial({ color: pointCoordinate.color ? pointCoordinate.color : 0xffff00 })
    var sphere = new THREE.Mesh(geometry, material)
    // const sphereName = '' + pointCoordinate.x + pointCoordinate.y + pointCoordinate.z
    sphere.name = pointCoordinate.name ? pointCoordinate.name : ('' + pointCoordinate.x + pointCoordinate.y + pointCoordinate.z)
    // sphere.name = sphereName
    if(pointCoordinate.pointId){
      sphere.userData.pointId = 'pointId_' + pointCoordinate.pointId 
    }
    sphere.renderOrder = 1
    this.tempSphere = sphere
    this.scene.add(sphere)
    sphere.position.setX(pointCoordinate.x)
    sphere.position.setY(pointCoordinate.y)
    sphere.position.setZ(pointCoordinate.z)
    this.camera.updateProjectionMatrix()
    this.orbitControls.update()
  }

  removeSphereAtPoint(pointCoordinate) {
    const sphereName = '' + pointCoordinate.x + pointCoordinate.y + pointCoordinate.z
    const sphere = this.scene.getObjectByName(sphereName)
    this.scene.remove(sphere)
  }

  removeTempSphere() {
    this.scene.remove(this.tempSphere)
    this.tempSphere = null
  }

  saveSphere({pointId}) {
    const { name } = this.tempSphere.name
    if(pointId){
      this.tempSphere.userData.pointId = 'pointId_' + pointId
    }
    this.savedSpheres[name] = this.tempSphere
    this.tempSphere = null
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
    n.multiplyScalar(.01);
    n.add(point);
    this.intersection.normal.copy( intersect.face.normal );
    this.mouseHelper.lookAt( n );
    var positions = this.line.geometry.attributes.position;
    positions.setXYZ( 0, point.x, point.y, point.z );
    positions.setXYZ( 1, n.x, n.y, n.z );
    positions.needsUpdate = true;
    this.intersection.intersects = true;
  }

  /**
   * Get the coordinate position of intersect from raycast
   * @param {object} intersect 
   */
  getPointCoordinate (intersect) {
    return intersect.point
  }

  addEventListener(event, callback) {
    if (event === 'click') {
      this.onClickHandler = callback
    }
    if (event === 'hoverOnPoint') {
      this.hoverOnPointHandler = callback
    }
    // if (event === 'drag') {
    //   this.onDragHandler = callback
    // }
  }
}

export default ModelViewer
