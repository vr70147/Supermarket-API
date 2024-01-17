/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(
    `
    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      name VARCHAR(100) NOT NULL,
      description VARCHAR(400) NOT NULL,
      price INTEGER NOT NULL,
      address VARCHAR(200) NOT NULL,
      birthdate DATE NOT NULL
    );
  `
  );
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE products;`);
};
