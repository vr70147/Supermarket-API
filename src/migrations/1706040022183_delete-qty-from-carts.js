/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE carts DROP COLUMN product_id;
    ALTER TABLE carts DROP COLUMN quantity;
  `);
};

exports.down = (pgm) => {
  // eslint-disable-line no-unused-vars
  pgm.sql(`
    ALTER TABLE carts ADD COLUMN product_id INTEGER;
    ALTER TABLE carts ADD COLUMN quantity INTEGER NOT NULL DEFAULT 1;
  `);
};
