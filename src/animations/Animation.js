class Animation {
    constructor(scene, id) {
        this.scene = scene;
        this.id = id;
        this.done = false;
        this.start = false;
        this.transfMatrix = mat4.create();
    }

    update() {}

    apply() {}
}