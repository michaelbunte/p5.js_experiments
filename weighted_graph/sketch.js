
let nodes;
let nodeCount;
let canvasSize;
let unitLength;
let speedSlider;
let sliderText;
let nodeCountSlider;
let maxNodes
function setup(){
    restart();
    createCanvas(canvasSize.x, canvasSize.y);
}

function restart() {
    canvasSize = createVector(600, 600);
    nodeCount = 50;
    nodes = [];
    unitLength = 40;
    
    for(let i = 0; i < nodeCount; i++) {
        let node = new Node(i);
        node.moveToRandom();
        nodes.push(node);
    }

    maxNodes = 2;

    for(let i = 0; i < nodeCount; i++) {
        for(let j = 0; j < maxNodes; j++) {
            nodes[i].addFriend(nodes[floor(random()*nodes.length)], random(1,4));
        }
    }

    speedSlider = createSlider(0, 30, 1);
    speedSlider.style('width', '80px');

    sliderText = createElement("div", "speed");
    sliderText.addClass('label');

    nodeCountSlider = createSlider(2, 200, nodeCount);
}

class Node {
    // constructor(friends, weights) {
    //     this.pairs = pairWeights(friends, weights);
    // }

    constructor(id) {
        this.pairs = [];
        this.id = id;
        this.pos = createVector(0,0);
    }

    

    moveToRandom() {
        let halfX = canvasSize.x/2;
        let halfY = canvasSize.y/2
        this.pos = createVector(random(-halfX, halfX) + halfY, random(-halfY,halfY) + halfY);
    }
    
    pairWeights(friends, weights) {
        let pairs = [];
        for(let i = 0; i < friends && i < weights; i++) {
            pairs.push([friends[i], weights[i]]);
        }
        return pairs;
    }

    addFriend(friend, weight) {
        let index = this.pairs.indexOf(friend);
        if(index === -1) {
            this.pairs.push([friend, weight]);
        } else if (this.pairs[index][1] !== weight){
            this.pairs[index][1] = weight;
            friend.addFriend(this, weight);
        }
    }

    move() {
        let netX = 0;
        let netY = 0;
        for(let i = 0; i < this.pairs.length; i++) {
            let udist = dist(this.pos.x, this.pos.y, this.pairs[i][0].pos.x, this.pairs[i][0].pos.y);
            angleMode(DEGREES);
            // let angle = this.pos.angleBetween(this.pairs[i][0].pos);
            let angleVec = this.pos.copy().sub(this.pairs[i][0].pos.x);
            let compAngle = createVector(50, 0);

            let angle;
            if(this.pos.x -  this.pairs[i][0].pos.x != 0) {
                angle = atan((this.pos.y - this.pairs[i][0].pos.y) / (this.pos.x -  this.pairs[i][0].pos.x));
            } else {
                angle = 0;
            }
            if(this.pos.x > this.pairs[i][0].pos.x) {
                angle += 180;
            }
            let gap = udist - this.pairs[i][1] * unitLength;
            let minigap = abs(gap) * 0.1
            if(gap > 0) {
                netX += cos(angle) * minigap;
                netY += sin(angle) * minigap;
            } else {
                netX -= cos(angle) * minigap;
                netY -= sin(angle) * minigap;
            }
        }
        
        // let mouseDisp = createVector(mouseX - pmouseX, mouseY - pmouseY).div(2);
        
        // let distFromMouse = dist(mouseX, mouseY, this.pos.x, this.pos.y);
        // if( distFromMouse != 0) {
        //     netX += mouseDisp.x * sqrt(sqrt(1 / (distFromMouse)) * 5);
        //     netY += mouseDisp.y * sqrt(sqrt(1 / (distFromMouse)) * 5);
        // }

        this.pos.x += netX;
        this.pos.y += netY;
    }
}

function moveNodes() {
    for(let i = 0; i < nodes.length; i++) {
        nodes[i].move();
    }
}


function drawNodes() {
    for(let i = 0; i < nodes.length; i++) {
        stroke(200);
        strokeWeight(1);
        for(let j = 0; j < nodes[i].pairs.length; j++) {
            line(nodes[i].pos.x, nodes[i].pos.y, nodes[i].pairs[j][0].pos.x, nodes[i].pairs[j][0].pos.y);
        }
    }
    for(let i = 0; i < nodes.length; i++) {
        strokeWeight(10);
        stroke(255);
        point(nodes[i].pos.x, nodes[i].pos.y);
        strokeWeight(8);
        stroke(0);
        point(nodes[i].pos.x, nodes[i].pos.y);
    }
}

function getAveragePos() {
    let totPos = createVector(0, 0);
    for(let i = 0; i < nodes.length; i++) {
        totPos.add(nodes[i].pos);
    }
    return totPos.div(nodes.length);
}

function centerNodes() {
    let avgPos = getAveragePos().copy();
    let disp = avgPos.sub(getCenter());
    for(let i = 0; i < nodes.length; i++) {
        nodes[i].pos.sub(disp);
    }
}

function getCenter() {
    return canvasSize.copy().div(2);
}

function jitterNodes() {
    for(let i = 0; i < nodes.length; i++) {
        nodes[i].pos.add(random(-10, 10), random(-10, 10));
    }
}

function draw() {
    background(0);
    for(let i = 0; i < speedSlider.value(); i++) {
        moveNodes();

    }

    centerNodes();
    drawNodes();

    if(nodeCount < nodeCountSlider.value()) {
        console.log("thing")
        let node = new Node(nodes.length);
        nodeCount++;
        node.moveToRandom();
        nodes.push(node);
        for(let j = 0; j < maxNodes; j++) {
            node.addFriend(nodes[floor(random()*nodes.length)], random(1,4));
        }
        jitterNodes();
    }
}