/**
 * MySphere
 * @constructor
 * @param Scene
 */
class MySphere extends CGFobject {
    constructor(scene, radius, slices, stacks) {
		super(scene);

		this.slices = slices;
        this.stacks = stacks;
		this.radius = radius;
		this.s_length = 1;
		this.t_length = 1;

		this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		let omega_angle = 2*Math.PI/this.slices;
		let alpha_angle = 2*Math.PI/this.stacks;

		for(let i = 0; i <= this.slices; ++i) {

			for(let j = 0; j <= this.stacks; ++j) {

				this.vertices.push(
                    this.radius*Math.cos(alpha_angle*j)*Math.cos(omega_angle*i), 
                    this.radius*Math.cos(alpha_angle*j)*Math.sin(omega_angle*i), 
                    this.radius*Math.sin(alpha_angle*j)
				);

				this.normals.push(
                    Math.cos(alpha_angle*j)*Math.cos(omega_angle*i), 
                    Math.cos(alpha_angle*j)*Math.sin(omega_angle*i), 
                    Math.sin(alpha_angle*j)
				);

				this.texCoords.push(
                    j/this.stacks,
                    i/this.slices   
				);

			}

		}

		for (let i = 0; i < this.slices; ++i) {
			for(let j = 0; j < this.stacks; ++j) {
				this.indices.push(
					(i+1)*(this.stacks+1) + j, i*(this.stacks+1) + j+1, i*(this.stacks+1) + j,
					i*(this.stacks+1) + j+1, (i+1)*(this.stacks+1) + j, (i+1)*(this.stacks+1) + j+1
				);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();   
	}
	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the sphere
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}

	changeTexCoords(s,t){
        if(s == this.s_length && t == this.t_length)
            return;
		for(var i = 0;i < this.texCoords.length/2;i++){
			this.texCoords[2*i] = this.texCoords[2*i] * this.s_length/s ;
			this.texCoords[2*i+1] = this.texCoords[2*i+1] * this.t_length/t ;
		}
		this.s_length = s;
		this.t_length = t;
		this.updateTexCoordsGLBuffers();
    }
}