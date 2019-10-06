class MyNode {
    constructor(nodeID) {
        this.nodeID = nodeID;
        this.childNodesIDs = [];
        this.childLeafsIDs = [];
        this.materialID = null;
        this.textureID = null;
        this.transfMatrix = mat4.create();
    }
}