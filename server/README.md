# Ember & Oak - Production-Ready Backend API

Enterprise-grade Node.js + Express + MongoDB Atlas backend for **Ember & Oak**, a luxury farm-to-table restaurant application featuring JWT Authentication, Google OAuth 2.0, Role-Based Access Control (RBAC), and automated data seeding.

---

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5)
- **Database**: MongoDB Atlas / Mongoose (v9)
- **Authentication**: JWT (JSON Web Tokens) & Google OAuth (`google-auth-library`)
- **Security**: Helmet, CORS, Express Rate Limit, bcryptjs
- **Validation**: express-validator
- **Utilities**: Morgan (HTTP logger), Compression, Cookie-Parser, dotenv

---

## 📁 Directory Architecture (MVC)

```
server/
├── config/
│   ├── db.js                 # MongoDB connection logic
│   └── googleAuth.js         # Google OAuth ID token verification
├── constants/
│   ├── roles.js              # User roles (customer, waiter, chef, host, manager, admin)
│   └── status.js             # Order, reservation, and table status enums
├── controllers/              # Request handlers (Auth, User, Menu, Order, Reservation, Table, Loyalty, Admin)
├── middleware/               # Auth protection, RBAC, Error handling, Validation, Rate limiters
├── models/                   # Mongoose schemas (User, MenuItem, Category, Order, Reservation, Table, Loyalty, Settings)
├── routes/                   # RESTful API routers
├── services/                 # Business logic layer
├── utils/
│   ├── jwt.js                # JWT sign & cookie helpers
│   ├── responseHandler.js    # Uniform API JSON formatter
│   └── seed.js               # Database seeder script
├── validators/               # Input validation chains
├── .env.example              # Environment variables template
├── app.js                    # Express app initialization
├── server.js                 # HTTP listener entrypoint
├── API_DOCUMENTATION.md      # Detailed API Endpoints specification
├── DEPLOYMENT.md             # Render, Netlify & Atlas deployment guide
└── package.json              # Project dependencies & scripts
```

---

## ⚙️ Quick Start & Local Setup

### 1. Installation

Navigate into the server directory and install dependencies:

```bash
cd server
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update your `.env` with appropriate values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ember_oak?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_ember_oak_2026_change_in_production
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
CLIENT_URL=http://localhost:5173
```

### 3. Database Seeding

Populate MongoDB Atlas with Ember & Oak initial categories, menu items, users, and tables:

```bash
npm run seed
```

### 4. Running Development Server

Start the development server with live reload:

```bash
npm run dev
```

The API will be available at `http://localhost:5000` (or configured `PORT`).

---

## 🔒 Security & Best Practices

- **Role-Based Access Control**: Enforces permissions for `customer`, `waiter`, `chef`, `host`, `manager`, and `admin`.
- **JWT Protection**: Secure tokens delivered via HTTP-only cookies or `Authorization: Bearer <token>` headers.
- **Input Validation**: `express-validator` blocks invalid client payloads.
- **Rate Limiting**: Protects against brute-force attacks (`20 req/hr` on auth endpoints, `200 req/15min` on general API).
- **Helmet Headers**: Configures security HTTP headers against XSS and clickjacking.

---

## 📚 API & Deployment Documentation

- Detailed REST API specification: [API_DOCUMENTATION.md](file:///d:/ember-oak/server/API_DOCUMENTATION.md)
- Step-by-step production deployment guide: [DEPLOYMENT.md](file:///d:/ember-oak/server/DEPLOYMENT.md)
