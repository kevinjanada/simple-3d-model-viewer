import * as THREE from 'three'

import ModelViewer from './ModelViewer'
import PA0121_01 from './models/PA0121.01.fbx'
import testFBXModel from './models/test.fbx'
import modelResetOrigin from './models/3D/EXPANDER_EXPELLER_Line02.nwd/DWS\ step203-reset-origin.fbx'


const modelViewer = new ModelViewer()
const main = async () => {
  // await modelViewer.loadFBX(testFBXModel, 'testModel')
  await modelViewer.loadFBX(modelResetOrigin, 'tanks')
  modelViewer.animate()
}

main()