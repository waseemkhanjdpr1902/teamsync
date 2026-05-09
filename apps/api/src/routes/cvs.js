import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { requireAuth } from '../middleware/auth.js';
import jsPDF from 'jspdf';

const router = express.Router();

// POST /cvs - Create a new CV
router.post('/', requireAuth, async (req, res) => {
  const userId = req.auth.id;
  const { title, content, template } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const cv = await pb.collection('cvs').create({
    user_id: userId,
    title,
    content,
    template: template || 'default',
  });

  logger.info(`CV created for user: ${userId}`);
  res.status(201).json(cv);
});

// GET /cvs/:id - Get CV by ID
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.auth.id;

  const cv = await pb.collection('cvs').getOne(id);

  if (cv.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  logger.info(`CV retrieved: ${id}`);
  res.json(cv);
});

// PUT /cvs/:id - Update CV
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.auth.id;
  const { title, content, template } = req.body;

  const cv = await pb.collection('cvs').getOne(id);

  if (cv.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const updateData = {};
  if (title) updateData.title = title;
  if (content) updateData.content = content;
  if (template) updateData.template = template;

  const updatedCv = await pb.collection('cvs').update(id, updateData);

  logger.info(`CV updated: ${id}`);
  res.json(updatedCv);
});

// DELETE /cvs/:id - Delete CV
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.auth.id;

  const cv = await pb.collection('cvs').getOne(id);

  if (cv.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  await pb.collection('cvs').delete(id);

  logger.info(`CV deleted: ${id}`);
  res.json({ success: true, message: 'CV deleted successfully' });
});

// POST /cvs/:id/export-pdf - Export CV as PDF
router.post('/:id/export-pdf', requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.auth.id;

  const cv = await pb.collection('cvs').getOne(id);

  if (cv.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  // Create PDF using jsPDF
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(cv.title, 10, 10);
  doc.setFontSize(12);
  doc.text(cv.content, 10, 20);

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

  logger.info(`CV exported as PDF: ${id}`);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${cv.title}.pdf"`);
  res.send(pdfBuffer);
});

export default router;
