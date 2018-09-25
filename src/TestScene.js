import * as THREE from 'three-full';

class TestScene {
    createCamera(aspect) {
        return this.camera = new THREE.PerspectiveCamera(60, aspect, 0.3, 1000.0);
    }

    createScene(scene, renderer) {
        const loader = new THREE.GLTFLoader();
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

        this.sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        this.sunLight.position.set(50, 50, 50);
        scene.add(this.sunLight);

        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 3;
        this.sunLight.shadow.camera.far = this.camera.far;
       // sunLight.shadow.bias = 0.00039;
        this.sunLight.castShadow = true;

        scene.add(new THREE.AmbientLight(0x606060));

        this.camera.rotateY(90);
        this.camera.position.set(30, 0, 0);

        const controls = new THREE.OrbitControls(this.camera, renderer.domElement);
        controls.enablePan = false;
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI / 2;
        controls.minDistance = 10;
        controls.maxDistance = 45;
        this.sky = new Sky();
        scene.add(this.sky);
        this.sky.scale.addScalar(90);

        // const water = new THREE.Ocean();

    }

    time = 0;

    update(tpf) {
        const uniforms = this.sky.material.uniforms;
        uniforms.turbidity.value = 10;
        uniforms.rayleigh.value = 2;
        uniforms.luminance.value = 1;
        uniforms.mieCoefficient.value = 0.005;
        uniforms.mieDirectionalG.value = 0.8;

        let inclination = this.time / 100;
        let azimuth = 0.25;

        const distance = 100;

        const theta = Math.PI * ( inclination - 0.5 );
        const phi = 2 * Math.PI * ( azimuth - 0.5 );
        this.sunLight.position.x = distance * Math.cos( phi );
        this.sunLight.position.y = distance * Math.sin( phi ) * Math.sin( theta );
        this.sunLight.position.z = distance * Math.sin( phi ) * Math.cos( theta );
        uniforms.sunPosition.value.copy( this.sunLight.position );

        this.time += tpf;
    }
}

export default TestScene;
