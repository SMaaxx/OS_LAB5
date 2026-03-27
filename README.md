# Telegram Bot Lab

Простейший Telegram-бот с PostgreSQL в Docker.

## Команды бота

- `/start` — приветствие
- `/list` — последние записи
- `/my` — ваши записи
- Любой текст — сохранить в БД

## Запуск

```bash
# Клонировать репозиторий
git clone <repo>
cd telegram-bot-lab

# Запустить
BOT_TOKEN=your_token docker-compose up -d --build

# Проверить логи
docker-compose logs -f bot
```

## Проверка персистентности

```bash
# 1. Отправить сообщение боту (создать запись)
# 2. Остановить контейнеры
docker-compose down

# 3. Запустить заново
docker-compose up -d --build

# 4. Проверить: /list — запись должна сохраниться
```

## Структура

```
├── src/
│   ├── index.js       # Бот и команды
│   ├── db/
│   │   ├── db.js      # Подключение к PostgreSQL
│   │   └── migrate.js # Миграция таблицы
│   └── models/
│       └── Record.js  # Модель записи
├── docker-compose.yml
└── Dockerfile
```

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| BOT_TOKEN | Токен Telegram бота |
| POSTGRES_DB | Имя базы данных |
| POSTGRES_USER | Пользователь БД |
| POSTGRES_PASSWORD | Пароль БД |
| DB_PORT | Порт PostgreSQL |
