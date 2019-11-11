class Patch extends CGFobject {
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints) {
        super(scene);
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlPoints = [];
        //this.controlPoints = controlPoints;
        var controlPointsCounter = 0;
        for(let i=0; i<this.npointsU; i++) {
            let VPoints = [];
            for(let j=0; j<this.npointsV; j++) {
                VPoints.push(controlPoints[controlPointsCounter]);
                controlPointsCounter++;
            }
            this.controlPoints.push(VPoints);
        }
        var nurbsSurface = new CGFnurbsSurface(npointsU-1, npointsV-1, this.controlPoints);
        this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface);
    }

    display() {
        this.obj.display();
    }
};