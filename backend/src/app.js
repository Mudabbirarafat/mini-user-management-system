require('dotenv').config();   // ✅ MUST be first

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

async function connectDB(uri) {
  if (!uri) uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not provided');
  await mongoose.connect(uri);
  console.log('Mongo connected');
}

module.exports = { app, connectDB };
