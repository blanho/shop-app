### Quick Demo: I couldn't upload the large file to github. Feel free to download repo to experience on your own
![](https://github.com/blanho/demo/blob/main/demo.gif)
### Features

- **Cloudinary** Streamline media management and improve user experience by automatically delivering images and videos.
- **MongoDB** MongoDB is a document-oriented NoSQL database used for high volume data storage.
- **Mongoose** Mongoose is an Object Data Modeling library. It provides schema validation and manages relationships between data.
- **Express.js** Express.js, or simply Express, is a back end web application framework for building RESTful APIs with Node.js,.
- **React.js** React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library for building user interfaces based on components.
- **JWT** JWT, or JSON Web Token, is an open standard used to share information between two parties securely.
- **Google Auth Library** This is Google's officially supported node.js client library for using OAuth 2.0 authorization and authentication with Google APIs.
- **Socket.IO** Bidirectional and low-latency communication for every platform · In most cases, the connection will be established with WebSocket.
- **REST API** an application programming interface (API or web API) that conforms to the design principles of the Representational State Transfer (RST) architectural style.
- **Stripe** Stripe is a suite of APIs powering online payment processing and commerce solutions for internet businesses of all sizes.
- **Nodemailer** is a module for Node.js applications to allow easy as cake email sending.

## ❯ Table of Contents

- [Getting Started](#-getting-started)
- [Scripts and Tasks](#-scripts-and-tasks)
- [API Routes](#-api-routes)
- [License](#-license)

## ❯ Getting Started

### Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

Install [Node.js and NPM](https://nodejs.org/en/download/)

Install yarn globally

```bash
yarn global add yarn
```

Install a MongoDB database.

### Step 2: Create new Project

Fork or download this project. Configure your package.json for your new project.

Then copy the `.env.example` file and rename it to `.env`. In this file you have to add your database connection information.

`.env.example`

```bash
PORT = 5000

NODE_ENV = DEVELOPMENT

MONGODB_URI =

FRONTEND_URL = "http://localhost:3000"

JWT_SECRET = 123456

JWT_EXPIRE_TIME = 7d

COOKIE_EXPIRE_TIME = 7

SMTP_HOST = s

SMTP_PORT =

SMTP_USER =

SMTP_PASS =

SMTP_FROM_EMAIL =

SMTP_FROM_NAME =

STRIPE_SECRET_KEY =

STRIPE_API_KEY =

CLOUDINARY_CLOUD_NAME =

CLOUDINARY_API_KEY =

CLOUDINARY_API_SECRET =

SENDER_EMAIL_ADDRESS =

OAUTH_CLIENT_ID =

OAUTH_CLIENT_SECRET =

OAUTH_REFRESH_TOKEN =
```

Create a new database with the name you have in your `.env` file.

## ❯ Scripts and Tasks

### Install

- Install all dependencies with `yarn install`
- In root folder: Install all dependencies to server
  - `yarn install`
  - `yarn run seed`
  - `yarn run dev`
- In frontend folder: Install all dependencies to frontend
  - `cd frontend`
  - `yarn install`
  - `yarn run start`

### Running in dev mode

- Run `yarn run dev` to start listening to serve the app.
- The server address will be displayed to you as `http://localhost:5000`

### Database Seeding

- Run `yarn run seed` to seed your seeds into the database.

## ❯ API Routes

The route prefix is `/api/v1` by default, but you can change this in `app.js`.

| Route                                   | Description             |
| --------------------------------------- | ----------------------- |
| **[POST] /api/v1/register**             | Register User           |
| **[POST] /api/v1/password/forgot**      | Forgot password         |
| **[PUT] /api/v1/password/reset/token**  | Reset password          |
| **[POST] /api/v1/login**                | Login user              |
| **[GET] /api/v1/logout**                | Logout out              |
| **[GET] /api/v1/me**                    | Get user                |
| **[GET] /api/v1/admin/users**           | Get all users by admin  |
| **[GET] /api/v1/admin/:id**             | Get user id by admin    |
| **[PUT] /api/v1/admin/:id**             | Update user id by admin |
| **[DELETE] /api/v1/admin/:id**          | Delete user id by admin |
| **[PUT] /api/v1/me/update**             | Update profile user     |
| **[PUT] /api/v1/password/update**       | Update password         |
| **[GET] /api/v1/products**              | Get all products        |
| **[GET] /api/v1/products/:id**          | Get product by Id       |
| **[PUT] /api/v1/admin/products/:id**    | Update product by Id    |
| **[DELETE] /api/v1/admin/products/:id** | Delete product by Id    |
| **[POST] /api/v1/admin/products/new**   | Post product            |
| **[POST] /api/v1/orders/new**           | Create New Order        |
| **[GET] /api/v1/orders/:id**            | Get order by Id         |
| **[GET] /api/v1/orders/me**             | Get order oneself       |
| **[GET] /api/v1/admin/orders**          | Get all orders          |
| **[PUT] /api/v1/admin/orders/:id**      | Update Order By Id      |
| **[DELETE] /api/v1/admin/orders/:id**   | Delete Order By Id      |
| **[Post] /api/v1/reviews**              | Post Review             |
| **[GET] /api/v1/reviews**               | Get all reviews         |
| **[DELETE] /api/v1/reviews?productId=** | Delete Review           |

````

### 3. Run the seeder

The last step is the easiest, just hit the following command in your terminal, but be sure you are in the projects root folder.

```bash
yarn run seed
````

#### CLI Interface

| Command           | Description        | Directory |
| ----------------- | ------------------ | --------- |
| `yarn run seed`   | Run all seeds      | root      |
| `yarn run start`  | Run in server mode | root      |
| `yarn run dev"`   | Run in dev mode    | root      |
| `yarn run start"` | Run in client mode | frontend  |

#### License

Inspired by

- Ho Bao Lan
- John-Smilga
- Ghulam Abbas
