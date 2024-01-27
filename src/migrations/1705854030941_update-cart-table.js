/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE carts
    ADD COLUMN price INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE carts
    ADD COLUMN quantity INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE carts
    DROP COLUMN total;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE carts
    ADD COLUMN total INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE carts
    DROP COLUMN price;
    ALTER TABLE carts
    DROP COLUMN quantity;
  `);
};
