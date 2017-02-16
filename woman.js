export default class Woman {
  constructor(app) {
    this.app = app;
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
    }.bind(this));
  }
}
