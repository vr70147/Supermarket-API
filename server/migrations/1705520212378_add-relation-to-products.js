/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE products
    ADD COLUMN category_id INTEGER;
    ALTER TABLE products
    ADD CONSTRAINT category_id FOREIGN KEY (category_id) REFERENCES categories(id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE products
    DROP COLUMN category_id;
  `);
};
