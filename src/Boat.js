import * as THREE from 'three-full';

const _object = Symbol("object");
const _boat = Symbol("boat");
const _camera = Symbol("camera");
const _position = Symbol("position");
const _trajectoire = Symbol("trajectoire");
const _movingForward = Symbol("movingForward");
const _turning = Symbol("turning");

const SPEED = 0.3;
const PITCH = 0.08;
const ROLL = 0.08;
const YAW = 2;
const ROTATION = 0.1;
const MAX_PIVOT = Math.PI/12;
const PIVOT_SPEED = 0.60;

export default class Boat {
  constructor () {
    this[_position] = new THREE.Vector3();
    this[_movingForward] = false;
    this[_turning] = false;
  }

  get object () {
    return this[_object];
  }

  get trajectoire () {
      if (!this[_movingForward])
        return null;

      if(this[_object]) {
        const o = this[_object];

        let rotationY = o.rotation.y;

        const unitRotation = Math.PI / (180 / ROTATION);

        if (this[_turning]) {
          switch (this[_turning]) {
            case "right":
              rotationY -= unitRotation;
              break;
            case "left":
              rotationY += unitRotation;
              break;
          }
        }

        return new THREE.Vector3(SPEED * Math.sin(rotationY), 0, SPEED * Math.cos(rotationY));
      }
  }

  load (loader, scene, camera) {
    if (this[_object])
      throw Error("This boat has already been loaded.");

    loader.load('assets/bato.gltf', gltf => {
        gltf.scene.traverse(node => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        this[_boat] = gltf.scenes[0].children;

        this[_camera] = camera;
        this[_camera].position.set( 0, 75, 150 );

        this[_object] = new THREE.Object3D();
        this[_object].add(gltf.scene);
        this[_object].add(this[_camera]);

        scene.add(this[_object]);
    });
  }

  update (time) {
    const trajectoire = this.trajectoire;

    if (trajectoire)
      this[_position].sub(trajectoire);

    if (this[_object]) {
        this[_camera].lookAt(this[_object].position);

        let rotationX = Math.cos(time) * PITCH;
        let rotationY = this[_boat][0].rotation.y;
        let rotationZ = Math.cos(time) * ROLL;

        const currentRotationZDiff = this[_boat][0].rotation.z - rotationZ;

        if (this[_turning]) {
          const newRotationZDiff = Math.min(Math.abs(currentRotationZDiff) + (Math.PI / (1800 * PIVOT_SPEED)), MAX_PIVOT);

          switch (this[_turning]) {
            case "left":
              rotationZ += Math.abs(newRotationZDiff);
              break;
            case "right":
              rotationZ -= Math.abs(newRotationZDiff);
              break;
          }
        } else {
          const newRotationZDiff = Math.max(Math.abs(currentRotationZDiff) - (Math.PI / (1800 * PIVOT_SPEED)), 0);

          if (currentRotationZDiff > 0) {
            rotationZ += Math.abs(newRotationZDiff);
          } else if (currentRotationZDiff < 0) {
            rotationZ -= Math.abs(newRotationZDiff);
          }

        }


        for (let o of this[_boat]) {
            o.rotation.set(
              rotationX,
              rotationY,
              rotationZ
            );
        }

        this[_object].rotation.set(
          this[_object].rotation.x,
          trajectoire ? Math.atan2(trajectoire.x, trajectoire.z) : this[_object].rotation.y,
          this[_object].rotation.z
        );

        this[_object].position.set(
          this[_position].x,
          this[_position].y + Math.sin(time) * YAW + 1,
          this[_position].z
        );
    }
  }

  moveForward = () => {
    if(this[_object] && !this[_movingForward]) {
      this[_movingForward] = true;
    }
  }

  stopMovingForward = () => {
      if(this[_object] && !!this[_movingForward]) {
        this[_movingForward] = false;
      }
  }

  turn (side) {
    if(this[_object] && this[_turning] !== side) {
      this[_turning] = side;
    }
  }

  stopTurning (side) {
      if(this[_object] && this[_turning] === side) {
        this[_turning] = false;
      }
  }
}
