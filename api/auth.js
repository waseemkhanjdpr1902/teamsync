// api/auth.js (if you want password protection)
export default function handler(req, res) {
  const authHeader = req.headers.authorization;
  const expectedPassword = process.env.TEAM_PASSWORD || 'TeamSync2025!';
  
  if (!authHeader || authHeader !== `Bearer ${expectedPassword}`) {
    res.setHeader('WWW-Authenticate', 'Bearer');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  res.status(200).json({ success: true });
}
