const request = require('supertest');
const app = require('../src/app');
const store = require('../src/data/store');

describe('TaskFlow - Task & Authorization API Tests', () => {
  beforeEach(() => {
    store.reset();
  });

  describe('Unauthenticated Access Control', () => {
    it('GET /api/tasks should return 401 when no session exists', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Authentication required');
    });

    it('POST /api/tasks should return 401 when no session exists', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Unauthorized Task' });
      expect(res.status).toBe(401);
    });

    it('PATCH /api/tasks/:id should return 401 when no session exists', async () => {
      const res = await request(app)
        .patch('/api/tasks/task-101')
        .send({ title: 'Updated Title' });
      expect(res.status).toBe(401);
    });

    it('DELETE /api/tasks/:id should return 401 when no session exists', async () => {
      const res = await request(app).delete('/api/tasks/task-101');
      expect(res.status).toBe(401);
    });
  });

  describe('Normal User Permissions & Ownership Isolation', () => {
    let piyushAgent;
    let rahulAgent;

    beforeEach(async () => {
      // Authenticate as Piyush
      piyushAgent = request.agent(app);
      await piyushAgent
        .post('/api/login')
        .send({ username: 'piyush', password: 'User@123' })
        .expect(200);

      // Authenticate as Rahul
      rahulAgent = request.agent(app);
      await rahulAgent
        .post('/api/login')
        .send({ username: 'rahul', password: 'User@123' })
        .expect(200);
    });

    it('should only return tasks belonging to the authenticated user', async () => {
      const res = await piyushAgent.get('/api/tasks');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3); // 3 seeded tasks for Piyush

      // Verify all returned tasks belong strictly to Piyush
      res.body.forEach(task => {
        expect(task.userId).toBe('user-piyush-002');
      });
    });

    it('should support status filtering for normal user', async () => {
      const res = await piyushAgent.get('/api/tasks?status=done');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].id).toBe('task-101');
      expect(res.body[0].status).toBe('done');
    });

    it('should allow user to create a task and strictly enforce status="todo"', async () => {
      const res = await piyushAgent
        .post('/api/tasks')
        .send({
          title: 'Implement unit tests',
          description: 'Write integration tests with supertest',
          status: 'done' // Frontend attempts to set 'done', backend MUST force 'todo'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Implement unit tests');
      expect(res.body.description).toBe('Write integration tests with supertest');
      expect(res.body.status).toBe('todo'); // Forced to 'todo'
      expect(res.body.userId).toBe('user-piyush-002');
    });

    it('should allow user to update their own task', async () => {
      const res = await piyushAgent
        .patch('/api/tasks/task-103')
        .send({
          title: 'Configured session cookies',
          description: 'Updated description for cookies',
          status: 'in_progress'
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Configured session cookies');
      expect(res.body.description).toBe('Updated description for cookies');
      expect(res.body.status).toBe('in_progress');
    });

    it('should return 404 when a user attempts to update another user\'s task', async () => {
      // task-104 belongs to Rahul, Piyush attempts to update it
      const res = await piyushAgent
        .patch('/api/tasks/task-104')
        .send({
          title: 'Malicious modification'
        });

      // Specification rule: unauthorized access to another user's task returns 404
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Task not found');
    });

    it('should allow user to delete their own task', async () => {
      const res = await piyushAgent.delete('/api/tasks/task-103');
      expect(res.status).toBe(204);

      // Verify it is gone
      const listRes = await piyushAgent.get('/api/tasks');
      const found = listRes.body.find(t => t.id === 'task-103');
      expect(found).toBeUndefined();
    });

    it('should return 404 when a user attempts to delete another user\'s task', async () => {
      // task-104 belongs to Rahul, Piyush attempts to delete it
      const res = await piyushAgent.delete('/api/tasks/task-104');

      // Specification rule: unauthorized access returns 404
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Task not found');

      // Verify task still exists in Rahul's list
      const rahulTasks = await rahulAgent.get('/api/tasks');
      const taskStillExists = rahulTasks.body.some(t => t.id === 'task-104');
      expect(taskStillExists).toBe(true);
    });

    it('should return aggregate stats for the authenticated user', async () => {
      const res = await piyushAgent.get('/api/tasks/stats');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        total: 3,
        todo: 1,
        in_progress: 1,
        done: 1
      });
      // Regular users do not receive totalUsers
      expect(res.body.totalUsers).toBeUndefined();
    });
  });

  describe('Administrator Elevated Permissions', () => {
    let adminAgent;

    beforeEach(async () => {
      adminAgent = request.agent(app);
      await adminAgent
        .post('/api/login')
        .send({ username: 'admin', password: 'Admin@123' })
        .expect(200);
    });

    it('should return all tasks created by all users with owner metadata', async () => {
      const res = await adminAgent.get('/api/tasks');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(8); // Total seed tasks across all users

      // Verify owner metadata is included for each task
      res.body.forEach(task => {
        expect(task).toHaveProperty('owner');
        expect(task.owner).toHaveProperty('id');
        expect(task.owner).toHaveProperty('username');
        expect(task.owner).toHaveProperty('name');
      });
    });

    it('should allow admin to update any user\'s task', async () => {
      // task-101 belongs to Piyush
      const res = await adminAgent
        .patch('/api/tasks/task-101')
        .send({
          title: 'Admin reviewed documentation',
          status: 'in_progress'
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Admin reviewed documentation');
      expect(res.body.status).toBe('in_progress');
      expect(res.body.owner.username).toBe('piyush');
    });

    it('should allow admin to delete any user\'s task', async () => {
      // task-107 belongs to Amit
      const res = await adminAgent.delete('/api/tasks/task-107');
      expect(res.status).toBe(204);

      // Verify total count decreased
      const listRes = await adminAgent.get('/api/tasks');
      expect(listRes.body.length).toBe(7);
      const found = listRes.body.find(t => t.id === 'task-107');
      expect(found).toBeUndefined();
    });

    it('should return admin stats with totalUsers count', async () => {
      const res = await adminAgent.get('/api/tasks/stats');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('total', 8);
      expect(res.body).toHaveProperty('totalUsers', 3); // 3 standard users: piyush, rahul, amit
    });
  });

  describe('Input Validation Rules', () => {
    let agent;

    beforeEach(async () => {
      agent = request.agent(app);
      await agent
        .post('/api/login')
        .send({ username: 'piyush', password: 'User@123' })
        .expect(200);
    });

    it('should reject task creation with missing title (400)', async () => {
      const res = await agent
        .post('/api/tasks')
        .send({ description: 'No title provided' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject task creation with title shorter than 3 characters (400)', async () => {
      const res = await agent
        .post('/api/tasks')
        .send({ title: 'ab' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/between 3 and 100 characters/);
    });

    it('should reject task creation with title longer than 100 characters (400)', async () => {
      const res = await agent
        .post('/api/tasks')
        .send({ title: 'A'.repeat(101) });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/between 3 and 100 characters/);
    });

    it('should reject task creation with description exceeding 500 characters (400)', async () => {
      const res = await agent
        .post('/api/tasks')
        .send({
          title: 'Valid Title',
          description: 'D'.repeat(501)
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/cannot exceed 500 characters/);
    });

    it('should reject update with invalid status (400)', async () => {
      const res = await agent
        .patch('/api/tasks/task-102')
        .send({ status: 'archived_invalid' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Status must be one of/);
    });

    it('should reject empty update request (400)', async () => {
      const res = await agent
        .patch('/api/tasks/task-102')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Empty update request/);
    });

    it('should return 404 when updating non-existent task ID', async () => {
      const res = await agent
        .patch('/api/tasks/non-existent-task-id-999')
        .send({ title: 'Valid New Title' });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 404 when deleting non-existent task ID', async () => {
      const res = await agent.delete('/api/tasks/non-existent-task-id-999');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Task not found');
    });
  });
});

