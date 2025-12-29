
const jwt = require('jsonwebtoken');
const blacklist = require('../utils/blacklist');

module.exports = (req,res,next)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({error:{message:'Unauthorized'}});
  if(blacklist.has(token)) return res.status(401).json({error:{message:'Token revoked'}});
  try{
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  }catch(e){
    res.status(401).json({error:{message:'Invalid token'}});
  }
};
