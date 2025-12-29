#!/bin/bash

#chromium --headless --disable-gpu --print-to-pdf="sortie.pdf" "test.html"

nodejs print.js
sed -n '/<bookmarks.*>/,/<\/bookmarks>/p' export.xml | sed -z 's/<[^>]*>//g; s/^[[:space:]]*//; s/[[:space:]]*$//' > bookmarks.ps
gs -dBATCH -dNOPAUSE -dQUIET \
   -sDEVICE=pdfwrite \
   -sOutputFile=sortie2.pdf \
   sortie.pdf bookmarks.ps