/**
 * Copyright 2026 fred322
 * https://github.com/fred322
 * 
 */

import Summary from "./Summary.js";
import PageSplitter from "./PageSplitter.js";
import Bookmarks from "./Bookmarks.js";

import domUtils from "./DomUtils.js"

class HtmlToBook {
    constructor() {
        domUtils.init();
    }

    run() {
        if (domUtils.isDebug()) {
            document.body.classList.add("debug");
        }
        let pageSplitter = new PageSplitter();
        let summary = new Summary();
        summary.createSummary();
        pageSplitter.breakPages();

        this.updatePageNumbers();
        summary.updatePageNumbers();

        let contentGs = new Bookmarks(summary).generateContent();
        let docElementGs = document.createElement("bookmarks");
        docElementGs.innerHTML = contentGs;
        docElementGs.style = "display: none";
        document.body.appendChild(docElementGs);
    }

    updatePageNumbers() {
        let article = document.getElementsByTagName("article")[0];
        let totalSize = domUtils.getAbsolutePosition(article) + article.offsetHeight;
        let pageSize = domUtils.cmToPixel(domUtils.a4Height);
        let pagesCount = Math.ceil(totalSize / pageSize);
        
        let pageNumberSpan = document.getElementsByClassName("pageNumber");
        for (let element of pageNumberSpan) {
            let pageNumber = Math.ceil(domUtils.getAbsolutePosition(element) / pageSize);
            element.innerText = pageNumber;
        }
        let pagesCountSpan = document.getElementsByClassName("pagesCount");
        for (let element of pagesCountSpan) {
            element.innerText = pagesCount;
        }
    }
}

export default HtmlToBook;