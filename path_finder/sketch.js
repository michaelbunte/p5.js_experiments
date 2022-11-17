let boxCount;
let boxSize;
let boxes;
let startSquare;
let endSquare;
let mazeStack;

function setup() {
  boxCount = createVector(50, 50);
  boxSize = 10;
  boxes = [];
  for (let i = 0; i < boxCount.y; i++) {
    boxes.push([]);
    for(let j = 0; j < boxCount.x; j++) {
      let newBox = new Box(j, i, boxSize);
      boxes[i].push(newBox);

      if(random(0, 100) > 65) {
        boxes[i][j].makeWall();
      }
    }
  }
  startSquare = boxes[0][0];
  startSquare.makeStart();
  
  endSquare = boxes[boxCount.y - 1][boxCount.x - 1];
  endSquare.makeEnd();

  mazeStack = [];
  mazeStack.push(startSquare);

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

  makeEnd() {
    this.state = "end";
  }

  makeStart() {
    this.state = "start";
  }

  makeSuperSelected() {
    this.state = "superselected";
  }


  isWall() {
    return this.state == "wall";
  }

  isEmpty() {
    return this.state == "empty";
  }

  isSelected() {
    return this.state == "selected";
  }

  isEnd() {
    return this.state == "end";
  }

  isStart() {
    return this.state == "start";
  }

  isSuperSelected() {
    return this.state == "superselected";
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
        fill(200, 200, 0);
        break;
      case "end":
        fill(220, 0 ,0);
        break;
      case "start":
        fill(0, 200, 0);
        break;
      case "superselected":
        fill(110, 43, 255);
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

  // function i copied from stack overflow
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

function getAdjacentBoxes(box) {
  let adjacentBoxes = [];
  let xpos = box.index.x;
  let ypos = box.index.y;
  if(ypos > 0) {
    adjacentBoxes.push(boxes[ypos - 1][xpos]);
  }  
  if(xpos < boxCount.x - 1) {
    adjacentBoxes.push(boxes[ypos][xpos + 1]);
  }
  if(ypos < boxCount.y - 1) {
    adjacentBoxes.push(boxes[ypos + 1][xpos]);
  }
  if(xpos > 0) {
    adjacentBoxes.push(boxes[ypos][xpos - 1]);
  }  
  shuffleArray(adjacentBoxes);
  return adjacentBoxes;
}

function superSelectPath() {
  for(let i = 0; i < mazeStack.length; i++) {
    mazeStack[i].makeSuperSelected();
  }
}

function dfs() {
  if(mazeStack.length > 0) {
    let top = mazeStack.pop();
    let adjacentBoxes = getAdjacentBoxes(top);
    for(let i = 0; i < adjacentBoxes.length; i++) {
      if(adjacentBoxes[i].isEmpty()) {
        adjacentBoxes[i].makeSelected();
        mazeStack.push(adjacentBoxes[i]);
      } else if (adjacentBoxes[i].isEnd()) {
        // superSelectPath();
      }
    }
  }
}

function draw() {
  background(250);
  for(let i = 0; i < 2; i++) {
    dfs();
  }
  drawBoxes();
}
