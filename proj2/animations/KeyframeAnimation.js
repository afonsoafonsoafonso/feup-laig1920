class KeyframeAnimation extends Animation {
    constructor(scene, id, keyframes) {
        super(scene, id);
        this.currKeyframe = 0;
        this.keyframes = keyframes;
    }

    update(t) {
        if(!start) {
            this.startTime = t;
            start = true;
        }

        this.currTime = t - this.startTime;

        if(this.currTime==this.keyframes[this.currKeyframe].inst) {
            this.transfMatrix.reset();

            //fazer os calculos em relação ao keyframe seguinte
            var steps = (this.keyframes[this.currKeyframe+1].inst - this.keyframes[this.currKeyframe].inst) / 100;

            var txStep = (this.keyframes[this.currKeyframe+1].tx - this.keyframes[this.currKeyframe].tx) / steps;
            var tyStep = (this.keyframes[this.currKeyframe+1].ty - this.keyframes[this.currKeyframe].ty) / steps;
            var tzStep = (this.keyframes[this.currKeyframe+1].tz - this.keyframes[this.currKeyframe].tz) / steps;

            var rxStep = (this.keyframes[this.currKeyframe+1].rx - this.keyframes[this.currKeyframe].rx) / steps;
            var ryStep = (this.keyframes[this.currKeyframe+1].ry - this.keyframes[this.currKeyframe].ry) / steps;
            var rzStep = (this.keyframes[this.currKeyframe+1].rz - this.keyframes[this.currKeyframe].rz) / steps;

            var sxStep = (this.keyframes[this.currKeyframe+1].sx - this.keyframes[this.currKeyframe].sx) / steps;
            var syStep = (this.keyframes[this.currKeyframe+1].sy - this.keyframes[this.currKeyframe].sy) / steps;
            var szStep = (this.keyframes[this.currKeyframe+1].sz - this.keyframes[this.currKeyframe].sz) / steps;

            

            apply();
        }


    }

    apply()
}