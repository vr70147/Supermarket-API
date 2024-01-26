/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE carts ADD UNIQUE (user_id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE carts DROP UNIQUE (user_id);
  `);
};
