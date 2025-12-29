const request = require('supertest');
const {app, connectDB} = require('../src/app');
const User = require('../src/models/User');
const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose = require('mongoose');

describe('User routes', ()=>{
  let token;
  let mongod;
  beforeAll(async ()=>{
    process.env.JWT_SECRET = 'testsecret';
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await connectDB(uri);
  });

  afterAll(async ()=>{
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async ()=>{
    await User.deleteMany({});
    const res = await request(app).post('/api/auth/signup').send({fullName:'U',email:'u@example.com',password:'Pass1234'});
    token = res.body.token;
  });

  test('GET /me returns profile', async ()=>{
    const res = await request(app).get('/api/users/me').set('Authorization',`Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('u@example.com');
  });

  test('PUT /me updates profile', async ()=>{
    const res = await request(app).put('/api/users/me').set('Authorization',`Bearer ${token}`).send({fullName:'Updated'});
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Profile updated');
    const u = await User.findOne({email:'u@example.com'});
    expect(u.fullName).toBe('Updated');
  });

  test('POST /change-password changes password', async ()=>{
    const res = await request(app).post('/api/users/change-password').set('Authorization',`Bearer ${token}`).send({currentPassword:'Pass1234',newPassword:'Newpass123'});
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Password changed');
  });
});
