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
    dispatch(addToCart(product));
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
    <Hover3DCard className="group h-full w-full rounded-2xl bg-card p-3 shadow-sm ring-1 ring-border transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
      <Link href={`/store/products/${product.id}`} className="flex h-full flex-col gap-4">
        {/* Image Container with depth style */}
        <div 
          className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100"
          style={{ transform: 'translateZ(30px)' }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-black">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between" style={{ transform: 'translateZ(20px)' }}>
          <div>
            <p className="text-xs font-semibold text-primary">{product.category}</p>
            <h3 className="line-clamp-2 mt-1 text-sm font-semibold text-foreground sm:text-base">
              {product.name}
            </h3>
            <p className="mt-2 text-lg font-bold tracking-tight text-foreground">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
          </div>

          <Button 
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="mt-4 w-full gap-2 rounded-xl"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Bag
          </Button>
        </div>
      </Link>
    </Hover3DCard>
  );
}
