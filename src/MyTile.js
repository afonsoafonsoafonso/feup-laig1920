class MyTile extends CGFobject{
    constructor(scene, row, col) {
        super(scene);

        this.plane = new Plane(scene, 5, 5);
        this.row = row;
        this.col = col;
        this.piece = null;
        this.selected = false;
        this.boosted = false

        if((this.row + this.col) % 2 == 0) {
            this.transparent = new CGFappearance(scene);
            this.transparent.setAmbient(0, 0, 0, 0);
            this.transparent.setDiffuse(0, 0, 0, 0);
            this.transparent.setSpecular(0, 0, 0, 0);
            this.transparent.loadTexture('scenes/images/darkwood.jpg');
            this.transparent.setTextureWrap('REPEAT','REPEAT');
        } else {
            this.transparent = new CGFappearance(scene);
            this.transparent.setAmbient(1, 1, 1, 0);
            this.transparent.setDiffuse(1, 1, 1, 0);
            this.transparent.setSpecular(1, 1, 1, 0);
            this.transparent.loadTexture('scenes/images/lightwood.jpg');
            this.transparent.setTextureWrap('REPEAT','REPEAT');
        }
        this.black = new CGFappearance(scene);
        this.black.setAmbient(0, 0, 0, 0);
        this.black.setDiffuse(0, 0, 0, 0);
        this.black.setSpecular(0, 0, 0, 0);

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
        else {
            if(this.scene.gameOrchestrator.theme == "TableTop") 
            this.transparent.apply();
            else
            this.black.apply();
        }
        this.plane.display();
        if(this.piece!=null) this.piece.display();

    }
}