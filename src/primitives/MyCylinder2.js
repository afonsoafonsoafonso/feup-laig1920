class MyCylinder2 extends CGFobject {
    constructor(scene, base_r, top_r, height, slices, stacks) {
        super(scene);

        this.base_r = base_r;
        this.top_r = top_r;
        this.height = height;
        this.npartsU = slices/2;
        this.npartsV = stacks/2;

        this.controlPoints = [
            [
                [-this.base_r, 0.0, 0.0, 1.0],
                [-this.top_r, this.height, 0.0, 1.0]
            ],
            [
                [-this.base_r, 0.0, (4/3)*this.base_r, 1.0],
                [-this.top_r, this.height, (4/3)*this.top_r, 1.0]
            ],
            [
                [this.base_r, 0.0, (4/3)*this.base_r, 1.0],
                [this.top_r, this.height, (4/3)*this.top_r, 1.0]
            ],
            [
                [this.base_r, 0.0, 0.0, 1.0],
                [this.top_r, this.height, 0.0, 1.0]
            ]
        ];

        var nurbsSurface = new CGFnurbsSurface(3, 1, this.controlPoints);

        this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface);
    }

	display(){
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1, 0, 0);
		this.obj.display();
		this.scene.pushMatrix();
		this.scene.rotate(Math.PI,0,1,0);
		this.obj.display();
        this.scene.popMatrix();
        this.scene.popMatrix(); 
    };
    
    updateTexCoords(length_s, length_t){

	};
}