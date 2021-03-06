document.addEventListener("DOMContentLoaded", function() {
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

      gui
        .add(assistant, "isGeometryVisible")
        .listen()
        .onChange(newValue => {
          if (!newValue) {
            assistant.isGuideVisible = false;
          }
        });
      gui
        .add(assistant, "isGuideVisible")
        .listen()
        .onChange(newValue => {
          if (newValue) {
            assistant.isGeometryVisible = true;
          }
        });
      gui
        .add(
          parking,
          "parkingSpaceLength",
          parking.obstacleWidth * 1.25,
          parking.obstacleWidth * 2
        )
        .onChange(() => parking.createObstacles());
      gui
        .add(parking, "obstacleHeight", 35, 65)
        .onChange(() => parking.createObstacles());
    };

    sketch.draw = function() {
      sketch.background(51);
      parking.show();
      // assistant.showBestPosition();
      car.update();
      car.show();
      assistant.showAdditionalGeometry();
      assistant.showFullGuide();

      assistant.updated = false;
    };
  }, "p5sketch");
  var gui = new dat.GUI({ autoPlace: false });
  var customContainer = document.getElementById("gui-container");
  customContainer.appendChild(gui.domElement);
});
