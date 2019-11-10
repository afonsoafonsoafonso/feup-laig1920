class Plane extends CGFobject {
     constructor(scene, divsU, divsV) {
        super(scene);
        this.divsU = divsU;
        this.divsV = divsV;
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

        this.obj = new CGFnurbsObject(this.scene, divsU, divsV, nurbsSurface);
     }

     display() {
         this.obj.display();
     }
};