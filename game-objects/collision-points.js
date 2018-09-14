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
        
        let topLeft = createVector(left * 0.75 + right * 0.25, top);
        let topRight = createVector(left * 0.25 + right * 0.75, top);

        let leftTop = createVector(left, top * 0.75 + bottom * 0.25);
        let leftBottom = createVector(left, top * 0.25 + bottom * 0.75);

        let bottomLeft = createVector(left * 0.75 + right * 0.25, bottom);
        let bottomRight = createVector(left * 0.25 + right * 0.75, bottom);

        let rightTop = createVector(right, top * 0.75 + bottom * 0.25);
        let rightBottom = createVector(right, top * 0.25 + bottom * 0.75);

        this._points = new Array(4);

        this._points[Direction.Up] = new Array(topLeft, topRight);
        this._points[Direction.Left] = new Array(leftTop, leftBottom);
        this._points[Direction.Down] = new Array(bottomLeft, bottomRight);
        this._points[Direction.Right] = new Array(rightTop, rightBottom);
    }
    
    get points(){
        return this._points;
    }
}