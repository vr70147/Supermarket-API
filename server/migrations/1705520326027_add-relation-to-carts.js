/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE carts
    ADD COLUMN user_id INTEGER,
    ADD COLUMN product_id INTEGER;
    ALTER TABLE carts
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES users(id),
    ADD CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES products(id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE carts
    DROP COLUMN user_id;
    DROP COLUMN product_id;
  `);
};
