class MyPiece extends CGFobject {
    constructor(scene, level) {
        super(scene);
        this.side = new MyCylinder(this.scene, 0.3, 0.3, 0.2, 20, 3);
        this.base = new MyCylinder(this.scene, 0.3, 0, 0, 20, 20);
        this.level = level;
        this.animation = null;

        if(level==3) {
            this.mat = new CGFappearance(scene);
            this.mat.setAmbient(255/255, 20/255, 20/255, 1.0);
            this.mat.setDiffuse(255/255, 20/255, 20/255, 1.0);
            this.mat.setSpecular(255/255, 20/255, 20/255, 1.0);
            this.mat.setShininess(10.0);
        }
        else if(level==2) {
            this.mat = new CGFappearance(scene);
            this.mat.setAmbient(255/255, 255/255, 0/255, 1.0);
            this.mat.setDiffuse(255/255, 255/255, 0/255, 1.0);
            this.mat.setSpecular(255/255, 255/255, 0/255, 1.0);
            this.mat.setShininess(10.0);
        }
        else {
            this.mat = new CGFappearance(scene);
            this.mat.setAmbient(0/255, 156/255, 255/255, 1.0);
            this.mat.setDiffuse(0/255, 156/255, 255/255, 1.0);
            this.mat.setSpecular(0/255, 156/255, 255/255, 1.0);
            this.mat.setShininess(10.0);
        }

        this.tile = null;
    }

    display(){        
        this.scene.pushMatrix();
        this.mat.apply();

        if(this.animation!=null) {
            this.animation.apply();
        }

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