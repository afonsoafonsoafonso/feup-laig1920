class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.board = new MyBoard(scene);
        console.log('CONSTRUCOTR');
        this.initBuffers();
    }

    display() {
        this.board.display();
    }
}