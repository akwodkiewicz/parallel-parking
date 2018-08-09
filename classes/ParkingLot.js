class ParkingLot {
    constructor(sketch) {
        this.s = sketch;
        
        this.parkingYAxis = 700;
    }

    show() {
        this.s.rectMode(this.s.CORNER);
        this.s.fill(this.s.color("#cbcbf2"));
        this.s.rect(0, this.parkingYAxis - 35, this.s.width, 3);
        this.s.fill(this.s.color("#6d3115"));
        this.s.rect(0, this.parkingYAxis + 35, this.s.width, 3);
        this.s.fill(this.s.color("#874425"));
        this.s.rect(0, this.parkingYAxis + 38, this.s.width, 100);
        this.s.rectMode(this.s.CENTER);
      }
}