import express from 'express';
import multer from 'multer';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /resumes/upload - Upload resume file
router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  const userId = req.auth.id;

  if (!req.file) {
    return res.status(400).json({ error: 'File is required' });
  }

  // Create FormData to upload file to PocketBase
  const formData = new FormData();
  const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
  formData.append('file', blob, req.file.originalname);
  formData.append('user_id', userId);

  const resume = await pb.collection('resumes').create(formData);

  logger.info(`Resume uploaded for user: ${userId}`);
  res.status(201).json({
    id: resume.id,
    fileUrl: pb.getFileUrl(resume, resume.file),
  });
});

// POST /resumes/analyze - Analyze resume for ATS compatibility
router.post('/analyze', requireAuth, async (req, res) => {
  const userId = req.auth.id;
  const { fileUrl, content } = req.body;

  if (!fileUrl && !content) {
    return res.status(400).json({ error: 'File URL or content is required' });
  }

  // Mock AI analysis - replace with actual AI service integration
  const analysis = {
    score: Math.floor(Math.random() * 100),
    atsCompatibility: Math.floor(Math.random() * 100),
    missingKeywords: ['leadership', 'project management', 'communication'],
    suggestions: [
      'Add more quantifiable achievements',
      'Include relevant certifications',
      'Improve formatting for ATS compatibility',
    ],
  };

  // Save analysis to database
  const resumeAnalysis = await pb.collection('resumes').create({
    user_id: userId,
    file_url: fileUrl,
    analysis: JSON.stringify(analysis),
  });

  logger.info(`Resume analyzed for user: ${userId}`);
  res.json({
    id: resumeAnalysis.id,
    ...analysis,
  });
});

// GET /resumes/history - Get user's resume analysis history
router.get('/history', requireAuth, async (req, res) => {
  const userId = req.auth.id;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 50;

  const resumes = await pb.collection('resumes').getList(page, pageSize, {
    filter: `user_id="${userId}"`,
    sort: '-created',
  });

  logger.info(`Resume history retrieved for user: ${userId}`);
  res.json(resumes);
});

export default router;
