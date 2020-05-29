SHELL := /bin/bash
.PHONY: install test build publish

install:
	yarn

test:
	./node_modules/.bin/jest

build: test
	./node_modules/.bin/rollup -c

publish: build
	npx standard-version
	npm publish

