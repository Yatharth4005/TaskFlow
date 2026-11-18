const store = require('../data/store');

/**
 * Middleware ensuring request has an active session and valid authenticated user.
 * Returns 401 Unauthorized if unauthenticated.
 */
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const user = store.findUserById(req.session.userId);
  if (!user) {
    // Session exists but user no longer in store
    req.session.destroy();
    return res.status(401).json({ error: 'User session invalid. Please log in again.' });
  }

  // Attach safe user object to request
  req.user = {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name
  };

  next();
};

module.exports = {
  requireAuth
};

