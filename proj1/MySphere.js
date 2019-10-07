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

                // TODO: divide by 4 instead of 2 (in X)?
				this.texCoords.push(
                    omega_angle*i / (2*Math.PI),
                    1- ((alpha_angle*j + Math.PI/2) / Math.PI)
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
        /*
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var stackStep = Math.PI / this.stacks;
        var sliceStep = 2*Math.PI / this.slices;

        for(var i=0; i<=this.stacks; i++) {
            for(var j=0; j<=this.slices; j++) {
                this.vertices.push(
                    this.radius*Math.cos(Math.PI/2-i*stackStep)*Math.cos(j*sliceStep),
                    this.radius*Math.cos(Math.PI/2-i*stackStep)*Math.sin(j*sliceStep),
                    this.radius*Math.sin(Math.PI/2-i*stackStep)
                )
                this.normals.push(
                    Math.cos(Math.PI/2-i*stackStep)*Math.cos(j*sliceStep),
                    Math.cos(Math.PI/2-i*stackStep)*Math.sin(j*sliceStep),
                    Math.sin(Math.PI/2-i*stackStep)
                )
            }
        }
        //top e bottom apenas requerem triangulos para unir ao vertice do topo
        for(var i=0; i<this.stacks; i++) {
            for(var j=0; j<this.slices; j++) {
                if(i!=0) {
                    this.indices.push(
                        i*(this.slices+1), 
                        i*(this.slices+1)+this.stacks+1, 
                        i*(this.slices+1)+this.stacks+2
                    )
                }
                if(i!=(this.stacks-1)) {
                    this.indices.push(
                        i*(this.slices+1)+this.stacks+2,
                        i*(this.slices+1)+this.stacks+1, 
                        i*(this.slices+1)+this.stacks+2 
                    )
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
        */
    }
}