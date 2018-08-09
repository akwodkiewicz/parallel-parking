class Motor {
  constructor(sketch, frontWheel, rearWheel) {
    this.s = sketch;

    this.frontWheel = frontWheel;
    this.rearWheel = rearWheel;

    this.speed = 0;
    this.maxSpeed = 30;
  }

  accelerate(increment) {
    this.speed = this.constrainSpeed(this.speed + increment);
  }

  decelerate(decrement) {
    this.speed = this.constrainSpeed(this.speed - decrement);
  }

  handbrake() {
    this.speed = 0;
  }

  constrainSpeed(speed) {
    return this.s.constrain(speed, -this.maxSpeed, this.maxSpeed);
  }

  moveWheels(curveCenter, carHeading) {
    if (curveCenter === null) {
      this.frontWheel.moveStraight(this.speed, carHeading);
      this.rearWheel.moveStraight(this.speed, carHeading);
    } else {
      let [newFrontTheta, newRearTheta] = this.differentialMechanism(
        curveCenter,
        carHeading
      );
      this.frontWheel.moveCurved(curveCenter, newFrontTheta);
      this.rearWheel.moveCurved(curveCenter, newRearTheta);
    }
  }

  differentialMechanism(curveCenter, carHeading) {
    let a = this.rearWheel.pos;
    let b = p5.Vector.add(
      this.rearWheel.pos,
      p5.Vector.mult(
        this.s.createVector(this.s.cos(carHeading), this.s.sin(carHeading)),
        1
      )
    );
    let c = curveCenter;
    let isCenterOnLeftSide =
      (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) < 0;

    let frontRadius = this.s.dist(
      curveCenter.x,
      curveCenter.y,
      this.frontWheel.pos.x,
      this.frontWheel.pos.y
    );

    let currentFrontTheta = this.s.atan2(
      this.frontWheel.pos.y - curveCenter.y,
      this.frontWheel.pos.x - curveCenter.x
    );

    let currentRearTheta = this.s.atan2(
      this.rearWheel.pos.y - curveCenter.y,
      this.rearWheel.pos.x - curveCenter.x
    );

    let deltaTheta = this.speed / frontRadius; // I guess this makes it FWD

    let newRearTheta = isCenterOnLeftSide
      ? currentRearTheta - deltaTheta
      : currentRearTheta + deltaTheta;

    let newFrontTheta = isCenterOnLeftSide
      ? currentFrontTheta - deltaTheta
      : currentFrontTheta + deltaTheta;

    return [newFrontTheta, newRearTheta];
  }
}
