import Summary from "./Summary.js";
import PageSplitter from "./PageSplitter.js";

import domUtils from "./DomUtils.js"

class HtmlToBook {
    constructor() {
        domUtils.init();
    }

    run() {
        let pageSplitter = new PageSplitter();
        let summary = new Summary();
        summary.createSummary();
        pageSplitter.breakPages();

        this.updatePageNumbers();
        summary.updatePageNumbers();
    }

    updatePageNumbers() {
        let article = document.getElementsByTagName("article")[0];
        let totalSize = domUtils.getPositionAbsolute(article) + article.offsetHeight;
        let pageSize = domUtils.cmToPixel(domUtils.a4Height);
        let pagesCount = Math.ceil(totalSize / pageSize);
        
        let pageNumberSpan = document.getElementsByClassName("pageNumber");
        for (let element of pageNumberSpan) {
            let pageNumber = Math.ceil(domUtils.getPositionAbsolute(element) / pageSize);
            element.innerText = pageNumber;
        }
        let pagesCountSpan = document.getElementsByClassName("pagesCount");
        for (let element of pagesCountSpan) {
            element.innerText = pagesCount;
        }
    }
}

export default HtmlToBook;