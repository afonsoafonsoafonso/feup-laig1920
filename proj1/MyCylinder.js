/**
 * MyCylinder
 * @constructor
 * @param Scene
 * 
 */
class MyCylinder extends CGFobject {
    constructor(scene, base_r, top_r, height, slices, stacks) {
        super(scene);
        this.base_r = base_r;
        this.top_r = top_r;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;
        this.s_length = 1;
		this.t_length = 1;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        this.originalTexCoords = [];

        var deltaAng = 2*Math.PI/this.slices;
        var deltaStack = this.height/this.stacks;
        var deltaRad = (this.top_r-this.base_r)/this.stacks;

        for(let i=0; i<=this.slices; i++) {
            for(let j=0; j<=this.stacks; j++) {
                this.vertices.push(
                    Math.cos(deltaAng*i)*(this.base_r+deltaRad*j),
                    Math.sin(deltaAng*i)*(this.base_r+deltaRad*j),
                    j*deltaStack
                );

				this.originalTexCoords.push(i*1/this.slices, 1 - (j*1/this.stacks));

                this.normals.push(Math.cos(deltaAng*i), Math.sin(deltaAng*i), 0);
            }
        }

		for(let i=0; i<this.slices; i++) {
			for(let j=0; j<this.stacks; j++) {
                this.indices.push(i*(this.stacks+1)+j, (i+1)*(this.stacks+1)+j, (i+1)*(this.stacks+1)+j+1)
                this.indices.push(i*(this.stacks+1)+j+1, i*(this.stacks+1)+j, (i+1)*(this.stacks+1)+j+1)
            }
		}	

        this.texCoords = this.originalTexCoords.slice();
        this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();	
    }

    /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the cylinder
	 * @param s - S_lenght of the texture
	 * @param t - T_lenght of the textures
	 */
	updateTexCoords(s,t) {
		if(s == this.s_length && t == this.t_length)
            return;
		for(let i = 0; i < this.texCoords.length; i += 2){
			this.texCoords[i] = this.originalTexCoords[i] / s ;
			this.texCoords[i+1] = this.originalTexCoords[i+1] / t ;
		}
		this.updateTexCoordsGLBuffers();
	}
}
