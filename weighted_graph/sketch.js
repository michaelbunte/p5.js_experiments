
let nodes;
let nodeCount;
let canvasSize;
let unitLength;
function setup(){
    restart();
    createCanvas(canvasSize.x, canvasSize.y);
}

function restart() {
    canvasSize = createVector(800, 400);
    nodeCount = 10;
    nodes = [];
    unitLength = 30;
    
    for(let i = 0; i < nodeCount; i++) {
        let node = new Node(i);
        node.moveToRandom();
        nodes.push(node);
    }

    let maxNodes = 2;

    for(let i = 0; i < nodeCount; i++) {
        for(let j = 0; j < maxNodes; j++) {
            nodes[i].addFriend(nodes[floor(random()*nodes.length)], random(5));
        }
    }
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
        this.pos = createVector(random(-halfX/2, halfX/2) + halfY, random(-halfY/2,halfY/2) + halfY);
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

            let angle
            if(this.pos.x -  this.pairs[i][0].pos.x != 0) {
                angle = atan((this.pos.y - this.pairs[i][0].pos.y) / (this.pos.x -  this.pairs[i][0].pos.x));
            } else {
                angle = 0;
            }
            if(this.pos.x > this.pairs[i][0].pos.x) {
                angle += 180;
            }
            console.log(angle);
            let gap = udist - this.pairs[i][1] * unitLength;
            let minigap = abs(gap) * 0.1
            if(gap > 0) {
                netX += cos(angle) * minigap;
                netY += sin(angle) * minigap;
            } else {
                netX -= cos(angle) * minigap;
                netY -= sin(angle) * minigap;
            }
            console.log(netX);
            // console.log(angle);
            // console.log(gap);
            // if(gap > 0) {
            //     netX += cos(angle) * abs(gap) * 0.01;
            //     netY += sin(angle) * abs(gap) * 0.01;
            // }
        }
        
        this.pos.x += netX;
        this.pos.y += netY;
    }
}

function moveNodes() {
    for(let i = 1; i < nodes.length; i++) {
        nodes[i].move();
    }
}


function drawNodes() {
    stroke(0);
    for(let i = 0; i < nodes.length; i++) {
        strokeWeight(1);
        for(let j = 0; j < nodes[i].pairs.length; j++) {
            line(nodes[i].pos.x, nodes[i].pos.y, nodes[i].pairs[j][0].pos.x, nodes[i].pairs[j][0].pos.y);
        }
        strokeWeight(10);
        point(nodes[i].pos.x, nodes[i].pos.y);
    }
}

function draw() {
    background(255);
    moveNodes();
    // nodes[1].pairs = [];
    // nodes[1].addFriend(nodes[0], 3);
    // nodes[0].move();
    // nodes[1].move();
    // nodes[2].move();
    drawNodes();
}