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

    }
}

export default HtmlToBook;