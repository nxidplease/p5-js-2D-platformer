const dt = 0.01;
const RECT_SIZE = 80;
const TILE_MAP_IMAGE_PATH = 'res/TileMap.bmp'

let character;
let camera;
let screenCenter;
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
  camera = new Camera();
  screenCenter = createVector(width /2, height /2);
}

function mousePressed(){
  character.position = createVector(mouseX, mouseY).sub(camera.position);
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
    camera.arriveAt(p5.Vector.sub(screenCenter, character.position));
    camera.update(dt);
    accumulator -= dt;
  }
  
  if(prevState){
    let alpha = accumulator / dt;
    character.interpolate(prevState, alpha);
  }


  translate(camera.position.x , camera.position.y);
  
  tileMap.draw()
  character.draw();
}
