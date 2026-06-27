build:
	cd frontend && npm install && npm run build

start:
	node ./node_modules/@hexlet/chat-server/bin/index.js -s ./frontend/dist

lint:
	cd frontend && npm run lint
