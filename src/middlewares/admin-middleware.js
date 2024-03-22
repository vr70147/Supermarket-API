const pool = require('../pool');

const checkPermission = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND role = $2',
      [req.user.id, 'admin']
    );
    if (!rows.length) {
      return res.status(403).send('Not admin');
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkPermission;
