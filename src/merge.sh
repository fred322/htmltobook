#!/bin/bash
# this script will create one js file containing all the code.
# The generated js file can be included without server need.

final_file=htmlToBook_all.js
cat api/DomUtils.js \
    api/DomRunner.js \
    api/Summary.js \
    api/Bookmarks.js \
    api/PageSplitter.js \
    api/HtmlToBook.js \
    page.js | grep -E -v "export|import" > $final_file

tar -czf $final_file.tar.gz $final_file htmlToBook.css