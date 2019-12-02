class MyBoard extends CGFobject {
    constructor(scene) {
        super(scene);
        this.cylinder = new MyCylinder(this.scene, 0.015, 0.015, 1, 10, 5);

        //this.initBuffers();
    }

    display() {
        var z = 0;
        var x = 0;

        for(let i=0; i<14; i++) {
            if(i % 2 == 0) {
                for(let j=0; j<6; j++) {
                    this.scene.pushMatrix();
                    this.scene.translate(x, 0, j);
                    this.cylinder.display();
                    this.scene.popMatrix();
                }
            }
            else {
                this.scene.pushMatrix();
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                for(let j=0; j<6; j++) {
                    this.scene.pushMatrix();
                    this.scene.translate(-x, 0, j);
                    this.cylinder.display();
                    this.scene.popMatrix();
                }
                this.scene.popMatrix();
                x+=1;
            }
        }
    }
}