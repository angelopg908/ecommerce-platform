const pool = require('../db/pool');

const CART_SELECT = `
  SELECT ci.product_id, ci.quantity,
         p.name, p.price, p.image_url, p.stock
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  WHERE ci.user_id = $1
  ORDER BY ci.created_at ASC
`;

const getCart = async (userId) => {
  const { rows } = await pool.query(CART_SELECT, [userId]);
  return rows;
};

const upsertItem = async (userId, productId, quantity) => {
  await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity`,
    [userId, productId, quantity]
  );
  return getCart(userId);
};

const updateQuantity = async (userId, productId, quantity) => {
  await pool.query(
    'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3',
    [quantity, userId, productId]
  );
  return getCart(userId);
};

const removeItem = async (userId, productId) => {
  await pool.query(
    'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );
  return getCart(userId);
};

const clearCart = async (userId) => {
  await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
};

module.exports = { getCart, upsertItem, updateQuantity, removeItem, clearCart };
