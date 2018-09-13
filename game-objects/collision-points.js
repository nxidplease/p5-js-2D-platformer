const Direction = {
    Up : 0,
    Right : 1,
    Down : 2,
    Left : 3
}

Object.freeze(Direction);

class CollisonPoints {
    constructor(boundingBox){
        this.recalculate(boundingBox);
    }

    recalculate(newBoundingBox){
        let halfSize = newBoundingBox.halfSize;
        let center = newBoundingBox.center;
        let left = center.x - halfSize.x;
        let right = center.x + halfSize.x;
        let top = center.y - halfSize.y;
        let bottom = center.y + halfSize.y;

        this._points = [];

        this._points[Direction.Up] = [];
        this._points[Direction.Up].push(createVector(left * 0.75 + right * 0.25, top), 
                      createVector(left * 0.25 + right * 0.75, top));
        this._points[Direction.Left] = [];
        this._points[Direction.Left].push(createVector(left, top * 0.75 + bottom * 0.25),
                       createVector(left, top * 0.25 + bottom * 0.75));
        this._points[Direction.Down] = [];
        this._points[Direction.Down].push(createVector(left * 0.75 + right * 0.25, bottom), 
                         createVector(left * 0.25 + right * 0.75, bottom));

        this._points[Direction.Right] = [];
        this._points[Direction.Right].push(createVector(right, top * 0.75 + bottom * 0.25),
                    createVector(right, top * 0.25 + bottom * 0.75));
    }
    
    get points(){
        return this._points;
    }
}