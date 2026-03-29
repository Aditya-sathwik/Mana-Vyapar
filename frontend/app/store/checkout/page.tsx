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
import { cn } from '@/lib/utils';

export default function StoreCheckout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'upi'
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
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-16">
      <SlideUp className="mb-12 border-b border-border pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h1 className="font-display text-4xl font-extrabold tracking-tighter text-foreground sm:text-6xl uppercase italic">Secure <span className="text-primary not-italic">Checkout</span></h1>
            <p className="mt-3 text-muted-foreground flex items-center gap-2 font-medium">
               <Lock className="h-4 w-4 text-primary" /> Secure encrypted payment powered by Mana Vyapar
            </p>
         </div>

         {/* Step Indicator */}
         <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-2xl border border-border/50">
            {[1, 2, 3].map((s) => (
               <div key={s} className="flex items-center gap-2">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-md",
                    step === s ? "bg-primary text-primary-foreground scale-110 shadow-primary/20" : 
                    step > s ? "bg-emerald-500 text-emerald-50 shadow-emerald-500/20" : "bg-card text-muted-foreground border border-border"
                  )}>
                     {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                  </div>
                  {s < 3 && <div className={cn("h-0.5 w-6 rounded-full", step > s ? "bg-emerald-500" : "bg-border")} />}
               </div>
            ))}
         </div>
      </SlideUp>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8 bg-card p-6 sm:p-10 rounded-[2.5rem] border border-border shadow-xl shadow-primary/5"
              >
                <div className="space-y-6">
                   <h2 className="font-display text-2xl font-bold text-foreground">Delivery Details</h2>
                   <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                         <Input required className="h-12 rounded-xl bg-muted/30" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Receivers Name" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                         <Input required type="tel" className="h-12 rounded-xl bg-muted/30" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 00000 00000" />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Shipping Address</label>
                         <Input required className="h-12 rounded-xl bg-muted/30" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="House No, Building, Area" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">City</label>
                         <Input required className="h-12 rounded-xl bg-muted/30" value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="Mumbai" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">ZIP Code</label>
                         <Input required className="h-12 rounded-xl bg-muted/30" value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} placeholder="400001" />
                      </div>
                   </div>
                </div>
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!form.name || !form.phone || !form.address}
                  className="w-full h-14 rounded-2xl text-md font-bold uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 mt-4"
                >
                   Continue to Payment
                   <ChevronRight className="h-5 w-5" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8 bg-card p-6 sm:p-10 rounded-[2.5rem] border border-border shadow-xl shadow-primary/5"
              >
                <div className="space-y-6">
                   <h2 className="font-display text-2xl font-bold text-foreground">Choose Payment</h2>
                   
                   <div className="grid gap-4">
                      {/* COD */}
                      <div 
                        onClick={() => setPaymentMethod('cod')}
                        className={cn(
                          "rounded-2xl border p-5 cursor-pointer transition-all duration-300 relative overflow-hidden",
                          paymentMethod === 'cod' ? "bg-primary/5 border-primary ring-1 ring-primary" : "border-border hover:bg-muted"
                        )}
                      >
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className={cn("h-5 w-5 rounded-full border-2", paymentMethod === 'cod' ? "border-primary bg-primary shadow-[0_0_10px_rgba(5,148,103,1)]" : "border-muted-foreground")}>
                                  {paymentMethod === 'cod' && <div className="h-full w-full rounded-full border-2 border-background" />}
                               </div>
                               <div>
                                  <span className="font-bold text-foreground text-lg">Cash on Delivery</span>
                                  <p className="text-sm text-muted-foreground">Pay when your order arrives at your door.</p>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* UPI */}
                      <div 
                        onClick={() => setPaymentMethod('upi')}
                        className={cn(
                          "rounded-2xl border p-5 cursor-pointer transition-all duration-300 relative overflow-hidden",
                          paymentMethod === 'upi' ? "bg-primary/5 border-primary ring-1 ring-primary" : "border-border hover:bg-muted"
                        )}
                      >
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className={cn("h-5 w-5 rounded-full border-2", paymentMethod === 'upi' ? "border-primary bg-primary shadow-[0_0_10px_rgba(5,148,103,1)]" : "border-muted-foreground")}>
                                  {paymentMethod === 'upi' && <div className="h-full w-full rounded-full border-2 border-background" />}
                               </div>
                               <div>
                                  <span className="font-bold text-foreground text-lg">UPI / QR Scan</span>
                                  <p className="text-sm text-muted-foreground">Fast & Secure digital payment via PhonePe, GPay, etc.</p>
                               </div>
                            </div>
                         </div>
                         {paymentMethod === 'upi' && (
                           <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-primary/20 ml-9">
                              <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-4">
                                 <div className="h-20 w-20 bg-card rounded-lg border border-border flex items-center justify-center shrink-0">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground text-center">QR Code<br/>Loading...</span>
                                 </div>
                                 <p className="text-xs font-medium text-muted-foreground italic leading-relaxed">
                                   Scan QR code after placing order to complete payment securely.
                                 </p>
                              </div>
                           </motion.div>
                         )}
                      </div>
                   </div>
                </div>

                <div className="flex gap-4">
                   <Button variant="outline" onClick={() => setStep(1)} className="h-14 rounded-2xl flex-1 font-bold uppercase tracking-widest">Back</Button>
                   <Button onClick={() => setStep(3)} className="h-14 rounded-2xl flex-[2] font-bold uppercase tracking-widest gap-2 shadow-xl shadow-primary/20">
                     Review Order
                     <ChevronRight className="h-5 w-5" />
                   </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8 bg-card p-6 sm:p-10 rounded-[2.5rem] border border-border shadow-xl shadow-primary/5"
              >
                <div className="space-y-8">
                   <div className="flex items-center justify-between">
                      <h2 className="font-display text-2xl font-bold text-foreground">Final Review</h2>
                      <button onClick={() => setStep(1)} className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">Edit Info</button>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-muted/30 p-6 rounded-3xl border border-border/50">
                      <div>
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Shipping To</h4>
                         <p className="font-bold text-foreground">{form.name}</p>
                         <p className="text-sm text-muted-foreground mt-1">{form.address}</p>
                         <p className="text-sm text-muted-foreground">{form.city}, {form.zip}</p>
                         <p className="text-sm text-primary font-bold mt-2">{form.phone}</p>
                      </div>
                      <div>
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Payment Method</h4>
                         <div className="flex items-center gap-2">
                           <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                           <span className="font-bold text-foreground">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI Payment'}</span>
                         </div>
                         <p className="text-sm text-muted-foreground mt-1">
                           {paymentMethod === 'cod' ? 'Pay upon receipt of goods' : 'Digital verification after order'}
                         </p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Order Details ({items.length} items)</h4>
                      <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                         {items.map(item => (
                            <div key={item.id} className="flex gap-4 items-center">
                               <div className="h-12 w-12 rounded-lg bg-muted border border-border overflow-hidden relative shrink-0">
                                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                               </div>
                               <div className="flex-1">
                                  <p className="text-xs font-bold text-foreground line-clamp-1">{item.name}</p>
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Qty: {item.quantity} • ₹{item.price.toLocaleString('en-IN')}</p>
                               </div>
                               <p className="text-xs font-bold text-foreground">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                   <Button 
                     onClick={handlePlaceOrder} 
                     disabled={loading}
                     className="w-full h-16 rounded-2xl text-lg font-bold uppercase tracking-widest gap-3 shadow-2xl shadow-primary/30"
                   >
                     {loading ? (
                        <span className="flex items-center gap-3"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full" /> Confirming...</span>
                     ) : (
                        <>Place Order • ₹{total.toLocaleString('en-IN')}</>
                     )}
                   </Button>
                   <button onClick={() => setStep(2)} className="text-muted-foreground text-xs font-bold uppercase tracking-widest hover:text-foreground">Back to Payment</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Order Summary - Desktop */}
        <div className="lg:col-span-4 hidden lg:block">
           <div className="sticky top-32 space-y-6">
              <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-2xl">
                 <h3 className="font-display text-2xl font-bold text-foreground mb-6">Price Summary</h3>
                 <div className="space-y-4 text-sm font-medium">
                    <div className="flex justify-between items-center">
                       <span className="text-muted-foreground">Original Price</span>
                       <span className="text-foreground font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-muted-foreground">Shipping Fee</span>
                       <span className={cn("font-bold", shipping === 0 ? "text-emerald-500 uppercase text-[10px] tracking-widest" : "text-foreground")}>
                         {shipping === 0 ? 'Free' : `₹${shipping}`}
                       </span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-muted-foreground">GST (18%)</span>
                       <span className="text-foreground font-bold">₹{tax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between items-end pt-2">
                       <div className="flex flex-col">
                          <span className="text-lg font-bold text-foreground">Total Payable</span>
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Incl. all taxes</span>
                       </div>
                       <span className="text-3xl font-black text-primary tracking-tighter">
                         ₹{total.toLocaleString('en-IN')}
                       </span>
                    </div>
                 </div>
              </div>
              
              <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 text-center">
                 <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em]">100% Satisfaction Guaranteed</p>
                 <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">If you face any issues with your delivery, our dedicated support team is available 24/7 to assist you.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
