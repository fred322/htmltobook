# INCTESTS empty to deactivate cppunit tests
INCTESTS:=


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

test_abs: $(HTML_TO_BOOK_MERGED) all-impl
	@mkdir -p $(TTARGETDIR)
	@cp -r test/test_abs $(TTARGETDIR)/
	@cp $< $(TTARGETDIR)/test_abs/
	@cp $(TRDIR)/*.css $(TTARGETDIR)/test_abs/
	@cd $(TTARGETDIR)/test_abs && npm install playwright-core
	@cd $(TTARGETDIR)/test_abs && tar -xf highlight.js.tar.gz
	@cd $(TTARGETDIR)/test_abs && $(MODROOT)/src/print.sh ABS_manual_170983b.pdf.html

test_simple: all-impl
	@mkdir -p $(TTARGETDIR)
	@cp -r test/test_simple $(TTARGETDIR)/
	@cp -r $(TRDIR)/*.js $(TRDIR)/*.css $(TRDIR)/api $(TTARGETDIR)/test_simple/
	@cd $(TTARGETDIR)/test_simple && $(MODROOT)/src/print.sh test.html
	@cd $(TTARGETDIR)/test_simple && npx http-server -p 8080

test::
	@$(ABS_PRINT_info) "Execution of test"