'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateQuantity, removeFromCart, clearCart } from '@/redux/slices/cartSlice';
import { Button } from '@/components/storefront/ui/Button';
import { FadeIn, SlideUp } from '@/components/storefront/ui/MotionComponents';
import { ShoppingBag, X, Minus, Plus, ArrowRight } from 'lucide-react';

export default function StoreCart() {
  const dispatch = useAppDispatch();
  const { items, totalAmount, totalQuantity } = useAppSelector((state) => state.cart);

  if (items.length === 0) {
    return (
      <FadeIn className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
        <div className="mb-6 rounded-full bg-primary/10 p-6">
          <ShoppingBag className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Your Cart is Empty</h1>
        <p className="mt-4 max-w-sm text-lg text-muted-foreground">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link href="/store/products">
          <Button size="lg" className="mt-8 shadow-xl shadow-primary/20">
            Start Shopping
          </Button>
        </Link>
      </FadeIn>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <SlideUp className="mb-12 border-b border-border pb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Shopping Bag</h1>
          <p className="mt-2 text-muted-foreground">{totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        <Button variant="ghost" className="hidden sm:flex" onClick={() => dispatch(clearCart())}>
          Clear Cart
        </Button>
      </SlideUp>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item, idx) => (
            <FadeIn key={item.id} delay={idx * 0.1} className="flex flex-col sm:flex-row gap-6 bg-card p-4 rounded-3xl border border-border shadow-sm">
              <div className="relative aspect-square w-full sm:w-32 sm:h-32 shrink-0 overflow-hidden rounded-2xl bg-muted">
                 <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground line-clamp-1">{item.name}</h3>
                    <p className="font-semibold text-primary mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <button 
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="rounded-full bg-muted p-2 text-muted-foreground hover:bg-destructive hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center rounded-xl border border-input bg-background/50">
                    <button 
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="w-10 text-center text-sm font-semibold text-foreground">{item.quantity}</div>
                    <button 
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="font-bold text-foreground">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
          <Button variant="outline" className="w-full sm:hidden" onClick={() => dispatch(clearCart())}>
            Clear Cart
          </Button>
        </div>

        {/* Order Summary */}
        <SlideUp delay={0.3} className="h-fit rounded-3xl border border-border bg-card p-6 shadow-xl sticky top-32">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Order Summary</h2>
          
          <div className="space-y-4 text-sm font-medium text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-foreground">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-emerald-500 font-semibold">{totalAmount > 999 ? 'Free' : '₹99'}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (Estimated)</span>
              <span className="text-foreground">₹{Math.floor(totalAmount * 0.18).toLocaleString('en-IN')}</span>
            </div>
            
            <div className="my-6 border-t border-border pt-4 flex justify-between items-center text-lg font-bold text-foreground">
              <span>Total</span>
              <span>₹{Math.floor(totalAmount * 1.18 + (totalAmount > 999 ? 0 : 99)).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <Link href="/store/checkout" className="block mt-8">
            <Button size="lg" className="w-full gap-2 rounded-2xl shadow-xl shadow-primary/20">
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          
          <div className="mt-6 flex justify-center gap-2">
             <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Rupay-Logo.png/1200px-Rupay-Logo.png" alt="Rupay" width={32} height={20} className="object-contain opacity-50 grayscale hover:grayscale-0 transition-all" />
             <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2000px-Visa_Inc._logo.svg.png" alt="Visa" width={32} height={20} className="object-contain opacity-50 grayscale hover:grayscale-0 transition-all" />
             <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width={32} height={20} className="object-contain opacity-50 grayscale hover:grayscale-0 transition-all" />
          </div>
        </SlideUp>
      </div>
    </div>
  );
}
