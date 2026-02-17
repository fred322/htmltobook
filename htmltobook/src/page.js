/**
 * Copyright 2026 fred322
 * https://github.com/fred322
 * 
 */
import HtmlToBook from "./api/HtmlToBook.js"

let alreadyRun = false;
window.addEventListener("DOMContentLoaded", function() {
    if (alreadyRun) return;

    alreadyRun = true;
    new HtmlToBook().run();
});