import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';

let cameraCielo, sceneCielo, rendererCielo;
let skyCielo, sunCielo;
let sectionCielo;

initCielo();
animateCielo();

function initCielo() {
    sectionCielo = document.getElementById('cielo');
    if(!sectionCielo) return;

    const width = sectionCielo.clientWidth;
    const height = sectionCielo.clientHeight;

    cameraCielo = new THREE.PerspectiveCamera( 60, width / height, 100, 2000000 );
    cameraCielo.position.set( 0, 100, 2000 );

    sceneCielo = new THREE.Scene();

    rendererCielo = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    rendererCielo.setPixelRatio( window.devicePixelRatio );
    rendererCielo.setSize( width, height );
    rendererCielo.toneMapping = THREE.ACESFilmicToneMapping;
    rendererCielo.toneMappingExposure = 0.5;

    // Attach to section
    sectionCielo.appendChild( rendererCielo.domElement );

    const controls = new OrbitControls( cameraCielo, rendererCielo.domElement );
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    initSky();

    window.addEventListener( 'resize', onWindowResizeCielo );
}

function initSky() {
    skyCielo = new Sky();
    skyCielo.scale.setScalar( 450000 );
    sceneCielo.add( skyCielo );

    sunCielo = new THREE.Vector3();

    // Valores por defecto para un atardecer/cielo bonito
    const effectController = {
        turbidity: 10,
        rayleigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        elevation: 2, // Atardecer cálido
        azimuth: 180,
        exposure: rendererCielo.toneMappingExposure
    };

    const uniforms = skyCielo.material.uniforms;
    uniforms[ 'turbidity' ].value = effectController.turbidity;
    uniforms[ 'rayleigh' ].value = effectController.rayleigh;
    uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
    uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
    const theta = THREE.MathUtils.degToRad( effectController.azimuth );

    sunCielo.setFromSphericalCoords( 1, phi, theta );
    uniforms[ 'sunPosition' ].value.copy( sunCielo );
}

function onWindowResizeCielo() {
    if(!sectionCielo) return;
    const width = sectionCielo.clientWidth;
    const height = sectionCielo.clientHeight;

    cameraCielo.aspect = width / height;
    cameraCielo.updateProjectionMatrix();

    rendererCielo.setSize( width, height );
}

function animateCielo() {
    requestAnimationFrame( animateCielo );
    rendererCielo.render( sceneCielo, cameraCielo );
}