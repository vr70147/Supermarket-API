# <span style="color:#008B8B">Supermarket API</span>

### <span style="color:#008B8B">The Supermarket API is a RESTful API built with Node.js and PostgreSQL, providing endpoints for managing supermarket products, categories, users, carts and orders.</span>

## <span style="color:#008B8B">Table of Contents</span>

- Features
- Installation
- Usage
- Endpoints
- Technologies Used
- Contributing
- License

## <span style="color:#008B8B">Features</span>

- Product Management: Create, read, update, and delete supermarket products.
- Category Management: Manage categories for organizing products.
- User Management: Register users, authenticate, and manage user accounts.
- Order Management: Place orders, view order history, and manage orders.
- Security: Password hashing, authentication using JWT tokens.

## <span style="color:#008B8B">Installation</span>

To run the Supermarket API locally, follow these steps:

1. Clone this repository:

```bash
git clone https://github.com/vr70147/store.git
```

2. Navigate to the project directory:

```bash
cd store
```

3. Install dependencies:

```bash
npm install
```

4. Set up your PostgreSQL database and update the database configuration in index.js.

5. Run the database migrations:

```bash
   npm run migrate
```

6. Start the server:

```bash
   npm start
```

## <span style="color:#008B8B">Usage</span>

Once the server is running, you can interact with the API using HTTP requests to the provided endpoints. You can use tools like Postman or curl to send requests.

## Endpoints

### <span style="color:#008B8B">The Supermarket API provides the following endpoints:</span>

- /products: CRUD operations for supermarket products.
- /categories: CRUD operations for product categories.
- /carts: CRUD operations for carts
- /users: User registration, authentication, and account management.
- /orders: Place orders, view order history, and manage orders.

For detailed information about each endpoint, refer to the API documentation.

## <span style="color:#008B8B">Technologies Used</span>

- <b>Node.js:</b> JavaScript runtime for building server-side applications.
- <b>Express.js:</b> Web framework for Node.js.
- <b>PostgreSQL:</b> Relational database management system.
- <b>bcrypt.js:</b> Library for password hashing.
- <b>jsonwebtoken:</b> Library for generating JWT tokens.
- <b>Other Dependencies:</b> <b>pg</b> for PostgreSQL database interaction, <b>dotenv</b> for environment variable management, <b>morgan</b> for HTTP request logging.

## <span style="color:#008B8B">Contributing</span>

Contributions to the Supermarket API are welcome! If you have any ideas, suggestions, or bug fixes, please open an issue or submit a pull request.

## <span style="color:#008B8B">License</span>

This project is licensed under the MIT License.
