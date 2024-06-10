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

const revertMigrations = async () => {
  await client.connect();

  const downMigration = fs.readFileSync(
    path.join(__dirname, '1667395788-boostrap-migration-down.sql'),
    'utf-8'
  );

  try {
    await client.query('BEGIN');
    await client.query(downMigration);
    await client.query('COMMIT');
    console.log('Reversion ran successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Reversion failed:', err);
  } finally {
    await client.end();
  }
};

revertMigrations();
