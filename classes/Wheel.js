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
      p5.Vector.mult(
        this.s.createVector(this.s.cos(carHeading), this.s.sin(carHeading)),
        offset
      )
    );
  }

  turn(increment) {
    this.steerAngle = this.s.constrain(
      this.steerAngle + increment,
      -this.maxSteerAngle,
      this.maxSteerAngle
    );
  }

  move(curveCenter, carSpeed, carHeading) {
    if (curveCenter === null) {
      this.pos = p5.Vector.add(
        this.pos,
        p5.Vector.mult(
          this.s.createVector(this.s.cos(carHeading), this.s.sin(carHeading)),
          carSpeed
        )
      );
    } else {
      let a = this.pos;
      let b = p5.Vector.add(
        this.pos,
        p5.Vector.mult(
          this.s.createVector(this.s.cos(carHeading), this.s.sin(carHeading)),
          1
        )
      );
      let c = curveCenter;
      let isCenterOnLeftSide =
        (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) < 0;

      let radius = this.s.dist(
        curveCenter.x,
        curveCenter.y,
        this.pos.x,
        this.pos.y
      );

      let currentTheta = this.s.atan2(
        this.pos.y - curveCenter.y,
        this.pos.x - curveCenter.x
      );
      let deltaTheta = carSpeed / radius;
      let newTheta;
      if (isCenterOnLeftSide) {
        newTheta = currentTheta - deltaTheta;
      } else {
        newTheta = currentTheta + deltaTheta;
      }
      this.pos = this.s.createVector(
        curveCenter.x + this.s.cos(newTheta) * radius,
        curveCenter.y + this.s.sin(newTheta) * radius
      );
    }
  }

  show(carHeading) {
    this.s.fill(0);
    this.s.resetMatrix();
    this.s.translate(this.pos.x, this.pos.y);
    this.s.rotate(carHeading + this.steerAngle, [0, 0, 1]);
    this.s.rect(0, 0, this.width, this.height);
  }
}
