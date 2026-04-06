'use client';

import { useStorefrontSelector } from '@/redux/hooks';
import Link from 'next/link';
import { ShoppingCart, User, Home, LayoutGrid, ClipboardList, Search, Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function StorefrontBottomNav() {
  const { metadata } = useStorefrontSelector((state: any) => state.store);
  const { totalQuantity } = useStorefrontSelector((state: any) => state.cart);
  const pathname = usePathname();

  if (!metadata) return null;

  const navLinks = [
    { title: 'HOME', href: `/store/${metadata.slug}`, icon: Home },
    { title: 'BROWSE', href: `/store/${metadata.slug}/categories`, icon: LayoutGrid },
    { title: 'WISHLIST', href: `/store/${metadata.slug}/wishlist`, icon: Heart },
    { title: 'BAG', href: `/store/${metadata.slug}/cart`, icon: ShoppingBag },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md md:hidden pointer-events-none">
      <div className="relative pointer-events-auto">
          {/* Elite Mini Branding Hub */}
          <div className="absolute left-2 -top-1 w-12 h-12 bg-black rounded-2xl flex items-center justify-center p-2 border-2 border-white/20 shadow-2xl z-[105] rotate-6 transition-transform hover:rotate-0">
              <div className="text-white font-black text-lg italic uppercase leading-none">N</div>
          </div>

          <nav className="flex items-center justify-between h-18 bg-[var(--sf-bg)]/80 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-[24px] px-2 pl-16 py-2 overflow-hidden ring-1 ring-white/5 mx-auto">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.title === 'BAG' && pathname.includes('/cart'));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center flex-1 h-full py-1 relative group"
                >
                  {isActive && (
                      <motion.div
                          layoutId="nav-pill-active"
                          className="absolute inset-x-1.5 inset-y-1.5 bg-white/5 rounded-[18px] border border-white/10 shadow-inner"
                      />
                  )}
                  
                  <div className={cn(
                    "flex flex-col items-center justify-center relative z-10 transition-all duration-300",
                    isActive ? "text-[var(--sf-accent)] scale-110" : "text-[var(--sf-text-muted)] group-hover:text-[var(--sf-text)]"
                  )}>
                    <item.icon size={18} strokeWidth={isActive ? 3 : 2} className="mb-1" />
                    <span className={cn(
                        "text-[8px] font-black tracking-[0.2em] transition-all leading-none",
                        isActive ? "opacity-100" : "opacity-40"
                    )}>
                        {item.title}
                    </span>
                  </div>

                  {item.title === 'BAG' && totalQuantity > 0 && (
                      <span className="absolute top-1 right-3 bg-[var(--sf-accent)] text-white text-[7px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-[0_0_10px_var(--sf-accent)] border-2 border-[var(--sf-bg)] z-20">
                          {totalQuantity}
                      </span>
                  )}
                </Link>
              );
            })}
          </nav>
      </div>
    </div>
  );
}
