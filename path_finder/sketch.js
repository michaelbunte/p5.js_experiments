let boxCount;
let boxSize;
let boxes;

function setup() {
  boxCount = createVector(20, 10);
  boxSize = 10;
  boxes = [];
  for (let i = 0; i < boxCount.y; i++) {
    boxes.push([]);
    for(let j = 0; j < boxCount.x; j++) {
      let newBox = new Box(j, i, boxSize);
      boxes[i].push(newBox);

      if(random(0, 100) > 70) {
        boxes[i][j].makeWall();
      }
    }
  }
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

  display() {
    switch (this.state) {
      case "empty":
        fill(255, 255, 255);
        break;
      case "wall":
        fill(0, 0, 0);
        break;
      case "selected":
        fill(0, 0, 255);
        break;
      default: 
        fill(255, 0, 0);
    }
    strokeWeight(0);
    rect(this.pos.x, this.pos.y, this.size, this.size);
  }
}

function drawBoxes() {
  for (let i = 0; i < boxCount.y; i++) {
    for(let j = 0; j < boxCount.x; j++) {
      boxes[i][j].display();
    }
  }
}

function draw() {
  background(250);
  drawBoxes();
}
