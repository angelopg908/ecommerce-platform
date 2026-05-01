const router = require('express').Router();
const { getCart, addItem, updateItem, removeItem } = require('../controllers/cartController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);
router.get('/', getCart);
router.post('/', addItem);
router.put('/:productId', updateItem);
router.delete('/:productId', removeItem);

module.exports = router;
