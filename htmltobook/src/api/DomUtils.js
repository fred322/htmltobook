/**
 * Copyright 2026 fred322
 * https://github.com/fred322
 * 
 */

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
        // create fake page to have dimensions of pages.
        let element = document.createElement("div");
        element.style = "height: 2px; width: 210mm; position: absolute; top: 0; left: 0;";
        document.body.appendChild(element);
        this._cmToPixel = element.offsetWidth / 21.0;

        this.isLandscape = document.body.classList.contains("landscape");
        this._pageHeight = this.cmToPixel(this.isLandscape ? this.a4Width : this.a4Height);
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
        if (options.marginTop != null) {
            res.setAttribute("style", "margin-top: " + options.marginTop + "px");
        }
        if (options.marginBottom != null) {
            res.setAttribute("style", "margin-bottom: " + options.marginBottom + "px");
        }
        return res;
    }

    cmToPixel(cm) {
        return cm * this._cmToPixel;
    }

    pixelToPdfPt(pixel) {
        // 28,35 pt => 1 cm
        return (pixel * 28.35) / this._cmToPixel;
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