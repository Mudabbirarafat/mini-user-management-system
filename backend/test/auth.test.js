const request = require('supertest');
const {app, connectDB} = require('../src/app');
const User = require('../src/models/User');
const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose = require('mongoose');

describe('Auth routes', ()=>{
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
  });

  test('signup creates user and returns token', async ()=>{
    const res = await request(app).post('/api/auth/signup').send({fullName:'Test User',email:'test@example.com',password:'Pass1234'});
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    const user = await User.findOne({email:'test@example.com'});
    expect(user).toBeTruthy();
  });

  test('login with correct credentials returns token', async ()=>{
    await request(app).post('/api/auth/signup').send({fullName:'T',email:'login@example.com',password:'Pass1234'});
    const res = await request(app).post('/api/auth/login').send({email:'login@example.com',password:'Pass1234'});
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

});
