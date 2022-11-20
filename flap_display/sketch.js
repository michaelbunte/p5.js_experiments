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


/* 

input -> desiredLetters -> currLetters

*/

let fontRegular;
function preload() {
    fontRegular = loadFont('monofonto_rg.otf')
}

function setup() {

    let chars = "abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_',.?";
    acceptedChars = [];
    for(let i = 0; i < chars.length; i++) {
        acceptedChars.push(chars[i]);
    }

    dimensions = createVector(15, 8);
    letterSize = createVector(14, 18);
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
    background(60);
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

    //text centering
    console.log("==============")
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

        console.log(leftSpaces + "  " + rightSpaces);
    }

    // for(let g = 0; g < desiredLetters.length; g++) {
    //     if(desiredLetters[g] == '\n') {
    //         desiredLetters[g] == ' ';
    //         console.log("replacing")
    //     }
    // }
    // console.log(desiredLetters);
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
    if(frameCount % 2 == 0) {
        if(updateLetters()) {
            background(60);
            drawLetters();
        }
    }
}