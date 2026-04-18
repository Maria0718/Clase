class Entidad {
    constructor(nombre, hpMaximo) {
        this.nombre = nombre;
        this.hpMaximo = hpMaximo;
        this.hpActual = hpMaximo;
    }

    estaVivo() {
        return this.hpActual > 0;
    }

    recibirDano(cantidad) {
        this.hpActual -= cantidad;
        if (this.hpActual < 0) this.hpActual = 0;
    }

    curar() {
        this.hpActual = this.hpMaximo;
    }
}

class Calculadora {
    constructor() {

        this.jugador = new Entidad("Aether", 100);
        this.enemigosDerrotados = 0;
        this.ronda = 1;
        this.enemigoActual = this.generarEnemigo();
    }

    generarEnemigo() {
        const tipos = ["Xiao", "Dottore", "Rosalia", "Celestia", "Rey sombra"];
        const nombre = tipos[Math.floor(Math.random() * tipos.length)];

        const hp = Math.floor(Math.random() * 31) + 30;
        return new Entidad(nombre, hp);
    }


    calcularAtaque(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    jugarRonda() {
        console.log(`\n${this.ronda} Round... FIGTH!!! `);
        console.log(`${this.jugador.nombre} [vida: ${this.jugador.hpActual}/${this.jugador.hpMaximo}] vs ${this.enemigoActual.nombre} [vida: ${this.enemigoActual.hpActual}/${this.enemigoActual.hpMaximo}]`);


        const danoJugador = this.calcularAtaque(15, 30);
        this.enemigoActual.recibirDano(danoJugador);
        console.log(`Atacas a ${this.enemigoActual.nombre} y le haces ${danoJugador} de daño.`);


        if (!this.enemigoActual.estaVivo()) {
            this.enemigosDerrotados++;
            console.log(`Derrotaste a ${this.enemigoActual.nombre}! (Total derrotados: ${this.enemigosDerrotados})`);


            this.enemigoActual = this.generarEnemigo();
            console.log(`Un nuevo malo aparecio: ${this.enemigoActual.nombre} con ${this.enemigoActual.hpMaximo} de vida`);
            this.ronda++;
            return;
        }


        const danoEnemigo = this.calcularAtaque(5, 20);
        this.jugador.recibirDano(danoEnemigo);
        console.log(`${this.enemigoActual.nombre} ataca y te hace ${danoEnemigo} de daño.`);


        if (!this.jugador.estaVivo()) {
            console.log(`\nUps, te moriste `);
            console.log(`Yei sobreviviste ${this.ronda} rondas y derrotaste a ${this.enemigosDerrotados} enemigos.`);
            this.reiniciarJuego();
            return;
        }

        this.ronda++;
    }

    reiniciarJuego() {
        console.log("\nReiniciando el juego...");
        this.jugador.curar();
        this.enemigosDerrotados = 0;
        this.ronda = 1;
        this.enemigoActual = this.generarEnemigo();
        console.log(`Una nueva partida ha comenzado. Aparece ${this.enemigoActual.nombre}`);
    }


    simular(cantidadRondas) {
        console.log("Inicio de la simulacion ");
        for (let i = 0; i < cantidadRondas; i++) {
            this.jugarRonda();
        }
        console.log("\nFin de la simulacion ");
        console.log(`Estadisticas: vida: ${this.jugador.hpActual} | Enemigos eliminados: ${this.enemigosDerrotados}`);
    }
}


const juego = new Calculadora();

const btnIniciar = document.getElementById('btnIniciar');


btnIniciar.addEventListener('click', () => {
    juego.jugarRonda();
});
