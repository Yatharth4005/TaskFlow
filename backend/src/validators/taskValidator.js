const ALLOWED_STATUSES = ['todo', 'in_progress', 'done'];

/**
 * Validates task creation payload.
 * Title: Required, trimmed, between 3 and 100 characters.
 * Description: Optional, trimmed, max 500 characters.
 */
const validateCreateTask = (req, res, next) => {
  const { title, description } = req.body || {};
  const errors = [];

  if (title === undefined || title === null || typeof title !== 'string') {
    errors.push('Title is required and must be a string.');
  } else {
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3 || trimmedTitle.length > 100) {
      errors.push('Title must be between 3 and 100 characters.');
    }
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.push('Description must be a string if provided.');
    } else if (description.trim().length > 500) {
      errors.push('Description cannot exceed 500 characters.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(' ') });
  }

  next();
};

/**
 * Validates task update (PATCH) payload.
 * Empty update request: Returns 400.
 * Title (if provided): trimmed, between 3 and 100 characters.
 * Description (if provided): max 500 characters.
 * Status (if provided): must be one of 'todo', 'in_progress', 'done'.
 */
const validateUpdateTask = (req, res, next) => {
  const { title, description, status } = req.body || {};
  const errors = [];

  // Check if at least one valid field is provided
  if (title === undefined && description === undefined && status === undefined) {
    return res.status(400).json({
      error: 'Empty update request: At least one field (title, description, or status) must be provided.'
    });
  }

  if (title !== undefined) {
    if (typeof title !== 'string') {
      errors.push('Title must be a string.');
    } else {
      const trimmedTitle = title.trim();
      if (trimmedTitle.length < 3 || trimmedTitle.length > 100) {
        errors.push('Title must be between 3 and 100 characters.');
      }
    }
  }

  if (description !== undefined) {
    if (typeof description !== 'string') {
      errors.push('Description must be a string.');
    } else if (description.trim().length > 500) {
      errors.push('Description cannot exceed 500 characters.');
    }
  }

  if (status !== undefined) {
    if (!ALLOWED_STATUSES.includes(status)) {
      errors.push(`Status must be one of: ${ALLOWED_STATUSES.join(', ')}.`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(' ') });
  }

  next();
};

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  ALLOWED_STATUSES
};

