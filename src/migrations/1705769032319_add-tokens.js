/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE tokens (
      id SERIAL PRIMARY KEY,
      token TEXT NOT NULL
      );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE tokens;`);
};
