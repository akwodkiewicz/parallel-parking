var car;

function setup() {
  createCanvas(800, 800);
  car = new Car();
}

function draw() {
  background(51);
  car.update();
  car.show();
}

class Car {
  constructor() {
    this.width = 50;
    this.height = 25;
    this.pos = createVector(width / 2, height / 2);
    this.moveVector = createVector(1, 0);
    this.accel = 0;
    this.drag = 1;
    this.angleStep = 0.01;
    this.currentAngle = 0;
  }

  update() {
    this.applyDrag();
    this.processAccelInput();
    this.processTurnInput();
    this.accel = constrain(this.accel, -50, 50);
    this.pos.add(p5.Vector.mult(this.moveVector, this.accel * 0.05));
  }

  applyDrag() {
    if (this.accel > 0) {
      this.accel -= this.drag;
    } else {
      this.accel += this.drag;
    }
  }

  processAccelInput() {
    if (keyIsDown(87)) {
      // 'W'
      this.accel += 3;
    } else if (keyIsDown(83)) {
      //'S'
      this.accel -= 2;
    }
  }

  processTurnInput() {
    if (keyIsDown(65)) {
      // 'A'
      if (this.accel > 1) {
        this.moveVector.rotate(-this.angleStep);
        this.currentAngle -= this.angleStep;
      } else if (this.accel < -1) {
        this.moveVector.rotate(this.angleStep);
        this.currentAngle += this.angleStep;
      }
    } else if (keyIsDown(68)) {
      // 'D'
      if (this.accel > 1) {
        this.moveVector.rotate(this.angleStep);
        this.currentAngle += this.angleStep;
      } else if (this.accel < -1) {
        this.moveVector.rotate(-this.angleStep);
        this.currentAngle -= this.angleStep;
      }
    }
  }

  show() {
    rectMode(CENTER);
    fill(255);

    translate(this.pos.x, this.pos.y);
    rotate(this.currentAngle, [0, 0, 1]);
    translate(-this.pos.x, -this.pos.y);

    rect(this.pos.x, this.pos.y, this.width, this.height);
  }
}