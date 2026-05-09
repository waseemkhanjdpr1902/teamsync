import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { requireAuth } from '../middleware/auth.js';
import QRCode from 'qrcode';
import crypto from 'crypto';

const router = express.Router();

// Helper function to generate short code
function generateShortCode(length = 6) {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}

// POST /urls/shorten - Create shortened URL
router.post('/shorten', requireAuth, async (req, res) => {
  const userId = req.auth.id;
  const { original_url, custom_alias, expires_at, password } = req.body;

  if (!original_url) {
    return res.status(400).json({ error: 'Original URL is required' });
  }

  const shortCode = custom_alias || generateShortCode();

  // Generate QR code
  const qrCodeDataUrl = await QRCode.toDataURL(`${process.env.APP_URL || 'http://localhost:3000'}/r/${shortCode}`);

  const shortenedUrl = await pb.collection('shortened_urls').create({
    user_id: userId,
    original_url,
    short_code: shortCode,
    expires_at: expires_at || null,
    password: password || null,
    clicks: 0,
    qr_code: qrCodeDataUrl,
  });

  logger.info(`URL shortened: ${shortCode}`);
  res.status(201).json({
    id: shortenedUrl.id,
    shortUrl: `${process.env.APP_URL || 'http://localhost:3000'}/r/${shortCode}`,
    qrCode: qrCodeDataUrl,
  });
});

// GET /urls/:shortCode - Redirect to original URL (public)
router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  const urlRecord = await pb.collection('shortened_urls').getFirstListItem(`short_code="${shortCode}"`);

  if (!urlRecord) {
    return res.status(404).json({ error: 'URL not found' });
  }

  // Check expiration
  if (urlRecord.expires_at && new Date(urlRecord.expires_at) < new Date()) {
    return res.status(410).json({ error: 'URL has expired' });
  }

  // Increment clicks
  await pb.collection('shortened_urls').update(urlRecord.id, {
    clicks: (urlRecord.clicks || 0) + 1,
  });

  // Track analytics
  const referrer = req.get('referer') || 'direct';
  const userAgent = req.get('user-agent') || 'unknown';
  const ip = req.ip || req.connection.remoteAddress;

  await pb.collection('url_analytics').create({
    url_id: urlRecord.id,
    referrer,
    user_agent: userAgent,
    ip_address: ip,
  });

  logger.info(`URL accessed: ${shortCode}`);
  res.redirect(urlRecord.original_url);
});

// GET /urls/:id/analytics - Get analytics for URL
router.get('/:id/analytics', requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.auth.id;

  const urlRecord = await pb.collection('shortened_urls').getOne(id);

  if (urlRecord.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const analytics = await pb.collection('url_analytics').getList(1, 1000, {
    filter: `url_id="${id}"`,
  });

  // Process analytics data
  const referrerBreakdown = {};
  const deviceBreakdown = {};

  analytics.items.forEach((item) => {
    referrerBreakdown[item.referrer] = (referrerBreakdown[item.referrer] || 0) + 1;
    const device = item.user_agent.includes('Mobile') ? 'mobile' : 'desktop';
    deviceBreakdown[device] = (deviceBreakdown[device] || 0) + 1;
  });

  logger.info(`Analytics retrieved for URL: ${id}`);
  res.json({
    clicks: urlRecord.clicks,
    referrerBreakdown,
    deviceBreakdown,
    totalAnalytics: analytics.items.length,
  });
});

// DELETE /urls/:id - Delete shortened URL
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.auth.id;

  const urlRecord = await pb.collection('shortened_urls').getOne(id);

  if (urlRecord.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  await pb.collection('shortened_urls').delete(id);

  logger.info(`URL deleted: ${id}`);
  res.json({ success: true, message: 'URL deleted successfully' });
});

export default router;
