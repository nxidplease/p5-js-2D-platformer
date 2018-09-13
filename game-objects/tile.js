class Tile extends AxisAlignedBoundingBox{
    constructor(center, halfSize, tileType){
        super(center, halfSize);
        this.tileType = tileType;
    }
    static createTile(tileCol, tileRow, tileType){
        let halfSize = createVector(TILE_SIZE / 2, TILE_SIZE / 2);
        let tileCenterX = tileCol * TILE_SIZE + (TILE_SIZE / 2);
        let tileCenterY = tileRow * TILE_SIZE + (TILE_SIZE / 2);
        let center = createVector(tileCenterX, tileCenterY);
        return new Tile(center, halfSize, tileType);
    }
}