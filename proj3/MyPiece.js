class MyPiece extends CGFobject {
    constructor(scene, models, level) {
        super(scene);
        this.level = level;
        this.animation = null;
        this.reprogramAnim = null;
        this.models = models;
        
        this.tile = null;
    }

    display(){        
        this.scene.pushMatrix();

        if(this.animation!=null) {
            this.animation.apply();
        }
        else if(this.reprogramAnim!=null) {
            this.reprogramAnim.apply();
        }

        this.scene.translate(0, 0.2, 0);
        this.models[this.level-1].display();
        
        this.scene.popMatrix();
    }

    setTile(tile) {
        this.tile = tile;
    }
}