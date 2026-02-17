/**
 * Copyright 2026 fred322
 * https://github.com/fred322
 * 
 */
import domUtils from "./DomUtils.js";
import Summary from "./Summary.js";

class Bookmarks {
    /**
     * 
     * @param {Summary} summary 
     */
    constructor(summary) {
        this.summary = summary;
    }

    generateContent() {
        return "%!\n" + this._generateContent(this.summary.sections, 1);
    }

    _generateContent(sections, level) {
        let numberingSections = this.summary.isNumberedSections();
        let content = "";
        for (let section of sections) {
            let countSubSignets = section.children.length;
            content += "[ /Title (" + (numberingSections == false ? "" : section.number + "-") + section.title + ")\n";
            content += "  /Page " + (section.pageNumber - 1) + "\n";
            content += "  /View [/XYZ 0 -" + domUtils.pixelToPdfPt(section.positionInPage) + " 0]\n";
            if (countSubSignets > 0) {
                content += "  /Count " + countSubSignets + "\n";
            }
            content += "  /OUT pdfmark\n\n";

            content += this._generateContent(section.children, level + 1);
        }
        return content;
    }
}

export default Bookmarks;