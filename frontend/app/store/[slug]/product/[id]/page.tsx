'use client';

import { useStorefrontSelector, useStorefrontDispatch } from '@/redux/hooks';
import Image from 'next/image';
import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, RefreshCcw, Star, ChevronLeft, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { addToCart } from '@/redux/slices/cartSlice';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ProductDetailsPage({ params }: { params: { id: string, slug: string } }) {
  const dispatch = useStorefrontDispatch();
  const { items, loading } = useStorefrontSelector((state) => state.product);
  const { metadata } = useStorefrontSelector((state) => state.store);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const product = items.find(p => p._id === params.id);

  if (loading) return null; // Wrapper loader shown
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-20 gap-8">
        <div className="w-1 px-10 h-10 bg-slate-900 absolute rotate-45 blur-2xl opacity-20" />
        <h2 className="text-4xl font-black italic uppercase tracking-widest text-slate-700">Product Not Found</h2>
        <Link href={`/store/${params.slug}`} className="px-10 py-5 bg-slate-100 text-slate-950 font-black rounded-3xl text-sm uppercase tracking-widest shadow-md">Back to Shop</Link>
    </div>
  );

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0],
      merchantId: product.merchantId
    }));
    toast.success(`${product.name} added to cart!`, {
      style: {
        background: 'var(--primary, #6366f1)',
        color: '#fff',
      }
    });
  };

  const images = product.images.length > 0 ? product.images : ['https://via.placeholder.com/1000x1200?text=Premium+Product'];

  const benefits = [
    { icon: <ShieldCheck size={24} className="text-emerald-400" />, title: 'Genuine Product', subtitle: 'Verified merchant' },
    { icon: <Truck size={24} className="text-blue-400" />, title: 'Fast Delivery', subtitle: 'Standard 2-4 days' },
    { icon: <RefreshCcw size={24} className="text-amber-400" />, title: 'Easy Returns', subtitle: '7 days return' },
  ];

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto overflow-visible relative">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <Link href={`/store/${params.slug}`} className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all mb-12 group">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl group-hover:scale-110 active:scale-95 group-hover:border-slate-700 transition-all">
                <ChevronLeft size={20} strokeWidth={2.5} />
            </div>
            BACK TO STOREFEED
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Image Gallery */}
            <div className="flex flex-col-reverse lg:flex-row gap-6 h-fit">
                <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
                    {images.map((img, i) => (
                        <button 
                            key={i}
                            onClick={() => setActiveImage(i)}
                            className={`relative flex-shrink-0 w-24 h-24 lg:w-28 lg:h-28 rounded-3xl overflow-hidden border-2 transition-all group overflow-hidden ${activeImage === i ? 'border-primary ring-4 ring-primary/20' : 'border-slate-800/10 hover:border-slate-600/30'}`}
                        >
                            <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </div>
                <div className="flex-grow aspect-[4/5] relative rounded-[40px] overflow-hidden border border-white/5 shadow-premium shadow-black/80 bg-slate-900">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeImage}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.6, ease: "circOut" }}
                            className="absolute inset-0"
                        >
                            <Image 
                                src={images[activeImage]} 
                                alt={product.name} 
                                fill 
                                className="object-cover"
                                priority
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Product Meta & Configuration */}
            <div className="flex flex-col gap-10">
                <div>
                   <div className="flex items-center gap-2 mb-6">
                        <div className="flex items-center gap-1.5 bg-slate-900 ring-1 ring-white/5 border border-white/10 px-4 py-2 rounded-2xl shadow-xl shadow-black/20">
                            <Star size={16} fill="#fbbf24" className="text-amber-400" />
                            <span className="text-sm font-black text-slate-100">{product.rating || 4.8}</span>
                            <div className="h-4 w-px bg-slate-800 mx-2" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{product.reviewsCount || 150} REVIEWS</span>
                        </div>
                        {product.stock <= 5 && product.stock > 0 && (
                            <span className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black italic px-4 py-2 rounded-2xl animate-pulse tracking-widest uppercase">Only {product.stock} left in stock!</span>
                        )}
                   </div>
                   
                   <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight leading-none group hover:text-primary transition-colors cursor-default">
                        {product.name}
                        <div className="h-2 w-24 bg-primary/20 rounded-full mt-2 hidden md:block" />
                   </h1>
                   <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed leading-snug">{product.description}</p>
                </div>

                <div className="flex flex-wrap items-baseline gap-6 pb-10 border-b border-white/5">
                    <span className="text-6xl font-black italic tracking-tighter" style={{ color: 'var(--primary, #6366f1)' }}>₹{product.price}</span>
                    {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-2xl text-slate-600 line-through font-bold opacity-60">₹{product.comparePrice}</span>
                    )}
                    {product.discount && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/5">SAVE {product.discount}%</div>
                    )}
                </div>

                <div className="flex flex-col gap-10">
                    <div className="grid grid-cols-3 gap-6">
                        {benefits.map((bh, idx) => (
                           <div key={idx} className="flex flex-col gap-4 p-6 bg-slate-900/50 border border-white/5 rounded-[32px] group hover:bg-slate-900 hover:border-slate-800 transition-all shadow-xl shadow-black/20">
                                <div className="p-3 bg-slate-800 border border-slate-700/50 w-fit rounded-2xl group-hover:scale-110 transition-transform">
                                    {bh.icon}
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-white leading-tight mb-1">{bh.title}</h4>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">{bh.subtitle}</p>
                                </div>
                           </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        {/* Quantity UI */}
                        <div className="flex items-center bg-slate-900 border border-white/10 rounded-3xl p-2 h-20 shadow-xl shadow-black/30 group ring-1 ring-white/5">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-16 h-16 rounded-full flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-all active:scale-90 active:bg-slate-700"
                            >
                                <Minus size={22} strokeWidth={3} />
                            </button>
                            <span className="text-2xl font-black w-14 text-center select-none text-white font-display italic">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                className="w-16 h-16 rounded-full flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-all active:scale-90 active:bg-slate-700"
                            >
                                <Plus size={22} strokeWidth={3} />
                            </button>
                        </div>

                        {/* Add to Cart Actions */}
                        <div className="flex-grow flex gap-4 w-full sm:w-auto h-20">
                             <motion.button 
                                onClick={handleAddToCart}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-grow flex items-center justify-center gap-4 bg-white text-slate-950 font-black rounded-3xl text-sm uppercase tracking-widest shadow-2xl shadow-white/5 hover:bg-slate-100 transition-all overflow-hidden relative group/atc border border-white/20"
                             >
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/atc:opacity-100 transition-opacity" />
                                <ShoppingCart size={22} strokeWidth={3} />
                                ADD TO SHOPPING BAG
                             </motion.button>
                             
                             <button className="h-20 w-20 flex items-center justify-center bg-slate-900 border border-white/5 rounded-3xl text-slate-400 hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 transition-all group group-active:scale-90">
                                <Heart size={24} className="group-hover:scale-110 group-active:fill-red-500 transition-all" />
                             </button>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-10 border-t border-white/5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                        <Share2 size={18} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">SHARE PRODUCT LINK ON SOCIAL</span>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Recently Viewed / Related Placeholder */}
        <div className="mt-40">
            <div className="flex items-center justify-between mb-16">
                <h3 className="text-3xl font-black uppercase tracking-widest text-white italic">Curated Recommendations</h3>
                <div className="flex gap-4">
                    <div className="h-14 w-14 rounded-full border border-slate-800 flex items-center justify-center text-slate-500 opacity-20"><ChevronLeft size={24} /></div>
                    <div className="h-14 w-14 rounded-full border border-slate-800 flex items-center justify-center text-slate-500"><ChevronLeft size={24} className="rotate-180" /></div>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                {[1,2,3,4].map(n => (
                    <div key={n} className="h-96 rounded-[40px] bg-slate-900/50 border border-white/5 animate-pulse-slow overflow-hidden">
                        <div className="h-2/3 bg-slate-900 m-4 rounded-[32px] opacity-40 shadow-inner" />
                        <div className="px-6 space-y-4">
                            <div className="h-4 w-2/3 bg-slate-800 rounded-full" />
                            <div className="h-4 w-1/3 bg-slate-800 rounded-full opacity-50" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}
