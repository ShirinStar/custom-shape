import './style.css'
import * as THREE from 'three'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import shapeShaderVertex from './shaders/vertex.glsl'
import shapeShaderFragment from './shaders/fragment.glsl'
import * as dat from 'dat.gui'

const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xB5B5B5)

const gui = new dat.GUI()

const raycaster = new THREE.Raycaster()

//textures
const textureLoader = new THREE.TextureLoader()
const pointTexture = textureLoader.load('/dotFill.png')

//points
const pointGeometry = new THREE.PlaneGeometry(0.4, 0.4)

//seperat point material to solve change material with raycastere/hover
const pointMaterialOne = new THREE.MeshBasicMaterial({transparent: true,alphaMap: pointTexture, color: 'black'})
const pointMaterialTwo = new THREE.MeshBasicMaterial({transparent: true,alphaMap: pointTexture, color: 'black'})
const pointMaterialThree = new THREE.MeshBasicMaterial({transparent: true,alphaMap: pointTexture, color: 'black'})
const pointMaterialFour = new THREE.MeshBasicMaterial({transparent: true,alphaMap: pointTexture, color: 'black'})
const pointMaterialFive = new THREE.MeshBasicMaterial({transparent: true,alphaMap: pointTexture, color: 'black'})
const pointMaterialSix = new THREE.MeshBasicMaterial({transparent: true,alphaMap: pointTexture, color: 'black'})
const pointMaterialSeven = new THREE.MeshBasicMaterial({transparent: true,alphaMap: pointTexture, color: 'black'})
const pointMaterialEight = new THREE.MeshBasicMaterial({transparent: true,alphaMap: pointTexture, color: 'black'})

const point1 = new THREE.Mesh(pointGeometry, pointMaterialOne)
point1.position.set(-8, 6, 1)
point1.userData.draggable = true
const point2 = new THREE.Mesh(pointGeometry, pointMaterialTwo)
point2.position.set(-8, -6, 1)
point2.userData.draggable = true
const point3 = new THREE.Mesh(pointGeometry, pointMaterialThree)
point3.position.set(1, 6, 1)
point3.userData.draggable = true
const point4 = new THREE.Mesh(pointGeometry, pointMaterialFour)
point4.position.set(-4.3, -1, 1)
point4.userData.draggable = true
const point5 = new THREE.Mesh(pointGeometry, pointMaterialFive)
point5.position.set(1, -5, 1)
point5.userData.draggable = true
const point6 = new THREE.Mesh(pointGeometry, pointMaterialSix)
point6.position.set(5, -2, 1)
point6.userData.draggable = true
const point7 = new THREE.Mesh(pointGeometry, pointMaterialSeven)
point7.position.set(8, -3.5, 1)
point7.userData.draggable = true
const point8 = new THREE.Mesh(pointGeometry, pointMaterialEight)
point8.position.set(8, 6, 1)
point8.userData.draggable = true

scene.add(point1, point2, point3, point4, point5, point6, point7, point8)

//custom shape
const shapeGeometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  point1.position.x, point1.position.y, point1.position.z,
  point2.position.x, point2.position.y, point2.position.z,
  point3.position.x, point3.position.y, point3.position.z,

  point4.position.x, point4.position.y, point4.position.z,
  point5.position.x, point5.position.y, point5.position.z,
  point3.position.x, point3.position.y, point3.position.z,

  point5.position.x, point5.position.y, point5.position.z,
  point6.position.x, point6.position.y, point6.position.z,
  point3.position.x, point3.position.y, point3.position.z,

  point5.position.x, point5.position.y, point5.position.z,
  point6.position.x, point6.position.y, point6.position.z,
  point3.position.x, point3.position.y, point3.position.z,

  point6.position.x, point6.position.y, point6.position.z,
  point8.position.x, point8.position.y, point8.position.z,
  point3.position.x, point3.position.y, point3.position.z,

  point6.position.x, point6.position.y, point6.position.z,
  point7.position.x, point7.position.y, point7.position.z,
  point8.position.x, point8.position.y, point8.position.z
]);

shapeGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

const shapeMaterial = new THREE.ShaderMaterial({
  vertexShader: shapeShaderVertex,
  fragmentShader: shapeShaderFragment,
  uniforms: {
    uTime: { value: 0 },
    uSpeed: {value: 1},
    uStep: {value: 1}
  }
})

const customShape = new THREE.Mesh(shapeGeometry, shapeMaterial)
scene.add(customShape)

gui.add(shapeMaterial.uniforms.uSpeed, 'value').min(1).max(10).step(0.01).name('speed')
gui.add(shapeMaterial.uniforms.uStep, 'value').min(0.5).max(10).step(0.1).name('step')

//sun
const sunGeo = new THREE.SphereGeometry(1, 32, 32)
const sunMaterial = new THREE.MeshBasicMaterial({color:'red'})
const sun = new THREE.Mesh(sunGeo, sunMaterial)
sun.position.x = 2
sun.position.y = 2.2 
sun.position.z = 2
sun.userData.draggable = true
scene.add(sun)

//resize
const windowSizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  windowSizes.width = window.innerWidth
  windowSizes.height = window.innerHeight
  camera.aspect = windowSizes.width / windowSizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(windowSizes.width, windowSizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//camera
const camera = new THREE.PerspectiveCamera(75, windowSizes.width / windowSizes.height, 0.1, 100)
camera.position.z = 10
scene.add(camera)

//render
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(windowSizes.width, windowSizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const pointsToMove = [sun, point1, point2, point3, point4, point5, point6, point7, point8]
const clickMouse = new THREE.Vector2()
const moveMouse = new THREE.Vector2()
let draggable = new THREE.Object3D()

//mouse events
const controls = new DragControls(pointsToMove, camera, renderer.domElement);

controls.addEventListener('dragstart', (event) => {
  clickMouse.x = event.clientX / windowSizes.width * 2 - 1
  clickMouse.y = - (event.clientY / windowSizes.height) * 2 + 1

  raycaster.setFromCamera(clickMouse, camera);
  const intersects = raycaster.intersectObjects(scene.children)
  if (intersects.length > 0 && intersects[0].object.userData.draggable) {
    draggable = intersects[0].object
  }
})

controls.addEventListener('dragend', (event) => {
  if (draggable) {
    draggable = null
    return;
  }
})

window.addEventListener('mousemove', (event) => {
  moveMouse.x = event.clientX / windowSizes.width * 2 - 1
  moveMouse.y = - (event.clientY / windowSizes.height) * 2 + 1
})

const dragPoints = () => {
  if (draggable != null) {
    raycaster.setFromCamera(moveMouse, camera)
    const intersects = raycaster.intersectObjects(scene.children)
    if (intersects.length > 0) {
      for (let intersect of intersects) {
        draggable.position.x = intersect.point.x
        draggable.position.y = intersect.point.y
      }
    }
  }
}

const hoverPoints = () => {
  raycaster.setFromCamera(moveMouse, camera)
  const intersects = raycaster.intersectObjects(pointsToMove)
  for (const point of pointsToMove) {
    point.material.color.set('#FFC890')
    //point.material.opacity = 1
  }
  for (const intersect of intersects) {
    intersect.object.material.color.set('#404040')
    //intersect.object.material.opacity = 0.6
  }
  if (intersects.length > 0) {
    document.body.style.cursor = 'all-scroll'
  } else {
    document.body.style.cursor = 'default'
  }
}

//animation loop
const clock = new THREE.Clock()

const animation = () => {
  const elapsedTime = clock.getElapsedTime()
  shapeMaterial.uniforms.uTime.value = elapsedTime;
  //controls.update()

  hoverPoints()
  dragPoints()

  const updatedVertex = new Float32Array([
    point1.position.x, point1.position.y, point1.position.z,
    point2.position.x, point2.position.y, point2.position.z,
    point3.position.x, point3.position.y, point3.position.z,
  
    point4.position.x, point4.position.y, point4.position.z,
    point5.position.x, point5.position.y, point5.position.z,
    point3.position.x, point3.position.y, point3.position.z,
  
    point5.position.x, point5.position.y, point5.position.z,
    point6.position.x, point6.position.y, point6.position.z,
    point3.position.x, point3.position.y, point3.position.z,
  
    point5.position.x, point5.position.y, point5.position.z,
    point6.position.x, point6.position.y, point6.position.z,
    point3.position.x, point3.position.y, point3.position.z,
  
    point6.position.x, point6.position.y, point6.position.z,
    point8.position.x, point8.position.y, point8.position.z,
    point3.position.x, point3.position.y, point3.position.z,
  
    point6.position.x, point6.position.y, point6.position.z,
    point7.position.x, point7.position.y, point7.position.z,
    point8.position.x, point8.position.y, point8.position.z
   ]);

  shapeGeometry.setAttribute('position', new THREE.BufferAttribute(updatedVertex, 3));

  renderer.render(scene, camera)
  window.requestAnimationFrame(animation)
}

animation()
