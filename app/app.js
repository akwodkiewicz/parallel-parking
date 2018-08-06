var car;

function setup() {
  createCanvas(800, 800);
  angleMode(RADIANS);
  car = new Car();
}

function draw() {
  background(51);
  car.update();
  car.show();
}

class Wheel {
  constructor() {
    this.width = 20;
    this.height = 10;
    this.pos = createVector(0, 0);

    this.steerAngle = 0; // always == 0 for rear wheel
    this.maxSteerAngle = radians(45);
  }

  setPosition(carPos, offset, carHeading) {
    this.pos = p5.Vector.add(
      carPos,
      p5.Vector.mult(createVector(cos(carHeading), sin(carHeading)), offset)
    );
  }

  turn(increment) {
    this.steerAngle = constrain(
      this.steerAngle + increment,
      -this.maxSteerAngle,
      this.maxSteerAngle
    );
  }

  move(carSpeed, carHeading) {
    this.pos = p5.Vector.add(
      this.pos,
      p5.Vector.mult(
        createVector(
          cos(carHeading + this.steerAngle),
          sin(carHeading + this.steerAngle)
        ),
        carSpeed
      )
    );
  }

  show(carHeading) {
    rectMode(CENTER);
    fill(0);

    resetMatrix();
    translate(this.pos.x, this.pos.y);
    rotate(carHeading + this.steerAngle, [0, 0, 1]);
    rect(0, 0, this.width, this.height);
  }
}

class Car {
  constructor() {
    this.width = 100;
    this.height = 50;
    this.pos = createVector(width / 2, height / 2);

    this.speed = 0;
    this.speedInc = 0.05;
    this.drag = 0.01;
    
    this.angleStep = radians(1);
    this.carHeading = 0;

    this.wheelBase = 80;
    this.frontWheel = new Wheel();
    this.rearWheel = new Wheel();
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
    if (keyIsDown(65)) {
      // 'A' == left
      this.frontWheel.turn(-this.angleStep);
    } else if (keyIsDown(68)) {
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
    if (keyIsDown(87)) {
      // 'W'
      this.speed += this.speedInc;
    } else if (keyIsDown(83)) {
      //'S'
      this.speed -= this.speedInc;
    }
    this.speed = constrain(this.speed, -30, 30);
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
    this.carHeading = atan2(
      this.frontWheel.pos.y - this.rearWheel.pos.y,
      this.frontWheel.pos.x - this.rearWheel.pos.x
    );
  }

  show() {
    rectMode(CENTER);
    fill(255);

    resetMatrix();
    translate(this.pos.x, this.pos.y);
    rotate(this.carHeading, [0, 0, 1]);
    rect(0, 0, this.width, this.height);

    this.frontWheel.show(this.carHeading);
    this.rearWheel.show(this.carHeading);
  }
}
