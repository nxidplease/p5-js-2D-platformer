const MAX_CAMERA_PAN_SPEED = 50;
const MAPPED_RANGE = 70;

class Camera {
    constructor(){
        this.position = createVector();
        this.velocity = createVector();
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
        //translate(this.position.x, this.position.y);
    }
    
}