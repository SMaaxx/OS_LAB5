const pool = require('../db/db');

class Record {
    static async create({ userId, username, message }) {
        const query = `
      INSERT INTO records (user_id, username, message)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
        const result = await pool.query(query, [userId, username, message]);
        return result.rows[0];
    }

    static async findAll(limit = 10) {
        const query = `
      SELECT * FROM records 
      ORDER BY created_at DESC 
      LIMIT $1
    `;
        const result = await pool.query(query, [limit]);
        return result.rows;
    }

    static async findByUser(userId, limit = 5) {
        const query = `
      SELECT * FROM records 
      WHERE user_id = $1
      ORDER BY created_at DESC 
      LIMIT $2
    `;
        const result = await pool.query(query, [userId, limit]);
        return result.rows;
    }
}

module.exports = Record;