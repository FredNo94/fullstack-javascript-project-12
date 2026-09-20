### Hexlet tests and linter status:
[![Actions Status](https://github.com/FredNo94/fullstack-javascript-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/FredNo94/fullstack-javascript-project-12/actions)

### Example App
https://fullstack-javascript-project-12-3h0q.onrender.com

### Запуск

```sh
npm ci
```

Для разработки сервер и Vite в двух терминалах:

```sh
npm run server
```

```sh
npm run dev
```

```sh
make build
make start
```

`make build` устанавливает зависимости из lock-файла и вызывает `npm run build`.
Команда `npm run build` отдельно собирает приложение в `dist`.
`make start` запускает сервер, который отдаёт API и статику из `dist`.

