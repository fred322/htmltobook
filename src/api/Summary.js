import domUtils from "./DomUtils.js";

class Summary {
    constructor() {
        this.sections = [];
        this._lastAnchorId = 0;
    }
    createSummary() {
        // run across section to find all titles and add numbers
        let article = document.getElementsByTagName("article")[0];
        let summary = document.getElementsByTagName("summary")[0];
        this.analyseSections(article);
        this.printSummaryEntry(summary, this.sections, "");
    }
    analyseSections(rootNode) {
        this._findSections(rootNode, this.sections)
    }
    /**
     * 
     * @param {Element} summary 
     * @param {Array} sections
     * @param {String} number 
     */
    printSummaryEntry(summary, sections, number) {
        let count = 1;
        if (sections == null) return;
        for (let section of sections) {
            section.title = section.element.children[0].innerText;
            let linkElement = document.createElement("a");
            let anchor = section.element.getAttribute("id");
            if (anchor == null) {
                anchor = "__anchor_" + this._lastAnchorId;
                this._lastAnchorId = this._lastAnchorId + 1;
                section.element.setAttribute("id", anchor);
            }
            linkElement.setAttribute("href", "#" + anchor);

            let newElement = document.createElement("div");
            newElement.classList.add("toc_item");
            let newNumber = (number.length != 0 ? number + "." : "") + count;
            newElement.innerText = newNumber + " - " + section.title;
            let pageSpan = document.createElement("span");
            pageSpan.innerText = domUtils.getPageNumber(section.element);
            pageSpan.classList.add("toc_item_page_number");
            section.pageNumberElement = pageSpan;
            newElement.appendChild(domUtils.createElement("span", { classes: ["toc_item_points" ]}));
            newElement.appendChild(pageSpan);
            linkElement.appendChild(newElement);
            summary.appendChild(linkElement);

            this.printSummaryEntry(summary, section.children, newNumber);
            count++;
        }
    }

    updatePageNumbers() {
        this._updatePageNumbers(this.sections);
    }

    _updatePageNumbers(sections) {
        for (let section of sections) {
            section.pageNumber = domUtils.getPageNumber(section.element);
            section.pageNumberElement.innerText = section.pageNumber;
            section.positionInPage = domUtils.getPositionInPage(section.element);
            this._updatePageNumbers(section.children);
        }
    }

    _findSections(parentNode, summary) {
        for (let child of parentNode.children) {
            if (child.tagName.toLowerCase() == "section") {
                let newElement = { element: child, children: [] };
                this._findSections(child, newElement.children);
                summary.push(newElement);
            }
        }
    }
}

export default Summary;