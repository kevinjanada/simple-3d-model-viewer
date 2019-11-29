import ModelViewer from './ModelViewer'
import PA0121_01 from './models/PA0121.01.fbx'
import testFBXModel from './models/test.fbx'


const modelViewer = new ModelViewer()
const main = async () => {
  // await modelViewer.loadFBX(testFBXModel, 'testModel')
  await modelViewer.loadFBX(PA0121_01, 'tanks')
  modelViewer.animate()
}

main()