// Global variables for the scene, camera, renderer, and current planet
let scene, camera, renderer, currentPlanet, controls;

// Data structure with new descriptions and a new texture for Saturn's rings
const planets = {
    mercury: { 
        name: 'Mercury', 
        texture: './textures/mercury_texture.jpg', 
        description: 'The smallest and closest planet to the Sun, known for its rocky, cratered surface.' 
    },
    venus: { 
        name: 'Venus', 
        texture: './textures/venus_texture.jpg', 
        description: 'The second planet from the Sun, with a rocky surface and no moons.' 
    },
    earth: { 
        name: 'Earth', 
        texture: './textures/earth_texture.jpg', 
        description: 'Our home planet, a rocky planet with a solid surface and one moon.' 
    },
    mars: { 
        name: 'Mars', 
        texture: './textures/mars_texture.jpg', 
        description: 'The "Red Planet," a rocky world with very few or no moons.' 
    },
    jupiter: { 
        name: 'Jupiter', 
        texture: './textures/jupiter_texture.jpg', 
        description: 'A gas giant, the largest planet in our solar system, and the fifth planet from the Sun.' 
    },
    saturn: { 
        name: 'Saturn', 
        texture: './textures/saturn_texture.jpg', 
        description: 'A gas giant, famous for its prominent rings and the sixth planet from the Sun.',
        rings: './textures/saturn_rings.png'
    },
    uranus: { 
        name: 'Uranus', 
        texture: './textures/uranus_texture.jpg', 
        description: 'An ice giant, the seventh planet from the Sun.' 
    },
    neptune: { 
        name: 'Neptune', 
        texture: './textures/neptune_texture.jpg', 
        description: 'The farthest planet from the Sun, another ice giant, and the eighth planet from the Sun.' 
    },
};

const textureLoader = new THREE.TextureLoader();

// Function to create a planet without rings
function createPlanet(texturePath) {
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: textureLoader.load(texturePath) });
    return new THREE.Mesh(geometry, material);
}

// Function to create Saturn with rings
function createSaturnWithRings() {
    const saturn = createPlanet(planets.saturn.texture);
    
    // Create the rings geometry and material
    const ringGeometry = new THREE.RingGeometry(2.5, 4.5, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load(planets.saturn.rings),
        side: THREE.DoubleSide,
        transparent: true,
    });
    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    
    // Add rings as a child of the planet and rotate them
    saturn.add(rings);
    rings.rotation.x = -0.5 * Math.PI; // Rotates the rings to be horizontal
    
    return saturn;
}


function init() {
    scene = new THREE.Scene();
    
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Initial Planet Creation (Earth is the default)
    currentPlanet = createPlanet(planets.earth.texture);
    scene.add(currentPlanet);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;

    window.addEventListener('resize', onWindowResize, false);
    
    document.querySelectorAll('.dropbtn').forEach(btn => {
        btn.addEventListener('click', toggleDropdown);
    });
    document.getElementById('terrestrial-planets').addEventListener('click', onPlanetSelect);
    document.getElementById('jovian-planets').addEventListener('click', onPlanetSelect);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function toggleDropdown(event) {
    const dropdownContent = event.target.nextElementSibling;
    dropdownContent.classList.toggle('show');
    
    document.querySelectorAll('.dropdown-content.show').forEach(openDropdown => {
        if (openDropdown !== dropdownContent) {
            openDropdown.classList.remove('show');
        }
    });
}

function onPlanetSelect(event) {
    const planetKey = event.target.dataset.planet;
    if (planetKey && planets[planetKey]) {
        document.querySelectorAll('.dropdown-content button').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        scene.remove(currentPlanet);
        
        document.getElementById('planet-title').textContent = planets[planetKey].name;
        document.getElementById('planet-description').textContent = planets[planetKey].description;

        if (planetKey === 'saturn') {
            currentPlanet = createSaturnWithRings();
        } else {
            currentPlanet = createPlanet(planets[planetKey].texture);
        }

        scene.add(currentPlanet);
        controls.reset();
        
        event.target.closest('.dropdown-content').classList.remove('show');
    }
}

init();