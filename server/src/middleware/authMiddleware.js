
const jwt = require('jsonwebtoken');
const User = require('../models/User');
module.exports = async (req, res, next) => {
  const header = req.header('Authorization');
  if (!header) return res.status(401).json({ error: 'No token provided' });
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id).select('-passwordHash');
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
