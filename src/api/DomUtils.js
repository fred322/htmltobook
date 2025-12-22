class DomUtils {
    constructor() {
        this.a4Height = 29.7;
        this.a4Width = 21.0;
        this._cmToPixel = 0;
        this._pageHeight = 0;
    }

    init() {
        this._cmToPixel = document.getElementsByTagName("body")[0].offsetWidth / this.a4Width;
        this._pageHeight = this.cmToPixel(this.a4Height);
    }

    cmToPixel(cm) {
        return Math.floor(cm * this._cmToPixel);
    }

    /**
     * Get the absolute to position of given element.
     * @param {Element} element 
     * @returns 
     */
    getPositionAbsolute(element) {
        return element.offsetTop + (element.parentElement != null ? this.getPositionAbsolute(element.parentElement) : 0);
    }

    /**
     * Get the page number from given element.
     * @param {Element} element 
     * @returns 
     */
    getPageNumber(element) {
        return Math.floor(this.getPositionAbsolute(element) / this._pageHeight) + 1;
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