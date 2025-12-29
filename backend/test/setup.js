const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose = require('mongoose');
const {connectDB} = require('../src/app');

let mongod;

module.exports = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;
  await connectDB(uri);

  // expose cleanup
  global.__MONGOD__ = mongod;
};
