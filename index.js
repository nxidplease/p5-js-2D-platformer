const dt = 0.01;
const RECT_SIZE = 80;
const TILE_MAP_IMAGE_PATH = 'res/TileMap.bmp'

let character;
let tileMapImage;
let tileMap;
let lastUpdateTime = 0;
let accumulator = 0;


function preload(){
  tileMapImage = loadImage(TILE_MAP_IMAGE_PATH);
}

function setup() {
  initColorToTileType();
  createCanvas(windowWidth, windowHeight);
  tileMap = new TileMap(tileMapImage);
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

  //translate(width /2 - character.position.x, height /2 - character.position.y);
  
  tileMap.draw()
  character.draw();
  push();
  strokeWeight(4);
  stroke(175, 0, 0);
  point(320, 80)
  pop();
}
