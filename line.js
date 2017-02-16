import { settings } from './settings.js'

// Display lines representing vectors used for debugging
export default class Line {
  constructor(app, object, property, settingName, color) {
    this.app = app;
    this.object = object;
    this.property = property;
    this.settingName = settingName;

    var material = new THREE.LineBasicMaterial({color: color});
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 10, 0));

    this.line = new THREE.Line(geometry, material);
    this.app.scene.add(this.line);
  }

  update() {
    this.app.scene.remove(this.line);

    if (!settings[this.settingName]) { return; }

    var quaternion = new THREE.Quaternion();
    var up = new THREE.Vector3(0, 1, 0);
    var vel = this.object[this.property].clone();
    vel.normalize();
    quaternion.setFromUnitVectors(up, vel);
    this.line.quaternion.copy(quaternion);

    this.line.position.setFromMatrixPosition(this.object.object.matrixWorld);

    this.app.scene.add(this.line);
  }

  remove() {
    this.app.scene.remove(this.line);
  }
}
