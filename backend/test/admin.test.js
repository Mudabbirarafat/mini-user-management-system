const request = require('supertest');
const {app, connectDB} = require('../src/app');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');
const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose = require('mongoose');

describe('Admin routes', ()=>{
  let adminToken;
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
    // create admin user directly
    const admin = await User.create({fullName:'Admin',email:'admin@example.com',password:'hashed',role:'admin'});
    adminToken = jwt.sign({id:admin._id,role:admin.role},process.env.JWT_SECRET || 'testsecret');
  });

  test('GET /api/admin/users returns list', async ()=>{
    await User.create({fullName:'U1',email:'u1@example.com',password:'h'});
    const res = await request(app).get('/api/admin/users').set('Authorization',`Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  test('activate and deactivate user', async ()=>{
    const u = await User.create({fullName:'U2',email:'u2@example.com',password:'h',status:'inactive'});
    const res1 = await request(app).patch(`/api/admin/users/${u._id}/activate`).set('Authorization',`Bearer ${adminToken}`);
    expect(res1.statusCode).toBe(200);
    const refreshed = await User.findById(u._id);
    expect(refreshed.status).toBe('active');
    const res2 = await request(app).patch(`/api/admin/users/${u._id}/deactivate`).set('Authorization',`Bearer ${adminToken}`);
    expect(res2.statusCode).toBe(200);
    const refreshed2 = await User.findById(u._id);
    expect(refreshed2.status).toBe('inactive');
  });
});
