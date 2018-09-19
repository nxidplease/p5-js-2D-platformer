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
let staticImageBuffer;
let backgroundColor;
let drawCtx;


function preload(){
  tileMapImage = loadImage(TILE_MAP_IMAGE_PATH);
}

function setup() {
  ZERO_VECTOR = createVector();
  Object.freeze(ZERO_VECTOR);
  backgroundColor = color(175);
  initColorToTileType();
  drawCtx = createCanvas(windowWidth, windowHeight).drawingContext;
  console.log(canvas);
  tileMap = new TileMap(tileMapImage);
  initKeyMap();
  character = new Character(createVector());
  lastUpdateTime = millis();
  camera = new Camera();
  screenCenter = createVector(width /2, height /2);

  staticImageBuffer = createGraphics(windowWidth, windowHeight);
  staticImageBuffer.background(backgroundColor);
  tileMap.drawToBuffer(staticImageBuffer);
  background(175);
}

function mousePressed(){
  character.position = createVector(mouseX, mouseY).sub(camera.position);
  character.velocity = createVector();
}

function draw() {
  camera.translate();
  character.clearPrev(backgroundColor);
  physics(getkeyInputs());
  camera.translateFromOrigin();
  image(staticImageBuffer, 0, 0);
  character.draw(backgroundColor);
}

function physics(keyInpts){
  let now = millis();
  let frameTime = (now - lastUpdateTime) / 1000;
  
  frameTime = max(frameTime, 0.25)
  lastUpdateTime = now;
  
  accumulator += frameTime;
  let prevState;
  let prevCamera;
  
  while(accumulator >= dt){
    prevState = character.copy();
    if(prevCamera){
      camera.copyTo(prevCamera);
    } else {
      prevCamera = camera.copy();
    }
    character.timeStep(keyInpts, dt);
    camera.arriveAt(p5.Vector.sub(screenCenter, character.position));
    camera.update(dt);
    accumulator -= dt;
  }
  
  let alpha = accumulator / dt;
  
  if(prevState){
    character.interpolate(prevState, alpha);
  }

  if(prevCamera){
    camera.interpolate(prevCamera, alpha);
  }
}
