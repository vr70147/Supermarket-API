/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE roles (
      id SERIAL PRIMARY KEY,
      role VARCHAR(30) NOT NULL,
      CONSTRAINT proper_role CHECK (role = 'admin' OR role = 'user')
    );
    CREATE TABLE users_roles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      role_id INTEGER REFERENCES roles(id)
    );
    ALTER TABLE users
    ADD COLUMN role_id INTEGER REFERENCES roles(id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(
    `
    DROP TABLE users_roles;
    DROP TABLE roles;
    `
  );
};
