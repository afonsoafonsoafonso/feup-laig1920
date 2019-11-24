class Plane extends CGFobject {
     constructor(scene, ndivsU, ndivsV) {
        super(scene);
        this.ndivsU = ndivsU;
        this.ndivsV = ndivsV;
        // degree on U: 1 => control vertexes on U: 2
        // degree on V: 1 => control vertexes on V: 2
        this.controlPoints = [  
        [
            [0.5,0.0,-0.5,1],
            [0.5,0.0, 0.5,1]
        ],
        [
            [-0.5,0.0,-0.5,1],
            [-0.5,0.0, 0.5,1]
        ]
        ];

        var nurbsSurface = new CGFnurbsSurface(1, 1, this.controlPoints);

        this.obj = new CGFnurbsObject(this.scene, this.ndivsU, this.ndivsV, nurbsSurface);
     }

    display() {
         this.obj.display();
     }

    updateTexCoords(s,t) {
		return;
	}

};