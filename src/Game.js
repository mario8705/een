import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';

class Game {
    constructor(width = 1280, height = 720) {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.3, 100.0);
        this.scene.add(this.camera);

        this.camera.position.set(0, 0, 30);

        // DEBUG
        this.renderer.setClearColor(0x336699, 1.0);

        document.getElementById('container').appendChild(this.renderer.domElement);

        this.init();
    }

    init() {
        const loader = new GLTFLoader();
        loader.load('assets/ship_light.gltf', object => this.scene.add(object.scene));

        var geometry = new THREE.CubeGeometry( 10, 10, 10 );
        var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
        var mesh = new THREE.Mesh( geometry, material );
        this.scene.add( mesh );
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
