class DomUtils {
    constructor() {
        this.a4Height = 29.7;
        this.a4Width = 21.0;
        this._cmToPixel = 0;
        this._pageHeight = 0;
        
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.debug = urlParams.get("debug");
    }

    init() {
        this._cmToPixel = document.getElementsByTagName("body")[0].offsetWidth / this.a4Width;
        this._pageHeight = this.cmToPixel(this.a4Height);
    }

    isDebug() {
        return this.debug;        
    }

    getPageHeight() {
        return this._pageHeight;
    }

    createElement(name, options) {
        let res = document.createElement(name);
        if (options.classes != null) {
            for (let element of options.classes) {
                res.classList.add(element);
            }
        }
        if (options.height != null) {
            res.setAttribute("style", "height: " + options.height + "px");
        }
        return res;
    }

    cmToPixel(cm) {
        return Math.floor(cm * this._cmToPixel);
    }

    pixelToPdfPt(pixel) {
        // 28,35 pt => 1 cm
        return Math.floor((pixel * 28.35) / this._cmToPixel);
    }
    /**
     * Get the absolute to position of given element.
     * @param {Element} element 
     * @returns 
     */
    getPositionAbsolute(element) {
        return element.offsetTop + (element.offsetParent != null ? this.getPositionAbsolute(element.offsetParent) : 0);
    }

    /**
     * Get the page number from given element.
     * @param {Element} element 
     * @returns 
     */
    getPageNumber(element) {
        return Math.floor(this.getPositionAbsolute(element) / this._pageHeight) + 1;
    }

    /**
     * Get the position in page for given element.
     * @param {Element} element 
     */
    getPositionInPage(element) {
        return this.getPositionAbsolute(element) - (this.getPageNumber(element) - 1) * this._pageHeight;
    }

    findClosestChild(parentElement, posY, filter) {
        if (parentElement.children.length != 0) {
            for (let child of parentElement.children) {
                if (domUtils.getPositionAbsolute(child) + child.offsetHeight >= posY) {
                    if (filter(child)) {
                        let found = this.findClosestChild(child, posY, filter);
                        if (found != null) {
                            return found;
                        }
                    }
                    return child;
                }
            }
        }
        return parentElement;
    }
}

let domUtils = new DomUtils();
export default domUtils;