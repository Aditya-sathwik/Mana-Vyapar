'use client';

import { useStorefrontSelector, useStorefrontDispatch } from '@/redux/hooks';
import Image from 'next/image';
import { ShoppingCart, ShoppingBag, Trash2, ArrowRight, Minus, Plus, ChevronLeft, CreditCard, Gift, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateQuantity, removeFromCart } from '@/redux/slices/cartSlice';
import Link from 'next/link';
import React, { use } from 'react';

export default function CartPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const dispatch = useStorefrontDispatch();
  const { items, totalAmount, totalQuantity } = useStorefrontSelector((state) => state.cart);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-40 px-6 max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 mb-16 group scale-110">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative w-full h-full bg-slate-900 border border-white/5 rounded-[60px] flex items-center justify-center p-12 active:scale-95 transition-all">
                    <ShoppingBag size={80} className="text-slate-700/50 group-hover:text-primary transition-colors duration-500 group-hover:rotate-12" />
                </div>
                <div className="absolute top-0 right-0 w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center rounded-full animate-bounce shadow-xl shadow-red-500/10">0</div>
            </div>
            <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white mb-6 leading-none">Your bag is empty</h2>
            <p className="text-xl text-slate-500 font-medium max-w-md mx-auto mb-16 leading-relaxed">Discover premium products and curator selections in our storefeed to start your shopping journey.</p>
            <Link 
                href={`/store/${slug}`}
                className="inline-flex items-center gap-6 px-12 py-6 bg-white text-slate-950 font-black rounded-[2rem] text-sm uppercase tracking-[0.2em] shadow-premium hover:scale-105 active:scale-95 transition-all group overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                EXPLORE STOREFEED
                <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
            </Link>
      </div>
    );
  }

  const shippingCost = 150;
  const taxRate = 0.05;
  const taxes = totalAmount * taxRate;
  const grandTotal = totalAmount + shippingCost + taxes;

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto overflow-visible relative">
        <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-primary/5 blur-[150px] rounded-full pointer-events-none -translate-x-1/2" />
        
        <header className="mb-20">
            <h1 className="text-7xl font-black italic uppercase tracking-tighter text-white leading-none group cursor-default">
                Checkout Bag
                <span className="block h-1 w-24 bg-primary rounded-full mt-4 group-hover:w-full transition-all duration-700 opacity-20" />
            </h1>
            <div className="flex items-center gap-6 mt-10">
                <div className="h-14 px-8 bg-slate-900 border border-slate-800 rounded-3xl flex items-center gap-4 shadow-xl shadow-black/20">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">CARRYING</span>
                    <span className="text-lg font-black text-white italic">{totalQuantity} ITEMS</span>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
            <div className="lg:col-span-8 flex flex-col gap-8">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col gap-6"
                >
                    {items.map((item) => (
                        <motion.div 
                            key={item.id}
                            variants={itemVariants}
                            layout
                            className="group relative flex flex-col md:flex-row items-center gap-10 p-8 bg-slate-900/50 border border-white/5 rounded-[40px] hover:bg-slate-900 hover:border-slate-800 transition-all shadow-2xl shadow-black/20 overflow-hidden ring-1 ring-white/5"
                        >
                            <div className="absolute right-0 top-0 w-1 h-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            {/* Product Image */}
                            <Link href={`/store/${slug}/product/${item.id}`} className="relative w-40 h-40 rounded-3xl overflow-hidden shadow-premium group-hover:scale-105 transition-transform flex-shrink-0 bg-slate-950">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </Link>

                            {/* Info & Quantity */}
                            <div className="flex-grow flex flex-col gap-4">
                                <div>
                                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight truncate leading-none group-hover:text-primary transition-colors">{item.name}</h3>
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">ID: {item.id.slice(-8)}</p>
                                </div>
                                
                                <div className="flex items-center bg-slate-950/80 border border-white/10 rounded-2xl p-1.5 w-fit h-14 group-hover:border-slate-800 transition-colors shadow-inner ring-1 ring-white/5">
                                    <button 
                                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                        className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-slate-800 text-slate-500 hover:text-white transition-all active:scale-90"
                                    >
                                        <Minus size={18} strokeWidth={3} />
                                    </button>
                                    <span className="text-lg font-black w-12 text-center text-white italic">{item.quantity}</span>
                                    <button 
                                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                        className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-slate-800 text-slate-500 hover:text-white transition-all active:scale-90"
                                    >
                                        <Plus size={18} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>

                            {/* Price & Action */}
                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-10 md:gap-4 md:pl-10 md:border-l border-white/5">
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Subtotal</p>
                                    <span className="text-3xl font-black italic" style={{ color: 'var(--primary, #6366f1)' }}>₹{item.price * item.quantity}</span>
                                </div>
                                <button 
                                    onClick={() => dispatch(removeFromCart(item.id))}
                                    className="p-4 bg-slate-950 border border-white/5 rounded-2xl text-slate-600 hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 transition-all shadow-xl shadow-black/20 group-hover:scale-105 active:scale-90"
                                >
                                    <Trash2 size={24} strokeWidth={3} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Bag Summary */}
            <div className="lg:col-span-4 sticky top-32">
                <div className="group relative bg-slate-900 border border-white/5 rounded-[48px] p-10 overflow-hidden shadow-premium shadow-black/60 ring-1 ring-white/5 cursor-default hover:bg-slate-900 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <h3 className="text-3xl font-black italic uppercase tracking-widest text-white mb-10 border-b border-white/5 pb-8 flex items-center gap-4">
                        <ShoppingCart size={28} className="text-primary group-hover:rotate-12 transition-transform" />
                        Bag Summary
                    </h3>
                    
                    <div className="flex flex-col gap-8 mb-12">
                        <div className="flex justify-between items-center group/row">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover/row:text-slate-300 transition-colors">Basket Total</span>
                            <span className="text-xl font-bold text-white tracking-tight">₹{totalAmount}</span>
                        </div>
                        <div className="flex justify-between items-center group/row">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover/row:text-slate-300 transition-colors">Estimated Delivery</span>
                                <div className="p-1 px-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black italic rounded-full uppercase tracking-widest shadow-xl shadow-blue-500/5 animate-pulse">LITE Express</div>
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">₹{shippingCost}</span>
                        </div>
                        <div className="flex justify-between items-center group/row">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover/row:text-slate-300 transition-colors">Platform Tax (5%)</span>
                            <span className="text-xl font-bold text-white tracking-tight">₹{taxes.toFixed(0)}</span>
                        </div>
                        <div className="h-px bg-white/5 my-2" />
                        <div className="flex justify-between items-center group/row">
                            <span className="text-lg font-black uppercase tracking-[0.2em] text-white italic group-hover/row:translate-x-2 transition-transform">Total Due</span>
                            <span className="text-5xl font-black italic tracking-tighter" style={{ color: 'var(--primary, #6366f1)' }}>₹{grandTotal.toFixed(0)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Link 
                            href={`/store/${slug}/checkout`}
                            className="flex items-center justify-center gap-5 w-full py-7 bg-white text-slate-950 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-white/5 hover:scale-105 active:scale-95 transition-all group/btn overflow-hidden relative border border-white/20"
                        >
                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            SECURE CHECKOUT
                            <ArrowRight size={22} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-3 py-6 bg-slate-950 border border-white/5 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:border-slate-800 transition-all group overflow-hidden active:scale-95 shadow-xl shadow-black/20">
                                <Gift size={16} className="group-hover:scale-110 transition-transform" />
                                Promo Code
                            </button>
                            <button className="flex items-center justify-center gap-3 py-6 bg-slate-950 border border-white/5 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:border-slate-800 transition-all group overflow-hidden active:scale-95 shadow-xl shadow-black/20">
                                <CreditCard size={16} className="group-hover:scale-110 transition-transform" />
                                Methods
                            </button>
                        </div>
                    </div>

                    <div className="mt-12 flex items-center gap-4 p-5 bg-black/40 border border-white/5 rounded-[32px] group/alert shadow-inner relative overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-500/50 group-hover/alert:bg-emerald-500 transition-colors" />
                        <ShieldAlert size={20} className="text-emerald-500 group-hover/alert:scale-110 transition-transform" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/alert:text-slate-300 transition-colors leading-relaxed">Secured with 256-bit bank grade encryption. <br />Your data resides in Indian Retail Heartland.</p>
                    </div>
                </div>

                <Link href={`/store/${slug}`} className="mt-12 group flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-slate-300 transition-all">
                    <ChevronLeft size={18} className="group-hover:-translate-x-2 transition-transform" />
                    Continue Shopping
                </Link>
            </div>
        </div>
    </div>
  );
}
