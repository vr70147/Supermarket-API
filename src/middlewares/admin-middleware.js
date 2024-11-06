const pool = require('../pool');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkPermission = async (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).send('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).send('Token missing');
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).send('Invalid token');
    }

    // Check if user is admin
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND role = $2',
      [decoded.userId, 'admin']
    );
    if (!rows.length) {
      return res.status(403).send('Not authorized as admin');
    }

    // Attach user info to request and continue
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkPermission;
