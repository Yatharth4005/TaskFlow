const bcrypt = require('bcryptjs');

// Pre-computed salt rounds for security
const SALT_ROUNDS = 10;

// Generate real bcrypt password hashes
const adminPasswordHash = bcrypt.hashSync('Admin@123', SALT_ROUNDS);
const userPasswordHash = bcrypt.hashSync('User@123', SALT_ROUNDS);

const initialUsers = [
  {
    id: 'user-admin-001',
    username: 'admin',
    passwordHash: adminPasswordHash,
    role: 'admin',
    name: 'Administrator'
  },
  {
    id: 'user-piyush-002',
    username: 'piyush',
    passwordHash: userPasswordHash,
    role: 'user',
    name: 'Piyush Sharma'
  },
  {
    id: 'user-rahul-003',
    username: 'rahul',
    passwordHash: userPasswordHash,
    role: 'user',
    name: 'Rahul Verma'
  },
  {
    id: 'user-amit-004',
    username: 'amit',
    passwordHash: userPasswordHash,
    role: 'user',
    name: 'Amit Patel'
  }
];

const initialTasks = [
  {
    id: 'task-101',
    userId: 'user-piyush-002',
    title: 'Complete project documentation',
    description: 'Prepare the project README and system architecture diagrams',
    status: 'done',
    createdAt: new Date('2026-11-15T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-11-15T14:30:00Z').toISOString()
  },
  {
    id: 'task-102',
    userId: 'user-piyush-002',
    title: 'Design clean SaaS dashboard',
    description: 'Implement modern blue-and-white theme using Tailwind CSS and Lucide icons',
    status: 'in_progress',
    createdAt: new Date('2026-11-16T10:15:00Z').toISOString(),
    updatedAt: new Date('2026-11-16T11:45:00Z').toISOString()
  },
  {
    id: 'task-103',
    userId: 'user-piyush-002',
    title: 'Configure session cookies',
    description: 'Enforce httpOnly and SameSite cookie options in express-session',
    status: 'todo',
    createdAt: new Date('2026-11-17T08:30:00Z').toISOString(),
    updatedAt: new Date('2026-11-17T08:30:00Z').toISOString()
  },
  {
    id: 'task-104',
    userId: 'user-rahul-003',
    title: 'Implement Jest and Supertest test suites',
    description: 'Cover authentication, ownership isolation, and validation edge cases',
    status: 'done',
    createdAt: new Date('2026-11-15T11:00:00Z').toISOString(),
    updatedAt: new Date('2026-11-15T16:00:00Z').toISOString()
  },
  {
    id: 'task-105',
    userId: 'user-rahul-003',
    title: 'Build role-based authorization middleware',
    description: 'Ensure administrators have elevated access while standard users are isolated',
    status: 'in_progress',
    createdAt: new Date('2026-11-16T14:00:00Z').toISOString(),
    updatedAt: new Date('2026-11-16T15:20:00Z').toISOString()
  },
  {
    id: 'task-106',
    userId: 'user-rahul-003',
    title: 'Implement task statistics endpoint',
    description: 'Aggregate counts by status for user and admin overview dashboards',
    status: 'todo',
    createdAt: new Date('2026-11-17T09:45:00Z').toISOString(),
    updatedAt: new Date('2026-11-17T09:45:00Z').toISOString()
  },
  {
    id: 'task-107',
    userId: 'user-amit-004',
    title: 'Audit responsive breakpoints',
    description: 'Test layout rendering across desktop (1280px), tablet (768px), and mobile (375px)',
    status: 'done',
    createdAt: new Date('2026-11-14T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-11-14T17:00:00Z').toISOString()
  },
  {
    id: 'task-108',
    userId: 'user-amit-004',
    title: 'Optimize Tailwind CSS bundles',
    description: 'Purge unused classes and verify minimal CSS bundle size for production',
    status: 'in_progress',
    createdAt: new Date('2026-11-16T13:00:00Z').toISOString(),
    updatedAt: new Date('2026-11-16T17:15:00Z').toISOString()
  }
];

module.exports = {
  initialUsers,
  initialTasks
};

