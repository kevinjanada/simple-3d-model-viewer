import * as THREE from 'three'

//import ModelViewer from './ModelViewer'
import ModelViewer from './ModelViewerWithInteraction'
//import PA0121_01 from './models/PA0121.01.fbx'
//import testFBXModel from './models/test.fbx'
//import modelResetOrigin from './models/3D/EXPANDER_EXPELLER_Line02.nwd/DWS step203-reset-origin.fbx'
import teaMug from './models/teamug.fbx'

const elem = document.getElementById('model-viewer-canvas')
elem.style.width = '1000px'
elem.style.height = '600px'

//const modelViewer = new ModelViewer(elem)
//const main = async () => {
  //await modelViewer.loadFBX(teaMug, 'teaMug')
  //modelViewer.centerCameraToObject('teaMug')
  //modelViewer.animate()
//}

const modelViewer = new ModelViewer(elem)
const main = async () => {
  const model = await modelViewer.loadFBX(teaMug, 'teaMug')
  modelViewer.centerCameraToObject(model)
  modelViewer.animate()
}

main()
