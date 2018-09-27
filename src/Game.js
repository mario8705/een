import * as THREE from 'three-full';
import TestScene from './TestScene';

function createBox(scene, x, y, width, height, color) {
    const geom = new THREE.PlaneGeometry(width, height);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true });
    const plane = new THREE.Mesh(geom, mat);
    plane.position.set(x, y, 0);

    scene.add(plane);
}

function addButton(scene) {
    createBox(scene, 1280 / 2, 720 / 2 - 100, 200, 40, 0xFA8136);
    createBox(scene, 1280 / 2, 720 / 2 - 122, 200, 5, 0xC4652A);
}

class Game {
    constructor(width = 1280, height = 720) {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.autoClear = false;

        this.width = width;
        this.height = height;

        this.uiScene = new THREE.Scene();
        this.uiCamera = new THREE.OrthographicCamera(0, width, height, 0, 1, -1);

        const vertexShader = [
            "void main() {",
	        "vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);",
	        "gl_Position = projectionMatrix * modelViewPosition;",
            "}",
        ].join('\n');

        const fragmentShader = `
            uniform vec3 fillColor;
            uniform vec2 pos;
            uniform vec2 size;
            uniform float radius;
            
            float udRoundRect(vec2 p, vec2 b, float r) {
            	return length(max(abs(p) - b, 0.0)) - r;
            }
            void main() {
                float a = clamp(udRoundRect(gl_FragCoord.xy - pos, size - radius, radius), 0.0, 1.0);
                if (a >= 1.0) discard;
                gl_FragColor = mix(vec4(fillColor, 1.0), vec4(0.0), a);
            }
        `;

            const geom = new THREE.PlaneGeometry(width, height);
            const mat = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: {
                    "radius": { type: 'f', value: 20.0 },
                    "fillColor": { value: new THREE.Color(255, 255, 255) },
                    "pos": { value: new THREE.Vector2(1280 / 2, 720 / 2) },
                    "size": { value: new THREE.Vector2(200, 200) },
                },
                attributes: [],
                transparent: true,
            });
            

            const box = new THREE.Mesh(geom, mat);
            this.uiScene.add(box);
            box.position.set(width / 2, height / 2, 0);

            addButton(this.uiScene);


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

            this.renderer.clear();

            this.currentScene.update(tpf);
            this.renderer.render(this.scene, this.camera);
            this.renderer.render(this.uiScene, this.uiCamera);

            window.requestAnimationFrame(callRender);
        }

        callRender(0);
    }
}

export default Game;
