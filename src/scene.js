import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
// import gsap from 'gsap'; 

export function createHeroScene(container){
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const pointer = new THREE.Vector2();

    const scene = new THREE.Scene()
    const canvas = document.querySelector('canvas.webgl')

    {
        const color = 0xFFFFFF;  // white
        const near = 10;
        const far = 100;
        scene.fog = new THREE.Fog(color, near, far);
      }


      const textureLoader = new THREE.TextureLoader();
      const iconTexture = textureLoader.load('/patched-brickwork-unity/patched-brickwork_albedo.png');

  const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true
})

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

// const pointLight = new THREE.PointLight(0xffffff, 1,100)
const hemisphereLight = new THREE.HemisphereLight(0xffffff,0x444444, 0.6)


const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true; // Enable shadows
directionalLight.shadow.mapSize.width = 512; // Higher resolution shadows
directionalLight.shadow.mapSize.height = 512;
scene.add(directionalLight);
  scene.add(ambientLight, hemisphereLight);

  // Camera Position
//   camera.position.z = 6;
//   camera.position.x= 30;
 
//   camera.up.set(0, 0, 0); // Set the camera's "up" vector to always point upwards in world space
//   const planeHeight = 0; // y position of the ground plane
//   camera.position.y = Math.max(camera.position.y, planeHeight + 1); // Keep camera above the ground
  
  // camecamera.lookAt(0,0,0)ra.lookAt(cube.position)
  camera.position.set(-25,6,13)
  camera.lookAt(new THREE.Vector3(0,1,0))
  scene.add(camera)



  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const groundGeometry = new THREE.PlaneGeometry(50,  50); // Large ground plane
//   const groundMaterial = new THREE.MeshStandardMaterial({
//     color: 0x888888,
//     roughness: 0.5,
//     metalness: 0.1,
//     texture:iconTexture
//   });
// const groundMaterial = new THREE.MeshStandardMaterial({
//     map: iconTexture,
//     displacementScale: 0,
//     envMap: scene.environment,
//     metalness: 1.0,
//     //     roughness: 0.0, // Slight displacement for added depth
// });


//   const ground = new THREE.Mesh(groundGeometry, groundMaterial);
//   ground.rotation.x = -Math.PI / 2; // Make it horizontal
//   ground.receiveShadow = true; // Enable shadows
//   ground.texture= iconTexture
//   scene.add(ground);


const rgbeLoader = new RGBELoader();
rgbeLoader.load('/rogland_clear_night_4k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture; // Apply to scene
  scene.background = new THREE.Color( 0xcccccc);
});



 const gltfLoader = new GLTFLoader();
// const dracoLoader = new DRACOLoader();

// // Set Draco decoder path
// dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.150.0/examples/js/libs/draco/');
// gltfLoader.setDRACOLoader(dracoLoader);

// // Set model path and load the model
// gltfLoader.setPath('app_island/');
// gltfLoader.load('scene.gltf', (gltf) => {
//     const Model = gltf.scene;

//     // Configure the model
//     Model.scale.set(2, 2, 2);
//     Model.position.set(0, 2.76, 0);

//     // Enable shadows for all meshes in the model
//     Model.traverse((child) => {
//         if (child.isMesh) {
//             child.castShadow = true;
//             child.receiveShadow = true;
//         }
//     });

//     scene.add(Model);
// }, undefined, (error) => {
//     console.error('An error occurred while loading the model:', error);
// });



 


   gltfLoader.load( '/hedgehog_island_labolatory_fan_art/scene.gltf', (gtfl)=> {
    const box = gtfl.scene;
//  box.position.set(2,8,23);
     box.scale.setScalar(0.004)
    scene.add(box)
    console.log(box)
   })  


   
   gltfLoader.load( '/dualshoke_4/scene.gltf', (gtfl)=> {
    const box = gtfl.scene;
  box.position.set(8,3,0);
box.scale.setScalar(0.023)
    scene.add(box)
    console.log(box)
   })  


   gltfLoader.load( '/financical_icon/scene.gltf', (gtfl)=> {
    const box = gtfl.scene;
  box.position.set(-8,2,0);
box.scale.setScalar(3)
    scene.add(box)
    console.log(box)
   })  

    textureLoader.load('/cx3.jpg', (texture) => {
      const boxGeometry = new THREE.BoxGeometry(1, 1);
      const boxMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  const    box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.scale.setScalar(2);
      box.position.set(0,0.8, 0); // Center box
      box.castShadow = true;
      scene.add(box);
    });


    function logCameraPosition() {
        console.log('Camera Position:', camera.position);
        console.log('Controls Target:', controls.target);
    
        // Use the captured values as defaults
        const defaultCameraPosition = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z,
        };
    
        const defaultTargetPosition = {
            x: controls.target.x,
            y: controls.target.y,
            z: controls.target.z,
        };
    
        console.log('Default Camera Position:', defaultCameraPosition);
        console.log('Default Target Position:', defaultTargetPosition);
    }
    
    // Add a button or trigger for logging the position
    const logButton = document.createElement('button');
    logButton.innerText = 'Log Camera Position';
    logButton.style.position = 'absolute';
    logButton.style.top = '10px';
    logButton.style.left = '10px';
    document.body.appendChild(logButton);
    
    logButton.addEventListener('click', logCameraPosition);
  


  window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });


  window.addEventListener('click', (event) => {
    // Normalize mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // console.log('Mouse NDC:', mouse);

    // Raycasting
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects[0])
    if (intersects.length > 0) {
        
   console.log(intersects)
        // Animate scale using GSAP (optional)
        // gsap.to(intersects[0].object.scale, { x: 2, y: 2, z: 2, duration: 1 });
    } else {
        console.log('No intersection detected.');
    }
});

  const joinButton = document.createElement('button');
    joinButton.innerHTML = 'Join Community';
    joinButton.style.position = 'absolute';
    joinButton.style.bottom = '20px';
    joinButton.style.left = '50%';
    joinButton.style.transform = 'translateX(-50%)';
    joinButton.style.padding = '15px 30px';
  joinButton.style.background = 'rgba(255, 255, 255, 0.2)'; // Semi-transparent white
  joinButton.style.color = 'black';
  joinButton.style.border = '1px solid rgba(255, 255, 255, 0.3)'; // Subtle border
  joinButton.style.borderRadius = '10px';
  joinButton.style.backdropFilter = 'blur(10px)'; // Blur effect
  joinButton.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)'; 
    document.body.appendChild(joinButton);
    joinButton.addEventListener('click', () => {
      window.open('https://chat.whatsapp.com/L64NIIlm9gKGehkky4wZp0', '_blank');
    });

  
  
const controls = new OrbitControls(camera, canvas)
controls.enableDamping=true;
controls.enableZoom = true; // Enable pinch zoom
controls.enableRotate = true; // Enable drag-to-rotate on mobile
controls.enablePan = true; // Enable drag-to-pan
controls.maxPolarAngle = Math.PI / 2; // Limit the vertical rotation to 90 degrees (looking straight up)
controls.minPolarAngle = Math.PI / 4; // Optional: Limit the minimum rotation to avoid going below the ground
// controls.maxAzimuthAngle = Math.PI / 2; // Limit horizontal rotation to 90 degrees (left-right)
// controls.minAzimuthAngle = -Math.PI / 2; // Limit horizontal rotation to -90 degrees (left-right)
controls.maxDistance = 25;  // Limit zoom distance
controls.minDistance = 5;   // Avoid zooming too close
controls.dampingFactor = 1;

  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);


};
animate();
}