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
    this.carHeading = this.s.radians(30);
    this.curveCenter = null;

    this.wheelBase = 80;
    this.frontWheel = frontWheel;
    this.rearWheel = rearWheel;
  }

  update() {
    this.setWheelsPosition();
    this.processTurnInput();
    //this.applyDrag();
    this.processAccelInput();

    this.calculateCurveCenter();

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

  calculateCurveCenter() {
    let fPos = this.frontWheel.pos;
    let rPos = this.rearWheel.pos;

    let frontTan = this.s.tan(this.carHeading + this.frontWheel.steerAngle);
    let rearTan = this.s.tan(this.carHeading + this.rearWheel.steerAngle);
    frontTan = this.s.round(frontTan * 1000) / 1000;
    rearTan = this.s.round(rearTan * 1000) / 1000;
    if (frontTan === 0 && rearTan === 0) {
      this.curveCenter = null;
      return;
    }

    let frontSlope = -1 / frontTan;
    let rearSlope = -1 / rearTan;
    let frontB = fPos.y - frontSlope * fPos.x;
    let rearB = rPos.y - rearSlope * rPos.x;
  
    let delta = rearSlope - frontSlope;
    if (delta === 0) {
      this.curveCenter = null;
      return;
    }

    let x = (frontB - rearB) / delta;
    let y = (-frontSlope * rearB + rearSlope * frontB) / delta;
    this.curveCenter = this.s.createVector(x, y);
  }

  moveWheels() {
    this.frontWheel.move(this.curveCenter, this.speed, this.carHeading);
    this.rearWheel.move(this.curveCenter, this.speed, this.carHeading);
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
    this.s.fill(255);
    this.s.resetMatrix();
    this.s.translate(this.pos.x, this.pos.y);
    this.s.rotate(this.carHeading, [0, 0, 1]);
    this.s.rect(0, 0, this.width, this.height);
    this.frontWheel.show(this.carHeading);
    this.rearWheel.show(this.carHeading);
  }
}
