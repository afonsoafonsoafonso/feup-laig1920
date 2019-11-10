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
        this.scene.textureRTT.bind();
        this.secCamera.display();
        this.scene.textureRTT.unbind();
    }
}