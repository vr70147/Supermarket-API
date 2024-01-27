/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TYPE role AS ENUM ('user', 'admin');
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TYPE role;`);
};
