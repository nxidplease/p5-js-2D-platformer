class MovingObject{

    constructor(pos, velocity, size){
        this.oldPosition = this.position = pos;
        this.oldVelocity = this.velocity = velocity;

        this.boundingBox = new AxisAlignedBoundingBox(pos, size.div(2));
        this.boundingBoxOffset = createVector();

        this.pushedLeftWall = this.pushesLeftWall = this.position.x < 0;
        this.pushedRightWall = this.pushesRightWall = (this.position.x + this.boundingBox.halfSize.x * 2) > width;

        this.wasOnGround = this.onGround = (this.position.y + this.boundingBox.halfSize.y * 2) >= height;
        this.wasAtCieling = this.atCieling = (this.position.y - this.boundingBox.halfSize.y * 2) <= 0;
    }

    copy() {
        return new MovingObject(this.position.copy(), this.velocity.copy(), this.size.copy());
    }

    update(deltaTime){
        this.oldPosition = this.position;
        this.oldVelocity = this.velocity;
        this.wasOnGround = this.onGround;
        this.pushedRightWall = this.pushesRightWall;
        this.pushedLeftWall = this.pushesLeftWall;

        this.position.add(p5.Vector.mult(this.velocity, deltaTime))

        let maxObjectTopPos = height - this.boundingBox.halfSize.y * 2;

        if(this.position.y >= maxObjectTopPos){
            this.position.y = maxObjectTopPos;
            this.onGround = true;
        } else {
            this.onGround = false;
        }

        this.pushesLeftWall = this.position.x <= 0;
        this.pushesRightWall = (this.position.x + this.boundingBox.halfSize.x * 2) >= width;

        this.boundingBox.center = p5.Vector.add(this.position,this.boundingBoxOffset);
    }

    draw(){
        push();
        rectMode(CENTER);
        let bbCenter = this.boundingBox.center;
        let bbHalfSize = this.boundingBox.halfSize;
        fill(175, 0, 0);
        rect(bbCenter.x, bbCenter.y, bbHalfSize.x * 2, bbHalfSize.y * 2);
        pop();
    }
}