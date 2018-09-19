const MAX_CAMERA_PAN_SPEED = 50;
const MAPPED_RANGE = 70;

class Camera {
    constructor(){
        this.position = createVector();
        this.velocity = createVector();
        this.lastTrans = createVector();
    }

    copyTo(otherCamera){
        otherCamera.position.set(this.position);
        otherCamera.velocity.set(this.velocity);
        otherCamera.lastTrans.set(this.lastTrans);
    }

    copy(){
        let cpy = new Camera();
        this.copyTo(cpy);
        return cpy;
    }

    interpolate(other, alpha){
        this.position.lerp(other.position, alpha);
        this.velocity.lerp(other.velocity, alpha);
    }

    arriveAt(dest){
        let distance = this.position.dist(dest);
        let speed;

        if(distance > MAPPED_RANGE){
            speed = MAX_CAMERA_PAN_SPEED;
        } else {
            speed = map(distance, MAPPED_RANGE, 0, MAX_CAMERA_PAN_SPEED, 0);
        }

        this.velocity = p5.Vector.sub(dest, this.position).setMag(speed);
    }

    update(deltaTime){
        this.position.add(p5.Vector.mult(this.velocity, deltaTime));
        this.lastVelChange = p5.Vector.mult(this.velocity, deltaTime);
    }

    translate(){
        this.lastTrans = this.position.copy();
        translate(Math.round(this.position.x), Math.round(this.position.y));
    }
    
    translateFromOrigin(){
        translate(Math.round(this.position.x) + Math.round(-this.lastTrans.x), Math.round(this.position.y) + Math.round(-this.lastTrans.y));
        this.lastTrans = this.position.copy();
    }

    resetTranslate(){
        translate(Math.round(-this.lastTrans.x), Math.round(-this.lastTrans.y));
    }
    
}