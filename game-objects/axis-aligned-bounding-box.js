class AxisAlignedBoundingBox {

    constructor(center, halfSize){
        this._center = center;
        this._halfSize = halfSize;
    }

    copy() {
        return new AxisAlignedBoundingBox(this.center, this.halfSize);
    }

    overlaps(otherBox){
        let xOverlap = Math.abs(this._center.x - otherBox.center.x) <= (this._halfSize.x + otherBox.halfSize.x);
        let yOverlap = Math.abs(this._center.y - otherBox.center.y) <= (this._halfSize.y + otherBox.halfSize.y);

        return xOverlap || yOverlap;
    }

    get halfSize() {
        return this._halfSize;
    }

    get center() {
        return this._center;
    }

    set center(newCenter){
        this._center = newCenter;
    }
}