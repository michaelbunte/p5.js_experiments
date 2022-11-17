let boxCount;
let boxSize;
let boxes;
let startSquare;
let endSquare;
let mazeStack;
let changedBoxes;

function setup() {
  boxCount = createVector(200, 200);
  boxSize = 2;
  boxes = [];
  changedBoxes = [];
  for (let i = 0; i < boxCount.y; i++) {
    boxes.push([]);
    for(let j = 0; j < boxCount.x; j++) {
      let newBox = new Box(j, i, boxSize);
      boxes[i].push(newBox);

      if(random(0, 100) > 63) {
        boxes[i][j].makeWall();
      }
    }
  }
  startSquare = boxes[50][50];
  startSquare.makeStart();
  
  endSquare = boxes[boxCount.y - 2][boxCount.x - 2];
  endSquare.makeEnd();

  mazeStack = [];
  mazeStack.push(startSquare);

  createCanvas(boxCount.x * boxSize, boxCount.y * boxSize);
  drawBoxes();
}

class Box {
  constructor(x, y, size) {
    this.index = createVector(x, y);
    this.pos = createVector(x * size, y * size);
    this.size = size;
    this.state = "empty";
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

  makeWall() {
    if( ! this.isWall()) {
      changedBoxes.push(this);
    }
    this.state = "wall";
  }

  makeEmpty() {
    if( ! this.isEmpty()) {
      changedBoxes.push(this);
    }
    this.state = "empty";
  }

  makeSelected() {
    if( ! this.isSelected()) {
      changedBoxes.push(this);
    }
    this.state = "selected";
  }

  makeEnd() {
    if( ! this.isEnd()) {
      changedBoxes.push(this);
    }
    this.state = "end";
  }

  makeStart() {
    if( ! this.isStart()) {
      changedBoxes.push(this);
    }
    this.state = "start";
  }

  makeSuperSelected() {
    if( ! this.isSuperSelected()) {
      changedBoxes.push(this);
    }
    this.state = "superselected";
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
        fill(66, 135, 245);
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

function drawChangedBoxes() {
  for(let i = 0; i < changedBoxes.length; i++) {
    changedBoxes[i].display();
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

function sortByDistance(adj_boxes, target) {
  // let sorted = true;
  // do {
  //   run++;
  //   console.log(run)
  //   for(let i = 0; i < adj_boxes.length - 1; i++) {
  //     let boxAdist = dist(adj_boxes[i].index.x, adj_boxes[i].index.y, target.index.x, target.index.y);
  //     let boxBdist = dist(adj_boxes[i + 1].index.x, adj_boxes[i + 1].index.y, target.index.x, target.index.y);
  //     if(boxBdist < boxAdist) {
  //       let temp = adj_boxes[i];
  //       adj_boxes[i] = adj_boxes[i + 1];
  //       adj_boxes[i + 1] = temp;
  //       sorted = false;
  //     }
  //   }
  // } while ( ! sorted)
  //adj_boxes.sort(compareDistance());
  adj_boxes.sort(function(a, b){return  dist(b.index.x, b.index.y, endSquare.index.x, endSquare.index.y) - dist(a.index.x, a.index.y, endSquare.index.x, endSquare.index.y)});
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
  // shuffleArray(adjacentBoxes);
  sortByDistance(adjacentBoxes, endSquare);
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
        mazeStack = [];
      }
    }
  }
}

function draw() {
  for(let i = 0; i < 5; i++) {
    dfs();
  }
  drawChangedBoxes();
  changedBoxes = [];
}
