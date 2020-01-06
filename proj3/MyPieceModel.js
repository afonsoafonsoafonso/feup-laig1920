class MyPieceModel extends CGFobject {
    constructor(scene, level) {
        super(scene);
        this.cenas = new CGFOBJModel(this.scene, 'models/model2/ship.obj');
        this.side = new MyCylinder(this.scene, 0.3, 0.3, 0.2, 20, 3);
        this.base = new MyCylinder(this.scene, 0.3, 0, 0, 20, 20);
        this.level = level;
        this.animation = null;
        if(level==3) {
            this.mat = new CGFappearance(scene);
            this.mat.setAmbient(200/255, 35/255, 35/255, 1.0);
            this.mat.setDiffuse(35/255, 5/255, 5/255, 1.0);
            this.mat.setSpecular(90/255, 75/255, 75/255, 1.0);
            this.mat.setShininess(10.0);
        }
        else if(level==2) {
            this.mat = new CGFappearance(scene);
            this.mat.setAmbient(200/255, 200/255, 0/255, 1.0);
            this.mat.setDiffuse(35/255, 35/255, 0/255, 1.0);
            this.mat.setSpecular(100/255, 100/255, 90/255, 1.0);
            this.mat.setShininess(10.0);
        }
        else {
            this.mat = new CGFappearance(scene);
            this.mat.setAmbient(0/255, 56/255, 55/255, 1.0);
            this.mat.setDiffuse(0/255, 56/255, 55/255, 1.0);
            this.mat.setSpecular(100/255, 112/255, 110/255, 1.0);
            this.mat.setShininess(10.0);
        }
        
        this.tile = null;
    }

    display() {
        this.scene.pushMatrix();
        this.mat.apply();
        this.scene.scale(0.0005,0.0005,0.0005);
        if(!this.scene.gameOrchestrator.playerAturn)
            this.scene.rotate(Math.PI,1,0,0);
        this.cenas.display();

        this.scene.popMatrix();
    }
}