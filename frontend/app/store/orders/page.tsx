'use client';

import { useAppSelector } from '@/redux/hooks';
import { SlideUp, FadeIn } from '@/components/storefront/ui/MotionComponents';
import { Package, Truck, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/storefront/ui/Button';

const STATUS_ICONS = {
  Pending: <Clock className="h-5 w-5 text-amber-500" />,
  Processing: <Package className="h-5 w-5 text-blue-500" />,
  Shipped: <Truck className="h-5 w-5 text-purple-500" />,
  Delivered: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  Cancelled: <CheckCircle2 className="h-5 w-5 text-red-500" />,
};

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
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <SlideUp className="mb-12 border-b border-border pb-6">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Your Orders</h1>
        <p className="mt-2 text-muted-foreground">Track and manage your recent purchases</p>
      </SlideUp>

      <div className="space-y-6">
        {orders.map((order, idx) => (
          <FadeIn key={order.id} delay={idx * 0.1}>
             <div className="flex flex-col sm:flex-row rounded-3xl border border-border bg-card p-6 shadow-sm ring-1 ring-border/50 hover:shadow-md transition-shadow">
               <div className="flex-1 space-y-4">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {STATUS_ICONS[order.status]}
                     </div>
                     <div>
                       <h3 className="font-display text-lg font-bold text-foreground">Order #{order.id}</h3>
                       <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()} • {order.items.length} items</p>
                     </div>
                   </div>
                   <div className="hidden text-right sm:block">
                     <p className="text-sm font-semibold text-foreground">Status</p>
                     <p className="text-sm text-muted-foreground">{order.status}</p>
                   </div>
                 </div>
                 
                 <div className="flex flex-wrap gap-2">
                    {order.items.slice(0, 4).map((item, i) => (
                       <div key={i} className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted overflow-hidden border border-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                       </div>
                    ))}
                    {order.items.length > 4 && (
                       <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-xs font-bold text-muted-foreground">
                         +{order.items.length - 4}
                       </div>
                    )}
                 </div>
               </div>
               
               <div className="mt-6 flex flex-row items-center justify-between border-t border-border pt-6 sm:mt-0 sm:ml-6 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:flex-col sm:items-end">
                 <div className="text-left sm:text-right">
                    <p className="text-sm font-semibold text-foreground">Total</p>
                    <p className="text-xl font-bold text-primary">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                 </div>
                 <Button variant="outline" size="sm" className="gap-2 sm:mt-auto">
                    View Details
                    <ChevronRight className="h-4 w-4" />
                 </Button>
               </div>
             </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
