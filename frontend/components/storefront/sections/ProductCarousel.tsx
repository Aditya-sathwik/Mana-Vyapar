'use client';

import { useStorefrontSelector } from '@/redux/hooks';
import ProductCard from '../ProductCard';
import { motion } from 'framer-motion';

export default function ProductCarousel({ data }: { data: any }) {
  const { title, limit, category } = data;
  const { items, loading } = useStorefrontSelector((state) => state.product);

  // Filter products based on category if provided
  const filteredProducts = category && category !== 'all' 
    ? items.filter(p => p.category === category)
    : items;

  const displayProducts = filteredProducts.slice(0, limit || 8);

  return (
    <section className="py-20 bg-background px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-tight max-w-lg">
                {title || "Featured Products"}
            </h2>
            <div className="h-1 bg-gradient-to-r from-primary to-transparent flex-grow ml-12 rounded-full hidden md:block opacity-20" />
        </div>

        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-96 w-full bg-card rounded-3xl animate-pulse border border-border/50" />
            ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
            </div>
        )}
      </div>
    </section>
  );
}
