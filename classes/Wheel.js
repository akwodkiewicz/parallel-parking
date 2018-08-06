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

  show(carHeading) {
    this.s.fill(0);
    this.s.resetMatrix();
    this.s.translate(this.pos.x, this.pos.y);
    this.s.rotate(carHeading + this.steerAngle, [0, 0, 1]);
    this.s.rect(0, 0, this.width, this.height);
  }
}
