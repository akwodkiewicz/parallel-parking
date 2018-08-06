class GeometryManager {
  constructor(sketch, car) {
    this.s = sketch;
    this.car = car;
    this.front = car.frontWheel;
    this.rear = car.rearWheel;
  }

  show() {
    this.s.resetMatrix();

    let frontSlope = -1 / this.s.tan(this.car.carHeading + this.front.steerAngle);
    let rearSlope = -1 / this.s.tan(this.car.carHeading + this.rear.steerAngle);
    let frontB = this.front.pos.y - frontSlope * this.front.pos.x;
    let rearB = this.rear.pos.y - rearSlope * this.rear.pos.x;

    this.s.line(0, frontB, this.s.width, frontSlope * this.s.width + frontB);
    this.s.line(0, rearB, this.s.width, rearSlope * this.s.width + rearB);

    let delta = rearSlope - frontSlope;
    if (delta == 0) {
      return;
    }
    let x = (frontB - rearB) / delta;
    let y = (-frontSlope * rearB + rearSlope * frontB) / delta;
    let frontR = this.s.dist(x, y, this.front.pos.x, this.front.pos.y);
    let rearR = this.s.dist(x, y, this.rear.pos.x, this.rear.pos.y);

    this.s.ellipse(x, y, 5);
    this.s.noFill();
    this.s.ellipse(x, y, frontR);
    this.s.ellipse(x, y, rearR);
  }
}

class Wheel {
  constructor(sketch) {
    this.s = sketch;

    this.width = 20;
    this.height = 10;
    this.pos = sketch.createVector(0, 0);

    this.steerAngle = 0; // always == 0 for rear wheel
    this.maxSteerAngle = sketch.radians(45);
  }

  setPosition(carPos, offset, carHeading) {
    this.pos = p5.Vector.add(
      carPos,
      p5.Vector.mult(this.s.createVector(this.s.cos(carHeading), this.s.sin(carHeading)), offset)
    );
  }

  turn(increment) {
    this.steerAngle = this.s.constrain(
      this.steerAngle + increment,
      -this.maxSteerAngle,
      this.maxSteerAngle
    );
  }

  move(carSpeed, carHeading) {
    this.pos = p5.Vector.add(
      this.pos,
      p5.Vector.mult(
        this.s.createVector(
          this.s.cos(carHeading + this.steerAngle),
          this.s.sin(carHeading + this.steerAngle)
        ),
        carSpeed
      )
    );
  }

  applyWheelMatrix(carHeading) {
    this.s.resetMatrix();
    this.s.translate(this.pos.x, this.pos.y);
    this.s.rotate(carHeading + this.steerAngle, [0, 0, 1]);
  }

  show(carHeading) {
    this.s.rectMode(this.s.CENTER);
    this.s.fill(0);

    this.applyWheelMatrix(carHeading);
    this.s.rect(0, 0, this.width, this.height);
  }
}

class Car {
  constructor(sketch, frontWheel, rearWheel) {
    this.s = sketch;

    this.width = 100;
    this.height = 50;
    this.pos = this.s.createVector(this.s.width / 2, this.s.height / 2);

    this.speed = 0;
    this.speedInc = 0.05;
    this.drag = 0.01;

    this.angleStep = this.s.radians(1);
    this.carHeading = 0;

    this.wheelBase = 80;
    this.frontWheel = frontWheel;
    this.rearWheel = rearWheel;
    this.frontWheel.setPosition(this.pos, this.wheelBase / 2, this.carHeading);
    this.rearWheel.setPosition(this.pos, -this.wheelBase / 2, this.carHeading);
  }

  update() {
    this.setWheelsPosition();
    this.processTurnInput();
    this.applyDrag();
    this.processAccelInput();
    this.moveWheels();
    this.moveBody();
  }

  setWheelsPosition() {
    this.frontWheel.setPosition(this.pos, this.wheelBase / 2, this.carHeading);
    this.rearWheel.setPosition(this.pos, -this.wheelBase / 2, this.carHeading);
  }

  processTurnInput() {
    if (this.s.keyIsDown(65)) {
      // 'A' == left
      this.frontWheel.turn(-this.angleStep);
    } else if (this.s.keyIsDown(68)) {
      // 'D' ==
      this.frontWheel.turn(this.angleStep);
    }
  }

  applyDrag() {
    if (this.speed > 0) {
      this.speed -= this.drag;
    } else if (this.speed < 0) {
      this.speed += this.drag;
    }
  }

  processAccelInput() {
    if (this.s.keyIsDown(87)) {
      // 'W'
      this.speed += this.speedInc;
    } else if (this.s.keyIsDown(83)) {
      // 'S'
      this.speed -= this.speedInc;
    } else if (this.s.keyIsDown(32)) {
      // Spacebar
      this.speed = 0;
    }
    this.speed = this.s.constrain(this.speed, -30, 30);
  }

  moveWheels() {
    this.frontWheel.move(this.speed, this.carHeading);
    this.rearWheel.move(this.speed, this.carHeading);
  }

  moveBody() {
    this.pos = p5.Vector.div(
      p5.Vector.add(this.frontWheel.pos, this.rearWheel.pos),
      2
    );
    this.carHeading = this.s.atan2(
      this.frontWheel.pos.y - this.rearWheel.pos.y,
      this.frontWheel.pos.x - this.rearWheel.pos.x
    );
  }

  show() {
    this.s.rectMode(this.s.CENTER);
    this.s.fill(255);

    this.s.resetMatrix();
    this.s.translate(this.pos.x, this.pos.y);
    this.s.rotate(this.carHeading, [0, 0, 1]);
    this.s.rect(0, 0, this.width, this.height);

    this.frontWheel.show(this.carHeading);
    this.rearWheel.show(this.carHeading);
  }
}

var myp5 = new p5(function(sketch) {
  var car, frontWheel, rearWheel, geometry;

  sketch.setup = function() {
    sketch.createCanvas(800, 800);
    sketch.angleMode(sketch.RADIANS);
    sketch.ellipseMode(sketch.RADIUS);
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
