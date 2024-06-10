require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: 5432,
});

module.exports = pool;
