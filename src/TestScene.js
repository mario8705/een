import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import Sky from 'three-sky';
const OrbitControls = require('three-orbit-controls')(THREE);

class TestScene {
    createCamera(aspect) {
        return this.camera = new THREE.PerspectiveCamera(60, aspect, 0.3, 1000.0);
    }

    createScene(scene, renderer) {
        const loader = new GLTFLoader();
        loader.load('assets/ship_light.gltf', gltf => {
            gltf.scene.traverse(node => {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            scene.add(gltf.scene);
        });

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        var sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        sunLight.position.set(50, 50, 50);
        scene.add(sunLight);

        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 3;
        sunLight.shadow.camera.far = this.camera.far;
       // sunLight.shadow.bias = 0.00039;
        sunLight.castShadow = true;

        scene.add(new THREE.AmbientLight(0x606060));

        this.camera.rotateY(90);
        this.camera.position.set(30, 0, 0);

        const controls = new OrbitControls(this.camera, renderer.domElement);
        controls.enablePan = false;
    }

    update(tpf) {

    }
}

export default TestScene;
