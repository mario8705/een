import * as THREE from 'three-full';
import Input from './Input';

class IslandScene {
    constructor() {
        this.playerPosition = new THREE.Vector3(0.0, 0.0, 0.0);
    }

    createCamera(aspect) {
        return this.camera = new THREE.PerspectiveCamera(60, aspect, 0.3, 1000.0);
    }

    createScene(scene, renderer) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.playerObj = new THREE.Object3D();

        const loader = new THREE.GLTFLoader();
        loader.load('assets/pirate_officer.gltf', gltf => {
            for (let obj of gltf.scene.children) {
                this.playerObj.add(obj);
            }

            scene.add(gltf.scene);
        });

        this.playerObj.position.set(0, 10, 0);
        scene.add(this.playerObj);

        this.createMap(scene);

        this.sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        this.sunLight.position.set(50, 50, 50);
        scene.add(this.sunLight);

        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.1;
        this.sunLight.shadow.camera.far = this.camera.far;
       // sunLight.shadow.bias = 0.00039;
        this.sunLight.castShadow = true;

        scene.add(new THREE.AmbientLight(1 ? 0xffffff : 0x606060));

        
        this.sky = new THREE.Sky();
        scene.add(this.sky);
        this.sky.scale.addScalar(900);

        const waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );
        this.water = new THREE.Water(
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

        this.water.position.set(0, 5.5, 0);

        this.camera.position.set(0, 10, 10);
        this.camera.rotation.set(0, 0, 0);
    }

    time = 0;

    update(tpf) {
        const uniforms = this.sky.material.uniforms;
        uniforms.turbidity.value = 10;
        uniforms.rayleigh.value = 2;
        uniforms.luminance.value = 1;
        uniforms.mieCoefficient.value = 0.005;
        uniforms.mieDirectionalG.value = 0.8;

        this.water.material.uniforms.time.value += tpf;

        let inclination = this.time / 100;
        let azimuth = 0.25;

        const distance = 100;

        const theta = Math.PI * ( inclination - 0.5 );
        const phi = 2 * Math.PI * ( azimuth - 0.5 );
        this.sunLight.position.x = distance * Math.cos( phi );
        this.sunLight.position.y = distance * Math.sin( phi ) * Math.sin( theta );
        this.sunLight.position.z = distance * Math.sin( phi ) * Math.cos( theta );
        uniforms.sunPosition.value.copy( this.sunLight.position );

       // this.camera.position.set()
  //      this.camera.lookAt(this.playerObj.position);

        this.time += tpf;

        if (Input.getKeyDown('q')) {
            this.playerPosition.x -= tpf * 10;
        }

        if (Input.getKeyDown('d')) {
            this.playerPosition.x += tpf * 10;
        }

        if (Input.getKeyDown('a')) {
            this.playerPosition.y -= tpf * 10
        }

        if (Input.getKeyDown('e')) {
            this.playerPosition.y += tpf * 10
        }

        if (Input.getKeyDown('z')) {
            this.playerPosition.z -= tpf * 10
        }

        if (Input.getKeyDown('s')) {
            this.playerPosition.z += tpf * 10
        }

        this.camera.position.set(this.playerPosition.x, this.playerPosition.y + 1.68, this.playerPosition.z);
    }

    createMap(scene) {
        const geom = new THREE.BoxGeometry(10, 1, 10);
        const mat = new THREE.MeshLambertMaterial({ color: 0x336699 });
        let ground;
        scene.add(ground = new THREE.Mesh(geom, mat));
        ground.position.set(0, 9, 0);
    }
}

export default IslandScene;
