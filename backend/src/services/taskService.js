const store = require('../data/store');

class TaskService {
  /**
   * Retrieve visible tasks for the authenticated user.
   * Admins see all tasks with owner details attached.
   * Regular users see only their own tasks.
   */
  getTasks({ user, status }) {
    const isAdmin = user.role === 'admin';
    let tasks = isAdmin ? store.getAllTasks() : store.getTasksByUserId(user.id);

    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }

    if (isAdmin) {
      // Attach owner information for administrator view
      return tasks.map(task => {
        const owner = store.findUserById(task.userId);
        return {
          ...task,
          owner: owner
            ? { id: owner.id, username: owner.username, name: owner.name }
            : { id: task.userId, username: 'unknown', name: 'Unknown User' }
        };
      });
    }

    return tasks;
  }

  /**
   * Create a new task.
   * Enforces status = 'todo' and assigns userId from authenticated user.
   */
  createTask({ user, title, description }) {
    return store.createTask({
      userId: user.id,
      title,
      description
    });
  }

  /**
   * Update an existing task.
   * Regular users may only update their own tasks.
   * Admins may update any task.
   * Returns notFound: true if task does not exist or user lacks ownership.
   */
  updateTask({ user, taskId, updates }) {
    const existing = store.getTaskById(taskId);
    if (!existing) {
      return { notFound: true };
    }

    // Role-based authorization: standard user cannot access another user's task
    if (user.role !== 'admin' && existing.userId !== user.id) {
      return { notFound: true }; // 404 per security specifications
    }

    const updated = store.updateTask(taskId, updates);

    if (user.role === 'admin') {
      const owner = store.findUserById(updated.userId);
      return {
        task: {
          ...updated,
          owner: owner
            ? { id: owner.id, username: owner.username, name: owner.name }
            : { id: updated.userId, username: 'unknown', name: 'Unknown User' }
        }
      };
    }

    return { task: updated };
  }

  /**
   * Delete an existing task.
   * Regular users may only delete their own tasks.
   * Admins may delete any task.
   * Returns notFound: true if task does not exist or user lacks ownership.
   */
  deleteTask({ user, taskId }) {
    const existing = store.getTaskById(taskId);
    if (!existing) {
      return { notFound: true };
    }

    // Role-based authorization: standard user cannot access another user's task
    if (user.role !== 'admin' && existing.userId !== user.id) {
      return { notFound: true }; // 404 per security specifications
    }

    store.deleteTask(taskId);
    return { success: true };
  }

  /**
   * Retrieve statistics for tasks accessible to the current user.
   */
  getStats({ user }) {
    const isAdmin = user.role === 'admin';
    return store.getStats(user.id, isAdmin);
  }
}

module.exports = new TaskService();

