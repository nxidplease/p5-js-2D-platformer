class AxisAlignedBoundingBox {

    constructor(center, halfSize){
        this._center = center;
        this._halfSize = halfSize;
        this.calcCorners();
    }

    copy() {
        return new AxisAlignedBoundingBox(this.center, this.halfSize);
    }

    calcCorners(){
        this.top = this._center.y - this._halfSize.y;
        this.bottom = this._center.y + this._halfSize.y;
        this.right = this._center.x + this._halfSize.x;
        this.left = this._center.x - this._halfSize.x;
    }

    overlaps(otherBox){
        let xOverlap = Math.abs(this._center.x - otherBox.center.x) <= (this._halfSize.x + otherBox.halfSize.x);
        let yOverlap = Math.abs(this._center.y - otherBox.center.y) <= (this._halfSize.y + otherBox.halfSize.y);

        return xOverlap || yOverlap;
    }

    containsPoint(pt){
        let containsX = (pt.x >= this.left) && (pt.x <= this.right);
        let containsY = (pt.y >= this.top) && (pt.y <= this.bottom);
        return (containsX && containsY);
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