# Mana-Vyapar Frontend Architecture

The frontend of Mana-Vyapar is designed with a **highly modular and decoupled architecture**. This ensures that the core SaaS (Software as a Service) application for Merchants remains completely isolated from the dynamic E-Commerce Storefront presented to their end-customers.

Because of this strict separation, either side of the platform can be heavily modified, refactored, or even deleted without breaking the other.

## Directory Isolation Overview

### 1. The Merchant SaaS Application (Core)
This is the command center where shop owners log in to manage their business, dynamic forms, ledgers (Khata), inventory, and website builder.
* **Routing:** `frontend/app/merchant/` and `frontend/app/admin/`
* **UI Components:** `frontend/components/merchant/` and `frontend/components/visuals/`
* **State Management:** `frontend/lib/store.ts` (Handles global SaaS state like active sidebar tabs, form builder states, and ledger scanner statuses).
* **Provider:** `frontend/components/providers/StoreProvider.tsx`

### 2. The Customer E-Commerce Storefront
This is the dynamic, customer-facing interface (`/store/[slug]`) generated for the end-consumer based on the merchant's configurations. It is entirely walled off from the core SaaS system.
* **Routing:** `frontend/app/store/`
    * Handles all public-facing routes like the dynamic block home page, product catalogs, carts, and customer authentication.
* **UI Components:** `frontend/components/storefront/`
    * Contains all unique aesthetics for the storefront, such as the 3D Hero molecule, product carousels, customizable navigation bars, and cart drawers.
* **State Management:** `frontend/redux/`
    * A completely separate Redux engine created specifically for customer sessions. It manages the storefront Cart `cartSlice.ts`, Customer products `productSlice.ts`, and Store metadata `storeSlice.ts`.
* **Provider:** `frontend/components/storefront/StoreProvider.tsx`
    * Wrap strictly the `/store` routes. It also handles dynamic CSS variable injection (`:root`, `.dark`) so that each merchant's custom branding applies without breaking global Tailwind defaults.

## Why Deleting the Storefront is Safe

If you decide to pivot the project to focus purely on the core B2B SaaS features (like Dynamic Forms and KHATA Ledgers) and strip out the e-commerce portion, you can safely remove the storefront directories:

```bash
# Safely removes the Customer Storefront layer
rm -rf frontend/app/store frontend/components/storefront frontend/redux
```

**Why it doesn't break the app:**
1. **No Shared Redux:** The merchant dashboard relies strictly on `frontend/lib/store.ts`. It does not rely on `frontend/redux`.
2. **No Overlapping Routes:** Next.js App Router isolates pages. Removing `/app/store` simply deletes those web URLs without affecting `/app/merchant`.
3. **No Mixed UI:** The merchant dashboard exclusively imports from `components/merchant/` and `components/ui/`, never from `components/storefront/`.

This modular approach ensures rapid feature development, bug isolation, and absolute architectural flexibility.
