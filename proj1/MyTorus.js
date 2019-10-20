/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject {
    constructor(scene, inner_r, outer_r, slices, loops){
        super(scene);
        this.inner_r = inner_r;
        this.outer_r = outer_r;
        this.slices = slices;
		this.loops = loops;
		this.s_length = 1;
		this.t_length = 1;

        this.initBuffers();
    }
    initBuffers() {
		
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.originalTexCoords = [];
		this.texCoords = [];

		var loop_angle = 2*Math.PI/this.loops;
        var slice_angle = 2*Math.PI/this.slices;

        for(let i = 0; i <= this.slices; ++i) {
			for(let j = 0; j <= this.loops; ++j) {
				this.vertices.push(
					(this.outer_r + this.inner_r*Math.cos(loop_angle*j)) * Math.cos(slice_angle*i), 
					(this.outer_r + this.inner_r*Math.cos(loop_angle*j)) * Math.sin(slice_angle*i), 
					this.inner_r * Math.sin(loop_angle*j));

				this.originalTexCoords.push(
					i/this.slices, 
					j/this.loops	
				);
				this.normals.push(
					(this.outer_r + this.inner_r*Math.cos(loop_angle*j)) * Math.cos(slice_angle*i), 
					(this.outer_r + this.inner_r*Math.cos(loop_angle*j)) * Math.sin(slice_angle*i), 
					this.inner_r * Math.sin(loop_angle*j));
			}
		}

		for (let i = 0; i < this.slices; ++i) {
			for(let j = 0; j < this.loops; ++j) {
				this.indices.push(
					(i+1)*(this.loops+1) + j, i*(this.loops+1) + j+1, i*(this.loops+1) + j,
					i*(this.loops+1) + j+1, (i+1)*(this.loops+1) + j, (i+1)*(this.loops+1) + j+1
				);
			}
		}	

		this.texCoords = this.originalTexCoords.slice();
	    this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
	}
	
	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the torus
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
