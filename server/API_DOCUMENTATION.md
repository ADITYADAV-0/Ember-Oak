# Ember & Oak API Documentation

Base URL: `http://localhost:5000/api` (Local) / `https://<your-backend>.onrender.com/api` (Production)

---

## 🔑 Authentication Endpoints (`/api/auth`)

### 1. Register User
- **POST** `/api/auth/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "customer"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "<jwt_token>",
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "customer", "loyaltyPoints": 0 }
  }
  ```

### 2. Login User
- **POST** `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "priya@example.com",
    "password": "password123"
  }
  ```
- **Response** (200 OK): Returns JWT token & User details.

### 3. Google OAuth Login/Signup
- **POST** `/api/auth/google`
- **Body**:
  ```json
  {
    "token": "<google_id_token>",
    "isStaff": false
  }
  ```
- **Response** (200 OK): Authenticates or auto-registers user and returns JWT.

### 4. Logout User
- **POST** `/api/auth/logout`
- **Response** (200 OK): Clears auth cookie.

### 5. Get Current User Profile
- **GET** `/api/auth/me`
- **Header**: `Authorization: Bearer <token>`
- **Response** (200 OK): Authenticated user profile.

---

## 🍽️ Menu Endpoints (`/api/menu`)

### 1. Get All Menu Items
- **GET** `/api/menu`
- **Query Params**: `category=Starters`, `search=duck`, `available=true`
- **Response** (200 OK): List of menu items.

### 2. Get Single Menu Item
- **GET** `/api/menu/:id`
- **Response** (200 OK): Single menu item details.

### 3. Create Menu Item (Staff / Admin Only)
- **POST** `/api/menu`
- **Header**: `Authorization: Bearer <token>` (Manager/Admin/Chef)
- **Body**:
  ```json
  {
    "name": "Truffle Fries",
    "category": "Starters",
    "price": 14,
    "description": "Hand-cut fries, truffle oil, parmesan, herbs",
    "available": true,
    "dietary": ["Vegetarian"]
  }
  ```

### 4. Get Categories
- **GET** `/api/menu/categories`
- **Response** (200 OK): Category list.

---

## 📦 Order Endpoints (`/api/orders`)

### 1. Place Order
- **POST** `/api/orders`
- **Body**:
  ```json
  {
    "tableNumber": 3,
    "customerId": "u001",
    "customerName": "Priya Sharma",
    "items": [
      { "menuItemId": "mi001", "name": "Burrata & Heirloom Tomato", "price": 18, "quantity": 1 }
    ],
    "total": 18,
    "type": "dine-in"
  }
  ```
- **Response** (201 Created): Order created and loyalty points awarded.

### 2. Get My Orders
- **GET** `/api/orders/my-orders`
- **Header**: `Authorization: Bearer <token>`

### 3. Get All Orders (Staff Only)
- **GET** `/api/orders`
- **Header**: `Authorization: Bearer <token>` (Staff Roles)

---

## 📅 Reservation Endpoints (`/api/reservations`)

### 1. Create Reservation
- **POST** `/api/reservations`
- **Body**:
  ```json
  {
    "customerName": "Priya Sharma",
    "customerEmail": "priya@example.com",
    "customerPhone": "+1 555-0199",
    "date": "2026-11-20",
    "time": "19:00",
    "partySize": 2
  }
  ```

### 2. Get My Reservations
- **GET** `/api/reservations/my-reservations?email=priya@example.com`

---

## 📊 Admin Endpoints (`/api/admin`)

### 1. Get Dashboard Metrics
- **GET** `/api/admin/overview`
- **Header**: `Authorization: Bearer <token>` (Manager/Admin)
- **Response** (200 OK): Order count, pending count, revenue, customer count.
