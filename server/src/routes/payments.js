const router = require('express').Router();
const { createCheckoutSession, handleWebhook } = require('../controllers/paymentController');
const authenticate = require('../middleware/authenticate');

// Raw body already applied in index.js for this path
router.post('/webhook', handleWebhook);
router.post('/checkout-session', authenticate, createCheckoutSession);

module.exports = router;
