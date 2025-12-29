import domUtils from "./DomUtils.js";

class Bookmarks {
    constructor() {
    }

    generateContent(sections) {
        return "%!\n" + this._generateContent(sections, 1);
    }

    _generateContent(sections, level) {
        let content = "";
        for (let section of sections) {
            let countSubSignets = section.children.length;
            content += "[ /Title (" + section.title + ")\n";
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