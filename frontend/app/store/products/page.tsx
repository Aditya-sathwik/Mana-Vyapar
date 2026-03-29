'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchProducts, setSearchQuery, setSelectedCategory } from '@/redux/slices/productSlice';
import { ProductCard } from '@/components/storefront/ui/ProductCard';
import { Input } from '@/components/storefront/ui/Input';
import { Button } from '@/components/storefront/ui/Button';
import { FadeIn, SlideUp } from '@/components/storefront/ui/MotionComponents';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function StoreProducts() {
  const dispatch = useAppDispatch();
  const { items, status, searchQuery, selectedCategory } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const categories = ['All', 'Clothing', 'Jewelry', 'Home'];

  const filteredProducts = items.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <SlideUp className="mb-12">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Shop Collection</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Browse our premium quality products carefully selected for you.
        </p>
      </SlideUp>

      {/* Filters & Search */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sticky top-20 md:top-0 z-20 bg-background/90 backdrop-blur-md py-4 border-b border-border">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => dispatch(setSelectedCategory(cat))}
              className="rounded-full shrink-0"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {status === 'loading' && Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-[400px] rounded-2xl bg-muted animate-pulse border border-border" />
        ))}
        
        {status === 'succeeded' && filteredProducts.map((product, idx) => (
          <FadeIn key={product.id} delay={idx * 0.05}>
            <ProductCard product={product} />
          </FadeIn>
        ))}

        {status === 'succeeded' && filteredProducts.length === 0 && (
          <div className="col-span-full py-20 text-center">
             <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
             </div>
             <h3 className="font-display text-2xl font-semibold text-foreground">No Products Found</h3>
             <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
             <Button 
               variant="outline" 
               className="mt-6"
               onClick={() => {
                 dispatch(setSearchQuery(''));
                 dispatch(setSelectedCategory('All'));
               }}
             >
               Clear Filters
             </Button>
          </div>
        )}
      </div>
    </div>
  );
}
