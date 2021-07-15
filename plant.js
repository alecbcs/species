class Leaf extends Organism {
    constructor(board, x, y) {
        super(board, x, y);
        this.grown = false;
        this.lifecycle = 0;
    }

    drawSelf() {
        stroke(220, 120, 150);
        fill(220, 120, 150);
        if (this.time < 10) {
            ellipse(this.posX, this.posY, this.time, this.time);
            this.time++;
            if (this.time >= 10) {
                this.grown = true;
                this.lifecycle = 0;
            }
            return;
        }
        if (this.grown) {
            // Draw leaf on canvas.
            ellipse(this.posX, this.posY, 10, 10);
        }
    }

    tick() {
        if (!this.grown) {
            this.lifecycle++;
            if ((this.lifecycle + 10) > FRAMERATE*5) {
                this.time = 0;
            }
            if (this.grown == false && this.lifecycle > FRAMERATE*5) {
                this.lifecycle = 0;
                this.grown = true;
            }
        }
    }

    eat() {
        this.grown = false;
        return 15;
    }

    isGrown() {
        return this.grown;
    }
}

class Branch extends Organism {
    constructor(board, x, y) {
        super(board, x, y);
        this.leaves = [];

        let xoffset = [-25,0,25,0];
        let yoffset = [0,25,0,-25];
        for (let i = 0; i < 4; i++) {
            append(this.leaves, new Leaf(board, this.posX+xoffset[i], this.posY+yoffset[i]));
        }
    }

    tick() {
        for (let leaf in this.leaves) {
            this.leaves[leaf].tick();
        }
    }

    drawSelf() {
        stroke(40,60,60);
        fill(40,60,60);
        if (this.time < 40) {
            ellipse(this.posX, this.posY, this.time, this.time);
            this.time++;
            return;
        }
        ellipse(this.posX, this.posY, 40, 40);
        for (let leaf in this.leaves) {
            this.leaves[leaf].drawSelf();
        }

    }
}

class Plant extends Organism {
    constructor(board, x, y, isLarge) {
        super(board, x, y);
        this.isLarge = boolean(isLarge);
        this.branches = []

        if (this.isLarge) {
            let xoffset = [-55, 0, 55, 0];
            let yoffset = [0, 55, 0, -55];
            for (let i = 0; i < 4; i++) {
                append(this.branches, new Branch(board, this.posX+xoffset[i], this.posY+yoffset[i]));
            }
        } else {
            append(this.branches, new Branch(board, this.posX, this.posY));
        }
    }

    tick() {
        for (let branch in this.branches) {
            this.branches[branch].tick();
        }
    }

    drawSelf() {
        if (this.isLarge) {
            // Set point color.
            stroke(80,120,160);
            fill(80,120,160);
            if (this.time < 75) {
                ellipse(this.posX, this.posY, this.time, this.time);
                this.time++;
                return;
            }
            // Draw point on canvas.
            ellipse(this.posX, this.posY, 75, 75);
        }
        for (let branch in this.branches) {
            this.branches[branch].drawSelf();
        }
    }
}