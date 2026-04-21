import * as THREE from 'three';

function initFace(containerId, mood) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a0d0a); // Fondo oscuro rojizo/marrón

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(2, 5, 3);
    scene.add(dirLight);

    
    let color = 0xffcc00; 
    if (mood === 'sad') color = 0x4a90e2; 
    if (mood === 'angry') color = 0xe74c3c; 

    
    const headGroup = new THREE.Group();
    scene.add(headGroup);

    
    const headGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const headMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.3, metalness: 0.2 });
    const head = new THREE.Mesh(headGeo, headMat);
    headGroup.add(head);

    
    const featureMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });

    
    const eyeGeo = new THREE.SphereGeometry(0.2, 16, 16);
    
    const leftEye = new THREE.Mesh(eyeGeo, featureMat);
    leftEye.position.set(-0.6, 0.4, 1.3);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, featureMat);
    rightEye.position.set(0.6, 0.4, 1.3);
    headGroup.add(rightEye);

    
    if (mood === 'angry') {
        const browGeo = new THREE.BoxGeometry(0.7, 0.15, 0.1);
        
        const leftBrow = new THREE.Mesh(browGeo, featureMat);
        leftBrow.position.set(-0.6, 0.8, 1.35);
        leftBrow.rotation.z = -0.3; 
        headGroup.add(leftBrow);

        const rightBrow = new THREE.Mesh(browGeo, featureMat);
        rightBrow.position.set(0.6, 0.8, 1.35);
        rightBrow.rotation.z = 0.3;
        headGroup.add(rightBrow);
    }

    
    if (mood === 'sad') {
        const tearGeo = new THREE.ConeGeometry(0.1, 0.3, 16);
        const tearMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.8 });
        
        const leftTear = new THREE.Mesh(tearGeo, tearMat);
        leftTear.position.set(-0.6, -0.1, 1.4);
        leftTear.rotation.x = Math.PI/2;
        headGroup.add(leftTear);
        
        const rightTear = new THREE.Mesh(tearGeo, tearMat);
        rightTear.position.set(0.6, -0.1, 1.4);
        rightTear.rotation.x = Math.PI/2;
        headGroup.add(rightTear);
    }

    
    const mouthGeo = new THREE.TorusGeometry(0.5, 0.1, 16, 32, Math.PI);
    const mouth = new THREE.Mesh(mouthGeo, featureMat);
    
    if (mood === 'happy') {
        mouth.position.set(0, -0.2, 1.4);
        mouth.rotation.x = Math.PI; 
        mouth.rotation.y = 0;
        mouth.scale.set(1, 1, 1.5);
    } else {
        
        mouth.position.set(0, -0.6, 1.38);
        mouth.scale.set(1, 0.8, 1);
    }
    headGroup.add(mouth);

    return { scene, camera, renderer, headGroup };
}


const cards = [];


setTimeout(() => {
    const happy = initFace('face-happy', 'happy');
    const sad = initFace('face-sad', 'sad');
    const angry = initFace('face-angry', 'angry');

    if(happy) cards.push(happy);
    if(sad) cards.push(sad);
    if(angry) cards.push(angry);

    animate();
}, 100);

function animate() {
    requestAnimationFrame(animate);
    
   
    cards.forEach(card => {
        card.headGroup.rotation.y += 0.01;
        
        
        card.headGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        card.headGroup.rotation.z = Math.cos(Date.now() * 0.001) * 0.05;

        card.renderer.render(card.scene, card.camera);
    });
}


window.addEventListener('resize', () => {
    cards.forEach(card => {
        const container = card.renderer.domElement.parentElement;
        const w = container.clientWidth;
        const h = container.clientHeight;
        card.camera.aspect = w / h;
        card.camera.updateProjectionMatrix();
        card.renderer.setSize(w, h);
    });
});
