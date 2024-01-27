/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE carts
    DROP COLUMN price;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE carts
    ADD COLUMN price INTEGER NOT NULL DEFAULT 0;
  `);
};
