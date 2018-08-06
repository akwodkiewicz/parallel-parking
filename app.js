var myp5 = new p5(function(sketch) {
  var car, frontWheel, rearWheel, geometry;

  sketch.setup = function() {
    sketch.createCanvas(800, 800);
    sketch.angleMode(sketch.RADIANS);
    sketch.ellipseMode(sketch.RADIUS);
    sketch.rectMode(sketch.CENTER);
    frontWheel = new Wheel(sketch);
    rearWheel = new Wheel(sketch);
    car = new Car(sketch, frontWheel, rearWheel);
    geometry = new GeometryManager(sketch, car);
  };

  sketch.draw = function() {
    sketch.background(51);
    car.update();
    car.show();
    geometry.show();
  };
}, "p5sketch");
