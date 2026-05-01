const cartService = require('../services/cartService');
const productService = require('../services/productService');

const getCart = async (req, res, next) => {
  try {
    const items = await cartService.getCart(req.user.id);
    res.json(items);
  } catch (err) {
    next(err);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await productService.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });

    const items = await cartService.upsertItem(req.user.id, productId, quantity);
    res.json(items);
  } catch (err) {
    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }
    const items = await cartService.updateQuantity(req.user.id, req.params.productId, quantity);
    res.json(items);
  } catch (err) {
    next(err);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const items = await cartService.removeItem(req.user.id, req.params.productId);
    res.json(items);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addItem, updateItem, removeItem };
