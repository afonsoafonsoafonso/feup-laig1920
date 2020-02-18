class Move {
    constructor(type, x1, y1, x2, y2, x3=null, y3=null) {
        // type -> 0: move normal ; 1: reprogram ; 2: rocket boost
        this.type = type;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
    }
}