import * as THREE from 'three'

import ModelViewer from './ModelViewer'
import PA0121_01 from './models/PA0121.01.fbx'
import testFBXModel from './models/test.fbx'
import modelResetOrigin from './models/3D/EXPANDER_EXPELLER_Line02.nwd/DWS step203-reset-origin.fbx'

const elem = document.getElementById('model-viewer-canvas')
elem.style.width = '1000px'
elem.style.height = '600px'

const modelViewer = new ModelViewer(elem)
const main = async () => {
  await modelViewer.loadFBX(modelResetOrigin, 'tanks')
  modelViewer.animate()
}

main()