let dimensions;
let letterSize;
let mainMargin;
let letterMargin;
let desiredLetters;
let input;
let canvasDims;
let currLetters;
let acceptedChars;

function setup() {

    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_',.? ";
    acceptedChars = [];
    for(let i = 0; i < chars.length; i++) {
        acceptedChars.push(chars[i]);
    }

    dimensions = createVector(15, 8);
    letterSize = createVector(16, 24);
    mainMargin = 20;
    letterMargin = 2;
    desiredLetters = Array(dimensions.x * dimensions.y).fill(' ');
    currLetters = [...desiredLetters];
    // currLetters = desiredLetters;
    input = createElement("textarea");
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

function updateLetters() {
    
    for(let i = 0; i < currLetters.length; i++) {
        if(desiredLetters[i] == currLetters[i]) {
            continue;
        }
        let ind = acceptedChars.indexOf(currLetters[i]);
        ind++;
        if(ind >= acceptedChars.length) {
            ind = 0;
        }
        currLetters[i] = acceptedChars[ind];
    }
}

function drawLetters() {
    strokeWeight(0);
    let posX = mainMargin;
    let posY = mainMargin;
    let xLetters = 0; 
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    for(let i = 0; i < desiredLetters.length; i++) {
        fill(0);
        rect(posX, posY, letterSize.x, letterSize.y);
        fill(255);
        text(currLetters[i], posX + letterSize.x/2, posY + letterSize.y/2);
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
    background(60);

    if(frameCount % 2 == 0) {
        updateLetters();
    }


    drawLetters();
    console.log(desiredLetters);
}