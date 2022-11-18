
let nodes;
let nodeCount;
let canvasSize;
let unitLength;
function setup(){
    restart();
    createCanvas(canvasSize.x, canvasSize.y);
}

function restart() {
    canvasSize = createVector(400, 400);
    nodeCount = 10;
    nodes = [];
    unitLength = 10;
    
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
        this.pos = createVector(random(canvasSize.x), random(canvasSize.y));
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

    // move() {
    //     let netX = 0;
    //     let netY = 0;
    //     for(let i = 0; i < pairs.length; i++) {
    //         let dist = dist(this.pos.x, this.pos.y, this.pairs[i].pos.x, this.pairs[i].pos.y);

    //     }
    // }
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
  drawNodes();
}