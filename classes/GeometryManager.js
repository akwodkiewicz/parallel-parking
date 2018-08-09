class GeometryManager {
  constructor(sketch, car, parking) {
    this.s = sketch;
    this.car = car;
    this.front = car.frontWheel;
    this.rear = car.rearWheel;
    this.parking = parking;
  }

  calculateAxleLines() {
    this.frontSlope =
      -1 / this.s.tan(this.car.carHeading + this.front.steerAngle);
    this.rearSlope =
      -1 / this.s.tan(this.car.carHeading + this.rear.steerAngle);
    this.frontB = this.front.pos.y - this.frontSlope * this.front.pos.x;
    this.rearB = this.rear.pos.y - this.rearSlope * this.rear.pos.x;
  }



  showParkingGuide() {
    // Cumbersome calculations made with a pen and a lot of paper

    let m = this.rearSlope;
    let b1 = this.rearB;
    let yb = this.rear.pos.y;
    let xb = this.rear.pos.x;
    let h = this.parking.parkingYAxis;

    let temp = m * yb + xb - h * m;

    let xo = temp - Math.sqrt((h - yb) * (h - yb) + (temp - xb) * (temp - xb));
    let yo = m * xo + b1;

    this.s.fill(this.s.color("#b4e5a0"));
    this.s.ellipse(xo, yo, 8);
  }

  show() {
    this.calculateAxleLines();

    this.s.resetMatrix();
    this.s.line(
      0,
      this.frontB,
      this.s.width,
      this.frontSlope * this.s.width + this.frontB
    );
    this.s.line(
      0,
      this.rearB,
      this.s.width,
      this.rearSlope * this.s.width + this.rearB
    );

    this.showParkingGuide();

    let delta = this.rearSlope - this.frontSlope;
    if (delta == 0) {
      return;
    }

    let x = (this.frontB - this.rearB) / delta;
    let y =
      (-this.frontSlope * this.rearB + this.rearSlope * this.frontB) / delta;
    let frontR = this.s.dist(x, y, this.front.pos.x, this.front.pos.y);
    let rearR = this.s.dist(x, y, this.rear.pos.x, this.rear.pos.y);
    this.s.fill(0);
    this.s.ellipse(x, y, 5);
    this.s.noFill();
    this.s.ellipse(x, y, frontR);
    this.s.ellipse(x, y, rearR);
  }
}
