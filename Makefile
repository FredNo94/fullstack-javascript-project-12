.PHONY: install build start dev lint

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
