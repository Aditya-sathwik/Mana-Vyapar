import Link from 'next/link';

export function StoreFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-card pb-12 pt-16 sm:mt-32">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 sm:grid-cols-2 md:grid-cols-4">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link href="/store" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-display text-sm font-bold">M</span>
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Mana Store
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Premium products delivered with quality and trust. Powered by Mana-Vyapar.
          </p>
        </div>

        {/* Shop */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display font-semibold text-foreground">Shop</h4>
          <Link href="/store/products" className="text-sm text-muted-foreground hover:text-primary">All Products</Link>
          <Link href="/store/categories" className="text-sm text-muted-foreground hover:text-primary">Categories</Link>
          <Link href="/store/deals" className="text-sm text-muted-foreground hover:text-primary">Best Deals</Link>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display font-semibold text-foreground">Support</h4>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link>
          <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQs</Link>
          <Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary">Shipping Information</Link>
          <Link href="/returns" className="text-sm text-muted-foreground hover:text-primary">Returns & Exchanges</Link>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display font-semibold text-foreground">Legal</h4>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
        </div>
      </div>
      <div className="container mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-border px-6 pt-8 sm:flex-row">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Mana Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
