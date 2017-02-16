import { settings } from './settings.js'
import Line from './line.js'

export default class Butterfly {
  constructor(app) {
    this.app = app;
    this.createMesh();
    var rand = function() { return -Math.random() + 0.5 };
    this.velocity = new THREE.Vector3(rand(), rand(), rand()).normalize();
    this.targetHeading = new THREE.Vector3(rand(), rand(), rand()).normalize();
    this.object.position.set(0, 0, 0);
    this.phase = Math.random();
    this.flapAngle = Math.sin(Math.PI) * (Math.PI / 2);

    this.velocityLine = new Line(this.app, this, 'velocity', 'displayVelocity', 0x00ff00);
    this.targetLine = new Line(this.app, this, 'targetHeading', 'displayTarget', 0xff0000);
  }

  remove() {
    this.app.scene.remove(this.object);
    this.velocityLine.remove();
    this.targetLine.remove();
  }

  rotate(rotQuat) {
    // rotate velocity vector
    this.velocity.applyQuaternion(rotQuat);
    this.velocity.normalize();

    // rotate model to face velocity
    var up = new THREE.Vector3(0, 1, 0);  // The model was made facing up
    var quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(up, this.velocity);
    //this.object.rotation = null;
    this.object.quaternion.copy(quaternion.clone());
  }

  updateTargetHeading() {
    if (!settings.updateTarget) { return; }

    // Random change
    var rand = function() { return (-Math.random() + 0.5) / 1.0 };
    this.targetHeading.add(new THREE.Vector3(rand(), rand(), rand()));
    this.targetHeading.normalize();

    // Rotate slightly towards center
    var center = this.object.position.clone();
    center.multiplyScalar(-1);
    center.normalize();
    var unit = new THREE.Quaternion();
    unit.setFromUnitVectors(center, center);
    var centerRot = new THREE.Quaternion();
    centerRot.setFromUnitVectors(this.targetHeading, center);
    unit.slerp(centerRot, 0.025);
    this.targetHeading.applyQuaternion(unit);
  }

  update() {
    this.velocityLine.update();
    this.targetLine.update();

    this.updateTargetHeading();

    // move
    this.velocity.normalize();
    this.velocity.multiplyScalar(0.5);  // Set the "speed"
    this.object.position.add(this.velocity);
    this.velocity.normalize();

    // flap
    this.flap();

    // calculate turn angle to target heading
    var rotQuat = new THREE.Quaternion();
    var axis = new THREE.Vector3()
    axis.crossVectors(this.velocity, this.targetHeading);
    rotQuat.setFromAxisAngle(axis, 0.05);

    // rotate
    this.rotate(rotQuat);
  }

  flap() {
    if (!settings.flap) { return; }
    var oldAngle = this.flapAngle;

    this.phase = (this.phase + 0.3) % (Math.PI * 2);
    this.flapAngle = Math.sin(this.phase) * ((Math.PI / 2) - 0.1);

    var angleDelta = this.flapAngle - oldAngle;

    var leftQuat = new THREE.Quaternion();
    var rghtQuat = new THREE.Quaternion();
    leftQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -angleDelta)
    rghtQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0),  angleDelta)

    var geom = this.object.geometry;

    var verts = geom.vertices;
    verts[4].applyQuaternion(leftQuat);  // top_left
    verts[5].applyQuaternion(leftQuat);  // mid_left
    verts[6].applyQuaternion(leftQuat);  // bot_left
    verts[7].applyQuaternion(rghtQuat);  // top_rght
    verts[8].applyQuaternion(rghtQuat);  // mid_rght
    verts[9].applyQuaternion(rghtQuat);  // bot_rght
    geom.verticesNeedUpdate = true;
  }

  createMesh() {
    // Body mesh
    var geometry = new THREE.Geometry();
    var material = new THREE.MeshLambertMaterial( { color: 0xff69b4 } );

    var front_normal = new THREE.Vector3(0, 0, 1);
    var back_normal = new THREE.Vector3(0, 0, -1);
    var v1, v2, v3;

    function v( x, y, z ) {
      geometry.vertices.push( new THREE.Vector3( x, y, z ) );
    }

    function f( a, b, c ) {
      geometry.faces.push( new THREE.Face3( a, b, c ) );
    }

    v(  0.0,  1.5, -0.000001); var head_frn = 0;
    v(  0.0,  1.5,  0.000001); var head_bak = 1;
    v(  0.0, -1.5, -0.000001); var tail_frn = 2;
    v(  0.0, -1.5,  0.000001); var tail_bak = 3;

    v( -4.2,  3.0,  0.0);      var top_left = 4;
    v( -3.2, -0.5,  0.0);      var mid_left = 5;
    v( -3.7, -2.5,  0.0);      var bot_left = 6;
    v(  4.2,  3.0,  0.0);      var top_rght = 7;
    v(  3.2, -0.5,  0.0);      var mid_rght = 8;
    v(  3.7, -2.5,  0.0);      var bot_rght = 9;

    // Back left wing
    f( head_bak, top_left, mid_left );
    f( head_bak, mid_left, tail_bak );
    f( tail_bak, mid_left, bot_left );

    // Back right wing
    f( head_bak, mid_rght, top_rght );
    f( head_bak, tail_bak, mid_rght );
    f( tail_bak, bot_rght, mid_rght );

    // Front left wing
    f( head_frn, top_left, mid_left );
    f( head_frn, mid_left, tail_frn );
    f( tail_frn, mid_left, bot_left );

    // Front right wing
    f( head_frn, top_rght, mid_rght );
    f( head_frn, mid_rght, tail_frn );
    f( tail_frn, mid_rght, bot_rght );

    geometry.computeFaceNormals();  // so the light knows how to hit the faces
    geometry.dynamic = true;  // allows flapping

    this.object = new THREE.Mesh(geometry, material);
    this.app.scene.add(this.object);
  }
}
