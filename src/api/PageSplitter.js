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
        // header & footer are 2cm + 0.5cm padding
        let pageSize = domUtils.cmToPixel(domUtils.a4Height);
        let headerSize = domUtils.cmToPixel(3);
        let contentSize = pageSize - 2 * headerSize;
        let posToBreak = headerSize + contentSize;

        let articleNode = document.getElementsByTagName("article")[0];
        let existingBreaks = document.getElementsByTagName("break_page");
        let element = articleNode.children[0];
        this._initiateNextPage(element);
        do {
            console.log("Creation new page");
            let posY = this.currentPage * pageSize - this.currentPageProperties.footerHeight;
            console.log("Look at pixel " + posY);

            this._breakPagesToPos(existingBreaks, posY);

            posY = this.currentPage * pageSize - this.currentPageProperties.footerHeight;

            element = domUtils.findClosestChild(articleNode, articleNode.offsetTop, 
                    posY, (el) => { return this.isBreakableElement(el)});
            if (element != null && element.tagName.toLowerCase() != "article") {
                element = this.findBreakableTagNames(element);
                if (element != null) {
                    this._breakAtElement(element, posY - posToBreak);
                }
            }
            else {
                element = null;
                console.log("No element found");
                break;
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
                    this._breakAtElement(element, 0);
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

    _breakAtElement(element, offset) {
        let pageSize = domUtils.cmToPixel(domUtils.a4Height);
        let newBreak = document.createElement("div");
        element.parentElement.insertBefore(newBreak, element);
        // take position of newBreak because element is not necessary in DOM
        let leftSize = pageSize * this.currentPage - domUtils.getPositionAbsolute(newBreak);
        newBreak.setAttribute("style", "height: " + leftSize + "px" );

        this._initiateNextPage(element);
    }

    _initiateNextPage(firstElement) {
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
        let contentPage = document.createElement("div");
        newPage.appendChild(contentPage);
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

        this.currentPageProperties = {
            headerHeight: header.offsetHeight,
            footerHeight: footer.offsetHeight
        }
    }
}

export default PageSplitter;