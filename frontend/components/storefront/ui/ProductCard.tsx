'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/redux/slices/productSlice';
import { Hover3DCard } from './Hover3DCard';
import { Button } from './Button';
import { ShoppingCart } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { addToCart } from '@/redux/slices/cartSlice';
import { toast } from 'react-hot-toast';

export function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation
    dispatch(addToCart({ 
      id: product._id, 
      name: product.name, 
      price: product.price, 
      image: product.images?.[0] || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800'
    }));
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: {
        borderRadius: '16px',
        background: '#09090b',
        color: '#fff',
      },
    });
  };

  return (
    <Hover3DCard className="group h-full w-full rounded-2xl bg-card p-4 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(78,222,163,0.15)] border border-white/5 hover:border-primary/30">
      <Link href={`/store/products/${product._id}`} className="flex h-full flex-col gap-4">
        {/* Image Container with depth style */}
        <div 
          className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-muted/20"
          style={{ transform: 'translateZ(40px)' }}
        >
          <Image
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {product.stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
              <span className="rounded-full bg-white px-4 py-1.5 text-[10px] font-black text-black uppercase tracking-[0.2em] shadow-lg">Out of Stock</span>
            </div>
          )}

          {/* Quick Add Overlay */}
          <div className="absolute bottom-4 right-4 translate-y-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
             <Button 
                onClick={handleAddToCart}
                size="icon"
                className="h-10 w-10 rounded-full bg-primary shadow-lg shadow-primary/40 hover:scale-110 active:scale-95 transition-transform"
             >
                <ShoppingCart className="h-5 w-5 text-primary-foreground" />
             </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between" style={{ transform: 'translateZ(25px)' }}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">{product.category}</p>
            <h3 className="line-clamp-2 mt-2 text-base font-bold text-foreground leading-tight tracking-tight font-display">
              {product.name}
            </h3>
            <div className="mt-3 flex items-baseline gap-2">
              <p className="text-xl font-bold tracking-tight text-foreground font-display">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
              {product.basePrice > product.price && (
                <span className="text-xs text-muted-foreground line-through opacity-50">
                  ₹{product.basePrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">In Stock</span>
             <div className="h-1 w-1 rounded-full bg-primary shadow-[0_0_8px_rgba(78,222,163,0.8)]" />
          </div>
        </div>
      </Link>
    </Hover3DCard>
  );
}
