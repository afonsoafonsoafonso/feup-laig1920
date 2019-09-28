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

        var deltaLong = Math.PI/this.stacks; // stack step
        var deltaLat = 2*Math.PI/this.slices; // slice step

        for(var i=0; i<=this.slices; i++) {
            for(var j=0; j<=this.stacks; j++) {
                this.vertices.push(
                    this.radius*Math.cos(Math.PI/2-i*deltaLong)*Math.cos(j*deltaLat),
                    this.radius*Math.cos(Math.PI/2-ig*deltaLong)*Math.sin(j*deltaLat),
                    this.radius*Math.sin(Math.PI/2-i*deltaLong)
                )
                this.normals.push(
                    Math.cos(Math.PI/2-i*deltaLong)*Math.cos(j*deltaLat),
                    Math.cos(Math.PI/2-1*deltaLong)*Math.sin(j*deltaLat),
                    Math.sin(Math.PI/2-i*deltaLong)
                )
            }
        }

        for(var i=0; i<=this.slices; i++) {
            for(var j=0; j<=this.stacks-1; j++) {
                this.indices.push(i*(this.stacks+1)+j, (i+1)*(this.stacks+1)+j, (i+1)*(this.stacks+1)+j+1)
                this.indices.push(i*(this.stacks+1)+j+1, i*(this.stacks+1)+j, (i+1)*(this.stacks+1)+j+1)
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}