import domUtils from "./DomUtils.js"

class PageSplitter {
    constructor() {
        this.breakableTagNames = [ "div", "p", "table", "section" ];
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
        let pagesCount = 1;

        let element = null;
        let posY = posToBreak;
        let articleNode = document.getElementsByTagName("article")[0];
        let firstElement = document.createElement("div");
        firstElement.setAttribute("style", "height: " + headerSize + "px");
        articleNode.insertBefore(firstElement, articleNode.children[0]);
        do {
            console.log("Look at pixel " + posY);
            element = domUtils.findClosestChild(articleNode, articleNode.offsetTop, 
                    posY, (el) => { return this.isBreakableElement(el)});
            if (element != null && element.tagName.toLowerCase() != "article") {
                let newBreak = document.createElement("div");
                //newBreak.classList.add("break_page");
                let toBreak = this.findBreakableTagNames(element);
                if (toBreak != null) {
                    let posEndOfPage = posY - posToBreak + pageSize;
                    console.log("Position to break; " + domUtils.getPositionAbsolute(toBreak));
                    let leftSize = posEndOfPage - domUtils.getPositionAbsolute(toBreak) + headerSize;
                    //toBreak.setAttribute("style", "margin-top: " + leftSize + "px");
                    newBreak.setAttribute("style", "height: " + leftSize + "px");
                    toBreak.parentElement.insertBefore(newBreak, toBreak);
                }
            }
            else {
                element = null;
                console.log("No element found");
                break;
            }
            
            // go to next page.
            posY += pageSize;
            pagesCount += 1;
        } while (element != null);

        let pageBorders = document.getElementById("pagesWrapper");
        for (let idx = 0; idx < pagesCount; idx++) {
            let newPage = document.createElement("div");
            newPage.classList.add("page");
            let contentPage = document.createElement("div");
            newPage.appendChild(contentPage);
            let header = document.createElement("div");
            header.classList.add("header");
            header.setAttribute("style", "position: absolute");
            let footer = document.createElement("div");
            footer.classList.add("footer");
            footer.setAttribute("style", "position: absolute");
            newPage.appendChild(header);
            newPage.appendChild(footer);
            pageBorders.appendChild(newPage);
        }
    }
}

export default PageSplitter;