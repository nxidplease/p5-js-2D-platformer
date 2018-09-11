const dt = 0.01;

let character;
let keyMap;
let lastUpdateTime = 0;
let accumulator = 0;

function initKeyMap(){
  keyMap = [];
  keyMap[KeyInput.Left] = LEFT_ARROW;
  keyMap[KeyInput.Right] = RIGHT_ARROW;
  keyMap[KeyInput.Jump] = UP_ARROW;
  keyMap[KeyInput.Down] = DOWN_ARROW;
}

function getkeyInputs(){

  let inputs = []

  for(let i = 0; i < KeyInput.InputsAmount; i++){
    let isDown = keyIsDown(keyMap[i]);
    /**
     * Before a key is pressed for the first time keyIsDown returns undefined 
     * when it should be false. This if fixes it, if the function returns false 
     * isDown will be set to false anyway so it doesn't break any logic
     */
    if(!isDown){
      isDown = false;
    }
    inputs[i] = isDown;
  }

  return inputs;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  initKeyMap();
  character = new Character(createVector());
  lastUpdateTime = millis();
}

function draw() {
  background(175);
  let keyInpts = getkeyInputs();
  let now = millis();
  let frameTime = (now - lastUpdateTime) / 1000;

  frameTime = max(frameTime, 0.25)
  lastUpdateTime = now;

  accumulator += frameTime;
  let prevState;

  while(accumulator >= dt){
    prevState = character.copy();
    character.timeStep(keyInpts, dt);
    accumulator -= dt;
  }

  if(prevState){
    let alpha = accumulator / dt;
    character.interpolate(prevState, alpha);
  }
  
  character.draw();
}
