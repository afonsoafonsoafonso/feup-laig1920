/**
 * MyTriangle
 * @constructor
 */
class MyTriangle extends CGFobject {
    constructor(scene, ver1, ver2, ver3) {
        super(scene);
        this.v1 = ver1;
        this.v2 = ver2;
        this.v3 = ver3;
        this.initBuffers();
    }
    initBuffers(){

        this.vertices = [];
        this.vertices.push(this.v1[0],this.v1[1], this.v1[2]);
        this.vertices.push(this.v2[0],this.v2[1], this.v2[2]);
        this.vertices.push(this.v3[0],this.v3[1], this.v3[2]);

        this.indices = [0,1,2];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
        

        let u = [this.v2[0]-this.v1[0],this.v2[1]-this.v1[1], this.v2[2]-this.v1[2]];
        let v = [this.v3[0]-this.v1[0],this.v3[1]-this.v1[1], this.v3[2]-this.v1[2]];

        
		let nx = u[1]*v[2] - u[2]*v[1];
		let ny = u[2]*v[0] - u[0]*v[2];
		let nz = u[0]*v[1] - u[1]*v[0];

		this.normals = [
			nx, ny, nz,
			nx, ny, nz,
			nx, ny, nz
		];  
    }   

}
