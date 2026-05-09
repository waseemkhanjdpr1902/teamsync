import { Router } from 'express';
import healthCheck from './health-check.js';
import authRouter from './auth.js';
import usersRouter from './users.js';
import cvsRouter from './cvs.js';
import resumesRouter from './resumes.js';
import urlsRouter from './urls.js';
import qrcodesRouter from './qrcodes.js';
import subscriptionsRouter from './subscriptions.js';
import blogRouter from './blog.js';
import contactRouter from './contact.js';

const router = Router();

export default () => {
  router.get('/health', healthCheck);
  router.use('/auth', authRouter);
  router.use('/users', usersRouter);
  router.use('/cvs', cvsRouter);
  router.use('/resumes', resumesRouter);
  router.use('/urls', urlsRouter);
  router.use('/qrcodes', qrcodesRouter);
  router.use('/subscriptions', subscriptionsRouter);
  router.use('/blog', blogRouter);
  router.use('/contact', contactRouter);

  return router;
};
