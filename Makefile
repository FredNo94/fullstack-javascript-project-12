build:
	cd frontend && npm install && npm run build

start:
	cd frontend && npx serve -s dist

lint:
	cd frontend && npm run lint