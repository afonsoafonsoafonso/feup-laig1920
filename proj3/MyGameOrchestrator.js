class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.board = new MyBoard(scene);
        this.tiles = [];

        for(let i=1; i<=6; i++) {
            for(let j=1; j<=6; j++) {
                var currTile = new MyTile(scene, i, j);
                this.tiles.push(currTile);
            }
        }

        this.initBuffers();
    }

    display() {
        this.board.display();
        this.setupPickableGrid();
    }

    setupPickableGrid() {
        var c = 0;
        for(let i=0.5; i<6.5; i++) {
            for(let j=0.5; j<6.5; j++) {
                this.scene.pushMatrix();
                this.scene.registerForPick((i+0.5)*10 + j+0.5, this.tiles[c]);
                this.scene.translate(j, 0.01, i);
                this.tiles[c].display();
                this.scene.popMatrix(); 
                c++;
            }
        }
    }
}