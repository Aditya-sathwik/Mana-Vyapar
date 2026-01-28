# Task: Merchant Dashboard UI Implementation

## 🎯 Goal
Build a premium, high-performance Merchant Dashboard for Mana Vyapar using Next.js, Tailwind CSS, and Framer Motion.

## 🎨 Design Identity: "Fluid Merchandise"
- **Geometry:** 24px-32px Rounded Corners (Soft/Modern).
- **Colors:** Obsidian (#0F172A), Slate-900, Emerald-500 (Primary), Zinc-400 (Secondary).
- **Typography:** Outfit (Display), Inter (Body).
- **Motion:** Staggered entry reveals, spring-based hover states.

## 🛠 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Icons:** Lucide React

## 📅 Phases

### Phase 1: Foundation (Current)
- [ ] Configure Tailwind & Design Tokens
- [ ] Setup Global Layers & Typography
- [ ] Create Reusable `Button`, `Card`, `Input` primitives

### Phase 2: Layout Shell
- [ ] Implement `Sidebar` (Floating Navigation)
- [ ] Implement `TopBar` (User Profile & Breadcrumbs)
- [ ] Setup Dashboard Content Grid

### Phase 3: Domain Components
- [ ] `StatCard` (Inventory/Khata KPIs)
- [ ] `InventoryList` (with stock status badges)
- [ ] `KhataQuickView` (Recent transactions)

### Phase 4: Integration
- [ ] API Client setup (Axios/Fetch)
- [ ] Auth Hook (checking existing cookies)
- [ ] Data hydration for Inventory & Khata

## 🚦 Verification
- [ ] Lighthouse Performance Score > 95
- [ ] Responsive checked (Mobile/Tablet/Desktop)
- [ ] Accessibility: Aria-labels & Keyboard Navigation
