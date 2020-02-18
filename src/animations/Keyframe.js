class Keyframe {
    constructor(inst, tx, ty, tz, rx, ry, rz, sx, sy, sz) {
        this.inst = inst*1000;
        this.tx = tx;
        this.ty = ty;
        this.tz = tz;
        this.rx = rx;
        this.ry = ry;
        this.rz = rz;
        this.sx = sx;
        this.sy = sy;
        this.sz = sz;
    }
}