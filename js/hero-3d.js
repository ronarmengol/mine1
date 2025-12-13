document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero-3d-container');
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();

    // --- Camera Setup ---
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 10;
    camera.position.y = 1;

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x3b82f6, 1); // Primary Blue
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x8b5cf6, 1, 100); // Secondary Purple
    pointLight.position.set(-5, 0, 5);
    scene.add(pointLight);

    const accentLight = new THREE.PointLight(0x06b6d4, 0.8, 100); // Accent Cyan
    accentLight.position.set(0, -5, 5);
    scene.add(accentLight);

    // --- Object Creation: Deconstructed Phone ---
    const phoneGroup = new THREE.Group();

    // Materials
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x141419,
        shininess: 60,
        specular: 0x333333
    });
    const screenMaterial = new THREE.MeshPhongMaterial({
        color: 0x0a0a0c,
        emissive: 0x0a0a0c,
        shininess: 90,
        specular: 0xffffff
    });
    const uiMaterial = new THREE.MeshPhongMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    const uiAccentMaterial = new THREE.MeshPhongMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.9
    });

    // 1. Phone Body (Back)
    const bodyGeometry = new THREE.BoxGeometry(3, 6, 0.2);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    phoneGroup.add(body);

    // 2. Phone Screen (Middle)
    const screenGeometry = new THREE.BoxGeometry(2.8, 5.8, 0.05);
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.15;
    phoneGroup.add(screen);

    // 3. Floating UI Elements (Top)
    const uiGroup = new THREE.Group();

    // Header Bar
    const headerGeo = new THREE.BoxGeometry(2.4, 0.4, 0.05);
    const header = new THREE.Mesh(headerGeo, uiMaterial);
    header.position.set(0, 2.3, 0.5);
    uiGroup.add(header);

    // App Icons (Grid)
    const iconGeo = new THREE.BoxGeometry(0.5, 0.5, 0.05);
    for(let i=0; i<3; i++) {
        for(let j=0; j<2; j++) {
            const icon = new THREE.Mesh(iconGeo, uiAccentMaterial);
            icon.position.set((i-1)*0.8, 0.5 + (j-1)*0.8, 0.5 + (Math.random()*0.3));
            uiGroup.add(icon);
        }
    }

    // List Items (Bottom)
    const listGeo = new THREE.BoxGeometry(2.4, 0.3, 0.05);
    for(let i=0; i<3; i++) {
        const item = new THREE.Mesh(listGeo, uiMaterial);
        item.position.set(0, -1 - (i*0.5), 0.5 + (i*0.1));
        uiGroup.add(item);
    }

    phoneGroup.add(uiGroup);

    // Add floating particles/nodes around the phone
    const particleGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6 });
    const particleGroup = new THREE.Group();

    for(let i=0; i<20; i++) {
        const particle = new THREE.Mesh(particleGeo, particleMat);
        particle.position.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 4
        );
        particleGroup.add(particle);
    }
    phoneGroup.add(particleGroup);


    scene.add(phoneGroup);

    // Initial Rotation
    phoneGroup.rotation.y = -0.5;
    phoneGroup.rotation.x = 0.2;

    // --- Mouse Interaction State ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0.2;
    let targetRotationY = -0.5;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) / 2000; // Scale down
        mouseY = (event.clientY - windowHalfY) / 2000;

        targetRotationY = -0.5 + mouseX * 2; // Base rotation + mouse influence
        targetRotationX = 0.2 + mouseY * 2;
    });

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // Smooth rotation damping
        phoneGroup.rotation.y += (targetRotationY - phoneGroup.rotation.y) * 0.05;
        phoneGroup.rotation.x += (targetRotationX - phoneGroup.rotation.x) * 0.05;

        // Floating animation for the whole group
        phoneGroup.position.y = Math.sin(time) * 0.1;

        // "Breathing" / Layer separation animation
        uiGroup.position.z = Math.sin(time * 1.5) * 0.2; // Move UI elements back and forth relative to screen

        // Rotate particles slowly
        particleGroup.rotation.y = time * 0.1;
        particleGroup.rotation.z = time * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    // --- Resize Handler ---
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    });
});
