const pool = require('../db/pool');

const list = async ({ search, minPrice, maxPrice, page = 1, limit = 12 } = {}) => {
  const conditions = [];
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`(name ILIKE $${values.length} OR description ILIKE $${values.length})`);
  }
  if (minPrice !== undefined) {
    values.push(Number(minPrice));
    conditions.push(`price >= $${values.length}`);
  }
  if (maxPrice !== undefined) {
    values.push(Number(maxPrice));
    conditions.push(`price <= $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (Number(page) - 1) * Number(limit);

  const countValues = [...values];
  values.push(Number(limit), offset);

  const { rows } = await pool.query(
    `SELECT * FROM products ${where} ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );
  const { rows: [{ count }] } = await pool.query(
    `SELECT COUNT(*) FROM products ${where}`,
    countValues
  );

  return { products: rows, total: parseInt(count), page: Number(page), limit: Number(limit) };
};

const findById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return rows[0] ?? null;
};

const create = async ({ name, description, price, image_url, stock }) => {
  const { rows } = await pool.query(
    'INSERT INTO products (name, description, price, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, description, price, image_url, stock ?? 0]
  );
  return rows[0];
};

const update = async (id, fields) => {
  const allowed = ['name', 'description', 'price', 'image_url', 'stock'];
  const keys = Object.keys(fields).filter((k) => allowed.includes(k));
  if (!keys.length) return null;

  const values = keys.map((k) => fields[k]);
  const set = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');

  const { rows } = await pool.query(
    `UPDATE products SET ${set} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );
  return rows[0] ?? null;
};

const remove = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);
  return rowCount > 0;
};

module.exports = { list, findById, create, update, remove };
