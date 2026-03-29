'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, Search, User, X, Home, Grid, LogIn, ShoppingBag, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import { CartDrawer } from './ui/CartDrawer';

export function StoreNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Auto-collapse on medium devices
    const handleResize = () => {
      if (window.innerWidth < 1280) setIsCollapsed(true);
      // Wait, let's keep it collapsed by default unless they manually open it
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '/store', icon: Home },
    { name: 'Shop Now', href: '/store/products', icon: ShoppingBag },
    { name: 'Categories', href: '/store/categories', icon: Grid },
  ];

  const effectivelyCollapsed = isCollapsed && !isHovered;

  const handleLinkClick = () => {
    setIsCollapsed(true);
    setIsHovered(false);
  };

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <motion.aside
        initial={false}
        animate={{ width: effectivelyCollapsed ? 80 : 256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="hidden md:flex flex-col bg-card/95 backdrop-blur-2xl border-r border-border z-40 shadow-2xl shrink-0 sticky top-0 h-screen group/sidebar relative"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-10 bg-card text-muted-foreground h-7 w-7 rounded-full hidden md:flex items-center justify-center shadow-xl hover:text-primary hover:border-primary/50 transition-all border border-border z-50 group-hover/sidebar:opacity-100 opacity-0"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Logo Area */}
        <div className={cn("h-20 flex items-center border-b border-border/50", effectivelyCollapsed ? "px-4 justify-center" : "px-6")}>
          <Link href="/store" onClick={handleLinkClick} className="flex items-center gap-3 w-full">
            <div className="relative shrink-0 mx-auto md:mx-0">
              <div className="h-10 w-10 bg-gradient-to-tr from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shrink-0 border border-primary/30 shadow-[0_0_20px_rgba(5,148,103,0.3)] overflow-hidden">
                <span className="font-display text-xl font-bold text-primary">M</span>
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-background shadow-[0_0_5px_rgba(5,148,103,1)]" />
            </div>
            {!effectivelyCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                <span className="text-foreground font-black text-lg tracking-tighter leading-none uppercase">MANA STORE</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase">Premium Hub</span>
                </div>
              </motion.div>
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-6 custom-scrollbar">
          <div className="space-y-1">
            {!effectivelyCollapsed && (
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-3 ml-2 flex items-center gap-2">
                <span className="h-px flex-1 bg-border" />
                Discover
              </p>
            )}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/store');
                const Icon = link.icon;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300",
                      effectivelyCollapsed ? "justify-center px-0 w-11 h-11 mx-auto" : "",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_-2px_rgba(5,148,103,0.1)]"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                    )}
                  >
                    {isActive && !effectivelyCollapsed && (
                      <motion.div
                        layoutId="active-pill-store"
                        className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(5,148,103,1)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className={cn(
                      "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary transition-colors"
                    )} />
                    {!effectivelyCollapsed && <span className="text-sm font-bold truncate tracking-tight">{link.name}</span>}

                    {effectivelyCollapsed && (
                      <div className="absolute left-14 bg-foreground text-background text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 font-bold uppercase tracking-widest translate-x-[-10px] group-hover:translate-x-0 shadow-xl">
                        {link.name}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="space-y-1">
            {!effectivelyCollapsed && (
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-3 ml-2 flex items-center gap-2">
                <span className="h-px flex-1 bg-border" />
                Account
              </p>
            )}
            <Link
              href={isAuthenticated ? "/store/orders" : "/store/login"}
              onClick={handleLinkClick}
              className={cn(
                "group relative flex items-center gap-3 py-2.5 rounded-xl transition-all duration-300",
                pathname === "/store/orders" ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_-2px_rgba(5,148,103,0.1)]" : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent",
                effectivelyCollapsed ? "justify-center px-0 w-11 h-11 mx-auto" : "px-3"
              )}
            >
              {isAuthenticated
                ? <LayoutDashboard className={cn("h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110", pathname === "/store/orders" ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                : <LogIn className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110 text-muted-foreground group-hover:text-primary" />
              }
              {!effectivelyCollapsed && <span className="text-sm font-bold truncate tracking-tight">{isAuthenticated ? "My Orders" : "Sign In"}</span>}
              {effectivelyCollapsed && (
                <div className="absolute left-14 bg-foreground text-background text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 font-bold uppercase tracking-widest translate-x-[-10px] group-hover:translate-x-0 shadow-xl">
                  {isAuthenticated ? "My Orders" : "Sign In"}
                </div>
              )}
            </Link>

            <Link
              href="/store/settings"
              onClick={handleLinkClick}
              className={cn(
                "group relative flex items-center gap-3 py-2.5 rounded-xl transition-all duration-300",
                pathname === "/store/settings" ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_-2px_rgba(5,148,103,0.1)]" : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent",
                effectivelyCollapsed ? "justify-center px-0 w-11 h-11 mx-auto" : "px-3"
              )}
            >
              <User className={cn("h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110", pathname === "/store/settings" ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
              {!effectivelyCollapsed && <span className="text-sm font-bold truncate tracking-tight">Profile Settings</span>}
              {effectivelyCollapsed && (
                <div className="absolute left-14 bg-foreground text-background text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 font-bold uppercase tracking-widest translate-x-[-10px] group-hover:translate-x-0 shadow-xl">
                  Profile Settings
                </div>
              )}
            </Link>
          </div>
        </nav>

        {/* Footer Area of Sidebar */}
        <div className={cn("p-4 pb-8 border-t border-border/50 bg-background/50 backdrop-blur-md", effectivelyCollapsed ? "flex flex-col items-center gap-4" : "flex flex-col gap-4")}>
          <button
            onClick={() => setCartDrawerOpen(true)}
            className={cn(
              "flex items-center justify-between bg-muted border border-border/50 rounded-2xl group relative overflow-hidden transition-all shadow-sm hover:shadow-lg shadow-primary/5 hover:shadow-primary/20",
              effectivelyCollapsed ? "p-3 mx-auto flex-col gap-1 w-11 h-11" : "px-4 py-3"
            )}
          >
            <div className={cn("relative z-10 flex items-center", effectivelyCollapsed ? "justify-center mx-auto" : "gap-3")}>
              <ShoppingCart className="h-4 w-4 text-primary" />
              {!effectivelyCollapsed && <span className="text-[10px] font-black uppercase text-foreground">Your Cart</span>}
            </div>
            {totalQuantity > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={totalQuantity}
                className={cn(
                  "relative z-10 flex items-center justify-center rounded-full bg-primary font-bold text-primary-foreground tracking-widest shadow-lg shadow-primary/20",
                  effectivelyCollapsed ? "absolute -top-1 -right-1 h-3.5 w-3.5 text-[8px]" : "h-5 w-5 text-[10px] uppercase"
                )}
              >
                {totalQuantity}
              </motion.span>
            )}
          </button>

          <div className={cn("flex items-center gap-2", effectivelyCollapsed ? "justify-center" : "justify-between px-1")}>
            <ThemeToggle />
            {!effectivelyCollapsed && <span className="flex-1 text-center text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Theme</span>}
          </div>
        </div>
      </motion.aside>

      {/* --- MOBILE TOPBAR --- */}
      <header
        className="md:hidden fixed top-0 w-full z-50 bg-background/50 backdrop-blur-xl border-b border-border/50 py-3 shadow-sm dark:shadow-2xl"
      >
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button
              className="p-2.5 text-foreground rounded-2xl bg-muted/30 backdrop-blur-md hover:bg-muted/50 transition-all active:scale-95"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5 text-foreground" />
            </button>
            <button
              className="p-2.5 text-foreground rounded-2xl bg-muted/30 backdrop-blur-md hover:bg-muted/50 transition-all active:scale-95 border border-transparent focus:border-primary/30"
            >
              <Search className="h-5 w-5 text-foreground" />
            </button>
          </div>

          {/* Logo Center */}
          <Link href="/store" className="flex items-center justify-center pointer-events-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <span className="font-display text-xl font-bold">M</span>
            </div>
          </Link>

          {/* Mobile Cart Icon - Improved with Badge Styling */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="relative p-2.5 group active:scale-95 transition-all"
          >
            <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-md">
              <ShoppingCart className={cn("h-5 w-5", totalQuantity === 0 ? "text-foreground" : "text-primary")} />
            </div>
            {totalQuantity > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={`mobile-cart-${totalQuantity}`}
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground shadow-lg shadow-primary/30 border-2 border-background"
              >
                {totalQuantity}
              </motion.span>
            )}
          </button>
        </div>
      </header>

      {/* --- MOBILE MENU DRAWER --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="md:hidden fixed left-0 top-0 z-[70] flex h-full w-[80%] max-w-[300px] flex-col bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <span className="font-display text-xl font-bold flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm shadow-md">M</div>
                  Mana Store
                </span>
                <button onClick={() => setMobileMenuOpen(false)} className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-2 mt-2">Discover</div>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/store');
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      onClick={() => setMobileMenuOpen(false)}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 rounded-xl text-md font-medium transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                      {link.name}
                    </Link>
                  )
                })}

                <div className="mt-6 mb-4 h-px w-full bg-border" />

                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  href={isAuthenticated ? "/store/orders" : "/store/login"}
                  className={cn("flex items-center gap-4 px-4 py-3 rounded-xl text-md font-medium transition-colors", pathname === "/store/orders" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted")}
                >
                  {isAuthenticated ? <LayoutDashboard className={cn("h-5 w-5", pathname === "/store/orders" ? "text-primary" : "text-muted-foreground")} /> : <LogIn className="h-5 w-5 text-muted-foreground" />}
                  {isAuthenticated ? "My Orders" : "Sign In"}
                </Link>

                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  href="/store/settings"
                  className={cn("flex items-center gap-4 px-4 py-3 rounded-xl text-md font-medium transition-colors", pathname === "/store/settings" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted")}
                >
                  <User className={cn("h-5 w-5", pathname === "/store/settings" ? "text-primary" : "text-muted-foreground")} />
                  Profile Settings
                </Link>
              </nav>

              <div className="p-6 border-t border-border/50 flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Dark Mode</span>
                <ThemeToggle />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />

      {/* --- MOBILE BOTTOM NAV --- */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:hidden pointer-events-none">
        <nav className="flex items-center justify-around h-16 bg-card/80 backdrop-blur-xl border border-border shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.5)] rounded-2xl px-2 pointer-events-auto max-w-md mx-auto">
          {[
            { href: "/store", label: "Home", icon: Home },
            { href: "/store/categories", label: "Categories", icon: Grid },
            { href: "/store/products", label: "Shop", icon: ShoppingBag },
            { href: "/store/settings", label: "Profile", icon: User },
          ].map((item) => {
            const isActive = pathname === item.href || (item.href !== "/store" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 relative",
                  isActive
                    ? "text-primary scale-110"
                    : "text-muted-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="store-bottom-nav-indicator"
                    className="absolute -top-1 h-1 w-6 bg-primary rounded-full shadow-[0_0_10px_rgba(5,148,103,1)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <div className={cn(
                  "p-1.5 rounded-lg transition-all",
                  isActive && "bg-primary/10"
                )}>
                   <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest",
                  isActive ? "opacity-100" : "opacity-70"
                )}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  );
}
