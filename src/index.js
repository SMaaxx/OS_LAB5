require('dotenv').config();
const { Telegraf } = require('telegraf');
const Record = require('./models/Record');
const migrate = require("./db/migrate");

const bot = new Telegraf(process.env.BOT_TOKEN);

// ← ВСЕ ОБРАБОТЧИКИ ДО bot.launch()

bot.start((ctx) => {
    ctx.reply('Привет! Отправь сообщение — сохраню в БД.\n/list — список\n/my — твои');
});

bot.command('list', async (ctx) => {
    try {
        const records = await Record.findAll();
        console.log('📊 Записей в БД:', records.length);  // ← ДИАГНОСТИКА!
        const message = records.length
            ? records.map(r => `${r.username}: ${r.message}`).join('\n')
            : 'Записей пока нет';
        ctx.reply(`Последние записи:\n${message}`);
    } catch (error) {
        console.error('❌ /list ошибка:', error.message);
        ctx.reply('Ошибка чтения БД');
    }
});

bot.command('my', async (ctx) => {
    try {
        const records = await Record.findByUser(ctx.from.id);
        console.log('👤 Мои записи:', records.length);  // ← ДИАГНОСТИКА!
        const message = records.length
            ? records.map(r => r.message).join('\n')
            : 'Ты ничего не записал';
        ctx.reply(`Твои записи:\n${message}`);
    } catch (error) {
        console.error('❌ /my ошибка:', error.message);
        ctx.reply('Ошибка чтения БД');
    }
});

bot.on('text', async (ctx) => {
    try {
        const record = await Record.create({
            userId: ctx.from.id,
            username: ctx.from.username || ctx.from.first_name,
            message: ctx.message.text
        });
        console.log('💾 Новая запись:', record);  // ← ДИАГНОСТИКА!
        ctx.reply('✅ Запись сохранена в БД!');
    } catch (error) {
        console.error('❌ Создание записи:', error.message);
        ctx.reply('❌ Ошибка сохранения');
    }
});

// ← ЗАПУСК ТОЛЬКО ПОСЛЕ Регистрации обработчиков!
migrate().then(() => {
    console.log('🚀 Запуск бота...');
    bot.launch().then(() => console.log('🤖 Бот запущен'));
}).catch((error) => {
    console.error('❌ Ошибка миграции:', error);
    process.exit(1);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));