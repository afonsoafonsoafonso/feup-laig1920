class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.board = new MyBoard(scene);
        this.plane = new Plane(scene, 5, 5);
        this.initBuffers();
    }

    display() {
        this.board.display();
        this.setupPickableGrid();
    }

    setupPickableGrid() {
        for(let i=0.5; i<6.5; i++) {
            for(let j=0.5; j<6.5; j++) {
                this.scene.pushMatrix();
                this.scene.registerForPick((i+0.5)*10 + j+0.5, this.plane);
                this.scene.translate(j, 0.01, i);
                this.plane.display();
                this.scene.popMatrix(); 
            }
        }
    }
}