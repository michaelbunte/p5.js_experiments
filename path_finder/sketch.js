let boxCount;
let boxSize;

function setup() {
  boxCount = createVector(20, 10);
  boxSize = 10;
  createCanvas(boxCount.x * boxSize, boxCount.y * boxSize);
}

class Box {
  constructor(x, y, size) {
    this.index = createVector(x, y);
    this.pos = createVector(x * size, y * size);
    this.size = size;

    this.state = "empty";
  }

  makeWall() {
    this.state = "wall";
  }

  makeEmpty() {
    this.state = "empty";
  }

  makeSelected() {
    this.state = "selected";
  }

  draw() {
    rect(this.pos.x, this.pos.y, size, size);
  }
}

function draw() {
  background(250);
}
