import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import Sky from 'three-sky';
const OrbitControls = require('three-orbit-controls')(THREE);

class Game {
    constructor(width = 1280, height = 720) {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);

        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.3, 100.0);
        this.scene.add(this.camera);

        this.camera.position.set(0, 0, 30);

        const sky = new Sky();
        sky.scale.setScalar(80);
        this.scene.add(sky);

        // DEBUG
        this.renderer.setClearColor(0x336699, 1.0);

        document.getElementById('container').appendChild(this.renderer.domElement);

        this.init();
    }

    init() {
        const loader = new GLTFLoader();
        loader.load('assets/ship_light.gltf', object => this.scene.add(object.scene));

        var lumiere = new THREE.DirectionalLight( 0xffffff, 1.0 );
        lumiere.position.set( 50, 0, 100 );
        this.scene.add( lumiere );

        this.scene.add(new THREE.AmbientLight(0x606060));

        this.camera.rotateY(90);
        this.camera.position.set(30, 0, 0);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    run() {
        const callRender = timestamp => {
            this.renderer.render(this.scene, this.camera);

            window.requestAnimationFrame(callRender);
        }

        callRender(0);
    }

    render() {

    }
}

export default Game;
