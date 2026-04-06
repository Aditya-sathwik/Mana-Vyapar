'use client';

import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import Link from 'next/link';
import { useStorefrontSelector } from '@/redux/hooks';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function StorefrontHeader({ onMenuClick, isMenuOpen }: { onMenuClick: () => void, isMenuOpen: boolean }) {
  const { metadata } = useStorefrontSelector((state: any) => state.store);
  const { totalQuantity } = useStorefrontSelector((state: any) => state.cart);

  if (!metadata) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-20 bg-[var(--sf-bg)]/80 backdrop-blur-2xl border-b border-white/5 md:hidden flex items-center">
      <div className="w-full px-4 flex items-center justify-between gap-4">
        {/* Left: Dashboard Style Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[var(--sf-text)] active:scale-90 transition-all shadow-xl"
        >
          {isMenuOpen ? <X size={22} strokeWidth={3} /> : <Menu size={22} strokeWidth={3} />}
        </button>

        {/* Center: Brand Hub */}
        <Link href={`/store/${metadata.slug}`} className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-lg bg-white p-1.5 shadow-premium">
                    <Image src={metadata.logo || 'https://via.placeholder.com/100?text=Logo'} alt="" fill className="object-contain" />
                </div>
                <span className="text-lg font-black text-[var(--sf-text)] uppercase tracking-tighter italic leading-none">{metadata.name}</span>
            </div>
            <span className="text-[8px] font-black text-[var(--sf-accent)] tracking-[0.3em] uppercase mt-1 opacity-60">Store Experience</span>
        </Link>

        {/* Right: Actions Hub */}
        <div className="flex items-center gap-3">
            <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[var(--sf-text-muted)] active:scale-95 transition-all">
                <Search size={22} />
            </button>
            
            <Link href={`/store/${metadata.slug}/cart`} className="relative h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[var(--sf-accent)] active:scale-90 transition-all shadow-xl shadow-[var(--sf-accent)]/5">
                <ShoppingBag size={22} strokeWidth={2.5} />
                {totalQuantity > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[var(--sf-accent)] text-white text-[9px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-[0_0_12px_var(--sf-accent)] border-2 border-[var(--sf-bg)]">
                        {totalQuantity}
                    </span>
                )}
            </Link>
        </div>
      </div>
    </header>
  );
}
