/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE categories
    ADD COLUMN product_id INTEGER;
    ALTER TABLE categories
    ADD CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES products(id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE categories
    DROP COLUMN product_id;
  `);
};
