class KeyframeAnimation extends Animation {
    constructor(scene, id, keyframes) {
        super(scene, id);
        this.currKeyframe;
        this.keyframes = keyframes;
        this.start = false;
        this.end = false;
        this.startTime;
    }

    update(t) {
        this.transfMatrix = mat4.create();

        if(!this.start) {
            this.startTime = t;
            this.currKeyframe = 0;
            this.start = true;
        }

        var currTime = t - this.startTime;

        if((this.currTime - this.startTime) == this.keyframes[this.currKeyframe+1].inst && this.currKeyframe!=this.keyframes.length-1) {
            this.currKeyframe++;
        }
        console.log("KEYFRAME:", this.keyframes[this.currKeyframe+2].ty);
        //linear interpolation of all values
        var tx = this.keyframes[this.currKeyframe].tx + (currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].tx - this.keyframes[this.currKeyframe].tx) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));
        var ty = this.keyframes[this.currKeyframe].ty + (currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].ty - this.keyframes[this.currKeyframe].ty) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));
        var tz = this.keyframes[this.currKeyframe].tz + (currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].tz - this.keyframes[this.currKeyframe].tz) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));
        var rx = this.keyframes[this.currKeyframe].rx + (currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].rx - this.keyframes[this.currKeyframe].rx) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));
        var ry = this.keyframes[this.currKeyframe].ry + (currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].ry - this.keyframes[this.currKeyframe].ry) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));
        var rz = this.keyframes[this.currKeyframe].rz + (currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].rz - this.keyframes[this.currKeyframe].rz) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));
        var sx = this.keyframes[this.currKeyframe].sx + (currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].sx - this.keyframes[this.currKeyframe].sx) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));
        var sy = this.keyframes[this.currKeyframe].sy + (currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].sy - this.keyframes[this.currKeyframe].sy) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));
        var sz = this.keyframes[this.currKeyframe].sz + (currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].sz - this.keyframes[this.currKeyframe].sz) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));

        this.transfMatrix = mat4.translate(this.transfMatrix, this.transfMatrix, [tx, ty, tz]);
        this.transfMatrix = mat4.rotate(this.transfMatrix, this.transfMatrix, rx*DEGREE_TO_RAD, [1, 0, 0]);
        this.transfMatrix = mat4.rotate(this.transfMatrix, this.transfMatrix, ry*DEGREE_TO_RAD, [0, 1, 0]);
        this.transfMatrix = mat4.rotate(this.transfMatrix, this.transfMatrix, rz*DEGREE_TO_RAD, [0, 0, 1]);
        this.transfMatrix = mat4.scale(this.transfMatrix, this.transfMatrix, [sx, sy, sz]);
    }

    apply() {
        this.scene.multMatrix(this.transfMatrix);
    }
}