const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');

class UserService {
  constructor(pool) {
    this.pool = pool;
  }

  static async loginUser({ email, password }) {
    const user = await this.find(email);
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
    const createToken = await this.addToken(refreshToken);
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

  static async find(pageNumber, pageSize) {
    const where = `WHERE role = 'user' AND WHERE email = 'raanan@gmail.com'`;
    const { rows } = await pool.query(
      `SELECT
      created_at, firstname, lastname, email, role, phone, address, birthdate
      FROM users
      ${where}
      ORDER BY "users"."id"
      LIMIT $2
      OFFSET (($1 - 1) * $2);
      `,
      [pageNumber, pageSize]
    );
    return toCamelCase(rows);
  }

  static async findById({ id }) {
    const { rows } = await pool.query(
      'SELECT created_at, role, email, firstname, lastname, phone, address, birthdate FROM users WHERE id = $1',
      [id]
    );
    return toCamelCase(rows)[0];
  }

  static async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (!rows) return res.status(404).send({ error: 'User not found' });
    return toCamelCase(rows)[0];
  }

  static async addRefreshToken(token) {
    const { rows } = await pool.query(
      'INSERT INTO tokens (token) VALUES ($1) RETURNING *',
      [token]
    );
    return rows;
  }

  static async addUser(body) {
    const { rows } = await pool.query(
      'INSERT INTO users (role, email, password, firstname, lastname, phone, personal_id, address, birthdate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING role, email, firstname, lastname, phone, address, birthdate',
      [
        body.role,
        body.email,
        body.password,
        body.firstname,
        body.lastname,
        body.phone,
        body.personal_id,
        body.address,
        body.birthdate,
      ]
    );
    return toCamelCase(rows)[0];
  }

  static async updateUser(id, body) {
    const { rows } = await pool.query(
      'UPDATE users SET email = $1, password = $2, firstname = $3, lastname = $4, phone = $5, personal_id = $6, address = $7, birthdate = $8 WHERE id = $9 RETURNING email, firstname, lastname, phone, address, birthdate',
      [
        body.email,
        body.password,
        body.firstname,
        body.lastname,
        body.phone,
        body.personal_id,
        body.address,
        body.birthdate,
        id,
      ]
    );
    return toCamelCase(rows)[0];
  }

  static async deleteUser(id) {
    const { rows } = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING email, firstname',
      [id]
    );
    return toCamelCase(rows)[0];
  }

  static async deleteToken(token) {
    const { rows } = await pool.query(
      'DELETE FROM tokens WHERE token = $1 RETURNING token',
      [token]
    );
    return rows;
  }
}

module.exports = new UserService(pool);
