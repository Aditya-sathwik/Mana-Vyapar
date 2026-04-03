# Mana-Vyapar: Backend Engineering Documentation 🚀

This document details the completed backend modules, architecture, and API status for the Mana-Vyapar Merchant Hub. This documentation is intended for review by the Technical Lead.

## 🏗️ Architecture Stack
- **Node.js**: Event-driven runtime for high-concurrency merchants.
- **Express.js**: Lightweight and flexible REST API framework.
- **Design Pattern**: **Service-Controller-Route** pattern for strong separation of concerns and high testability.
- **Security**: **JWT (JSON Web Tokens)** for stateless, secure session management and authentication.
- **Error Handling**: Standardized `ApiError` and `ApiResponse` utilities ensuring consistent multi-platform integration.

---

## ✅ Completed Backend Modules

### 📂 1. High-Performance Category Engine (`/categories`)
The core of the digital storefront, optimized for deep hierarchy traversal.
- **Recursive Tree Logic**: Supports infinite levels of category nesting.
- **Optimized Traversal**: Specialized service for fetching entire nested hierarchies in a single database request.
- **Metadata Support**: Support for visual references (image URLs) and slugs for SEO-ready storefronts.

### 📒 2. Smart Khata Ledger API (`/khata`)
The digital bookkeeping backbone of the merchant experience.
- **Transaction Core**: Fully implemented logic for customer ledger balances (Credit/Debit tracking).
- **Merchant Isolation**: Data structures that ensure absolute privacy of ledger entries per store.
- **Real-time Recording**: Endpoints to capture and verify every monetary transaction.

### 📦 3. Multi-Category Product Service (`/products`)
Management system for the merchant's physical and digital goods.
- **Catalog Indexing**: Flexible CRUD system for products linked across different tree levels.
- **Pricing & Inventory**: Services to manage real-time price indexing and stock levels.
- **Attribute Management**: Support for brands, units, and descriptions.

### 👤 4. Identity & Access Management (`/users`)
The security layer for all merchant operations.
- **JWT Authentication**: Full implementation of login, registration, and session token renewal.
- **Route Guards**: Unified `auth` middleware for protecting sensitive business data.
- **Merchant Profiles**: Support for managing personal and store-wide security credentials.

### 🏢 5. Store Metadata Service (`/stores`)
Global configuration for the merchant's digital presence.
- **Profile Management**: Dynamic control over store branding, naming, and physical location data.
- **Owner Mapping**: Strict verification logic ensuring merchants can only access stores they own.

---

## 🛠️ Internal Utility Layer
- **Async Interceptors**: Unified `asyncHandler` to eliminate try-catch boilerplate.
- **Response Wrapper**: Standardized response format across all endpoints for frontend stability.
- **Auth Middlewares**: Modular access control for secure endpoint protection.

---

## 🛣️ API Endpoint Status (Quick Reference)

| Module | Key Endpoint | Functionality | Status |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST /api/v1/auth/login` | Merchant validation & JWT generation | ✅ STABLE |
| **Category** | `GET /api/v1/categories/tree/:sid` | Optimized nested tree retrieval | ✅ STABLE |
| **Khata** | `POST /api/v1/khata/:id/tx` | Processing ledger balances | ✅ STABLE |
| **Store** | `GET /api/v1/stores/me` | Fetching authenticated store profile | ✅ STABLE |
| **Product** | `GET /api/v1/products/:cid` | Catalog filtering by category | ✅ STABLE |

---

**Documentation prepared for: Technical Lead - Mana-Vyapar Engineering**
