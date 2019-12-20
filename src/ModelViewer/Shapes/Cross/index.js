import * as THREE from 'three'

class Cross extends THREE.Mesh {
  constructor(_size, _color) {
    const width = 0.05
    const height = 0.1
    const depth = 0.4
    const size = {
      width: width * _size,
      height: height * _size,
      depth: depth * _size,
    }
    let color = _color ? _color : 0x00ff00
    var rectOneGeom = new THREE.BoxGeometry(size.width, size.height, size.depth)
    rectOneGeom.rotateY((Math.PI / 4))
    var rectTwoGeom = new THREE.BoxGeometry(size.width, size.height, size.depth)
    rectTwoGeom.rotateY((Math.PI / 4) * -1)
    rectOneGeom.merge(rectTwoGeom)
    var material = new THREE.MeshBasicMaterial({ color })
    super(rectOneGeom, material)
  }
}

export default Cross
