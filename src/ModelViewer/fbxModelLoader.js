import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
const THREE = require('three');

let loader = new FBXLoader()
/*
 * @fbxModelLoader
 * @param {string} model path
 * @returns {promise} resolve to model object
 * */
const fbxModelLoader = (modelPath) => new Promise((resolve, reject) => {
  console.log(modelPath)
  const baseURL = THREE.LoaderUtils.extractUrlBase(modelPath);
  console.log(baseURL)
  if (!loader) { loader = new FBXLoader() }
  loader.setCrossOrigin('anonymous');
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
