const TILE_SIZE = 40;

const TileType = {
    Empty : 0,
    Blocked : 1 
}

Object.freeze(TileType);

const colorToTileType = new Map();

function initColorToTileType(){
    colorToTileType.set(color('white').toString(), TileType.Empty);
    colorToTileType.set(color('black').toString(), TileType.Blocked);
    
    Object.freeze(colorToTileType);
}


class TileMap {
    constructor(img){
        this.tileRows = Math.round(height / TILE_SIZE);
        this.tileCols = Math.round(width / TILE_SIZE);
        this.imageToTiles(img);
    }

    imageToTiles(img){
        this.tiles = [];

        for(let i = 0; i < this.tileRows; i++){
            this.tiles[i] = [];
            for(let j = 0; j < this.tileCols; j++){
                let clrStr = color(img.get(j, i)).toString();
                let tileType = colorToTileType.get(clrStr);
                this.tiles[i][j] = Tile.createTile(j, i, tileType);
            }
        }
    }

    draw() {
        push();
        stroke(color('lime'))
        for(let i = 0; i < this.tileRows; i++){
            for(let j = 0; j < this.tileCols; j++){
                if(this.tiles[i][j].tileType == TileType.Blocked){
                    let x = j * TILE_SIZE;
                    let y = i * TILE_SIZE;
                    if(this.tiles[i][j].colided){
                        fill(150, 0, 0);
                    } else {
                        fill(0);
                    }
                    rect(x, y, TILE_SIZE, TILE_SIZE);
                }
            }
        }

        pop();
    }
}