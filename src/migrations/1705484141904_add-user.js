/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(
    `
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      email VARCHAR(200) NOT NULL UNIQUE,
      password VARCHAR(250) NOT NULL,
      firstname VARCHAR(50) NOT NULL,
      lastname VARCHAR(50) NOT NULL,
      phone VARCHAR(10) NOT NULL CHECK (LENGTH(phone) >= 9),
      personal_id VARCHAR(9) NOT NULL CHECK (LENGTH(personal_id) = 9),
      address VARCHAR(200) NOT NULL,
      birthdate DATE NOT NULL CHECK (birthdate < CURRENT_DATE - INTERVAL '18 years'),
      CONSTRAINT proper_email CHECK (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
    );
  `
  );
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE users;`);
};
