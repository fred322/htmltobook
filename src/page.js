import HtmlToBook from "./api/HtmlToBook.js"

let alreadyRun = false;
document.onreadystatechange = function() {
    if (alreadyRun) return;

    alreadyRun = true;
    new HtmlToBook().run();
}