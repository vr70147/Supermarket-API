const pool = require('../pool');
const toCamelCase = require('../utils/to-camel-case');
const CartsService = require('../carts/carts-service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class UserService {
  constructor(pool) {
    this.pool = pool;
  }

  async loginUser(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error({ error: 'User not found' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
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
    const userId = user.id;
    const checkCartExists = await CartsService.checkCartExists(userId);
    if (!checkCartExists) {
      await CartsService.addCart(userId);
    }
    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async find(pageNumber, pageSize) {
    const { rows } = await this.pool.query(
      `SELECT
      created_at, firstname, lastname, email, role, phone, address, birthdate
      FROM users
      WHERE role = 'user'
      ORDER BY "users"."id"
      LIMIT $2
      OFFSET (($1 - 1) * $2);
      `,
      [pageNumber, pageSize]
    );
    return toCamelCase(rows);
  }

  async findById({ id }) {
    const { rows } = await pool.query(
      'SELECT created_at, role, email, firstname, lastname, phone, address, birthdate FROM users WHERE id = $1',
      [id]
    );
    return toCamelCase(rows)[0];
  }

  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (!rows) return res.status(404).send({ error: 'User not found' });
    return toCamelCase(rows)[0];
  }

  async addUser(body) {
    let payload = {};
    for (const [key, value] of Object.entries(body)) {
      if (!value) throw new Error({ error: 'Missing parameters' });
      payload[key] = value;
    }
    //Check if user already exists
    const user = await this.findByEmail(payload.email);
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
