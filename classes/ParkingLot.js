class ParkingLot {
  constructor(sketch) {
    this.s = sketch;

    this.parkingYAxis = 700;

    this.obstacle = new Object();
    this.obstacle.topLeft = sketch.createVector(400, 675);
    this.obstacle.width = 100;
    this.obstacle.height = 50;
  }

  show() {
    this.s.rectMode(this.s.CORNER);
    this.s.fill(this.s.color("#cbcbf2"));
    this.s.rect(0, this.parkingYAxis - 35, this.s.width, 3);
    this.s.fill(this.s.color("#6d3115"));
    this.s.rect(0, this.parkingYAxis + 35, this.s.width, 3);
    this.s.fill(this.s.color("#874425"));
    this.s.rect(0, this.parkingYAxis + 38, this.s.width, 100);

    this.s.fill(this.s.color("#181e26"));
    this.s.rect(
      this.obstacle.topLeft.x,
      this.obstacle.topLeft.y,
      this.obstacle.width,
      this.obstacle.height
    );
    this.s.rectMode(this.s.CENTER);
  }
}
