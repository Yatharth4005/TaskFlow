/**
 * Middleware ensuring authenticated user possesses the 'admin' role.
 * Returns 403 Forbidden if user lacks admin privileges.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Administrator privileges required' });
  }
  next();
};

module.exports = {
  requireAdmin
};

