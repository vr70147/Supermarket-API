/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(
    `
    CREATE TABLE carts (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      total INTEGER NOT NULL DEFAULT 0
      );
  `
  );
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE carts;`);
};
