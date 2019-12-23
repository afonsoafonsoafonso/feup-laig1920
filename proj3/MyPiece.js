class MyPiece extends CGFobject {
    constructor(scene, type) {
        super(scene);
        this.side = new MyCylinder(this.scene, 0.3, 0.3, 0.2, 20, 3);
        this.base = new MyCylinder(this.scene, 0.3, 0, 0, 20, 20);

        this.tile = null;
    }

    display(){
        this.scene.pushMatrix();
        this.scene.translate(0, 0.2, 0);

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.side.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,-0.2,0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.base.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }

    setTile(tile) {
        this.tile = tile;
    }
}