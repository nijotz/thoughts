// http://park.org/Canada/Museum/insects/evolution/navigation.html
import Butterfly from './butterfly.js'
import { initGui, settings } from './settings.js'
import Woman from './woman.js'

class App {
  constructor() {
    this.canvas = document.getElementById('canvas');
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    this.renderer = null;
    if ( webglAvailable() ) {
      this.renderer = new THREE.WebGLRenderer({'canvas': this.canvas});
    } else {
      this.renderer = new THREE.CanvasRenderer({'canvas': this.canvas});
    }
    this.renderer.setSize(canvas.width, canvas.height);
    this.renderer.setClearColor(0);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100000);
    this.camera.position.set(0, 50, 300);
    this.camera.lookAt(this.scene.position);
    this.cameraAngle = 0;

    this.light = new THREE.PointLight(0xdfebff, 1);
    this.light.position.set(-5, 2, 20);
    this.light.castShadow = true;
    this.scene.add(this.light);

    this.ambientLight = new THREE.AmbientLight(0x888888);
    this.scene.add(this.ambientLight);

    this.butterflies = [];
    for (var i = 0; i < 38; i++) { this.butterflies[i] = new Butterfly(this); }

    this.woman = new Woman(this);

    this.resize();
    window.addEventListener('resize', this.resize.bind(this), false );

    initGui(this);

    this.render();
  }

  updateCamera() {
    if (settings.rotateCamera) {
      this.cameraAngle += 0.01;
      this.camera.position.x = 304 * Math.cos(this.cameraAngle);
      this.camera.position.z = 304 * Math.sin(this.cameraAngle);
      this.camera.lookAt(this.scene.position);
    }
  }

  update() {
    for (var i in this.butterflies) { this.butterflies[i].update(); }
    this.woman.update();
    this.updateCamera();
  }

  resize() {
    this.canvas.width = this.canvas.parentElement.offsetWidth;
    this.canvas.height = this.canvas.parentElement.offsetHeight;

    this.camera.aspect = this.canvas.width / this.canvas.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvas.width, this.canvas.height);
  }

  render() {
    this.update();
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

function webglAvailable() {
  try {
    return !!( window.WebGLRenderingContext && (
                 canvas.getContext('webgl') ||
                 canvas.getContext('experimental-webgl'))
             );
  } catch (e) {
    return false;
  }
}

var app = new App();
app.render();
