class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.board = new MyBoard(scene);
        this.piece = new MyPiece(scene, 3);
        this.tiles = [];

        for(let i=1; i<=6; i++) {
            for(let j=1; j<=6; j++) {
                var currTile = new MyTile(scene, i, j);
                var key = i + '-' + j;
                console.log(key);
                this.tiles[key] = currTile;
            }
        }

        //boardSetup();

        this.initBuffers();
    }

    display() {
        this.board.display();
        this.setupPickableGrid();
    }

    setupPickableGrid() {
        for(let i=0.5; i<6.5; i++) {
            for(let j=0.5; j<6.5; j++) {
                this.scene.pushMatrix();
                this.scene.registerForPick((i+0.5)*10 + j+0.5, this.tiles[(i+0.5) + '-' + (j+0.5)]);
                this.scene.translate(j, 0.01, i);
                this.tiles[(i+0.5) + '-' + (j+0.5)].setPiece(this.piece);
                this.tiles[(i+0.5) + '-' + (j+0.5)].display();
                this.scene.popMatrix(); 
            }
        }
    }

}