'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, Search, User, X } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { motion, AnimatePresence } from 'framer-motion';

export function StoreNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? 'bg-background/80 py-4 shadow-sm backdrop-blur-lg' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/store" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <span className="font-display text-xl font-bold">M</span>
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-foreground hidden sm:block">
              Mana Store
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/store" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/store/products" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Shop Now
            </Link>
            <Link href="/store/categories" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Categories
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="hidden text-muted-foreground hover:text-primary sm:block p-2">
              <Search className="h-5 w-5" />
            </button>
            <Link href={isAuthenticated ? "/store/orders" : "/store/login"} className="text-muted-foreground hover:text-primary p-2">
              <User className="h-5 w-5" />
            </Link>
            <Link href="/store/cart" className="relative text-muted-foreground hover:text-primary p-2">
              <ShoppingCart className="h-5 w-5" />
              {totalQuantity > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={totalQuantity} // Animate on change
                  className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                >
                  {totalQuantity}
                </motion.span>
              )}
            </Link>
            
            <button 
              className="md:hidden text-foreground p-2"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed right-0 top-0 z-50 flex h-full w-[80%] max-w-sm flex-col bg-background p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-display text-xl font-bold">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-muted p-2 text-muted-foreground hover:bg-muted/80">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                <Link onClick={() => setMobileMenuOpen(false)} href="/store" className="text-lg font-medium text-foreground">
                  Home
                </Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="/store/products" className="text-lg font-medium text-foreground">
                  Shop All Products
                </Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="/store/categories" className="text-lg font-medium text-foreground">
                  Categories
                </Link>
                <div className="my-4 h-px w-full bg-border" />
                <Link onClick={() => setMobileMenuOpen(false)} href="/store/login" className="text-lg font-medium text-foreground">
                  {isAuthenticated ? "My Account" : "Sign In"}
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
