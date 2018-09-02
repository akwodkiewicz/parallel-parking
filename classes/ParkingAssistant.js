class ParkingAssistant {
  constructor(sketch, car, parking) {
    this.s = sketch;
    this.car = car;
    this.front = car.frontWheel;
    this.rear = car.rearWheel;
    this.parking = parking;

    this.isGuideVisible = true;
    this.isGeometryVisible = true;

    this.parkingGuideDots = null;
    this.colors = [
      this.s.color("rgba(141, 239, 165, 1)"),
      this.s.color("rgba(107, 228, 244, 1)")
    ];
    this.colorsTransparent = [
      this.s.color("rgba(141, 239, 165, 0.5)"),
      this.s.color("rgba(107, 228, 244, 0.5)")
    ];
  }

  update() {
    this.frontSlope =
      -1 / this.s.tan(this.car.carHeading + this.front.steerAngle);
    this.rearSlope =
      -1 / this.s.tan(this.car.carHeading + this.rear.steerAngle);
    this.frontB = this.front.pos.y - this.frontSlope * this.front.pos.x;
    this.rearB = this.rear.pos.y - this.rearSlope * this.rear.pos.x;

    this.updated = true;
  }

  showParkingGuides() {
    // Cumbersome calculations made with a pen and a lot of paper
    if (!this.isGuideVisible) {
      return;
    }
    if (!this.updated) {
      this.update();
    }

    let m = this.rearSlope;
    let b1 = this.rearB;
    let yb = this.rear.pos.y;
    let xb = this.rear.pos.x;
    let h = this.parking.parkingYAxis;

    let temp = m * yb + xb - h * m;
    let temp2 = Math.sqrt((h - yb) * (h - yb) + (temp - xb) * (temp - xb));
    let xE = temp - temp2;
    let yE = m * xE + b1;
    let xF = temp + temp2;
    let yF = m * xF + b1;
    this.parkingGuideDots = [
      this.s.createVector(xE, yE),
      this.s.createVector(xF, yF)
    ];
    this.s.fill(this.colors[0]);
    this.s.ellipse(xE, yE, 8);
    this.s.fill(this.colors[1]);
    this.s.ellipse(xF, yF, 8);
  }

  showFinalPosition(dotNum) {
    if (!this.isGuideVisible) {
      return;
    }
    if (!this.updated) {
      this.update();
    }
    if (
      this.parkingGuideDots[dotNum].x < 0 ||
      this.parkingGuideDots[dotNum].x > 1000 ||
      this.parkingGuideDots[dotNum].y < 0 ||
      this.parkingGuideDots[dotNum].y > 800
    ) {
      return;
    }
    let a = this.rear.pos;
    let b = p5.Vector.add(
      this.rear.pos,
      p5.Vector.mult(
        this.s.createVector(
          this.s.cos(this.car.carHeading),
          this.s.sin(this.car.carHeading)
        ),
        1
      )
    );
    let c = this.parkingGuideDots[dotNum];
    let isCenterOnLeftSide =
      (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) < 0;

    // isCenterOnLeftSide === true => car will be facing right
    let topLeft = isCenterOnLeftSide
      ? this.s.createVector(
          c.x - this.rear.width / 2,
          this.parking.parkingYAxis - this.car.height / 2
        )
      : this.s.createVector(
          c.x - (this.car.width - this.rear.width / 2),
          this.parking.parkingYAxis - this.car.height / 2
        );

    this.s.rectMode(this.s.CORNER);
    this.s.noStroke();
    this.s.fill(this.colorsTransparent[dotNum]);
    this.s.rect(topLeft.x, topLeft.y, this.car.width, this.car.height);
    this.s.rectMode(this.s.CENTER);
    this.s.stroke(0);
  }

  showAdditionalGeometry() {
    if (!this.isGeometryVisible) {
      return;
    }
    if (!this.updated) {
      this.update();
    }

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

  showBestPosition() {
    let [start, end] = this.parking.parkingGap();
    let bestCenter = this.s.createVector(start.x + this.car.width / 2, start.y);
    this.s.fill(this.s.color("grey"));
    this.s.rect(bestCenter.x, bestCenter.y, this.car.width, this.car.height);
  }

  showCornerCollision() {
    if (!this.car.curveCenter) {
      return;
    }

    let t = p5.Vector.add(
      this.car.pos,
      this.s.createVector(
        this.car.width / 2,
        this.car.height / 2
      )
    );
    let frontRightCar = this.rotate(this.car.pos.x, this.car.pos.y, t.x, t.y, this.car.carHeading);


    let [_, end] = this.parking.parkingGap();
    let rearLeftObstacle = p5.Vector.add(
      end,
      this.s.createVector(0, -this.parking.obstacleHeight / 2)
    );

    let frontRightCarDist = this.s.dist(
      this.car.curveCenter.x,
      this.car.curveCenter.y,
      frontRightCar.x,
      frontRightCar.y
    );
    let rearLeftObstacleDist = this.s.dist(
      this.car.curveCenter.x,
      this.car.curveCenter.y,
      rearLeftObstacle.x,
      rearLeftObstacle.y
    );

    this.s.fill('orange');
    this.s.ellipse(frontRightCar.x, frontRightCar.y, 3);
    this.s.ellipse(rearLeftObstacle.x, rearLeftObstacle.y, 3);
    
    this.s.noFill();
    if(frontRightCarDist > rearLeftObstacleDist) {
      this.s.stroke('red');
      this.s.ellipse(this.car.curveCenter.x, this.car.curveCenter.y, frontRightCarDist);
      this.s.stroke('black');
    } else {
      this.s.ellipse(this.car.curveCenter.x, this.car.curveCenter.y, frontRightCarDist);
    }  
    return frontRightCarDist > rearLeftObstacleDist;
  }

  rotate(cx, cy, x, y, radians) {
    let cos = Math.cos(-radians),
        sin = Math.sin(-radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return this.s.createVector(nx, ny);
  }


  showFullGuide() {
    if (!this.updated) {
      this.update();
    }
    this.showParkingGuides();
    this.showFinalPosition(0);
    this.showFinalPosition(1);
    this.showCornerCollision();
  }
}
