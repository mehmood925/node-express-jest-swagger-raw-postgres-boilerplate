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

const runSeeders = async () => {
  await client.connect();

  const seedFile = fs.readFileSync(
    path.join(__dirname, '1667585755-seed-companies.sql'),
    'utf-8'
  );

  try {
    await client.query('BEGIN');
    await client.query(seedFile);
    await client.query('COMMIT');
    console.log('Seeding ran successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', err);
  } finally {
    await client.end();
  }
};

// Run seeders
runSeeders();
