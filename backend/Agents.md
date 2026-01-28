# 📦 Mana Vyapar (SaaS)
> Digitalizing the Indian Retail Heartland: From Handwritten 'Chittis' to Digital Khata.

## 🚀 Project Overview
Mana Vyapar is a B2B Multi-tenant SaaS for Kirana and Hardware stores. 
It uses Vision AI to convert handwritten bills into digital inventory and manages customer credit (Khata).

## 🛠 Tech Stack
- **Runtime:** Node.js (ESM)
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose) + Docker
- **Frontend:** Next.js (v0.dev generated) + Tailwind CSS
- **AI:** OpenAI GPT-4o Vision (for Chitti scanning)
- **Architecture:** Controller-Service-Model (CSM) pattern.

## 📂 Project Structure
- `/backend`: Node.js API
  - `/models`: Mongoose schemas (Merchant, Product, Order, Khata)
  - `/controllers`: Request logic
  - `/middleware`: Auth & Subscription gates
  - `/services`: Vision AI & WhatsApp integrations
- `/frontend`: Next.js web application
- `/docker`: Database & Redis configurations




# 🤖 AI Agent Instructions

## 🎭 Your Persona
You are a Senior MERN Stack Architect on an Apple M4 Mac. Your code must be high-performance, clean, and follow ESM (ECMAScript Modules) standards.

## 📜 Coding Rules for Mana Vyapar
1. **Modules:** Always use `import/export`. Never use `require`.
2. **Naming:** - Files: `camelCase.js` (e.g., `userController.js`).
   - Models: `PascalCase.js` (e.g., `Merchant.js`).
3. **Database:** - Use Mongoose for all MongoDB interactions.
   - Always include `{ timestamps: true }` in schemas.
   - Use `.populate()` for cross-model relationships (e.g., Order to Merchant).
4. **Error Handling:** Use a centralized `errorMiddleware`. Never leave a `catch(e)` block empty.
5. **Multi-tenancy:** Every query must filter by `merchantId` to ensure data isolation.

## 🚀 Environment Context
- **OS:** macOS (Silicon M4).
- **Tooling:** Use `npm` for package management.
- **Database:** Local MongoDB is running inside a Docker container on port `27017`.

## 🛑 Boundaries
- Do not add new NPM packages without asking.
- Do not modify `.env` files directly; suggest the variables instead.
- Before creating a new Model, check if a similar one exists in `/backend/models`.