'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { removeFromCart, updateQuantity } from '@/redux/slices/cartSlice';
import { Button } from './Button';
import Image from 'next/image';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const dispatch = useAppDispatch();
  const { items, totalAmount } = useAppSelector((state) => state.cart);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[110] flex h-full w-full max-w-md flex-col bg-card shadow-2xl border-l border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">Shopping Bag</h2>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
                    {items.length} {items.length === 1 ? 'Item' : 'Items'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors active:scale-90"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Your bag is empty</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-[240px]">
                      Looks like you haven't added anything to your bag yet.
                    </p>
                  </div>
                  <Button onClick={onClose} variant="outline" className="mt-4 rounded-xl">
                    Start Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={item.id}
                    className="flex gap-4 group"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-muted border border-border/50">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-foreground line-clamp-1">{item.name}</h4>
                          <button 
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(0, item.quantity - 1) }))}
                            className="p-1 hover:bg-background rounded-md transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                            className="p-1 hover:bg-background rounded-md transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-foreground">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border/50 p-6 space-y-4 bg-muted/30 backdrop-blur-md">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Subtotal</span>
                    <span className="text-foreground font-bold">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Shipping</span>
                    <span className="text-primary font-bold uppercase text-[10px] tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">Calculated at checkout</span>
                  </div>
                  <div className="pt-4 flex justify-between">
                    <span className="text-lg font-bold text-foreground">Total</span>
                    <span className="text-2xl font-black text-primary tracking-tighter">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <Link href="/store/checkout" onClick={onClose} className="block">
                  <Button className="w-full h-14 rounded-2xl text-md font-bold uppercase tracking-widest gap-3 shadow-xl shadow-primary/20">
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                
                <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  Secure Checkout Powered by Mana Vyapar
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
