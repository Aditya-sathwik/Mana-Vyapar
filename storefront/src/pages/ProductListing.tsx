import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/productSlice';
import type { AppDispatch, RootState } from '../store';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal, LayoutGrid, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductListing: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector((state: RootState) => state.products);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = ['All', 'Electronics', 'Fashion', 'Home Decor', 'Accessories'];

  const filteredProducts = products.filter(p => 
    activeCategory === 'All' || p.category === activeCategory
  );

  return (
    <MainLayout>
      <div className="pt-32 pb-20 px-6 md:px-12 bg-sf-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
             <div className="flex flex-col max-w-xl">
                <span className="text-sf-primary text-[10px] font-black tracking-[0.3em] uppercase mb-4">The Archive</span>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-sf-text leading-[0.8] mb-8">
                   EXPLORE THE <br /> COLLECTION.
                </h1>
                <p className="text-sf-text-muted text-lg leading-relaxed">
                   A curated archive of premium essentials, meticulously selected from our network of expert Indian merchants.
                </p>
             </div>

             <div className="w-full md:w-auto flex flex-col gap-8">
                {/* Search / Filter Bar */}
                <div className="flex items-center gap-4 w-full">
                   <div className="relative flex-grow md:w-80">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-sf-text-muted opacity-50" size={18} />
                      <input 
                        type="text" 
                        placeholder="SEARCH PRODUCTS..." 
                        className="w-full h-16 pl-16 pr-8 bg-sf-surface border border-sf-outline/10 rounded-2xl text-[10px] font-black tracking-widest focus:outline-none focus:ring-4 focus:ring-sf-primary/5 transition-all"
                      />
                   </div>
                   <button 
                     onClick={() => setShowFilters(true)}
                     className="h-16 px-8 bg-sf-text text-white rounded-2xl flex items-center gap-4 font-black text-[10px] tracking-widest uppercase hover:bg-sf-primary transition-all shadow-xl shadow-black/10"
                   >
                     <Filter size={18} /> FILTERS
                   </button>
                </div>
             </div>
          </div>

          {/* Active Category Chips */}
          <div className="flex flex-wrap gap-4 mb-16 overflow-x-auto pb-4 scrollbar-hide">
             {categories.map((cat) => (
                <button 
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`h-12 px-8 rounded-full border text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${
                     activeCategory === cat 
                       ? 'bg-sf-primary border-sf-primary text-white shadow-lg shadow-sf-primary/20' 
                       : 'bg-white border-sf-outline/20 text-sf-text-muted hover:border-sf-primary hover:text-sf-primary shadow-sm'
                   }`}
                >
                   {cat}
                </button>
             ))}
          </div>

          {/* Product Grid */}
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                {[1, 2, 3, 4, 5, 6, 7, 10].map((n) => (
                   <div key={n} className="h-[450px] rounded-3xl bg-sf-surface-low animate-pulse" />
                ))}
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                {filteredProducts.map((product, index) => (
                   <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (index % 4) * 0.1, duration: 0.6 }}
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

          {/* Pagination Placeholder */}
          <div className="mt-32 flex justify-center py-12 relative">
             <div className="absolute top-0 inset-x-0 h-px bg-sf-outline/10" />
             <button className="h-16 px-12 rounded-full bg-sf-surface border border-sf-outline/20 text-sf-text font-black text-[10px] tracking-widest uppercase shadow-xl hover:bg-sf-surface-low transition-all">
                LOAD MORE PRODUCTS
             </button>
          </div>
        </div>
      </div>

      {/* Filter Sidebar Overlay */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowFilters(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-md z-[101]"
            />
            <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[102] p-12 shadow-2xl flex flex-col"
            >
               <div className="flex justify-between items-center mb-16">
                  <h2 className="text-3xl font-black tracking-tighter">FILTER <br /> ARCHIVE.</h2>
                  <button onClick={() => setShowFilters(false)} className="w-12 h-12 rounded-full border border-sf-outline/20 flex items-center justify-center hover:bg-sf-surface-low transition-colors">
                     <X size={24} />
                  </button>
               </div>

               <div className="flex flex-col gap-16 overflow-y-auto pr-4 scrollbar-hide">
                  <div className="flex flex-col gap-6">
                     <p className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase">Sorting</p>
                     <div className="flex flex-col gap-4">
                        {['FEATURED', 'NEWEST', 'PRICE: LOW TO HIGH', 'PRICE: HIGH TO LOW'].map(opt => (
                           <label key={opt} className="flex items-center gap-4 cursor-pointer group">
                              <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${sortBy === opt.toLowerCase() ? 'bg-sf-primary border-sf-primary shadow-lg' : 'border-sf-outline/30 group-hover:border-sf-primary'}`}>
                                 {sortBy === opt.toLowerCase() && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </div>
                              <input 
                                type="radio" 
                                className="hidden" 
                                name="sort" 
                                value={opt.toLowerCase()} 
                                onChange={(e) => setSortBy(e.target.value)} 
                              />
                              <span className="text-[10px] font-bold tracking-widest text-sf-text uppercase">{opt}</span>
                           </label>
                        ))}
                     </div>
                  </div>

                  <div className="flex flex-col gap-6">
                     <p className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase">Price Range</p>
                     <div className="flex flex-col gap-8">
                         <div className="h-2 bg-sf-surface-low rounded-full relative overflow-hidden">
                            <div className="absolute left-0 right-0 top-0 bottom-0 bg-sf-primary opacity-20" />
                            <div className="absolute left-[10%] right-[30%] top-0 bottom-0 bg-sf-primary" />
                         </div>
                         <div className="flex justify-between gap-4">
                            <div className="flex flex-col gap-2 flex-1">
                               <span className="text-[8px] font-black tracking-widest text-sf-text-muted">MIN</span>
                               <div className="h-12 border border-sf-outline/20 rounded-xl px-4 flex items-center font-bold text-xs">₹0</div>
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                               <span className="text-[8px] font-black tracking-widest text-sf-text-muted">MAX</span>
                               <div className="h-12 border border-sf-outline/20 rounded-xl px-4 flex items-center font-bold text-xs">₹10,000+</div>
                            </div>
                         </div>
                     </div>
                  </div>
               </div>

               <button className="mt-auto w-full h-18 bg-sf-primary text-white rounded-2xl font-black text-xs tracking-[0.2em] shadow-2xl shadow-sf-primary/20 uppercase">
                  APPLY FILTERS
               </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default ProductListing;
