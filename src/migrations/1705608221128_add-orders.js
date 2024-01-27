/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(
    `
    CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      total INTEGER NOT NULL CHECK (total > 100),
      dateOfDelivery DATE NOT NULL,
      dateOfOrder DATE NOT NULL,
      creditCard INTEGER NOT NULL,
      address VARCHAR(200) NOT NULL,
      cart_id INTEGER REFERENCES carts(id)
    );
  `
  );
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE orders;`);
};
