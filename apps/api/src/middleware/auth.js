import logger from '../utils/logger.js';

// Middleware to require authentication
const requireAuth = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token is required' });
  }

  const token = authHeader.slice(7);

  // Parse JWT token (basic validation)
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

    req.auth = {
      id: payload.id,
      email: payload.email,
      token,
    };

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export { requireAuth };
