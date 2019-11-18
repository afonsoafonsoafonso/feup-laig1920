class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.initBuffers();
        this.timecount = 0;
    }
 
    initBuffers(){
        this.shader = new CGFshader(this.scene.gl, "shaders/vertex.vert", "shaders/color.frag");
        this.shader.setUniformsValues({uSampler: 1});
        this.shader.setUniformsValues({imageCenter: [0.75, -0.75]});
        this.secCamera = new MyOQueOStorDeviaTerFeito(this.scene, 0, 0.5, 1.0, -0.5, -1.0);
    }

    update(){
        this.timecount++;
        this.shader.setUniformsValues({time: this.timecount % 200});
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