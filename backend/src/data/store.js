const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { initialUsers, initialTasks } = require('./seed');

class DataStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.users = JSON.parse(JSON.stringify(initialUsers));
    this.tasks = JSON.parse(JSON.stringify(initialTasks));
  }

  findUserByUsername(username) {
    if (!username) return null;
    return this.users.find(u => u.username.toLowerCase() === username.toLowerCase().trim()) || null;
  }

  findUserById(id) {
    if (!id) return null;
    return this.users.find(u => u.id === id) || null;
  }

  createUser({ username, password, name }) {
    const trimmedUsername = username.toLowerCase().trim();
    if (this.findUserByUsername(trimmedUsername)) {
      return { error: 'Username is already taken' };
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const newUser = {
      id: `user-${uuidv4()}`,
      username: trimmedUsername,
      passwordHash,
      role: 'user',
      name: name ? name.trim() : trimmedUsername
    };

    this.users.push(newUser);
    return {
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        name: newUser.name
      }
    };
  }

  getAllUsersSafe() {
    return this.users.map(({ passwordHash, ...userSafe }) => userSafe);
  }

  getAllTasks() {
    return [...this.tasks];
  }

  getTasksByUserId(userId) {
    return this.tasks.filter(t => t.userId === userId);
  }

  getTaskById(id) {
    return this.tasks.find(t => t.id === id) || null;
  }

  createTask({ userId, title, description }) {
    const newTask = {
      id: `task-${uuidv4()}`,
      userId,
      title: title.trim(),
      description: description ? description.trim() : '',
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.unshift(newTask);
    return newTask;
  }

  updateTask(id, updates) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    const existing = this.tasks[index];
    const updated = {
      ...existing,
      ...(updates.title !== undefined && { title: updates.title.trim() }),
      ...(updates.description !== undefined && { description: updates.description.trim() }),
      ...(updates.status !== undefined && { status: updates.status }),
      updatedAt: new Date().toISOString()
    };

    this.tasks[index] = updated;
    return updated;
  }

  deleteTask(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }

  getStats(userId, isAdmin = false) {
    const visibleTasks = isAdmin ? this.tasks : this.tasks.filter(t => t.userId === userId);

    const stats = {
      total: visibleTasks.length,
      todo: visibleTasks.filter(t => t.status === 'todo').length,
      in_progress: visibleTasks.filter(t => t.status === 'in_progress').length,
      done: visibleTasks.filter(t => t.status === 'done').length
    };

    if (isAdmin) {
      stats.totalUsers = this.users.filter(u => u.role === 'user').length;
    }

    return stats;
  }
}

const store = new DataStore();
module.exports = store;
