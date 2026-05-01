const pool = require('../db/pool');

const getUserOrders = async (userId) => {
  const { rows } = await pool.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

const getOrderById = async (id, userId) => {
  const { rows: [order] } = await pool.query(
    'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  if (!order) return null;

  const { rows: items } = await pool.query(
    `SELECT oi.*, p.name, p.image_url
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [id]
  );
  return { ...order, items };
};

// Called after successful Stripe payment
const createOrder = async (userId, total, items) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: [order] } = await client.query(
      "INSERT INTO orders (user_id, total, status) VALUES ($1, $2, 'paid') RETURNING *",
      [userId, total]
    );

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, item.price]
      );
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    await client.query('COMMIT');
    return order;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getAllOrders = async () => {
  const { rows } = await pool.query(
    `SELECT o.*, u.email
     FROM orders o
     JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC`
  );
  return rows;
};

const updateStatus = async (id, status) => {
  const { rows } = await pool.query(
    'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return rows[0] ?? null;
};

module.exports = { getUserOrders, getOrderById, createOrder, getAllOrders, updateStatus };
