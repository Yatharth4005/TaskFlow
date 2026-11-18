const bcrypt = require('bcryptjs');
const store = require('../data/store');

/**
 * Handle user registration.
 * POST /api/register
 */
const register = (req, res) => {
  const { username, password, name } = req.body || {};

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required.' });
  }

  const trimmedUsername = username.trim();
  if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
    return res.status(400).json({ error: 'Username must be between 3 and 20 characters.' });
  }

  if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
    return res.status(400).json({ error: 'Username may only contain letters, numbers, and underscores.' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  if (name && (typeof name !== 'string' || name.trim().length > 50)) {
    return res.status(400).json({ error: 'Name cannot exceed 50 characters.' });
  }

  const result = store.createUser({
    username: trimmedUsername,
    password,
    name: name ? name.trim() : trimmedUsername
  });

  if (result.error) {
    return res.status(409).json({ error: result.error });
  }

  // Auto-login newly registered user by establishing session
  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ error: 'Account created, but failed to initialize session.' });
    }

    req.session.userId = result.user.id;
    req.session.role = result.user.role;
    req.session.username = result.user.username;

    return res.status(201).json({
      message: 'Registration successful',
      user: result.user
    });
  });
};

/**
 * Handle user login.
 * POST /api/login
 */
const login = (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const user = store.findUserByUsername(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const isPasswordMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordMatch) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to initialize session' });
    }

    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.username = user.username;

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      }
    });
  });
};

/**
 * Handle user logout.
 * POST /api/logout
 */
const logout = (req, res) => {
  if (!req.session) {
    return res.status(200).json({ message: 'Already logged out' });
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('taskflow.sid');
    return res.status(200).json({ message: 'Logged out successfully' });
  });
};

/**
 * Get active user session info.
 * GET /api/me
 */
const getMe = (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  const user = store.findUserById(req.session.userId);
  if (!user) {
    return res.status(401).json({ error: 'User session no longer valid' });
  }

  return res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name
    }
  });
};

module.exports = {
  register,
  login,
  logout,
  getMe
};
