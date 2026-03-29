Here’s a **clean, professional `README.md` for Week 1 (Auth System)** based on your progress 👇
You can directly paste this into your repo.

---

# 🔐 Mana-Vyapar Backend – Week 1 (Authentication System)

This module implements the **core authentication and authorization system** for the Mana-Vyapar platform. It supports multiple user roles and provides secure access using JWT.

---

## 🚀 Week 1 Objective

Build a solid backend foundation with:

* User Registration (Merchant & Customer)
* Secure Login (Email / Phone)
* JWT Authentication
* Role-Based Access Control (RBAC)
* Frontend Integration Ready APIs

---

## 🏗️ Tech Stack

* **Node.js** + **Express.js**
* **MongoDB** + **Mongoose**
* **JWT (jsonwebtoken)** for authentication
* **bcryptjs** for password hashing
* **dotenv** for environment configuration

---

## 📁 Project Structure

```bash
backend/
  config/
    db.js
  controllers/
    authController.js
  models/
    User.js
  routes/
    authRoutes.js
  middleware/
    authMiddleware.js
  server.js
```

---

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies

```bash
npm install
```

---

### 2️⃣ Environment Variables

Create a `.env` file in root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### 3️⃣ Run Server

```bash
npm run dev
```

---

## 👤 User Roles

| Role       | Description                        |
| ---------- | ---------------------------------- |
| `admin`    | Super Admin (manual creation only) |
| `merchant` | Business owner using platform      |
| `customer` | End user buying products           |

---

## 🔑 Authentication Flow

### 📝 Register

**Endpoint:**

```http
POST /api/auth/register
```

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "123456",
  "role": "merchant"
}
```

**Rules:**

* Either **email OR phone** is required
* Duplicate users are not allowed
* `admin` role cannot be assigned via API

---

### 🔐 Login

**Endpoint:**

```http
POST /api/auth/login
```

**Body:**

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

OR

```json
{
  "phone": "9876543210",
  "password": "123456"
}
```

---

### 🔑 Response

```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "_id": "...",
    "name": "...",
    "role": "merchant"
  }
}
```

---

## 🛡️ Middleware

### 🔒 Protect Routes

Validates JWT token:

```http
Authorization: Bearer <token>
```

---

### 🎯 Role-Based Access

Example:

```js
router.get("/admin", protect, authorize("admin"), handler);
```

---

## 🧪 Testing Checklist

* [x] Register merchant
* [x] Register customer
* [x] Prevent duplicate users
* [x] Login using email
* [x] Login using phone
* [x] JWT token generated
* [x] Protected routes working
* [x] Role-based access working

---

## 🔗 Frontend Integration

### Store Token

```js
localStorage.setItem("token", token);
```

---

### Send Token in Requests

```js
headers: {
  Authorization: `Bearer ${token}`
}
```

---

### Role-Based Routing

```js
if (user.role === "merchant") {
  navigate("/merchant-dashboard");
}
```

---

## ⚠️ Important Notes

* Admin users must be created manually in DB
* No payment or subscription logic included in Week 1
* OTP login can be added in future phases
* Keep system simple for MVP

---

## 🎯 Week 1 Outcome

✅ Fully working authentication system
✅ Role-based access control
✅ Backend ready for product & merchant modules
✅ Frontend connected with backend

---

## 🚀 Next Phase (Week 2)

* Product Management APIs
* Merchant Dashboard Integration
* Inventory System

---

<div align="center">
  Built with ⚡ to empower digital merchants
</div>

---

If you want, next I can give you:

👉 **Week 2 README (Products + Merchant APIs)**
👉 Or directly **complete product module code**

Just say 👍
