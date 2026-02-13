HTML_TO_BOOK_MERGED=$(TRDIR)/htmlToBook_all.js

# The order is important
HTML_TO_BOOK_TO_MERGE:=$(patsubst %,src/%,api/DomUtils.js \
    api/DomRunner.js \
    api/Summary.js \
    api/Bookmarks.js \
    api/PageSplitter.js \
    api/HtmlToBook.js \
    page.js)

TARGETFILES+=$(HTML_TO_BOOK_MERGED)

$(HTML_TO_BOOK_MERGED): $(SRCFILES)
	@cat $(HTML_TO_BOOK_TO_MERGE) | grep -E -v "export|import" > $@

# launch the server to be able to test
.PHONY: launch
launch: $(TARGETFILES)
	@cd $(TRDIR) && npx http-server -p 8080

test::
	@$(ABS_PRINT_info) "Execution of test"