const pool = require('./db');

async function migrate() {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS records (
        id SERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL,
        username VARCHAR(255),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Таблица records готова');
    } catch (error) {
        console.error('❌ Ошибка миграции:', error.message);
    }
}

module.exports = migrate;