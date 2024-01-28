const pool = require('../pool');
const toCamelCase = require('../utils/to-camel-case');
const filterQuery = require('../utils/find-filter');
const CartsService = require('../carts/carts-service');
const bcrypt = require('bcrypt');
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
    if (!user) {
      throw new Error({ error: 'User not found' });
    }
    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      throw new Error({ error: 'Invalid password' });
    }
    const dataToSendToken = { userId: user.id, email: user.email };
    const accessToken = jwt.sign(
      dataToSendToken,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '24h',
      }
    );
    const refreshToken = jwt.sign(
      dataToSendToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const createToken = await this.pool.query(
      'INSERT INTO tokens (token) VALUES ($1) RETURNING *',
      [refreshToken]
    );
    if (!createToken) {
      throw new Error({ error: 'Failed to create token' });
    }
    const userId = user[0].id;
    const checkCartExists = await this.pool.query(
      `SELECT *
      FROM carts
      WHERE user_id = $1`,
      [userId]
    );
    if (checkCartExists.rows.length === 0) {
      await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING *', [
        userId,
      ]);
    }
    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async find(pageNumber, pageSize, where, columns, orderBy, sort) {
    const clientColumns = columns.toString();
    const query = await filterQuery({
      where: where,
      columns: clientColumns,
      table: 'users',
      orderBy: orderBy,
      pageNumber: pageNumber,
      pageSize: pageSize,
      sort: sort,
    });
    const { rows } = await this.pool.query(query);
    if (!rows) return null;
    return toCamelCase(rows);
  }

  async addUser(body) {
    let payload = {};
    for (const [key, value] of Object.entries(body)) {
      if (!value) throw new Error({ error: 'Missing parameters' });
      payload[key] = value;
    }
    //Check if user already exists
    const user = await this.find(
      null,
      null,
      { column: 'email', value: payload.email },
      ['email'],
      null,
      null
    );
    if (user) throw new Error({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
    if (refreshToken == null) {
      throw new Error({ error: 'Refresh token not provided' });
    }

    //check refresh token in db
    const checkRefreshToken = await UserService.pool.query(
      'SELECT token FROM tokens WHERE token = $1',
      [token]
    );

    if (checkRefreshToken.length == 0) {
      throw new Error({ error: 'Invalid refresh token' });
    }

    //Verify refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        throw new Error({ error: 'Invalid refresh token' });
      }
      const dataToSendToken = { userId: user.id, email: user.email };
      const accessToken = jwt.sign(
        dataToSendToken,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '24h',
        }
      );
      return { accessToken: accessToken };
    });
  }
}

module.exports = new UserService(pool);
