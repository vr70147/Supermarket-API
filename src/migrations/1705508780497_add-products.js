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
      image VARCHAR(200)
    );
  `
  );
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE products;`);
};
