/**
 * MyCylinder
 * @constructor
 * @param Scene - Reference to MyScene object
 */
class MyCylinder extends CGFobject {
    constructor(scene, slices) {
        super(scene);
        this.slices = slices;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;
        var stackHeight = this.height/this.stacks;  
        //declaring bottom vertices
        for(var i=0, ang=0; i<this.slices; i++, ang+=alphaAng) {
            this.vertices.push(Math.cos(ang)*this.bottom_radius, -Math.sin(ang)*this.bottom_radius, 0); 
        }
        //declaring top vertices
        for(var i=0, ang=0; i<this.slices; i++, ang+=alphaAng) {
            this.vertices.push(Math.cos(ang)*this.top_radius, -Math.sin(ang)*this.top_radius, 1);
        }
        //declaring indices
        for(var i=0; i<this.slices; i++) {
            if(i==this.slices-1) {
                this.indices.push(i, 0, this.slices);
                this.indices.push(i, this.slices, this.slices*2-1);
            }
            else {
                this.indices.push(i, i+1, i+this.slices+1);
                this.indices.push(i, i+this.slices+1, i+this.slices);
            }
        }
        //declaring lower normals
        for(var i=0, ang=0; i<this.slices; i++, ang+=alphaAng) {
            //this.normals.push(Math.cos(ang), 0, -Math.sin(ang));
            this.normals.push(-Math.cos(ang), Math.sin(ang), 0);
        }
        //declaring upper normals
        for(var i=0, ang=0; i<this.slices; i++, ang+=alphaAng) {
            //this.normals.push(Math.cos(ang), 0, -Math.sin(ang));
            this.normals.push(-Math.cos(ang), Math.sin(ang), 0);
        }
        //declaring texture coordenates

        for(var i=0; i<this.slices;i++)
            this.texCoords.push(
                0,1,
                1,1,
                0,0,
                1,0
            );        

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}