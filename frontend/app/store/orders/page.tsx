'use client';

import { useAppSelector } from '@/redux/hooks';
import { SlideUp, FadeIn } from '@/components/storefront/ui/MotionComponents';
import { Package, Truck, CheckCircle2, Clock, ChevronRight, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/storefront/ui/Button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const STATUS_CONFIG = {
  Pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', step: 1 },
  Processing: { icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10', step: 2 },
  Shipped: { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-500/10', step: 3 },
  Delivered: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', step: 4 },
  Cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', step: 0 },
};

function OrderStatusTracker({ status }: { status: string }) {
  const currentStep = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.step || 0;
  if (currentStep === 0) return null;

  const steps = [
    { label: 'Confirmed', icon: CheckCircle2 },
    { label: 'Processing', icon: Package },
    { label: 'Shipped', icon: Truck },
    { label: 'Arriving', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-border" />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary shadow-[0_0_10px_rgba(5,148,103,1)]"
        />

        {steps.map((step, idx) => {
          const isActive = idx + 1 <= currentStep;
          const isCurrent = idx + 1 === currentStep;
          const Icon = step.icon;

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isActive ? 'var(--primary)' : 'var(--card)',
                  borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-500",
                  isActive ? "text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground shadow-sm"
                )}
              >
                <Icon className="h-4 w-4" />
              </motion.div>
              <span className={cn(
                "absolute -bottom-6 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function StoreOrders() {
  const { orders } = useAppSelector((state) => state.orders);

  if (orders.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
        <div className="mb-6 rounded-full bg-primary/10 p-6">
          <Package className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">No Orders Yet</h1>
        <p className="mt-4 max-w-sm text-lg text-muted-foreground">
          When you place an order, it will appear here so you can track its status.
        </p>
        <Link href="/store/products">
          <Button size="lg" className="mt-8 shadow-xl shadow-primary/20">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-16">
      <SlideUp className="mb-12 border-b border-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="font-display text-4xl font-extrabold tracking-tighter text-foreground sm:text-6xl uppercase italic">Order <span className="text-primary not-italic">History</span></h1>
           <p className="mt-4 text-muted-foreground font-medium flex items-center gap-2">
             <Package className="h-4 w-4 text-primary" /> Track and manage your premium purchases
           </p>
        </div>
        <div className="flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-2xl border border-border/50">
           <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Orders:</span>
           <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-black">{orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length}</span>
        </div>
      </SlideUp>

      <div className="space-y-12">
        {orders.map((order, idx) => {
          const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.Pending;
          const StatusIcon = config.icon;

          return (
            <FadeIn key={order.id} delay={idx * 0.1}>
               <div className="flex flex-col rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-xl shadow-primary/5 ring-1 ring-border/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                  {/* Card Header */}
                  <div className="px-6 py-4 bg-muted/30 border-b border-border/50 flex flex-wrap items-center justify-between gap-4">
                     <div className="flex items-center gap-4">
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Order ID: <span className="text-foreground">{order.id}</span></div>
                        <div className="h-1 w-1 rounded-full bg-border" />
                        <div className="text-xs font-bold text-muted-foreground">{new Date(order.date).toLocaleDateString()}</div>
                     </div>
                     <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2", config.bg, config.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {order.status}
                     </div>
                  </div>

                  <div className="p-6 sm:p-10 flex flex-col lg:flex-row gap-10">
                     <div className="flex-1 space-y-10">
                        {/* Live Tracker */}
                        <div className="px-2">
                          <OrderStatusTracker status={order.status} />
                        </div>

                        {/* Items Preview */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           <div className="space-y-4">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Package Items</h4>
                              <div className="flex flex-wrap gap-3">
                                 {order.items.map((item, i) => (
                                    <div key={i} className="group relative h-20 w-20 flex items-center justify-center rounded-2xl bg-muted overflow-hidden border border-border hover:border-primary transition-all shadow-sm">
                                       {/* eslint-disable-next-line @next/next/no-img-element */}
                                       <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                          <span className="text-[10px] font-bold text-white">Qty: {item.quantity}</span>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div className="space-y-4 lg:pl-6 lg:border-l border-border/50">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Order Summary</h4>
                              <div className="space-y-2">
                                 <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Item Cost</span>
                                    <span className="font-bold text-foreground">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                                 </div>
                                 <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping Status</span>
                                    <span className="text-primary font-bold">{order.totalAmount > 999 ? 'Free Delivery' : 'Standard Shipping'}</span>
                                 </div>
                                 <div className="pt-2 mt-2 border-t border-border/50 flex justify-between items-end">
                                    <span className="text-xs font-bold text-muted-foreground italic">Grand Total Paid</span>
                                    <span className="text-2xl font-black text-foreground tracking-tighter">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex flex-col gap-3 justify-center min-w-[200px]">
                        <Button className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/10 group">
                           Tracking Details
                           <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest gap-2 border-border/50 hover:bg-muted transition-colors">
                           Need Help?
                        </Button>
                     </div>
                  </div>
               </div>
            </FadeIn>
          );
        })}
      </div>

      <div className="mt-20 p-10 rounded-[2.5rem] bg-muted/30 border border-border/50 text-center space-y-4">
         <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
            <Clock className="h-6 w-6 text-primary" />
         </div>
         <h3 className="text-xl font-bold text-foreground uppercase italic tracking-tighter">Fast <span className="text-primary not-italic">Support</span></h3>
         <p className="text-sm text-muted-foreground max-w-md mx-auto font-medium">
           Our merchant team usually ships orders within 24-48 hours. If you haven't received an update, please use the button above to contact support.
         </p>
      </div>
    </div>
  );
}
