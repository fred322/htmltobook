import domUtils from "./DomUtils.js"

class PageSplitter {
    constructor() {
        this.breakableTagNames = [ "div", "p", "table", "section", "tr" ];
        this.currentPage = 0;
        this.currentPageProperties = null;
    }

    isBreakableElement(element) {
        let elTagName = element.tagName.toLowerCase();
        for (let tagName of this.breakableTagNames) {
            if (elTagName == tagName) {
                return true;
            }
        }
        return false;
    }
    findBreakableTagNames(child) {
        if (child == null || child.tagName.toLowerCase() == "body") return null;
        if (this.isBreakableElement(child)) return child;
        return this.findBreakableTagNames(child.parentElement);
    }
    
    breakPages() {
        let articleNode = document.getElementsByTagName("article")[0];
        let existingBreaks = document.getElementsByTagName("break_page");
        let element = articleNode.children[0];
        this._initiateNextPage(element);
        do {
            let posY = this.currentPageProperties.footerY;
            console.log("Look at pixel " + posY);

            if (this._breakPagesToPos(existingBreaks, posY) == 0) {
                element = domUtils.findClosestChild(articleNode, articleNode.offsetTop, 
                        posY, (el) => { return this.isBreakableElement(el)});
                if (element != null && element.tagName.toLowerCase() != "article") {
                    element = this.findBreakableTagNames(element);
                    if (element != null) {
                        console.log("Break at element");
                        this._breakAtElement(element);
                    }
                }
                else {
                    element = null;
                    console.log("No element found");
                    break;
                }
            }
        } while (element != null);
    }

    /**
     * 
     * @param {Element[]} breaksElement 
     * @param {number} toPosY 
     */
    _breakPagesToPos(breaksElement, toPosY) {
        let count = 0;
        for (let element of breaksElement) {
            if (element.offsetHeight == 0 && !element.classList.contains("broken")) {
                if (domUtils.getPositionAbsolute(element) < toPosY) {
                    console.log("Break at break_page");
                    this._breakAtElement(element);
                    count++;
                }
                else {
                    break;
                }
            }
            element.classList.add("broken");
        }
        return count;
    }

    _breakAtElement(element) {
        let pageSize = domUtils.cmToPixel(domUtils.a4Height);
        let newBreak = document.createElement("div");
        element.parentElement.insertBefore(newBreak, element);
        // take position of newBreak because element is not necessary in DOM
        let leftSize = Math.ceil(this.currentPageProperties.endOfPageY - domUtils.getPositionAbsolute(newBreak));
        newBreak.setAttribute("style", "height: " + leftSize + "px" );

        this._initiateNextPage(element);
    }

    _initiateNextPage(firstElement) {
        console.log("Creation new page");
        this._createNextPage();

        if (this.currentPageProperties.headerHeight > 0) {
            firstElement.parentElement.insertBefore(
                domUtils.createElement("div", { height: this.currentPageProperties.headerHeight }), firstElement)
        }
    }
    _createNextPage() {
        this.currentPage = this.currentPage + 1;

        let headerDefault = document.getElementsByTagName("header")[0];
        let footerDefault = document.getElementsByTagName("footer")[0];

        let pageBorders = document.getElementById("pagesWrapper");
        let newPage = document.createElement("div");
        newPage.classList.add("page");
        newPage.classList.add("page_" + (this.currentPage));
        newPage.classList.add((this.currentPage % 2) == 0 ? "even" : "odd");
        let header = document.createElement("div");
        header.classList.add("header");
        header.innerHTML = headerDefault.innerHTML;
        header.setAttribute("style", "position: absolute");
        let footer = document.createElement("div");
        footer.classList.add("footer");
        footer.innerHTML = footerDefault.innerHTML;
        footer.setAttribute("style", "position: absolute");
        newPage.appendChild(header);
        newPage.appendChild(footer);
        pageBorders.appendChild(newPage);

        let additionalMargin = 0;
        let endOfPageY = domUtils.getPositionAbsolute(newPage) + newPage.offsetHeight;
        this.currentPageProperties = {
            /* Footer can be not shown => use newPage */
            footerY : Math.floor(endOfPageY - footer.offsetHeight),
            headerHeight: Math.ceil(header.offsetHeight + additionalMargin),
            footerHeight: Math.ceil(footer.offsetHeight + additionalMargin),
            endOfPageY: Math.ceil(endOfPageY)
        }
    }
}

export default PageSplitter;