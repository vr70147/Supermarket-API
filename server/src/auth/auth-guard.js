const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
  console.log(req.headers);
  try {
    const token = req.header('Authorization');
    jwt.verify(token, process.env.JWT_KEY);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Auth failed!' });
  }
  next();
};

module.exports = { isAuth };
