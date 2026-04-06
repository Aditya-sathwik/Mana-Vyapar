'use client';

import { useEffect, ReactNode, useState } from 'react';
import { useStorefrontDispatch, useStorefrontSelector } from '@/redux/hooks';
import { fetchStoreBySlug } from '@/redux/slices/storeSlice';
import { fetchProducts } from '@/redux/slices/productSlice';
import { fetchCurrentUser } from '@/redux/slices/authSlice';
import { DynamicTheme } from '@/components/storefront/DynamicTheme';
import { Toaster } from 'react-hot-toast';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { StorefrontSidebar } from '@/components/storefront/Sidebar';
import { StorefrontHeader } from '@/components/storefront/Header';
import StorefrontBottomNav from '@/components/storefront/BottomNav';

export default function StoreLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  const dispatch = useStorefrontDispatch();
  const { metadata, loading, error } = useStorefrontSelector((state: any) => state.store);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const slug = params.slug;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      dispatch(fetchStoreBySlug(slug)).then((res) => {
        if (res.payload && (res.payload as any)._id) {
            dispatch(fetchProducts((res.payload as any)._id));
        }
      });
      dispatch(fetchCurrentUser());
    }
  }, [slug, dispatch]);

  if (loading && !metadata) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-12">
        <div className="relative w-28 h-28">
            <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse rounded-full" />
            <div className="w-full h-full border-t-4 border-primary border-solid rounded-full animate-spin-slow ring-4 ring-slate-900 border-r-transparent border-l-transparent shadow-neon-primary" />
        </div>
        <p className="mt-8 text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Initializing {slug} Storefront...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-12 overflow-hidden text-center">
        <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-10 rotate-12">
            <div className="text-red-500 text-5xl font-black italic">!</div>
        </div>
        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight leading-none">Marketplace Error</h2>
        <p className="text-slate-400 mb-10 max-w-sm mx-auto leading-relaxed">The store you are looking for does not exist or has been deactivated.</p>
        <button onClick={() => window.location.reload()} className='px-10 py-5 bg-white text-slate-950 font-black rounded-3xl text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-premium'>Try Again</button>
      </div>
    );
  }

  return (
    <div className={cn(
      "h-screen flex flex-col md:flex-row transition-colors duration-500 w-full storefront-ui overflow-hidden",
      isDarkMode ? 'dark bg-[var(--sf-bg)] text-[var(--sf-text)]' : 'light bg-[var(--sf-bg)] text-[var(--sf-text)]'
    )}>
      <DynamicTheme store={metadata} />
      
      {/* Desktop Sidebar */}
      <StorefrontSidebar className="hidden md:flex flex-shrink-0" />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[140] bg-black/60 backdrop-blur-md md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="fixed inset-y-0 left-0 z-[150] w-[280px] md:hidden shadow-2xl"
            >
              <div className="relative h-full">
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute right-[-48px] top-6 h-10 w-10 flex items-center justify-center bg-[var(--sf-card)] text-[var(--sf-text)] rounded-xl border border-white/10 shadow-2xl"
                  >
                    <X size={20} />
                  </button>
                  <StorefrontSidebar className="flex h-full w-full" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative w-full overflow-y-auto overflow-x-hidden">
        <StorefrontHeader 
            onMenuClick={() => setIsMobileMenuOpen(true)} 
            isMenuOpen={isMobileMenuOpen} 
        />
        
        <main className="flex-grow pt-20 md:pt-0 w-full relative z-10 transition-all">
          <div className="w-full mb-20 min-h-full">
            {children}
          </div>

          <footer className="py-24 px-6 border-t border-white/5 bg-[var(--sf-bg-alt)]/30 backdrop-blur-3xl overflow-hidden relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="sf-container grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
                <div className="col-span-2">
                    <h3 className="text-3xl font-black mb-8 uppercase tracking-tighter text-[var(--sf-text)] leading-none italic">{metadata?.name}</h3>
                    <p className="text-[var(--sf-text-muted)] max-w-sm mb-12 leading-relaxed font-medium text-lg opacity-80">Digitalizing the retail heartbeat. Experience premium shopping curated specifically for you.</p>
                    <div className="flex gap-4">
                        <div className="h-1.5 w-16 bg-primary rounded-full shadow-[0_0_15px_var(--primary)]" />
                        <div className="h-1.5 w-8 bg-white/10 rounded-full" />
                        <div className="h-1.5 w-8 bg-white/10 rounded-full" />
                    </div>
                </div>
                <div className="space-y-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--sf-text)] opacity-40 border-l-2 border-primary pl-4">Customer Care</h4>
                    <ul className="flex flex-col gap-5 text-[var(--sf-text-muted)] font-black text-[10px] uppercase tracking-widest">
                        <li className="hover:text-primary transition-all cursor-pointer">Orders & Returns</li>
                        <li className="hover:text-primary transition-all cursor-pointer">Global Shipping</li>
                        <li className="hover:text-primary transition-all cursor-pointer">Privacy Protocol</li>
                    </ul>
                </div>
                <div className="space-y-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--sf-text)] opacity-40 border-l-2 border-primary pl-4">The Collective</h4>
                    <ul className="flex flex-col gap-5 text-[var(--sf-text-muted)] font-black text-[10px] uppercase tracking-widest">
                        <li className="hover:text-primary transition-all cursor-pointer">Our Vision</li>
                        <li className="hover:text-primary transition-all cursor-pointer">Merchant Bridge</li>
                        <li className="hover:text-primary transition-all cursor-pointer">Direct Contact</li>
                    </ul>
                </div>
            </div>
            <div className="sf-container mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                <p className="text-[9px] font-black text-[var(--sf-text-muted)] uppercase tracking-[0.3em] opacity-40">&copy; 2026 {metadata?.name} HUB | POWERED BY MANA-VYAPAR</p>
                <div className="flex gap-10 items-center opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    <div className="h-6 w-16 bg-white/5 rounded-lg border border-white/5" />
                    <div className="h-6 w-16 bg-white/5 rounded-lg border border-white/5" />
                    <div className="h-6 w-16 bg-white/5 rounded-lg border border-white/5" />
                </div>
            </div>
          </footer>
        </main>
      </div>

      <StorefrontBottomNav />
    </div>
  );
}
