const jwt = require('jsonwebtoken');
const UserService = require('../services/user-service');

const isAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({ message: 'Auth failed!' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token!' });
    req.user = user;
    next();
  });
};

module.exports = isAuth;
