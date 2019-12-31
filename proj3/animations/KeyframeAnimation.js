class KeyframeAnimation extends Animation {
    constructor(scene, id, keyframes) {
        super(scene, id);
        this.currKeyframe = 0;
        this.keyframes = keyframes;
        this.running = false;
        this.end = false;
        this.startTime = 0;
        this.currTime;
    }

    update(t) {
        if(this.startTime == 0) {
            this.startTime = t;
        }

        this.transfMatrix = mat4.create();
        this.currTime = t - this.startTime;


        if(this.currTime >= this.keyframes[0].inst) {
            this.running = true;
        }

        if(this.currKeyframe != this.keyframes.length-1 && this.keyframes.length>this.currKeyframe+1) {
            if(this.currTime >= this.keyframes[this.currKeyframe+1].inst) {
                this.currKeyframe++;
            }
        }
        else {
            //console.log("RUNNING EQUAL FALSE");
            this.running = false;
            this.end = true;
        }

        if(this.running && this.keyframes.length>this.currKeyframe+1) {
            //linear interpolation of all values
            var tx = this.keyframes[this.currKeyframe].tx + (this.currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].tx - this.keyframes[this.currKeyframe].tx) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));
            var ty = this.keyframes[this.currKeyframe].ty + (this.currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].ty - this.keyframes[this.currKeyframe].ty) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));
            var tz = this.keyframes[this.currKeyframe].tz + (this.currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].tz - this.keyframes[this.currKeyframe].tz) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));
            var rx = this.keyframes[this.currKeyframe].rx + (this.currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].rx - this.keyframes[this.currKeyframe].rx) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));
            var ry = this.keyframes[this.currKeyframe].ry + (this.currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].ry - this.keyframes[this.currKeyframe].ry) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));
            var rz = this.keyframes[this.currKeyframe].rz + (this.currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].rz - this.keyframes[this.currKeyframe].rz) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));
            var sx = this.keyframes[this.currKeyframe].sx + (this.currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].sx - this.keyframes[this.currKeyframe].sx) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));
            var sy = this.keyframes[this.currKeyframe].sy + (this.currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].sy - this.keyframes[this.currKeyframe].sy) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));
            var sz = this.keyframes[this.currKeyframe].sz + (this.currTime - this.keyframes[this.currKeyframe].inst)*((this.keyframes[this.currKeyframe+1].sz - this.keyframes[this.currKeyframe].sz) / (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst));
        }
        else {
            var tx = this.keyframes[this.currKeyframe].tx;
            var ty = this.keyframes[this.currKeyframe].ty;
            var tz = this.keyframes[this.currKeyframe].tz;

            var rx = this.keyframes[this.currKeyframe].rx;
            var ry = this.keyframes[this.currKeyframe].ry;
            var rz = this.keyframes[this.currKeyframe].rz;

            var sx = this.keyframes[this.currKeyframe].sx;
            var sy = this.keyframes[this.currKeyframe].sy;
            var sz = this.keyframes[this.currKeyframe].sz;
        }
        //console.log("END OF UPDATE");
        this.transfMatrix = mat4.translate(this.transfMatrix, this.transfMatrix, [tx, ty, tz]);
        this.transfMatrix = mat4.rotate(this.transfMatrix, this.transfMatrix, rx*DEGREE_TO_RAD, [1, 0, 0]);
        this.transfMatrix = mat4.rotate(this.transfMatrix, this.transfMatrix, ry*DEGREE_TO_RAD, [0, 1, 0]);
        this.transfMatrix = mat4.rotate(this.transfMatrix, this.transfMatrix, rz*DEGREE_TO_RAD, [0, 0, 1]);
        this.transfMatrix = mat4.scale(this.transfMatrix, this.transfMatrix, [sx, sy, sz]);
    }

    apply() {
        //console.log("END OF APPLY");
        this.scene.multMatrix(this.transfMatrix);
    }
}