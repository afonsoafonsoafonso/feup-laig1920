class MyAnimator {
    constructor(scene, orchestrator, t) {
        this.scene = scene;
        this.orchestrator = orchestrator;
        this.currAnim = null;
        this.reprogramAnim = null;
        this.running = false;
        this.startTime = t;
        this.currTime;
        this.piece = null;
        this.reprogramPiece = null;
        //console.log(t);
    }

    calculate_animation(piece, row1, col1, row2, col2) {
        this.piece = piece;
        this.running = true;
        var keyframes = [];
        var secondsSinceStart = (this.currTime - this.startTime)/10000;
        keyframes.push(new Keyframe(secondsSinceStart, 0, 0, 0, 0, 0, 0, 1, 1, 1));
        keyframes.push(new Keyframe(secondsSinceStart+0.5, 0, 2, 0, 0, 0, 0, 1, 1, 1));
        keyframes.push(new Keyframe(secondsSinceStart+1, col2-col1, 2, row2-row1, 0, 0, 0, 1, 1, 1));
        keyframes.push(new Keyframe(secondsSinceStart+1.5, col2-col1, 0, row2-row1, 0, 0, 0, 1, 1, 1));
        this.currAnim = new KeyframeAnimation(this.scene, 'move', keyframes);
    }

    calculate_animations(piece, moves) {
        console.log("NEEEEEWE ANIMAAATIOOOOOOOONS\n");
        this.piece = piece;
        this.running = true;
        var keyframes = [];
        var secondsSinceStart = (this.currTime - this.startTime)/10000;
        keyframes.push(new Keyframe(secondsSinceStart, 0, 0, 0, 0, 0, 0, 1, 1, 1));
        keyframes.push(new Keyframe(secondsSinceStart+0.5, 0, 2, 0, 0, 0, 0, 1, 1, 1));
        if(moves.length==1 && moves[0].type==0) {
            console.log("MOVE NORMAL");
            var x1 = moves[0].x1;
            var y1 = moves[0].y1;
            var x2 = moves[0].x2;
            var y2 = moves[0].y2;
            keyframes.push(new Keyframe(secondsSinceStart+1, y2-y1, 2, x2-x1, 0, 0, 0, 1, 1, 1));
            keyframes.push(new Keyframe(secondsSinceStart+1.5, y2-y1, 0, x2-x1, 0, 0, 0, 1, 1, 1));
        }
        else {
            var x1 = moves[0].x1;
            var y1 = moves[0].y1;
            var x2 = moves[0].x2;
            var y2 = moves[0].y2;
            var x3;
            var y3;
            var t = secondsSinceStart+2;
            keyframes.push(new Keyframe(t, y2-y1, 2, x2-x1, 0, 0, 0, 1, 1, 1));
            t+=0.5;
            keyframes.push(new Keyframe(t, y2-y1, 1, x2-x1, 0, 0, 0, 1, 1, 1));
            t+=0.5;
            keyframes.push(new Keyframe(t, y2-y1, 2, x2-x1, 0, 0, 0, 1, 1, 1));
            t+=0.5;
            for(let i=0; i<moves.length; i++) {
                x1 = moves[i].x1;
                y1 = moves[i].y1;
                x2 = moves[i].x2;
                y2 = moves[i].y2;
                x3 = moves[i].x3;
                y3 = moves[i].y3;
                console.log("X1", x1);
                console.log("Y1", y1);
                console.log("X2", x2);
                console.log("Y2", y2);
                console.log("X3", x3);
                console.log("Y3", y3);
                if(i!=moves.length-1) {
                    console.log("NOT LAST ITEM OF ARRAY");
                    keyframes.push(new Keyframe(t, y3-y1, 2, x3-x1, 0, 0, 0, 1, 1, 1));
                    t+=0.5;
                    keyframes.push(new Keyframe(t, y3-y1, 1, x3-x1, 0, 0, 0, 1, 1, 1));
                    t+=0.5;
                    keyframes.push(new Keyframe(t, y3-y1, 2, x3-x1, 0, 0, 0, 1, 1, 1));
                    t+=0.5;
                }
                else {
                    if(moves[i].type==2) {
                        keyframes.push(new Keyframe(t, y3-y1, 2, x3-x1, 0, 0, 0, 1, 1, 1));
                        t+=0.5;
                        keyframes.push(new Keyframe(t, y3-y1, 0, x3-x1, 0, 0, 0, 1, 1, 1));
                        t+=0.5;
                    }
                    else {
                        let reprogramKeyframes = [];
                        console.log("")
                        reprogramKeyframes.push(new Keyframe(t-0.5, y2, 0, x2, 0, 0, 0, 1, 1, 1));
                        keyframes.push(new Keyframe(t, y2-y1, 2, x2-x1, 0, 0, 0, 1, 1, 1));
                        reprogramKeyframes.push(new Keyframe(t, (y3-y2)/2, 1, (x3-x2)/2, 0, 0, 0, 1, 1, 1));
                        t+=0.5;
                        keyframes.push(new Keyframe(t, y2-y1, 0, x2-x1, 0, 0, 0, 1, 1, 1));
                        reprogramKeyframes.push(new Keyframe(t, y3-y2, 0, x3-x2, 0, 0, 0, 1, 1, 1));
                        t+=0.5;
                        this.reprogramAnim = new KeyframeAnimation(this.scene, 'reprogram', reprogramKeyframes);
                        //setting reprogram animation on piece
                        //this.orchestrator.tiles[x2 + '-' + y2].getPiece().setAnimation(this.reprogramAnim);
                        this.reprogramPiece = this.orchestrator.tiles[x2 + '-' + y2].getPiece();
                        this.setReprogramAnim(this.orchestrator.tiles[x2 + '-' + y2].getPiece());
                    }
                }
            }
        }
        this.currAnim = new KeyframeAnimation(this.scene, 'move', keyframes); 
    }

    apply() {   
        if(this.currAnim!=null) this.currAnim.apply();
    }

    update(t) {
        this.currTime = t;
        if(this.currAnim!=null) {
            this.currAnim.update(t);
            if(this.currAnim.end == true) {
                this.running = false;
            }
        }
        if(this.reprogramAnim!=null) {
            this.reprogramAnim.update(t);
        }
    }

    setAnimation(piece) {
        piece.animation = this;
    }

    setReprogramAnim(piece) {
        piece.reprogramAnim = this.reprogramAnim;
    }

    endAnimation() {
        console.log("CURR MOVESSSS", this.orchestrator.currMoves);
        if(this.piece!=null) this.piece.animation = null;
        if(this.reprogramPiece!=null) this.reprogramPiece.reprogramAnim = null;
        this.reprogramAnim = null;
        this.currAnim = null;
    }
}