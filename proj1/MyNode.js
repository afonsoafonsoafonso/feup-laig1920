class MyNode {
    constructor(nodeID) {
        this.nodeID = nodeID;
        this.childNodes = [];
        this.childLeafs = [];
        this.materialsID = [];
        this.materialsIndex = 0;
        this.textureID = null;
        // this.xTex = null; ???
        // this.yTex = null; ???
        this.transform = mat4.create();
    }

    createChildNode(nodeID) {
        this.children.push(nodeID);
    }

    createChildLeaf(leafID) {
        this.childLeafs.push(nodeID);
    }
}