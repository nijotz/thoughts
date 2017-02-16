import Butterfly from './butterfly.js'

var app;

var settings = {
  butterflies: 38,
  displayVelocity: false,
  displayTarget: false
};

var gui = new dat.GUI();

function initGui(app_) {
  app = app_;
}

gui.add(settings, 'butterflies', 0, 38).step(1).onChange(butterfliesChange);
gui.add(settings, 'displayVelocity');
gui.add(settings, 'displayTarget');

function butterfliesChange(value) {
  var diff = value - app.butterflies.length;
  if (diff > 0) {
    for (var i = 0; i < diff; i++) {
      app.butterflies.push(new Butterfly(app));
    }
  } else if (diff < 0) {
    for (var i = 0; i > diff; i--) {
      app.butterflies.shift().remove();
    }
  }
}

export { settings, initGui }
