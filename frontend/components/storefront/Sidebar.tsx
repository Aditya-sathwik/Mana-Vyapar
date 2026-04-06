'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  LayoutGrid,
  ClipboardList,
  ShoppingCart,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  TrendingUp,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useStorefrontSelector } from '@/redux/hooks';

export function StorefrontSidebar({ className }: { className?: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const { metadata } = useStorefrontSelector((state: any) => state.store);
  const { totalQuantity } = useStorefrontSelector((state: any) => state.cart);

  const isActuallyCollapsed = isCollapsed && !isHovered;

  const navLinks = [
    { title: 'Home', href: `/store/${metadata?.slug}`, icon: Home },
    { title: 'Categories', href: `/store/${metadata?.slug}/categories`, icon: LayoutGrid },
    { title: 'My Orders', href: `/store/${metadata?.slug}/orders`, icon: ClipboardList },
    { title: 'Wishlist', href: `/store/${metadata?.slug}/wishlist`, icon: Heart },
  ];

  if (!metadata) return null;

  return (
    <motion.aside
      initial={false}
      onMouseEnter={() => isCollapsed && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ width: isActuallyCollapsed ? 90 : 280 }}
      transition={{ type: "spring", stiffness: 350, damping: 35 }}
      className={cn(
        "relative bg-[var(--sf-bg)] border-r border-white/5 flex flex-col z-[120] h-screen shadow-2xl transition-colors duration-500",
        className
      )}
    >
      {/* Sidebar Toggle Button - Improved Positioning */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-12 bg-[var(--sf-accent)] text-white h-7 w-7 rounded-full hidden md:flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border-2 border-[var(--sf-bg)] z-[130]"
      >
        {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
      </button>

      {/* Header / Logo - Fixed Spacing */}
      <div className={cn(
        "h-24 flex items-center border-b border-white/5 transition-all duration-300",
        isActuallyCollapsed ? "px-0 justify-center" : "px-8"
      )}>
        <Link href={`/store/${metadata.slug}`} className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            <div className={cn(
              "rounded-2xl bg-white p-2 shadow-premium overflow-hidden ring-1 ring-black/5 transition-all duration-300",
              isActuallyCollapsed ? "h-10 w-10 p-1" : "h-12 w-12 p-2"
            )}>
              <Image
                src={metadata.logo || 'https://via.placeholder.com/100?text=Logo'}
                alt={metadata.name}
                width={isActuallyCollapsed ? 32 : 40}
                height={isActuallyCollapsed ? 32 : 40}
                className="w-full h-full object-contain"
              />
            </div>
            {!isActuallyCollapsed && (
              <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-[var(--sf-accent)] rounded-full border-2 border-[var(--sf-bg)] shadow-[0_0_10px_var(--sf-accent)]" />
            )}
          </div>
          {!isActuallyCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col overflow-hidden"
            >
              <span className="text-[var(--sf-text)] font-black text-xl tracking-tighter leading-none uppercase truncate">
                {metadata.name}
              </span>
              <p className="text-[9px] font-black text-[var(--sf-accent)] tracking-[0.2em] uppercase mt-1.5 opacity-80">Premium Store</p>
            </motion.div>
          )}
        </Link>
      </div>

      {/* Navigation Content */}
      <div className={cn(
        "flex-1 overflow-y-auto py-8 space-y-8 custom-scrollbar",
        isActuallyCollapsed ? "px-2" : "px-4"
      )}>
        <div className="space-y-2">
          {!isActuallyCollapsed && (
            <p className="text-[10px] font-black text-[var(--sf-text-muted)] uppercase tracking-[0.3em] ml-4 mb-4 opacity-50">Discovery</p>
          )}
          <div className={cn("space-y-1.5 flex flex-col", isActuallyCollapsed ? "items-center" : "")}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative flex items-center gap-4 rounded-2xl transition-all duration-300",
                    isActuallyCollapsed ? "w-12 h-12 justify-center" : "px-4 py-3.5 w-full",
                    isActive
                      ? "bg-[var(--sf-accent)]/10 text-[var(--sf-accent)] border border-[var(--sf-accent)]/20"
                      : "text-[var(--sf-text-muted)] hover:bg-white/5 hover:text-[var(--sf-text)] border border-transparent"
                  )}
                >
                  {isActive && !isActuallyCollapsed && (
                    <motion.div
                      layoutId="sf-active-indicator"
                      className="absolute left-0 w-1.5 h-8 bg-[var(--sf-accent)] rounded-r-full shadow-[0_0_15px_var(--sf-accent)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {isActive && isActuallyCollapsed && (
                    <motion.div
                      layoutId="sf-active-pill"
                      className="absolute inset-0 bg-[var(--sf-accent)]/10 rounded-2xl"
                    />
                  )}
                  <link.icon size={isActuallyCollapsed ? 22 : 20} className={cn(
                    "shrink-0 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-[var(--sf-accent)]" : "text-[var(--sf-text-muted)]"
                  )} />
                  {!isActuallyCollapsed && (
                    <span className="text-sm font-black tracking-tight uppercase truncate">{link.title}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Action Section */}
        <div className={cn("space-y-1.5 flex flex-col", isActuallyCollapsed ? "items-center" : "")}>
          {!isActuallyCollapsed && (
            <p className="text-[10px] font-black text-[var(--sf-text-muted)] uppercase tracking-[0.3em] ml-4 mb-4 opacity-50">Account</p>
          )}
          <Link
            href={`/store/${metadata.slug}/cart`}
            className={cn(
              "group relative flex items-center gap-4 rounded-2xl transition-all duration-300",
              isActuallyCollapsed ? "w-12 h-12 justify-center" : "px-4 py-3.5 w-full",
              pathname.includes('/cart') ? "bg-[var(--sf-accent)]/10 text-[var(--sf-accent)] border border-[var(--sf-accent)]/20" : "text-[var(--sf-text-muted)] hover:bg-white/5"
            )}
          >
            <div className="relative">
              <ShoppingCart size={isActuallyCollapsed ? 22 : 20} className={cn(pathname.includes('/cart') ? "text-[var(--sf-accent)]" : "text-[var(--sf-text-muted)]")} />
              {totalQuantity > 0 && (
                <span className={cn(
                  "absolute bg-[var(--sf-accent)] text-white font-black flex items-center justify-center rounded-full shadow-[0_0_10px_var(--sf-accent)] border-2 border-[var(--sf-bg)] transition-all",
                  isActuallyCollapsed ? "-top-2 -right-2 w-5 h-5 text-[9px]" : "-top-2 -right-2 w-4.5 h-4.5 text-[8px]"
                )}>
                  {totalQuantity}
                </span>
              )}
            </div>
            {!isActuallyCollapsed && <span className="text-sm font-black tracking-tight uppercase truncate">Cart</span>}
          </Link>
          <Link
            href={`/store/${metadata.slug}/profile`}
            className={cn(
              "group relative flex items-center gap-4 rounded-2xl transition-all duration-300",
              isActuallyCollapsed ? "w-12 h-12 justify-center" : "px-4 py-3.5 w-full",
              pathname.includes('/profile') ? "bg-[var(--sf-accent)]/10 text-[var(--sf-accent)] border border-[var(--sf-accent)]/20" : "text-[var(--sf-text-muted)] hover:bg-white/5"
            )}
          >
            <User size={isActuallyCollapsed ? 22 : 20} className={cn(pathname.includes('/profile') ? "text-[var(--sf-accent)]" : "text-[var(--sf-text-muted)]")} />
            {!isActuallyCollapsed && <span className="text-sm font-black tracking-tight uppercase truncate">Profile</span>}
          </Link>
        </div>
      </div>

      {/* Footer / Theme Toggle */}
      <div className={cn(
        "p-6 border-t border-white/5 bg-[var(--sf-bg-alt)]/50 backdrop-blur-md mt-auto",
        isActuallyCollapsed ? "px-2 pb-8 flex justify-center" : ""
      )}>
        <button
          onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
          className={cn(
            "flex items-center gap-4 bg-[var(--sf-card)] border border-white/5 rounded-2xl text-[var(--sf-text-muted)] hover:text-[var(--sf-text)] transition-all hover:scale-[1.05] shadow-xl",
            isActuallyCollapsed ? "w-12 h-12 justify-center" : "w-full px-4 py-3.5"
          )}
        >
          {isDarkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
          {!isActuallyCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </div>
    </motion.aside>
  );
}
