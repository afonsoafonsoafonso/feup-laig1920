class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.initBuffers();
        this.timecount = 0;
    }
    
    /**
     * Initializes the shaders for the Security Cakera and the Rectangle Object where the RTT texture will be applied
     */
    initBuffers(){
        this.shader = new CGFshader(this.scene.gl, "shaders/vertex.vert", "shaders/color.frag");
        this.shader.setUniformsValues({uSampler: 1});
        this.shader.setUniformsValues({imageCenter: [0.75, -0.75]});
        this.secCamera = new MyRectangle2(this.scene, 0, 0.5, 1.0, -0.5, -1.0);
    }

    /**
     * Every time the update function is called, the time counter is incremented and sent to the shader
     */
    update(){
        this.timecount++;
        this.shader.setUniformsValues({time: this.timecount % 200});
    }

    /**
     * 
     * Sets the Security Camera shader as active,
     * Applies the texture to the primitive and then displays the rectangle on the bottom right corner
     */
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