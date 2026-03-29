# 🛍️ Mana-Vyapar Backend – Week 2 (Merchant & Product Module)

This module implements the **core business layer** of Mana-Vyapar, enabling merchants to manage their products and power fully dynamic, multi-tenant storefronts.

---

## 🚀 Week 2 Objective

Build a **merchant-driven commerce system** with:

* Merchant profile management
* Product CRUD (Create, Read, Update, Delete)
* Multi-tenant data isolation
* Public product APIs for storefront
* Dynamic store rendering support

---

## 🧠 Core Concept: Multi-Tenant Architecture

Mana-Vyapar is designed as a **multi-tenant platform**:

> Each merchant has an independent store with isolated data.

### 🔑 Golden Rule:

Every resource must include:

```js
merchantId
```

---

## 📁 Project Structure (Updated)

```bash
backend/
  controllers/
    authController.js
    merchantController.js
    productController.js
  models/
    User.js
    Merchant.js
    Product.js
  routes/
    authRoutes.js
    merchantRoutes.js
    productRoutes.js
  middleware/
    authMiddleware.js
  config/
    db.js
  server.js
```

---

## 🏢 Merchant Module

### 📌 Merchant Model

```js
{
  _id,
  userId,        // Reference to User
  storeName,
  phone,
  address,
  isActive,
  createdAt
}
```

---

### 🔗 Merchant Flow

1. User registers as `merchant`
2. Create merchant profile
3. Merchant logs in
4. Access merchant dashboard

---

### 📡 APIs

#### ➕ Create Merchant

```http
POST /api/merchant
```

#### 👁️ Get Merchant Profile

```http
GET /api/merchant/me
```

---

## 📦 Product Module

### 📌 Product Model

```js
{
  _id,
  merchantId,     // VERY IMPORTANT
  name,
  price,
  stock,
  image,
  createdAt
}
```

---

## 📡 Product APIs

### ➕ Add Product (Merchant Only)

```http
POST /api/products
```

---

### 📥 Get Merchant Products (Dashboard)

```http
GET /api/products/my
```

👉 Returns products of logged-in merchant

---

### ✏️ Update Product

```http
PUT /api/products/:id
```

---

### ❌ Delete Product

```http
DELETE /api/products/:id
```

---

### 🌐 Public Products API (Storefront)

```http
GET /api/products?merchantId=abc123
```

👉 Used by customer-facing frontend

---

## 🔐 Security & Data Isolation

### MUST FOLLOW:

* Every query filtered by:

```js
merchantId
```

* Merchant can:

  * Access ONLY their products
  * Cannot access other merchants' data

---

### Example Protection

```js
Product.find({
  merchantId: req.user.id
});
```

---

## 🌐 Dynamic Storefront Support

Each merchant has a unique store:

```bash
/store/:merchantId
```

---

### Example:

| Merchant | Store URL       |
| -------- | --------------- |
| A        | `/store/abc123` |
| B        | `/store/xyz789` |

---

### Frontend Flow:

1. Customer visits:

```
/store/abc123
```

2. Frontend calls:

```http
GET /api/products?merchantId=abc123
```

3. Products displayed dynamically

---

## 🎡 Future Support (Preview)

To support dynamic UI (carousel, banners):

### Store Config (Coming Later)

```js
{
  merchantId,
  bannerImages: [],
  featuredProducts: []
}
```

---

## 🧪 Testing Checklist

* [ ] Merchant profile created
* [ ] Merchant login works
* [ ] Add product works
* [ ] Fetch merchant products
* [ ] Update product works
* [ ] Delete product works
* [ ] Public API returns correct merchant products
* [ ] No cross-merchant data leak

---

## ⚠️ Important Notes

* `merchantId` is mandatory in all business data
* Do NOT mix merchant data
* Keep APIs simple and scalable
* No payment or WhatsApp logic yet

---

## 🎯 Week 2 Outcome

✅ Merchant dashboard backend ready
✅ Product management system complete
✅ Multi-tenant architecture implemented
✅ Dynamic storefront enabled

---

## 🚀 Next Phase (Week 3)

* Customer storefront frontend integration
* Cart system
* Order placement APIs

---
