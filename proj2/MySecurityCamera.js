class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.initBuffers();
    }

    initBuffers(){
        this.secCamera = new MyRectangle(this.scene, 0, 0.5, 1, -0.5, -1);
    }

    display(){
        
    }
}