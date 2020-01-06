class MyTile extends CGFobject{
    constructor(scene, row, col) {
        super(scene);

        this.plane = new Plane(scene, 5, 5);
        this.row = row;
        this.col = col;
        this.piece = null;
        this.selected = false;
        this.boosted = false

        this.transparent = new CGFappearance(scene);
        this.transparent.setAmbient(0, 0, 0, 0);
        this.transparent.setDiffuse(0, 0, 0, 0);
        this.transparent.setSpecular(0, 0, 0, 0);
        this.transparent.loadTexture('scenes/images/transparent.png');
        this.transparent.setTextureWrap('REPEAT','REPEAT');

        this.picked = new CGFappearance(scene);
        this.picked.setAmbient(1, 0, 0, 0);
        this.picked.setDiffuse(0, 0, 0, 0);
        this.picked.setSpecular(0, 0, 0, 0);
        this.initBuffers();

        this.boostedmat = new CGFappearance(scene);
        this.boostedmat.setAmbient(0, 1, 0, 0);
        this.boostedmat.setDiffuse(0, 0, 0, 0);
        this.boostedmat.setSpecular(0, 0, 0, 0);
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
        if(this.selected) this.picked.apply();
        else if(this.boosted) this.boostedmat.apply();
        else this.transparent.apply();
        this.plane.display();
        if(this.piece!=null) this.piece.display();

    }
}