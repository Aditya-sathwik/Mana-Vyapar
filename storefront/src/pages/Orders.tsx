import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import { Truck, CheckCircle2, ChevronRight, MapPin, Clock, ArrowLeft, ShieldCheck, ShoppingBag } from 'lucide-react';
import { cn } from '../utils/cn';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  items: OrderItem[];
  tracking: {
    steps: { status: string; date: string; completed: boolean }[];
    location: string;
    estDelivery: string;
  };
}

const mockOrders: Order[] = [
  {
    id: 'MV-182941-A',
    date: '2026-04-01',
    status: 'SHIPPED',
    total: 12499,
    items: [
      { name: 'HANDCRAFTED LEATHER COLLECTIVE', price: 4999, quantity: 1, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=200' },
      { name: 'PREMIUM SILK TEXTURE SERIES', price: 7500, quantity: 1, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200' },
    ],
    tracking: {
      steps: [
        { status: 'Order Confirmed', date: 'April 01, 10:20 AM', completed: true },
        { status: 'Shipped from Merchant', date: 'April 02, 02:45 PM', completed: true },
        { status: 'In Transit', date: 'April 03, 08:30 AM', completed: true },
        { status: 'Out for Delivery', date: 'TBD', completed: false },
        { status: 'Delivered', date: 'TBD', completed: false },
      ],
      location: 'MUMBAI LOGISTICS HUB',
      estDelivery: 'APRIL 05, 2026',
    }
  },
  {
    id: 'MV-182935-Z',
    date: '2026-03-25',
    status: 'DELIVERED',
    total: 3500,
    items: [
      { name: 'MINIMALIST CERAMIC VASE', price: 3500, quantity: 1, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=200' }
    ],
    tracking: {
      steps: [],
      location: 'HOME',
      estDelivery: 'DELIVERED ON MARCH 28',
    }
  }
];

const Orders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (selectedOrder) {
    return (
      <MainLayout>
        <div className="pt-32 pb-32 px-6 md:px-12 bg-sf-background min-h-screen">
          <div className="max-w-4xl mx-auto">
             <button 
               onClick={() => setSelectedOrder(null)}
               className="mb-12 flex items-center gap-4 text-sf-text opacity-60 hover:opacity-100 transition-opacity font-black text-[10px] tracking-widest uppercase"
             >
                <ArrowLeft size={18} /> RETURN TO ORDERS
             </button>

             <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-16">
                <div className="flex flex-col">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-sf-primary/10 rounded-xl flex items-center justify-center text-sf-primary">
                         <Truck size={20} />
                      </div>
                      <span className="text-[10px] font-black tracking-widest text-sf-primary uppercase">TRACK YOUR CURATION</span>
                   </div>
                   <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                      ORDER <br /> {selectedOrder.id}.
                   </h1>
                </div>
                <div className="flex flex-col items-end">
                   <p className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase mb-1">ESTIMATED DELIVERY</p>
                   <p className="text-2xl font-black text-sf-primary tracking-tighter uppercase">{selectedOrder.tracking.estDelivery}</p>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Tracking Progress */}
                <div className="lg:col-span-2 space-y-8">
                   <div className="bg-white p-10 md:p-12 rounded-[40px] shadow-2xl border border-sf-outline/5">
                      <h3 className="text-xl font-black tracking-tight mb-12 uppercase">Tracking Status</h3>
                      <div className="relative pl-8">
                         <div className="absolute top-2 left-[11px] bottom-2 w-0.5 bg-sf-outline/10" />
                         <div className="flex flex-col gap-12">
                            {selectedOrder.tracking.steps.map((step, i) => (
                               <div key={i} className="relative flex flex-col gap-1 group">
                                  <div className={cn(
                                     "absolute -left-10 top-1 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center z-10",
                                     step.completed ? "bg-sf-primary border-sf-primary text-white shadow-lg shadow-sf-primary/25" : "bg-white border-sf-outline/20"
                                  )}>
                                     {step.completed && <CheckCircle2 size={14} />}
                                  </div>
                                  <p className={cn(
                                     "text-[10px] font-black tracking-widest uppercase transition-colors",
                                     step.completed ? "text-sf-text" : "text-sf-text-muted opacity-40"
                                  )}>{step.status}</p>
                                  <p className="text-[9px] font-bold text-sf-text-muted opacity-60 uppercase">{step.date}</p>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Logistics Summary */}
                   <div className="grid grid-cols-2 gap-8">
                      <div className="bg-sf-surface rounded-3xl p-8 border border-sf-outline/10">
                         <div className="flex items-center gap-4 mb-4">
                            <MapPin size={18} className="text-sf-primary opacity-60" />
                            <span className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase">Last Location</span>
                         </div>
                         <p className="text-[10px] font-black tracking-widest text-sf-text uppercase">{selectedOrder.tracking.location}</p>
                      </div>
                      <div className="bg-sf-surface rounded-3xl p-8 border border-sf-outline/10">
                         <div className="flex items-center gap-4 mb-4">
                            <Clock size={18} className="text-sf-primary opacity-60" />
                            <span className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase">Updates</span>
                         </div>
                         <p className="text-[10px] font-black tracking-widest text-sf-text uppercase">REALTIME TRACKING ENABLED</p>
                      </div>
                   </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                   <div className="bg-sf-surface rounded-3xl p-10 border border-sf-outline/10 shadow-sm">
                      <h3 className="text-xl font-black tracking-tight mb-8 uppercase">Order Archive</h3>
                      <div className="space-y-6 mb-12">
                         {selectedOrder.items.map((item, i) => (
                            <div key={i} className="flex gap-4">
                               <div className="w-16 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-sf-outline/5">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                               </div>
                               <div className="flex flex-col justify-between py-1">
                                  <p className="text-[9px] font-black text-sf-text leading-tight line-clamp-2 uppercase">{item.name}</p>
                                  <p className="text-[8px] font-bold text-sf-text-muted opacity-60 uppercase">QTY {item.quantity} • ₹{item.price.toLocaleString()}</p>
                               </div>
                            </div>
                         ))}
                      </div>
                      <div className="h-px bg-sf-outline/10 mb-8" />
                      <div className="flex justify-between items-baseline mb-8">
                         <span className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase">TOTAL PAID</span>
                         <span className="text-3xl font-black text-sf-text tracking-tighter font-mono">₹{selectedOrder.total.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-4 opacity-40">
                         <ShieldCheck size={18} />
                         <span className="text-[8px] font-black tracking-widest uppercase">FULLY INSURED DELIVERY</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pt-32 pb-32 px-6 md:px-12 bg-sf-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24 relative">
             <div className="absolute top-0 -left-12 w-32 h-32 bg-sf-primary/5 rounded-full blur-3xl pointer-events-none" />
             
             <div className="flex flex-col">
                <span className="text-sf-primary text-[10px] font-black tracking-[0.3em] uppercase mb-4">Curation History</span>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-sf-text leading-[0.8]">
                   MY <br /> ORDERS.
                </h1>
             </div>
             <p className="text-sf-text-muted text-lg max-w-sm leading-relaxed pb-2">
                An archive of your premium acquisitions. Monitor progress or re-request historical curations.
             </p>
          </div>

          <div className="space-y-8">
             {mockOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 text-center opacity-40">
                   <ShoppingBag size={64} strokeWidth={1} className="mb-6" />
                   <p className="text-[10px] font-black tracking-widest uppercase">NO ARCHIVED ORDERS FOUND</p>
                </div>
             ) : (
                mockOrders.map((order) => (
                   <motion.div 
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      onClick={() => setSelectedOrder(order)}
                      className="group bg-white p-8 md:p-12 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-sf-outline/5 cursor-pointer relative overflow-hidden"
                   >
                       {/* Background highlight */}
                       <div className="absolute inset-0 bg-sf-primary/0 group-hover:bg-sf-primary/2 transition-colors duration-500 pointer-events-none" />
                       
                       <div className="flex flex-col md:flex-row justify-between gap-12 relative z-10">
                          <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase mb-4">ORDER ID</span>
                                <h3 className="text-xl font-black tracking-tight text-sf-text group-hover:text-sf-primary transition-colors">{order.id}</h3>
                                <p className="text-[10px] font-bold text-sf-text-muted opacity-60 uppercase">{new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                             </div>

                             <div className="flex flex-col">
                                <span className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase mb-4">STATUS</span>
                                <div className="flex items-center gap-3">
                                   <div className={cn(
                                      "w-2 h-2 rounded-full",
                                      order.status === 'DELIVERED' ? 'bg-green-500' : order.status === 'SHIPPED' ? 'bg-sf-primary animate-pulse' : 'bg-sf-outline'
                                   )} />
                                   <span className="text-[10px] font-black tracking-widest uppercase">{order.status}</span>
                                </div>
                             </div>

                             <div className="flex flex-col">
                                <span className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase mb-4">TOTAL</span>
                                <p className="text-xl font-black tracking-tighter text-sf-text font-mono">₹{order.total.toLocaleString()}</p>
                             </div>
                          </div>

                          <div className="flex items-center gap-6 mt-auto md:mt-0">
                             <div className="flex -space-x-4">
                                {order.items.slice(0, 3).map((item, i) => (
                                   <div key={i} className="w-16 h-16 rounded-2xl border-4 border-white bg-sf-surface-low overflow-hidden shadow-xl">
                                      <img src={item.image} alt="item" className="w-full h-full object-cover" />
                                   </div>
                                ))}
                                {order.items.length > 3 && (
                                   <div className="w-16 h-16 rounded-2xl border-4 border-white bg-sf-surface-high flex items-center justify-center shadow-xl">
                                      <span className="text-[10px] font-black">+{order.items.length - 3}</span>
                                   </div>
                                )}
                             </div>
                             <div className="w-12 h-12 bg-sf-surface-low rounded-2xl flex items-center justify-center text-sf-text opacity-40 group-hover:opacity-100 group-hover:bg-sf-primary group-hover:text-white transition-all transform group-hover:scale-110">
                                <ChevronRight size={24} />
                             </div>
                          </div>
                       </div>
                   </motion.div>
                ))
             )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Orders;
