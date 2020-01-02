class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.board = new MyBoard(scene);
        this.pieces = [];
        this.tiles = [];
        this.movegames = [[]];
        this.currMove=[];
        this.theme = false;
        this.chainMoves = [];

        this.animator = null;

        this.boardState = [];

        this.request = null;

        this.selectedTile = null;

        // Deixar BaseA/BaseB + X como key ou alterar para as respetivas coordenadas?
        for(let i=1; i<=6; i++) {
            var currTile = new MyTile(scene, 0, i);
            var key = 0 + '-' + i;
            //console.log(key);
            this.tiles[key] = currTile;
        }
        for(let i=1; i<=6; i++) {
            var currTile = new MyTile(scene, 7, i);
            var key = 7 + '-' + i;
            //console.log(key);
            this.tiles[key] = currTile;
        }

        for(let i=1; i<=6; i++) {
            for(let j=1; j<=6; j++) {
                var currTile = new MyTile(scene, i, j);
                var key = i + '-' + j;
                //console.log(key);
                this.tiles[key] = currTile;
            }
        }

        this.playerAturn = false;

        this.playerType = {
            'Human' : 0,
            'Machine' : 1
        };
        
        this.gameStates = {
            'Menu' : 0,
            'Next turn' : 1,
            'Select Piece' : 2,
            'Select Tile' : 3,
            'Chain Move' : 4,
            'Animation' : 5,
            'Check Win' : 6,
            'Win' : 7,

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

        this.printState();
        this.boardSetup();
        this.initialboard = [];

        

        this.initBuffers();
    }

    orchestrate(){
    }

    printState(){
        console.log("currently in ", this.gameState);
    }

    start(playerA, playerB){
        this.playerA = playerA;
        this.playerB = playerB;
        this.boardSetup();
        this.gameState = this.gameStates["Select Piece"];
        this.playerAturn = true;
        ping_server();
        this.printState();
    }

    update(t) {
        if(this.animator!=null) this.animator.currTime = t;
        if(this.animator==null) {this.animator = new MyAnimator(this.scene, this, t); console.log(t);}
        if(this.gameState == this.gameStates["Animation"]) {
            this.animator.update(t);
            if(this.animator.running==false) {
                this.animator.endAnimation();
                this.make_move();
            }
        }

    }

    display() {
        this.board.display();
        this.setupPickableGrid();
    }

    // tl;dr ID's (picking) das tiles das bases: 1,2,3,4,5,6 para jogador A e 71,72,73,74,75,76 para jogador B
    setupPickableGrid() {
        //setup player base tiles
        for(let i=0.5; i<6.5; i++) {
            this.scene.pushMatrix();
            // picking id only accepts numbers so player A base tiles will have this stupid ID with a single number 
            if(this.gameState ==  this.gameStates["Select Piece"] || this.gameState == this.gameStates["Select Tile"] || this.gameState != this.gameStates["Chain Move"])
                this.scene.registerForPick(i+0.5, this.tiles['0-' + (i+0.5)]);
            this.scene.translate(i, 0.01, 0.5);
            this.tiles['0-' + (i+0.5)].display();
            this.scene.popMatrix();
        }
        for(let i=0.5; i<6.5; i++) {
            this.scene.pushMatrix();
            // picking id only accepts numbers so player A base tiles will have this stupid ID with a single number
            if(this.gameState ==  this.gameStates["Select Piece"] || this.gameState == this.gameStates["Select Tile"] || this.gameState != this.gameStates["Chain Move"]) 
                this.scene.registerForPick(7*10 + i+0.5, this.tiles['7-' + (i+0.5)]);
            this.scene.translate(i, 0.01, 7.5);
            this.tiles['7-' + (i+0.5)].display();
            this.scene.popMatrix();
        }
        //setup playble tiles
        for(let i=1.5; i<7.5; i++) {
            for(let j=0.5; j<6.5; j++) {
                this.scene.pushMatrix();
                if(this.gameState ==  this.gameStates["Select Piece"] || this.gameState == this.gameStates["Select Tile"] || this.gameState != this.gameStates["Chain Move"])
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

        //this.updateBoardState();
        //this.initialboard = this.boardState.slice();
        //console.log(this.initialboard);
    }

    undo(){
        this.currMove = [];
        this.loadBoardState();
        if (this.gameState == this.gameStates["Next turn"])
            this.gameState = this.gameStates["Select Piece"];
    }
    
    nextTurn(){
        this.currMove = [];
        if(this.movegames.length < 2) {
            console.log("Joga primeiro Boi, Ainda é a tua vez, conas.")
            return
        }

        this.playerAturn = !this.playerAturn;
        this.gameState = this.gameStates["Select Piece"];
        this.movegames = [[]];
    }

    clickHandler(obj, id) {
        console.log("CLICK HANDLER");
        if(this.selectedTile == null && obj.getPiece()!=null && this.gameState != this.gameStates["Chain Move"]) {
            this.selectedTile = obj;
            this.gameState = this.gameStates["Select Tile"];
            this.printState();
        }
        else if(this.selectedTile!=null && obj.getPiece()==null && this.gameState != this.gameStates["Chain Move"]) {
            this.move(this.selectedTile.row, this.selectedTile.col, obj.row, obj.col);
            this.selectedTile = null;
        }
        else if(this.selectedTile!=null && obj.getPiece()!=null && this.gameState != this.gameStates["Chain Move"]) {
            console.log("ADWWADWD1");
            this.gameState = this.gameStates["Chain Move"];
            this.chainMoves.push([this.selectedTile.row, this.selectedTile.col]);
            this.chainMoves.push([obj.row, obj.col]);
        }
        else if(this.gameState == this.gameStates["Chain Move"] && obj.getPiece()!=null) {
            console.log("ADWWADWD2");
            this.chainMoves.push([obj.row, obj.col]);
            console.log(this.chainMoves);
        }
        else if(this.gameState == this.gameStates["Chain Move"] && obj.getPiece()==null) {
            console.log("ADWWADWD3");
            console.log("EXECUTAR CHAIN MOVE DO ESTRONDO\n");
        }
    }

    //TODO: AND CHECK IF THEY HAVE A PIECE
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
        this.movegames.push(this.boardState);
    }

    loadBoardState() {
        //console.log("Moves: ", this.movegames);
        if (this.movegames.length < 2)
            return;
        let previous = this.movegames.pop();
        //console.log(previous);
        
        for(let i=1; i<=6; i++) {           
            for(let j=0; j<=5; j++) {
                //console.log(i,j,previous[i][j]);
                //this.tiles[i + '-' + j].unsetPiece();
                if(previous[i][j] != 0){
                    switch(previous[i][j]){
                        case 1:
                            var piece = new MyPiece(this.scene, 1);
                            this.tiles[i + '-' + (j+1)].setPiece(piece);
                            break;
                        case 2:
                            var piece = new MyPiece(this.scene, 2);
                            this.tiles[i + '-' + (j+1)].setPiece(piece);
                            break;
                        case 3:
                            var piece = new MyPiece(this.scene, 3);
                            this.tiles[i + '-' + (j+1)].setPiece(piece);
                            break;     
                    }
                } else this.tiles[i + '-' + (j+1)].unsetPiece();
                    
            }
        }
    }

    move(x1, y1, x2, y2) {
        this.currMove = [];
        this.currMove.push(x1, y1, x2, y2);
        if(this.tiles[x1 + '-' + y1].getPiece() != null) {
            //console.log(this.boardState);
            //this.animator.calculate_animation(x1, y1, x2, y2);
            //this.animator.setAnimation(this.tiles[x1 + '-' + y1]);
            
            let player = 1;
            if (!this.playerAturn)  player = 2;
            // y's subtraidos por um pois no prolog as colunas começam a zero, mesmo na playable área
            this.updateBoardState();
            // checks if move is valid. make_move then handles prolog request result
            valid_move(x1, y1-1, x2, y2-1, player, this.boardState, data => this.make_move_animation(data));
        }
    }

    make_move_animation(data) {
        
        //this.tiles[x1 + '-' + y1].getPiece().ongoingAnimation = true;
        if(data.target.response==1) {

            var x1 = this.currMove[0];
            var y1 = this.currMove[1];
            var x2 = this.currMove[2];
            var y2 = this.currMove[3];
            this.gameState = this.gameStates.Animation;
            this.printState();
            // Fazer a animação 
            this.animator.calculate_animation(this.tiles[x1 + '-' + y1].getPiece(), x1, y1, x2, y2);
            this.animator.setAnimation(this.tiles[x1 + '-' + y1].getPiece());            
        } else {
            this.currMove = [];
            this.gameState = this.gameStates["Select Piece"];
            this.printState();
        }
    }

    make_move() {
        var x1 = this.currMove[0];
        var y1 = this.currMove[1];
        var x2 = this.currMove[2];
        var y2 = this.currMove[3];
        if(this.tiles[x1 + '-' + y1].getPiece() != null) {
            if(this.tiles[x2 + '-' + y2].getPiece() == null) {
                this.tiles[x2 + '-' + y2].setPiece(this.tiles[x1 + '-' + y1].getPiece());
                this.tiles[x1 + '-' + y1].unsetPiece();
            }
        }
        this.gameState = this.gameStates["Check Win"];
        this.printState();
        this.checkWin();
        this.gameState = this.gameStates["Next turn"];
        this.printState();
        this.animator = null;
    }
}