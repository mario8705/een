import * as THREE from 'three';
import TestScene from './TestScene';

class Game {
    constructor(width = 1280, height = 720) {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);


        this.width = width;
        this.height = height;

        this.scene = new THREE.Scene();

        // DEBUG
        this.renderer.setClearColor(0x336699, 1.0);

        document.getElementById('container').appendChild(this.renderer.domElement);

        this.init();
    }

    loadScene(currentScene) {
        this.currentScene = currentScene;
        this.camera = currentScene.createCamera(this.width / this.height);
        this.scene = new THREE.Scene();
        this.scene.add(this.camera);
        

        currentScene.createScene(this.scene, this.renderer);
    }

    init() {
        this.loadScene(new TestScene());
    }

    run() {
        let lastFrameTime = 0;

        const callRender = timestamp => {
            const tpf = (timestamp - lastFrameTime) / 1000.0;
            lastFrameTime = timestamp;

            this.currentScene.update(tpf);
            this.renderer.render(this.scene, this.camera);

            window.requestAnimationFrame(callRender);
        }

        callRender(0);
    }
}

export default Game;
