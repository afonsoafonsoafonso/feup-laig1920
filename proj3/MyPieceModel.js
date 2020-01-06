class MyPieceModel extends CGFobject {
    constructor(scene, level) {
        super(scene);
        /*if(level==2)*/ this.cenas = new CGFOBJModel(this.scene, 'models/model2/ship.obj');
        /*else if(level==1) this.cenas = new CGFOBJModel(this.scene, 'models/model1/ship.obj');
        else if(level==3) this.cenas = new CGFOBJModel(this.scene, 'models/model3/ship.obj');*/
        this.side = new MyCylinder(this.scene, 0.3, 0.3, 0.2, 20, 3);
        this.base = new MyCylinder(this.scene, 0.3, 0, 0, 20, 20);
        this.level = level;
        this.animation = null;
        //proj3\models\ship2\Wraith Raider Starship\Wraith Raider Starship.obj
        //proj3\models\ship\[.obj] (Sh3d adapted)\Arc170.obj
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
        /*this.scene.rotate(Math.PI/2, 1, 0, 0);
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
        this.base.display();*/
        this.scene.popMatrix();
    }
}