class Organism {
    constructor(board, x, y) {
        let xseq = [0,10,-10];
        let yseq = [10,0,-10];
        let xoff = 0;
        let yoff = 0;
        let i = 0;
        while (board["x:"+Math.floor((x+xoff)/10)+"|y:"+Math.floor((y+yoff)/10)] != null) {
            xoff = xseq[i%3] + Math.floor(i/9)*20;
            yoff = yseq[i%3] + Math.floor(i/9)*20;
            i++;
        }

        this.posX = int(x)+xoff;
        this.posY = int(y)+yoff;
        this.board = board;
        this.dead = false;
        this.time = 0;

        board["x:"+Math.floor((this.posX)/10)+"|y:"+Math.floor((this.posY)/10)] = this;
    }

    updatePos(x, y) {
        let loc = this.board["x:"+Math.floor((x)/10)+"|y:"+Math.floor((y)/10)];
        if (loc == null) {
            delete this.board["x:"+Math.floor((this.posX)/10)+"|y:"+Math.floor((this.posY)/10)];
            this.board["x:"+Math.floor((x)/10)+"|y:"+Math.floor((y)/10)] = this;
            this.posX = x;
            this.posY = y;
            return true;
        }
        if (loc == this) {
            this.posX = x;
            this.posY = y;
            return true;
        }
        return false;
    }

    remove() {
        delete this.board["x:"+Math.floor((this.posX)/10)+"|y:"+Math.floor((this.posY)/10)];
    }
}