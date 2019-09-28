/**
 * MySphere
 * @constructor
 * @param Scene
 */
class MySphere extends CGFobject {
    constructor(scene, radius, slices, stacks) {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = 2*stacks;
        this.initBuffers();
    }

    initBuffers() {
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
    }
}