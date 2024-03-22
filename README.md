# Supermarket API

## The Supermarket API is a RESTful API built with Node.js and PostgreSQL, providing endpoints for managing supermarket products, categories, users, and orders.

## Table of Contents

- Features
- Installation
- Usage
- Endpoints
- Technologies Used
- Contributing
- License

## Features

- Product Management: Create, read, update, and delete supermarket products.
- Category Management: Manage categories for organizing products.
- User Management: Register users, authenticate, and manage user accounts.
- Order Management: Place orders, view order history, and manage orders.
- Security: Password hashing, authentication using JWT tokens.

## Installation

To run the Supermarket API locally, follow these steps:

1. Clone this repository:

   bash

   git clone https://github.com/vr70147/store.git

2. Navigate to the project directory:

   bash

   cd store

3.Install dependencies:

    bash

    npm install

4. Set up your PostgreSQL database and update the database configuration in config.js.

5. Run the database migrations:

   bash

   npm run migrate

6. Start the server:

   bash

   npm start

## Usage

Once the server is running, you can interact with the API using HTTP requests to the provided endpoints. You can use tools like Postman or curl to send requests.
Endpoints

### The Supermarket API provides the following endpoints:

- /products: CRUD operations for supermarket products.
- /categories: CRUD operations for product categories.
- /carts: CRUD operations for carts
- /users: User registration, authentication, and account management.
- /orders: Place orders, view order history, and manage orders.

For detailed information about each endpoint, refer to the API documentation.

## Technologies Used

- Node.js: JavaScript runtime for building server-side applications.
- Express.js: Web framework for Node.js.
- PostgreSQL: Relational database management system.
- bcrypt.js: Library for password hashing.
- jsonwebtoken: Library for generating JWT tokens.
- Other Dependencies: pg for PostgreSQL database interaction, dotenv for environment variable management, morgan for HTTP request logging.

## Contributing

Contributions to the Supermarket API are welcome! If you have any ideas, suggestions, or bug fixes, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
