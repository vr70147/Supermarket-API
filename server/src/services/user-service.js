const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');

class UserService {
  static async find() {
    const { rows } = await pool.query('SELECT * FROM users;');
    return toCamelCase(rows);
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    return toCamelCase(rows)[0];
  }

  static async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    return toCamelCase(rows)[0];
  }

  static async addUser(body) {
    const { rows } = await pool.query(
      'INSERT INTO users (email, password, firstname, lastname, phone, personal_id, address, birthdate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
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
      'UPDATE users SET email = $1, password = $2, firstname = $3, lastname = $4, phone = $5, personal_id = $6, address = $7, birthdate = $8 WHERE id = $9 RETURNING *',
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
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );
    return toCamelCase(rows)[0];
  }

  static async login(email, password) {
    const user = await this.findByEmail(email);
  }
}

module.exports = UserService;
