SHELL := /bin/bash
.PHONY: install test build publish

install:
	yarn

test:
	yarn run test

build: test
	yarn run build

publish: build
	npx standard-version
	npm publish

