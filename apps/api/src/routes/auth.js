import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /auth/signup - Create user and request OTP
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  // Check if email already exists
  const existingUser = await pb.collection('users').getFirstListItem(`email="${email}"`);
  
  if (existingUser) {
    throw new Error('Email already registered. Please login or use a different email.');
  }

  // Create user
  const user = await pb.collection('users').create({
    email,
    password,
    passwordConfirm: password,
    name,
  });

  // Request OTP
  await pb.collection('users').requestOTP(email);

  logger.info(`User signup initiated for email: ${email}`);
  res.status(201).json({ success: true, message: 'User created. OTP sent to email.' });
});

// POST /auth/login - Authenticate with email and password
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const authData = await pb.collection('users').authWithPassword(email, password);

  logger.info(`User logged in: ${email}`);
  res.json({
    user: authData.record,
    token: authData.token,
  });
});

// POST /auth/verify-otp - Verify OTP and authenticate
router.post('/verify-otp', async (req, res) => {
  const { email, otpId, code } = req.body;

  if (!email || !otpId || !code) {
    return res.status(400).json({ error: 'Email, otpId, and code are required' });
  }

  const authData = await pb.collection('users').authWithOTP(otpId, code);

  logger.info(`OTP verified for email: ${email}`);
  res.json({
    user: authData.record,
    token: authData.token,
  });
});

// POST /auth/forgot-password - Generate password reset token
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Request password reset
  await pb.collection('users').requestPasswordReset(email);

  logger.info(`Password reset requested for email: ${email}`);
  res.json({ success: true, message: 'Password reset link sent to email' });
});

// POST /auth/reset-password - Reset password with token
router.post('/reset-password', async (req, res) => {
  const { token, newPassword, newPasswordConfirm } = req.body;

  if (!token || !newPassword || !newPasswordConfirm) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  if (newPassword !== newPasswordConfirm) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Confirm password reset
  await pb.collection('users').confirmPasswordReset(token, newPassword, newPasswordConfirm);

  logger.info('Password reset completed');
  res.json({ success: true, message: 'Password reset successfully' });
});

// POST /auth/logout - Clear auth token
router.post('/logout', async (req, res) => {
  pb.authStore.clear();
  logger.info('User logged out');
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
