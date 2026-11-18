const request = require('supertest');
const app = require('../src/app');
const store = require('../src/data/store');

describe('TaskFlow - Authentication API Tests', () => {
  beforeEach(() => {
    store.reset();
  });

  describe('POST /api/register', () => {
    it('should successfully register a new user and establish a session', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({
          username: 'newdeveloper',
          password: 'SecretPassword@123',
          name: 'Jane Doe'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Registration successful');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.username).toBe('newdeveloper');
      expect(res.body.user.role).toBe('user');
      expect(res.body.user.name).toBe('Jane Doe');

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/taskflow\.sid/);
    });

    it('should return 409 when username is already taken', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({
          username: 'piyush', // Already seeded
          password: 'Password123'
        });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('error', 'Username is already taken');
    });

    it('should return 400 when username is shorter than 3 characters', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({
          username: 'ab',
          password: 'Password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/between 3 and 20 characters/);
    });

    it('should return 400 when password is shorter than 6 characters', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({
          username: 'validuser',
          password: '123'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/at least 6 characters/);
    });
  });

  describe('POST /api/login', () => {
    it('should successfully log in with valid user credentials and return user object and session cookie', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          username: 'piyush',
          password: 'User@123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body.user).toEqual({
        id: 'user-piyush-002',
        username: 'piyush',
        role: 'user',
        name: 'Piyush Sharma'
      });

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/taskflow\.sid/);
    });

    it('should successfully log in with valid admin credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          username: 'admin',
          password: 'Admin@123'
        });

      expect(res.status).toBe(200);
      expect(res.body.user.role).toBe('admin');
      expect(res.body.user.username).toBe('admin');
    });

    it('should return 401 when given an invalid username', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          username: 'nonexistent_user',
          password: 'User@123'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid username or password');
    });

    it('should return 401 when given an incorrect password', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          username: 'piyush',
          password: 'WrongPassword!99'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid username or password');
    });

    it('should return 401 when username or password is missing', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          username: 'piyush'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid username or password');
    });
  });

  describe('GET /api/me', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/me');
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Unauthenticated');
    });

    it('should return authenticated user profile when session cookie is present', async () => {
      const agent = request.agent(app);

      await agent
        .post('/api/login')
        .send({ username: 'piyush', password: 'User@123' })
        .expect(200);

      const meRes = await agent.get('/api/me');
      expect(meRes.status).toBe(200);
      expect(meRes.body.user).toEqual({
        id: 'user-piyush-002',
        username: 'piyush',
        role: 'user',
        name: 'Piyush Sharma'
      });
    });
  });

  describe('POST /api/logout', () => {
    it('should successfully destroy the active session and clear session cookie', async () => {
      const agent = request.agent(app);

      await agent
        .post('/api/login')
        .send({ username: 'piyush', password: 'User@123' })
        .expect(200);

      const logoutRes = await agent.post('/api/logout');
      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body).toHaveProperty('message', 'Logged out successfully');

      const meAfterLogout = await agent.get('/api/me');
      expect(meAfterLogout.status).toBe(401);

      const tasksAfterLogout = await agent.get('/api/tasks');
      expect(tasksAfterLogout.status).toBe(401);
    });
  });
});
