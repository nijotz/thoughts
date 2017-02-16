import { settings } from './settings.js'

export default class Woman {
  constructor(app) {
    this.app = app;
    this.loaded = false;

    var manager = new THREE.LoadingManager();
    var loader = new THREE.OBJLoader(manager);
    loader.load('woman.obj', function(object) {
      object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          var material = new THREE.MeshLambertMaterial({color: 0x333333});
          child.material = material;
        }
      });
      object.scale.set(20, 20, 20);
      object.rotateY(-Math.PI * 33 / 180);

      this.app.scene.add(object);
      this.object = object;
      this.loaded = true;
    }.bind(this));
  }

  update() {
    if (!this.loaded) { return; }

    this.app.scene.remove(this.object);
    if (settings.displayHead) {
      this.app.scene.add(this.object);
    }
  }
}
