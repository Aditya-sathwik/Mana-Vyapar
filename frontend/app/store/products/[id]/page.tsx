'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchProductsByStoreSlug } from '@/redux/slices/productSlice';
import { addToCart } from '@/redux/slices/cartSlice';
import { Button } from '@/components/storefront/ui/Button';
import { SlideUp, FadeIn } from '@/components/storefront/ui/MotionComponents';
import { Hover3DCard } from '@/components/storefront/ui/Hover3DCard';
import { ShoppingCart, Star, ShieldCheck, Truck, ArrowLeft, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProductsByStoreSlug("mana-store"));
    }
  }, [status, dispatch]);

  const product = items.find((p) => p._id === unwrappedParams.id);

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl animate-pulse">
        <div className="h-4 w-24 bg-muted rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-muted rounded-3xl"></div>
          <div className="space-y-6 pt-8">
            <div className="h-8 w-2/3 bg-muted rounded"></div>
            <div className="h-6 w-1/4 bg-muted rounded"></div>
            <div className="h-24 w-full bg-muted rounded"></div>
            <div className="h-14 w-full bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-display font-bold">Product Not Found</h1>
        <Link href="/store/products">
          <Button className="mt-8">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    setAdding(true);
    dispatch(addToCart({ 
      id: product._id, 
      name: product.name, 
      price: product.price, 
      image: product.images?.[0] || '',
      quantity 
    }));
    
    setTimeout(() => {
      setAdding(false);
      toast.success(`${quantity}x ${product.name} added to cart!`, {
        icon: '🛍️',
        style: {
          borderRadius: '16px',
          background: '#09090b',
          color: '#fff',
        },
      });
    }, 600); // Simulate network & animation wait
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <SlideUp duration={0.4} className="mb-8">
        <Link href="/store/products" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Link>
      </SlideUp>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16 items-start">
        {/* Gallery */}
        <SlideUp duration={0.6} className="relative md:sticky md:top-32 z-10">

          <Hover3DCard className="aspect-square w-full overflow-hidden rounded-3xl bg-card shadow-lg ring-1 ring-border p-4">
            <div className="relative h-full w-full rounded-2xl overflow-hidden bg-muted" style={{ transform: 'translateZ(40px)' }}>
              <Image
                src={product.images?.[0] || ''}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Hover3DCard>
        </SlideUp>

        {/* Info */}
        <FadeIn delay={0.2} duration={0.8} className="flex flex-col gap-8 py-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                <span className="text-[10px] font-black text-primary tracking-widest uppercase">{product.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex text-amber-500"><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current text-muted" /></span>
                <span className="text-sm text-muted-foreground font-medium">(128 Reviews)</span>
              </div>
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl border-b border-border pb-6">{product.name}</h1>
            <div className="mt-6 flex items-end gap-4">
              <p className="font-display text-4xl font-extrabold text-foreground">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
              <p className="text-lg text-muted-foreground line-through mb-1">
                ₹{(product.price * 1.4).toLocaleString('en-IN')}
              </p>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 mb-2">Save 40%</span>
            </div>
          </div>

          <div className="text-base text-muted-foreground leading-relaxed">
            {product.description} Built with meticulous attention to detail, maintaining the premium standard of Mana Vyapar merchants. Ensure you act fast, stock is heavily limited.
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-foreground">Quantity</span>
              <div className="flex items-center rounded-xl border border-input bg-background">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="w-12 text-center text-sm font-semibold text-foreground">{quantity}</div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full relative overflow-hidden group h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/25"
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || adding}
            >
              <AnimatePresence>
                {adding && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 10, opacity: 0.2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-white rounded-full place-self-center pointer-events-none"
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <ShoppingCart className={`h-5 w-5 transition-transform duration-300 ${adding ? 'scale-125' : ''}`} />
                {adding ? 'Adding...' : 'Add to Bag'}
              </span>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 border-t border-border pt-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Free Shipping</p>
                <p className="text-xs text-muted-foreground">Arrives in 3-5 days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Secure Checkout</p>
                <p className="text-xs text-muted-foreground">Powered by Stripe</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
