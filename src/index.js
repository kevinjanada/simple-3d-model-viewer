import ModelViewer from './ModelViewer'
//import ModelViewer from './ModelViewerWithInteraction'
//import PA0121_01 from './models/PA0121.01.fbx'
//import testFBXModel from './models/test.fbx'
// import DWS from './models/3D/EXPANDER_EXPELLER_Line02.nwd/DWS step203-reset-origin.fbx'
//import teaMug from './models/teamug.fbx'
// import DWS from './models/3D/EXPANDER_EXPELLER_Line02.nwd/EXPANDER AP203.nwd.fbx'
import DWS from './models/3D/EXPANDER_EXPELLER_Line02.nwd/DWS step203.nwd.fbx'

const elem = document.getElementById('model-viewer-canvas')
elem.style.width = '1000px'
elem.style.height = '600px'

const modelViewer = new ModelViewer(elem)
const main = async () => {
  await modelViewer.loadFBX(DWS, 'DWS')
  modelViewer.centerCameraToObject('DWS')
  modelViewer.animate()
}

//const modelViewer = new ModelViewer(elem)
//const main = async () => {
  //const model = await modelViewer.loadFBX(DWS)
  //modelViewer.centerCameraToObject(model)
  //modelViewer.animate()
//}

main()
