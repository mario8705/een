import * as THREE from 'three-full';

import Boat from './Boat';

class TestScene {
    constructor() {
        this.boat = new Boat();

        window.addEventListener('keydown', (evt) => {
          switch (evt.keyCode) {
            case 68:
              this.boat.turn("right");
              break;
            case 81:
              this.boat.turn("left");
              break;
            case 90:
              this.boat.moveForward();
              break;
          }
        });

        window.addEventListener('keyup', (evt) => {
          switch (evt.keyCode) {
            case 68:
              this.boat.stopTurning("right");
              break;
            case 81:
              this.boat.stopTurning("left");
              break;
            case 90:
              this.boat.stopMovingForward();
              break;
          }
        });
    }

    createCamera(aspect) {
        return this.camera = new THREE.PerspectiveCamera(60, aspect, 0.3, 1000.0);
    }

    loadIslands() {
        const islands = require('./islands');
        const loader = new THREE.GLTFLoader();
        this.islands = islands;

        for (const island of islands) {

        }
    }

    createScene(scene, renderer) {
        const loader = new THREE.GLTFLoader();
        this.boat.load(loader, scene, this.camera);

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        this.sunLight.position.set(50, 50, 50);
        scene.add(this.sunLight);

        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.1;
        this.sunLight.shadow.camera.far = this.camera.far;
       // sunLight.shadow.bias = 0.00039;
        this.sunLight.castShadow = true;

        scene.add(new THREE.AmbientLight(0x606060));

        const controls = new THREE.OrbitControls(this.camera, renderer.domElement);
        controls.enablePan = false;
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = (Math.PI / 2) - (Math.PI / 18);
        controls.minDistance = 100;
        controls.maxDistance = 300;
        this.sky = new THREE.Sky();
        scene.add(this.sky);
        this.sky.scale.addScalar(900);

        var waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );
        this. water = new THREE.Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load( 'assets/waternormals.jpg', function ( texture ) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                alpha: 1.0,
                sunDirection: this.sunLight.position.clone().normalize(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale:  3.7,
                fog: scene.fog !== undefined
            }
        );
        this.water.rotation.x = - Math.PI / 2;
        scene.add( this.water );

        this.water.position.set(0, 5.3, 0);
    }

    time = 0;

    update(tpf) {
        const uniforms = this.sky.material.uniforms;
        uniforms.turbidity.value = 10;
        uniforms.rayleigh.value = 2;
        uniforms.luminance.value = 1;
        uniforms.mieCoefficient.value = 0.005;
        uniforms.mieDirectionalG.value = 0.8;

        this.water.material.uniforms.time.value += 1.0 / 60.0;

        let inclination = this.time / 100;
        let azimuth = 0.25;

        const distance = 100;

        this.boat.update(this.time);

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
