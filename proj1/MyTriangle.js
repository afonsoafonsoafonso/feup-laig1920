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
        this.s_length = 1;
		this.t_length = 1;
        this.initBuffers();
    }
    initBuffers(){

        this.vertices = [];
        this.vertices.push(this.v1[0],this.v1[1], this.v1[2]);
        this.vertices.push(this.v2[0],this.v2[1], this.v2[2]);
        this.vertices.push(this.v3[0],this.v3[1], this.v3[2]);

        this.indices = [
            0, 1, 2,
        ];

        let u = [this.v2[0]-this.v1[0],this.v2[1]-this.v1[1], this.v2[2]-this.v1[2]];
        let v = [this.v3[0]-this.v1[0],this.v3[1]-this.v1[1], this.v3[2]-this.v1[2]];

        
		let nx = u[1]*v[2] - u[2]*v[1];
		let ny = u[2]*v[0] - u[0]*v[2];
		let nz = u[0]*v[1] - u[1]*v[0];

		this.normals = [
			nx, ny, nz,
			nx, ny, nz,
            nx, ny, nz,
        ];  
        
        this.texCoords = [
			0, 1,
			1, 1,
            0.5, 0,
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }   

   /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the triangle
	 * @param s - S_lenght of the texture
	 * @param t - T_lenght of the textures
	 */
	updateTexCoords(s,t) {
		if(s == this.s_length && t == this.t_length)
            return;
		for(let i = 0; i < this.texCoords.length; i += 2){
			this.texCoords[i] = this.texCoords[i] * this.s_length / s ;
			this.texCoords[i+1] = this.texCoords[i+1] * this.t_length / t ;
		}
		this.updateTexCoordsGLBuffers();
	}
}
