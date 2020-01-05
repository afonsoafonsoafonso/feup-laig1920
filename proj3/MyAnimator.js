class MyAnimator {
    constructor(scene, orchestrator, t) {
        this.scene = scene;
        this.orchestrator = orchestrator;
        this.currAnim = null;
        this.running = false;
        this.startTime = t;
        this.currTime;
        this.piece = null;
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
        keyframes.push(new Keyframe(secondsSinceStart+1.3, col2-col1, 0, row2-row1, 0, 0, 0, 1, 1, 1));
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
    }

    setAnimation(piece) {
        piece.animation = this;
    }

    endAnimation() {
        if(this.piece!=null) this.piece.animation = null;
        this.currAnim = null;
    }
}