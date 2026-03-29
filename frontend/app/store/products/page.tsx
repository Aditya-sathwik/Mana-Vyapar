'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchProductsByStoreSlug, setSearchQuery, setSelectedCategory } from '@/redux/slices/productSlice';
import { ProductCard } from '@/components/storefront/ui/ProductCard';
import { Input } from '@/components/storefront/ui/Input';
import { Button } from '@/components/storefront/ui/Button';
import { FadeIn, SlideUp } from '@/components/storefront/ui/MotionComponents';
import { Search, SlidersHorizontal, PackageSearch, Sparkles } from 'lucide-react';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function StoreProducts() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const slug = (params?.slug as string) || "mana-store";
  
  const { items, status, searchQuery, selectedCategory } = useAppSelector((state) => state.products);
  const { items: allCategories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProductsByStoreSlug(slug));
    }
  }, [status, dispatch, slug]);

  const categories = ['All', ...allCategories.map(c => c.name)];

  const filteredProducts = items.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen pb-20 overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute top-[20%] left-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[150px]" />

      <div className="container mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        {/* Editorial Hero Section */}
        <SlideUp className="mb-20 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Curated Gallery</span>
          </div>
          <h1 className="font-display text-5xl font-black tracking-tighter text-foreground sm:text-7xl lg:text-8xl">
            The <span className="text-primary italic">Sovereign</span> <br className="hidden md:block" /> Collection
          </h1>
          <p className="mt-8 max-w-2xl text-lg md:text-xl text-muted-foreground/80 leading-relaxed font-medium">
            Explore an elite selection of products designed for those who demand excellence. Every item is a testament to quality and digital luxury.
          </p>
        </SlideUp>

        {/* Premium Glassmorphic Filtering Bar */}
        <div className="sticky top-24 z-30 mb-16">
          <div className="glass-dark rounded-3xl border border-white/5 p-2 shadow-2xl shadow-black/50 overflow-hidden">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              {/* Search Field */}
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input 
                  placeholder="Search the collection..." 
                  className="pl-12 h-14 w-full bg-transparent border-none text-base font-medium focus-visible:ring-0 placeholder:text-muted-foreground/50"
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                />
              </div>

              {/* Vertical Divider for Desktop */}
              <div className="hidden md:block w-px h-8 bg-white/10 mx-2" />

              {/* Categories Scroll */}
              <div className="flex flex-1 gap-2 overflow-x-auto px-4 py-2 md:py-0 no-scrollbar items-center">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => dispatch(setSelectedCategory(cat))}
                    className={cn(
                      "relative h-10 px-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 whitespace-nowrap",
                      selectedCategory === cat 
                        ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(78,222,163,0.3)] scale-105" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Filters Toggle Button */}
              <div className="flex items-center gap-2 p-2">
                 <Button variant="ghost" size="icon" className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all">
                    <SlidersHorizontal className="h-4 w-4" />
                 </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid with Enhanced Spacing */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-h-[400px]">
          {status === 'loading' && Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-[2rem] bg-muted/20 animate-pulse border border-white/5 flex flex-col p-6">
               <div className="flex-1 rounded-2xl bg-muted/30 mb-4" />
               <div className="h-4 w-1/2 bg-muted/30 rounded mb-2" />
               <div className="h-4 w-3/4 bg-muted/30 rounded" />
            </div>
          ))}
          
          {status === 'succeeded' && filteredProducts.map((product, idx) => (
            <FadeIn key={product._id} delay={idx * 0.1}>
              <ProductCard product={product} />
            </FadeIn>
          ))}

          {status === 'succeeded' && filteredProducts.length === 0 && (
            <div className="col-span-full py-32 text-center">
               <div className="inline-flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-primary/5 border border-primary/10 mb-8 shadow-inner shadow-primary/5 scale-110">
                  <PackageSearch className="h-10 w-10 text-primary opacity-50" />
               </div>
               <h3 className="font-display text-4xl font-black text-foreground tracking-tighter italic">Foundations Empty</h3>
               <p className="text-muted-foreground mt-4 text-lg">Our search for these artifacts proved fruitless. Try a broader inquiry.</p>
               <Button 
                 variant="outline" 
                 size="lg"
                 className="mt-10 rounded-2xl border-primary/20 hover:bg-primary/5 text-primary tracking-widest uppercase text-xs font-black shadow-lg shadow-black/20"
                 onClick={() => {
                   dispatch(setSearchQuery(''));
                   dispatch(setSelectedCategory('All'));
                 }}
               >
                 Reset Gallery
               </Button>
            </div>
          )}
        </div>

        {/* Footer Accent */}
        <div className="mt-32 border-t border-white/5 pt-20 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Mana-Vyapar Digital Excellence</p>
        </div>
      </div>
    </div>
  );
}
