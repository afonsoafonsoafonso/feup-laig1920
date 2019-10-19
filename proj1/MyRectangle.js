/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of rectangle in X
 * @param y - Scale of rectangle in Y
 */
class MyRectangle extends CGFobject {
	constructor(scene, id, x1, x2, y1, y2) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		this.s_length = 1;
		this.t_length = 1;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y1, 0,	//1
			this.x1, this.y2, 0,	//2
			this.x2, this.y2, 0,	//3
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			3, 2, 1,
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
		];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.originalTexCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0
		]
		
		this.texCoords = this.originalTexCoords.slice();
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param s - S_lenght of the texture
	 * @param t - T_lenght of the textures
	 */
	updateTexCoords(s,t) {
		
		var factorS = s || 1;
        var factorT = t || 1;
        this.texCoords = [];

        var min_S = 0;
        var min_T = 0;
        var max_S = (this.x2 - this.x1) / factorS;
        var max_T = (this.y2 - this.y1) / factorT;
    
        this.texCoords.push(min_S, max_T);
        this.texCoords.push(max_S, max_T);
        this.texCoords.push(min_S, min_T);
        this.texCoords.push(max_S, min_T);
		this.updateTexCoordsGLBuffers();
	}
}

