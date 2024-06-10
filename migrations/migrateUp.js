require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: 5432,
});

const runMigrations = async () => {
  await client.connect();

  const upMigration = fs.readFileSync(
    path.join(__dirname, '1667385788-boostrap-migration-up.sql'),
    'utf-8'
  );

  try {
    await client.query('BEGIN');
    await client.query(upMigration);
    await client.query('COMMIT');
    console.log('Migration ran successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
};

runMigrations();
