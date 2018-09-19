const MAX_COLLISION_ITERATIONS = 3;

class MovingObject{

    constructor(pos, velocity, size){
        this.oldPosition = this.position = pos;
        this.oldVelocity = this.velocity = velocity;
        let halfSize = size.div(2);

        this.boundingBox = new AxisAlignedBoundingBox(pos.copy(), halfSize);
        this.boundingBoxOffset = createVector();
        this.collisionPoints = new CollisonPoints(this.boundingBox);

        this.pushedLeftWall = this.pushesLeftWall = this.position.x < 0;
        this.pushedRightWall = this.pushesRightWall = (this.position.x + this.boundingBox.halfSize.x * 2) > width;

        this.wasOnGround = this.onGround = (this.position.y + this.boundingBox.halfSize.y * 2) >= height;
        this.wasAtCieling = this.atCieling = (this.position.y - this.boundingBox.halfSize.y * 2) <= 0;
        this.prevBb = new AxisAlignedBoundingBox(pos.copy(), halfSize.copy());
        this.color = color(175, 0, 0);
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
        let originalVelocity = p5.Vector.mult(this.velocity, deltaTime);
        this.gravityVel = GRAVITY * deltaTime;

        let actualVel = this.collisionDetection(originalVelocity);

        this.position.add(actualVel)

        let maxObjectTopPos = height - this.boundingBox.halfSize.y * 2;
        
        if(this.position.y >= maxObjectTopPos){
            this.position.y = maxObjectTopPos;
            this.onGround = true;
        } else {
            this.onGround = this.onPlatform;
        }    

        this.pushesLeftWall = this.position.x <= 0;
        this.pushesRightWall = (this.position.x + this.boundingBox.halfSize.x * 2) >= width;

        this.boundingBox.center = p5.Vector.add(this.position,this.boundingBoxOffset);
        this.collisionPoints.recalculate(this.boundingBox);
        this.updatePrevBoundingBox();
    }

    updatePrevBoundingBox(){
        this.prevBb.center.set(this.boundingBox.center);
        this.prevBb.halfSize.set(this.boundingBox.halfSize);
    }

    collisionDetection(originalVelocity){
        let collisionX, collisionBottom, collisionTop = true;

        for(let i = 0; i < MAX_COLLISION_ITERATIONS && (collisionX || collisionBottom || collisionTop); i++){
            collisionX = collisionBottom = collisionTop = false;
            originalVelocity = this.tilesCollision(collisionX, collisionBottom, collisionTop, originalVelocity);
        }

        return originalVelocity;
    }

    tilesCollision(collisionX, collisionBottom, collisionTop, originalVelocity){
        let projectedVel = originalVelocity.copy();

        for(let i = 0; i < tileMap.blockedTiles.length  && !collisionX && !collisionBottom && !collisionTop; i++){
            let currTile = tileMap.blockedTiles[i];
            projectedVel = this.resolvePenetration(projectedVel, currTile);
    
            collisionTop = (projectedVel.y > originalVelocity.y) && (originalVelocity.y < 0);
            collisionBottom = (projectedVel.y < originalVelocity.y) && (originalVelocity.y > 0);
            collisionX = Math.abs(projectedVel.x - originalVelocity.x) > 0.01;
    
            if(collisionBottom){
                this.onPlatform = true;
            }
    
            currTile.colided = (collisionBottom || collisionTop || collisionX);
    
            if(collisionX && collisionTop && projectedVel.y < 0){
                this.velocity.y = projectedVel.y = 0;
            }
        }

        if(collisionTop){
            this.velocity.y = 0;
        }

        if(this.onPlatform){
            // If on platform don't move down
            // but keep gravity to cause constant collision
            // to prevent character from going to jump state
            if(collisionBottom){
                this.velocity.y = this.gravityVel;
                projectedVel.y = 0;
            } else {
                this.onPlatform = false;
                this.lastOnPlatform = millis();
            }

        }


        if(collisionX){
            this.velocity.x = 0;
        }

        return projectedVel;
    }

    resolvePenetration(projectedVel, tile){
        projectedVel = this.resolvePenetrationTop(projectedVel, tile);
        projectedVel = this.resolvePenetrationBottom(projectedVel, tile);
        projectedVel = this.resolvePenetrationRight(projectedVel, tile);
        return this.resolvePenetrationLeft(projectedVel, tile);
    }

    resolvePenetrationTop(originalVelocity, tile){
        let velCpy = originalVelocity.copy();
        let collisionPoints = this.collisionPoints.points[Direction.Up];
        
        while(tile.containsPoint(p5.Vector.add(collisionPoints[0], velCpy)) || 
              tile.containsPoint(p5.Vector.add(collisionPoints[1], velCpy))){
                  velCpy.y++;
              }
        return velCpy;
    }

    resolvePenetrationBottom(originalVelocity, tile){
        let velCpy = originalVelocity.copy();
        let collisionPoints = this.collisionPoints.points[Direction.Down];
        
        while(tile.containsPoint(p5.Vector.add(collisionPoints[0], velCpy)) || 
              tile.containsPoint(p5.Vector.add(collisionPoints[1], velCpy))){
                  velCpy.y --;
              }

        return velCpy;
    }

    resolvePenetrationRight(originalVelocity, tile){
        let velCpy = originalVelocity.copy();
        let collisionPoints = this.collisionPoints.points[Direction.Right];
        
        while(tile.containsPoint(p5.Vector.add(collisionPoints[0], velCpy)) || 
              tile.containsPoint(p5.Vector.add(collisionPoints[1], velCpy))){
                  velCpy.x--;
              }
        return velCpy;
    }

    resolvePenetrationLeft(originalVelocity, tile){
        let velCpy = originalVelocity.copy();
        let collisionPoints = this.collisionPoints.points[Direction.Left];
        
        while(tile.containsPoint(p5.Vector.add(collisionPoints[0], velCpy)) || 
              tile.containsPoint(p5.Vector.add(collisionPoints[1], velCpy))){
                  velCpy.x++;
              }
        return velCpy;
    }

    draw(){
        push();
        this.boundingBox.draw(this.color);
        pop();
    }

    clearPrev(bgColor){
        push();
        stroke(bgColor);
        this.prevBb.draw(bgColor);
        pop();
    }
}