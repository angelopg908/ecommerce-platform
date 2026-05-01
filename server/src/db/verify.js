require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function verify() {
  const tables = ['users', 'products', 'cart_items', 'orders', 'order_items'];
  for (const t of tables) {
    const { rows } = await pool.query(`SELECT COUNT(*) FROM ${t}`);
    console.log(`${t}: ${rows[0].count} rows`);
  }
  await pool.end();
}

verify();
