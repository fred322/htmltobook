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

        this.applyHeaderNFooters();
        summary.updatePageNumbers();
    }

    applyHeaderNFooters() {
        let headerDefault = document.getElementsByTagName("header")[0];
        let footerDefault = document.getElementsByTagName("footer")[0];

        let article = document.getElementsByTagName("article")[0];
        let totalSize = domUtils.getPositionAbsolute(article) + article.offsetHeight;
        let pageSize = domUtils.cmToPixel(domUtils.a4Height);
        let pagesCount = Math.ceil(totalSize / pageSize);
        let pageBorders = document.getElementById("pagesWrapper");
        for (let idx = 0; idx < pagesCount; idx++) {
            let newPage = document.createElement("div");
            newPage.classList.add("page");
            newPage.classList.add((idx % 2) == 1 ? "even" : "odd");
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
        }

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