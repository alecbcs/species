function genBigPlant(board, pieces) {
    let tick = 0;
    let x = 0;
    let y = 0;
    let empty = false;

    do {
        if (tick > 100) {
            return;
        }
        empty = true;
        x = random(windowWidth-200) + 50;
        y = random(windowHeight-200) + 50;

        for (let j = -100; j < 100; j+=10) {
            for (let k = -100; k < 100; k+=10) {
                if (board["x:"+Math.floor((j+x)/10)+"|y:"+Math.floor((k+y)/10)] != null) {
                    empty = false;
                }
            }
        }
        tick++;
    } while (!empty);
    append(pieces, new Plant(board, x, y, true));
}

function genPlant(board, pieces) {
    let tick = 0;
    let x = 0;
    let y = 0;
    let empty = false;

    do {
        if (tick > 100) {
            return;
        }
        empty = true;
        x = random(windowWidth-200) + 50;
        y = random(windowHeight-200) + 50;

        for (let j = -60; j < 60; j+=10) {
            for (let k = -60; k < 60; k+=10) {
                if (board["x:"+Math.floor((j+x)/10)+"|y:"+Math.floor((k+y)/10)] != null) {
                    empty = false;
                }
            }
        }
        tick++;
    } while (!empty);
    append(pieces, new Plant(board, x, y, false));
}

let FRAMERATE = 30;
let board = {};
let pieces = [];
let babies = [];
let setupTime = 0;

function initializeSimulation() {
    if (setupTime < 70) {
        genBigPlant(board, pieces);
    }
    if (setupTime >= 70 && setupTime < 200) {
        genPlant(board, pieces);
    }
    if (setupTime >= 200) {
        append(pieces, new Individual(board, 
            random(windowWidth),random(windowHeight), 
            random(50)+25, random(50)+15,
            random(50)+50, random(100)+50,
            random(50)+50, random()+0.25,
            random(50)+50, random(50)+50));
    }
}

function setup() {
    frameRate(FRAMERATE);
    createCanvas(windowWidth, windowHeight);
 }
  
function draw() {
    clear();
    if (setupTime < 300) {
        if (setupTime % 10 == 0) {
            initializeSimulation();
        }
        for (let org in pieces) {
            pieces[org].tick();
            pieces[org].drawSelf();
        }
        setupTime++;
        return;
    }
    let dead = [];
    babies = [];
    let individual = false;
    for (let org in pieces) {
        if (pieces[org].dead) {
            append(dead, pieces[org]);
            continue;
        }
        if (pieces[org] instanceof Individual) {
            individual = true;
        }
        pieces[org].tick();
        pieces[org].drawSelf();
    }
    for (let org in babies) {
        append(pieces,babies[org]);
    }
    for (let org in dead) {
        delete(pieces, org);
    }
    if (!individual) {
        append(pieces, new Individual(board, 
            random(windowWidth),random(windowHeight), 
            random(50)+25, random(50)+15,
            random(50)+50, random(100)+50,
            random(50)+50, random()+0.25,
            random(50)+50, random(50)+50));
    }
}

function mouseClicked() {
    append(pieces, new Individual(board, 
        mouseX,mouseY, 
        random(50)+25, random(50)+15,
        random(50)+50, random(100)+50,
        random(50)+50, random()+0.25,
        random(50)+50, random(50)+50));
}