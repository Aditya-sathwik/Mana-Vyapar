'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Image from 'next/image';
import { placeOrder } from '@/redux/slices/orderSlice';
import { clearCart } from '@/redux/slices/cartSlice';
import { Button } from '@/components/storefront/ui/Button';
import { Input } from '@/components/storefront/ui/Input';
import { FadeIn, SlideUp } from '@/components/storefront/ui/MotionComponents';
import { CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function StoreCheckout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    zip: '',
  });

  if (items.length === 0 && !success) {
    router.push('/store/cart');
    return null;
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      dispatch(placeOrder({
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString(),
        totalAmount: totalAmount + (totalAmount > 999 ? 0 : 99) + Math.floor(totalAmount * 0.18),
        status: 'Processing',
        items: [...items],
      }));
      dispatch(clearCart());
      toast.success('Order placed successfully!');
    }, 1500);
  };

  if (success) {
    return (
      <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 text-center">
        <motion.div
           initial={{ scale: 0, rotate: -45 }}
           animate={{ scale: 1, rotate: 0 }}
           transition={{ type: 'spring', bounce: 0.5 }}
           className="mb-8 rounded-full bg-emerald-100 p-6 text-emerald-600 shadow-2xl shadow-emerald-500/20"
        >
          <CheckCircle2 className="h-16 w-16" />
        </motion.div>
        
        <SlideUp delay={0.2}>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Order Confirmed!</h1>
          <p className="mt-4 max-w-sm text-lg text-muted-foreground mx-auto">
            Thank you for shopping with Mana Store. Your premium items will be carefully packed and shipped shortly.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
            <Button size="lg" onClick={() => router.push('/store/orders')} className="w-full sm:w-auto shadow-xl">
              Track Order
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/store')} className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </div>
        </SlideUp>
      </div>
    );
  }

  const subtotal = totalAmount;
  const shipping = totalAmount > 999 ? 0 : 99;
  const tax = Math.floor(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SlideUp className="mb-12 border-b border-border pb-6 flex items-center justify-between">
         <div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Checkout</h1>
            <p className="mt-2 text-muted-foreground flex items-center gap-2">
               <Lock className="h-4 w-4 text-primary" /> Secure encrypted payment processing
            </p>
         </div>
      </SlideUp>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <FadeIn>
            <form onSubmit={handlePlaceOrder} className="space-y-8 bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
               <div className="space-y-6">
                  <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
                     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">1</span>
                     Shipping Details
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Full Name</label>
                        <Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Phone Number</label>
                        <Input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 9876543210" />
                     </div>
                     <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium text-foreground">Street Address</label>
                        <Input required value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="123 Main St, Apartment 4B" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">City</label>
                        <Input required value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="Mumbai" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">ZIP Code</label>
                        <Input required value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} placeholder="400001" />
                     </div>
                  </div>
               </div>

               <div className="border-t border-border pt-8 space-y-6">
                  <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
                     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">2</span>
                     Payment Method
                  </h2>
                  <div className="rounded-2xl border border-border p-4 bg-muted/50 cursor-pointer ring-1 ring-primary relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full pointer-events-none" />
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="h-4 w-4 rounded-full border-[5px] border-primary" />
                           <span className="font-semibold text-foreground">Cash on Delivery (COD)</span>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                     </div>
                     <p className="mt-2 text-sm text-muted-foreground ml-7">Pay with cash upon delivery. Safe and secure.</p>
                  </div>
               </div>
               
               <Button type="submit" size="lg" className="w-full relative overflow-hidden group h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/25 mt-8" disabled={loading}>
                  <AnimatePresence>
                    {loading && (
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
                     {loading ? 'Processing Securely...' : `Place Order • ₹${total.toLocaleString('en-IN')}`}
                     {!loading && <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /> }
                  </span>
               </Button>
            </form>
          </FadeIn>
        </div>

        <div className="lg:col-span-2">
          <SlideUp delay={0.2} className="rounded-3xl border border-border bg-card p-6 shadow-xl sticky top-32">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Order Summary</h2>
            
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6 overscroll-contain">
               {items.map(item => (
                  <div key={item.id} className="flex gap-4 items-start">
                     <div className="relative h-16 w-16 shrink-0 rounded-xl bg-muted overflow-hidden border border-border">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground line-clamp-2">{item.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                     </div>
                     <p className="text-sm font-bold text-foreground">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
               ))}
            </div>

            <div className="space-y-3 text-sm font-medium text-muted-foreground border-t border-border pt-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-foreground">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-500 font-semibold">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (Estimated)</span>
                <span className="text-foreground">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="my-4 border-t border-border pt-4 flex justify-between items-center text-xl font-bold text-foreground">
                <span>Total</span>
                <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </SlideUp>
        </div>
      </div>
    </div>
  );
}
