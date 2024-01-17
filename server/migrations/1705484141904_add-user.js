/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(
    `
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      email VARCHAR(200) NOT NULL,
      password VARCHAR(250) NOT NULL,
      firstname VARCHAR(50) NOT NULL,
      lastname VARCHAR(50) NOT NULL,
      phone INTEGER NOT NULL,
      personalId INTEGER NOT NULL,
      address VARCHAR(200) NOT NULL,
      birthdate DATE NOT NULL
    );
    `
  );
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE users;`);
};
