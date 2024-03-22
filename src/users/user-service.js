const pool = require('../pool');
const toCamelCase = require('../utils/to-camel-case');
const filterQuery = require('../utils/find-filter');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class UserService {
  constructor(pool) {
    this.pool = pool;
  }

  async loginUser(email, password) {
    const user = await this.find(
      undefined,
      undefined,
      { column: 'email', value: email },
      ['id', 'email', 'password'],
      undefined,
      undefined
    );
    if (!user) throw new Error('User not found');

    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) throw new Error('Invalid password');

    const dataToSendToken = { userId: user[0].id, email: user[0].email };
    const accessToken = jwt.sign(
      dataToSendToken,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '24h' }
    );
    const refreshToken = jwt.sign(
      dataToSendToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const createToken = await this.pool.query(
      'INSERT INTO tokens (token) VALUES ($1) RETURNING *',
      [refreshToken]
    );
    if (!createToken) throw new Error('Failed to create token');

    const userId = user[0].id;
    const checkCartExists = await this.pool.query(
      'SELECT * FROM carts WHERE user_id = $1',
      [userId]
    );
    if (checkCartExists.rows.length === 0)
      await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING *', [
        userId,
      ]);

    return { accessToken, refreshToken };
  }

  async find(pageNumber, pageSize, where, columns, orderBy, sort) {
    const query = await filterQuery({
      where,
      columns,
      table: 'users',
      orderBy,
      pageNumber,
      pageSize,
      sort,
    });
    const { rows } = await this.pool.query(query);
    return rows ? toCamelCase(rows) : null;
  }

  async addUser(body) {
    const payload = {};
    for (const [key, value] of Object.entries(body)) {
      if (!value) throw new Error('Missing parameters');
      payload[key] = value;
    }

    const user = await this.find(
      null,
      null,
      { column: 'email', value: payload.email },
      ['email'],
      null,
      null
    );
    if (user) throw new Error('User already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    const { rows } = await this.pool.query(
      'INSERT INTO users (role, email, password, firstname, lastname, phone, personal_id, address, birthdate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING role, email, firstname, lastname, phone, address, birthdate',
      [
        payload.role,
        payload.email,
        hashedPassword,
        payload.firstname,
        payload.lastname,
        payload.phone,
        payload.personal_id,
        payload.address,
        payload.birthdate,
      ]
    );

    return toCamelCase(rows)[0];
  }

  async checkRefreshToken(refreshToken) {
    if (!refreshToken) throw new Error('Refresh token not provided');

    const checkRefreshToken = await UserService.pool.query(
      'SELECT token FROM tokens WHERE token = $1',
      [refreshToken]
    );
    if (checkRefreshToken.length === 0)
      throw new Error('Invalid refresh token');

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) throw new Error('Invalid refresh token');

      const dataToSendToken = { userId: user.id, email: user.email };
      const accessToken = jwt.sign(
        dataToSendToken,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '24h' }
      );
      return { accessToken };
    });
  }
}

module.exports = new UserService(pool);
