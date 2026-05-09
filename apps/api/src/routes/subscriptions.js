import express from 'express';
import crypto from 'crypto';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const PLANS = {
  pro: { amount: 99900, currency: 'INR', description: 'Pro Plan' },
  business: { amount: 299900, currency: 'INR', description: 'Business Plan' },
};

// POST /subscriptions/create-order - Create Razorpay order
router.post('/create-order', requireAuth, async (req, res) => {
  const userId = req.auth.id;
  const { plan } = req.body;

  if (!plan || !PLANS[plan]) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  const planDetails = PLANS[plan];

  // Create order via Razorpay API
  const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`,
    },
    body: JSON.stringify({
      amount: planDetails.amount,
      currency: planDetails.currency,
      receipt: `order_${userId}_${Date.now()}`,
    }),
  });

  if (!orderResponse.ok) {
    throw new Error(`Razorpay API error: ${orderResponse.status}`);
  }

  const orderData = await orderResponse.json();

  // Save subscription to database
  const subscription = await pb.collection('subscriptions').create({
    user_id: userId,
    plan,
    razorpay_order_id: orderData.id,
    amount: planDetails.amount,
    currency: planDetails.currency,
    status: 'pending',
  });

  logger.info(`Order created for user: ${userId}, plan: ${plan}`);
  res.status(201).json({
    orderId: orderData.id,
    amount: planDetails.amount,
    currency: planDetails.currency,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

// POST /subscriptions/verify-payment - Verify Razorpay payment
router.post('/verify-payment', requireAuth, async (req, res) => {
  const userId = req.auth.id;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment details' });
  }

  // Verify signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Update subscription status
  const subscription = await pb.collection('subscriptions').getFirstListItem(`razorpay_order_id="${razorpay_order_id}"`);

  await pb.collection('subscriptions').update(subscription.id, {
    status: 'completed',
    razorpay_payment_id,
    razorpay_signature,
  });

  // Update user subscription plan
  await pb.collection('users').update(userId, {
    subscription_plan: subscription.plan,
  });

  logger.info(`Payment verified for user: ${userId}`);
  res.json({ success: true, message: 'Payment verified successfully' });
});

// GET /subscriptions/status - Get current subscription status
router.get('/status', requireAuth, async (req, res) => {
  const userId = req.auth.id;

  const subscription = await pb.collection('subscriptions').getFirstListItem(`user_id="${userId}"`);

  if (!subscription) {
    return res.json({ plan: null, status: 'inactive' });
  }

  logger.info(`Subscription status retrieved for user: ${userId}`);
  res.json({
    plan: subscription.plan,
    status: subscription.status,
    expiresAt: subscription.expires_at,
    createdAt: subscription.created,
  });
});

export default router;
