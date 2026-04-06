'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Heart, TrendingUp, Plus } from 'lucide-react';
import { Product } from '@/redux/slices/productSlice';
import { useStorefrontDispatch } from '@/redux/hooks';
import { addToCart } from '@/redux/slices/cartSlice';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useStorefrontDispatch();
  const { name, price, images, comparePrice, discount, isTrending } = product;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      id: product._id,
      name,
      price,
      quantity: 1,
      image: images[0],
      merchantId: product.merchantId
    }));
    toast.success(`${name} added to cart!`);
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="sf-card group flex flex-col h-full !p-0"
    >
        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {discount && (
                <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-xl">
                    -{discount}%
                </span>
            )}
        </div>

        <button className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-md p-2.5 rounded-full text-white/70 hover:text-red-500 hover:bg-white transition-all active:scale-95 group/heart">
            <Heart size={16} strokeWidth={3} className='group-hover/heart:fill-red-500 transition-transform' />
        </button>

        <Link href={`./product/${product._id}`} className='relative h-[200px] w-full overflow-hidden flex-shrink-0'>
            <Image 
                src={images[0] || 'https://via.placeholder.com/400x500?text=Product'} 
                alt={name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        {/* Content Details */}
        <div className="p-6 flex flex-col flex-grow bg-[var(--sf-card)]">
            <h3 className="text-sm font-bold text-[var(--sf-text)] mb-2 line-clamp-2 min-h-[40px] leading-snug opacity-90 group-hover:opacity-100 transition-opacity">
                {name}
            </h3>

            <div className="flex items-baseline gap-3 mb-6">
                <span className="text-xl font-black text-[var(--sf-accent)] tracking-tighter">
                    ₹{price}
                </span>
                {comparePrice && comparePrice > price && (
                    <span className="text-xs text-[var(--sf-text-muted)] line-through font-bold">
                        ₹{comparePrice}
                    </span>
                )}
            </div>

            <motion.button 
                onClick={handleAddToCart}
                style={{ backgroundColor: `var(--accent, #10b981)` }}
                className="mt-auto w-full sf-btn-premium !py-3.5 !rounded-2xl text-[10px] tracking-[0.2em] font-black uppercase"
            >
                <Plus size={16} strokeWidth={3} />
                ADD TO BAG
            </motion.button>
        </div>
    </motion.div>
  );
}
