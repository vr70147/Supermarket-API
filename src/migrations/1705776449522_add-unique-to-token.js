/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`ALTER TABLE tokens ADD UNIQUE (token);`);
};

exports.down = (pgm) => {
  pgm.sql(`ALTER TABLE tokens DROP UNIQUE (token);`);
};
