class MyNode {
    constructor(nodeID) {
        this.nodeID = nodeID;
        this.childNodesIDs = [];
        this.childLeafsIDs = [];
        this.materialID = [];
        this.currMaterial = 0;
        this.textureID = null;
        this.animationID = null;
        this.sLength = null;
        this.tLength = null;
        this.transfMatrix = mat4.create();
    }

    changeMaterial() {
        this.currMaterial++;
        if(this.currMaterial>this.materialID.length-1) {
            this.currMaterial=0;
        }
    }
}