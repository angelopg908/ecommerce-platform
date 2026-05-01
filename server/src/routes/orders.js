const router = require('express').Router();
const { getOrders, getOrder } = require('../controllers/orderController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);
router.get('/', getOrders);
router.get('/:id', getOrder);

module.exports = router;
