const TelegramBot = require('node-telegram-bot-api');
const { Pool } = require('pg');

// Переменные окружения
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error('TELEGRAM_BOT_TOKEN not set');
    process.exit(1);
}

console.log('data => ', process.env.DB_PASSWORD);

// Настройки подключения к PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Создание таблицы при запуске (если не существует)
const initDb = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS notes (
            id SERIAL PRIMARY KEY,
            user_id BIGINT NOT NULL,
            note TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(createTableQuery);
        console.log('Database table "notes" is ready');
    } catch (err) {
        console.error('Error creating table', err);
        process.exit(1);
    }
};

initDb();

// Создаём бота
const bot = new TelegramBot(token, { polling: true });

// Команда /start
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Привет! Используй /add <текст> чтобы добавить заметку, и /list чтобы посмотреть свои заметки.');
});

// Команда /add
bot.onText(/\/add (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const note = match[1];

    try {
        const res = await pool.query(
            'INSERT INTO notes (user_id, note) VALUES ($1, $2) RETURNING id',
            [userId, note]
        );
        const id = res.rows[0].id;
        bot.sendMessage(chatId, `Заметка добавлена с ID ${id}`);
    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, 'Ошибка при сохранении заметки.');
    }
});

// Команда /list
bot.onText(/\/list/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    try {
        const res = await pool.query(
            'SELECT id, note, created_at FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        const rows = res.rows;
        if (rows.length === 0) {
            bot.sendMessage(chatId, 'У вас пока нет заметок.');
        } else {
            let response = 'Ваши заметки:\n';
            rows.forEach(row => {
                response += `${row.id}: ${row.note} (${row.created_at})\n`;
            });
            bot.sendMessage(chatId, response);
        }
    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, 'Ошибка при получении заметок.');
    }
});

bot.on('polling_error', (error) => console.error(error));
console.log('Bot started');