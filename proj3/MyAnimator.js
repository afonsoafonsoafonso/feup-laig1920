class MyAnimator {
    constructor(scene, orchestrator, t) {
        this.scene = scene;
        this.orchestrator = orchestrator;
        this.currAnim = null;
        this.running = false;
        this.startTime = t;
        this.currTime;
        this.piece = null;
        console.log(t);
    }

    calculate_animation(piece, row1, col1, row2, col2) {
        this.piece = piece;
        this.piece.ongoingAnimation = true;
        var keyframes = [];
        var secondsSinceStart = (this.currTime - this.startTime)/1000;
        //console.log("SECONDS SINCE START:", secondsSinceStart/1000);
        keyframes.push(new Keyframe(secondsSinceStart, 0, 0, 0, 0, 0, 0, 1, 1, 1));
        keyframes.push(new Keyframe(secondsSinceStart+2, 0, 2, 0, 0, 0, 0, 1, 1, 1));
        keyframes.push(new Keyframe(secondsSinceStart+5, col2-col1, 2, row2-row1, 0, 0, 0, 1, 1, 1));
        keyframes.push(new Keyframe(secondsSinceStart+7, col2-col1, 0, row2-row1, 0, 0, 0, 1, 1, 1));
        this.currAnim = new KeyframeAnimation(this.scene, 'move', keyframes);
    }

    apply() {   
        if(this.currAnim!=null) this.currAnim.apply();
    }

    update(t) {
        this.currTime = t;
        if(this.currAnim!=null) {
            this.currAnim.update(t);
            if(this.currAnim.running = false) {
                this.running = false;
            }
        }
        //if(this.currAnim!=null && this.currAnim.running==false) {this.currAnim = null; this.piece = null; this.running = false;}
    }

    setAnimation(piece) {
        piece.animation = this;
    }

    endAnimation() {
        this.piece.animation = null;
        this.currAnim = null;
    }
}