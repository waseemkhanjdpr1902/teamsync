import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /contact - Submit contact form
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Create contact submission
  const submission = await pb.collection('contact_submissions').create({
    name,
    email,
    message,
  });

  // Send confirmation email via PocketBase hooks
  // Note: Email sending is handled by PocketBase hooks, not here
  logger.info(`Contact submission created from: ${email}`);
  res.status(201).json({
    success: true,
    message: 'Thank you for your message. We will get back to you soon.',
    submissionId: submission.id,
  });
});

export default router;
