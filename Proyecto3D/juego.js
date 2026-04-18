import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const escena = new THREE.Scene();
escena.background = new THREE.Color(0xeeeeee);


const camara = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camara.position.set(0, 7, 18);

const render = new THREE.WebGLRenderer({ antialias: true });
render.setSize(window.innerWidth, window.innerHeight);
render.shadowMap.enabled = true;
render.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(render.domElement);

const controles = new OrbitControls(camara, render.domElement);
controles.target.set(0, 3.5, -4);
controles.enableDamping = true;
controles.dampingFactor = 0.05;


const luz_ambiente = new THREE.AmbientLight(0xffffff, 0.6);
escena.add(luz_ambiente);

const luz_direccional = new THREE.DirectionalLight(0xffffff, 0.8);
luz_direccional.position.set(5, 20, 10);
luz_direccional.castShadow = true;
luz_direccional.shadow.mapSize.width = 2048;
luz_direccional.shadow.mapSize.height = 2048;
luz_direccional.shadow.camera.near = 0.5;
luz_direccional.shadow.camera.far = 60;
luz_direccional.shadow.camera.left = -25;
luz_direccional.shadow.camera.right = 25;
luz_direccional.shadow.camera.top = 25;
luz_direccional.shadow.camera.bottom = -25;
escena.add(luz_direccional);

const luz_foco = new THREE.SpotLight(0xffffff, 0.6);
luz_foco.position.set(0, 15, 0);
luz_foco.angle = Math.PI / 3;
luz_foco.castShadow = true;
escena.add(luz_foco);


const radio_escenario = 25;


const g_base_piso = new THREE.CylinderGeometry(radio_escenario, radio_escenario, 0.2, 64);
const m_base_piso = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 1 });
const base_piso = new THREE.Mesh(g_base_piso, m_base_piso);
base_piso.position.set(0, -0.05, 0);
base_piso.receiveShadow = true;
escena.add(base_piso);


const grupo_piso = new THREE.Group();
const tamano_baldosa = 2;
const colores_piso = [0xdddddd, 0xdddddd, 0xdddddd, 0xdddddd, 0xdddddd, 0xdddddd, 0xeeeeee, 0xeeeeee, 0xff0000, 0x0000ff, 0xffff00];
const geometria_baldosa = new THREE.BoxGeometry(tamano_baldosa * 0.95, 0.1, tamano_baldosa * 0.95);

for (let x = -radio_escenario; x <= radio_escenario; x += tamano_baldosa) {
    for (let z = -radio_escenario; z <= radio_escenario; z += tamano_baldosa) {
        if (Math.sqrt(x * x + z * z) <= radio_escenario) {
            const color_aleatorio = colores_piso[Math.floor(Math.random() * colores_piso.length)];
            const material_baldosa = new THREE.MeshStandardMaterial({ color: color_aleatorio, roughness: 0.9 });
            const baldosa = new THREE.Mesh(geometria_baldosa, material_baldosa);
            baldosa.position.set(x, 0.05, z);
            baldosa.receiveShadow = true;
            grupo_piso.add(baldosa);
        }
    }
}
escena.add(grupo_piso);


const material_pared_abajo = new THREE.MeshStandardMaterial({ color: 0xcccccc, side: THREE.BackSide, roughness: 0.7 });
const geometria_pared_abajo = new THREE.CylinderGeometry(radio_escenario, radio_escenario, 10, 64, 1, true);
const pared_abajo = new THREE.Mesh(geometria_pared_abajo, material_pared_abajo);
pared_abajo.position.set(0, 5, 0);
pared_abajo.receiveShadow = true;
escena.add(pared_abajo);

const material_pared_arriba = new THREE.MeshStandardMaterial({ color: 0xdd1111, side: THREE.BackSide, roughness: 0.7 });
const geometria_pared_arriba = new THREE.CylinderGeometry(radio_escenario, radio_escenario, 6, 64, 1, true);
const pared_arriba = new THREE.Mesh(geometria_pared_arriba, material_pared_arriba);
pared_arriba.position.set(0, 13, 0);
pared_arriba.receiveShadow = true;
escena.add(pared_arriba);


const colores_letreros = [
    0x3366ff,
    0xffff00,
    0x22cc44,
    0xffff00
];

const radio_objetos = radio_escenario - 2.5;

for (let i = 0; i < 12; i++) {
    const es_arco = (i % 3 === 0);
    const angulo = (i / 12) * Math.PI * 2;

    if (es_arco) {
        let indice_arco = i / 3;
        const color_arco = colores_letreros[indice_arco];

        const grupo_arco = new THREE.Group();

        const material_puerta = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.6 });
        const puerta_abajo = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 1), material_puerta);
        puerta_abajo.position.set(0, 3, 0);
        puerta_abajo.receiveShadow = true;
        grupo_arco.add(puerta_abajo);

        const geometria_puerta_arriba = new THREE.CylinderGeometry(4, 4, 1, 32);
        const puerta_arriba = new THREE.Mesh(geometria_puerta_arriba, material_puerta);
        puerta_arriba.rotation.x = Math.PI / 2;
        puerta_arriba.position.set(0, 6, 0);
        puerta_arriba.receiveShadow = true;
        grupo_arco.add(puerta_arriba);

        for (let j = 0; j < 5; j++) {
            const color_izquierdo = j % 2 === 0 ? 0xff0000 : 0xffff00;
            const color_derecho = j % 2 === 0 ? 0x0000ff : 0xffff00;

            const bloque_izquierdo = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 3), new THREE.MeshStandardMaterial({ color: color_izquierdo }));
            bloque_izquierdo.position.set(-5.5, 1 + (j * 2), 0.5);
            bloque_izquierdo.castShadow = true;
            grupo_arco.add(bloque_izquierdo);

            const bloque_derecho = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 3), new THREE.MeshStandardMaterial({ color: color_derecho }));
            bloque_derecho.position.set(5.5, 1 + (j * 2), 0.5);
            bloque_derecho.castShadow = true;
            grupo_arco.add(bloque_derecho);
        }

        const viga_superior = new THREE.Mesh(new THREE.BoxGeometry(14, 4, 3), new THREE.MeshStandardMaterial({ color: 0xdd1111 }));
        viga_superior.position.set(0, 11, 0.5);
        viga_superior.castShadow = true;
        grupo_arco.add(viga_superior);

        const cartel_letrero = new THREE.Mesh(new THREE.BoxGeometry(7, 3, 0.5), new THREE.MeshStandardMaterial({ color: color_arco }));
        cartel_letrero.position.set(0, 11, 2.1);
        cartel_letrero.castShadow = true;
        grupo_arco.add(cartel_letrero);

        grupo_arco.position.set(Math.cos(angulo) * radio_objetos, 0, Math.sin(angulo) * radio_objetos);
        grupo_arco.lookAt(0, 0, 0);
        escena.add(grupo_arco);

    } else {
        const grupo_pilar = new THREE.Group();
        const colores_columna = [0xff0000, 0x0000ff, 0xffff00, 0x00ff00];

        for (let j = 0; j < 7; j++) {
            const material_columna = new THREE.MeshStandardMaterial({ color: colores_columna[(j + i) % colores_columna.length] });
            const bloque_columna = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), material_columna);
            bloque_columna.position.set(0, 1 + (j * 2), 0);
            bloque_columna.castShadow = true;
            bloque_columna.receiveShadow = true;
            grupo_pilar.add(bloque_columna);
        }
        grupo_pilar.position.set(Math.cos(angulo) * radio_objetos, 0, Math.sin(angulo) * radio_objetos);
        grupo_pilar.lookAt(0, 0, 0);
        escena.add(grupo_pilar);
    }
}


const grupo_plataforma = new THREE.Group();
grupo_plataforma.position.set(0, 0, -4);

const geometria_plataforma = new THREE.CylinderGeometry(9, 9, 0.6, 64);
const material_plataforma = new THREE.MeshStandardMaterial({ color: 0x111111 });
const plataforma = new THREE.Mesh(geometria_plataforma, material_plataforma);
plataforma.position.set(0, 0.3, 0);
plataforma.receiveShadow = true;
plataforma.castShadow = true;
grupo_plataforma.add(plataforma);

const geometria_tope_plataforma = new THREE.CylinderGeometry(8.5, 8.5, 0.2, 64);
const material_tope_plataforma = new THREE.MeshStandardMaterial({ color: 0xffffff });
const tope_plataforma = new THREE.Mesh(geometria_tope_plataforma, material_tope_plataforma);
tope_plataforma.position.set(0, 0.7, 0);
tope_plataforma.receiveShadow = true;
grupo_plataforma.add(tope_plataforma);

const material_madera = new THREE.MeshStandardMaterial({ color: 0xcdaa7d, roughness: 0.9 });
const posiciones_madera = [
    [-3, 1.8, 1],
    [0, 1.8, 2],
    [3, 1.8, 0.5],
    [-0.5, 1.8, -2],
    [-0.5, 3.8, -2],
    [2, 3.8, -1.5]
];

posiciones_madera.forEach(posicion => {
    const caja_madera = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), material_madera);
    caja_madera.position.set(posicion[0], posicion[1], posicion[2]);
    caja_madera.rotation.y = (Math.random() - 0.5) * 0.5;
    caja_madera.castShadow = true;
    caja_madera.receiveShadow = true;
    grupo_plataforma.add(caja_madera);
});

const soporte_info = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2, 16), new THREE.MeshStandardMaterial({ color: 0x111111 }));
soporte_info.position.set(0, 1.5, 5);
grupo_plataforma.add(soporte_info);

const pizarra_info = new THREE.Mesh(new THREE.BoxGeometry(3, 1.5, 0.2), new THREE.MeshStandardMaterial({ color: 0x55ccff }));
pizarra_info.position.set(0, 2.5, 5);
pizarra_info.rotation.x = -Math.PI / 6;
grupo_plataforma.add(pizarra_info);

escena.add(grupo_plataforma);


const material_riel = new THREE.MeshStandardMaterial({ color: 0xbd10e0 });
const radio_riel = 16;
const altura_riel = 11;
const geometria_riel = new THREE.TorusGeometry(radio_riel, 0.3, 16, 100);
const riel = new THREE.Mesh(geometria_riel, material_riel);
riel.rotation.x = Math.PI / 2;
riel.position.set(0, altura_riel, 0);
riel.castShadow = true;
escena.add(riel);

for (let i = 0; i < 16; i++) {
    const angulo = (i / 16) * Math.PI * 2;
    const x = Math.cos(angulo) * radio_riel;
    const z = Math.sin(angulo) * radio_riel;

    const soporte = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4, 8), new THREE.MeshStandardMaterial({ color: 0x333333 }));
    soporte.position.set(x, altura_riel + 2, z);
    escena.add(soporte);
}


const material_caja_juguete_blanca = new THREE.MeshStandardMaterial({ color: 0xffffff });
const material_caja_juguete_roja = new THREE.MeshStandardMaterial({ color: 0xee4444 });

const caja_juguete_1 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 5, 2), material_caja_juguete_blanca);
caja_juguete_1.position.set(-8, 2.5, 1);
caja_juguete_1.rotation.y = Math.PI / 6;
caja_juguete_1.castShadow = true;
escena.add(caja_juguete_1);

const caja_juguete_2 = new THREE.Mesh(new THREE.BoxGeometry(3, 5.5, 2), material_caja_juguete_roja);
caja_juguete_2.position.set(10, 1.5, 1);
caja_juguete_2.rotation.y = -Math.PI / 4;
caja_juguete_2.rotation.x = -Math.PI / 2.3;
caja_juguete_2.castShadow = true;
escena.add(caja_juguete_2);

function animar() {
    controles.update();
    render.render(escena, camara);
}

render.setAnimationLoop(animar);

window.addEventListener('resize', () => {
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();
    render.setSize(window.innerWidth, window.innerHeight);
});
