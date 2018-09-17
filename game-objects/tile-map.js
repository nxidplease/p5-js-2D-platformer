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
        this.tileRows = img.height;
        this.tileCols = img.width;
        this.imageToTiles(img);
    }

    imageToTiles(img){
        this.tiles = new Array(this.tileRows);
        this.blockedTiles = [];

        for(let i = 0; i < this.tileRows; i++){
            this.tiles[i] = new Array(this.tileCols);
            for(let j = 0; j < this.tileCols; j++){
                let clrStr = color(img.get(j, i)).toString();
                let tileType = colorToTileType.get(clrStr);
                let newTile = Tile.createTile(j, i, tileType);
                this.tiles[i][j] = newTile;
                if(tileType == TileType.Blocked){
                    this.blockedTiles.push(newTile);
                }
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