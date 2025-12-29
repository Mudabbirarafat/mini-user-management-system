
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {isValidEmail,isStrongPassword} = require('../utils/validators');
const blacklist = require('../utils/blacklist');

router.post('/signup', async(req,res)=>{
 try{
  const {fullName,email,password} = req.body;
  if(!fullName || !email || !password) return res.status(400).json({error:{message:'Missing fields'}});
  if(!isValidEmail(email)) return res.status(400).json({error:{message:'Invalid email'}});
  if(!isStrongPassword(password)) return res.status(400).json({error:{message:'Password too weak'}});
  const exists = await User.findOne({email});
  if(exists) return res.status(409).json({error:{message:'Email already in use'}});
  const hash = await bcrypt.hash(password,10);
  const user = await User.create({fullName,email,password:hash});
  const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET);
  res.json({token});
 }catch(err){
  res.status(500).json({error:{message:'Server error'}});
 }
});

router.post('/login', async(req,res)=>{
 try{
  const {email,password} = req.body;
  if(!email || !password) return res.status(400).json({error:{message:'Missing fields'}});
  const user = await User.findOne({email});
  if(!user) return res.status(401).json({error:{message:'Invalid credentials'}});
  if(user.status !== 'active') return res.status(403).json({error:{message:'Account inactive'}});
  const ok = await bcrypt.compare(password,user.password);
  if(!ok) return res.status(401).json({error:{message:'Invalid credentials'}});
  user.lastLogin = new Date();
  await user.save();
  const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET);
  res.json({token});
 }catch(err){
  res.status(500).json({error:{message:'Server error'}});
 }
});

router.post('/logout', (req,res)=>{
 try{
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if(!token) return res.status(400).json({error:{message:'No token provided'}});
  blacklist.add(token);
  res.json({message:'Logged out'});
 }catch(err){
  res.status(500).json({error:{message:'Server error'}});
 }
});

module.exports = router;
