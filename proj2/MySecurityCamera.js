class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.initBuffers();
    }

    initBuffers(){
        this.shader = new CGFshader(this.scene.gl, "shaders/vertex.vert", "shaders/color.frag");
        //this.shader.setUniformsValues({uSampler: 1});
        this.secCamera = new MyRectangle(this.scene, 0, 0.5, 1, -1, -0.5);
    }

    display(){
        this.scene.pushMatrix();
        this.scene.setActiveShader(this.shader);
        this.scene.textureRTT.bind();
        this.secCamera.display();
        this.scene.textureRTT.unbind();
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.popMatrix();
    }
}