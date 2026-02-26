/**
 * Copyright 2026 fred322
 * https://github.com/fred322
 * 
 */
import domUtils from "./DomUtils.js";

class Summary {
    constructor() {
        this.sections = [];
        this._lastAnchorId = 0;
        this._isNumberedSections = domUtils.getMetaValue("numberedSections") != "false";
    }

    /**
     * Indicates if section must be numbered.
     * @returns true if sections must be counted
     */
    isNumberedSections() {
        return this._isNumberedSections;
    }

    createSummary() {
        // run across section to find all titles and add numbers
        let article = document.getElementsByTagName("article")[0];
        let summary = document.getElementById("toc");
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
            let titleElement = this._findTitleElement(section.element);
            section.title = titleElement.innerText;
            let linkElement = document.createElement("a");
            let anchor = section.element.getAttribute("id");
            if (anchor == null) {
                anchor = "__anchor_" + this._lastAnchorId;
                this._lastAnchorId = this._lastAnchorId + 1;
                section.element.setAttribute("id", anchor);
            }
            linkElement.setAttribute("href", "#" + anchor);
            linkElement.classList.add("toc_item");

            let newNumber = (number.length != 0 ? number + "." : "") + count;
            section.number = newNumber;
            if (this.isNumberedSections()) {
                linkElement.innerText = newNumber + " - " + section.title;
                titleElement.innerText = newNumber + " " + titleElement.innerText;
            }
            else {
                linkElement.innerText = section.title;
            }
            let pageSpan = document.createElement("span");
            pageSpan.innerText = domUtils.getPageNumber(section.element);
            pageSpan.classList.add("toc_item_page_number");
            section.pageNumberElement = pageSpan;
            linkElement.appendChild(domUtils.createElement("span", { classes: ["toc_item_points" ]}));
            linkElement.appendChild(pageSpan);
            summary.appendChild(linkElement);

            this.printSummaryEntry(summary, section.children, newNumber);
            count++;
        }
    }

    updatePageNumbers() {
        this._updatePageNumbers(this.sections);
    }

    _findTitleElement(section) {
        for (let child of section.children) {
            if (child.innerText.length != 0) {
                return child;
            }
        }
        return "No title";
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