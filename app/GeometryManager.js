class GeometryManager {
  constructor(sketch, car) {
    this.s = sketch;
    this.car = car;
    this.front = car.frontWheel;
    this.rear = car.rearWheel;
  }

  show() {
    this.s.resetMatrix();

    let frontSlope =
      -1 / this.s.tan(this.car.carHeading + this.front.steerAngle);
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
