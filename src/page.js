

let configuration = {
    breakableTagNames: [ "div", "p", "table", "section" ],
    height: 29.7
}

function getPositionAbsolute(element) {
    return element.offsetTop + (element.parentElement != null ? getPositionAbsolute(element.parentElement) : 0);
}

function isBreakableElement(element) {
    let elTagName = element.tagName.toLowerCase();
    for (let tagName of configuration.breakableTagNames) {
        if (elTagName == tagName) {
            return true;
        }
    }
    return false;
}
function findBreakableTagNames(child) {
    if (child == null || child.tagName.toLowerCase() == "body") return null;
    if (isBreakableElement(child)) return child;
    return findBreakableTagNames(child.parentElement);
}

function findClosestChild(parentElement, positionParent, posY) {
    if (parentElement.children.length != 0) {
        for (let child of parentElement.children) {
            if (positionParent + child.offsetTop + child.offsetHeight >= posY) {
                if (child.tagName.toLowerCase() == "div") {
                    return findClosestChild(child, positionParent + child.offsetTop, posY);
                }
                if (isBreakableElement(child)) {
                    return child;
                }
                break;
            }
        }
    }
    return parentElement;
}

function findSections(parentNode, summary) {
    let sections = parentNode.getElementsByTagName("section");
    parentNode.sibl
}
function createSummary(depth) {
    // run across section to find all titles and add numbers

}

let alreadyRun = false;
document.onreadystatechange = function() {
    if (alreadyRun) return;

    alreadyRun = true;
    let cmToPixel = document.getElementsByTagName("body")[0].offsetWidth / 21.0;
    function toPixel(cm) {
        return Math.floor(cm * cmToPixel);
    }
    console.log("Dpi : " + cmToPixel);

    // header & footer are 2cm + 0.5cm padding
    let pageSize = toPixel(configuration.height);
    let headerSize = toPixel(3);
    let contentSize = pageSize - 2 * headerSize;
    let posToBreak = headerSize + contentSize;
    let pagesCount = 1;
    if (true || window.matchMedia("print").matches) {
        let element = null;
        let posY = posToBreak;
        let articleNode = document.getElementsByTagName("article")[0];
        let firstElement = document.createElement("div");
        firstElement.setAttribute("style", "height: " + headerSize + "px");
        articleNode.insertBefore(firstElement, articleNode.children[0]);
        do {
            console.log("Look at pixel " + posY);
            element = findClosestChild(articleNode, articleNode.offsetTop, posY);
            if (element != null && element.tagName.toLowerCase() != "article") {
                let newBreak = document.createElement("div");
                //newBreak.classList.add("break_page");
                let toBreak = findBreakableTagNames(element);
                if (toBreak != null) {
                    let posEndOfPage = posY - posToBreak + pageSize;
                    console.log("Position to break; " + getPositionAbsolute(toBreak));
                    let leftSize = posEndOfPage - getPositionAbsolute(toBreak) + headerSize;
                    //toBreak.setAttribute("style", "margin-top: " + leftSize + "px");
                    newBreak.setAttribute("style", "height: " + leftSize + "px");
                    toBreak.parentElement.insertBefore(newBreak, toBreak);
                }
            }
            else {
                element = null;
                console.log("No element found");
                break;
            }
            
            // go to next page.
            posY += pageSize;
            pagesCount += 1;
        } while (element != null);

        for (let para of document.getElementsByTagName("p")) {
            para.innerText += para.offsetTop + " / " + (para.offsetTop + para.offsetHeight);
        }

        let pageBorders = document.getElementById("pagesWrapper");
        for (let idx = 0; idx < pagesCount; idx++) {
            let newPage = document.createElement("div");
            newPage.classList.add("page");
            let contentPage = document.createElement("div");
            newPage.appendChild(contentPage);
            let header = document.createElement("div");
            header.classList.add("header");
            header.setAttribute("style", "position: absolute");
            let footer = document.createElement("div");
            footer.classList.add("footer");
            footer.setAttribute("style", "position: absolute");
            newPage.appendChild(header);
            newPage.appendChild(footer);
            pageBorders.appendChild(newPage);
        }
    }
}