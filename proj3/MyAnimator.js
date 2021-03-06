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
    }

    calculate_animations(piece, moves) {
        this.piece = piece;
        this.running = true;
        var keyframes = [];
        var secondsSinceStart = (this.currTime - this.startTime)/10000;
        keyframes.push(new Keyframe(secondsSinceStart, 0, 0, 0, 0, 0, 0, 1, 1, 1));
        
        if(moves.length==1 && moves[0].type==0) {
            var x1 = moves[0].x1;
            var y1 = moves[0].y1;
            var x2 = moves[0].x2;
            var y2 = moves[0].y2;
            keyframes.push(new Keyframe(secondsSinceStart+0.20, 0, 0.67, 0, 0, 0, 0, 1, 1, 1));
            keyframes.push(new Keyframe(secondsSinceStart+0.40, (y2-y1)*0.25, 1.33, (x2-x1)*0.25, 0, 0, 0, 1, 1, 1));
            keyframes.push(new Keyframe(secondsSinceStart+0.5, (y2-y1)*0.5, 2, (x2-x1)*0.5, 0, 0, 0, 1, 1, 1));
            keyframes.push(new Keyframe(secondsSinceStart+0.6, (y2-y1)*0.75, 1.33, (x2-x1)*0.75, 0, 0, 0, 1, 1, 1));
            keyframes.push(new Keyframe(secondsSinceStart+0.8, (y2-y1)*1, 0.67, (x2-x1)*1, 0, 0, 0, 1, 1, 1));
            keyframes.push(new Keyframe(secondsSinceStart+1, (y2-y1), 0, (x2-x1), 0, 0, 0, 1, 1, 1));
        }
        else {
            var x1 = moves[0].x1;
            var y1 = moves[0].y1;
            var x2 = moves[0].x2;
            var y2 = moves[0].y2;
            var x3;
            var y3;
            var t = secondsSinceStart+2;
            var reprogramKeyframes = [];
            keyframes.push(new Keyframe(secondsSinceStart+0.5, 0, 2, 0, 0, 0, 0, 1, 1, 1));
            reprogramKeyframes.push(new Keyframe(t, 0, 0, 0, 0, 0, 0, 1, 1, 1));
            for(let i=0; i<moves.length; i++) {
                x1 = moves[i].x1;
                y1 = moves[i].y1;
                x2 = moves[i].x2;
                y2 = moves[i].y2;
                x3 = moves[i].x3;
                y3 = moves[i].y3;
                if(i!=moves.length-1) {
                    keyframes.push(new Keyframe(t, y2-y1, 2, x2-x1, 0, 0, 0, 1, 1, 1));
                    t+=0.5;
                    keyframes.push(new Keyframe(t, y2-y1, 1, x2-x1, 0, 0, 0, 1, 1, 1));
                    t+=0.5;
                    keyframes.push(new Keyframe(t, y2-y1, 2, x2-x1, 0, 0, 0, 1, 1, 1));
                    t+=0.5;
                }
                else {
                    if(moves[i].type==2) {
                        keyframes.push(new Keyframe(t, y2-y1, 2, x2-x1, 0, 0, 0, 1, 1, 1));
                        t+=0.5;
                        keyframes.push(new Keyframe(t, y2-y1, 1, x2-x1, 0, 0, 0, 1, 1, 1));
                        t+=0.5;
                        keyframes.push(new Keyframe(t, y2-y1, 2, x2-x1, 0, 0, 0, 1, 1, 1));
                        t+=0.5;
                        keyframes.push(new Keyframe(t, y3-y1, 2, x3-x1, 0, 0, 0, 1, 1, 1));
                        t+=0.5;
                        keyframes.push(new Keyframe(t, y3-y1, 0, x3-x1, 0, 0, 0, 1, 1, 1));
                        t+=0.5;
                    }
                    else {
                        keyframes.push(new Keyframe(t, y2-y1, 2, x2-x1, 0, 0, 0, 1, 1, 1));
                        t+=0.5;
                        keyframes.push(new Keyframe(t, y2-y1, 2, x2-x1, 0, 0, 0, 1, 1, 1));
                        t+=0.5;
                        keyframes.push(new Keyframe(t, y2-y1, 2, x2-x1, 0, 0, 0, 1, 1, 1));
                        t+=0.5;
                        keyframes.push(new Keyframe(t+1, y2-y1, 2, x2-x1, 0, 0, 0, 1, 1, 1));
                        reprogramKeyframes.push(new Keyframe(t, (y3-y2)*0.7, 1, (x3-x2)*0.7, 0, 0, 0, 1, 1, 1));
                        t+=0.5;
                        keyframes.push(new Keyframe(t+1, y2-y1, 0, x2-x1, 0, 0, 0, 1, 1, 1));
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
        if(this.piece!=null) this.piece.animation = null;
        if(this.reprogramPiece!=null) this.reprogramPiece.reprogramAnim = null;
        this.reprogramAnim = null;
        this.currAnim = null;
    }
}