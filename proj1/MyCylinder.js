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
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var deltaAng = 2*Math.PI/this.slices;
        var deltaStack = this.height/this.stacks;
        var deltaRad = (this.top_r-this.base_r)/this.stacks;

        for(var i=0; i<=this.slices; i++) {
            for(var j=0; j<=this.stacks; j++) {
                this.vertices.push(
                    Math.cos(deltaAng*i)*(this.base_r+deltaRad*j),
                    Math.sin(deltaAng*i)*(this.base_r+deltaRad*j),
                    j*deltaStack
                );

				this.texCoords.push(i*1/this.slices, 1 - (j*1/this.stacks));

                this.normals.push(Math.cos(deltaAng*i), Math.sin(deltaAng*i), 0);
            }
        }

        // não deveria ser preciso ter um if para a última slice?
        // opá funciona na mesma safoda
		for(var i=0; i<this.slices; i++) {
			for(var j=0; j<this.stacks-1; j++) {
                this.indices.push(i*(this.stacks+1)+j, (i+1)*(this.stacks+1)+j, (i+1)*(this.stacks+1)+j+1)
                this.indices.push(i*(this.stacks+1)+j+1, i*(this.stacks+1)+j, (i+1)*(this.stacks+1)+j+1)
            }
		}	

        this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();	
    }
}