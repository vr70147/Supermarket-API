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

  // User Management Methods

  /**
   * Adds a new user to the database.
   * @param {Object} body - User details to add.
   * @returns {Object} - The added user details.
   */
  async addUser(body) {
    try {
      this.validateAddUserPayload(body);

      const userExists = await this.findUserByEmail(body.email);
      if (userExists) throw new Error('User already exists');

      const hashedPassword = await bcrypt.hash(body.password, 10);

      const { rows } = await this.pool.query(
        `INSERT INTO users (role, email, password, firstname, lastname, phone, personal_id, address, birthdate) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING role, email, firstname, lastname, phone, address, birthdate`,
        [
          body.role,
          body.email,
          hashedPassword,
          body.firstname,
          body.lastname,
          body.phone,
          body.personal_id,
          body.address,
          body.birthdate,
        ]
      );

      return toCamelCase(rows)[0];
    } catch (error) {
      throw new Error(`Add user failed: ${error.message}`);
    }
  }

  /**
   * Updates an existing user's information.
   * @param {string} id - The user ID.
   * @param {Object} body - Updated user details.
   * @returns {Object} - The updated user details.
   */
  async updateUser(id, body) {
    try {
      const hashedPassword = body.password
        ? await bcrypt.hash(body.password, 10)
        : undefined;
      const updateFields = [
        body.email,
        hashedPassword,
        body.firstname,
        body.lastname,
        body.phone,
        body.personal_id,
        body.address,
        body.birthdate,
        id,
      ];

      const { rows } = await this.pool.query(
        `UPDATE users SET email = $1, password = COALESCE($2, password), firstname = $3, lastname = $4, phone = $5, personal_id = $6, address = $7, birthdate = $8 WHERE id = $9 RETURNING email, firstname, lastname, phone, address, birthdate`,
        updateFields
      );

      return rows.length > 0 ? toCamelCase(rows)[0] : null;
    } catch (error) {
      throw new Error(`Update user failed: ${error.message}`);
    }
  }

  /**
   * Deletes a user from the database.
   * @param {string} id - The user ID to delete.
   * @returns {Object|null} - The deleted user details, or null if not found.
   */
  async deleteUser(id) {
    try {
      const { rows } = await this.pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING email, firstname, lastname',
        [id]
      );
      return rows.length > 0 ? toCamelCase(rows)[0] : null;
    } catch (error) {
      throw new Error(`Delete user failed: ${error.message}`);
    }
  }

  /**
   * Finds a user by email.
   * @param {string} email - The user's email address.
   * @returns {Object|null} - The user details, or null if not found.
   */
  async findUserByEmail(email) {
    const users = await this.find({
      where: { column: 'email', value: email },
      columns: ['id', 'email', 'password'],
    });
    return users.length > 0 ? users[0] : null;
  }

  /**
   * Ensures that a user has a cart created.
   * @param {string} userId - The user ID.
   */
  async ensureUserCartExists(userId) {
    const { rows } = await this.pool.query(
      'SELECT * FROM carts WHERE user_id = $1',
      [userId]
    );
    if (rows.length === 0) {
      await this.pool.query('INSERT INTO carts (user_id) VALUES ($1)', [
        userId,
      ]);
    }
  }

  /**
   * Finds users based on specific conditions.
   * @param {Object} where - Condition to find users.
   * @param {Array} columns - Columns to select.
   * @param {Object} options - Additional query options.
   * @returns {Array} - List of users.
   */
  async find(pageNumber, pageSize, where, columns = ['*'], orderBy, sort) {
    try {
      const options = {
        pageNumber,
        pageSize,
        orderBy,
        sort,
      };

      // Ensure valid columns are provided or default to '*'
      const { query, values } = await filterQuery({
        where: where && where.column ? where : undefined,
        columns: Array.isArray(columns) && columns.length > 0 ? columns : ['*'],
        table: 'users',
        ...options,
      });

      const { rows } = await this.pool.query(
        query,
        values.length > 0 ? values : []
      );
      return rows ? toCamelCase(rows) : [];
    } catch (error) {
      throw new Error(`Find operation failed: ${error.message}`);
    }
  }

  // Authentication and Token Management Methods

  /**
   * Logs in a user by validating their credentials.
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @returns {Object} - Access and refresh tokens.
   */
  async loginUser(email, password) {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) throw new Error('User not found');

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) throw new Error('Invalid password');

      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      await this.storeRefreshToken(refreshToken);
      await this.ensureUserCartExists(user.id);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Checks if a refresh token is valid and generates a new access token.
   * @param {string} refreshToken - The refresh token.
   * @returns {string} - A new access token.
   */
  async checkRefreshToken(refreshToken) {
    if (!refreshToken) throw new Error('Refresh token not provided');

    try {
      const tokenExists = await this.pool.query(
        'SELECT token FROM tokens WHERE token = $1',
        [refreshToken]
      );
      if (tokenExists.rows.length === 0)
        throw new Error('Invalid refresh token');

      const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      return this.generateAccessToken(user);
    } catch (error) {
      throw new Error(`Refresh token check failed: ${error.message}`);
    }
  }

  /**
   * Generates an access token for a user.
   * @param {Object} user - User details.
   * @returns {string} - The access token.
   */
  generateAccessToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '24h' }
    );
  }

  /**
   * Generates a refresh token for a user.
   * @param {Object} user - User details.
   * @returns {string} - The refresh token.
   */
  generateRefreshToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET
    );
  }

  /**
   * Stores a refresh token in the database.
   * @param {string} refreshToken - The refresh token to store.
   */
  async storeRefreshToken(refreshToken) {
    const result = await this.pool.query(
      'INSERT INTO tokens (token) VALUES ($1) RETURNING *',
      [refreshToken]
    );
    if (!result) throw new Error('Failed to create token');
  }

  /**
   * Validates the user payload for adding a new user.
   * @param {Object} body - The user details to validate.
   */
  validateAddUserPayload(body) {
    const requiredFields = [
      'role',
      'email',
      'password',
      'firstname',
      'lastname',
      'phone',
      'personal_id',
      'address',
      'birthdate',
    ];
    requiredFields.forEach((field) => {
      if (!body[field]) throw new Error(`Missing parameter: ${field}`);
    });
  }
}

module.exports = new UserService(pool);
