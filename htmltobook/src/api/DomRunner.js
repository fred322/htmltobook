/**
 * Copyright 2026 fred322
 * https://github.com/fred322
 * 
 */
import domUtils from "./DomUtils.js";

class DomRunner {
    constructor(element) {
        this.element = element;
        this.current = null;
        this.currentIndex = 0;
    }

    findNext(posY, filter, options) {
        if (this.current != null && this.current.element != null) {
            if (domUtils.getBottomAbsolutePosition(this.current.element) >= posY) {
                let found = this.current.findNext(posY, filter, options);
                if (found != null) {
                    return options.getUpper == true && found == this.current.element.children[0] ?
                        this.current.element : found;
                }
            }
            this.current.element = null;
            this.currentIndex++;
        }
        for (; this.currentIndex < this.element.children.length; this.currentIndex++) {
            let element = this.element.children[this.currentIndex];
            if (domUtils.getBottomAbsolutePosition(element) >= posY) {
                if (filter(element)) {
                    if (this.current == null) {
                        this.current = new DomRunner();
                    }
                    this.current._setElement(element);
                    let found = this.current.findNext(posY, filter, options);
                    if (found != null) {
                        return options.getUpper == true && found == this.current.element.children[0] ?
                            this.current.element : found;
                    }
                }
                return element;
            }
        }
        return this.element;
    }
    _setElement(element) {
        this.element = element;
        this.currentIndex = 0;
        if (this.current != null) {
            this.current.element = null;
        }
    }
};

export default DomRunner;