import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /users/profile - Get current user profile
router.get('/profile', requireAuth, async (req, res) => {
  const userId = req.auth.id;
  const user = await pb.collection('users').getOne(userId);

  logger.info(`Profile retrieved for user: ${userId}`);
  res.json(user);
});

// PUT /users/profile - Update user profile
router.put('/profile', requireAuth, async (req, res) => {
  const userId = req.auth.id;
  const { name, email, avatar } = req.body;

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (avatar) updateData.avatar = avatar;

  const updatedUser = await pb.collection('users').update(userId, updateData);

  logger.info(`Profile updated for user: ${userId}`);
  res.json(updatedUser);
});

// DELETE /users/account - Delete user account
router.delete('/account', requireAuth, async (req, res) => {
  const userId = req.auth.id;

  await pb.collection('users').delete(userId);

  logger.info(`Account deleted for user: ${userId}`);
  res.json({ success: true, message: 'Account deleted successfully' });
});

export default router;
