/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE categories DROP COLUMN product_id;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE categories ADD COLUMN product_id INTEGER REFERENCES products(id);
  `);
};
