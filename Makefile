WEBPACK_BIN = node_modules/.bin/webpack
TESTEM_BIN = node_modules/.bin/testem

default: install server

clean:
	@rm -f public/bundle/*
	@rm -rf node_modules
	@rm -rf bower_components

install:
	@npm install

server: $(WEBPACK_BIN)
	@NODE_ENV=development node server.js

# test: $(TESTEM_BIN)
# 	@NODE_ENV=test make build
# 	@$(TESTEM_BIN) ci --parallel 2 -R xunit

build: $(WEBPACK_BIN)
	@$(WEBPACK_BIN)

deploy: build
	@node lib/deploy.js

#######
# BINS
#######

$(WEBPACK_BIN):
	@npm install

$(TESTEM_BIN):
	@npm install

.PHONY: default clean server build test deploy

