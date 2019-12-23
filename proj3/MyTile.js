class MyTile extends CGFobject{
    constructor(scene, row, col) {
        super(scene);

        this.plane = new Plane(scene, 5, 5);
        this.row = row;
        this.col = col;
        this.piece = null;

        this.initBuffers();
    }

    setPiece(piece) {
        this.piece = piece;
    }

    unsetPiece() {
        this.piece = null;
    }

    getPiece() {
        return this.piece;
    }

    display() {
        this.plane.display();
    }
}