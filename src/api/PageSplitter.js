import domUtils from "./DomUtils.js"

class PageSplitter {
    constructor() {
        this.breakableTagNames = [ "div", "p", "table", "section", "tr" ];
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

        let element = null;
        let posY = posToBreak;
        let articleNode = document.getElementsByTagName("article")[0];
        let firstElement = document.createElement("div");
        let existingBreaks = document.getElementsByTagName("break_page");
        firstElement.setAttribute("style", "height: " + headerSize + "px");
        articleNode.insertBefore(firstElement, articleNode.children[0]);
        do {
            console.log("Look at pixel " + posY);

            posY += this._breakPagesToPos(existingBreaks, posY) * pageSize;
            element = domUtils.findClosestChild(articleNode, articleNode.offsetTop, 
                    posY, (el) => { return this.isBreakableElement(el)});
            if (element != null && element.tagName.toLowerCase() != "article") {
                let toBreak = this.findBreakableTagNames(element);
                if (toBreak != null) {
                    this._breakAtElement(toBreak, posY - posToBreak);
                }
            }
            else {
                element = null;
                console.log("No element found");
                break;
            }
            
            // go to next page.
            posY += pageSize;
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
        let newBreak = document.createElement("div");
        element.parentElement.insertBefore(newBreak, element);
        let newBreak2 = document.createElement("div");
        element.parentElement.insertBefore(newBreak2, element);

        let pageSize = domUtils.cmToPixel(domUtils.a4Height);
        let headerSize = domUtils.cmToPixel(3);
        let posEndOfPage = offset + pageSize; 
        console.log("Position to break; " + domUtils.getPositionAbsolute(newBreak));
        let leftSize = posEndOfPage - domUtils.getPositionAbsolute(newBreak);
        newBreak.setAttribute("style", "height: " + leftSize + "px");
        newBreak2.setAttribute("style", "height: " + headerSize + "px");
    }
}

export default PageSplitter;