class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.board = new MyBoard(scene);
        this.pieces = [];
        this.tiles = [];

        this.boardState = [];

        this.selectedTile = null;

        // Deixar BaseA/BaseB + X como key ou alterar para as respetivas coordenadas?
        for(let i=1; i<=6; i++) {
            var currTile = new MyTile(scene, 0, i);
            var key = 0 + '-' + i;
            console.log(key);
            this.tiles[key] = currTile;
        }
        for(let i=1; i<=6; i++) {
            var currTile = new MyTile(scene, 7, i);
            var key = 7 + '-' + i;
            console.log(key);
            this.tiles[key] = currTile;
        }

        for(let i=1; i<=6; i++) {
            for(let j=1; j<=6; j++) {
                var currTile = new MyTile(scene, i, j);
                var key = i + '-' + j;
                console.log(key);
                this.tiles[key] = currTile;
            }
        }

        this.playerType = {
            'Human' : 0,
            'Machine' : 1
        };
        
        this.gameStates = {
            'Menu' : 0,
            'Next turn' : 1,
            'Select Piece' : 2,
            'Select Tile' : 3,
            'Check Win' : 4,
            'Win' : 5,

            'Undo' : 9,
            'Pause' :10
        }
        
        this.events = {
            'OnPVP' : 1,
            'OnPvM' : 2,
            'OnMvM' : 3,
            'OnPieceSelect' : 4,
            'OnTileSelect' : 5,
            'OnBoost' : 6,
            'OnReprogram' : 7,
            'OnWin' : 8,
            'OnUndo' : 9,
            'OnNext' : 10,
            'OnRematch' : 11,

            'OnPause' : 90,
            'Unpause' : 99
        }

        this.gameState = this.gameStates.Menu;
        this.playerA = this.playerType.Human;
        this.playerB = this.playerType.Human;

       // console.log(this.gameState);
        this.boardSetup();
        this.initialboard = [];

        this.initBuffers();
    }

    orchestrate(){
    }

    start(playerA, playerB){
        this.playerA = playerA;
        this.playerB = playerB;
        this.boardSetup();
        this.gameState = this.gameStates["Select Piece"];
    }

    update(t) {
        //animator update
    }

    display() {
        this.board.display();
        this.setupPickableGrid();
    }

    // tl;dr ID's (picking) das tiles das bases: 1,2,3,4,5,6 para jogador A e 71,72,73,74,75,76 para jogar B
    setupPickableGrid() {
        //setup player base tiles
        for(let i=0.5; i<6.5; i++) {
            this.scene.pushMatrix();
            // picking id only accepts numbers so player A base tiles will have this stupid ID with a single number 
            if(this.gameState ==  this.gameStates["Select Piece"] || this.gameState == this.gameStates["Select Tile"])
                this.scene.registerForPick(i+0.5, this.tiles['0-' + (i+0.5)]);
            this.scene.translate(i, 0.01, 0.5);
            this.tiles['0-' + (i+0.5)].display();
            this.scene.popMatrix();
        }
        for(let i=0.5; i<6.5; i++) {
            this.scene.pushMatrix();
            // picking id only accepts numbers so player A base tiles will have this stupid ID with a single number
            if(this.gameState ==  this.gameStates["Select Piece"] || this.gameState == this.gameStates["Select Tile"]) 
                this.scene.registerForPick(7*10 + i+0.5, this.tiles['7-' + (i+0.5)]);
            this.scene.translate(i, 0.01, 7.5);
            this.tiles['7-' + (i+0.5)].display();
            this.scene.popMatrix();
        }
        //setup playble tiles
        for(let i=1.5; i<7.5; i++) {
            for(let j=0.5; j<6.5; j++) {
                this.scene.pushMatrix();
                if(this.gameState ==  this.gameStates["Select Piece"] || this.gameState == this.gameStates["Select Tile"])
                    this.scene.registerForPick((i-0.5)*10 + j+0.5, this.tiles[(i-0.5) + '-' + (j+0.5)]);
                this.scene.translate(j, 0.01, i);
                this.tiles[(i-0.5) + '-' + (j+0.5)].display();
                this.scene.popMatrix(); 
            }
        }
    }

    boardSetup() {
        let piece;
        // Player A home-row
        piece = new MyPiece(this.scene,3);
        this.tiles['1-1'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,2);
        this.tiles['1-2'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,1);
        this.tiles['1-3'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,3);
        this.tiles['1-4'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,1);
        this.tiles['1-5'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,2);
        this.tiles['1-6'].setPiece(piece);
        // Player B home-row
        piece = new MyPiece(this.scene,1);
        this.tiles['6-1'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,3);
        this.tiles['6-2'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,2);
        this.tiles['6-3'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,2);
        this.tiles['6-4'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,3);
        this.tiles['6-5'].setPiece(piece);
        //
        piece = new MyPiece(this.scene,1);
        this.tiles['6-6'].setPiece(piece);

        this.updateBoardState();
        this.initialboard = this.boardState.slice();
        //console.log(this.initialboard);
    }

    clickHandler(obj, id) {
        if(this.selectedTile==null && obj.getPiece()!=null) {
            this.selectedTile = obj;
            this.gameState = this.gameStates["Select Tile"];
        }
        else if(this.selectedTile!=null && obj.getPiece()==null) {
            this.move(this.selectedTile.row, this.selectedTile.col, obj.row, obj.col);
            this.selectedTile = null;
            this.gameState = this.gameStates["Check Win"];
            this.checkWin();
            this.gameState = this.gameStates["Select Piece"];
        }
    }

    //TODO: ADD HOME ROWS AND CHECK IF THEY HAVE A PIECE
    checkWin(){

    }

    updateBoardState() {
        this.boardState = [];
        this.boardState.push([-1, -1, -1, -1, -1, -1]);
        for(let i=1; i<=6; i++) {
            let currRow = [];
            for(let j=1; j<=6; j++) {
                if(this.tiles[i + '-' + j].getPiece()==null) currRow.push(0);
                else currRow.push(this.tiles[i + '-' + j].getPiece().level);
            }
            this.boardState.push(currRow);
        }
        this.boardState.push([-2, -2, -2, -2, -2, -2]);
    }

    move(x1, y1, x2, y2) {
        console.log(this.boardState);
        valid_move(x1, y1, x2, y2, 1, this.boardState);
        if(this.tiles[x1 + '-' + y1].getPiece() != null) {
            if(this.tiles[x2 + '-' + y2].getPiece() == null) {
                this.tiles[x2 + '-' + y2].setPiece(this.tiles[x1 + '-' + y1].getPiece());
                this.tiles[x1 + '-' + y1].unsetPiece();
            }
        }
    }
}