.PHONY: install build start dev lint test

install:
	npm ci

build: install
	npm run build

start:
	npm start

dev:
	npm run dev

lint:
	npm run lint

test:
	npm test
