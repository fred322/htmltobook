class Summary {
    constructor() {
        this.sections = [];
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
            let title = section.element.children[0].innerText;
            let newElement = document.createElement("div");
            let newNumber = (number.length != 0 ? number + "." : "") + count;
            newElement.innerText = newNumber + " - " + title;
            let pageSpan = document.createElement("span");
            pageSpan.innerText = section.offsetTop;
            newElement.appendChild(pageSpan);
            summary.appendChild(newElement);

            this.printSummaryEntry(summary, section.children, newNumber);
            count++;
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