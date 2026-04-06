import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Heart, Bell } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { cn } from '@/utils/cn';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
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
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 py-4",
        isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-sf-outline/10 h-16" : "bg-transparent h-24"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sf-primary rounded-lg rotate-12 flex items-center justify-center -ml-2">
            <span className="text-white font-black italic text-lg leading-none">M</span>
          </div>
          <span className="font-bold tracking-tighter text-xl text-sf-text">MANA VYAPAR</span>
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

          <Link to="/notifications" className="text-sf-text opacity-70 hover:opacity-100 transition-opacity relative">
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-[100] p-6 flex flex-col md:hidden animate-in fade-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between mb-12">
            <span className="font-bold tracking-tighter text-xl">MANA VYAPAR</span>
            <button onClick={() => setIsMobileMenuOpen(false)}><X size={32} /></button>
          </div>
          <div className="flex flex-col gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                to={link.href} 
                className="text-3xl font-black tracking-tight"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.title}
              </Link>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-4 border-t pt-8">
            <Link to="/profile" className="flex items-center gap-4 text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              <User /> Account
            </Link>
            <Link to="/wishlist" className="flex items-center gap-4 text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              <Heart /> Wishlist
            </Link>
            <div className="pt-4">
               <ThemeToggle sidebar />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
