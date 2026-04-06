import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/productSlice';
import type { AppDispatch, RootState } from '../store';
import MainLayout from '../layouts/MainLayout';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { featuredProducts, trendingProducts, loading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <MainLayout>
      <HeroSection />

      {/* Featured Collections Section */}
      <section className="py-32 px-6 md:px-12 bg-sf-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20 relative">
            <div className="absolute top-0 -left-12 w-32 h-32 bg-sf-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col">
              <span className="text-sf-primary text-[10px] font-black tracking-[0.3em] uppercase mb-4">Curated Selections</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-sf-text leading-[0.9]">
                FEATURED <br /> COLLECTIONS.
              </h2>
            </div>
            <p className="text-sf-text-muted text-lg max-w-sm leading-relaxed pb-2">
              A bespoke collection of handpicked essentials, chosen for their unparalleled quality and timeless design.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-96 rounded-3xl bg-sf-surface-low animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div 
                   key={product.id}
                   initial={{ opacity: 0, y: 40 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <ProductCard 
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      discountPrice: product.discountPrice,
                      image: product.images[0],
                      category: product.category,
                      rating: product.rating
                    }} 
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Now Section with Asymmetrical Layout */}
      <section className="py-32 px-6 md:px-12 bg-sf-background">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-24">
             <span className="text-sf-primary text-[10px] font-black tracking-[0.3em] uppercase mb-4">Seasonal Picks</span>
             <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-sf-text leading-none mb-6">
                THE TRENDING <br className="md:hidden" /> EDIT.
             </h2>
             <div className="w-24 h-1.5 bg-sf-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
             {trendingProducts.slice(0, 3).map((product, index) => (
                <motion.div 
                   key={product.id}
                   initial={{ opacity: 0, scale: 0.95 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.15, duration: 0.8 }}
                   className={index === 1 ? "md:translate-y-12" : ""}
                >
                   <ProductCard 
                     product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        discountPrice: product.discountPrice,
                        image: product.images[0],
                        category: product.category,
                        rating: product.rating
                     }} 
                   />
                </motion.div>
             ))}
          </div>

          <button className="mt-32 h-16 px-12 rounded-full border border-sf-text text-sf-text font-black text-xs tracking-widest uppercase hover:bg-sf-text hover:text-white transition-all shadow-xl shadow-black/5 flex items-center gap-4 group">
            EXPLORE THE ENTIRE COLLECTION
            <div className="w-8 h-8 rounded-full bg-sf-primary/10 flex items-center justify-center group-hover:bg-sf-primary group-hover:text-white transition-colors">
               <span className="text-xs">→</span>
            </div>
          </button>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
