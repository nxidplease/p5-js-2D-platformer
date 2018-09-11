const GRAVITY = 7.5;
const MAX_FALLING_SPEED = 5;
const MIN_JUMP_SPEED = 25;
const WALK_SPEED = 35;
const JUMP_SPEED = 50;
const CHARACTER_HEIGHT = 40;
const CHARACTER_WIDTH = 10;

const KeyInput = {
    Left : 0,
    Right : 1,
    Down : 2,
    Jump : 3,
    InputsAmount : 4
}
Object.freeze(KeyInput);

const CharacterState = {
    Stand : 0,
    Walk : 1,
    Jump : 2,
    GrabLedge : 3
}

class Character extends MovingObject{

    constructor(pos, velocity = createVector()){
        super(pos, velocity, createVector(CHARACTER_WIDTH, CHARACTER_HEIGHT));
        this.boundingBoxOffset.y = this.boundingBox.halfSize.y;
        this.boundingBoxOffset.x = this.boundingBox.halfSize.x;
        this.jumpSpeed = JUMP_SPEED;
        this.walkSpeed = WALK_SPEED;
        this.state = CharacterState.Stand;
        this.inputs = [];
        this.prevInputs = [];
    }

    copy() {
        let cpy = new Character(this.position, this.velocity);
        cpy.state = this.state;
        cpy.inputs = this.inputs.slice();
        cpy.prevInputs = this.prevInputs.slice();

    }

    interpolate(other, alpha){
       this.position.lerp(other.position, alpha);
       this.velocity.lerp(other.velocity, alpha);
       this.boundingBoxOffset.lerp(other.boundingBoxOffset, alpha);
    }

    released(key){
        return (!this.inputs[key] && this.prevInputs[key])
    }

    isPressed(key){
        return this.inputs[key];
    }

    wasPressed(key){
        return (this.inputs[key] && !this.prevInputs[key]);
    }

    timeStep(newInputs, deltaTime){
        this.inputs = newInputs;
        this.update(deltaTime);
    }

    update(deltaTime) {
        switch(this.state){
            case CharacterState.Stand:{
                this.velocity = createVector();

                if (!this.onGround){
                    this.state = CharacterState.Jump;
                    break;
                }

                if(this.isPressed(KeyInput.Right) != this.isPressed(KeyInput.Left)){
                    this.state = CharacterState.Walk;
                    break;
                } else if(this.isPressed(KeyInput.Jump)){
                    this.velocity.y = -this.jumpSpeed;
                    this.state = CharacterState.Jump;
                    break;
                }
                
                break;
            }

            case CharacterState.Walk:{
                if(this.isPressed(KeyInput.Right) == this.isPressed(KeyInput.Left)){
                    this.state = CharacterState.Stand;
                    this.velocity = createVector();
                } else if(this.isPressed(KeyInput.Right)){
                    if(this.pushesRightWall){
                        this.velocity.x = 0;
                        this.position.x = width - 2 * this.boundingBox.halfSize.x;
                    } else {
                        this.velocity.x = this.walkSpeed;
                    }
                } else if(this.isPressed(KeyInput.Left)){
                    if(this.pushesLeftWall){
                        this.velocity.x = 0;
                        this.position.x = 0;
                    } else {
                        this.velocity.x = -this.walkSpeed;
                    }
                }

                if(this.isPressed(KeyInput.Jump)){
                    this.velocity.y = -this.jumpSpeed;
                    this.state = CharacterState.Jump;
                    break;
                } else if(!this.onGround){
                    this.state = CharacterState.Jump;
                    break;
                }
                break;
            }
            
            case CharacterState.Jump:{
                this.velocity.y += GRAVITY * deltaTime;

                if(this.velocity.y > 0){
                    this.velocity.y = max(this.velocity.y, MAX_FALLING_SPEED);
                }

                if(this.isPressed(KeyInput.Right) == this.isPressed(KeyInput.Left)){
                    this.velocity.x = 0;
                } else if(this.isPressed(KeyInput.Right)){
                    if(this.pushedRightWall){
                        this.velocity.x = 0;
                    } else {
                        this.velocity.x = this.walkSpeed;
                    }
                } else if(this.isPressed(KeyInput.Left)){
                    if(this.pushesLeftWall){
                        this.velocity.x = 0;
                    } else {
                        this.velocity.x = -this.walkSpeed;
                    }
                }

                if(!this.isPressed(KeyInput.Jump) && this.velocity.y < 0){
                    this.velocity.y = max(this.velocity.y, -MIN_JUMP_SPEED);
                }

                if(this.onGround){
                    if(this.inputs[KeyInput.Right] == this.inputs[KeyInput.Left]){
                        this.state = CharacterState.Stand;
                        this.velocity = createVector();
                    } else {
                        this.state = CharacterState.Walk;
                        this.velocity.y = 0;
                    }
                }

                break;
            }

            case CharacterState.GrabLedge:{
                break;
            }
        }

        super.update(deltaTime);

        this.updateInputs();
    }

    updateInputs(){
        for(let i = 0; i < KeyInput.InputsAmount; i++){
            this.prevInputs[i] = this.inputs[i];
        }
    }
}