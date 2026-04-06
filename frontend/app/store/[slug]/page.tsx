'use client';

import { useStorefrontSelector } from '@/redux/hooks';
import PageRenderer from '@/components/storefront/PageRenderer';

export default function StorefrontHome() {
  const { metadata, loading } = useStorefrontSelector((state) => state.store);

  if (loading) return null; // Handled by wrapper

  const sections = metadata?.sections || [];

  return (
    <div className="flex flex-col min-h-screen">
      <PageRenderer sections={sections} />
      
      {sections.length === 0 && (
         <div className="min-h-screen flex flex-col items-center justify-center p-20 text-center relative overflow-hidden">
            <div className="w-24 h-56 bg-gradient-to-t from-primary/10 to-transparent absolute blur-3xl rounded-full" />
            <div className="text-9xl font-black text-muted/20 absolute pointer-events-none skew-x-[-15deg] select-none uppercase tracking-tighter opacity-10">STOREFRONT</div>
            <h2 className="text-4xl font-bold mb-6 text-foreground tracking-tight leading-none z-10">Welcome to {metadata?.name || 'Our Store'}</h2>
            <p className="text-muted-foreground max-w-sm mb-12 font-medium leading-relaxed z-10">This storefront is currently getting ready for your visit. Check back later for curated products and premium shopping experiences.</p>
            <div className="flex gap-4 items-center z-10 scale-90">
                <div className="h-0.5 w-40 bg-border rounded-full" />
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_var(--primary)]" />
                <div className="h-0.5 w-40 bg-border rounded-full" />
            </div>
         </div>
      )}
    </div>
  );
}
