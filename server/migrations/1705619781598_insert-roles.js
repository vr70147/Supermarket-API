/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO roles (name) VALUES ('admin');
    INSERT INTO roles (name) VALUES ('user');
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DELETE FROM roles WHERE name = 'admin';
    DELETE FROM roles WHERE name = 'user';
  `);
};
