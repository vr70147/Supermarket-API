/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(
    `
    CREATE TABLE categories (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      name VARCHAR(100) NOT NULL
      );
  `
  );
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE categories;`);
};
