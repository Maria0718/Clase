import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer, controls, globe, heroSection;

init();
animate();

function init() {
    heroSection = document.getElementById( 'Hero' );
    const width = heroSection.clientWidth || window.innerWidth;
    const height = heroSection.clientHeight || window.innerHeight;

    camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 100 );
    camera.position.set( 0, 0, 5 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );

    
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.3 );
    scene.add( ambientLight );

    const pointLight = new THREE.PointLight( 0x4db2ff, 2, 50 ); // Azul neón
    pointLight.position.set( 5, 3, 5 );
    scene.add( pointLight );

    const pointLight2 = new THREE.PointLight( 0xbc490b, 2, 50 ); // Naranja neón
    pointLight2.position.set( -5, -3, -5 );
    scene.add( pointLight2 );

    
    const sphereGeometry = new THREE.SphereGeometry( 1.5, 32, 32 );
    
    
    const globeMaterial = new THREE.MeshStandardMaterial( { 
        color: 0x111111,
        roughness: 0.2,
        metalness: 0.8
    } );
    globe = new THREE.Mesh( sphereGeometry, globeMaterial );
    scene.add( globe );

    
    const wireframeMaterial = new THREE.MeshBasicMaterial( {
        color: 0x4db2ff,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    } );
    const atmosphere = new THREE.Mesh( sphereGeometry, wireframeMaterial );
    atmosphere.scale.setScalar( 1.05 );
    globe.add( atmosphere ); 

    
    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );
    
    heroSection.appendChild( renderer.domElement );

    
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.autoRotate = true; 
    controls.autoRotateSpeed = 1.0;
    controls.enableZoom = false; 
    controls.enablePan = false;

    
    window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
    if ( !heroSection ) return;
    const width = heroSection.clientWidth;
    const height = heroSection.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );
}

function animate() {
    requestAnimationFrame( animate );

    controls.update(); 
    renderer.render( scene, camera );
}