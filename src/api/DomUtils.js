class DomUtils {
    constructor() {
        this.a4Height = 29.7;
        this.a4Width = 21.0;
        this._cmToPixel = 0;
    }

    init() {
        this._cmToPixel = document.getElementsByTagName("body")[0].offsetWidth / this.a4Width;
    }

    cmToPixel(cm) {
        return Math.floor(cm * this._cmToPixel);
    }

    getPositionAbsolute(element) {
        return element.offsetTop + (element.parentElement != null ? this.getPositionAbsolute(element.parentElement) : 0);
    }

    findClosestChild(parentElement, positionParent, posY, filter) {
        if (parentElement.children.length != 0) {
            for (let child of parentElement.children) {
                if (positionParent + child.offsetTop + child.offsetHeight >= posY) {
                    if (child.tagName.toLowerCase() == "div") {
                        return this.findClosestChild(child, positionParent + child.offsetTop, posY, filter);
                    }
                    if (filter == null || filter(child)) {
                        return child;
                    }
                    break;
                }
            }
        }
        return parentElement;
    }
}

let domUtils = new DomUtils();
export default domUtils;