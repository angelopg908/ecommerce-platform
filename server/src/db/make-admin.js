require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node src/db/make-admin.js <email>');
    process.exit(1);
  }

  const { rowCount } = await pool.query(
    "UPDATE users SET role = 'admin' WHERE email = $1",
    [email]
  );

  if (rowCount === 0) {
    console.log(`No user found with email: ${email}`);
  } else {
    console.log(`${email} is now an admin.`);
  }

  await pool.end();
}

run();
