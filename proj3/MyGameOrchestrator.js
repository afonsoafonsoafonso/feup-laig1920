class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.board = new MyBoard(scene);
        this.pieces = [];
        this.tiles = [];

        this.selectedTile = null;

        for(let i=1; i<=6; i++) {
            for(let j=1; j<=6; j++) {
                var currTile = new MyTile(scene, i, j);
                var key = i + '-' + j;
                console.log(key);
                this.tiles[key] = currTile;
            }
        }

        this.boardSetup();

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
                this.tiles[(i+0.5) + '-' + (j+0.5)].display();
                this.scene.popMatrix(); 
            }
        }
    }

    boardSetup() {
        let piece;
        // Player A home-row
        piece = new MyPiece(this.scene,3);
        //piece.setTile(this.tiles['1-1']);
        this.tiles['1-1'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,2);
        piece.setTile(this.tiles['1-2']);
        this.tiles['1-2'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,1);
        //piece.setTile(this.tiles['1-3']);
        this.tiles['1-3'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,3);
        //piece.setTile(this.tiles['141']);
        this.tiles['1-4'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,1);
        //piece.setTile(this.tiles['1-5']);
        this.tiles['1-5'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,2);
        //piece.setTile(this.tiles['1-6']);
        this.tiles['1-6'].setPiece(piece);
        // Player B home-row
        piece = new MyPiece(this.scene,1);
        //piece.setTile(this.tiles['6-1']);
        this.tiles['6-1'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,3);
        //piece.setTile(this.tiles['6-2']);
        this.tiles['6-2'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,2);
        //piece.setTile(this.tiles['6-3']);
        this.tiles['6-3'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,2);
        //piece.setTile(this.tiles['6-4']);
        this.tiles['6-4'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,3);
        //piece.setTile(this.tiles['6-5']);
        this.tiles['6-5'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,1);
        //piece.setTile(this.tiles['6-6']);
        this.tiles['6-6'].setPiece(piece);
    }

    clickHandler(obj, id) {
        if(this.selectedTile==null && obj.getPiece()!=null) {
            this.selectedTile = obj;
            console.log('11111111');
        }
        else if(this.selectedTile!=null && obj.getPiece()==null) {
            console.log('22222222');
            this.move(this.selectedTile.row, this.selectedTile.col, obj.row, obj.col);
            this.selectedTile = null;
        }

    }

    move(x1, y1, x2, y2) {
        if(this.tiles[x1 + '-' + y1].getPiece() != null) {
            if(this.tiles[x2 + '-' + y2].getPiece() == null) {
                this.tiles[x2 + '-' + y2].setPiece(this.tiles[x1 + '-' + y1].getPiece());
                this.tiles[x1 + '-' + y1].unsetPiece();
                
            }
        }
    }
}