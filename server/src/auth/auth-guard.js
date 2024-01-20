const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    jwt.verify(token, process.env.JWT_KEY);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Auth failed!' });
  }
};

module.exports = isAuth;
