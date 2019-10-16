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
      	this.normals = [];
    	this.indices = [];
      	this.texCoords = [];

      	var ang_slices = 2 * Math.PI / this.slices;
      	var ang_stacks = Math.PI / this.stacks;

      	for (var i = 0; i <= this.stacks; i++) {
          for (var j = 0; j <= this.slices; j++) {
              
              this.vertices.push(
					this.radius * Math.cos(ang_slices * j) * Math.sin(ang_stacks * i),
              		this.radius * Math.sin(ang_slices * j) * Math.sin(ang_stacks * i),
					this.radius * Math.cos(ang_stacks * i)
				);
              this.normals.push(
					Math.cos(ang_slices * j) * Math.sin(ang_stacks * i),
			  		Math.sin(ang_slices * j) * Math.sin(ang_stacks * i),
					Math.cos(ang_stacks * i)
				);
              this.texCoords.push(
				  	j / this.slices,
				   	1 - i / this.stacks
				);
         	}
      	}

      	for (var i = 0; i < this.stacks; i++) {
          	for (var j = 0; j < this.slices; j++) {
              this.indices.push(i * (this.slices + 1) + j, (i + 1) * (this.slices + 1) + j, (i + 1) * (this.slices + 1) + j + 1);
              this.indices.push(i * (this.slices + 1) + j, (i + 1) * (this.slices + 1) + j + 1, i * (this.slices + 1) + j + 1);
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