class DomUtils {
    constructor() {
        this.a4Height = 29.7;
        this.a4Width = 21.0;
        this._cmToPixel = 0;
        this._pageHeight = 0;
        
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.debug = urlParams.get("debug") == "true";
    }

    init() {
        this._cmToPixel = document.getElementsByTagName("body")[0].offsetWidth / this.a4Width;
        this._pageHeight = this.cmToPixel(this.a4Height);
    }

    isDebug() {
        return this.debug;        
    }

    /**
     * The value of given variable in meta.
     * @param {string} varName 
     */
    getMetaValue(varName) {
        let metas = document.getElementsByTagName("meta");
        for (let meta of metas) {
            if (meta.getAttribute("name") == varName) {
                return meta.getAttribute("content");
            }
        }
        return null;
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
     * Get the absolute position of given element.
     * @param {Element} element 
     * @returns 
     */
    getAbsolutePosition(element) {
        return element.offsetTop + (element.offsetParent != null ? this.getAbsolutePosition(element.offsetParent) : 0);
    }

    /**
     * Get the bottom absolute position of given element.
     * @param {Element} element 
     * @returns 
     */
    getBottomAbsolutePosition(element) {
        return this.getAbsolutePosition(element) + element.offsetHeight + parseFloat(window.getComputedStyle(element).marginBottom);
    }

    /**
     * Get the page number from given element.
     * @param {Element} element 
     * @returns 
     */
    getPageNumber(element) {
        return Math.floor(this.getAbsolutePosition(element) / this._pageHeight) + 1;
    }

    /**
     * Get the position in page for given element.
     * @param {Element} element 
     */
    getPositionInPage(element) {
        return this.getAbsolutePosition(element) - (this.getPageNumber(element) - 1) * this._pageHeight;
    }
}

let domUtils = new DomUtils();
export default domUtils;