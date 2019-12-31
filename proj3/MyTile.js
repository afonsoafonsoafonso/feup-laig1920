class MyTile extends CGFobject{
    constructor(scene, row, col) {
        super(scene);

        this.plane = new Plane(scene, 5, 5);
        this.row = row;
        this.col = col;
        this.piece = null;

        this.transparent = new CGFappearance(scene);
        this.transparent.setAmbient(0, 0, 0, 0);
        this.transparent.setDiffuse(0, 0, 0, 0);
        this.transparent.setSpecular(0, 0, 0, 0);

        this.initBuffers();
    }

    setPiece(piece) {
        piece.setTile(this);
        this.piece = piece;
    }

    unsetPiece() {
        this.piece = null;
    }

    getPiece() {
        return this.piece;
    }

    display() {
        this.transparent.apply();
        this.plane.display();
        if(this.piece!=null) this.piece.display();
    }
}