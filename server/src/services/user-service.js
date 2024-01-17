const pool = require('../pool');
const toCamelCase = require('./utils/to-camel-case');

class UserService {
  static async find() {
    const { rows } = await pool.query('SELECT * FROM users;');
    return toCamelCase(rows);
  }

  static async createUser(body) {
    const { rows } = await pool.query(
      'INSERT INTO users (email, password, firstname, lastname, phone, personalId, address, birthdate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [
        body.email,
        body.password,
        body.firstname,
        body.lastname,
        body.phone,
        body.personalId,
        body.address,
        body.birthdate,
      ]
    );
    return toCamelCase(rows)[0];
  }
}

module.exports = UserService;
