'use client';

import { useStorefrontSelector, useStorefrontDispatch } from '@/redux/hooks';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, Search, ChevronRight, Home, LayoutGrid, ClipboardList, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

export default function StorefrontNavbar() {
  const dispatch = useStorefrontDispatch();
  const { metadata, loading } = useStorefrontSelector((state: any) => state.store);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const { totalQuantity } = useStorefrontSelector((state: any) => state.cart);
  const { isAuthenticated, user } = useStorefrontSelector((state: any) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading || !metadata) return <div className="h-20 bg-background/80 sticky top-0 transition-colors" />;

  const navLinks = [
    { title: 'Home', href: `/store/${metadata.slug}`, icon: Home },
    { title: 'Categories', href: `/store/${metadata.slug}/categories`, icon: LayoutGrid },
    { title: 'Orders', href: `/store/${metadata.slug}/orders`, icon: ClipboardList },
  ];

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-700",
          isScrolled 
            ? "bg-[var(--sf-bg)]/80 backdrop-blur-xl border-b border-white/5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)]" 
            : "bg-transparent border-b border-transparent py-6"
        )}
      >
        <div className="sf-container flex items-center justify-between">
          {/* Dynamic Logo */}
          <Link href={`/store/${metadata.slug}`} className="flex items-center gap-3 group relative transition-transform active:scale-95">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse-slow opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white p-2 overflow-hidden ring-1 ring-black/5 shadow-premium">
                  <Image 
                      src={metadata.logo || 'https://via.placeholder.com/100?text=Logo'} 
                      alt={metadata.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
              </div>
              <div className="hidden sm:block">
                  <h1 className="text-xl md:text-2xl font-black font-display text-foreground tracking-tight leading-none">
                      {metadata.name}
                  </h1>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1 opacity-80">Official Store</p>
              </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => {
               const isActive = pathname === link.href;
               return (
                <Link 
                  key={link.title} 
                  href={link.href}
                  className={cn(
                    "text-[12px] font-black uppercase tracking-[0.2em] transition-all relative group py-2",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.title}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all rounded-full shadow-[0_0_10px_var(--primary)]",
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
               );
            })}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-4 md:gap-8">
            <button className="hidden md:block text-muted-foreground hover:text-foreground transition-all p-2 hover:bg-muted/50 rounded-xl group/search">
              <Search size={20} strokeWidth={2.5} className="group-hover/search:scale-110 transition-transform" />
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
              className="text-muted-foreground hover:text-foreground transition-all p-2 hover:bg-muted/50 rounded-xl active:scale-90"
            >
              {isDarkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
            </button>

            <Link href={`/store/${metadata.slug}/cart`} className="relative text-foreground hover:text-primary transition-all p-2 md:p-2.5 hover:bg-muted/50 rounded-xl group/cart active:scale-90">
              <ShoppingCart size={24} strokeWidth={2} className="group-hover/cart:scale-110 transition-transform" />
              {totalQuantity > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={totalQuantity}
                  className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-[0_0_15px_var(--primary)] border-2 border-background"
                >
                  {totalQuantity}
                </motion.span>
              )}
            </Link>

            <div className="h-6 w-px bg-border/50 hidden sm:block" />

            {isAuthenticated ? (
              <Link href={`/store/${metadata.slug}/profile`} className="flex items-center gap-3 group/p active:scale-95">
                <div className="text-right hidden md:block">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Authenticated</p>
                    <p className="text-xs font-black text-foreground truncate max-w-[120px] leading-none">{user?.fullName}</p>
                </div>
                <div className="w-10 h-10 rounded-xl md:rounded-2xl bg-muted ring-2 ring-primary/20 group-hover/p:ring-primary/50 transition-all overflow-hidden flex items-center justify-center shadow-lg">
                   {user?.avatarUrl ? (
                     <Image src={user.avatarUrl} alt={user.fullName} width={40} height={40} className="object-cover" />
                   ) : (
                      <User size={18} className="text-primary" />
                   )}
                </div>
              </Link>
            ) : (
              <Link 
                  href={`/store/${metadata.slug}/login`}
                  className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-foreground text-background hover:bg-primary hover:text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg"
              >
                  <User size={14} strokeWidth={3} />
                  Login
              </Link>
            )}

            {/* Mobile Menu Trigger */}
            <button 
              className="lg:hidden text-foreground p-2 hover:bg-muted rounded-xl active:scale-90 transition-all font-black"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-24 bg-card/95 backdrop-blur-2xl z-40 lg:hidden rounded-[2rem] border border-border/50 shadow-2xl p-6 md:p-8"
            >
              <div className="flex flex-col gap-6">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] pl-2">Store Menu</p>
                <div className="grid grid-cols-2 gap-4">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.title} 
                        href={link.href}
                        className={cn(
                           "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all",
                           pathname === link.href ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <link.icon size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{link.title}</span>
                      </Link>
                    ))}
                    <button
                       onClick={() => { setTheme(isDarkMode ? 'light' : 'dark'); setIsOpen(false); }}
                       className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-muted/50 text-muted-foreground border border-border/50"
                    >
                        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                </div>

                {!isAuthenticated && (
                  <Link 
                    href={`/store/${metadata.slug}/login`}
                    className="w-full py-5 bg-foreground text-background rounded-2xl font-black text-center text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-transform"
                    onClick={() => setIsOpen(false)}
                  >
                    Login to your Account
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 lg:hidden pointer-events-none">
          <nav className="flex items-center justify-around h-16 bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl px-2 pointer-events-auto max-w-md mx-auto relative overflow-hidden group">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-20" />
            
            {navLinks.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 relative",
                    isActive ? "text-primary scale-110" : "text-muted-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="storefront-nav-indicator"
                      className="absolute -top-1 h-1 w-6 bg-primary rounded-full shadow-[0_0_15px_var(--primary)]"
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
                    "text-[8px] font-black uppercase tracking-widest",
                    isActive ? "opacity-100" : "opacity-70"
                  )}>
                    {item.title}
                  </span>
                </Link>
              );
            })}

            {/* Shopping Cart In Bottom Nav */}
            <Link
                href={`/store/${metadata.slug}/cart`}
                className={cn(
                    "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 relative",
                    pathname.includes('/cart') ? "text-primary scale-110" : "text-muted-foreground"
                )}
            >
                <div className="relative">
                    <div className={cn(
                        "p-1.5 rounded-lg transition-all",
                        pathname.includes('/cart') && "bg-primary/10"
                    )}>
                        <ShoppingCart size={20} className={cn(pathname.includes('/cart') && "stroke-[2.5px]")} />
                    </div>
                    {totalQuantity > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[7px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-background">
                            {totalQuantity}
                        </span>
                    )}
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest opacity-70">Cart</span>
            </Link>
          </nav>
      </div>
    </>
  );
}
