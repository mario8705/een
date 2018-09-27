import * as THREE from 'three-full';

function key_down(event){
    var Z = 87;
    var S = 83;
    var Q = 65;
    var D = 68;
    var minus = 189;
    var plus = 187;

    var k = event.keyCode;
    console.log(k);
    if(k == Q){
        playerIsRotatingLeft = 1;
    }
    if(k == D){
        playerIsRotatingRight = 1;
    }
    if(k == Z){
        playerIsMovingForward = 1;
    }
    if(k == S){
        playerIsMovingBackwards = 1;
    }
}
function moveForward(speed){
    var delta_x = speed * Math.cos(playerDirection);
    var delta_z = speed * Math.sin(playerDirection);
    var new_x = camera.position.x + delta_x;
    var new_z = camera.position.z + delta_z;
    camera.position.x = new_x;
    camera.position.z = new_z;

    var new_dx = dVector.x + delta_x;
    var new_dz = dVector.z + delta_z;
    dVector.x = new_dx;
    dVector.z = new_dz;
    camera.lookAt( dVector );

}
function setPlayerDirection(){

    var delta_x = playerSpeed * Math.cos(playerDirection);
    var delta_z = playerSpeed * Math.sin(playerDirection);

    var new_dx = camera.position.x + delta_x;
    var new_dz = camera.position.z + delta_z;
    dVector.x = new_dx;
    dVector.z = new_dz;
    console.log(dVector);
    camera.lookAt( dVector );
}
