import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
 import gsap from 'gsap'; 
 import TWEEN from '@tweenjs/tween.js';

export function createHeroScene(container){
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isFirstClick = true; 
// 1. Stylish Interactive Prompt Div
const interactionPrompt = document.createElement('div');
interactionPrompt.innerHTML = 'Touch to interact with our world 🎮';
interactionPrompt.style.position = 'absolute';
interactionPrompt.style.top = '50%';
interactionPrompt.style.left = '50%';
interactionPrompt.style.transform = 'translate(-50%, -50%)';
interactionPrompt.style.fontSize = '24px';
interactionPrompt.style.fontWeight = 'bold';
interactionPrompt.style.color = '#fff';
interactionPrompt.style.padding = '20px';
interactionPrompt.style.background = 'rgba(0, 0, 0, 0.7)';
interactionPrompt.style.borderRadius = '10px';
interactionPrompt.style.textAlign = 'center';
interactionPrompt.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
interactionPrompt.style.transition = 'opacity 0.5s ease';
interactionPrompt.style.zIndex = '100';
interactionPrompt.style.display= 'none'
document.body.appendChild(interactionPrompt);

// Hide prompt after interaction
let promptVisible = true;
const hidePrompt = () => {
    if (promptVisible) {
        interactionPrompt.style.opacity = '0';
        setTimeout(() => {
            interactionPrompt.style.display = 'none';
        }, 500); // Matches the fade-out transition time
        promptVisible = false;
    }
};
// 1. Loading Message (Recommending VR Headset)
const loadingMessage = document.createElement('div');
loadingMessage.innerHTML = 'Loading... For the best experience, use a VR headset! 🕶️';
loadingMessage.style.position = 'absolute';
loadingMessage.style.top = '50%';
loadingMessage.style.left = '50%';
loadingMessage.style.transform = 'translate(-50%, -50%)';
loadingMessage.style.fontSize = '18px';
loadingMessage.style.color = 'white';
loadingMessage.style.background = 'black';
loadingMessage.style.padding = '15px';
loadingMessage.style.borderRadius = '10px';
loadingMessage.style.textAlign = 'center';
loadingMessage.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
loadingMessage.style.zIndex = '1000';

loadingMessage.style.transition = 'opacity 0.5s ease'; // Transition for opacity
document.body.appendChild(loadingMessage);

window.addEventListener('load', () => {

  loadingMessage.style.opacity = '1'; // Initially hidden with opacity
  setTimeout(() => {
      loadingMessage.style.opacity = '0'; // Fade out by changing opacity to 0
     
  }, 5000); // Show for 3 seconds
});

    // Loading Manager
const loadingManager = new THREE.LoadingManager();

// Show loading screen while assets are loading
loadingManager.onStart = () => {

};

// When all assets are loaded
loadingManager.onLoad = () => {
    console.log('All assets loaded');
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none'; // Hide preloader
    // loadingMessage.style.opacity = '0';
    isPlaying=true
};

// Track loading progress
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
 
    console.log(`Loaded ${itemsLoaded} of ${itemsTotal} files: ${url}`);
    const progress = (itemsLoaded / itemsTotal) * 100;
  
    document.getElementById('progress-bar').style.width = `${progress}%`;
   
};

// Handle loading errors
loadingManager.onError = (url) => {
    console.error(`There was an error loading ${url}`);
};

// Use the LoadingManager with loaders
const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader(loadingManager);
const listener = new THREE.AudioListener();

const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader(loadingManager);

// 1. Load and play a song
function loadAndPlaySong(songPath) {
    audioLoader.load(songPath, (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(true); // Loop the music
        sound.setVolume(0.5); // Set initial volume
        sound.play(); // Play the music
    });
}



// Default song
const defaultSong = '/inspiring-african-music-255647.mp3'; // Set default song here
loadAndPlaySong(defaultSong);

// 2. Create a container for the music controls
const controlsContainer = document.createElement('div');
controlsContainer.style.position = 'absolute';
controlsContainer.style.top = '10px';
controlsContainer.style.right = '10px';
controlsContainer.style.zIndex = '1000';
controlsContainer.style.display = 'flex';
controlsContainer.style.alignItems = 'center';
controlsContainer.style.justifyContent = 'center';
document.body.appendChild(controlsContainer);

// 3. Create
// 3. Create the stylish transparent stop/play button
const stopButton = document.createElement('button');
stopButton.innerHTML = '⏹️'; // Unicode stop icon
stopButton.style.width = '50px';
stopButton.style.height = '50px';
stopButton.style.borderRadius = '50%';
stopButton.style.fontSize = '24px';
stopButton.style.border = '2px solid rgba(255, 255, 255, 0.7)'; // Light border
stopButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // Transparent background
stopButton.style.color = 'white';
stopButton.style.cursor = 'pointer';
stopButton.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
stopButton.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
controlsContainer.appendChild(stopButton);

// Add hover effects
stopButton.addEventListener('mouseenter', () => {
    stopButton.style.transform = 'scale(1.1)'; // Slightly increase size on hover
    stopButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // Slightly lighter transparent background
});
stopButton.addEventListener('mouseleave', () => {
    stopButton.style.transform = 'scale(1)'; // Reset size
    stopButton.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'; // Reset transparent background
});

// Track whether the music is playing
let isPlaying = true;

// Toggle play/pause
stopButton.addEventListener('click', () => {
    if (isPlaying) {
        sound.pause(); // Pause the music
        stopButton.innerHTML = '▶️'; // Change icon to play
    } else {
        sound.play(); // Resume the music
        stopButton.innerHTML = '⏹️'; // Change icon to stop
    }
    isPlaying = !isPlaying; // Toggle state
});

// 4. Create a dropdown list for selecting a song
const songSelector = document.createElement('select');
songSelector.innerHTML = `
    <option value="/evolution.mp3">Evolution</option>
    <option value="/birthofahero.mp3">Birth of a Hero</option>
    <option value="/newfrontier.mp3">New Frontier</option>
       <option value="/movement-200697.mp3">Movement</option>
         <option value="/echoofsadness.mp3">Echo of Sadness</option>
          <option value="/paperback.mp3">Paperback</option>
             <option value="/stylish-deep-electronic-262632.mp3">Deep electronic</option>
                <option value="/vlog-music-beat-trailer-showreel-promo-background-intro-theme-274290.mp3">Vlog music beat</option>
                  <option value="/african-night-171020.mp3">African Night</option>
                      <option value="/african-percussions-8178.mp3">African Percussions</option>
                      <option value="/inspiring-african-music-255647.mp3">Inspiring African music</option>
                        <option value="/amapiano-background-lofi-african-music-244452.mp3">Amapiano African music</option>
                          <option value="/game-over-275058.mp3">Game Over</option>
                            <option value="/the-afrobeat-153058.mp3">The Afro</option>`;
songSelector.style.padding = '10px';
songSelector.style.borderRadius = '5px';
songSelector.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
songSelector.style.color = 'white';
songSelector.style.cursor = 'pointer';
songSelector.style.fontSize = '16px';
songSelector.style.marginLeft = '10px'; // Space between stop button and dropdown
controlsContainer.appendChild(songSelector);

// 5. Function to change the song when a user selects a new one
songSelector.addEventListener('change', (event) => {
    const selectedSong = event.target.value;
    loadAndPlaySong(selectedSong); // Play selected song immediately
    stopButton.innerHTML = '⏹️'; // Ensure the icon is set to stop after song change
    isPlaying = true; // Ensure music is in the playing state
});

// Media query for responsiveness (Optional)
const mediaQuery = window.matchMedia('(max-width: 600px)');
function adjustResponsiveLayout() {
    if (mediaQuery.matches) {
        songSelector.style.width = '100%';  // Make the dropdown take full width on small screens
    } else {
        songSelector.style.width = '200px';  // Set width for larger screens
    }
}

// Adjust layout on initial load and window resize
adjustResponsiveLayout();
mediaQuery.addEventListener('change', adjustResponsiveLayout);



    let box3




  
    const scene = new THREE.Scene()
    const canvas = document.querySelector('canvas.webgl')

    {
        const color = 0xFFFFFF;  // white
        const near = 10;
        const far = 100;
        scene.fog = new THREE.Fog(color, near, far);
      }


      


  const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// camera.position.z = 61;

// Load and play audio



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
  camera.position.set( -4,  8,  61 )
  camera.lookAt(new THREE.Vector3(0,3,0))
  scene.add(camera)



  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);


const rgbeLoader = new RGBELoader();
rgbeLoader.load('/rogland_clear_night_4k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture; // Apply to scene
scene.environment= texture
});




 dracoLoader.setDecoderPath('/https://www.gstatic.com/draco/versioned/decoders/1.5.7/'); // Set the path to Draco decoder files
 
 // Attach DracoLoader to GLTFLoader
 gltfLoader.setDRACOLoader(dracoLoader);
//gtfl loaders
   gltfLoader.load( '/floating_space_rocks.glb', (gtfl)=> {
    const box = gtfl.scene;
//  box.position.set(2,8,23);
    box.scale.setScalar(0.2)
    scene.add(box)

   })  


// Create a textured sphere (already a mesh, no traversal needed)
textureLoader.load('/cx3.jpg', (texture) => {
  const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Higher resolution for smoother appearance
  const sphereMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      roughness: 1,
      metalness: 0.5,
  });

  // Create the sphere
  box3 = new THREE.Mesh(sphereGeometry, sphereMaterial);
  box3.scale.setScalar(2);
  box3.position.set(0, 2, 0); // Center sphere
  box3.castShadow = true;
  box3.userData = { name: "CX3", description: "Experience the fusion of Web3, gaming, and VR. Stay tuned for the revolution" };

  // Add the sphere to the scene
  scene.add(box3);
});




// Correct raycasting logic
window.addEventListener('click', (event) => {
  const rect = renderer.domElement.getBoundingClientRect(); // Use renderer's canvas
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Raycast only the box3 object
  const intersects = raycaster.intersectObject(box3, true);

  if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      const { name, description } = intersectedObject.userData;
      hidePrompt();


      // Update product info
      productInfo.innerHTML = `<strong>${description}</strong>`;
      productInfo.style.left = `${event.clientX}px`;
      productInfo.style.top = `${event.clientY}px`;
      productInfo.style.display = 'block';

      // Animate camera to the sphere
      // gsap.to(camera.position, {
      //     x: box3.position.x + 5,
      //     y: box3.position.y + 7,
      //     z: box3.position.z + 5,
      //     duration: 2,
      //     onUpdate: () => camera.lookAt(box3.position),
      // });
      gsap.fromTo(
        exploreButton,
        { y: 0 },
        {
            y: -20, // Move up by 20px
            duration: 0.2, // Animation duration
            ease: "power1.out",
            yoyo: true,
            repeat: 1, // Bounce back
        }
    );

    // Trigger device vibration
    if (navigator.vibrate) {
        try {
            navigator.vibrate([200]); // Single 200ms vibration
        } catch (err) {
            console.error("Vibration API failed:", err);
        }
    } else {
        console.log("Vibration API not supported on this device.");
    }
  } else {
      productInfo.style.display = 'none';
  }
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
    
    // // Add a button or trigger for logging the position
    // const logButton = document.createElement('button');
    // logButton.innerText = 'Log Camera Position';
    // logButton.style.position = 'absolute';
    // logButton.style.top = '10px';
    // logButton.style.left = '10px';
    // document.body.appendChild(logButton);
    
    // logButton.addEventListener('click', logCameraPosition);
  


  window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    console.log('resized')
  });
// Product info display
const productInfo = document.createElement('div');

// Apply styles for responsiveness, centering, and transparency
Object.assign(productInfo.style, {
    position: 'fixed', // 'fixed' keeps it responsive to screen size
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.6)', // Transparent background
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '1rem', // Responsive font size
    maxWidth: '90%', // Prevent overflow on smaller screens
    textAlign: 'center',
    display: 'none', // Hidden by default
    transform: 'translate(-50%, -50%)', // Center alignment
    top: '50%', // Vertically centered
    left: '50%', // Horizontally centered
    zIndex: 9999, // Ensure it appears above other elements
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // Soft shadow for depth
});

// Append to body
document.body.appendChild(productInfo);

// Utility function to style buttons
const createStyledButton = (text, positionBottom, positionLeft) => {
  const button = document.createElement('button');
  button.innerHTML = text;
  Object.assign(button.style, {
      position: 'absolute',
      bottom: positionBottom,
      left: positionLeft,
      transform: 'translateX(-50%)',
      padding: '1rem 2rem',
      background: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
      color: 'black',
      border: '1px solid rgba(255, 255, 255, 0.3)', // Subtle border
      borderRadius: '10px',
      backdropFilter: 'blur(10px)', // Blur effect
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Light shadow
      fontSize: '1rem', // Scalable font
      cursor: 'pointer',
      zIndex: 1000,
      maxWidth: '90%', // Prevent overflow on smaller screens
      textAlign: 'center',
      transition: 'all 0.3s ease', // Smooth transition for hover effects
  });

  // Add hover effect
  button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(255, 255, 255, 0.5)'; // Brighter background
      button.style.color = '#fff'; // Dark text
      button.style.transform = 'translateX(-50%) scale(1.05)'; // Slightly enlarge
  });

  button.addEventListener('mouseleave', () => {
      button.style.background = 'rgba(255, 255, 255, 0.2)'; // Reset background
      button.style.color = 'black'; // Reset text color
      button.style.transform = 'translateX(-50%) scale(1)'; // Reset size
  });

  return button;
};

// Create and style buttons

const exploreButton = createStyledButton('Explore', '5%', '30%');
const vrButton = createStyledButton('View in VR', '5%', '50%');
const joinButton = createStyledButton('Join Community', '5%', '70%');
const xButton = createStyledButton('Follow on X', '5%', '90%');

// Append buttons to the body
document.body.appendChild(exploreButton);
 document.body.appendChild(vrButton);
 document.body.appendChild(joinButton);
 document.body.appendChild(xButton)
// document.body.appendChild(vrButton.createButton(renderer));
// Adjust button styles for responsiveness
const adjustButtonStyles = () => {
  const screenWidth = window.innerWidth;

  if (screenWidth < 768) { // Mobile screens
      [xButton, joinButton ,vrButton, exploreButton].forEach((button, index) => {
          button.style.fontSize = '0.9rem';
          button.style.padding = '0.8rem 1.5rem';
          button.style.bottom = `${15 + index * 8.4}%`; // Stack buttons vertically
          button.style.left = '50%'; // Center align on smaller screens
          button.style.transform = 'translateX(-50%)';
      });
  } else if (screenWidth < 1200) { // Tablet screens
      joinButton.style.bottom = '7%';
      exploreButton.style.bottom = '7%';
      vrButton.style.bottom = '7%';
      xButton.style.bottom = '7%';

      joinButton.style.left = '60%';
      exploreButton.style.left = '20%';
      vrButton.style.left = '40%';
      xButton.style.left = '80%';

      [joinButton, exploreButton, vrButton, xButton].forEach((button) => {
          button.style.fontSize = '0.9rem';
          button.style.padding = '1rem 1.5rem';
          button.style.transform = 'translateX(-50%)';
      });
  } else { // Desktop screens
      joinButton.style.bottom = '5%';
      exploreButton.style.bottom = '5%';
      vrButton.style.bottom = '5%';
      xButton.style.bottom = '5%';

      joinButton.style.left = '60%';
      exploreButton.style.left = '20%';
      vrButton.style.left = '40%';
      xButton.style.left = '80%';


      [joinButton, exploreButton, vrButton,xButton].forEach((button) => {
          button.style.fontSize = '1.2rem';
          button.style.padding = '1.2rem 2.5rem';
          button.style.transform = 'translateX(-50%)';
      });
  }
};

// Attach resize event listener for responsiveness
window.addEventListener('resize', adjustButtonStyles);

// Trigger the function initially to set button styles
adjustButtonStyles();



    xButton.addEventListener('click', ()=> {

      window.open('https://x.com/cbichain', '_blank')
    })

    joinButton.addEventListener('click', () => {
      window.open('https://chat.whatsapp.com/L64NIIlm9gKGehkky4wZp0', '_blank');
    });

 // Explore button click listener
exploreButton.addEventListener('click', () => {
  if (isFirstClick) {
      // Show the interaction prompt once after clicking "Explore"
      interactionPrompt.style.display = 'block';

      // Hide the interaction prompt after a delay
      setTimeout(() => {
          interactionPrompt.style.opacity = '0';
          setTimeout(() => {
              interactionPrompt.style.display = 'none'; // Hide prompt after fading
          }, 500); // Delay before hiding
      }, 3000); // Show prompt for 3 seconds

      // Disable (lock) the explore button
      exploreButton.disabled = true;
      exploreButton.style.cursor = 'not-allowed'; // Change cursor to indicate the button is disabled

      isFirstClick = false; // After the first click, set to false
  }

  // Camera animation
  gsap.fromTo(camera.position, 
      { x: -4, y: 8, z: 61 }, // Start position
      { x: -12, y: 10, z: -10, duration: 10, ease: "elastic.out" } // End position with bounce effect
  );

  // Interaction prompt animation
  gsap.fromTo(interactionPrompt, 
      { scale: 1, opacity: 0 }, // Initial state
      { scale: 1.2, opacity: 1, duration: 0.5, yoyo: true, repeat: 2 } // Animation with bounce effect
  );
});


// Enable XR on the renderer
renderer.xr.enabled = true;
  
  // Add VR button click functionality
  vrButton.addEventListener('click', () => {
    if (renderer.xr && navigator.xr) {
      renderer.xr.enabled = true;
  
      // Check if immersive VR is supported
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        if (supported) {
          // Request immersive VR session
          navigator.xr.requestSession('immersive-vr').then((session) => {
            renderer.xr.setSession(session); // Set the session to the renderer
          }).catch((err) => {
            console.error("Failed to start VR session:", err);
          });
        } else {
          alert("VR is not supported on this device or browser.");
        }
      }).catch((err) => {
        console.error("Error checking VR support:", err);
      });
    } else {
      alert("WebXR or VR support not detected.");
    }
  });


// Example of loading a 3D model (if needed)
// const gltfLoader = new THREE.GLTFLoader(loadingManager);
// gltfLoader.load('/path/to/model.glb', (gltf) => {
//     scene.add(gltf.scene);
// });

    
const controls = new OrbitControls(camera, canvas)
controls.enableDamping=true;
controls.enableZoom = true; // Enable pinch zoom
controls.enableRotate = true;
controls.autoRotate=true
 // Enable drag-to-rotate on mobile
controls.enablePan = true; // Enable drag-to-pan
controls.maxPolarAngle = Math.PI / 2; // Limit the vertical rotation to 90 degrees (looking straight up)
controls.minPolarAngle = Math.PI / 4; // Optional: Limit the minimum rotation to avoid going below the ground
// controls.maxAzimuthAngle = Math.PI / 2; // Limit horizontal rotation to 90 degrees (left-right)
// controls.minAzimuthAngle = -Math.PI / 2; // Limit horizontal rotation to -90 degrees (left-right)
// controls.maxDistance = 25;  // Limit zoom distance
// controls.minDistance = 5;   // Avoid zooming too close
controls.dampingFactor = 1;
controls.touches = {
	ONE: THREE.TOUCH.ROTATE,
	TWO: THREE.TOUCH.DOLLY_PAN
}

// camera.position.z = 61;

// Variables for shake effect
let shakeIntensity = 0;
let isShaking = false;

// Function to create a shake effect on the box3
function shakeEffect() {
    // If already shaking, do nothing
    if (isShaking) return;

    isShaking = true;

    // Define the shake movement (a small random translation for shake)
    new TWEEN.Tween(box3.position)
        .to({ x: box3.position.x + Math.random() * 0.2 - 0.1, y: box3.position.y + Math.random() * 0.2 - 0.1 }, 100)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
            // Repeat the shake effect
            setTimeout(() => {
                isShaking = false;
            }, 100); // Allow a small delay before allowing the shake to trigger again
        })
        .start();
}

// Function to listen for device motion (shake)
function listenForDeviceShake() {
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', (event) => {
            const accX = event.accelerationIncludingGravity.x;
            const accY = event.accelerationIncludingGravity.y;
            const accZ = event.accelerationIncludingGravity.z;

            // Trigger shake when a large acceleration change is detected
            if (Math.abs(accX) > 15 || Math.abs(accY) > 15 || Math.abs(accZ) > 15) {
                shakeEffect();
            }
        });
    } else {
        alert("DeviceMotionEvent is not supported on this device.");
    }
}

// Listen for shake gestures
listenForDeviceShake();



const clock = new THREE.Clock()



  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
  const elapsedTime = clock.getElapsedTime();

  if(box3){
     box3.rotation.y = elapsedTime;
  }
   
  TWEEN.update();
    renderer.render(scene, camera);


};
animate();
}