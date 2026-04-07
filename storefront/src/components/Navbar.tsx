import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Heart, Bell } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useStoreConfig } from '../hooks/useStoreConfig';

const Navbar: React.FC = () => {
  const { config } = useStoreConfig();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalQuantity } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: 'HOME', href: '/' },
    { title: 'SHOP', href: '/products' },
    { title: 'CATEGORIES', href: '/categories' },
    { title: 'STORY', href: '/story' },
  ];

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-4 md:px-12 py-3 md:py-4",
          (isScrolled || isMobileMenuOpen) 
            ? "bg-sf-background backdrop-blur-xl border-b border-sf-outline/10 h-16" 
            : "bg-transparent h-16 md:h-24"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            {config?.logo ? (
              <img src={config.logo} alt={config.name} className="h-10 md:h-12 w-auto object-contain" />
            ) : (
              <>
                <div className="w-8 h-8 bg-sf-primary rounded-lg rotate-12 flex items-center justify-center -ml-2">
                  <span className="text-white font-black italic text-lg leading-none">{config?.name?.[0] || 'M'}</span>
                </div>
                <span className="font-bold tracking-tighter text-lg md:text-xl text-sf-text whitespace-nowrap uppercase italic">
                  {config?.name || 'MANA VYAPAR'}
                </span>
              </>
            )}
          </Link>
  
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                to={link.href} 
                className={cn(
                  "text-[11px] font-black tracking-[0.2em] transition-all",
                  location.pathname === link.href ? "text-sf-primary" : "text-sf-text-muted hover:text-sf-primary"
                )}
              >
                {link.title}
              </Link>
            ))}
          </div>
  
          {/* Action Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            <button className="text-sf-text opacity-70 hover:opacity-100 transition-opacity">
              <Search size={22} strokeWidth={1.5} />
            </button>
            
            <Link to="/wishlist" className="text-sf-text opacity-70 hover:opacity-100 transition-opacity hidden md:block">
              <Heart size={22} strokeWidth={1.5} />
            </Link>
  
            <Link to="/notifications" className="text-sf-text opacity-70 hover:opacity-100 transition-opacity relative hidden sm:block">
              <Bell size={22} strokeWidth={1.5} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-sf-primary rounded-full" />
            </Link>
  
            <ThemeToggle />
  
            <Link to="/cart" className="relative group">
              <ShoppingBag size={22} strokeWidth={1.5} className="text-sf-text group-hover:text-sf-primary transition-colors" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-2 bg-sf-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                  {totalQuantity}
                </span>
              )}
            </Link>
  
            <Link to={isAuthenticated ? "/profile" : "/login"} className="hidden md:block">
              {user?.avatar ? (
                <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full border border-sf-outline/20" />
              ) : (
                <User size={22} strokeWidth={1.5} className="text-sf-text opacity-70 hover:opacity-100 transition-opacity" />
              )}
            </Link>
  
            {/* Mobile Menu Toggle */}
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
  
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-sf-background z-[150] p-6 flex flex-col md:hidden shadow-2xl"
          >
            <div className="flex items-center justify-between mb-12">
              <span className="font-bold tracking-tighter text-xl text-sf-text uppercase italic">{config?.name || 'MANA VYAPAR'}</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-sf-text hover:bg-sf-surface rounded-full transition-colors"
              >
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <Link 
                    to={link.href} 
                    className="text-4xl font-black tracking-tight text-sf-text hover:text-sf-primary transition-colors uppercase italic"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.title}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-4 border-t border-sf-outline/10 pt-8">
              <Link to="/profile" className="flex items-center gap-4 text-sf-text opacity-80 hover:opacity-100" onClick={() => setIsMobileMenuOpen(false)}>
                <User size={20} /> <span className="font-bold tracking-wide uppercase text-xs">Account</span>
              </Link>
              <Link to="/wishlist" className="flex items-center gap-4 text-sf-text opacity-80 hover:opacity-100" onClick={() => setIsMobileMenuOpen(false)}>
                <Heart size={20} /> <span className="font-bold tracking-wide uppercase text-xs">Wishlist</span>
              </Link>
              <div className="pt-4">
                 <ThemeToggle sidebar />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
