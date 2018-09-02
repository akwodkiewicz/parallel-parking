class ParkingLot {
  constructor(sketch) {
    this.s = sketch;

    this.xMin = 0;
    this.xMax = 1000;
    this.parkingYAxis = 700;

    this.gapIndex = 3;

    this.obstacleWidth = 100;
    this.obstacleHeight = 50;
    this.parkingSpaceLength = 130;

    this.createObstacles();
  }

  createObstacles() {
    this.obstacles = [];
    for (
      let i = this.xMin, j = 0;
      i < this.xMax;
      i = i + this.parkingSpaceLength, j++
    ) {
      if (j !== this.gapIndex) {
        this.obstacles.push(
          new Obstacle(
            this.s,
            this.obstacleWidth,
            this.obstacleHeight,
            this.s.createVector(i + this.obstacleWidth / 2, this.parkingYAxis)
          )
        );
      }
    }
  }

  parkingGap() {
    let start = this.obstacles[this.gapIndex - 1].frontBumper();
    let end = this.obstacles[this.gapIndex].rearBumper();
    return [start, end];
  }

  show() {
    this.s.rectMode(this.s.CORNER);
    this.s.fill(this.s.color("#cbcbf2"));
    this.s.rect(0, this.parkingYAxis - 35, this.s.width, 3);
    this.s.fill(this.s.color("#6d3115"));
    this.s.rect(0, this.parkingYAxis + 35, this.s.width, 3);
    this.s.fill(this.s.color("#874425"));
    this.s.rect(0, this.parkingYAxis + 38, this.s.width, 100);

    this.obstacles.forEach(o => {
      o.show();
    });
    this.s.rectMode(this.s.CENTER);
  }
}

class Obstacle {
  constructor(sketch, width, height, center) {
    this.s = sketch;
    this.width = width;
    this.height = height;
    this.pos = center;
    this.color = this.s.color("#e1ddee");
  }

  frontBumper() {
    return p5.Vector.add(this.pos, this.s.createVector(this.width / 2, 0));
  }

  rearBumper() {
    return p5.Vector.sub(this.pos, this.s.createVector(this.width / 2, 0));
  }

  show() {
    this.s.rectMode(this.s.CENTER);
    this.s.fill(this.s.color("#e1ddee"));
    this.s.rect(this.pos.x, this.pos.y, this.width, this.height);
    this.s.rectMode(this.s.CENTER);
  }
}
