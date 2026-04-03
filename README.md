# Mana-Vyapar (Merchant Hub) 🚀

A premium, AI-powered digital storefront and business management solution designed for local merchants.

## 📱 Project Status Overview

| Feature Category | Development Status | Key Highlights |
| :--- | :--- | :--- |
| **Category Management** | ✅ Completed | Recursive Trees, Theme-Aware, Scrollers |
| **Smart Khata** | 🟠 UI Ready | Transaction Ledger, Private Bookkeeping |
| **AI Product Scan** | 🟠 UI Ready | Real-time Camera HUD, AI Parsing Mockups |
| **Merchant Dashboard** | 🟠 UI Ready | High-level metrics, Quick Actions |
| **Store Control** | 🟠 UI Ready | Basic store settings & metadata |
| **Customer Web-App** | 🔴 Pending | Public-facing storefront generation |

---

## 🛠️ Completed Features in Detail

### 1. Advanced Category Engine
The most developed module in the hub, providing a sophisticated way to organize inventory.
- **Recursive Tree Hierarchy**: Support for infinite levels of sub-categories.
- **Visual Gaps & Guides**: Precise indentation and vertical spacing for clear readability.
- **Smart Scrollers**: Optimized for large folder structures (Vertical + Horizontal scrolling).
- **Theme-Adaptive UI**: Perfectly calibrated for both **Light** and **Dark** modes with no hardcoded colors.
- **Classification CRUD**: Full Create, Update, and Delete support with parent category context.

### 2. Smart Khata (Digital Ledger)
- **Status: UI Ready, Integration Pending**
- **Details:**
  - Modern ledger interface for tracking credit/debit.
  - Digital bookkeeping UI (Backend sync in progress).

### 3. AI Product Scanner (Intelligence Feed)
- **Chitti AI Lens**: Real-time camera interface using `react-webcam`.
- **HUD Interface**: Animated scan lines and viewfinder brackets for a premium feel.
- **confidence Metadata**: UI distinction between high-confidence and low-confidence (Verify Manually) scans.

### 4. Merchant Infrastructure
- **Status: UI Ready, Integration Pending**
- **Details:**
  - **Auth Flows**: Frontend logic for login and user sessions.
  - **Global Sidebar**: Dynamic navigation with search & collapse functionality.
  - **Merchant Dashboard**: High-level visual metrics (Mock data).

---

## ⏳ Pending Features (Roadmap)

### 📈 Intelligence & Analytics
- **Live Sales Data**: Converting Khata entries into visual charts and growth metrics.
- **Stock Predictive Alerts**: Notifying merchants when specific categories are running low.
- **Customer Insights Prediction**: AI-driven analysis of buying patterns to predict future demand and trends.

### 🌍 Digitization & Sales
- **Website Control**: A "One-Click" toggle to generate a public customer web-app from current categories/products.
- **Order Management**: Tracking customer orders from the web-app to delivery.
- **Smart Search**: Globally searching across categories, products, and ledger entries.

### ⚙️ Operations
- **System Sync**: Real-time status alerts for server latency and sync health.
- **Billing & Subscription**: Tier-based access for premium merchant features.

## 🛠️ Backend & API Architecture
The backend is powered by a high-performance **Node.js/Express** micro-service architecture, focused on data consistency and rapid response times.

### ⚙️ Completed API Modules
- **Category API**: Recursive tree-traversal logic for multi-level nested navigation. Supports fetching the entire hierarchy in a single optimized request.
- **Khata Ledger API**: Robust transaction recording with customer-linked ledger balances.
- **Product Indexer**: CRUD service for managing catalog metadata, pricing, and stock levels.
- **Merchant Identity API**: Secure JWT-based authentication with protected route middleware and session handling.
- **Store Configuration Service**: Global management of merchant store profiles and storefront settings.

### 🛡️ Core Infrastructure
- **Middleware Layers**: Unified error handling, body validation, and auth guards.
- **Scalable Service Pattern**: Separation of concerns between Controllers, Services, and Database Models.
- **Standardized Response Schema**: Consistent error and success payloads for predictable frontend consumption.

---

## 🚀 How to Run

### Frontend
```bash
cd frontend
npm run dev
```

### Backend
```bash
cd backend
npm run dev
```
