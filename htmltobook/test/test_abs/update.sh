#!/bin/bash

cd $(dirname $0)
../../src/merge.sh
cp ../../src/htmlToBook_all.js ../../src/htmlToBook.css .
tar -xf ../highlight.js.tar.gz