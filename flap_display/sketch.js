let dimensions;
let letterSize;
let mainMargin;
let letterMargin;
let desiredLetters;
let input;
let canvasDims;
let currLetters;
let acceptedChars;
let wrapTextCheck;
let wrapText;
let backgroundColor;


/* 

input -> desiredLetters -> currLetters

*/

let fontRegular;
function preload() {
    fontRegular = loadFont('monofonto_rg.otf')
}

function setup() {

    let chars = "abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_',.?:";
    acceptedChars = [];
    for(let i = 0; i < chars.length; i++) {
        acceptedChars.push(chars[i]);
    }

    backgroundColor = color(60, 60, 50);

    dimensions = createVector(15, 8);
    letterSize = createVector(14, 19);
    mainMargin = 20;
    letterMargin = 2;
    desiredLetters = Array(dimensions.x * dimensions.y).fill(' ');
    currLetters = [...desiredLetters];
    
    input = createElement("textarea");
    input.input(myInputEvent);

    wrapTextCheck = createCheckbox("check me", false);
    wrapTextCheck.changed(toggleWrapText);
    wrapText = false;

    canvasDims = createVector(2 * mainMargin + letterSize.x * dimensions.x + letterMargin * (dimensions.x - 1), 
    2 * mainMargin + letterSize.y * dimensions.y + letterMargin * (dimensions.y - 1));    
    
    createCanvas(canvasDims.x, canvasDims.y);
    textFont(fontRegular);
    textSize(20);
    background(backgroundColor);
    drawLetters();
}

function myInputEvent() {
    let i;
    for(i = 0; i < this.value().length && i < desiredLetters.length; i++) {
        desiredLetters[i] = this.value()[i];
    }
    for( ; i < desiredLetters.length; i++) {
        desiredLetters[i] = ' ';
    }
    
    reformatText();
}

function inputTime() {
    let d = new Date();
    let timeString = `the time is\n${d.getHours().toString()}:${d.getMinutes().toString()}:${d.getSeconds().toString()}`;
    let i;
    for(i = 0; i < timeString.length && i < desiredLetters.length; i++) {
        desiredLetters[i] = timeString[i];
    }
    for( ; i < desiredLetters.length; i++) {
        desiredLetters[i] = ' ';
    }
    reformatText();
}

function reformatText() {
    // newline handling
    for(let g = 0; g < desiredLetters.length; g++) {
        if(desiredLetters[g] == '\n') {
            let spaces = dimensions.x - g % dimensions.x - 1;
            if(spaces == dimensions.x - 1) {
                desiredLetters.splice(g, 1);
                desiredLetters.push(' ');
                g--;
            } else {
                desiredLetters[g] = ' ';
                for(let j = 0; j < spaces; j++) {
                    desiredLetters.splice(g, 0, ' ');
                    desiredLetters.pop();
                }
            }
        }
    }

    //horizontal text centering
    for(let g = 0; g < desiredLetters.length; g+=dimensions.x) { 
        let leftSpaces = 0;
        for( ; leftSpaces < dimensions.x; leftSpaces++) {
            if(desiredLetters[leftSpaces + g] != ' ') {
                break;
            }
        }
        let rightSpaces = 0;
        for( ; rightSpaces < dimensions.x; rightSpaces++) {
            if(desiredLetters[g + dimensions.x - 1 - rightSpaces] != ' ') {
                break;
            }
        }

        let center = floor((rightSpaces + leftSpaces) / 2);

        for(let z = 0; z < center - leftSpaces; z++) {
            desiredLetters.splice(g, 0, ' ');
            desiredLetters.splice(g + dimensions.x - 1, 1);
        }
    }

    //vertical text centering
    let topSpaces = 0
    let doBreak = false;
    for(let g = 0; g < desiredLetters.length; g+=dimensions.x) { 
        for(let h = 0; h < dimensions.x; h++) {
            if(desiredLetters[g + h] != ' ') {
                doBreak = true;
                break;
            }
        }
        if(doBreak) {
            break;
        }
        topSpaces++;
    }
    let bottomSpaces = 0
    doBreak = false;
    for(let g = desiredLetters.length - dimensions.x; g >= 0; g-=dimensions.x) { 
        for(let h = 0; h < dimensions.x; h++) {
            if(desiredLetters[g + h] != ' ') {
                doBreak = true;
                break;
            }
        }
        if(doBreak) {
            break;
        }
        bottomSpaces++;
    }

    let center = floor((bottomSpaces + topSpaces) / 2);
    console.log(center - topSpaces);
    for(let z = 0; z < center - topSpaces; z++) {
        for(let u = 0; u < dimensions.x; u++) {
            desiredLetters.splice(0, 0, ' ');
            desiredLetters.pop();
        }
    }
}

function toggleWrapText() {
    wrapText = !wrapText;
}

function updateLetters() {
    let changed = false;
    for(let i = 0; i < currLetters.length; i++) {
        if(desiredLetters[i] == currLetters[i]) {
            continue;
        } 
        changed = true;
        let ind = acceptedChars.indexOf(currLetters[i]);
        ind++;
        if(ind >= acceptedChars.length) {
            ind = 0;
        }
        currLetters[i] = acceptedChars[ind];
    }
    return changed;
}

function drawLetters() {
    let posX = mainMargin;
    let posY = mainMargin;
    let xLetters = 0; 
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    strokeCap(SQUARE);
    for(let i = 0; i < desiredLetters.length; i++) {
        strokeWeight(0);
        fill(0);
        rect(posX, posY, letterSize.x, letterSize.y / 2 + 1);
        fill(30);
        rect(posX, posY + letterSize.y / 2 + 1, letterSize.x, letterSize.y / 2 - 1);

        fill(255);
        text(currLetters[i], posX + letterSize.x/2, posY + letterSize.y/2 - 2);

        stroke(0);
        strokeWeight(1);
        line(posX, posY + letterSize.y / 2 + 1, posX + letterSize.x, posY + letterSize.y / 2 + 1);

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

    // inputTime();
    if(frameCount % 2 == 0) {
        if(updateLetters()) {
            background(backgroundColor);
            drawLetters();
        }
    }

}