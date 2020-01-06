class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.board = new MyBoard(scene);
        this.pieces = [];
        this.pieceModels = [];
        this.pieceModels.push(new MyPieceModel(this.scene, 1));
        this.pieceModels.push(new MyPieceModel(this.scene, 2));
        this.pieceModels.push(new MyPieceModel(this.scene, 3));
        this.tiles = [];
        this.movegames = [[]];
        this.currMove=[];
        this.currMoves = [];
        this.theme = "space";
        this.chainMoves = [];
        this.validChainMove = false;

        this.cpu_moves = [];

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
            'Choice' : 5,
            'Animation' : 6,
            'Check Win' : 7,
            
            'Win' : 8,

            'Undo' : 9,
            'Pause' : 10,
            'Boost' : 11,
            'Reprogram' : 12,

            'CPU Turn' : 13
        }

        this.themes = {
            'Space' : "Space",
            'TableTop' : "TableTop"
        }

        this.gameState = this.gameStates.Menu;
        this.totalSeconds;
        this.playerAScore = 0;
        this.playerBScore = 0;

        this.printState();
        this.boardSetup();
        this.initialboard = [];

        this.timerVar = setInterval(this.countTimer, 1000);

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
        this.playerAturn = true;
        document.getElementById("playerAScore").className = "turn";
        if(this.playerA == this.playerType.Human) this.gameState = this.gameStates["Select Piece"];
        else {
            this.gameState = this.gameStates["CPU Turn"];
            this.cpu_turn(false, 0);
        }
        this.scene.setCamera("playerA");
        
        ping_server();
        this.printState();
    }

    restart(playerA, playerB){
        this.clearAll();
        this.playerA = playerA;
        this.playerB = playerB;
        this.boardSetup();
        this.playerAturn = true;
        document.getElementById("playerAScore").className = "turn";
        document.getElementById("playerBScore").className = null;
        if(this.playerA == this.playerType.Human) this.gameState = this.gameStates["Select Piece"];
        else {
            this.gameState = this.gameStates["CPU Turn"];
            this.cpu_turn(false, 0);
        }
        this.scene.setCamera("playerA");
        ping_server();
        this.printState();
    }

    clearAll(){
        this.movegames = [[]];
        this.currMove=[];
        this.currMoves=[];
        this.theme = false;
        this.chainMoves = [];
        this.validChainMove = false;
        this.cpu_moves = [];
        this.animator = null;
        this.boardState = [];
        this.request = null;
        this.selectedTile = null;
        this.clearSelects();
        for(let i=0; i<=7; i++)
            for(let j=1; j<=6; j++) 
                if(this.tiles[i + '-' + j].getPiece()!=null)
                    this.tiles[i + '-' + j].unsetPiece();       
    }

    clearSelects(){
        for(let i=0; i<=7; i++)
            for(let j=1; j<=6; j++){
                this.tiles[i + '-' + j].selected = false;
                this.tiles[i + '-' + j].boosted = false;
            }
    }

    update(t) {
        if(this.animator!=null) this.animator.currTime = t;
        if(this.animator==null) {this.animator = new MyAnimator(this.scene, this, t);}
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

    countTimer() {
        if(this.totalSeconds == null)
            this.totalSeconds = 1;
        this.totalSeconds++;
        let minute = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds - (minute * 60);
        if(minute < 10)
            minute = "0" + minute;
        if(seconds < 10)
            seconds = "0" + seconds;
        document.getElementById("timer").innerHTML = "Timer : "+ minute + ":" + seconds;
       
    }

    // tl;dr ID's (picking) das tiles das bases: 1,2,3,4,5,6 para jogador A e 71,72,73,74,75,76 para jogador B
    setupPickableGrid() {
        //setup player base tiles
        for(let i=0.5; i<6.5; i++) {
            this.scene.pushMatrix();
            // picking id only accepts numbers so player A base tiles will have this stupid ID with a single number 
            if(this.gameState ==  this.gameStates["Select Piece"] || this.gameState == this.gameStates["Select Tile"] || this.gameState == this.gameStates["Boost"] || this.gameState == this.gameStates["Reprogram"])
                this.scene.registerForPick(i+0.5, this.tiles['0-' + (i+0.5)]);
            this.scene.translate(i, 0.01, 0.5);
            this.tiles['0-' + (i+0.5)].display();
            this.scene.popMatrix();
        }
        for(let i=0.5; i<6.5; i++) {
            this.scene.pushMatrix();
            // picking id only accepts numbers so player A base tiles will have this stupid ID with a single number
            if(this.gameState ==  this.gameStates["Select Piece"] || this.gameState == this.gameStates["Select Tile"] || this.gameState == this.gameStates["Boost"] || this.gameState == this.gameStates["Reprogram"]) 
                this.scene.registerForPick(7*10 + i+0.5, this.tiles['7-' + (i+0.5)]);
            this.scene.translate(i, 0.01, 7.5);
            this.tiles['7-' + (i+0.5)].display();
            this.scene.popMatrix();
        }
        //setup playble tiles
        for(let i=1.5; i<7.5; i++) {
            for(let j=0.5; j<6.5; j++) {
                this.scene.pushMatrix();
                if(this.gameState ==  this.gameStates["Select Piece"] || this.gameState == this.gameStates["Select Tile"] || this.gameState == this.gameStates["Boost"] || this.gameState == this.gameStates["Reprogram"])
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
        piece = new MyPiece(this.scene, this.pieceModels, 3);
        this.tiles['1-1'].setPiece(piece);
        //
        piece = new MyPiece(this.scene, this.pieceModels, 2);
        this.tiles['1-2'].setPiece(piece);
        //
        piece = new MyPiece(this.scene, this.pieceModels, 1);
        this.tiles['1-3'].setPiece(piece);
        //
        piece = new MyPiece(this.scene, this.pieceModels, 3);
        this.tiles['1-4'].setPiece(piece);
        //
        piece = new MyPiece(this.scene, this.pieceModels, 1);
        this.tiles['1-5'].setPiece(piece);
        //
        piece = new MyPiece(this.scene, this.pieceModels, 2);
        this.tiles['1-6'].setPiece(piece);
        // Player B home-row
        piece = new MyPiece(this.scene, this.pieceModels, 1);
        this.tiles['6-1'].setPiece(piece);
        //
        piece = new MyPiece(this.scene, this.pieceModels, 3);
        this.tiles['6-2'].setPiece(piece);
        //
        piece = new MyPiece(this.scene, this.pieceModels, 2);
        this.tiles['6-3'].setPiece(piece);
        //
        piece = new MyPiece(this.scene, this.pieceModels, 2);
        this.tiles['6-4'].setPiece(piece);
        //
        piece = new MyPiece(this.scene, this.pieceModels, 3);
        this.tiles['6-5'].setPiece(piece);
        //
        piece = new MyPiece(this.scene, this.pieceModels, 1);
        this.tiles['6-6'].setPiece(piece);

        //this.updateBoardState();
        //this.initialboard = this.boardState.slice();
        //console.log(this.initialboard);
    }

    undo(){
        this.currMove = [];
        this.currMoves = [];
        this.selectedTile = null;
        this.loadBoardState();
        this.gameState = this.gameStates["Select Piece"];
    }
    
    nextTurn(){
        this.cpu_moves = [];
        if(this.gameState != this.gameStates.Animation){
            this.currMove = [];
            this.currMoves=[];
            if(((this.playerAturn && this.playerA == this.playerType.Human) || (!this.playerAturn && this.playerB == this.playerType.Human)) && this.movegames.length < 2) {
                console.log("Joga primeiro Boi, Ainda é a tua vez, conas.")
                return
            }
            this.playerAturn = !this.playerAturn;
            if(this.playerAturn /*&& this.playerA == this.playerType.Human*/){
                document.getElementById("playerAScore").className = "turn";
                document.getElementById("playerBScore").className = null;
                this.scene.setCamera("playerA");
            }
            else if(!this.playerAturn /*&& this.playerB == this.playerType.Human*/){
                document.getElementById("playerBScore").className = "turn";
                document.getElementById("playerAScore").className = null;
                this.scene.setCamera("playerB");
            }
            this.selectedTile = null;
            if((this.playerAturn && this.playerA == this.playerType.Human) || (!this.playerAturn && this.playerB == this.playerType.Human))
                    this.gameState = this.gameStates["Select Piece"];
            else {
                console.log("PAOWNDOAWNDOAWNODNAWOIDN");
                this.gameState = this.gameStates["CPU Turn"];
                this.cpu_turn(false, 0);
            }
            this.movegames = [[]];
        }
    }

    clickHandler(obj, id) {
        if(this.selectedTile == null && obj.getPiece()!=null && this.gameState != this.gameStates["Boost"] && this.gameState != this.gameStates["Reprogram"]) {
            this.selectedTile = obj;
            this.selectedTile.selected = true;
            console.log("12");
            console.log(obj);
            this.gameState = this.gameStates["Select Tile"];
            this.printState();
        }
        else if(obj != this.selectedTile &&this.selectedTile!=null && obj.getPiece()==null && this.gameState != this.gameStates["Boost"] && this.gameState != this.gameStates["Reprogram"]) {
            this.move(this.selectedTile.row, this.selectedTile.col, obj.row, obj.col);
            this.selectedTile.selected = false;
            this.selectedTile = null;
        }
        else if(this.selectedTile!=null && obj.getPiece()!=null) {
            let player;
            if(this.playerAturn) player=1;
            else player=2;
            this.updateBoardState();
            let len = this.chainMoves.length;
            if(this.gameState != this.gameStates['Boost']) { 
                valid_move(this.selectedTile.row, this.selectedTile.col-1, obj.row, obj.col-1, player, this.boardState, data => this.chain_choice(data, this.selectedTile.row, this.selectedTile.col, obj.row, obj.col, obj));
            }
            else {
                this.currMoves.push(new Move(2, this.selectedTile.row, this.selectedTile.col, this.chainMoves[len-1][0], this.chainMoves[len-1][1], obj.row, obj.col));
                valid_chain_move(this.selectedTile.row, this.selectedTile.col-1, this.chainMoves[len-1][0], this.chainMoves[len-1][1]-1, obj.row, obj.col-1, player, this.boardState, 2, data => this.chain_choice(data, this.selectedTile.row, this.selectedTile.col, obj.row, obj.col, obj));
            }
        }
        else if(obj != this.selectedTile && this.gameState == this.gameStates['Boost'] && obj.getPiece()!=null) {
            let len = this.chainMoves.length;
            let P;
            if(this.playerAturn) P=1;
            else P=2;
            //if chain move is valid, pushes it to the array
            this.updateBoardState();
            let noPiece = false;
            console.log("Push aqui alooooooooooooooooooooooooooooooooooo??");
            this.currMoves.push(new Move(2, this.selectedTile.row, this.selectedTile.col, this.chainMoves[len-1][0], this.chainMoves[len-1][1], obj.row, obj.col));
            valid_chain_move(this.selectedTile.row, this.selectedTile.col-1, this.chainMoves[len-1][0], this.chainMoves[len-1][1]-1, obj.row, obj.col-1, P, this.boardState, 2, data=>this.rocket_boost(data, this.selectedTile.row, this.selectedTile.col, this.chainMoves[len-1][0], this.chainMoves[len-1][1], obj.row, obj.col, noPiece));
        }
        else if(obj != this.selectedTile && this.gameState == this.gameStates['Boost'] && obj.getPiece()==null) {
            let P;
            if(this.playerAturn) P=1;
            else P=2;
            let len = this.chainMoves.length;
            //if chain move
            this.updateBoardState();
            let noPiece = true;
            valid_chain_move(this.selectedTile.row, this.selectedTile.col-1, this.chainMoves[len-1][0], this.chainMoves[len-1][1]-1, obj.row, obj.col-1, P, this.boardState, 2, data=>this.rocket_boost(data, this.selectedTile.row, this.selectedTile.col, this.chainMoves[len-1][0], this.chainMoves[len-1][1], obj.row, obj.col, noPiece));
        }
        else if(obj != this.selectedTile &&this.gameState == this.gameStates['Reprogram'] && obj.getPiece()==null) {
            let P;
            if(this.playerAturn) P=1;
            else P=2;
            let len = this.chainMoves.length;
            this.updateBoardState();
            valid_chain_move(this.selectedTile.row, this.selectedTile.col-1, this.chainMoves[len-1][0], this.chainMoves[len-1][1]-1, obj.row, obj.col-1, P, this.boardState, 1, data=>this.reprogram_coordinates(data, this.selectedTile.row, this.selectedTile.col, this.chainMoves[len-1][0], this.chainMoves[len-1][1], obj.row, obj.col));
        }
    }

    //TODO: AND CHECK IF THEY HAVE A PIECE
    checkWin(){
        this.updateBoardState();
        if(this.playerAturn) end_game_A(this.boardState, data=>this.game_over("a",data));
        else end_game_B(this.boardState, data=>this.game_over("b",data));
    }

    game_over(player,data) {
        if(data.target.response==1) {
            console.log("GAME OVER BOYS");
            this.updateScore(player);
        } else this.movegames.pop();
    }

    updateScore(player){
        if(player == "a")
            document.getElementById("playerAScore").innerHTML = "Player A : " + ++this.playerAScore;
        else
            document.getElementById("playerBScore").innerHTML = "Player B : " + ++this.playerBScore;
    }

    chooseBoost(){
        if(this.gameState == this.gameStates.Choice)
            this.gameState = this.gameStates.Boost; 
        this.printState();
    }
    chooseReprogram(){
        if(this.gameState == this.gameStates.Choice)
            this.gameState = this.gameStates.Reprogram;
        this.printState();
    }

    chain_choice(data, x1, y1, x2, y2, tile) {
        if(data.target.response==1) {
            tile.boosted = true;
            console.log("Press M for Rocket Boost or J for Reprogram Coordinates");
            this.chainMoves.push([x1, y1]);
            this.chainMoves.push([x2,  y2]);
            this.gameState = this.gameStates.Choice;
        }
        else {
            this.clearSelects();
            this.selectedTile = null;
            this.currMove = [];
            this.gameState = this.gameStates["Select Piece"];
        }
    }
    
    updateBoardState() {
        this.boardState = [];
        for(let i=0; i<=7; i++) {
            let currRow = [];
            for(let j=1; j<=6; j++) {
                switch(i){
                    case 0: if(this.tiles[i + '-' + j].getPiece()==null) currRow.push(-1);
                            else currRow.push(this.tiles[i + '-' + j].getPiece().level);
                            break;
                    case 7 :  if(this.tiles[i + '-' + j].getPiece()==null) currRow.push(-2);
                            else currRow.push(this.tiles[i + '-' + j].getPiece().level);
                             break;
                    default: if(this.tiles[i + '-' + j].getPiece()==null) currRow.push(0);
                            else currRow.push(this.tiles[i + '-' + j].getPiece().level);
                            break;
                }
            }
            this.boardState.push(currRow);
        }
        this.movegames.push(this.boardState);
        //console.log(this.boardState);
    }

    loadBoardState() {
        //console.log("Moves: ", this.movegames);
        if (this.movegames.length < 2)
            return;
        let previous = this.movegames.pop();
        let piece;
        //console.log(previous);
        
        for(let i=1; i<=6; i++) {           
            for(let j=0; j<=5; j++) {
                //console.log(i,j,previous[i][j]);
                //this.tiles[i + '-' + j].unsetPiece();
                if(previous[i][j] != 0){
                    switch(previous[i][j]){
                        case 1:
                            piece = new MyPiece(this.scene, this.pieceModels, 1);
                            this.tiles[i + '-' + (j+1)].setPiece(piece);
                            break;
                        case 2:
                            piece = new MyPiece(this.scene,this.pieceModels, 2);
                            this.tiles[i + '-' + (j+1)].setPiece(piece);
                            break;
                        case 3:
                            piece = new MyPiece(this.scene,this.pieceModels, 3);
                            this.tiles[i + '-' + (j+1)].setPiece(piece);
                            break;     
                    }
                } else this.tiles[i + '-' + (j+1)].unsetPiece();
                    
            }
        }
    }

    move(x1, y1, x2, y2) {
        this.currMove = [];
        //
        console.log("X1", x1);
        console.log("Y1", y1);
        console.log("X2", x2);
        console.log("Y2", y2);
        this.currMoves.push(new Move(0, x1, y1, x2, y2));
        //
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
            valid_move(x1, y1-1, x2, y2-1, player, this.boardState, data => this.make_move_animation(data, x1, y1, x2, y2));
        }
    }

    cpu_turn(done, chainmove) {
        console.log("CPU_TURN BEGIN");
        this.updateBoardState();
        let P;
        if(this.playerAturn) P=1;
        else P=2;
        if(chainmove==0) {
            console.log("CHAIN_MOVE=0 -> next: valid_moves");
            valid_moves(this.boardState, P, data=>this.cpu_move(data, 0));
        }
        else {
            console.log("CHAIN_MOVE!=0");
            var choice = Math.round(Math.random()) + 1;
            var lastMove = this.cpu_moves[this.cpu_moves.length-1];
            console.log("LAST MOVE:", lastMove);
            console.log("CHAIN MOVE CHOICE:", choice);
            if(choice==1) valid_reprogram_coordinates(this.cpu_moves[0][0], this.cpu_moves[0][1]-1, lastMove[0], lastMove[1]-1, P, this.boardState, data=>this.cpu_move(data, 1));
            else if(choice==2) valid_rocket_boosts(this.cpu_moves[0][0], this.cpu_moves[0][1]-1, lastMove[0], lastMove[1]-1, P, this.boardState, data=>this.cpu_move(data, 2))
        }
    }

    cpu_move(data, chainmove) {
        if(data.target.response!=0) {
            console.log("CPU_MOVE BEGIN");
            var moves = JSON.parse(data.target.response);
            console.log("LIST OF POSSIBLE MOVES:", moves);
            var move = moves[Math.floor(Math.random()*moves.length)];
            console.log("RANDOM CHOSEN MOVE (adicionar 1 a y aqui):", move);
            if(chainmove==0) {
                console.log("CHAINMOVE==0 (normal move)");
                console.log("CPU MOVES LIST:", this.cpu_moves);
                this.cpu_moves.push([move[0], move[1]+1]);
                this.cpu_moves.push([move[2], move[3]+1]);
                console.log("CPU MOVES LIST:", this.cpu_moves);
                if(this.tiles[move[2] + '-' + (move[3]+1)].getPiece()==null) {
                        console.log("NORMAL MOVE GET_PIECE==NULL -> animation");
                        let x1 = move[0];
                        let y1 = move[1]+1;
                        console.log("RANDOM CHOSEN MOVE ROW:", x1);
                        console.log("RANDOM CHOSEN MOVE COL:", y1);
                        let x2 = move[2];
                        let y2 = move[3]+1;
                        console.log("RANDOM CHOSEN MOVE DEST ROW:", x2);
                        console.log("RANDOM CHOSEN MOVE DEST COL:", y2);
                        this.currMove = [];
                        this.currMove.push(x1, y1, x2, y2);
                        this.gameState = this.gameStates['Animation'];
                        this.printState();
                        this.cpu_moves = [];
                        // Fazer a animação 
                        this.currMoves.push(new Move(0, x1, y1, x2, y2));
                        this.animator.calculate_animations(this.tiles[x1 + '-' + y1].getPiece(), this.currMoves);
                        this.animator.setAnimation(this.tiles[x1 + '-' + y1].getPiece());
                    
                }
                else {
                    console.log("NORMAL MOVE GET_PIECE!=NULL -> CPU_TURN(false, 1)");
                    this.cpu_turn(false, 1);
                }
            }
            else {
                console.log("CHAIN_MOVE!=0 -> ESTAMOS NUM CHAINMOVE");
                if(chainmove==1) { // reprogram coordinates
                    console.log("CHAINMOVE==1 -> REPROGRAM COORDINATES");
                    let x1 = this.cpu_moves[0][0];
                    let y1 = this.cpu_moves[0][1];
                    let x2 = this.cpu_moves[this.cpu_moves.length-1][0];
                    let y2 = this.cpu_moves[this.cpu_moves.length-1][1];
                    let x3 = move[0];
                    let y3 = move[1]+1;
                    console.log("CASA ORINAL ROW:", x1);
                    console.log("CASA ORIGINAL COL:", y1);
                    console.log("LAST MOVE ROW (casa onde este reprogram ta a ser feito):", x2);
                    console.log("LAST MOVE COL:", y2);
                    console.log("CASA DESTINO PEÇA REPROGRAMADA ROW:", x3);
                    console.log("CASA DESTINO PEÇA REPROGRAMADA COL:", y3);
                    this.cpu_moves.push(move[0], move[1]+1);
                    this.cpu_moves = [];
                    this.tiles[x3 + '-' + y3].setPiece(this.tiles[x2 + '-' + y2].getPiece());
                    this.tiles[x2 + '-' + y2].setPiece(this.tiles[x1 + '-' + y1].getPiece());
                    this.tiles[x1 + '-' + y1].unsetPiece();
                }
                else if(chainmove==2) {
                    console.log("CHAINMOVE==2 -> ROCKET BOOST");
                    let x1 = this.cpu_moves[0][0];
                    let y1 = this.cpu_moves[0][1];
                    let x2 = this.cpu_moves[this.cpu_moves.length-1][0];
                    let y2 = this.cpu_moves[this.cpu_moves.length-1][1];
                    let x3 = move[0];
                    let y3 = move[1]+1;
                    console.log("CASA ORINAL ROW:", x1);
                    console.log("CASA ORIGINAL COL:", y1);
                    console.log("LAST MOVE ROW (casa onde este boost ta a ser feito):", x2);
                    console.log("LAST MOVE COL:", y2);
                    console.log("CASA DESTINO ROW:", x3);
                    console.log("CASA DESTINO COL:", y3);
                    console.log("CPU MOVES LIST:", this.cpu_moves);
                    this.cpu_moves.push([move[0], move[1]+1]);
                    console.log("CPU MOVES LIST:", this.cpu_moves);
                    this.currMoves.push(new Move(2, x1, y1, x2, y2, x3, y3));
                    if(this.tiles[x3 + '-' + y3].getPiece()==null) {
                        console.log("CASA FINAL BOOST SEM PEÇA -> animation")
                        this.currMove = [];
                        this.currMove.push(x1, y1, x3, y3);
                        this.gameState = this.gameStates['Animation'];
                        this.printState();
                        this.cpu_moves = [];
                        // Fazer a animação 
                        this.animator.calculate_animation(this.tiles[x1 + '-' + y1].getPiece(), x1, y1, x3, y3);
                        this.animator.setAnimation(this.tiles[x1 + '-' + y1].getPiece());
                    }
                    else {
                        console.log("CASA FINAL BOOST COM PEÇA -> cpu_turn(false, 1)");
                        this.cpu_turn(false, 1);
                    }
                }
            }
        }
        else {
            this.cpu_turn(false, chainmove);
        }
    }


    rocket_boost(data, x1, y1, x2, y2, x3, y3, noPiece) {
        if(data.target.response==1) {
            this.chainMoves.push([x3, y3]);
            if(noPiece) { // talvez depois criar make_chain_move_animation devido ao reprogram coordinates ou para meter o rocket boost explicito
                this.currMove = [];
                this.currMove.push(x1, y1, x3, y3);
                this.currMoves.push(new Move(2, x1, y1, x2, y2, x3, y3));
                this.clearSelects();
                this.make_move_animation(data, x1, y1, x3, y3);
            }
        } else {
            this.clearSelects();
            this.selectedTile = null;
            this.currMove = [];
            this.currMoves = [];
            this.gameState = this.gameStates["Select Piece"];
            this.printState();
        }
    }

    reprogram_coordinates(data, x1, y1, x2, y2, x3, y3) {
        if(data.target.response==1) {
            // NEW ANIM HERE
            this.gameState = this.gameStates['Animation'];
            this.printState();
            this.currMoves.push(new Move(1, x1, y1, x2, y2, x3, y3));
            this.clearSelects();
            this.animator.calculate_animations(this.tiles[x1 + '-' + y1].getPiece(),this.currMoves);
            this.animator.setAnimation(this.tiles[x1 + '-' + y1].getPiece());
            /*
            this.gameState = this.gameStates["Check Win"];
            this.checkWin();
            this.gameState = this.gameStates["Next turn"];
            */
        } else {
            this.clearSelects();
            this.selectedTile = null;
            this.currMove = [];
            this.currMoves = [];
            this.gameState = this.gameStates["Select Piece"];
            this.printState();
        }
    }

    make_move_animation(data, x1, y1, x2, y2) {
        if(data.target.response==1) {
            // NEW ANIM HERE
            this.clearSelects();
            this.gameState = this.gameStates['Animation'];
            this.printState();
            // Fazer a animação 
            //this.animator.calculate_animation(this.tiles[x1 + '-' + y1].getPiece(), x1, y1, x2, y2);
            this.animator.calculate_animations(this.tiles[x1 + '-' + y1].getPiece(), this.currMoves);      
            this.animator.setAnimation(this.tiles[x1 + '-' + y1].getPiece());      
        } else {
            this.currMove = [];
            this.currMoves = [];
            this.gameState = this.gameStates["Select Piece"];
            this.printState();
        }
    }

    make_move() {
        let x1 = this.currMoves[0].x1;
        let y1 = this.currMoves[0].y1;
        let x2 = this.currMoves[this.currMoves.length-1].x2;
        let y2 = this.currMoves[this.currMoves.length-1].y2;
        let x3 = this.currMoves[this.currMoves.length-1].x3;
        let y3 = this.currMoves[this.currMoves.length-1].y3;

        if(this.currMoves[this.currMoves.length-1].type==1) {
            this.tiles[x3 + '-' + y3].setPiece(this.tiles[x2 + '-' + y2].getPiece());
            this.tiles[x2 + '-' + y2].setPiece(this.tiles[x1 + '-' + y1].getPiece());
            this.tiles[x1 + '-' + y1].unsetPiece();
        }
        else if(this.currMoves[this.currMoves.length-1].type==2) {
            this.tiles[x3 + '-' + y3].setPiece(this.tiles[x1 + '-' + y1].getPiece());
            this.tiles[x1 + '-' + y1].unsetPiece();
        }
        else if(this.tiles[x1 + '-' + y1].getPiece() != null && this.currMoves[this.currMoves.length-1].type==0) {
            this.tiles[x2 + '-' + y2].setPiece(this.tiles[x1 + '-' + y1].getPiece());
            this.tiles[x1 + '-' + y1].unsetPiece();
        }
        this.gameState = this.gameStates["Check Win"];
        this.printState();
        this.checkWin();
        this.gameState = this.gameStates["Next turn"];
        this.printState();
        this.animator = null;
    }
}