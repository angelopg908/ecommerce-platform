const pool = require('../db/pool');
const bcrypt = require('bcryptjs');

const findByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] ?? null;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, email, role, created_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0] ?? null;
};

const createUser = async (email, password) => {
  const hashed = await bcrypt.hash(password, 12);
  const { rows } = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, role, created_at',
    [email, hashed]
  );
  return rows[0];
};

const verifyPassword = (plain, hashed) => bcrypt.compare(plain, hashed);

module.exports = { findByEmail, findById, createUser, verifyPassword };
