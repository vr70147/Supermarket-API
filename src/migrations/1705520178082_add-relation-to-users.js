/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE users
    ADD COLUMN cart_id INTEGER;
    ALTER TABLE users
    ADD CONSTRAINT cart_id FOREIGN KEY (cart_id) REFERENCES carts(id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE users
    DROP COLUMN cart_id;
  `);
};
