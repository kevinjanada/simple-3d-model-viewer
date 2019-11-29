import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

let loader = new FBXLoader()
/*
 * @fbxModelLoader
 * @param {string} model path
 * @returns {promise} resolve to model object
 * */
const fbxModelLoader = (modelPath) => new Promise((resolve, reject) => {
  if (!loader) { loader = new FBXLoader() }
  loader.load(modelPath, model => {
    resolve(model)
  }, progress => {
    //console.log(progress)
  }, error => {
    console.log(error)
    reject(error)
  })
})

export default fbxModelLoader
