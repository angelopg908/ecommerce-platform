const router = require('express').Router();
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { getAllOrders, updateOrderStatus } = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
const requireAdmin = require('../middleware/requireAdmin');

router.use(authenticate, requireAdmin);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Admin product CRUD also available under /api/admin/products
router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
