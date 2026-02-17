#!/bin/bash

#chromium --headless --disable-gpu --print-to-pdf="sortie.pdf" "test.html"
#chromium --headless --disable-gpu --print-to-pdf-no-header --print-to-pdf="page.pdf" http://localhost:8080/test.html

file=$1
script="print.js"
if [ "$file" != "" ]; then
   file="file://$(pwd)/$file"
   sed "s~{PATH}~$file~g" $script > printTmp.js
   script="printTmp.js"
fi
nodejs $script
sed -n '/<bookmarks.*>/,/<\/bookmarks>/p' export.xml | \
   sed -z 's/<[^>]*>//g; s/^[[:space:]]*//; s/[[:space:]]*$//' | \
   sed 's/&nbsp;/ /g' > bookmarks.ps
gs -dBATCH -dNOPAUSE -dQUIET \
   -sDEVICE=pdfwrite \
   -sOutputFile=output.pdf \
   sortie.pdf bookmarks.ps

echo "File output.pdf created"