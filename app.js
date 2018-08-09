var myp5 = new p5(function(sketch) {
  var car, frontWheel, rearWheel, geometry;

  sketch.setup = function() {
    sketch.createCanvas(1000, 800);
    sketch.angleMode(sketch.RADIANS);
    sketch.ellipseMode(sketch.RADIUS);
    sketch.rectMode(sketch.CENTER);
    parking = new ParkingLot(sketch);
    frontWheel = new Wheel(sketch);
    rearWheel = new Wheel(sketch);
    motor = new Motor(sketch, frontWheel, rearWheel);
    car = new Car(sketch, frontWheel, rearWheel, motor);
    assistant = new ParkingAssistant(sketch, car, parking);
  };

  sketch.draw = function() {
    sketch.background(51);
    parking.show();
    assistant.showFullGuide();
    car.update();
    car.show();
    assistant.showAdditionalGeometry();
  };
}, "p5sketch");
