/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE products ADD COLUMN brand VARCHAR(255) DEFAULT 'Unknown' NOT NULL; 
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE products DROP COLUMN brand;
  `);
};
