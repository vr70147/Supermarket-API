/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE orders
    ALTER COLUMN creditcard TYPE VARCHAR(300);
    ALTER TABLE orders
    DROP COLUMN dateoforder;
    ALTER TABLE orders
    DROP COLUMN total;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE orders
    ALTER COLUMN creditcard TYPE VARCHAR(16);
    ALTER TABLE orders
    ADD COLUMN dateoforder DATE NOT NULL DEFAULT CURRENT_DATE;
    ALTER TABLE orders
    ADD COLUMN total INTEGER NOT NULL DEFAULT 0;
  `);
};
