let dimensions;
let letterSize;
let mainMargin;
let letterMargin;
let desiredLetters;
let input;
let canvasDims;
let currLetters;
function setup() {
    dimensions = createVector(10, 5);
    letterSize = createVector(16, 24);
    mainMargin = 20;
    letterMargin = 5;
    desiredLetters = Array(dimensions.x * dimensions.y).fill(' ');
    input = createInput('');
    input.input(myInputEvent);
    canvasDims = createVector(2 * mainMargin + letterSize.x * dimensions.x + letterMargin * (dimensions.x - 1), 
    2 * mainMargin + letterSize.y * dimensions.y + letterMargin * (dimensions.y - 1));    
    
    createCanvas(canvasDims.x, canvasDims.y);
}

function myInputEvent() {
    let i;
    for(i = 0; i < this.value().length && i < desiredLetters.length; i++) {
        desiredLetters[i] = this.value()[i];
    }
    for( ; i < desiredLetters.length; i++) {
        desiredLetters[i] = ' ';
    }
    
}

function drawLetters() {
    strokeWeight(0);
    let posX = mainMargin;
    let posY = mainMargin;
    let xLetters = 0; 
    textAlign(CENTER, CENTER);
    for(let i = 0; i < desiredLetters.length; i++) {
        fill(100);
        rect(posX, posY, letterSize.x, letterSize.y);
        fill(255);
        text(desiredLetters[i], posX + letterSize.x/2, posY + letterSize.y/2);

        posX += letterMargin + letterSize.x;
        xLetters++;
        if(xLetters >= dimensions.x) {
            posX = mainMargin;
            xLetters = 0;
            posY += letterMargin + letterSize.y;
        }
    }
}

function draw() {
    background(0);
    drawLetters();
}