/**
 * Copyright 2026 fred322
 * https://github.com/fred322
 * 
 */
import domUtils from "./DomUtils.js"
import DomRunner from "./DomRunner.js"

class PageSplitter {
    constructor() {
        this.breakableTagNames = [ "div", "section", "p", "table", "tbody", "tr", "ul", "li" ];
        this.unbreakableTagNames = [ "a", "tr", "td", "th",
            "h1", "h2", "h3", "h4", "h5", "h6", "li", "p", "pre"
        ];
        this.currentPage = 0;
        this.currentPageProperties = null;

        this.articleNode = document.getElementsByTagName("article")[0];
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
    /**
     * Indicates if the element should not contains break page.
     * @param {Element} element 
     * @returns 
     */
    isUnbreakableElement(element) {
        if (element.classList.contains("unbreakable")) {
            return true;
        }
        let elTagName = element.tagName.toLowerCase();
        for (let tagName of this.unbreakableTagNames) {
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
        let existingBreaks = document.getElementsByTagName("break_page");
        let domRunner = new DomRunner(this.articleNode);
        let element = this.articleNode.children[0];
        let lastElementBroken = null;
        this._initiateNextPage(element);
        let loopCount = 0;
        do {
            let posY = this.currentPageProperties.footerY;
            console.log("Look at pixel " + posY);

            if (this._breakPagesToPos(existingBreaks, posY) == 0) {
                element = domRunner.findNext(posY, 
                    (el) => { return !this.isUnbreakableElement(el)}, {
                        getUpper: true
                    });
                if (element != null && element != this.articleNode && 
                    element.tagName.toLowerCase() != "article") {
                    if (lastElementBroken != null && lastElementBroken == element) {
                        console.error("The element " + element.tagName + " cannot be broken. It should be too height");
                        break;
                    }
                    else if (element != null) {
                        console.log("Break at element");
                        this._breakAtElement(element);
                        lastElementBroken = element;
                    }
                }
                else {
                    element = null;
                    console.log("No element found");
                    break;
                }
            }
            if (domUtils.isDebug() && loopCount > 200) {
                console.error("Too many loops in debug mode");
                break;
            }
            loopCount++;
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
                if (domUtils.getAbsolutePosition(element) < toPosY) {
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

    /**
     * 
     * @param {Element} element 
     */
    _breakAtElement(element) {
        let newBreak = document.createElement("div");
        newBreak.classList.add("break_page");
        element.parentElement.insertBefore(newBreak, element);
        // take position of newBreak because element is not necessary in DOM
        let leftSize = this.currentPageProperties.endOfPageY - domUtils.getAbsolutePosition(newBreak);
        leftSize = Math.min(domUtils.getPageHeight(), leftSize);
        newBreak.setAttribute("style", "height: " + leftSize + "px" );

        this._initiateNextPage(element);
    }

    _initiateNextPage(firstElement) {
        console.log("Creation new page");
        this._createNextPage();

        if (this.currentPageProperties.headerHeight > 0) {
            let newElement = domUtils.createElement("div", { height: this.currentPageProperties.headerHeight });
            newElement.classList.add("header_space");
            firstElement.parentElement.insertBefore(newElement, firstElement)
        }
    }
    _createNextPage() {
        this.currentPage = this.currentPage + 1;

        let headerDefault = document.getElementsByTagName("header")[0];
        let footerDefault = document.getElementsByTagName("footer")[0];

        let pagesWrapper = document.getElementById("pagesWrapper");
        if (pagesWrapper == null) {
            pagesWrapper = document.createElement("div");
            pagesWrapper.id = "pagesWrapper";
            document.body.insertBefore(pagesWrapper, this.articleNode);
        }
        let newPage = document.createElement("div");
        newPage.classList.add("page");
        newPage.classList.add("page_" + (this.currentPage));
        newPage.classList.add((this.currentPage % 2) == 0 ? "even" : "odd");
        pagesWrapper.appendChild(newPage);

        let expectedPosition = Math.round((this.currentPage - 1)* domUtils.cmToPixel(domUtils.a4Height));
        let realPosition = domUtils.getAbsolutePosition(newPage);
        console.debug("Expected: " + expectedPosition + "; Got " + realPosition);
        //if (expectedPosition - realPosition > 1 && this.previousPage != null) {
            // compense precision issue with pixels/cm.
            //newPage.setAttribute("style", "margin-top: " + (expectedPosition - realPosition) + "px");
        //    this.previousPage.setAttribute("style", "height: calc(29.7cm + " + (expectedPosition - realPosition) + "px)");
        //}

        let header = null;
        if (headerDefault != null) {
            header = document.createElement("div");
            header.classList.add("header");
            header.innerHTML = headerDefault.innerHTML;
            newPage.appendChild(header);
        }
        let footer = null;
        if (footerDefault != null) {
            footer = document.createElement("div");
            footer.classList.add("footer");
            footer.innerHTML = footerDefault.innerHTML;
            newPage.appendChild(footer);

            // fix the height of footer, otherwise seems to have render issues in PDF.
            footer.setAttribute("style", "height: " + footer.offsetHeight + "px");
        }

        this.previousPage = newPage;

        let endOfPageY = domUtils.getAbsolutePosition(newPage) + newPage.offsetHeight;
        this.currentPageProperties = {
            /* Footer can be not shown => use newPage */
            footerY : endOfPageY - (footer != null ? footer.offsetHeight : 0),
            headerHeight: header != null ? header.offsetHeight : 0,
            footerHeight: footer != null ? footer.offsetHeight : 0,
            endOfPageY: endOfPageY
        }
    }
}

export default PageSplitter;