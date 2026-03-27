const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host:  'postgres',
    port: process.env.DB_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
});

module.exports = pool;