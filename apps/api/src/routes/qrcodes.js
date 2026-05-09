import express from 'express';
import QRCode from 'qrcode';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// POST /qrcodes - Generate QR code
router.post('/', requireAuth, async (req, res) => {
  const userId = req.auth.id;
  const { content, colors, size } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const qrOptions = {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: size || 300,
    margin: 1,
    color: {
      dark: colors?.dark || '#000000',
      light: colors?.light || '#FFFFFF',
    },
  };

  const qrCodeDataUrl = await QRCode.toDataURL(content, qrOptions);

  const qrCode = await pb.collection('qr_codes').create({
    user_id: userId,
    content,
    qr_code_data: qrCodeDataUrl,
    colors: JSON.stringify(colors || {}),
    size: size || 300,
  });

  logger.info(`QR code generated for user: ${userId}`);
  res.status(201).json({
    id: qrCode.id,
    dataUrl: qrCodeDataUrl,
  });
});

// GET /qrcodes/history - Get user's QR codes
router.get('/history', requireAuth, async (req, res) => {
  const userId = req.auth.id;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 50;

  const qrCodes = await pb.collection('qr_codes').getList(page, pageSize, {
    filter: `user_id="${userId}"`,
    sort: '-created',
  });

  logger.info(`QR code history retrieved for user: ${userId}`);
  res.json(qrCodes);
});

// DELETE /qrcodes/:id - Delete QR code
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.auth.id;

  const qrCode = await pb.collection('qr_codes').getOne(id);

  if (qrCode.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  await pb.collection('qr_codes').delete(id);

  logger.info(`QR code deleted: ${id}`);
  res.json({ success: true, message: 'QR code deleted successfully' });
});

export default router;
