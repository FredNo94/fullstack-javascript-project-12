build:
	cd frontend && npm install && npm run build

start:
	cd frontend && npx start-server -s ./frontend/dist

lint:
	cd frontend && npm run lint