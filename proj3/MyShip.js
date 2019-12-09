class MyShip extends CGFobject {
    constructor(scene) {
        super(scene);
        this.ship = new MyCylinder(this.scene, 1, 1, 0.2, 20, 3);
        this.circle = new MyCylinder(this.scene, 1, 0, 0, 20, 20);
    }

    display(){
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.ship.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,-0.2,0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.circle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.circle.display();
        this.scene.popMatrix();

    }
}