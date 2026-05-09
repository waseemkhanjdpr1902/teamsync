blog.jsimport express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /blog - List published blog posts
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;

  const posts = await pb.collection('blog_posts').getList(page, pageSize, {
    filter: 'published_at != null',
    sort: '-published_at',
  });

  logger.info('Blog posts listed');
  res.json(posts);
});

// GET /blog/:slug - Get blog post by slug
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  const post = await pb.collection('blog_posts').getFirstListItem(`slug="${slug}"`);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  // Get related posts
  const relatedPosts = await pb.collection('blog_posts').getList(1, 5, {
    filter: `published_at != null && id != "${post.id}"`,
    sort: '-published_at',
  });

  logger.info(`Blog post retrieved: ${slug}`);
  res.json({
    ...post,
    relatedPosts: relatedPosts.items,
  });
});

// GET /blog/search - Search blog posts
router.get('/search', async (req, res) => {
  const { query } = req.query;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const results = await pb.collection('blog_posts').getList(page, pageSize, {
    filter: `(title~"${query}" || content~"${query}") && published_at != null`,
    sort: '-published_at',
  });

  logger.info(`Blog search performed: ${query}`);
  res.json(results);
});

export default router;
