const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cartService = require('../services/cartService');
const orderService = require('../services/orderService');

const createCheckoutSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const items = await cartService.getCart(userId);

    if (items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          ...(item.image_url && { images: [item.image_url] }),
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: { userId },
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook signature error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const total = session.amount_total / 100;

    if (!userId) {
      console.error('Webhook: missing userId in session metadata');
      return res.json({ received: true });
    }

    try {
      const items = await cartService.getCart(userId);
      if (items.length > 0) {
        await orderService.createOrder(userId, total, items);
        await cartService.clearCart(userId);
      }
    } catch (err) {
      console.error('Webhook order creation failed:', err.message);
      return res.status(500).end();
    }
  }

  res.json({ received: true });
};

module.exports = { createCheckoutSession, handleWebhook };
